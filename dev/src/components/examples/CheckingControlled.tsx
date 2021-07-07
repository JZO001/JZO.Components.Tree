import * as React from "react";

import Tree, { CheckedRowKeysChangedEventArgs, LoadItemEventArgs, NumberOrString } from "../Tree";
import { BasicItem } from "./types";

type CheckingControlledProps = {
    themeName: string;
}

type CheckingControlledState = {
    checkedKeys: Array<NumberOrString>;
}

export default class CheckingControlled extends React.Component<CheckingControlledProps, CheckingControlledState> {

    state = {
        checkedKeys: [] as Array<NumberOrString>
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

    private onCheckedRowKeysChanged = (e: CheckedRowKeysChangedEventArgs) => {
        console.log(e);
        this.setState({ checkedKeys: e.currentRowKeys });
    }

    render() {
        return (
            <div className="header-content-layout">
                <div className="margin12"><p>Controlled, checked state</p></div>
                <div style={{ padding: '12px 12px 12px 12px', width: '300px', backgroundColor: this.props.themeName === "light" ? "white" : "black" }}>
                    <Tree
                        id="basicTree"
                        style={{ height: '400px' }}
                        allowFocusing={true}
                        allowCheckAll={true}
                        allowCheckboxes={true}
                        nodeIdExpr="id"
                        nodeParentIdExpr="parentId"
                        nodeRootIdExpr="0"
                        nodeHasChildrenExpr="hasChildren"
                        nodeTitleExpr="title"
                        checkedRowKeys={this.state.checkedKeys}
                        onLoadItems={this.onLoad}
                        onCheckedRowKeysChanged={this.onCheckedRowKeysChanged}
                    />
                </div>
            </div>
        );
    }

}
