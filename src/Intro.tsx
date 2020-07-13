
import * as React from "react";
import { CircularButton } from "./CircularButton";

export class Intro extends React.Component {
    public render() {

        const makeButton = (name: string, location: string) => {
            return (
                <span>
                    <span 
                        style={{ 
                            fontWeight: "bold",
                            fontSize: "20px" 
                        }}
                    >
                        {name}
                        <br></br>
                        {location}
                    </span>
                    <br></br>
                    <span
                        style={{
                            fontSize: "14px",
                            fontWeight: "normal"
                        }}
                    >
                        Click to explore
                    </span>
                </span>
            );
        };

        return (
            <div className="fill-parent">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "40px",
                        paddingBottom: "0px"
                    }}
                >
                    <div>
                        <img src="/public/intro/logo.svg" />
                    </div>
                    <div
                        style={{
                            textAlign: "right",
                            paddingLeft: "10px"
                        }}
                    >
                        <div
                            style={{
                                fontSize: "44px",
                                fontWeight: "bold"
                            }}
                        >
                            Three continents. Three Grains. Three Supply Chains
                        </div>
                        <div
                            style={{
                                fontSize: "20px",
                                paddingTop: "8px"
                            }}
                        >
                            {"Can Transparency bring greater agrobiodiversity to our food systems?".toUpperCase()}
                        </div>
                    </div>
                </div>
                <div>

                </div>
                <div
                    style={{
                        position: "absolute",
                        bottom: "25px",
                        left: "10%",
                        width: "80%",
                        display: "flex",
                        justifyContent: "space-around"
                    }}
                >
                    <CircularButton
                        radius={180}
                        color="#FBB040"
                        content={makeButton("FONIO", "West Africa")}
                        url="/fonio"
                    />
                    <CircularButton
                        radius={180}
                        color="#E23F39"
                        content={makeButton("AMARANTH", "Mexico")}
                        url="/amaranth-local"
                    />
                    <CircularButton
                        radius={180}
                        color="#27A33E"
                        content={makeButton("SMALL MILLETS", "India")}
                        url="/small-millets"
                    />
                </div>
            </div>
        );
    }
}
