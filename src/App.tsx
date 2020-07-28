
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
import { Transition } from "./Transition";

interface IAppState {
    loaded: boolean;
    helpShown: boolean;
    rotateScreenPrompt: boolean;
}

export class App extends React.Component<{}, IAppState> {

    private _transition!: Transition;

    constructor(props: {}) {
        super(props);
        this.state = {
            loaded: false,
            helpShown: false,
            rotateScreenPrompt: false
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

        this.onResize = this.onResize.bind(this);
        window.addEventListener("resize", this.onResize);
        this.onResize();
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    public render() {
        if (!this.state.loaded) {
            return <LoadingIndicator />;
        }

        const transition = async (onFadeOut?: () => void) => {
            await this._transition.transition();
            onFadeOut?.();
        };

        return (
            <React.Fragment>
                <BrowserRouter>
                    <Switch>
                        {
                            ([
                                "fonio",
                                "amaranth-local",
                                "amaranth-intl",
                                "small-millets"
                            ] as SectionType[]).map(section => {
                                return (
                                    <Route
                                        key={section}
                                        path={`/${section}/:index?`}
                                        render={({ match, history }) => {
                                            return (
                                                <appContext.Provider value={{ history, transition }}>
                                                    <Section
                                                        section={section}
                                                        index={match.params.index}
                                                        showHelpOnStart={!this.state.helpShown}
                                                        onHelpClosed={() => {
                                                            this.setState({ helpShown: true });
                                                        }}
                                                    />
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
                                    <appContext.Provider value={{ history, transition }}>
                                        <IntroContainer />
                                    </appContext.Provider>
                                );
                            }}
                        />
                        <Route render={() => <Redirect to="/" />} />
                    </Switch>
                </BrowserRouter>
                <div id="dialog-layer" />
                <Transition ref={e => this._transition = e as Transition} />
                <div
                    style={{
                        position: "absolute",
                        width: "100vw",
                        height: "100vh",
                        left: "0px",
                        top: "0px",
                        backgroundColor: "black",
                        display: this.state.rotateScreenPrompt ? "grid" : "none",
                        alignItems: "center",
                        textAlign: "center"
                    }}
                >
                    <div>
                        <div>
                            <img src="/public/rotate-device.png" />
                        </div>
                        <div
                            style={{
                                color: "white",
                                fontSize: "1.8vh",
                                padding: "20px"
                            }}
                        >
                            Please rotate your device
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    private onResize() {
        const [width, height] = [window.innerWidth, window.innerHeight];
        const isPortrait = height > width;
        if (isPortrait !== this.state.rotateScreenPrompt) {
            this.setState({ rotateScreenPrompt: isPortrait });
        }
    }
}
