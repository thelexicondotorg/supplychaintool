
import * as React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Intro } from "./Intro";
import { Section } from "./Section";
import { SectionType } from "./Types";

import "./styles/common.css";
import { LoadingIndicator } from "./LoadingIndicator";
import { Fonts } from "./Fonts";

interface IAppState {
    fontsLoaded: boolean;
}

export class App extends React.Component<{}, IAppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            fontsLoaded: false
        };
    }

    public componentDidMount() {
        Fonts.preload().then(() => {
            this.setState({ fontsLoaded: true });
        });
    }

    public render() {
        if (!this.state.fontsLoaded) {
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
                                    render={props => {
                                        const { index } = props.match.params;
                                        return <Section {...props} section={section} index={index} />;
                                    }}
                                />
                            );
                        })
                    }
                    <Route
                        path="/"
                        exact={true}
                        render={() => <Intro />}
                    />
                    <Route render={() => <Redirect to="/" />} />
                </Switch>
            </BrowserRouter>
        );
    }
}
