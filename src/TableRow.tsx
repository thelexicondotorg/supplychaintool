
import * as React from "react";

interface ITableRowProps {
    left: JSX.Element | string;
    right: JSX.Element | string;
}

export class TableRow extends React.Component<ITableRowProps> {
    public render() {
        const { left, right } = this.props;
        const rightColumnWidth = "140px";
        return (
            <div
                style={{
                    display: "flex",
                    borderBottom: "1px solid #E0E0E0"
                }}
            >
                <div
                    style={{
                        padding: "8px 8px 8px 20px",     
                        width: `calc(100% - ${rightColumnWidth})`,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden"    
                    }}
                >
                    {left}
                </div>
                <div
                    style={{                        
                        padding: "8px",
                        borderLeft: "1px solid #E0E0E0",
                        width: rightColumnWidth,
                        textAlign: "center"
                    }}
                >
                    {right}
                </div>
            </div>
        );
    }
}
