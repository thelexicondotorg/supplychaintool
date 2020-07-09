
import * as React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Intro } from "./Intro";
import { SectionIntro } from "./SectionIntro";
import { SectionType } from "./Types";

import "./styles/common.css";

export class App extends React.Component {
    public render() {
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
                                        return <SectionIntro {...props} section={section} index={index} />;
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
