
import * as React from "react";
import { appContext } from "./AppContext";

interface ICircularButtonProps {
    radius: number;
    content: string | JSX.Element;
    color: string;
    onClick: () => void;
}

export class CircularButton extends React.Component<ICircularButtonProps> {

    public get root() { return this._root; }

    private _root!: HTMLElement;

    public render() {
        const { radius, content, color, onClick } = this.props;
        return (
            <appContext.Consumer>
                {({ history }) => {
                    return (
                        <button
                            ref={e => this._root = e as HTMLElement}
                            className="circular-button clickable"
                            style={{
                                width: `${radius}px`,
                                height: `${radius}px`,
                                backgroundColor: color
                            }}
                            onClick={e => {
                                e.stopPropagation();
                                onClick();
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
