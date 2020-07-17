
import * as React from "react";
import { appContext } from "./AppContext";

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
            <appContext.Consumer>
                {({ history }) => {
                    return (
                        <button
                            className="circular-button clickable"
                            style={{
                                width: `${radius}px`,
                                height: `${radius}px`,
                                backgroundColor: color
                            }}
                            onClick={e => {
                                if (url) {
                                    history?.push(url);
                                } else if (onClick) {
                                    onClick();
                                    e.stopPropagation();
                                }
                            }}
                        >
                            {content}
                        </button>
                    );
                }}
            </appContext.Consumer>

        );
    }
}
