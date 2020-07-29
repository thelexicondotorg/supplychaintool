
import * as React from "react";
import * as ReactDOM from "react-dom";
import { appContext } from "./AppContext";

interface IHelpPopupProps {
    visible: boolean;
    onClose: () => void;
}

// tslint:disable:max-line-length

export class HelpPopup extends React.Component<IHelpPopupProps> {

    private static readonly config = {
        animDuration: 300
    };

    public static get assetsToPreload() {
        return [
            "/public/help/help-logo.png"
        ];
    }

    private _root!: HTMLElement;

    public render() {
        if (!this.props.visible) {
            return null;
        }

        const makeHomeLink = () => {
            return (
                <appContext.Consumer>
                    {({ history, transition }) => {
                        return (
                            <img
                                src="/public/help/help-logo.png"
                                className="clickable"
                                onClick={() => transition?.(() => history?.push("/"))}
                            />
                        );
                    }}
                </appContext.Consumer>
            );
        };

        const close = () => {
            this._root.classList.replace("dialog-in", "dialog-out");
            setTimeout(this.props.onClose, HelpPopup.config.animDuration);
        };

        return ReactDOM.createPortal(
            (
                <div
                    className="help-dialog fill-parent"
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        display: "flex",
                    }}
                    onClick={close}
                >
                    <div
                        ref={e => this._root = e as HTMLElement}
                        className="card dialog-in help-popup"
                        style={{
                            position: "relative",
                            maxWidth: "600px",
                            height: "90%",
                            backgroundColor: "white",
                            margin: "0 auto",
                            alignSelf: "center",
                            transform: "scaleY(0)"
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div
                            className="quadrant-title"
                            style={{ position: "relative" }}
                        >
                            <span>How to use this tool?</span>
                            <div
                                className="clickable"
                                style={{
                                    position: "absolute",
                                    right: "0px",
                                    top: "-6px",
                                    padding: "20px"
                                }}
                                onClick={close}
                            >
                                X
                            </div>
                        </div>
                        <div                             
                            style={{ 
                                padding: "0px 20px 20px 20px",
                                height: "calc(100% - 44px)",
                                overflow: "auto"
                            }}
                        >
                            <p>
                                Food moves across the globe through supply chains that are mostly blind. Purchasers often have scant visibility into who grows our food, the practices they use, or the communities they support.
                            </p>

                            <p>
                                To support greater transparency in our food systems, the FACT Roundtable has developed 10 Principles for Agrobiodiversity, then tested them by conducting tests with three grains on three continents:
                            </p>
                            <ul>
                                <li>Small Millets in India</li>
                                <li>Amaranth in Mexico</li>
                                <li>Fonio in West Africa</li>
                            </ul>
                            <p>
                                The FACT Supply Chain Tool can provide food companies both big and small with a purchasing framework to accelerate the adoption of market-driven support to enhance agrobiodiversity across our food systems.
                            </p>
                        </div>
                    </div>
                </div>
            ),
            document.getElementById("dialog-layer") as HTMLElement
        );
    }
}
