
import * as React from "react";
import { CircularButton } from "./CircularButton";
import { appContext } from "./AppContext";
import { SectionType } from "./Types";

interface IFooterProps {
    section: SectionType;
    onHelp: () => void;
}

export class Footer extends React.Component<IFooterProps> {
    public static get height() { return "75px"; }

    public static get assetsToPreload() {
        return [
            "/public/footer/footer-logo.svg"
        ];
    }

    private static readonly config = {
        supplyChainText: {
            "fonio": "FONIO SUPPLY CHAIN",
            "amaranth-local": "AMARANTH SUPPLY CHAIN: LOCAL",
            "amaranth-intl": "AMARANTH SUPPLY CHAIN: INTERNATIONAL",
            "small-millets": "SMALL MILLET SUPPLEY CHAIN"
        }
    };

    public render() {
        return (
            <div
                className="footer"
                style={{
                    height: Footer.height,
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
                                        src="/public/footer/footer-logo.svg"
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
                            {"Agrobiodiversity + Transparency".toUpperCase()}
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
                            {Footer.config.supplyChainText[this.props.section]}
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
