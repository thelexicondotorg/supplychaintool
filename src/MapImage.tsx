
import * as React from "react";

export interface IMapImageContent {
    image: string;
    title: string;
    subtitle?: string;
}

interface IMapImageProps {
    content: IMapImageContent;
    position: [number, number];
    greyedOut: boolean;
    onClick: () => void;
}

export class MapImage extends React.Component<IMapImageProps> {

    private _container!: HTMLElement;
    private _image!: HTMLImageElement;
    private _frameSize?: [number, number];
    private _frameOrigSize?: [number, number];

    public render() {
        const { image, title, subtitle } = this.props.content;
        const { greyedOut } = this.props;

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
                />
                <div className="map-elem-title">{title}</div>
                {subtitle && <div>{subtitle}</div>}
            </div>
        );
    }

    public onResize(frame: HTMLImageElement) {
        const { width, height } = frame.getBoundingClientRect();
        this._frameSize = [width, height];
        this._frameOrigSize = [frame.naturalWidth, frame.naturalHeight];
        this.resize();
    }

    private resize() {
        if (this._image.naturalWidth === 0
            || !this._frameSize
            || !this._frameOrigSize) {
            return;
        }
        const imageOrigWidth = this._image.naturalWidth;
        const imageOrigPos = this.props.position;

        const [width, height] = this._frameSize;
        const ratio = width / height;
        const origRatio = this._frameOrigSize[0] / this._frameOrigSize[1];
        if (ratio > origRatio) {
            // Center horizontally + 'bars' on the sides
            const sizeRatio = height / this._frameOrigSize[1];
            const newWidth = this._frameOrigSize[0] * sizeRatio;
            const offset = (width - newWidth) / 2;
            this._container.style.left = `${offset + imageOrigPos[0] * sizeRatio}px`;
            this._container.style.top = `${imageOrigPos[1] * sizeRatio}px`;
            this._container.style.width = `${imageOrigWidth * sizeRatio}px`;
        } else {
            // Center vertically + 'bars' on top & bottom
            const sizeRatio = width / this._frameOrigSize[0];
            const newHeight = this._frameOrigSize[1] * sizeRatio;
            const offset = (height - newHeight) / 2;
            this._container.style.left = `${imageOrigPos[0] * sizeRatio}px`;
            this._container.style.top = `${offset + imageOrigPos[1] * sizeRatio}px`;
            this._container.style.width = `${imageOrigWidth * sizeRatio}px`;
        }
    }
}
