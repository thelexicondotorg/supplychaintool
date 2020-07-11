
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { SectionType } from "./Types";
import { LoadingIndicator } from "./LoadingIndicator";
import { SectionMap } from "./SectionMap";

interface ISectionIntroProps {
    section: SectionType;
    index?: number;
}

interface ISectionIntroState {
    // tslint:disable-next-line
    data: any;
}

export class Section extends React.Component<ISectionIntroProps & RouteComponentProps, ISectionIntroState> {

    private _requestId?: string;

    constructor(props: ISectionIntroProps & RouteComponentProps) {
        super(props);
        this.state = {
            data: null
        };
    }

    public componentDidMount() {
        const { data } = this.state;
        if (!data) {
            // request this sections' data
        }
    }

    public componentWillUnmount() {
    }

    public render() {
        // const { data } = this.state;
        // if (!data) {
        //     return <LoadingIndicator />;
        // }
        
        const { section } = this.props;
        return (
            <SectionMap
                section={this.props.section}
                // Get this from wordpress
                sections={[
                    {
                        image: "/public/fonio/1-growers.svg",
                        title: "FONIO GROWERS",
                        subtitle: "500 Women Smallholder Farmers grow fonio with practices that provide livelihoods for their families, better nutritional outcomes and improved soils."
                    }
                ]}
            />
        );
    }
}
