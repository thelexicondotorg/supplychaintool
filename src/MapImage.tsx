
import * as React from "react";

export interface IMapImageContent {
    image: string;
    title: string;
    subtitle?: string;
}

interface IMapImageProps {
    content: IMapImageContent;
    position: [number, number];
    frameOrigSize: [number, number];
    greyedOut: boolean;
    fullScreen: boolean;
    onClick: () => void;
    onMouseOver: () => void;
    onMouseOut: () => void;
}

export class MapImage extends React.Component<IMapImageProps> {

    private _container!: HTMLElement;
    private _image!: HTMLImageElement;
    private _frameSize?: [number, number];

    public set visible(visible: boolean) { 
        this._container.style.display = visible ? "block" : "none"; 
    }

    public render() {
        const { image, title, subtitle } = this.props.content;
        const { greyedOut, fullScreen } = this.props;

        return (
            <div
                style={{
                    position: "absolute",
                    textAlign: "center"
                }}
                ref={e => this._container = e as HTMLElement}
            >
                <img
                    className={`clickable ${greyedOut ? "greyed-out" : ""}`}
                    style={{ width: "100%" }}
                    src={image}
                    ref={e => this._image = e as HTMLImageElement}
                    onLoad={() => this.resize()}
                    onClick={this.props.onClick}
                    onMouseOver={this.props.onMouseOver}
                    onMouseOut={this.props.onMouseOut}
                />
                <div 
                    className="map-elem-title"
                    style={{
                        fontSize: fullScreen ? undefined : "11.5px"
                    }}
                >
                        {title}
                </div>
                {subtitle && <div>{subtitle}</div>}
            </div>
        );
    }

    public onResize(frame: HTMLImageElement) {
        const { width, height } = frame.getBoundingClientRect();
        this._frameSize = [width, height];
        this.resize();
    }

    private resize() {
        if (this._image.naturalWidth === 0 || !this._frameSize) {
            this.visible = false;
            return;
        }

        this.visible = true;
        const imageOrigSize = [this._image.naturalWidth, this._image.naturalHeight];
        const imageOrigPos = this.props.position;

        const [width, height] = this._frameSize;
        const ratio = width / height;
        const [origWidth, origHeight] = this.props.frameOrigSize;
        const origRatio = origWidth / origHeight;

        // Y is inverted in SVG
        const imageY = origHeight - imageOrigPos[1] - imageOrigSize[1];

        if (ratio > origRatio) {
            // Center horizontally + 'bars' on the sides
            const sizeRatio = height / origHeight;
            const newWidth = origWidth * sizeRatio;
            const offset = (width - newWidth) / 2;
            this._container.style.left = `${offset + imageOrigPos[0] * sizeRatio}px`;
            this._container.style.top = `${imageY * sizeRatio}px`;
            this._container.style.width = `${imageOrigSize[0] * sizeRatio}px`;
        } else {
            // Center vertically + 'bars' on top & bottom
            const sizeRatio = width / origWidth;
            const newHeight = origHeight * sizeRatio;
            const offset = (height - newHeight) / 2;
            this._container.style.left = `${imageOrigPos[0] * sizeRatio}px`;
            this._container.style.top = `${offset + imageY * sizeRatio}px`;
            this._container.style.width = `${imageOrigSize[0] * sizeRatio}px`;
        }
    }
}
