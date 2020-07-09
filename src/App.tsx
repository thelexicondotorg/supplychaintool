
import * as React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Intro } from "./Intro";

export class App extends React.Component {
    public render() {
        return (
            <BrowserRouter>
                <Switch>
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
