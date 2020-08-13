import { Settings } from "./Settings";

interface ICategoryJson {
    slug: string;
    id: string;
}

interface ISupplyChain {
    footerText: string;
    mapMetrics: {
        frameSize: [number, number];
        iconPositions: Array<[number, number]>;
    };
}

interface ICategories {
    [name: string]: {
        id: string;
        info: ISupplyChain;
    };
}

export class Categories {
    public static async load() {
        if (Object.keys(Categories.data).length > 0) {
            return;
        }
        const response = await fetch(`${Settings.data.wordpressUrl}/wp-json/wp/v2/categories`);
        const json = await response.json() as ICategoryJson[];
        const categories = json
            .map(({ slug, id }) => ({ slug, id }))
            .filter(c => c.slug !== "uncategorized");

        // tslint:disable-next-line
        const getSupplyChain = async (supplyChain: string) => (await fetch(`/customize/supplychains/${supplyChain}.json`)).json() as Promise<ISupplyChain>;
        const supplyChains = await Promise.all(categories.map(c => getSupplyChain(c.slug)));
        Categories.data = categories.reduce((prev, cur, index) => {
            return { ...prev, ...{
                [cur.slug]: {
                    id: cur.id,
                    info: supplyChains[index]
                }
            }};
        }, {});
    }

    public static get(slug: string) {
        return Categories.data[slug];
    }

    private static data: ICategories = {};
}
