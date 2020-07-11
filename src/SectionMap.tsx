
import * as React from "react";
import { MapImage, IMapImageContent } from "./MapImage";
import { SectionType } from "./Types";
import { mapPositions } from "./MapPositions";

interface ISectionMapProps {
    section: SectionType;
    sections: IMapImageContent[];
}

interface ISectionMapState {    
    activePage?: number;
}

export class SectionMap extends React.Component<ISectionMapProps, ISectionMapState> {

    private _frame!: HTMLImageElement;
    private _images: MapImage[] = [];

    constructor(props: ISectionMapProps) {
        super(props);
        this.state = {};       
    }

    public componentDidMount() {
        this.onResize = this.onResize.bind(this);
        window.addEventListener("resize", this.onResize);

        if (this._frame.naturalWidth === 0) {
            this._frame.onload = () => this.onResize();
        } else {
            this.onResize();
        }
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    public render() {
        const { section, sections } = this.props;

        return (
            <div>
                <img
                    className="fill-parent"
                    ref={e => this._frame = e as HTMLImageElement}
                    src={`/public/${section}/map-paths.svg`}
                />
                {sections.map((sectionProps, index) => {
                    return (
                        <MapImage
                            key={index}
                            content={sectionProps}
                            ref={e => this._images[index] = e as MapImage}
                            position={mapPositions[section][index]}
                        />
                    );
                })}
            </div>
        );
    }

    private onResize() {
        if (this._frame.naturalWidth === 0) {
            return;
        }
        this._images.forEach(i => i.onResize(this._frame));        
    }
}
