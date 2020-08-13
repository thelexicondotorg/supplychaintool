
import * as React from "react";
import { IntroButtons } from "./IntroButtons";
import { IIntroSupplyChain } from "./Types";

// tslint:disable-next-line
const { default: html2React } = require("html2react");

interface IIntro {
    title: string;
    subtitle?: string;
    buttons: IIntroSupplyChain[];
}

export class Intro extends React.Component {

    public static async load() {
        if (Intro._data) {
            return;
        }
        const data = await (await fetch("/customize/intro/intro.json")).json() as IIntro;
        Intro._data = data;
    }

    public static get assetsToPreload() {
        return [
            "/customize/intro/intro-logo.svg",
            "/customize/intro/intro-background.svg"
        ];
    }

    private static _data: IIntro;

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
                            src="/customize/intro/intro-logo.svg" 
                        />
                    </div>
                    <div
                        style={{
                            textAlign: "right",
                            paddingLeft: "10px"
                        }}
                    >
                        <div className="intro-title">
                            {Intro._data.title}
                        </div>
                        <div className="intro-subtitle">
                            {(() => {
                                if (!Intro._data.subtitle) {
                                    return;
                                }
                                const html = new DOMParser().parseFromString(Intro._data.subtitle, "text/html");
                                return html2React(html.body.innerHTML);
                            })()}
                        </div>
                    </div>
                </div>
                <div>
                    <img
                        ref={e => this._image = e as HTMLElement}
                        src="/customize/intro/intro-background.svg"
                    />
                    <div
                        style={{
                            backgroundColor: "#E0CFB6",
                            height: "2000px",
                            transform: "translate(0px, -2px)"
                        }}
                    />
                </div>
                <IntroButtons 
                    ref={e => this._introButtons = e as IntroButtons } 
                />
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
