
import * as React from "react";
import { CircularButton } from "./CircularButton";
import { appContext } from "./AppContext";
import { SectionType } from "./Types";
import { Settings } from "./Settings";

interface IFooterProps {
    section: SectionType;
    onHelp: () => void;
}

export class Footer extends React.Component<IFooterProps> {
    public static get assetsToPreload() {
        return [
            "/customize/footer/footer-logo.svg"
        ];
    }

    public render() {        
        return (
            <div
                className="footer"
                style={{
                    backgroundColor: "#743F30",
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
                    <div className="footer-logo">
                        <appContext.Consumer>
                            {({ history, transition }) => {
                                return (
                                    <img
                                        className="clickable"
                                        style={{ marginLeft: "40px" }}
                                        src="/customize/footer/footer-logo.svg"
                                        onClick={() => transition?.(() => history?.push("/"))}
                                    />
                                );
                            }}
                        </appContext.Consumer>
                        <span
                            style={{
                                fontWeight: "bold",
                                paddingLeft: "20px"
                            }}
                        >
                            {Settings.data.footerText}
                        </span>
                    </div>
                    <div
                        style={{
                            marginRight: "30px",
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                            alignItems: "center"
                        }}
                    >
                        <span
                            style={{
                                fontWeight: "bold",
                                marginRight: "20px"
                            }}
                        >
                            {Settings.data.supplyChains[this.props.section].footerText}
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
