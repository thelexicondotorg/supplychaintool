
export class Fonts {
    public static preload() {
        const toBase64 = (blob: Blob) => new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });

        const loadFont = (family: string, style: string, weight: string, url: string) => {
            return fetch(url)
                .then(response => response.blob())
                .then(blob => toBase64(blob))
                .then(data => {
                    const customStyle = `@font-face {
        font-family: ${family};
        src: url(${data});
        font-style: ${style};
        font-weight: ${weight};
        }
        `;
                    const styleSheet = document.createElement("style");
                    styleSheet.type = "text/css";
                    styleSheet.innerText = customStyle;
                    document.head.appendChild(styleSheet);

                    const dummy = document.createElement("span");
                    dummy.innerText = ".";
                    dummy.setAttribute("style", `font-family: ${family};font-weight: ${weight};opacity:0;`);
                    document.body.appendChild(dummy);
                })
                .catch(error => {
                    // tslint:disable-next-line
                    console.error(error);
                });
        };

        return Promise.all([
            loadFont("Google Sans", "normal", "normal", "/public/fonts/GoogleSans-Regular.ttf"),
            loadFont("Google Sans", "normal", "bold", "/public/fonts/GoogleSans-Bold.ttf"),
            // loadFont("Roboto Condensed", "normal", "normal", "/public/fonts/RobotoCondensed-Regular.ttf"),
            // loadFont("Roboto Condensed", "normal", "bold", "/public/fonts/RobotoCondensed-Bold.ttf"),
            loadFont("Work Sans", "normal", "normal", "/public/fonts/WorkSans-Regular.ttf"),
        ]);
    }
}
