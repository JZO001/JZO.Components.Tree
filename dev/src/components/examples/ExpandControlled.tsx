import * as React from "react";

import Tree, { ExpandedRowKeysChangedEventArgs, LoadItemEventArgs, NumberOrString } from "../Tree";
import { BasicItem } from "./types";

type ExpandControlledProps = {
    themeName: string;
}

type ExpandControlledState = {
    expandedRowKeys: Array<NumberOrString>
}

export default class ExpandControlled extends React.Component<ExpandControlledProps, ExpandControlledState> {

    state = {
        expandedRowKeys: [] as Array<NumberOrString>
    }

    private onLoad = (e: LoadItemEventArgs): Promise<Array<any>> => {
        return new Promise<Array<any>>((resolve, reject) => {
            const nodes: Array<BasicItem> = [];

            for (let i = 1; i < 25; i++) {
                nodes.push({
                    hasChildren: e.nodeParentLevel < 4,
                    id: "Node_" + e.nodeParentId.toString().substring(5) + "_" + i.toString(),
                    parentId: e.nodeParentId,
                    title: "Node_" + e.nodeParentId.toString().substring(5) + "_" + i.toString()
                });
            }

            resolve(nodes);
        });
    }

    private onExpandedRowKeysChangedHandler = (e: ExpandedRowKeysChangedEventArgs) => {
        console.log("Currently expanded rows: " + e.currentRowKeys);
        this.setState({ expandedRowKeys: e.currentRowKeys });
    }

    render() {
        return (
            <div className="header-content-layout">
                <div className="margin12"><p>Controlled, expand</p></div>
                <div style={{ padding: '12px 12px 12px 12px', width: '300px', backgroundColor: this.props.themeName === "light" ? "white" : "black" }}>
                    <Tree
                        id="basicTree"
                        style={{ height: '400px' }}
                        nodeIdExpr="id"
                        nodeParentIdExpr="parentId"
                        nodeRootIdExpr="0"
                        nodeHasChildrenExpr="hasChildren"
                        nodeTitleExpr="title"
                        expandedRowKeys={this.state.expandedRowKeys}
                        onLoadItems={this.onLoad}
                        onExpandedRowKeysChanged={this.onExpandedRowKeysChangedHandler}
                    />
                </div>
            </div>
        );
    }

}
