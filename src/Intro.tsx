
import * as React from "react";
import { CircularButton } from "./CircularButton";

interface IIntroState {
    amaranthMenu: boolean;
}

export class Intro extends React.Component<{}, IIntroState> {

    private static readonly config = {
        buttonRadius: 180,
        amaranthButtonsSpacing: 20
    };

    private _buttons!: HTMLElement;
    private _amaranthButtons!: HTMLElement;
    private _amaranthLocal!: CircularButton;
    private _amaranthIntl!: CircularButton;

    constructor(props: {}) {
        super(props);
        this.state = {
            amaranthMenu: false
        };
    }

    public componentDidMount() {
        this.onResize();
        this.onResize = this.onResize.bind(this);
        window.addEventListener("resize", this.onResize);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    public render() {

        const { config } = Intro;
        const { amaranthMenu } = this.state;
        const makeButton = (name: string, location: string) => {
            return (
                <span>
                    <span
                        style={{
                            fontWeight: "bold",
                            fontSize: "20px"
                        }}
                    >
                        {name}
                        <br></br>
                        {location}
                    </span>
                    <br></br>
                    <span
                        style={{
                            fontSize: "14px",
                            fontWeight: "normal"
                        }}
                    >
                        Click to explore
                    </span>
                </span>
            );
        };

        return (
            <div
                className="fill-parent"
                style={{
                    overflow: "hidden"
                }}
                onClick={() => {
                    this.setState({ amaranthMenu: false });
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "40px",
                        paddingBottom: "0px"
                    }}
                >
                    <div style={{ paddingRight: "10px" }}>
                        <img src="/public/intro/logo.svg" />
                    </div>
                    <div
                        style={{
                            textAlign: "right",
                            paddingLeft: "10px"
                        }}
                    >
                        <div className="intro-title">
                            Three continents. <br className="intro-break" /> 
                            Three Grains. <br className="intro-break" /> 
                            Three Supply Chains
                        </div>
                        <div className="intro-subtitle">
                            CAN TRANSPARENCY BRING GREATER <b>AGROBIODIVERSITY</b> TO OUR FOOD SYSTEMS?
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        paddingTop: "40px"
                    }}
                >
                    <img
                        style={{
                            width: "100%"
                        }}
                        src="/public/intro/intro.svg"
                    />
                    <div
                        style={{
                            backgroundColor: "#E0CFB6",
                            height: "2000px",
                            transform: "translate(0px, -2px)"
                        }}
                    />
                </div>
                <div
                    ref={e => this._buttons = e as HTMLElement}
                    style={{
                        position: "absolute",
                        bottom: "25px",
                        minWidth: "80%",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr"
                    }}
                >
                    <div className="intro-button-container">
                        <CircularButton
                            radius={config.buttonRadius}
                            color="#FBB040"
                            content={makeButton("FONIO", "West Africa")}
                            url="/fonio"
                        />
                    </div>
                    <div className="intro-button-container">
                        <div
                            ref={e => this._amaranthButtons = e as HTMLElement}
                            style={{
                                position: "absolute",
                                width: `${config.buttonRadius * 2 + config.amaranthButtonsSpacing}px`,
                                top: `${-config.buttonRadius}px`,
                                display: "flex",
                                justifyContent: "space-between",
                                opacity: amaranthMenu ? 1 : 0,
                                pointerEvents: amaranthMenu ? "all" : "none"
                            }}
                        >
                            <CircularButton
                                ref={e => this._amaranthLocal = e as CircularButton}
                                radius={config.buttonRadius}
                                color="#E23F39"
                                content={makeButton("AMARANTH", "Local")}
                                // url="/fonio"
                                // url="/amaranth-local"
                            />
                            <CircularButton
                                ref={e => this._amaranthIntl = e as CircularButton}
                                radius={config.buttonRadius}
                                color="#E23F39"
                                content={makeButton("AMARANTH", "International")}
                                // url="/fonio"
                                // url="/amaranth-intl"
                            />
                        </div>
                        <CircularButton
                            radius={config.buttonRadius}
                            color={amaranthMenu ? "grey" : "#E23F39"}
                            content={makeButton("AMARANTH", "Mexico")}
                            onClick={() => {
                                this.setState({ amaranthMenu: !this.state.amaranthMenu });
                            }}                        
                        />
                    </div>
                    <div className="intro-button-container">
                        <CircularButton
                            radius={config.buttonRadius}
                            color="#27A33E"
                            content={makeButton("SMALL MILLETS", "India")}
                            // url="/small-millets"
                        />
                    </div>
                </div>
            </div>
        );
    }

    private onResize() {
        this._buttons.style.left = `${(window.innerWidth - this._buttons.clientWidth) / 2}px`;
        
        const buttonContainerWidth = this._buttons.clientWidth / 3;
        const amaranthWidth = this._amaranthButtons.clientWidth;
        this._amaranthButtons.style.left = `${(buttonContainerWidth - amaranthWidth) / 2}px`;
    }
}
