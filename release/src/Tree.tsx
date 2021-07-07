import * as React from "react";
import { ArgumentException, ArgumentNullException, BrowserScrollbars, Dictionary, Guid, NotImplementedException } from "jzo-library";

export enum ToggleModeEnum {
    Select = 0,
    Deselect = 1
}

export enum CheckedStateEnum {
    Checked = 0,
    Unchecked = 1,
    Undetermined = 2
}

export type NumberOrString = string | number;
export type FuncOrStrRetNumOrStr = string | ((e: TreeNodeEventArgs) => NumberOrString);
export type FuncOrStrOrNumRetNumOrStr = string | number | ((e: TreeNodeEventArgs) => NumberOrString);
export type FuncOrStrRetStr = string | ((e: TreeNodeEventArgs) => String);
export type FuncOrStrRetBool = string | ((e: TreeNodeEventArgs) => boolean);

export type TreeEventArgs = {
    component: Tree;
}

export type TreeNodeEventArgs = TreeEventArgs & {
    nodeItem: any;
}

export type LoadItemEventArgs = TreeEventArgs & {
    nodeParentId: NumberOrString;
    nodeParentLevel: number;
}

export type ExpandedRowKeysChangedEventArgs = TreeEventArgs & {
    previousRowKeys: Array<NumberOrString>;
    currentRowKeys: Array<NumberOrString>;
    expandedRowKey: NumberOrString;
}

export type CheckedRowKeysChangedEventArgs = TreeEventArgs & {
    clickedRowKey: NumberOrString;
    previousRowKeys: Array<NumberOrString>;
    currentRowKeys: Array<NumberOrString>;
    checkedRowKeys: Array<NumberOrString>;
    uncheckedRowKeys: Array<NumberOrString>;
}

export type FocusedRowKeyChangedEventArgs = TreeEventArgs & {
    previousRowKey: NumberOrString;
    focusedRowKey: NumberOrString;
}

export type RenderCellItemEventArgs = TreeNodeEventArgs & {
    id: NumberOrString;
    parentId: NumberOrString;
    level: number;
    allowWordWrap: boolean;
    allowFocusing: boolean;
    isChecked: CheckedStateEnum;
    isChildrenLoaded: boolean;
    isDisabled: boolean;
    isExpanded: boolean;
    isFocused: boolean;
    hasChildren: boolean;
    hasCheckbox: boolean;
    hint: string;
    title: React.ReactNode;
}

export type RenderRowItemEventArgs = RenderCellItemEventArgs & {
    onFocusingClickFunction: Function,
    onToggleIconClickFunction: Function,
    onCheckboxCheckedChangedFunction: Function,
    containerDivReactRef: React.RefObject<HTMLDivElement>;
}

export type TreeProps = {
    id?: string;
    key?: string;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    allowWordWrap?: boolean;
    allowCheckboxes?: boolean;
    allowCheckAll?: boolean;
    allowFocusing?: boolean;
    allowHovering?: boolean;
    allowHorizontalScroll?: boolean;
    checkedRowKeys?: Array<NumberOrString>;
    expandedRowKeys?: Array<NumberOrString>;
    headerTitle?: string;
    focusedRowKey?: NumberOrString;
    nodeDescendantToggleMode?: ToggleModeEnum;
    nodeRootIdExpr: FuncOrStrOrNumRetNumOrStr;
    nodeIdExpr: FuncOrStrRetNumOrStr;
    nodeParentIdExpr: FuncOrStrRetNumOrStr;
    nodeHasChildrenExpr: FuncOrStrRetBool;
    nodeIsCheckboxVisibleExpr?: FuncOrStrRetBool;
    nodeIsDisabledExpr?: FuncOrStrRetBool;
    nodeTitleExpr?: FuncOrStrRetStr;
    nodeHintExpr?: FuncOrStrRetStr;
    retractionWidthInPixel?: number;
    rowHeightsInPixel?: number;
    showRowLines?: boolean;
    showBorders?: boolean;
    onLoadItems: ((eventArgs: LoadItemEventArgs) => Promise<Array<any>>);
    onExpandedRowKeysChanged?: ((eventArgs: ExpandedRowKeysChangedEventArgs) => void);
    onCheckedRowKeysChanged?: ((eventArgs: CheckedRowKeysChangedEventArgs) => void);
    onFocusedRowKeyChanged?: ((eventArgs: FocusedRowKeyChangedEventArgs) => void);
    onRenderCellItem?: ((eventArgs: RenderCellItemEventArgs) => React.ReactNode);
    onRenderRowItem?: ((eventArgs: RenderRowItemEventArgs) => React.ReactNode);
}

type ReturnValue = {
    value?: NumberOrString | boolean | React.ReactNode;
    success: boolean;
}

type NodeData = {
    id: NumberOrString;
    node: any;
    parentId: NumberOrString;
    parent: NodeData;
    level: number;
    children: Array<NodeData>;
    isChildrenLoaded: boolean;
    isChecked: CheckedStateEnum;
    isDisabled: boolean;
    isExpanded: boolean;
    isFocused: boolean;
    hasChildren: boolean;
    hasCheckbox: boolean;
    hasExpandableNodesInChildren: boolean;
    hint?: string;
    title?: React.ReactNode;
}

type TreeState = {
    hasError: boolean,
    errorText: string
}

export default class Tree extends React.Component<TreeProps, TreeState> {

    static defaultProps: TreeProps = {
        className: "",
        style: {},
        disabled: false,
        allowWordWrap: false,
        allowCheckboxes: false,
        allowCheckAll: false,
        allowFocusing: false,
        allowHovering: true,
        allowHorizontalScroll: false,
        checkedRowKeys: null,
        expandedRowKeys: null,
        focusedRowKey: null,
        headerTitle: "Check all",
        nodeDescendantToggleMode: ToggleModeEnum.Deselect,
        nodeRootIdExpr: undefined,
        nodeIdExpr: undefined,
        nodeParentIdExpr: undefined,
        nodeHasChildrenExpr: undefined,
        nodeIsCheckboxVisibleExpr: undefined,
        nodeIsDisabledExpr: undefined,
        nodeTitleExpr: undefined,
        nodeHintExpr: undefined,
        retractionWidthInPixel: 26,
        rowHeightsInPixel: 26,
        showRowLines: true,
        showBorders: true,
        onLoadItems: undefined,
        onExpandedRowKeysChanged: undefined,
        onCheckedRowKeysChanged: undefined,
        onFocusedRowKeyChanged: undefined,
        onRenderCellItem: undefined,
        onRenderRowItem: undefined
    };

    private _containerDivRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    private _itemDict: Dictionary<NumberOrString, NodeData> = new Dictionary<NumberOrString, NodeData>();
    private _rootNodeId: NumberOrString;
    private _uniqueId: string = Guid.CreateNewAsString();
    private _currentlyFocusedNode: NodeData = null;
    private _repaintTimeoutId: number = -1;
    private _isVerticalScrollBarVisible: boolean = false;
    private _tableRefs: Array<HTMLTableElement> = [];

    state = {
        hasError: false,
        errorText: null as string
    }

    constructor(props: TreeProps) {
        super(props);

        if (!props.onLoadItems || props.onLoadItems === null) throw new ArgumentNullException("onLoadItems not defined.");
        this._rootNodeId = this.acquireRootNodeId(props).value as NumberOrString;
        this._itemDict.add(this._rootNodeId, {
            id: this._rootNodeId,
            hasCheckbox: props.allowCheckboxes,
            hasChildren: true,
            isChildrenLoaded: false,
            isChecked: !Tree.IsUndefinedOrNullOrEmpty(props.checkedRowKeys) && props.checkedRowKeys.indexOf(this._rootNodeId) !== -1 ? CheckedStateEnum.Checked : CheckedStateEnum.Unchecked,
            isDisabled: false,
            hasExpandableNodesInChildren: false,
            level: 0,
            node: null,
            parentId: null,
            parent: null,
            isExpanded: true,
            isFocused: false,
            children: []
        });
    }

    static IsUndefinedOrNullOrEmpty = (obj: any): boolean => obj === undefined || obj === null || obj === "";

    public resetError = () => {
        this.setState({ errorText: null, hasError: false });
    }

    private acquireRootNodeId(props: TreeProps): ReturnValue {
        let ret: ReturnValue = { success: false };

        if (props.nodeRootIdExpr) {
            if (typeof props.nodeRootIdExpr === "string" ||
                typeof props.nodeRootIdExpr === "number") {
                ret.value = props.nodeRootIdExpr;
                ret.success = true;
            } else {
                ret = this.acquireDataFromFunction(props.nodeRootIdExpr, null);
            }
        } else {
            throw new ArgumentNullException("'nodeRootIdExpr' is not defined.");
        }

        return ret;
    }

    private acquireDataFromFunction(functionField: any, data: any): ReturnValue {
        const ret: ReturnValue = { success: false };
        if (typeof functionField === "function") {
            ret.value = (functionField as Function).call(data, null) as NumberOrString;
            ret.success = true;
        }
        return ret;
    }

    private acquireDataFromObject(valueField: any, data: any): ReturnValue {
        const ret: ReturnValue = { success: false };
        if (typeof valueField === "string") {
            if (data.hasOwnProperty(valueField)) {
                ret.value = data[valueField as NumberOrString];
                ret.success = true;
            } else {
                throw new NotImplementedException("Property '" + valueField + "' not found on the provided node.");
            }
        }
        return ret;
    }

    private acquireDataFromNode(fieldName: string, valueField: any, node: any): ReturnValue {
        let ret = this.acquireDataFromFunction(valueField, node);
        if (!ret.success) {
            ret = this.acquireDataFromObject(valueField, node);
            if (!ret.success)
                throw new ArgumentNullException("Failed to read field value '" + fieldName + "' from node");
        }
        return ret;
    }

    private acquireDataForDataNode = (props: TreeProps, node: any): NodeData => {
        const id: NumberOrString = this.acquireDataFromNode("nodeIdExpr", props.nodeIdExpr, node).value as NumberOrString;
        if (this._itemDict.containsKey(id)) throw new ArgumentException("Duplicated node identifier: '" + id + "'");

        const parentId: NumberOrString = this.acquireDataFromNode("nodeParentIdExpr", props.nodeParentIdExpr, node).value as NumberOrString;
        if (parentId === null) throw new ArgumentNullException("Parent id is not defined for node, id: '" + id + "'");
        if (!this._itemDict.containsKey(parentId)) throw new ArgumentException("Unable to find parent node. Unknown parent id: '" + parentId + "'");

        const parent: NodeData = this._itemDict.get(parentId);
        let level = parent.level + 1;

        const nodeData: NodeData = {
            id: id,
            parentId: parentId,
            hasChildren: props.nodeHasChildrenExpr ? this.acquireDataFromNode("nodeHasChildrenExpr", props.nodeHasChildrenExpr, node).value as boolean : false,
            hasExpandableNodesInChildren: false,
            isChildrenLoaded: false,
            hasCheckbox: (props.allowCheckboxes && props.nodeIsCheckboxVisibleExpr) ? this.acquireDataFromNode("nodeIsCheckboxVisibleExpr", props.nodeIsCheckboxVisibleExpr, node).value as boolean : props.allowCheckboxes,
            isDisabled: props.nodeIsDisabledExpr ? this.acquireDataFromNode("nodeIsDisabledExpr", props.nodeIsDisabledExpr, node).value as boolean : false,
            level: level,
            node: node,
            parent: parent,
            isExpanded: props.expandedRowKeys !== null && props.expandedRowKeys.indexOf(id) !== -1,
            isFocused: props.allowFocusing && props.focusedRowKey === id,
            isChecked: parent.isChecked === CheckedStateEnum.Checked ? CheckedStateEnum.Checked : CheckedStateEnum.Unchecked,
            children: []
        };
        if (nodeData.hasChildren) parent.hasExpandableNodesInChildren = nodeData.hasChildren;

        if (props.nodeHintExpr) nodeData.hint = this.acquireDataFromNode("nodeHintExpr", props.nodeHintExpr, node).value as string;
        if (props.nodeTitleExpr) nodeData.title = this.acquireDataFromNode("nodeTitleExpr", props.nodeTitleExpr, node).value as React.ReactNode;

        this._itemDict.add(nodeData.id, nodeData);

        parent.children.push(nodeData);
        parent.isChildrenLoaded = true;

        return nodeData;
    }

    private onToggleChild = (nodeData: NodeData) => {
        if (this.props.disabled) return;
        if (nodeData.isChildrenLoaded || nodeData.isExpanded) {
            this.toggleNode(nodeData);
        } else {
            this.props.onLoadItems({ component: this, nodeParentId: nodeData.id, nodeParentLevel: nodeData.level })
                .then((nodes: Array<any>) => {
                    if (nodes.length > 0) {
                        try {
                            const createdNodes: Array<NodeData> = [];
                            nodes.forEach((node: any, index: number) => createdNodes.push(this.acquireDataForDataNode(this.props, node)));
                            if (!Tree.IsUndefinedOrNullOrEmpty(this.props.onCheckedRowKeysChanged)) {
                                createdNodes.forEach((createdNode: NodeData) => {
                                    if (createdNode.isChecked === CheckedStateEnum.Checked) this.props.checkedRowKeys.push(createdNode.id);
                                });
                            }
                            this._tableRefs.splice(0);
                            this.toggleNode(nodeData);
                        } catch (error) {
                            this.displayError(error);
                            //console.log(error);
                        }
                    }
                })
                .catch((error) => {
                    this.displayError(error);
                    //console.log(error);
                });
        }
    }

    private toggleNode = (nodeData: NodeData) => {
        if (Tree.IsUndefinedOrNullOrEmpty(this.props.onExpandedRowKeysChanged)) {
            // uncontrolled
            nodeData.isExpanded = !nodeData.isExpanded;
            this._tableRefs.forEach((table: HTMLTableElement) => {
                table.style.minWidth = null;
            });
            this.forceUpdate();
        } else {
            // controlled
            const ev: ExpandedRowKeysChangedEventArgs = {
                component: this,
                currentRowKeys: [],
                previousRowKeys: [],
                expandedRowKey: nodeData.id
            };

            this._itemDict.values.forEach((nd: NodeData) => {
                if (nd.isExpanded && nd.id !== nodeData.id && nd.id !== this._rootNodeId) {
                    ev.previousRowKeys.push(nd.id);
                    ev.currentRowKeys.push(nd.id);
                }
            });

            if (nodeData.isExpanded)
                ev.previousRowKeys.push(nodeData.id);
            else
                ev.currentRowKeys.push(nodeData.id);

            this.props.onExpandedRowKeysChanged(ev);

            this._tableRefs.forEach((table: HTMLTableElement) => {
                table.style.minWidth = null;
            });
        }
    }

    private onClickCellFocusing = (nodeData: NodeData) => {
        if (this.props.disabled) return;
        if (this.props.allowFocusing) {
            if (Tree.IsUndefinedOrNullOrEmpty(this.props.onFocusedRowKeyChanged)) {
                // uncontrolled
                nodeData.isFocused = !nodeData.isFocused;
                if (this._currentlyFocusedNode !== null) {
                    if (this._currentlyFocusedNode.id !== nodeData.id) this._currentlyFocusedNode.isFocused = false;
                }
                this._currentlyFocusedNode = nodeData.isFocused ? nodeData : null;
                this.forceUpdate();
            } else {
                // controlled
                const ev: FocusedRowKeyChangedEventArgs = {
                    component: this,
                    focusedRowKey: nodeData.isFocused ? null : nodeData.id,
                    previousRowKey: this._currentlyFocusedNode !== null ? this._currentlyFocusedNode.id : null
                };

                this.props.onFocusedRowKeyChanged(ev);
            }
        }
    }

    private onCheckboxCheckedChanged = (nodeData: NodeData) => {
        if (this.props.disabled) return;
        let e: CheckedRowKeysChangedEventArgs = null;

        if (!Tree.IsUndefinedOrNullOrEmpty(this.props.onCheckedRowKeysChanged)) {
            e = {
                component: this,
                clickedRowKey: nodeData.id,
                checkedRowKeys: [],
                currentRowKeys: [],
                previousRowKeys: this.collectCheckedNodeIds([], []),
                uncheckedRowKeys: []
            };
        }

        if (nodeData.isChecked === CheckedStateEnum.Checked) {
            this.uncheckNode(nodeData, e);
        } else if (nodeData.isChecked === CheckedStateEnum.Undetermined) {
            if (this.props.nodeDescendantToggleMode === ToggleModeEnum.Select) {
                // select children, need parent check
                this.checkNode(nodeData, e);
            } else {
                // deselect children, need parent check
                this.uncheckNode(nodeData, e);
            }
        } else {
            this.checkNode(nodeData, e);
        }

        if (this.props.onCheckedRowKeysChanged) {
            e.currentRowKeys = this.collectCheckedNodeIds(e.checkedRowKeys, e.uncheckedRowKeys);
            if (e.uncheckedRowKeys.length > 0) {
                let childNodeData: NodeData = null;
                for (let i = 0; i < e.uncheckedRowKeys.length; i++) {
                    if (this._itemDict.containsKey(e.uncheckedRowKeys[i])) {
                        childNodeData = this._itemDict.get(e.uncheckedRowKeys[i]);
                        let parentNodeData: NodeData = childNodeData.parent;
                        while (parentNodeData !== null) {
                            if (parentNodeData.isChecked === CheckedStateEnum.Checked && e.uncheckedRowKeys.indexOf(parentNodeData.id) === -1) {
                                e.uncheckedRowKeys.push(parentNodeData.id);
                                const index: number = e.currentRowKeys.indexOf(parentNodeData.id);
                                if (index !== -1) e.currentRowKeys.splice(index, 1);
                                parentNodeData = parentNodeData.parent;
                            } else {
                                parentNodeData = null;
                            }
                        }
                    }
                }
            } else {
                if (nodeData.id !== this._rootNodeId) this.recursiveCheckParents(nodeData.parent, e, false);
            }
            this.props.onCheckedRowKeysChanged(e);
        } else {
            this.forceUpdate();
        }
    }

    private collectCheckedNodeIds = (init: Array<NumberOrString>, excludings: Array<NumberOrString>): Array<NumberOrString> => {
        const result: Array<NumberOrString> = [...init];

        this._itemDict.values.forEach((nodeData: NodeData) => {
            if (nodeData.isChecked === CheckedStateEnum.Checked && excludings.indexOf(nodeData.id) === -1) result.push(nodeData.id);
        });

        return result;
    }

    private checkNode = (nodeData: NodeData, e: CheckedRowKeysChangedEventArgs) => {
        // check, including children, need parent check
        if (Tree.IsUndefinedOrNullOrEmpty(this.props.onCheckedRowKeysChanged)) {
            // uncontrolled
            nodeData.isChecked = CheckedStateEnum.Checked;
        } else {
            // controlled
            e.checkedRowKeys.push(nodeData.id);
        }
        this.changeChildrenCheckedStateToChecked(nodeData, e);
        if (nodeData.id !== this._rootNodeId) this.recursiveCheckParents(nodeData.parent, e, false);
    }

    private uncheckNode = (nodeData: NodeData, e: CheckedRowKeysChangedEventArgs) => {
        // uncheck, including children, need parent check
        if (Tree.IsUndefinedOrNullOrEmpty(this.props.onCheckedRowKeysChanged)) {
            // uncontrolled
            nodeData.isChecked = CheckedStateEnum.Unchecked;
        } else {
            // controlled
            e.uncheckedRowKeys.push(nodeData.id);
        }
        this.changeChildrenCheckedStateToUnchecked(nodeData, e);
        if (nodeData.id !== this._rootNodeId) this.recursiveCheckParents(nodeData.parent, e, false);
    }

    private recursiveCheckParents = (nodeData: NodeData, e: CheckedRowKeysChangedEventArgs, enforceConfigure: boolean) => {
        let hasCheckedChild: boolean = false;
        let isAllChildrenChecked: boolean = true;
        nodeData.children.forEach((childNodeData: NodeData) => {
            if (childNodeData.isChecked === CheckedStateEnum.Checked || childNodeData.isChecked === CheckedStateEnum.Undetermined) {
                hasCheckedChild = true;
            }
            if ((e === null || (e !== null && e.currentRowKeys.indexOf(childNodeData.id) === -1)) && (childNodeData.isChecked === CheckedStateEnum.Undetermined || childNodeData.isChecked === CheckedStateEnum.Unchecked)) {
                isAllChildrenChecked = false;
            }
        });

        if (isAllChildrenChecked) {
            if (Tree.IsUndefinedOrNullOrEmpty(this.props.onCheckedRowKeysChanged) || enforceConfigure) {
                // uncontrolled
                nodeData.isChecked = CheckedStateEnum.Checked;
            } else {
                // controlled
                if (e.uncheckedRowKeys.length === 0) {
                    e.checkedRowKeys.push(nodeData.id);
                    e.currentRowKeys.push(nodeData.id);
                }
            }
        } else {
            if (hasCheckedChild) {
                if (Tree.IsUndefinedOrNullOrEmpty(this.props.onCheckedRowKeysChanged) || enforceConfigure) nodeData.isChecked = CheckedStateEnum.Undetermined;
            } else {
                if (nodeData.isChecked !== CheckedStateEnum.Unchecked) {
                    if (Tree.IsUndefinedOrNullOrEmpty(this.props.onCheckedRowKeysChanged) || enforceConfigure) {
                        nodeData.isChecked = CheckedStateEnum.Unchecked;
                    }
                }
            }
        }
        if (nodeData.id !== this._rootNodeId) this.recursiveCheckParents(nodeData.parent, e, enforceConfigure);
    }

    private changeChildrenCheckedStateToChecked = (nodeData: NodeData, e: CheckedRowKeysChangedEventArgs) => {
        nodeData.children.forEach((childNodeData: NodeData) => {
            if (childNodeData.isChecked !== CheckedStateEnum.Checked) {
                if (Tree.IsUndefinedOrNullOrEmpty(this.props.onCheckedRowKeysChanged)) {
                    // uncontrolled
                    childNodeData.isChecked = CheckedStateEnum.Checked;
                } else {
                    // controlled
                    e.checkedRowKeys.push(childNodeData.id);
                }
                this.changeChildrenCheckedStateToChecked(childNodeData, e);
            }
        });
    }

    private changeChildrenCheckedStateToUnchecked = (nodeData: NodeData, e: CheckedRowKeysChangedEventArgs) => {
        nodeData.children.forEach((childNodeData: NodeData) => {
            if (childNodeData.isChecked !== CheckedStateEnum.Unchecked) {
                if (Tree.IsUndefinedOrNullOrEmpty(this.props.onCheckedRowKeysChanged)) {
                    // uncontrolled
                    childNodeData.isChecked = CheckedStateEnum.Unchecked;
                } else {
                    // controlled
                    e.uncheckedRowKeys.push(childNodeData.id);
                }
                this.changeChildrenCheckedStateToUnchecked(childNodeData, e);
            }
        });
    }

    private defaultCellRenderer = (eventArgs: RenderCellItemEventArgs): React.ReactNode => {
        return eventArgs.title
    }

    private defaultRowRenderer = (eventArgs: RenderRowItemEventArgs): React.ReactNode => {
        const ev: RenderCellItemEventArgs = { ...eventArgs };
        const ev_ext: RenderRowItemEventArgs = ev as RenderRowItemEventArgs;

        delete ev_ext.onToggleIconClickFunction;
        delete ev_ext.onCheckboxCheckedChangedFunction;

        // <div className="im im-play" style={{ fontSize: '12px' }}></div>
        // <div className="im im-care-down" style={{ fontSize: '12px' }}></div>
        // https://iconmonstr.com/iconicfont/#cdn
        const toggleClasses = eventArgs.hasChildren ? eventArgs.isExpanded ? "im im-care-down" : "im im-play" : "";

        const hasVerticalScrollBar: boolean = this._containerDivRef.current.scrollHeight > this._containerDivRef.current.clientHeight;
        let titleCellClasses = "jzo-tree-title-cell"
        if (hasVerticalScrollBar) titleCellClasses += " jzo-tree-right-border";
        if (this.props.allowFocusing) {
            titleCellClasses += " jzo-tree-hand-pointer";
        }
        if (!this.props.allowWordWrap) {
            if (!this.props.allowHorizontalScroll) {
                titleCellClasses += " jzo-tree-noWrapText-ellipsis";
            } else {
                titleCellClasses += " jzo-tree-noWrapText";
            }
        }

        const retractionValue = (eventArgs.level - 1) * this.props.retractionWidthInPixel;

        const styleRetractionCell: React.CSSProperties = {};
        styleRetractionCell.width = styleRetractionCell.minWidth = retractionValue.toString() + "px";
        styleRetractionCell.minHeight = this.props.rowHeightsInPixel.toString() + "px";

        const styleToggleCell: React.CSSProperties = {};
        styleToggleCell.height = this.props.rowHeightsInPixel.toString() + "px";
        styleToggleCell.width = "26px";

        const styleCheckboxCell: React.CSSProperties = {};
        styleCheckboxCell.height = this.props.rowHeightsInPixel.toString() + "px";
        styleCheckboxCell.width = this.props.allowCheckboxes && eventArgs.hasCheckbox ? "26px" : "0";

        const styleTitleCell: React.CSSProperties = {};
        styleTitleCell.lineHeight = this.props.rowHeightsInPixel + 'px'
        styleTitleCell.minHeight = this.props.rowHeightsInPixel.toString() + "px"
        if (!this.props.allowHorizontalScroll && !this.props.allowWordWrap) {
            let verticalScrollBarWidth = "";
            if (hasVerticalScrollBar) {
                verticalScrollBarWidth = " - " + BrowserScrollbars.width.toString() + "px";
            }
            styleTitleCell.maxWidth = "calc(" +
                this._containerDivRef.current.clientWidth.toString() + "px" +
                verticalScrollBarWidth +
                (retractionValue > 0 ? " - " + retractionValue.toString() + "px" : "") +
                " - 26px" +
                (this.props.allowCheckboxes && eventArgs.hasCheckbox ? " - 26px" : "") +
                ")";
        }

        /* 1, retraction
         * 2, toggle button
         * 3, checkbox
         * 4, title content
         */
        return <React.Fragment>
            <td className="jzo-tree-retraction-cell" style={styleRetractionCell}></td>
            <td className={"jzo-tree-toggle-cell "} style={styleToggleCell}>
                <div className={"jzo-tree-hand-pointer jzo-tree-centered-content " + toggleClasses}
                    style={styleToggleCell} onClick={() => eventArgs.onToggleIconClickFunction.call(this)}>
                </div>
            </td>
            <td className="jzo-tree-checkbox-cell" style={styleCheckboxCell}>
                <div className="jzo-tree-centered-content" style={styleCheckboxCell}>
                    {
                        eventArgs.hasCheckbox ?
                            <input
                                type="checkbox"
                                checked={eventArgs.isChecked === CheckedStateEnum.Checked}
                                ref={inpRef => inpRef && (inpRef.indeterminate = eventArgs.isChecked === CheckedStateEnum.Undetermined)}
                                onChange={() => eventArgs.onCheckboxCheckedChangedFunction.call(this)}
                                disabled={this.props.disabled}
                            />
                            :
                            null
                    }
                </div>
            </td>
            {
                this.props.onRenderCellItem ? <td className={titleCellClasses}
                    style={styleTitleCell}
                    title={eventArgs.hint}
                    onClick={() => eventArgs.onFocusingClickFunction.call(this)}
                >
                    {this.props.onRenderCellItem(ev)}
                </td>
                    :
                    <td className={titleCellClasses}
                        style={styleTitleCell}
                        title={eventArgs.hint}
                        onClick={() => eventArgs.onFocusingClickFunction.call(this)}
                    >
                        {this.defaultCellRenderer(ev)}
                    </td>
            }
        </React.Fragment>
    }

    private recursiveNodeCreator = (nodeData: NodeData, rows: Array<React.ReactNode>): void => {
        if (!Tree.IsUndefinedOrNullOrEmpty(this.props.onExpandedRowKeysChanged) && !Tree.IsUndefinedOrNullOrEmpty(this.props.expandedRowKeys)) {
            nodeData.isExpanded = this.props.expandedRowKeys.indexOf(nodeData.id) !== -1;
        }
        if (this.props.allowFocusing && !Tree.IsUndefinedOrNullOrEmpty(this.props.onFocusedRowKeyChanged) && undefined !== this.props.focusedRowKey) {
            nodeData.isFocused = this.props.focusedRowKey === nodeData.id;
            if (nodeData.isFocused)
                this._currentlyFocusedNode = nodeData;
            else if (this._currentlyFocusedNode !== null && this._currentlyFocusedNode.id === nodeData.id)
                this._currentlyFocusedNode = null;
        }

        const e: RenderRowItemEventArgs = {
            allowFocusing: this.props.allowFocusing ? this.props.allowFocusing : false,
            allowWordWrap: this.props.allowWordWrap ? this.props.allowWordWrap : false,
            component: this,
            containerDivReactRef: this._containerDivRef,
            hasChildren: nodeData.hasChildren,
            id: nodeData.id,
            isChecked: nodeData.isChecked,
            isDisabled: nodeData.isDisabled,
            isExpanded: nodeData.isExpanded,
            isFocused: nodeData.isFocused,
            level: nodeData.level,
            hasCheckbox: nodeData.hasCheckbox,
            nodeItem: nodeData.node,
            parentId: nodeData.parentId,
            isChildrenLoaded: nodeData.isChildrenLoaded,
            onFocusingClickFunction: () => this.onClickCellFocusing(this._itemDict.get(nodeData.id)),
            onToggleIconClickFunction: () => this.onToggleChild(this._itemDict.get(nodeData.id)),
            onCheckboxCheckedChangedFunction: () => this.onCheckboxCheckedChanged(this._itemDict.get(nodeData.id)),
            hint: nodeData.hint,
            title: nodeData.title
        };

        let classNames = "jzo-tree-box-sizing jzo-tree-node-row";
        if (this.props.showRowLines) classNames += " jzo-tree-bottom-border";
        if (this.props.allowHovering) classNames += " jzo-tree-node-row-hover";
        if (this.props.allowFocusing && nodeData.isFocused) classNames += " jzo-tree-focused-row";
        if (this.props.disabled) classNames += " jzo-tree-disabled";

        const styleTableRow: React.CSSProperties = {};
        styleTableRow.height = styleTableRow.maxHeight = this.props.rowHeightsInPixel.toString() + 'px';

        const styleTable: React.CSSProperties = { ...styleTableRow };
        styleTable.width = styleTable.maxWidth = "";

        const row = <table key={this._uniqueId + "_" + nodeData.id}
            className={classNames}
            style={styleTable}
            ref={(e: HTMLTableElement) => {
                if (!Tree.IsUndefinedOrNullOrEmpty(e)) {
                    this._tableRefs.push(e);
                }
            }}
        >
            <tr style={styleTableRow}>
                {this.props.onRenderRowItem ? this.props.onRenderRowItem(e) : this.defaultRowRenderer(e)}
            </tr>
        </table>

        rows.push(row);

        if (nodeData.isExpanded && nodeData.isChildrenLoaded && nodeData.children.length > 0) {
            nodeData.children.forEach((nodeData: NodeData) => {
                this.recursiveNodeCreator(nodeData, rows);
            });
        }
    }

    private renderRows = (rows: Array<React.ReactNode>) => {

        setTimeout(() => {
            const hasVerticalScrollBar: boolean = this._containerDivRef.current.scrollHeight > this._containerDivRef.current.clientHeight;
            if (this.props.allowHorizontalScroll && !this.props.allowWordWrap && hasVerticalScrollBar) {
                // find longest table
                let highestWidth = 0;
                this._tableRefs.forEach((table: HTMLTableElement) => {
                    if (highestWidth < table.clientWidth) highestWidth = table.clientWidth;
                });
                this._tableRefs.forEach((table: HTMLTableElement) => {
                    table.style.minWidth = highestWidth.toString() + "px";
                });
            } else {
                this._tableRefs.forEach((table: HTMLTableElement) => {
                    table.style.minWidth = null;
                });
            }
        }, 1);

        return <div ref={this._containerDivRef} className={"jzo-tree-rows-container jzo-tree-box-sizing" + (this.props.allowHorizontalScroll ? " jzo-tree-overflow-x-auto" : " jzo-tree-overflow-x-hidden")}>
            {!Tree.IsUndefinedOrNullOrEmpty(this._containerDivRef.current) ? rows.map((row: React.ReactNode) => row) : null}
        </div>
    }

    private renderWithCheckAllHeader = () => {
        let content: React.ReactNode = null;

        if (this.props.allowCheckboxes && this.props.allowCheckAll) {
            let classNames = "jzo-tree-header-layout";
            if (this.props.showRowLines) classNames += " jzo-tree-bottom-border";

            const nodeData: NodeData = this._itemDict.get(this._rootNodeId);

            content = <div className={classNames}>
                <div className="jzo-tree-centered-content jzo-tree-header-checkbox">
                    <input type="checkbox"
                        checked={nodeData.isChecked === CheckedStateEnum.Checked}
                        onChange={() => this.onCheckboxCheckedChanged(nodeData)}
                        ref={inpRef => inpRef && (inpRef.indeterminate = nodeData.isChecked === CheckedStateEnum.Undetermined)}
                        disabled={this.props.disabled}
                    />
                </div>
                <div className="jzo-tree-noWrapText-ellipsis jzo-tree-left-centered-content jzo-tree-header-title">
                    {this.props.headerTitle}
                </div>
            </div>
        }

        return content;
    }

    private renderDisableCover = () => {
        return <div className="jzo-tree-disabled-cover"></div>
    }

    private renderError = () => {
        let content: React.ReactNode = null;

        if (this.state.hasError) {
            let classNames = "jzo-tree-error-layout jzo-tree-error";
            if (this.props.showRowLines) classNames += " jzo-tree-bottom-border";

            content = <div className={classNames}>
                <div className="jzo-tree-left-centered-content jzo-tree-error-text">{this.state.errorText}</div>
            </div>
        }

        return content;
    }

    private displayError = (error: any) => {
        this.setState({ errorText: error, hasError: true });
    }

    componentDidMount() {
        this.props.onLoadItems({ component: this, nodeParentId: this._rootNodeId, nodeParentLevel: 0 })
            .then((nodes: Array<any>) => {
                if (nodes.length > 0) {
                    try {
                        nodes.forEach((node: any, index: number) => this.acquireDataForDataNode(this.props, node));
                        this._tableRefs.splice(0);
                        this.forceUpdate();
                    } catch (error) {
                        this.displayError(error);
                        //console.log(error);
                    }
                }
            })
            .catch((error) => {
                this.displayError(error);
                //console.log(error);
            });
    }

    componentWillUnmount() {
        if (this._repaintTimeoutId !== -1) {
            clearTimeout(this._repaintTimeoutId);
            this._repaintTimeoutId = -1;
        }
    }

    render() {
        let classNames = "jzo-tree jzo-tree-borders jzo-disable-selection jzo-tree-box-sizing jzo-tree-flexDirCol";
        if (this.props.disabled) classNames += " jzo-tree-disabled";
        if (this.props.className) classNames += " " + this.props.className;

        const rootNode: NodeData = this._itemDict.get(this._rootNodeId);
        const rows: Array<React.ReactNode> = [];
        if (rootNode.isChildrenLoaded && rootNode.children.length > 0) {
            if (!Tree.IsUndefinedOrNullOrEmpty(this.props.onCheckedRowKeysChanged)) {
                rootNode.isChecked = this.props.checkedRowKeys.indexOf(rootNode.id) !== -1 ? CheckedStateEnum.Checked : CheckedStateEnum.Unchecked;
                this._itemDict.values.forEach((nodeData: NodeData) => {
                    nodeData.isChecked = this.props.checkedRowKeys.indexOf(nodeData.id) === -1 ? CheckedStateEnum.Unchecked : CheckedStateEnum.Checked;
                });
                this.props.checkedRowKeys.forEach((nodeId: NumberOrString) => {
                    if (this._itemDict.containsKey(nodeId)) {
                        const nodeData: NodeData = this._itemDict.get(nodeId);
                        this.recursiveCheckParents(nodeData, null, true);
                    }
                });
            }
            rootNode.children.forEach((nodeData: NodeData) => {
                this.recursiveNodeCreator(nodeData, rows);
            });
        }

        if (Tree.IsUndefinedOrNullOrEmpty(this._containerDivRef.current)) {
            if (this._repaintTimeoutId === -1) {
                this._repaintTimeoutId = setTimeout(() => {
                    this.forceUpdate();
                    this._repaintTimeoutId = -1;
                }, 1) as any as number;
            }
        } else {
            if (this._repaintTimeoutId === -1) {
                this._repaintTimeoutId = setTimeout(() => {
                    const hasVerticalScrollBar: boolean = this._containerDivRef.current.scrollHeight > this._containerDivRef.current.clientHeight;
                    if (hasVerticalScrollBar !== this._isVerticalScrollBarVisible) {
                        this._isVerticalScrollBarVisible = hasVerticalScrollBar;
                        this.forceUpdate();
                    }
                    this._repaintTimeoutId = -1;
                }, 1) as any as number;
            }
        }

        return (
            <div
                id={this.props.id}
                className={classNames}
                style={{ ...this.props.style }}
            >
                {this.renderError()}
                {this.renderWithCheckAllHeader()}
                {this.renderRows(rows)}
                {this.props.disabled ? this.renderDisableCover() : null}
            </div>
        );
    }

}
