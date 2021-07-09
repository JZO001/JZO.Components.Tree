import * as React from "react";

import Tree, { CheckedRowKeysChangedEventArgs, ExpandedRowKeysChangedEventArgs, FocusedRowKeyChangedEventArgs, LoadItemEventArgs, NumberOrString } from "../Tree";
import { BasicItem } from "./types";

type ExpandControlledProps = {
    themeName: string;
}

type ExpandControlledState = {
    checkedKeys: Array<NumberOrString>,
    expandedRowKeys: Array<NumberOrString>,
    focusedRowKey: NumberOrString
}

export default class PreparedControlled extends React.Component<ExpandControlledProps, ExpandControlledState> {

    state = {
        checkedKeys: ['Node_0_1_1_1_1'] as Array<NumberOrString>,
        expandedRowKeys: ['Node_0_1', 'Node_0_1_1', 'Node_0_1_1_1', 'Node_0_1_1_1_1'] as Array<NumberOrString>,
        focusedRowKey: 'Node_0_1_1_1_1_1'
    }

    private onLoad = (e: LoadItemEventArgs): Promise<Array<any>> => {
        return new Promise<Array<any>>((resolve, reject) => {
            console.log("ParentId: " + e.nodeParentId + ", Level: " + e.nodeParentLevel);
            const nodes: Array<BasicItem> = [];

            for (let i = 1; i < 6; i++) {
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

    private onCheckedRowKeysChanged = (e: CheckedRowKeysChangedEventArgs) => {
        //console.log(e);
        this.setState({ checkedKeys: e.currentRowKeys });
    }

    private onExpandedRowKeysChangedHandler = (e: ExpandedRowKeysChangedEventArgs) => {
        //console.log("Currently expanded rows: " + e.currentRowKeys);
        this.setState({ expandedRowKeys: e.currentRowKeys });
    }

    private onFocusedRowKeyChanged = (e: FocusedRowKeyChangedEventArgs) => {
        this.setState({ focusedRowKey: e.focusedRowKey });
    }

    render() {
        return (
            <div className="header-content-layout">
                <div className="margin12"><p>Controlled, expand prepared</p></div>
                <div style={{ padding: '12px 12px 12px 12px', width: '300px', backgroundColor: this.props.themeName === "light" ? "white" : "black" }}>
                    <Tree
                        id="basicTree"
                        style={{ height: '400px' }}
                        allowCheckAll={true}
                        allowCheckboxes={true}
                        allowFocusing={true}
                        nodeIdExpr="id"
                        nodeParentIdExpr="parentId"
                        nodeRootIdExpr="Node_0"
                        nodeHasChildrenExpr="hasChildren"
                        nodeTitleExpr="title"
                        checkedRowKeys={this.state.checkedKeys}
                        expandedRowKeys={this.state.expandedRowKeys}
                        focusedRowKey={this.state.focusedRowKey}
                        onLoadItems={this.onLoad}
                        onCheckedRowKeysChanged={this.onCheckedRowKeysChanged}
                        onExpandedRowKeysChanged={this.onExpandedRowKeysChangedHandler}
                        onFocusedRowKeyChanged={this.onFocusedRowKeyChanged}
                    />
                </div>
            </div>
        );
    }

}
