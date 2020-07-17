
import * as React from "react";
import { LoadingIndicator } from "./LoadingIndicator";
import { Intro } from "./Intro";
import { Preloading } from "./Preloading";

interface IIntroContainerState {
    loaded: boolean;
}

export class IntroContainer extends React.Component<{}, IIntroContainerState> {
    
    constructor(props: {}) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    public componentDidMount() {
        Preloading.preloadIntro()
            .then(() => this.setState({ loaded: true }));
    }

    public render() {
        if (!this.state.loaded) {
            return <LoadingIndicator />;
        }

        return <Intro />;
    }
}
