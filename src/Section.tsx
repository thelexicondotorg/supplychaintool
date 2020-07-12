
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { SectionType } from "./Types";
import { LoadingIndicator } from "./LoadingIndicator";
import { SectionMap } from "./SectionMap";
import { Posts } from "./Posts";
import { IMapImageContent } from "./MapImage";

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
                                        <img src="http://wp-supplytool.franticsoftware.com/wp-content/uploads/2020/07/fonio-growers.png" />
                                        <div className="quadrant-image-caption">
                                            (Seeds of Digitaria exilis (Fonio), from the USA Agricultural Research Service)
                                        </div>
                                    </div>
                                    <div className="quadrant-text">
                                        <div className="quadrant-text-title">
                                            Grain Production
                                        </div>
                                        <div className="quadrant-text-title">
                                            Location: Tiebe, Mali, West Africa
                                        </div>
                                        <div className="quadrant-text-separator" />
                                        <div>
                                            500 Women smallholder farmers enter into verbal agreements with Farafena-Mali to grow fonio. Fonio is grown in four quarters in the village. Fonio is sown by hand at the end of May and matures in approximately 100 days, after which it is cut and sheathed by hand. Fonio is certified organic by Ecocert NOP/USD. Seed is selected from the previous year’s fonio crop
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="quadrant-cell">
                            <div className="card">
                                <div className="quadrant-title">Introduction</div>
                                <div
                                    style={{
                                        display: "flex"
                                    }}
                                >
                                    <div className="quadrant-image">
                                        <img src="https://wp-supplytool.franticsoftware.com/wp-content/uploads/2020/07/fonio-introduction.png" />
                                    </div>
                                    <div className="quadrant-text">
                                        The successful integration and expansion of biodiversity in food systems require upholding basic principles that represent significant changes in the predominant patterns of food production and trade. These principles support climate-friendly regenerative biodiverse farming practices, responsible and effective food businesses, healthy diets, and ensure fair benefit-sharing with producers and communities. Application of the ten principles identified here provide benefits to producers, communities, consumers, and other stakeholders in the food supply chain, and is aligned with broader efforts to develop sustainable, equitable and regenerative food systems, as well as responsible businesses.
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
