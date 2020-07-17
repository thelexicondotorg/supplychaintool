
import { createContext } from "react";
import * as H from "history";

interface IAppContext {
    history?: H.History;
}

export const appContext = createContext<IAppContext>({});
