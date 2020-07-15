
import * as React from "react";
import { CircularButton } from "./CircularButton";

export class Intro extends React.Component {
    
    private _buttons!: HTMLElement;

    public componentDidMount() {
        this.onResize();
        this.onResize = this.onResize.bind(this);
        window.addEventListener('resize', this.onResize);
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

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
            <div 
                className="fill-parent"
                style={{
                    overflow: "hidden"
                }}
            >
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
                <div
                    style={{
                        paddingTop: "40px"
                    }}
                >
                    <img 
                        style={{
                            width: "100%"
                        }}
                        src="/public/intro/intro.svg"
                    />
                    <div
                        style={{
                            backgroundColor: "#E0CFB6",
                            height: "2000px",
                            transform: "translate(0px, -2px)"
                        }}
                    />
                </div>
                <div
                    ref={e => this._buttons = e as HTMLElement}
                    style={{
                        position: "absolute",
                        bottom: "25px",
                        minWidth: "80%",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr"
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
                        // url="/amaranth-local"
                    />
                    <CircularButton
                        radius={180}
                        color="#27A33E"
                        content={makeButton("SMALL MILLETS", "India")}
                        // url="/small-millets"
                    />
                </div>
            </div>
        );
    }

    private onResize() {
        this._buttons.style.left = `${(window.innerWidth - this._buttons.clientWidth) / 2}px`;
    }
}
