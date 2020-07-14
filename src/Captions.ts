
interface IMediaJson {
    source_url: string;
    caption: {
        rendered: string;
    };
}

export class Captions {
    public static async load() {
        const response = await fetch("https://wp-supplytool.franticsoftware.com/wp-json/wp/v2/media?per_page=100");
        const json = await response.json();

        (json as IMediaJson[]).forEach(({ source_url, caption }) => {
            if (caption.rendered.length > 0) {
                const tree = new DOMParser().parseFromString(caption.rendered, "text/html");
                const captionText = tree.body.querySelector("p")?.innerText;
                Object.assign(Captions.data, { [source_url]: captionText });
            }
        });
    }

    public static get(url: string) {
        return Captions.data[url];
    }

    private static data: { [url: string]: string } = {};
}
