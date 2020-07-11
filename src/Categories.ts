
interface ICategoryJson {
    slug: string;
    id: string;
}

export class Categories {
    public static async load() {
        const response = await fetch("https://wp-supplytool.franticsoftware.com/wp-json/wp/v2/categories");
        const json = await response.json();
        (json as ICategoryJson[]).forEach(({ slug, id }) => {
            Object.assign(Categories.data, { [slug]: id });
        });
    }

    public static getId(slug: string) {
        return Categories.data[slug];
    }

    private static data: { [slug: string]: string } = {};
}
