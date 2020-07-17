
import * as React from "react";
import { CircularProgress } from "@material-ui/core";

export class LoadingIndicator extends React.Component {

    public render() {
        return (
            <div                
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    top: "0px"
                }}
            >
                <CircularProgress />
            </div>
        );
    }
}
