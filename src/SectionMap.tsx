
import * as React from "react";
import { MapImage, IMapImageContent } from "./MapImage";
import { SectionType } from "./Types";
import { mapPositions } from "./MapPositions";
import { routerContext } from "./RouterContext";

interface ISectionMapProps {
    section: SectionType;
    sections: IMapImageContent[];
    index?: number;
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
        const { section, sections, index } = this.props;

        return (
            <div>
                <img
                    className="fill-parent"
                    ref={e => this._frame = e as HTMLImageElement}
                    src={`/public/${section}/map-paths.svg`}
                />
                <routerContext.Consumer>
                    {({ history }) => {
                        return sections.map((sectionProps, currentIndex) => {
                            return (
                                <MapImage
                                    key={currentIndex}
                                    content={sectionProps}
                                    ref={e => this._images[currentIndex] = e as MapImage}
                                    position={mapPositions[section][currentIndex]}
                                    greyedOut={index !== undefined && currentIndex !== index}
                                    onClick={() => {
                                        history?.push(`/${section}/${currentIndex + 1}`);
                                    }}
                                />
                            );
                        });
                    }}
                </routerContext.Consumer>
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
