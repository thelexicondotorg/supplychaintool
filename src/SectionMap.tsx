
import * as React from "react";
import { MapImage, IMapImageProps } from "./MapImage";

interface ISectionMapProps {
    frame: string;
    sections: IMapImageProps[];
}

interface ISectionMapState {    
    activePage?: number;
}

export class SectionMap extends React.Component<ISectionMapProps, ISectionMapState> {

    private _frame!: HTMLElement;
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
        const { frame, sections } = this.props;

        return (
            <div>
                <img
                    className="fill-parent"
                    ref={e => this._frame = e as HTMLElement}
                    src={frame}

                />
                {sections.map((sectionProps, index) => {
                    return (
                        <MapImage
                            key={index}
                            {...sectionProps}
                            ref={e => this._images[index] = e as MapImage}
                        />
                    );
                })}
            </div>
        );
    }

    private onResize() {
        this._images.forEach(i => i.onResize(this._frame.getBoundingClientRect()));        
    }
}
