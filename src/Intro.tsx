
import * as React from "react";
import { Link } from "react-router-dom";

export class Intro extends React.Component {
    public render() {
        return (
            <div>
                <Link to="/fonio">Fonio</Link>
            </div>
        );
    }
}
