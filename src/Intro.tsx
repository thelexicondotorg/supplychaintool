
import * as React from "react";
import { IntroButtons } from "./IntroButtons";

export class Intro extends React.Component {

    public static get assetsToPreload() {
        return [
            "/public/intro/logo.svg",
            "/public/intro/intro.svg"
        ];
    }

    private _header!: HTMLElement;
    private _image!: HTMLElement;
    private _root!: HTMLElement;
    private _introButtons!: IntroButtons;

    public componentDidMount() {
        this.onResize = this.onResize.bind(this);
        window.addEventListener("resize", this.onResize);
        this.onResize();
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    public render() {
        return (
            <div
                ref={e => this._root = e as HTMLElement}
                className="fill-parent"
                style={{
                    overflow: "hidden"
                }}
                onClick={() => {
                    this._introButtons.tryAmaranthSlideout();
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
                        <img 
                            style={{ maxWidth: "100%" }}
                            src="/public/intro/logo.svg" 
                        />
                    </div>
                    <div
                        style={{
                            textAlign: "right",
                            paddingLeft: "10px"
                        }}
                    >
                        <div className="intro-title">
                            The FACT Supply Chain Tool
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
                <IntroButtons ref={e => this._introButtons = e as IntroButtons } />
            </div>
        );
    }

    private onResize() {
        const width = window.innerWidth; // this._root.clientWidth
        const height = window.innerHeight; // this._root.clientHeight

        // image
        const origSize = [1800, 818]; // naturalWidth/Height doesn't work as expected on Safari!!
        const availableSpace = [width, height - this._header.clientHeight];
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

        this._introButtons.onResize();
    }    
}
