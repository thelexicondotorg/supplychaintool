
import * as React from "react";
import * as ReactDOM from "react-dom";
import { appContext } from "./AppContext";

interface IHelpPopupProps {
    visible: boolean;
    onClose: () => void;
}

// tslint:disable:max-line-length

export class HelpPopup extends React.Component<IHelpPopupProps> {

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

        return ReactDOM.createPortal(
            (
                <div
                    ref={e => this._root = e as HTMLElement}
                    className="help-dialog fill-parent"
                    style={{
                        position: "fixed",
                        left: 0,
                        top: 0,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        display: "grid"
                    }}
                    onClick={this.props.onClose}
                >
                    <div
                        className="card"
                        style={{
                            maxWidth: "600px",
                            minHeight: "344px",
                            backgroundColor: "white",
                            margin: "0 auto",
                            alignSelf: "center"
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
                                    right: "14px",
                                    top: "10px"
                                }}
                                onClick={this.props.onClose}
                            >
                                X
                            </div>
                        </div>
                        <div style={{ paddingRight: "20px"}}>
                            <ul>
                                <li>A key is provided to show direction of money and goods.</li>
                                <li>Click on each character to see read more about each part of the supply chain. Information is on the bottom left.</li>
                                <li>The table (top right) shows how each character contributes to the ten agrobiodiversity principles. Click on principles to learn more about each of them.</li>
                                <li>To go to another supply chain, Click {makeHomeLink()} to return home</li>
                            </ul>
                        </div>
                    </div>
                </div>
            ),
            document.getElementById("dialog-layer") as HTMLElement
        );
    }
}
