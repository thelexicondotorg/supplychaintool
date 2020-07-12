
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { SectionType } from "./Types";
import { LoadingIndicator } from "./LoadingIndicator";
import { SectionMap } from "./SectionMap";
import { Posts } from "./Posts";
import { IMapImageContent } from "./MapImage";

interface ISectionIntroProps {
    section: SectionType;
    index?: number;
}

interface ISectionState {
    loaded: {
        [category: string]: boolean;
    };
}

export class Section extends React.Component<ISectionIntroProps, ISectionState> {

    constructor(props: ISectionIntroProps) {
        super(props);
        this.state = { loaded: {} };
    }

    public componentDidMount() {
        Posts.load(this.props.section)
            .then(() => this.setState({
                loaded: {
                    ...this.state.loaded,
                    ...{ [this.props.section]: true }
                }                
            }));
    }

    public componentWillUnmount() {
    }

    public render() {
        const loaded = this.state.loaded[this.props.section];
        if (!loaded) {
            return <LoadingIndicator />;
        }        
        
        const { section, index } = this.props;
        const post = Posts.get(section, index);
        const tree = new DOMParser().parseFromString(post, "text/html");

        if (index === undefined) {
            const sections: IMapImageContent[] = [];
            // tslint:disable-next-line
            for (let i = 0; i < tree.body.children.length; ++i) {
                const child = tree.body.children[i];
                const imageElem = child.querySelector("div > figure > img");
                const titleElem = child.querySelector("div > div > p");
                const subtitleElem = child.querySelector("div > div > p + p");
                if (imageElem && titleElem) {
                    const image = (imageElem as HTMLImageElement).src;
                    const title = (titleElem as HTMLParagraphElement).innerText;
                    const subtitle = (subtitleElem as HTMLParagraphElement)?.innerText;
                    sections.push({
                        image,
                        title,
                        subtitle
                    });
                }
            }
            return (
                <SectionMap
                    section={this.props.section}
                    sections={sections}
                />
            );
        } else {
            
            return (
                <div>
                    subsection
                </div>
            );
        }
    }
}
