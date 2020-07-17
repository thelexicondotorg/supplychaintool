
export class Settings {

    public static get wordpressUrl() { return Settings._wordpressUrl; }

    public static async load() {
        const settingsJSON = await (await fetch("/settings.json")).json();
        Settings._wordpressUrl = settingsJSON.wordpressUrl;
    }

    private static _wordpressUrl: string;
}
