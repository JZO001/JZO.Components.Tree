import * as React from "react";

import Tree, { LoadItemEventArgs, ToggleModeEnum } from "../Tree";
import { BasicItem } from "./types";

type BasicProps = {
    themeName: string;
}

export default class DisabledTree extends React.Component<BasicProps> {

    private onLoad = (e: LoadItemEventArgs): Promise<Array<any>> => {
        return new Promise<Array<any>>((resolve, reject) => {
            const nodes: Array<BasicItem> = [];

            for (let i = 1; i < 25; i++) {
                nodes.push({
                    hasChildren: e.nodeParentLevel < 6,
                    id: "Node_" + e.nodeParentId.toString().substring(5) + "_" + i.toString(),
                    parentId: e.nodeParentId,
                    title: "Node_ " + e.nodeParentId.toString().substring(5) + "_" + i.toString(),
                    hint: "Node_" + e.nodeParentId.toString().substring(5) + "_" + i.toString()
                });
            }

            resolve(nodes);
        });
    }

    render() {
        return (
            <div className="header-content-layout">
                <div className="margin12"><p>Basic example, disabled tree.</p></div>
                <div style={{ padding: '12px 12px 12px 12px', width: '300px', backgroundColor: this.props.themeName === "light" ? "white" : "black" }}>
                    <Tree
                        id="disabledTree"
                        style={{ height: '400px' }}
                        allowHovering={false}
                        allowFocusing={true}
                        allowCheckboxes={true}
                        allowCheckAll={true}
                        disabled={true}
                        nodeDescendantToggleMode={ToggleModeEnum.Select}
                        nodeIdExpr="id"
                        nodeParentIdExpr="parentId"
                        nodeRootIdExpr="0"
                        nodeHasChildrenExpr="hasChildren"
                        nodeTitleExpr="title"
                        nodeHintExpr="hint"
                        headerTitle="Check all"
                        onLoadItems={this.onLoad}
                    />
                </div>
            </div>
        );
    }

}
