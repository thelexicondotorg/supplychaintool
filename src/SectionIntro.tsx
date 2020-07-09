
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { SectionType } from "./Types";
import { LoadingIndicator } from "./LoadingIndicator";

interface ISectionIntroProps {
    section: SectionType;
    index?: number;
}

interface ISectionIntroState {
    // tslint:disable-next-line
    data: any;
    requestId?: string;
}

export class SectionIntro extends React.Component<ISectionIntroProps & RouteComponentProps, ISectionIntroState> {

    constructor(props: ISectionIntroProps & RouteComponentProps) {
        super(props);
        this.state = {
            data: null
        };
    }

    public componentDidMount() {

    }

    public componentWillUnmount() {

    }

    public render() {
        const { data } = this.state;
        if (!data) {
            return <LoadingIndicator />;
        }
        
        return (
            <div>
                <img src="/public/fonio/intro.svg" />
            </div>
        );
    }
}
