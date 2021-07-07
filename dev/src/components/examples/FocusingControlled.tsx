import * as React from "react";

import Tree, { FocusedRowKeyChangedEventArgs, LoadItemEventArgs, NumberOrString } from "../Tree";
import { BasicItem } from "./types";

type FocusingControlledProps = {
    themeName: string;
}

type FocusingControlledState = {
    focusedRowKey: NumberOrString
}

export default class FocusingControlled extends React.Component<FocusingControlledProps, FocusingControlledState> {

    state = {
        focusedRowKey: null as NumberOrString
    }

    private onLoad = (e: LoadItemEventArgs): Promise<Array<any>> => {
        return new Promise<Array<any>>((resolve, reject) => {
            const nodes: Array<BasicItem> = [];

            for (let i = 1; i < 5; i++) {
                nodes.push({
                    hasChildren: e.nodeParentLevel < 4,
                    id: "Node_" + e.nodeParentId.toString().substring(5) + "_" + i.toString(),
                    parentId: e.nodeParentId,
                    title: "NodeAAAAAAAA_" + e.nodeParentId.toString().substring(5) + "_" + i.toString()
                });
            }

            resolve(nodes);
        });
    }

    private onFocusedRowKeyChangedHandler = (e: FocusedRowKeyChangedEventArgs) => {
        console.log("Prev focused key: " + e.previousRowKey + ", cur focused key: " + e.focusedRowKey);
        this.setState({ focusedRowKey: e.focusedRowKey });
    }

    render() {
        return (
            <div className="header-content-layout">
                <div className="margin12"><p>Controlled, focusing</p></div>
                <div style={{ padding: '12px 12px 12px 12px', width: '300px', backgroundColor: this.props.themeName === "light" ? "white" : "black" }}>
                    <Tree
                        id="basicTree"
                        style={{ height: '400px' }}
                        allowFocusing={true}
                        nodeIdExpr="id"
                        nodeParentIdExpr="parentId"
                        nodeRootIdExpr="0"
                        nodeHasChildrenExpr="hasChildren"
                        nodeTitleExpr="title"
                        focusedRowKey={this.state.focusedRowKey}
                        onLoadItems={this.onLoad}
                        onFocusedRowKeyChanged={this.onFocusedRowKeyChangedHandler}
                    />
                </div>
            </div>
        );
    }

}
