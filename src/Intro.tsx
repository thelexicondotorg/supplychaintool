
import * as React from "react";
import { CircularButton } from "./CircularButton";
import { appContext } from "./AppContext";

interface IIntroState {
    amaranthMenu: boolean;
}

export class Intro extends React.Component<{}, IIntroState> {

    private static readonly config = {
        buttonRadius: 180,
        amaranthButtonsSpacing: 20,
        amaranthAnimDuration: 250
    };

    public static get assetsToPreload() {
        return [
            "/public/intro/logo.svg",
            "/public/intro/intro.svg"
        ];
    }

    private _root!: HTMLElement;
    private _header!: HTMLElement;
    private _image!: HTMLElement;
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
        this.onResize = this.onResize.bind(this);
        window.addEventListener("resize", this.onResize);
        this.onResize();
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
                ref={e => this._root = e as HTMLElement}
                className="fill-parent"
                style={{
                    overflow: "hidden"
                }}
                onClick={() => {
                    if (this.state.amaranthMenu) {
                        this.amaranthSlideOut();
                    }
                }}
            >
                <div
                    ref={e => this._header = e as HTMLElement}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "40px"
                    }}
                >
                    <div style={{ paddingRight: "20px" }}>
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
                            CAN TRANSPARENCY BRING GREATER <br className="intro-break" />
                            <b>AGROBIODIVERSITY</b> TO OUR FOOD SYSTEMS?
                        </div>
                    </div>
                </div>
                <div>
                    <img
                        ref={e => this._image = e as HTMLElement}
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
                <appContext.Consumer>
                    {({ history, transition }) => {

                        const onEnter = (url: string) => transition?.(() => history?.push(url));

                        return (
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
                                        onClick={() => onEnter("/fonio")}
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
                                            onClick={() => {
                                                // onEnter("/amaranth-local");
                                            }}
                                        />
                                        <CircularButton
                                            ref={e => this._amaranthIntl = e as CircularButton}
                                            radius={config.buttonRadius}
                                            color="#E23F39"
                                            content={makeButton("AMARANTH", "International")}
                                            onClick={() => {
                                                // onEnter("/amaranth-intl");
                                            }}
                                        />
                                    </div>
                                    <CircularButton
                                        radius={config.buttonRadius}
                                        color={amaranthMenu ? "grey" : "#E23F39"}
                                        content={makeButton("AMARANTH", "Mexico")}
                                        onClick={() => this.amaranthToggle()}
                                    />
                                </div>
                                <div className="intro-button-container">
                                    <CircularButton
                                        radius={config.buttonRadius}
                                        color="#27A33E"
                                        content={makeButton("SMALL MILLETS", "India")}
                                        onClick={() => {
                                            // onEnter("/small-millets");
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    }}
                </appContext.Consumer>
            </div>
        );
    }

    private onResize() {
        this._buttons.style.left = `${(window.innerWidth - this._buttons.clientWidth) / 2}px`;

        const buttonContainerWidth = this._buttons.clientWidth / 3;
        const amaranthWidth = this._amaranthButtons.clientWidth;
        this._amaranthButtons.style.left = `${(buttonContainerWidth - amaranthWidth) / 2}px`;

        // image
        const origSize = [1800, 818]; // naturalWidth/Height doesn't work as expected on Safari!!
        const availableSpace = [window.innerWidth, window.innerHeight - this._header.clientHeight];
        const origRatio = origSize[0] / origSize[1];
        const ratio = availableSpace[0] / availableSpace[1];
        if (ratio > origRatio) {
            this._image.style.width = "100%";
            this._image.style.height = "auto";
            this._image.style.transform = "translate(0px, 0px)";
        } else {
            this._image.style.width = "auto";
            this._image.style.height = `${availableSpace[1]}px`;
            const imageWidth = origRatio * availableSpace[1];
            const offset = (availableSpace[0] - imageWidth) / 2;
            this._image.style.transform = `translate(${offset}px, 0px)`;
        }
    }

    private amaranthToggle() {
        const show = !this.state.amaranthMenu;
        if (show) {
            this._amaranthLocal.root.classList.remove("amaranth-slide-out-1");
            this._amaranthIntl.root.classList.remove("amaranth-slide-out-2");
            this._amaranthLocal.root.classList.add("amaranth-slide-in-1");
            this._amaranthIntl.root.classList.add("amaranth-slide-in-2");
            this.setState({ amaranthMenu: true });
        } else {
            this.amaranthSlideOut();
        }
    }

    private amaranthSlideOut() {
        if (this._amaranthLocal.root.classList.contains("amaranth-slide-out-1")) {
            return;
        }
        this._amaranthLocal.root.classList.replace("amaranth-slide-in-1", "amaranth-slide-out-1");
        this._amaranthIntl.root.classList.replace("amaranth-slide-in-2", "amaranth-slide-out-2");
        setTimeout(() => this.setState({ amaranthMenu: false }), Intro.config.amaranthAnimDuration);
    }
}
