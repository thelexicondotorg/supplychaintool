
import * as React from "react";
import * as ReactDOM from "react-dom";
import { appContext } from "./AppContext";
import { Settings } from "./Settings";

// tslint:disable-next-line
const { default: html2React } = require("html2react");

interface IHelpPopupProps {
    visible: boolean;
    onClose: () => void;
}

// tslint:disable:max-line-length

export class HelpPopup extends React.Component<IHelpPopupProps> {

    public static async load() {
        if (HelpPopup.contentElem) {
            return;
        }

        const request = `wp-json/wp/v2/posts?slug=help`;
        const response = await fetch(`${Settings.data.wordpressUrl}/${request}`);
        const json = await response.json();
        const [helpPost] = json;
        const html = new DOMParser().parseFromString(helpPost.content.rendered, "text/html");
        HelpPopup.contentElem = html2React(html.body.innerHTML);
        HelpPopup.title = helpPost.title.rendered;
    }

    private static readonly config = {
        animDuration: 300
    };

    private static contentElem: JSX.Element;
    private static title: string;

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
                            <span>{HelpPopup.title}</span>
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
                            {HelpPopup.contentElem}
                        </div>
                    </div>
                </div>
            ),
            document.getElementById("dialog-layer") as HTMLElement
        );
    }
}
