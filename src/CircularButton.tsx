
import * as React from "react";
import { routerContext } from "./RouterContext";

interface ICircularButtonProps {
    radius: number;
    content: string | JSX.Element;
    color: string;
    url?: string;
    onClick?: () => void;
}

export class CircularButton extends React.Component<ICircularButtonProps> {
    public render() {
        const { radius, content, color, url, onClick } = this.props;
        return (
            <routerContext.Consumer>
                {({ history }) => {
                    return (
                        <button
                            className="circular-button clickable"
                            style={{
                                width: `${radius}px`,
                                height: `${radius}px`,
                                color: "black",
                                backgroundColor: color
                            }}
                            onClick={() => {
                                if (url) {
                                    history?.push(url);
                                } else if (onClick) {
                                    onClick();
                                }
                            }}
                        >
                            {content}
                        </button>
                    );
                }}
            </routerContext.Consumer>

        );
    }
}