
import { createContext } from "react";
import * as H from "history";

interface IAppContext {
    history?: H.History;
    transition?: (onFadeOut?: () => void) => void;
}

export const appContext = createContext<IAppContext>({});
