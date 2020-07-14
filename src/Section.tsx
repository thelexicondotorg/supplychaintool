
import * as React from "react";
import { SectionType } from "./Types";
import { LoadingIndicator } from "./LoadingIndicator";
import { SectionMap } from "./SectionMap";
import { Posts } from "./Posts";
import { Captions } from "./Captions";
import { Footer } from "./Footer";

interface ISectionIntroProps {
    section: SectionType;
    index?: string;
}

interface ISectionState {
    loaded: {
        [category: string]: boolean;
    };
    currentPrinciple?: number;
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

        const makeContent = () => {
            const { section, index } = this.props;
            if (index === undefined) {
                return <SectionMap section={section} />;
            } else {
                const postIndex = parseInt(index, 10) - 1;
                const post = Posts.getPost(section, postIndex);
                const principles = Posts.getPrinciples(section);
                const { currentPrinciple } = this.state;
                return (
                    <div className="fill-parent">
                        <div className="quadrant-row">
                            <div
                                className="quadrant-cell map"
                            >
                                <div className="card">
                                    <SectionMap
                                        section={section}
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
                                            borderCollapse: "collapse",
                                            fontSize: "14px"
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
                                            {
                                                post.contributions.map((contribution, i) => {
                                                    return (
                                                        <tr
                                                            key={i}
                                                            className={`principle ${i === currentPrinciple ? "active" : ""}`}
                                                            onClick={() => {
                                                                this.setState({ currentPrinciple: i });
                                                            }}
                                                        >
                                                            <td className="table-quadrant-col1">
                                                                {i + 1}. {contribution.principleName}
                                                            </td>
                                                            <td>
                                                                {
                                                                    contribution.contributes
                                                                    &&
                                                                    (
                                                                        <div
                                                                            style={{
                                                                                backgroundColor: "#F77E0B",
                                                                                borderRadius: "50%",
                                                                                width: "14px",
                                                                                height: "14px",
                                                                                margin: "0 auto"
                                                                            }}
                                                                        />
                                                                    )
                                                                }
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            }
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
                                            <img src={post.article.image} />
                                            <div className="quadrant-image-caption">
                                                {Captions.get(post.article.image)}
                                            </div>
                                        </div>
                                        <div className="quadrant-text">
                                            <div className="quadrant-text-title">
                                                {post.article.title}
                                            </div>
                                            {
                                                post.article.subTitle
                                                &&
                                                (
                                                    <div className="quadrant-text-title">
                                                        {post.article.subTitle}
                                                    </div>
                                                )
                                            }
                                            <div className="quadrant-text-separator" />
                                            <div>
                                                {post.article.content}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="quadrant-cell">
                                {(() => {
                                    const data = (() => {
                                        if (currentPrinciple === undefined) {
                                            return principles.intro;
                                        } else {
                                            return principles.principles[currentPrinciple];
                                        }
                                    })();
                                    return (
                                        <div className="card">
                                            <div className="quadrant-title">{data.name}</div>
                                            <div
                                                style={{
                                                    display: "flex"
                                                }}
                                            >
                                                <div className="quadrant-image">
                                                    <img src={data.image} />
                                                </div>
                                                <div className="quadrant-text">
                                                    {data.content}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                );
            }
        };

        return (
            <div className="fill-parent">
                <div
                    style={{
                        height: `calc(100% - ${Footer.height})`,
                        overflow: "auto",
                        position: "relative"
                    }}
                >
                    {makeContent()}
                </div>
                <Footer />
            </div>
        );
    }
}
