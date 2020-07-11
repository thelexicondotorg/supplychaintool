
interface IMediaJson {
    source_url: string;
    caption: {
        rendered: string;
    };
}

export class Captions {
    public static async load() {
        const response = await fetch("http://wp-supplytool.franticsoftware.com/wp-json/wp/v2/media");
        const json = await response.json();

        (json as IMediaJson[]).forEach(({ source_url, caption }) => {
            if (caption.rendered.length > 0) {
                // tslint:disable-next-line
                console.log(`[${source_url}].caption = ${caption.rendered}`);
            }
            Object.assign(Captions.data, { [source_url]: caption.rendered });
        });
    }

    public static get(url: string) {
        return Captions.data[url];
    }

    private static data: { [url: string]: string } = {};
}
