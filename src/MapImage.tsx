
import * as React from "react";

export interface IMapImageContent {
    image: string;
    title: string;
    subtitle?: string;
}

interface IMapImageProps {
    content: IMapImageContent;
    position: [number, number];
}

export class MapImage extends React.Component<IMapImageProps> {

    private _container!: HTMLElement;
    private _image!: HTMLImageElement;

    public render() {

        const { image, title, subtitle } = this.props.content;

        return (
            <div
                style={{
                    position: "absolute",
                    textAlign: "center"
                }}
                ref={e => this._container = e as HTMLElement}
            >
                <img
                    style={{ width: "100%" }}
                    src={image}
                    ref={e => this._image = e as HTMLImageElement}
                />
                <div className="map-elem-title">{title}</div>
                {subtitle && <div className="map-elem-subtitle">{subtitle}</div>}
            </div>
        );
    }

    public onResize(frame: HTMLImageElement) {
        const frameOrigSize = [frame.naturalWidth, frame.naturalHeight];

        // TODO get this from a definition table
        const imageOrigWidth = this._image.naturalWidth;
        const imageOrigPos = this.props.position;

        const { width, height } = frame.getBoundingClientRect();
        const ratio = width / height;
        const origRatio = frameOrigSize[0] / frameOrigSize[1];
        let imageWidth;
        if (ratio > origRatio) {
            // Center horizontally + 'bars' on the sides
            const sizeRatio = height / frameOrigSize[1];
            imageWidth = imageOrigWidth * sizeRatio;
            const newWidth = frameOrigSize[0] * sizeRatio;
            const offset = (width - newWidth) / 2;
            this._container.style.left = `${offset + imageOrigPos[0] * sizeRatio}px`;
            this._container.style.top = `${imageOrigPos[1] * sizeRatio}px`;
        } else {
            // Center vertically + 'bars' on top & bottom
            const sizeRatio = width / frameOrigSize[0];
            imageWidth = imageOrigWidth * sizeRatio;
            const newHeight = frameOrigSize[1] * sizeRatio;
            const offset = (height - newHeight) / 2;
            this._container.style.left = `${imageOrigPos[0] * sizeRatio}px`;
            this._container.style.top = `${offset + imageOrigPos[1] * sizeRatio}px`;
        }

        this._container.style.width = `${imageWidth}px`;
    }
}
