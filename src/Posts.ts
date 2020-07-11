import { Categories } from "./Categories";

interface IPostJson {
    slug: string;
    content: {
        rendered: string;
    };
}

export class Posts {
    public static async load(category: string) {
        const categoryId = Categories.getId(category);
        const response = await fetch(`https://wp-supplytool.franticsoftware.com/wp-json/wp/v2/posts?categories=${categoryId}`);
        const json = await response.json();

        const allPosts = (json as IPostJson[])
            .map(({ slug, content }) => {
                const [match, index] = slug.match(/[a-z-]+-([0-9]+)/) ?? [null, null];
                const postIndex = parseInt(index ?? "-1", 10);
                if (postIndex < 0) {
                    // tslint:disable-next-line
                    console.assert(slug === category);
                }
                return [postIndex, content.rendered] as [number, string];
            })
            .sort((a, b) => a[0] - b[0])
            .map(([index, content]) => content);

        const [intro, ...posts] = allPosts;
        Object.assign(Posts.data, {
            [category]: {
                intro,
                posts
            }
        });
        return Posts.getPosts(category);
    }

    public static getPosts(category: string) {
        return Posts.data[category];
    }

    private static data: {
        [category: string]: {
            intro: string;
            posts: string[]
        }
    } = {};
}
