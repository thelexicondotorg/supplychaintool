
import * as React from "react";
import { MapImage } from "./MapImage";
import { SectionType } from "./Types";
import { mapPositions } from "./MapPositions";
import { routerContext } from "./RouterContext";
import { Posts } from "./Posts";

interface ISectionMapProps {
    section: SectionType;
    index?: number;
}

interface ISectionMapState {
    hoveredImage?: number;
}

export class SectionMap extends React.Component<ISectionMapProps, ISectionMapState> {

    private _root!: HTMLElement;
    private _frame!: HTMLImageElement;
    private _images: MapImage[] = [];

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
        const isFullscreen = index === undefined;
        const sections = Posts.getIntroSections(section);

        return (
            <div 
                style={{
                    position: "relative"
                }}
                ref={e => this._root = e as HTMLElement}
            >
                <img
                    style={{ 
                        width: "100%",
                        height: isFullscreen ? "100%" : undefined
                    }}
                    ref={e => this._frame = e as HTMLImageElement}
                    src={`/public/${section}/map-paths.svg`}
                    onLoad={() => this.onResize()}
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
                                    greyedOut={(() => {
                                        if (isFullscreen) {
                                            return false;
                                        }
                                        if (hoveredImage !== undefined) {
                                            return currentIndex !== hoveredImage;
                                        }
                                        return currentIndex !== index;
                                    })()}
                                    onClick={() => {
                                        history?.push(`/${section}/${currentIndex + 1}`);
                                    }}
                                    onMouseOver={() => {
                                        if (!isFullscreen) {
                                            this.setState({ hoveredImage: currentIndex });
                                        }
                                    }}
                                    onMouseOut={() => {
                                        if (!isFullscreen) {
                                            this.setState({ hoveredImage: undefined });
                                        }
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

        const { width, height } = this._frame.getBoundingClientRect();
        this._root.style.fontSize = `${Math.min(width, height) / 55}px`;
    }
}
