
import * as React from "react";
import { MapImage } from "./MapImage";
import { SectionType } from "./Types";
import { appContext } from "./AppContext";
import { Posts } from "./Posts";
import { Categories } from "./Categories";

interface ISectionMapProps {
    section: SectionType;
    index?: number;
}

interface ISectionMapState {
    hoveredImage?: number;
}

export class SectionMap extends React.Component<ISectionMapProps, ISectionMapState> {

    public static mapPath(section: string) {
        return `/customize/supplychains/${section}-map.svg`;
    }

    private _root!: HTMLElement;
    private _frame!: HTMLImageElement;
    private _images: MapImage[] = [];
    private get isFullscreen() { return this.props.index === undefined; }

    constructor(props: ISectionMapProps) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        this.onResize = this.onResize.bind(this);
        window.addEventListener("resize", this.onResize);
        this.onResize();
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    public render() {
        const { section, index } = this.props;
        const { hoveredImage } = this.state;
        const sections = Posts.getSections(section);

        return (
            <div 
                style={{                    
                    position: "relative"
                }}
                ref={e => this._root = e as HTMLElement}
            >
                <img
                    className={this.isFullscreen ? "fill-parent" : "map-image"}
                    ref={e => this._frame = e as HTMLImageElement}
                    src={SectionMap.mapPath(section)}
                    onLoad={() => this.onResize()}
                />
                <appContext.Consumer>
                    {({ history, transition }) => {
                        const { mapMetrics } = Categories.get(section).info;
                        return sections.map((sectionProps, currentIndex) => {
                            return (
                                <MapImage
                                    key={currentIndex}
                                    content={sectionProps}
                                    ref={e => this._images[currentIndex] = e as MapImage}
                                    frameOrigSize={mapMetrics.frameSize}
                                    position={mapMetrics.iconPositions[currentIndex]}
                                    fullScreen={this.isFullscreen}
                                    greyedOut={(() => {
                                        if (this.isFullscreen) {
                                            return false;
                                        }
                                        if (hoveredImage !== undefined) {
                                            return currentIndex !== hoveredImage;
                                        }
                                        return currentIndex !== index;
                                    })()}
                                    onClick={() => {
                                        const go = () => history?.push(`/${section}/${currentIndex + 1}`);
                                        if (this.isFullscreen) {
                                            transition?.(go);
                                        } else {
                                            go();
                                        }
                                    }}
                                    onMouseOver={() => {
                                        if (!this.isFullscreen) {
                                            this.setState({ hoveredImage: currentIndex });
                                        }
                                    }}
                                    onMouseOut={() => {
                                        if (!this.isFullscreen) {
                                            this.setState({ hoveredImage: undefined });
                                        }
                                    }}
                                />
                            );
                        });
                    }}
                </appContext.Consumer>
            </div>
        );
    }

    private onResize() {
        if (this._frame.naturalWidth === 0) {
            this._images.forEach(i => i.visible = false);
            return;
        }
        this._images.forEach(i => i.onResize(this._frame));

        const ratio = this.isFullscreen ? 55 : 49;
        const { width, height } = this._frame.getBoundingClientRect();
        this._root.style.fontSize = `${Math.min(width, height) / ratio}px`;
    }
}
