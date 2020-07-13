
import * as React from "react";

export class Footer extends React.Component {
    public static get height() { return "85px"; }

    public render() {
        return (
            <div
                style={{
                    height: Footer.height,
                    backgroundColor: "#743F30"
                }}
            >
                Footer
            </div>
        );
    }
}
