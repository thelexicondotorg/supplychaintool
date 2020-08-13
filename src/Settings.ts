
interface ISettings {
    wordpressUrl: string;
    footerText: string;
}

export class Settings {
    public static get data() { return Settings._data; }

    public static async load() {
        Settings._data = await (await fetch("/customize/settings.json")).json() as ISettings;
    }

    private static _data: ISettings;
}
