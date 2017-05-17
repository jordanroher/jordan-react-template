import * as React from "react";
import "./Hello.scss";

interface HelloProps {
    compiler: string;
    framework: string;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class Hello extends React.Component<HelloProps, undefined> {
    constructor(props: HelloProps) {
        super(props);
    }

    render() {
        return <h1 className="title">Hello from {this.props.compiler} and {this.props.framework}!</h1>;
    }
}