
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
    data?: {
        intro: string;
        posts: string[];
    };
}

export class Section extends React.Component<ISectionIntroProps & RouteComponentProps, ISectionState> {

    constructor(props: ISectionIntroProps & RouteComponentProps) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        Posts.load(this.props.section)
            .then(({ intro, posts }) => this.setState({ data: { intro, posts } }));
    }

    public componentWillUnmount() {
    }

    public render() {
        const { data } = this.state;
        if (!(data)) {
            return <LoadingIndicator />;
        }

        const { intro, posts } = data;
        const { section, index } = this.props;

        if (index === undefined) {
            const tree = new DOMParser().parseFromString(intro, "text/html");            
            let sections: IMapImageContent[] = [];
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

                </div>
            );
        }        
    }
}
