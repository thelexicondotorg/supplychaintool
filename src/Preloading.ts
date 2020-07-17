import { Images } from "./Images";
import { HelpPopup } from "./HelpPopup";
import { Footer } from "./Footer";
import { Intro } from "./Intro";

export class Preloading {
    public static async preloadIntro() {
        return Images.preload([
            ...Intro.assetsToPreload
        ]);
    }

    public static async preloadSection() {
        return Images.preload([
            ...HelpPopup.assetsToPreload,
            ...Footer.assetsToPreload
        ]);
    }
}
