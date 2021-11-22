import * as React from "react";

import Tree, { LoadItemEventArgs, RenderCellItemEventArgs, ToggleModeEnum } from "../Tree";
import { BasicItem } from "./types";

import "./CustomCellRender.css";

type BasicProps = {
    themeName: string;
}

export default class CustomCellRender extends React.Component<BasicProps> {

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

    private onCustomCellRender = (e: RenderCellItemEventArgs): React.ReactNode => {
        const className = "cct-circle-size" + (e.level < 4 ? e.level.toString() : "4");
        return <div className="custom-cell-render-cell-layout">
            <div style={{ color: 'green' }}>{e.title}</div>
            <div className="jzo-tree-centered-content"><div className={className}></div></div>
        </div>
    }

    render() {
        return (
            <div className="header-content-layout">
                <div className="margin12"><p>Advanced example, custom cell render.</p></div>
                <div style={{ padding: '12px 12px 12px 12px', width: '300px', backgroundColor: this.props.themeName === "light" ? "white" : "black" }}>
                    <Tree
                        id="CustomCellRender"
                        style={{ height: '400px' }}
                        allowHovering={false}
                        allowFocusing={true}
                        allowCheckboxes={true}
                        allowCheckAll={true}
                        allowHorizontalScroll={true}
                        nodeDescendantToggleMode={ToggleModeEnum.Deselect}
                        nodeIdExpr="id"
                        nodeParentIdExpr="parentId"
                        nodeRootIdExpr="0"
                        nodeHasChildrenExpr="hasChildren"
                        nodeTitleExpr="title"
                        nodeHintExpr="hint"
                        headerTitle="Check all"
                        onLoadItems={this.onLoad}
                        onRenderCellItem={this.onCustomCellRender}
                    />
                </div>
            </div>
        );
    }

}
