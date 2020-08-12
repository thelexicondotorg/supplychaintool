
interface IRawSettings {
    wordpressUrl: string;
    footerText: string;
    supplyChains: string[];
}

interface ISupplyChain {
    footerText: string;
    mapMetrics: {
        frameSize: [number, number];
        iconPositions: Array<[number, number]>;
    };
}

interface ISettings {
    wordpressUrl: string;
    footerText: string;
    supplyChains: {
        [name: string]: ISupplyChain;
    };
}

export class Settings {
    public static get data() { return Settings._data; }

    public static async load() {
        const rawSettings = await (await fetch("/customize/settings.json")).json() as IRawSettings;
        // tslint:disable-next-line
        const getSupplyChain = async (supplyChain: string) => (await fetch(`/customize/${supplyChain}.json`)).json() as Promise<ISupplyChain>;
        const supplyChains = await Promise.all(rawSettings.supplyChains.map(getSupplyChain));
        Settings._data = {
            wordpressUrl: rawSettings.wordpressUrl,
            footerText: rawSettings.footerText,
            supplyChains: rawSettings.supplyChains.reduce((prev, cur, index) => {
                return { ...prev, ...{ [cur]: supplyChains[index] } };
            }, {})
        };
    }

    private static _data: ISettings;
}
