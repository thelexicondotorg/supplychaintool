
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { SectionType } from "./Types";
import { LoadingIndicator } from "./LoadingIndicator";
import { SectionMap } from "./SectionMap";
import { Posts } from "./Posts";
import { IMapImageContent } from "./MapImage";
import { Captions } from "./Captions";

interface ISectionIntroProps {
    section: SectionType;
    index?: string;
}

interface ISectionState {
    loaded: {
        [category: string]: boolean;
    };
}

export class Section extends React.Component<ISectionIntroProps, ISectionState> {

    private _mounted = true;

    constructor(props: ISectionIntroProps) {
        super(props);
        this.state = { loaded: {} };
    }

    public componentDidMount() {
        this._mounted = true;
        Posts.load(this.props.section)
            .then(() => {
                if (!this._mounted) {
                    return;
                }
                this.setState({
                    loaded: {
                        ...this.state.loaded,
                        ...{ [this.props.section]: true }
                    }
                });
            });
    }

    public componentWillUnmount() {
        this._mounted = false;
    }

    public render() {
        const loaded = this.state.loaded[this.props.section];
        if (!loaded) {
            return <LoadingIndicator />;
        }

        const { section, index } = this.props;
        if (index === undefined) {
            return (
                <SectionMap
                    section={this.props.section}
                    sections={Posts.getIntroSections(this.props.section)}
                />
            );
        } else {
            const postIndex = parseInt(index, 10) - 1;
            const post = Posts.getPost(this.props.section, postIndex);
            return (
                <div className="fill-parent">
                    <div className="quadrant-row">
                        <div className="quadrant-cell">
                            <div className="card">
                                <SectionMap
                                    section={this.props.section}
                                    sections={Posts.getIntroSections(this.props.section)}
                                    index={postIndex}
                                />
                            </div>
                        </div>
                        <div className="quadrant-cell">
                            <div className="card">
                                <div className="table-quadrant-title">
                                    How the <b>{post.title}</b> contribute to agrobiodiversity principles.
                                </div>
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse"
                                    }}
                                >
                                    <tbody>
                                        <tr style={{ fontWeight: "bold" }}>
                                            <td className="table-quadrant-col1">
                                                Agrobiodiversity Principles
                                    </td>
                                            <td
                                                style={{
                                                    textAlign: "center",
                                                    borderBottom: "1px solid #E0E0E0"
                                                }}
                                            >
                                                Contributes to
                                    </td>
                                        </tr>
                                        <tr>
                                            <td className="table-quadrant-col1">1. Promote Healthy Soils</td>
                                            <td>
                                                <div
                                                    style={{
                                                        backgroundColor: "#F77E0B",
                                                        borderRadius: "50%",
                                                        width: "18px",
                                                        height: "18px",
                                                        margin: "0 auto"
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="table-quadrant-col1">2. Increase Resilience to Climate change, Economic Fluctuations and shocks</td>
                                            <td>
                                                <div
                                                    style={{
                                                        backgroundColor: "#F77E0B",
                                                        borderRadius: "50%",
                                                        width: "18px",
                                                        height: "18px",
                                                        margin: "0 auto"
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="quadrant-row">
                        <div className="quadrant-cell">
                            <div className="card">
                                <div className="quadrant-title">{post.title}</div>
                                <div
                                    style={{
                                        display: "flex"
                                    }}
                                >
                                    <div className="quadrant-image">
                                        <img src={post.articles[0].image} />
                                        <div className="quadrant-image-caption">
                                            {Captions.get(post.articles[0].image)}
                                        </div>
                                    </div>
                                    <div className="quadrant-text">
                                        <div className="quadrant-text-title">
                                            {post.articles[0].title}
                                        </div>
                                        {
                                            post.articles[0].subTitle
                                            &&
                                            (
                                                <div className="quadrant-text-title">
                                                    {post.articles[0].subTitle}
                                                </div>
                                            )
                                        }                                        
                                        <div className="quadrant-text-separator" />
                                        <div>
                                            {post.articles[0].content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="quadrant-cell">
                            <div className="card">
                                <div className="quadrant-title">{post.articles[1].title}</div>
                                <div
                                    style={{
                                        display: "flex"
                                    }}
                                >
                                    <div className="quadrant-image">
                                        <img src={post.articles[1].image} />
                                    </div>
                                    <div className="quadrant-text">
                                        {post.articles[1].content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
