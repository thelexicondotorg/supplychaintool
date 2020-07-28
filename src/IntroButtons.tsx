
import * as React from "react";
import { appContext } from "./AppContext";
import { CircularButton } from "./CircularButton";

interface IIntroButtonsState {
    amaranthMenu: boolean;
}

export class IntroButtons extends React.Component<{}, IIntroButtonsState> {

    private static readonly config = {
        buttonRadius: 180,
        amaranthButtonsSpacing: 20,
        amaranthAnimDuration: 250
    };

    private _amaranthButtons!: HTMLElement;
    private _amaranthLocal!: CircularButton;
    private _amaranthIntl!: CircularButton;
    private _buttons!: HTMLElement;

    constructor(props: {}) {
        super(props);
        this.state = {
            amaranthMenu: false
        };
    }

    public render() {
        const { config } = IntroButtons;
        const { amaranthMenu } = this.state;

        const makeButton = (name: string, location: string) => {
            return (
                <span>
                    <span className="intro-button-title">
                        {name}
                        <br></br>
                        {location}
                    </span>
                    <br></br>
                    <span className="intro-button-subtitle">
                        Click to explore
                    </span>
                </span>
            );
        };

        return (
            <appContext.Consumer>
                {({ history, transition }) => {

                    const onEnter = (url: string) => transition?.(() => history?.push(url));
                    const buttonsWidth = window.innerWidth * (80 / 100);
                    const buttonRadius = this.getButtonRadius();
                    return (
                        <div
                            style={{
                                position: "absolute",
                                bottom: "25px",
                                minWidth: "80%",
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                left: `${(window.innerWidth - buttonsWidth) / 2}px`
                            }}
                        >
                            <div className="intro-button-container">
                                <CircularButton
                                    radius={buttonRadius}
                                    color="#FBB040"
                                    content={makeButton("FONIO", "West Africa")}
                                    onClick={() => onEnter("/fonio")}
                                />
                            </div>
                            <div 
                                ref={e => this._buttons = e as HTMLElement}
                                className="intro-button-container"
                            >
                                <div
                                    ref={e => this._amaranthButtons = e as HTMLElement}
                                    style={{
                                        position: "absolute",
                                        width: `${buttonRadius * 2 + config.amaranthButtonsSpacing}px`,
                                        top: `${-buttonRadius}px`,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        opacity: amaranthMenu ? 1 : 0,
                                        pointerEvents: amaranthMenu ? "all" : "none"
                                    }}
                                >
                                    <CircularButton
                                        ref={e => this._amaranthLocal = e as CircularButton}
                                        radius={buttonRadius}
                                        color="#E23F39"
                                        content={makeButton("AMARANTH", "Local")}
                                        onClick={() => onEnter("/amaranth-local")}
                                    />
                                    <CircularButton
                                        ref={e => this._amaranthIntl = e as CircularButton}
                                        radius={buttonRadius}
                                        color="#E23F39"
                                        content={makeButton("AMARANTH", "International")}
                                        onClick={() => onEnter("/amaranth-intl")}
                                    />
                                </div>
                                <CircularButton
                                    radius={buttonRadius}
                                    color={amaranthMenu ? "grey" : "#E23F39"}
                                    content={makeButton("AMARANTH", "Mexico")}
                                    onClick={() => this.amaranthToggle()}
                                />
                            </div>
                            <div className="intro-button-container">
                                <CircularButton
                                    radius={buttonRadius}
                                    color="#27A33E"
                                    content={makeButton("SMALL MILLETS", "India")}
                                    onClick={() => onEnter("/small-millets")}
                                />
                            </div>
                        </div>
                    );
                }}
            </appContext.Consumer>
        );
    }

    public tryAmaranthSlideout() {
        if (this.state.amaranthMenu) {
            this.amaranthSlideOut();
        }
    }

    public onResize() {
        const buttonsWidth = window.innerWidth * (80 / 100);
        const buttonContainerWidth = buttonsWidth / 3;
        const amaranthWidth = this._amaranthButtons.clientWidth;
        this._amaranthButtons.style.left = `${(buttonContainerWidth - amaranthWidth) / 2}px`;
        this.forceUpdate();
    }

    private amaranthToggle() {
        const show = !this.state.amaranthMenu;
        if (show) {
            this.updateStyleVars();
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
        this.updateStyleVars();
        this._amaranthLocal.root.classList.replace("amaranth-slide-in-1", "amaranth-slide-out-1");
        this._amaranthIntl.root.classList.replace("amaranth-slide-in-2", "amaranth-slide-out-2");
        setTimeout(() => this.setState({ amaranthMenu: false }), IntroButtons.config.amaranthAnimDuration);
    }   
    
    private getButtonRadius() {
        const { config } = IntroButtons;
        const buttonsWidth = window.innerWidth * (80 / 100);
        const buttonRadiusH = Math.min(buttonsWidth / 3, config.buttonRadius);
        const buttonRadiusV = Math.min(window.innerHeight / 630, 1) * config.buttonRadius;
        const buttonRadius = Math.min(buttonRadiusH, buttonRadiusV);
        return buttonRadius;
    }

    private updateStyleVars() {
        const buttonRadius = this.getButtonRadius();
        const buttonOffset = (buttonRadius / IntroButtons.config.buttonRadius) * 100;
        this._buttons.style.setProperty("--buttonRadius", `${buttonRadius}px`);
        this._buttons.style.setProperty("--buttonOffsetP", `${buttonOffset}px`);
        this._buttons.style.setProperty("--buttonOffsetN", `${-buttonOffset}px`);
    }
}
