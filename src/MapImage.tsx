
import * as React from "react";

export interface IMapImageProps {
    image: string;
    title: string;
    subtitle?: string;
}

export class MapImage extends React.Component<IMapImageProps> {

    private _image!: HTMLElement;

    public render() {

        const { image, title, subtitle } = this.props; // /public/fonio/1-growers.svg

        return (
            <div
                style={{
                    position: "absolute",
                    textAlign: "center"
                }}
                ref={e => this._image = e as HTMLElement}
            >
                <img
                    style={{ width: "100%" }}
                    src={image}
                />
                <div className="map-elem-title">{title}</div>
                {subtitle && <div className="map-elem-subtitle">{subtitle}</div>}
            </div>
        );
    }

    public onResize(frameRect: DOMRect) {
        const frameOrigSize = [1650, 899];

        // TODO get this from a definition table
        const imageOrigWidth = 414.315;
        const imageOrigPos = [355.938, 415.541];

        const { width, height } = frameRect;
        const ratio = width / height;
        const origRatio = frameOrigSize[0] / frameOrigSize[1];
        let imageWidth;
        if (ratio > origRatio) {
            // Center horizontally + 'bars' on the sides
            const sizeRatio = height / frameOrigSize[1];
            imageWidth = imageOrigWidth * sizeRatio;
            const newWidth = frameOrigSize[0] * sizeRatio;
            const offset = (width - newWidth) / 2;
            this._image.style.left = `${offset + imageOrigPos[0] * sizeRatio}px`;
            this._image.style.top = `${imageOrigPos[1] * sizeRatio}px`;
        } else {
            // Center vertically + 'bars' on top & bottom
            const sizeRatio = width / frameOrigSize[0];
            imageWidth = imageOrigWidth * sizeRatio;
            const newHeight = frameOrigSize[1] * sizeRatio;
            const offset = (height - newHeight) / 2;
            this._image.style.left = `${imageOrigPos[0] * sizeRatio}px`;
            this._image.style.top = `${offset + imageOrigPos[1] * sizeRatio}px`;
        }

        this._image.style.width = `${imageWidth}px`;
    }
}
