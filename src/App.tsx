
import * as React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Intro } from "./Intro";
import { Section } from "./Section";
import { SectionType } from "./Types";

import "./styles/common.css";
import { LoadingIndicator } from "./LoadingIndicator";
import { Fonts } from "./Fonts";
import { Categories } from "./Categories";
import { Captions } from "./Captions";
import { routerContext } from "./RouterContext";

interface IAppState {
    loaded: boolean;
}

export class App extends React.Component<{}, IAppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    public componentDidMount() {
        Fonts.preload()
            .then(() => Promise.all([
                Categories.load(),
                Captions.load()
            ]))
            .then(() => {
                this.setState({ loaded: true });
            });
    }

    public render() {
        if (!this.state.loaded) {
            return <LoadingIndicator />;
        }

        return (
            <BrowserRouter>
                <Switch>
                    {
                        ([
                            "fonio",
                            "amaranth-local",
                            "small-millets"
                        ] as SectionType[]).map(section => {
                            return (
                                <Route
                                    key={section}
                                    path={`/${section}/:index?`}
                                    render={({ match, history }) => {
                                        return (
                                            <routerContext.Provider value={{ history }}>
                                                <Section section={section} index={match.params.index} />
                                            </routerContext.Provider>
                                        );
                                    }}
                                />
                            );
                        })
                    }
                    <Route
                        path="/"
                        exact={true}
                        render={({ history }) => {
                            return (
                                <routerContext.Provider value={{ history }}>
                                    <Intro />
                                </routerContext.Provider>
                            );
                        }}
                    />
                    <Route render={() => <Redirect to="/" />} />
                </Switch>
            </BrowserRouter>
        );
    }
}
