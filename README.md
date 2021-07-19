# jzo-components-tree
<div align="center">
  <h1>JZO's customizable tree component for React</h1>
</div>

## Prerequisites

- node >=10
- react >=16

## Installation

```shell
npm i jzo-components-tree
```

## Usage

Import the necessary stylesheets into your project

Put this CSS import into your index.html header section
```jsx
<link rel="stylesheet" href="https://cdn.iconmonstr.com/1.3.0/css/iconmonstr-iconic-font.min.css">
```

The common stylesheet which is mandatory all the time
```jsx
import 'jzo-components-tree/build/Tree.common.css';
```

Choose a theme, dark or light. These are by default themes, please feel free to create a new one for yourself, if you like.

Dark
```jsx
import 'jzo-components-tree/build/Tree.dark.css';
```

Light
```jsx
import 'jzo-components-tree/build/Tree.light.css';
```

Import the Tree component to use it
```jsx
import * as React from "react";

import Tree, { LoadItemEventArgs, TreeNodeEventArgs, NumberOrString } from "jzo-components-tree";

export type BasicItem = {
    id: NumberOrString,
    parentId: NumberOrString,
    hasChildren: boolean,
    isCheckable?: boolean,
    isDisabled?: boolean,
    title: string,
    hint?: string
}

type BasicProps = {
    themeName: string;
}

export default class Basic extends React.Component<BasicProps> {

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

    private hasChildren = (e: TreeNodeEventArgs) => {
        return (e.nodeItem as BasicItem).hasChildren;
    }

    render() {
        return (
            <Tree
                style={{ height: '400px' }}
                allowHovering={false}
                allowFocusing={true}
                allowWordWrap={false}
                allowHorizontalScroll={false}
                nodeIdExpr="id"
                nodeParentIdExpr="parentId"
                nodeRootIdExpr="0"
                nodeHasChildrenExpr={this.hasChildren}
                nodeTitleExpr="title"
                nodeHintExpr="hint"
                onLoadItems={this.onLoad}
            />
        );
    }

}
```

This component support flat data hierarchy which means you don't have to load the whole data structure on startup into the component. Children nodes will be loaded just in time, when it is really needed, for example at expanding a child node or if a node marked as expanded at the initialization or later.

You can control many behaviors of the component, like hovering, checkboxing, focusing, expanding, scrolling, word wrap, data gathering, custom styling or custom rendering of a row or a cell.


```jsx
import * as React from "react";

import Tree, { LoadItemEventArgs, NumberOrString } from "jzo-components-tree";

export type BasicItem = {
    id: NumberOrString,
    parentId: NumberOrString,
    hasChildren: boolean,
    isCheckable?: boolean,
    isDisabled?: boolean,
    title: string,
    hint?: string
}

type BasicProps = {
    themeName: string;
}

export default class Basic2 extends React.Component<BasicProps> {

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
            <Tree
                style={{ height: '400px' }}
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
            />
        );
    }

}
```

Here is an example, how you can control your expanded nodes

```jsx
import * as React from "react";

import Tree, { ExpandedRowKeysChangedEventArgs, LoadItemEventArgs, NumberOrString } from "jzo-components-tree";

export type BasicItem = {
    id: NumberOrString,
    parentId: NumberOrString,
    hasChildren: boolean,
    isCheckable?: boolean,
    isDisabled?: boolean,
    title: string,
    hint?: string
}

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
        this.setState({ expandedRowKeys: e.currentRowKeys });
    }

    render() {
        return (
            <Tree
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
        );
    }

}
```

This example demonstrates how you can control checking, focusing and expanding

```jsx
import * as React from "react";

import Tree, { CheckedRowKeysChangedEventArgs, ExpandedRowKeysChangedEventArgs, FocusedRowKeyChangedEventArgs, LoadItemEventArgs, NumberOrString } from "jzo-components-tree";

export type BasicItem = {
    id: NumberOrString,
    parentId: NumberOrString,
    hasChildren: boolean,
    isCheckable?: boolean,
    isDisabled?: boolean,
    title: string,
    hint?: string
}

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
        this.setState({ checkedKeys: e.currentRowKeys });
    }

    private onExpandedRowKeysChangedHandler = (e: ExpandedRowKeysChangedEventArgs) => {
        this.setState({ expandedRowKeys: e.currentRowKeys });
    }

    private onFocusedRowKeyChanged = (e: FocusedRowKeyChangedEventArgs) => {
        this.setState({ focusedRowKey: e.focusedRowKey });
    }

    render() {
        return (
            <Tree
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
        );
    }

}

```

Naturally, as you can see, the source object can be anything. In my examples, I created a 'BasicItem' named types just for demonstration purposes.

Next example shows you, how you can override the default cell renderer

```jsx
import * as React from "react";

import Tree, { LoadItemEventArgs, RenderCellItemEventArgs, ToggleModeEnum } from "jzo-components-tree";

import "./CustomCellRender.css";

export type BasicItem = {
    id: NumberOrString,
    parentId: NumberOrString,
    hasChildren: boolean,
    isCheckable?: boolean,
    isDisabled?: boolean,
    title: string,
    hint?: string
}

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
            <Tree
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
                onLoadItems={this.onLoad}
                onRenderCellItem={this.onCustomCellRender}
            />
        );
    }

}
```

The content of the CSS file in the example above

```jsx
.custom-cell-render-cell-layout {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: auto 26px;
    padding: 0;
    margin: 0;
}

.cct-circle-size1 {
    height: 0.9rem;
    width: 0.6rem;
    background-color: darkkhaki;
}

.cct-circle-size2 {
    height: 0.85rem;
    width: 0.5rem;
    background-color: mediumpurple;
}

.cct-circle-size3 {
    height: 0.8rem;
    width: 0.4rem;
    background-color: darksalmon;
}

.cct-circle-size4 {
    height: 0.75rem;
    width: 0.3rem;
    background-color: deepskyblue;
}
```

If you would like to test, try and see the control on your side, please clone the github project, go into the dev folder, download the NPM packages with the command 'npm i', then run 'npm run start'. You can please with many of examples in your browser.


## Customization

### Theme
You can create an own theme, based on the dark/light factory defaults

### CSS overrides
Every DOM node elements in the component have an own CSS class which are used to override the styles explicitly. Feel free to make changes on the design for yourself.



## API

### Props

| Name           | Type   | Default value       | Description                                                                                                                                                                                                                         |
|----------------|--------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id           | String | undefined      | Value will be forwarded to the main div of the component as an id attribute                                                                                         |
| key          | String | undefined      | React key                                                                                                                                             |
| className    | String |                                                                                                                                                                               | Class names will be forwarded to the main div
| style | React.CSSProperties |                     | CSS style definitions which are forwarded to the main div |
| disabled      | boolean | false | Component enabled/disabled
| allowWordWrap | boolean | false | Title text in a row will be wrapped into multiple lines. This property has no effect, if 'allowHorizontalScroll' is enabled.
| allowCheckboxes | boolean | false | Display a checkbox in the rows. If necessary, you can also control check visibilities with props 'nodeIsCheckboxVisibleExpr'
| allowCheckAll   | boolean | false | If true, and the 'allowCheckboxes' enabled, a master checkbox will be appear at the top of the component. It can toggle the checked state of the whole tree structure.
| allowFocusing   | boolean | false | If true, you can focus on a row by clicking on it
| allowHovering   | boolean | true | Provides a hover effect, if the user moving over row with mouse
| allowHorizontalScroll | boolean | false | If true, a horizontal scroll will be displayed, if the content of the row has not enough space horizontally
| checkedRowKeys  | NumberOrString[ ] | [ ] | Used in controlled mode. You can programatically set the list of the checked nodes. 'allowCheckboxes' must be enabled
| expandedRowKeys | NumberOrString[ ] | [ ] | Used in controlled mode. You can programatically set the list of the expanded nodes
| focusedRowKey   | NumberOrString | null | Used in controlled mode. You can programatically set the focused node
| headerTitle     | string | "Check all" | If 'allowCheckAll' enabled, you can modify the title text over this property
| nodeDescendantToggleMode | ToggleModeEnum | ToggleModeEnum.Deselect | Define the selection behavior of the component, when you click on a parent node which has an undetermined checked state. 'Select' means descendants will be selected, otherwise deselected
| nodeRootIdExpr  | FuncOrStrOrNumRetNumOrStr | undefined | Mandatory field, define the identifier of the root node. It can be a function, a string or a number value. If using a function, it must have to return a string or a number. String value will be resolved as a property on the source data
| nodeIdExpr       | FuncOrStrRetNumOrStr | undefined | Mandatory field, define the identifier of a node. It can be a function or a string value. If using a function, it must have to return a string or a number. String value will be resolved as a property on the source data
| nodeParentIdExpr | FuncOrStrRetNumOrStr | undefined | Mandatory field, define the parent identifier of a node. It can be a function or a string value. If using a function, it must have to return a string or a number. String value will be resolved as a property on the source data
| nodeHasChildrenExpr | FuncOrStrRetBool | undefined | Mandatory field, define if a node has children nodes. It can be a function or a string value. If using a function, it must have to return a boolean. String value will be resolved as a property on the source data
| nodeIsCheckboxVisibleExpr | FuncOrStrRetBool | undefined | Define if a node has visible checkbox or not. If you use this property, also 'allowCheckboxes' must be enabled. This property has a row scope, so you can override the visibility decision just for the current row. The value can be a function or a string value. If using a function, it must have to return a boolean. String value will be resolved as a property on the source data
| nodeIsDisabledExpr | FuncOrStrRetBool | undefined | Define if a node is disabled or not. If you use this property, checkbox will be disabled, focusing and hovering also will not work. This property has a row scope, so you can override the disabled decision just for the current row. The value can be a function or a string value. If using a function, it must have to return a boolean. String value will be resolved as a property on the source data
| nodeTitleExpr | FuncOrStrRetStr | undefined | Resolves the title text of a row, which will be displayed. The value can be a function or a string value. If using a function, it must have to return a boolean. String value will be resolved as a property on the source data
| nodeHintExpr | FuncOrStrRetStr | undefined | Resolves the hint text of a row, which will be displayed. The value can be a function or a string value. If using a function, it must have to return a boolean. String value will be resolved as a property on the source data
| retractionWidthInPixel | number | 26 | Defines the retraction value per level of child row
| rowHeightsInPixel | number | 26 | Defines the default row height
| showRowLines | boolean | true | Show border between the rows, or not
| showBorders  | boolean | true | Show border around the component or not
| onLoadItems  | Function | undefined | Mandatory to implement. You can feed the component over this function with your data
| onExpandedRowKeysChanged | Function | undefined | Used in controlled mode. This function receives the changes of the expanding action
| onCheckedRowKeysChanged | Function | undefined | Used in controlled mode. This function receives the changes of the checking action
| onFocusedRowKeyChanged | Function | undefined | Used in controlled mode. This function receives the chnages of the focusing action
| onRenderCellItem | Function | undefined | Advanced. You can override the title cell content rendering. Please check the examples to understand the implementation logic
| onRenderRowItem | Function | undefined | Advanced. You can override the row rendering 

### Methods
| Name           | Return value       | Description                                                                                                                                                                                                                         |
|----------------|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| getCheckedState(nodeId: NumberOrString) | CheckedStateEnum or undefined | Returns a checked state of a node. Undefined, if the node id is unknown
| getHasChildrenState(nodeId: NumberOrString) | boolean or undefined | Returns true, if a node has children. Undefined, if the node id is unknown
| isKnownNodeById(nodeId: NumberOrString) | boolean | Returns true, if the node is known
| isNodeChildrenLoaded(nodeId: NumberOrString) | boolean or undefined | Returns true, if the children of node has been loaded (if it has)
| isNodeCheckboxVisible(nodeId: NumberOrString) | boolean or undefined | Returns true, if the node has a visible checkbox
| isNodeDisabled(nodeId: NumberOrString) | boolean or undefined | Returns true, if the node is disabled
| isNodeExpanded(nodeId: NumberOrString) | boolean or undefined | Returns true, if the node is expanded
| isNodeFocused(nodeId: NumberOrString) | boolean or undefined | Returns true, if the node is focused
| getNodeLevel(nodeId: NumberOrString) | number or undefined | Returns number of the level (deep) of a node
| getNodeParentId(nodeId: NumberOrString) | NumberOrString or undefined | Returns parent node identifier of a node
| getNodeValueById(nodeId: NumberOrString) | any or undefined | Returns the data itself, provided by the user
| repain() | void | Repaint the tree layout completely
| reset() | void | Reset the content and the state of the component into the initial state. It clears all settings, nodes, etc. It is a restart.
| resetError() | void | Reset (hide) the displayed error inside the component, when a load error occured
