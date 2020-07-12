
import { createContext } from "react";
import * as H from "history";

export const routerContext = createContext<{ history?: H.History }>({});
