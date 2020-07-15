
import * as React from "react";
import { CircularButton } from "./CircularButton";
import { routerContext } from "./RouterContext";

interface IFooterProps {
    onHelp: () => void;
}

export class Footer extends React.Component<IFooterProps> {
    public static get height() { return "75px"; }

    public render() {
        return (
            <div
                style={{
                    height: Footer.height,
                    backgroundColor: "#743F30"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        height: "100%",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "white"
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: ".6fr 1fr"
                        }}
                    >
                        <routerContext.Consumer>
                            {({ history }) => {
                                return (
                                    <img
                                        className="clickable"
                                        style={{
                                            marginLeft: "40px"
                                        }}
                                        src="/public/footer/footer-logo.svg"
                                        onClick={() => history?.push("/")}
                                    />
                                );
                            }}
                        </routerContext.Consumer>
                        <span
                            style={{
                                alignSelf: "center",
                                fontWeight: "bold"
                            }}
                        >
                            {"Agrobiodiversity + Transparency".toUpperCase()}
                        </span>
                    </div>
                    <div
                        style={{
                            marginRight: "30px"
                        }}
                    >
                        <span
                            style={{
                                fontWeight: "bold",
                                marginRight: "20px"
                            }}
                        >
                            FONIO SUPPLY CHAIN
                        </span>
                        <CircularButton
                            radius={30}
                            color="white"
                            content={<span style={{ fontSize: "18px" }}>?</span>}
                            onClick={this.props.onHelp}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
