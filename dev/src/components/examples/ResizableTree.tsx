import * as React from "react";

import Tree, { LoadItemEventArgs, RenderCellItemEventArgs } from "../Tree";
import { BasicItem } from "./types";

import "./CustomCellRender.css";

type BasicProps = {
    themeName: string;
}

export default class ResizableTree extends React.Component<BasicProps> {

    private _tree: React.RefObject<Tree> = React.createRef<Tree>();

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
            <div style={{ color: 'green' }} className={"jzo-tree-noWrapText-ellipsis"}>{e.title}</div>
            <div className="jzo-tree-centered-content"><div className={className}></div></div>
        </div>
    }

    private onClick = () => {
        this._tree.current.repaint();
    }

    render() {
        return (
            <div className="header-content-button-layout">
                <div className="margin12"><p>Basic example, allow horizontal scroll. To see the behavior, expand the first node down completely. Click Apply button after resize.</p></div>
                <div style={{
                    padding: '12px 12px 12px 12px',
                    width: '300px',
                    height: '400px',
                    backgroundColor: this.props.themeName === "light" ? "white" : "black",
                    overflow: 'hidden',
                    resize: 'both'
                }}>
                    <Tree
                        id="basicTree2"
                        ref={this._tree}
                        style={{ height: '100%' }}
                        allowHovering={false}
                        allowFocusing={true}
                        allowWordWrap={false}
                        allowHorizontalScroll={true}
                        nodeIdExpr="id"
                        nodeParentIdExpr="parentId"
                        nodeRootIdExpr="0"
                        nodeHasChildrenExpr="hasChildren"
                        nodeTitleExpr="title"
                        nodeHintExpr="hint"
                        onLoadItems={this.onLoad}
                        onRenderCellItem={this.onCustomCellRender}
                    />
                </div>
                <button onClick={this.onClick} style={{ height: '26px', width: '56px' }}>Apply</button>
            </div>
        );
    }

}
