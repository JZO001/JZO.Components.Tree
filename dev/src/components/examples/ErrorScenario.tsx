import * as React from "react";

import Tree, { LoadItemEventArgs } from "../Tree";
import { BasicItem } from "./types";

type BasicProps = {
    themeName: string;
}

export default class ErrorScenario extends React.Component<BasicProps> {

    private onLoad = (e: LoadItemEventArgs): Promise<Array<any>> => {
        return new Promise<Array<any>>((resolve, reject) => {
            if (e.nodeParentLevel === 1) reject("Unexpected error occured (demo). Please make sure the error text is visible well with your theme.");

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
                <div className="margin12"><p>Display error at faulty loading.</p></div>
                <div style={{ padding: '12px 12px 12px 12px', width: '300px', backgroundColor: this.props.themeName === "light" ? "white" : "black" }}>
                    <Tree
                        id="errorScenarioTree"
                        style={{ height: '400px' }}
                        allowHovering={false}
                        allowFocusing={true}
                        allowWordWrap={false}
                        allowHorizontalScroll={false}
                        nodeIdExpr="id"
                        nodeParentIdExpr="parentId"
                        nodeRootIdExpr="0"
                        nodeHasChildrenExpr="hasChildren"
                        nodeTitleExpr="title"
                        nodeHintExpr="hint"
                        onLoadItems={this.onLoad}
                    />
                </div>
            </div>
        );
    }

}
