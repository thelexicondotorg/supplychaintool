import { Settings } from "./Settings";

interface ICategoryJson {
    slug: string;
    id: string;
}

export class Categories {
    public static async load() {
        if (Object.keys(Categories.data).length > 0) {
            return;
        }
        const response = await fetch(`${Settings.wordpressUrl}/wp-json/wp/v2/categories`);
        const json = await response.json();
        (json as ICategoryJson[]).forEach(({ slug, id }) => {
            Object.assign(Categories.data, { [slug]: id });
        });
    }

    public static getId(slug: string) {
        return Categories.data[slug];
    }

    private static readonly data: { [slug: string]: string } = {};
}
