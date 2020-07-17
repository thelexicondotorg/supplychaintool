
export class Images {    

    public static get(path: string) {
        return Images.preloads[path];
    }

    public static preload(paths: string[]) {        

        return Promise.all(paths.map(path => {            
            if (Images.get(path)) {
                return Promise.resolve();
            }
            return new Promise<HTMLImageElement | null>(resolve => {
                const image = new Image();
                image.src = path;
                image.onload = () => resolve(image);
                image.onerror = () => resolve(null);
            })
            .then(image => {
                if (image) {
                    Images.preloads[path] = image;
                }
            });
        }));
    }

    private static readonly preloads: {[path: string]: HTMLImageElement} = {};
}
