
import * as React from "react";
import { SectionType } from "./Types";
import { LoadingIndicator } from "./LoadingIndicator";
import { SectionMap } from "./SectionMap";
import { Posts } from "./Posts";
import { Captions } from "./Captions";
import { Footer } from "./Footer";
import { TableRow } from "./TableRow";
import { HelpPopup } from "./HelpPopup";
import { Categories } from "./Categories";
import { Images } from "./Images";

interface ISectionIntroProps {
    section: SectionType;
    index?: string;
    showHelpOnStart: boolean;
    onHelpClosed: () => void;
}

interface ISectionState {
    loaded: {
        [category: string]: boolean;
    };
    currentPrinciple?: number;
    helpVisible: boolean;
}

export class Section extends React.Component<ISectionIntroProps, ISectionState> {

    private _mounted = true;

    constructor(props: ISectionIntroProps) {
        super(props);
        this.state = { 
            loaded: {},
            helpVisible: props.showHelpOnStart
        };
    }

    public componentDidMount() {
        this._mounted = true;
        const { section } = this.props;
        Promise.all([
            Categories.load(),
            Captions.load()
        ])
            .then(() => Posts.load(section))

            // Preload content
            .then(() => {          
                const sections = Posts.getSections(section);
                const principles = Posts.getPrinciples(section);
                return Images.preload([
                    // Map section
                    SectionMap.mapPath(section),
                    ...sections.map(s => s.image),
                    
                    // Posts
                    ...Array.from(Array(sections.length).keys()).map(index => {
                        return Posts.getPost(section, index).article.image;
                    }),

                    // Principles
                    principles.intro.image,
                    ...principles.principles.map(p => p.image)
                ]);
            })            
            .then(() => {
                if (!this._mounted) {
                    return;
                }
                this.setState({
                    loaded: {
                        ...this.state.loaded,
                        ...{ [section]: true }
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
                    <div className="quadrants-root fill-parent">
                        <div className="quadrant-col">
                            <div className="quadrant-cell left map">
                                <SectionMap
                                    section={section}
                                    index={postIndex}
                                />
                            </div>
                            <div
                                className="quadrant-cell left"
                                style={{
                                    paddingTop: "10px"
                                }}
                            >
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
                                            {post.article.contentElem}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="quadrant-col principles">
                            <div className="quadrant-cell">
                                <div className="card">
                                    <div className="table-quadrant-title">
                                        How the <b>{post.title}</b> contribute to agrobiodiversity principles.
                                    </div>
                                    <div>
                                        <TableRow
                                            left={(
                                                <span style={{ fontWeight: "bold"}}>
                                                    Agrobiodiversity Principles
                                                </span>
                                            )}
                                            right={(
                                                <span style={{ fontWeight: "bold"}}>
                                                    Contributes to
                                                </span>
                                            )}
                                        />
                                        {
                                            post.contributions.map((contribution, i) => {
                                                return (
                                                    <div
                                                        key={i}
                                                        className={
                                                            `principle ${i === currentPrinciple ? "active" : ""}`
                                                        }
                                                        onClick={() => this.setState({ currentPrinciple: i })}
                                                    >
                                                        <TableRow
                                                            left={`${i + 1}. ${principles.principles[i].name}`}
                                                            right={
                                                                contribution.contributes
                                                                    ?
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
                                                                    :
                                                                    <div />
                                                            }
                                                        />
                                                    </div>

                                                );
                                            })
                                        }
                                    </div>

                                </div>
                            </div>
                            <div
                                className="quadrant-cell"
                                style={{
                                    paddingTop: "10px"
                                }}
                            >
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
                                            <div className="quadrant-title">
                                                {(() => {
                                                    if (currentPrinciple === undefined) {
                                                        return data.name;
                                                    } else {
                                                        return `${currentPrinciple + 1}. ${data.name}`;
                                                    }
                                                })()}
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex"
                                                }}
                                            >
                                                <div className="quadrant-image">
                                                    <img src={data.image} />
                                                    <div className="quadrant-image-caption">
                                                        {Captions.get(data.image)}
                                                    </div>
                                                </div>
                                                <div className="quadrant-text">
                                                    {data.content.map((c, i) => <p key={i}>{c}</p>)}
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
                    className="main-area"
                    style={{
                        overflow: "auto",
                        position: "relative"
                    }}
                >
                    {makeContent()}
                </div>
                <Footer 
                    section={this.props.section}
                    onHelp={() => this.setState({ helpVisible: true })} 
                />
                <HelpPopup
                    visible={this.state.helpVisible}
                    onClose={() => {
                        this.setState({ helpVisible: false });
                        if (this.props.showHelpOnStart) {
                            this.props.onHelpClosed();
                        }
                    }}
                />
            </div>
        );
    }
}
