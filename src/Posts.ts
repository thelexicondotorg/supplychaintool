import { Categories } from "./Categories";
import { IMapImageContent } from "./MapImage";
import { DOMUtils } from "./DOMUtils";

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
    title: string;
    subTitle?: string;
    content: string;
}

interface IPrinciple {
    name: string;
    contributes: boolean;
}

interface IPost {
    title: string;
    articles: IArticle[];
    principles: IPrinciple[];
}

export class Posts {
    public static async load(category: string) {
        const categoryId = Categories.getId(category);
        const response = await fetch(`https://wp-supplytool.franticsoftware.com/wp-json/wp/v2/posts?categories=${categoryId}`);
        const json = await response.json();

        const allPosts = (json as IPostJson[])
            .map(({ slug, title, content }) => {
                const [match, index] = slug.match(/[a-z-]+-([0-9]+)/) ?? [null, null];
                const postIndex = parseInt(index ?? "-1", 10);
                if (postIndex < 0) {
                    // tslint:disable-next-line
                    console.assert(slug === category);
                }
                return [postIndex, { title: title.rendered, content: content.rendered }] as [number, IPostRawData];
            })
            .sort((a, b) => a[0] - b[0])
            .map(([index, content]) => content);

        const [intro, ...posts] = allPosts;
        Object.assign(Posts.data, {
            [category]: {
                intro: {
                    rawData: intro
                },
                posts: posts.map(rawData => ({ rawData }))
            }
        });
    }

    public static getIntroSections(category: string) {
        const { rawData, sections } = Posts.data[category].intro;
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

        Posts.data[category].intro.sections = newSections;
        return newSections;
    }

    public static getPost(category: string, index: number) {
        const { rawData, post } = Posts.data[category].posts[index];
        if (post) {
            return post;
        }
        const tree = new DOMParser().parseFromString(rawData.content, "text/html");

        const articles = DOMUtils.select(tree.body, ".wp-block-media-text").map(a => {
            const image = a.querySelector("img");
            const content = a.querySelector(".wp-block-media-text__content");
            const [header1, header2] = content ? DOMUtils.select(content, "h6") : [];
            const text = content?.querySelector("p");
            return {
                image: image?.src,
                title: header1?.innerText,
                subTitle: header2?.innerText,
                content: text?.innerText
            } as IArticle;
        });

        const principles = DOMUtils.select(tree.body, "table > tbody > tr")
            .slice(1) // skip first title row
            .map(row => {
                const [col1, col2] = DOMUtils.select(row, "td");
                return {
                    name: col1?.innerText,
                    contributes: col2?.innerText?.toLowerCase() === "yes"
                } as IPrinciple;
            });

        const newPost: IPost = {
            title: rawData.title,
            articles,
            principles
        };

        Posts.data[category].posts[index].post = newPost;
        return newPost;
    }

    private static data: {
        [category: string]: {
            intro: {
                rawData: IPostRawData;
                sections: IMapImageContent[];
            };
            posts: Array<{
                rawData: IPostRawData;
                post: IPost;
            }>
        }
    } = {};
}
