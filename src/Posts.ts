import { Categories } from "./Categories";
import { IMapImageContent } from "./MapImage";
import { DOMUtils } from "./DOMUtils";
import { Settings } from "./Settings";

// tslint:disable-next-line
const { default: html2React } = require("html2react");

interface IPostJson {
    slug: string;
    title: { rendered: string; };
    content: { rendered: string; };
}

interface IPostRawData {
    title: string;
    content: string;
}

interface IArticle {
    image: string;
    contentElem: JSX.Element;
}

interface IContribution {
    principleName: string;
    contributes: boolean;
}

interface IPrinciple {
    name: string;
    image: string;
    content: string[];
}

interface IPost {
    title: string;
    article: IArticle;
    contributions: IContribution[];
}

interface IPosts {
    map: {
        rawData: IPostRawData;
        sections?: IMapImageContent[];
    };
    principles: {
        rawData: IPostRawData;
        content?: {
            intro: IPrinciple;
            principles: IPrinciple[];
        };
    };
    posts: Array<{
        rawData: IPostRawData;
        post?: IPost;
    }>;
}

export class Posts {
    public static async load(category: string) {
        if (category in Posts.data) {
            return;
        }
        const categoryId = Categories.getId(category);
        const request = `wp-json/wp/v2/posts?categories=${categoryId}&per_page=11`;
        const response = await fetch(`${Settings.data.wordpressUrl}/${request}`);
        const json = await response.json();

        const allPosts = (json as IPostJson[])
            .map(({ slug, title, content }) => {
                const [match, index] = slug.match(/[a-z-]+-([0-9]+)/) ?? [null, null];
                const postIndex = (() => {
                    if (index !== null) {
                        return parseInt(index, 10);
                    } else if (slug.endsWith("principles")) {
                        return -1;
                    } else {
                        // Intro page
                        // tslint:disable-next-line
                        console.assert(slug === category);
                        return -2;
                    }
                })();
                return [postIndex, { title: title.rendered, content: content.rendered }] as [number, IPostRawData];
            })
            .sort((a, b) => a[0] - b[0])
            .map(([index, content]) => content);

        const [intro, principles, ...posts] = allPosts;
        Posts.data[category] = {
            map: { rawData: intro },
            principles: { rawData: principles },
            posts: posts.map(rawData => ({ rawData }))
        };
    }

    public static getSections(section: string) {
        const { rawData, sections } = Posts.data[section].map;
        if (sections) {
            return sections;
        }
        const tree = new DOMParser().parseFromString(rawData.content, "text/html");
        const newSections: IMapImageContent[] = [];
        // tslint:disable-next-line
        for (let i = 0; i < tree.body.children.length; ++i) {
            const child = tree.body.children[i];
            const imageElem = child.querySelector("div > figure > img");
            const titleElem = child.querySelector("div > div > p");
            const subtitleElem = child.querySelector("div > div > p + p");
            if (imageElem && titleElem) {
                newSections.push({
                    image: (imageElem as HTMLImageElement).src,
                    title: (titleElem as HTMLParagraphElement).innerText,
                    subtitle: (subtitleElem as HTMLParagraphElement)?.innerText
                });
            }
        }

        Posts.data[section].map.sections = newSections;
        return newSections;
    }

    public static getPrinciples(category: string) {
        const { rawData, content } = Posts.data[category].principles;
        if (content) {
            return content;
        }
        const tree = new DOMParser().parseFromString(rawData.content, "text/html");
        const principleElems = DOMUtils.select(tree.body, ".wp-block-media-text");
        const allPrinciples = principleElems.map(e => {
            return {                
                image: e.querySelector("img")?.src,
                name: (e.querySelector(".wp-block-media-text__content > h6") as HTMLElement).innerText,
                content: DOMUtils.select(e, ".wp-block-media-text__content > p").map(p => p.innerText),
            } as IPrinciple;
        });
        const [intro, ...principles] = allPrinciples;
        const newPrinciples = { intro, principles };
        Posts.data[category].principles.content = newPrinciples;
        return newPrinciples;
    }

    public static getPost(category: string, index: number) {
        const { rawData, post } = Posts.data[category].posts[index];
        if (post) {
            return post;
        }
        const tree = new DOMParser().parseFromString(rawData.content, "text/html");

        // TODO not sure why some images are referenced with http
        const forceHttps = (url?: string) => {  
            return url?.replace("http://", "https://");
        };

        const articleElem = tree.body.querySelector(".wp-block-media-text") as Element;
        const image = articleElem.querySelector("img");
        const content = articleElem.querySelector(".wp-block-media-text__content");
        const article = {
            image: forceHttps(image?.src),
            contentElem: html2React(content?.innerHTML)
        } as IArticle;

        const contributions = DOMUtils.select(tree.body, "table > tbody > tr")
            .slice(1) // skip first title row
            .map(row => {
                const [col1, col2] = DOMUtils.select(row, "td");
                return {
                    principleName: col1?.innerText,
                    contributes: col2?.innerText?.toLowerCase() === "yes"
                } as IContribution;
            });

        const newPost: IPost = {
            // Remove the prefix from the title
            title: rawData.title.slice(`${category}-${index + 1}`.length).trim(),
            article,
            contributions
        };

        Posts.data[category].posts[index].post = newPost;
        return newPost;
    }

    private static readonly data: { [category: string]: IPosts } = {};
}
