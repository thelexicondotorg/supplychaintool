
import * as React from "react";
import * as ReactDOM from "react-dom";

export class Transition extends React.Component {

    private static readonly config = {
        fadeDuration: 250
    };

    private _root!: HTMLElement;

    public transition() {
        this._root.classList.replace("fade-in", "fade-out");
        return new Promise(resolve => {
            setTimeout(
                () => {
                    resolve();
                    this._root.classList.replace("fade-out", "fade-in");
                }, 
                Transition.config.fadeDuration
            );
        });
    }

    public render() {
        return ReactDOM.createPortal(
            (
                <div
                    ref={e => this._root = e as HTMLElement}
                    className="fill-parent fade-in"
                    style={{
                        position: "absolute",
                        left: "0px",
                        top: "0px",
                        backgroundColor: "white",
                        pointerEvents: "none"
                    }}
                />
            ),
            document.body
        );
    }
}
