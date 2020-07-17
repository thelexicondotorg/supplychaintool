
import * as React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Section } from "./Section";
import { SectionType } from "./Types";

import "./styles/common.css";
import { LoadingIndicator } from "./LoadingIndicator";
import { Fonts } from "./Fonts";
import { appContext } from "./AppContext";
import { Settings } from "./Settings";
import { IntroContainer } from "./IntroContainer";

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
        Settings.load()
            .then(() => Fonts.preload())
            .then(() => {
                this.setState({
                    loaded: true,
                });
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
                                            <appContext.Provider value={{ history }}>
                                                <Section section={section} index={match.params.index} />
                                            </appContext.Provider>
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
                                <appContext.Provider value={{ history }}>
                                    <IntroContainer />
                                </appContext.Provider>
                            );
                        }}
                    />
                    <Route render={() => <Redirect to="/" />} />
                </Switch>
            </BrowserRouter>
        );
    }
}
