import * as React from "react";
export declare enum ToggleModeEnum {
    Select = 0,
    Deselect = 1
}
export declare enum CheckedStateEnum {
    Checked = 0,
    Unchecked = 1,
    Undetermined = 2
}
export declare type NumberOrString = string | number;
export declare type FuncOrStrRetNumOrStr = string | ((e: TreeNodeEventArgs) => NumberOrString);
export declare type FuncOrStrOrNumRetNumOrStr = string | number | ((e: TreeNodeEventArgs) => NumberOrString);
export declare type FuncOrStrRetStr = string | ((e: TreeNodeEventArgs) => String);
export declare type FuncOrStrRetBool = string | ((e: TreeNodeEventArgs) => boolean);
export declare type TreeEventArgs = {
    component: Tree;
};
export declare type TreeNodeEventArgs = TreeEventArgs & {
    nodeItem: any;
};
export declare type LoadItemEventArgs = TreeEventArgs & {
    nodeParentId: NumberOrString;
    nodeParentLevel: number;
};
export declare type ExpandedRowKeysChangedEventArgs = TreeEventArgs & {
    previousRowKeys: Array<NumberOrString>;
    currentRowKeys: Array<NumberOrString>;
    expandedRowKey: NumberOrString;
};
export declare type CheckedRowKeysChangedEventArgs = TreeEventArgs & {
    clickedRowKey: NumberOrString;
    previousRowKeys: Array<NumberOrString>;
    currentRowKeys: Array<NumberOrString>;
    checkedRowKeys: Array<NumberOrString>;
    uncheckedRowKeys: Array<NumberOrString>;
};
export declare type FocusedRowKeyChangedEventArgs = TreeEventArgs & {
    previousRowKey: NumberOrString;
    focusedRowKey: NumberOrString;
};
export declare type RenderCellItemEventArgs = TreeNodeEventArgs & {
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
};
export declare type RenderRowItemEventArgs = RenderCellItemEventArgs & {
    onFocusingClickFunction: Function;
    onToggleIconClickFunction: Function;
    onCheckboxCheckedChangedFunction: Function;
    containerDivReactRef: React.RefObject<HTMLDivElement>;
};
export declare type TreeProps = {
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
};
declare type TreeState = {
    hasError: boolean;
    errorText: string;
};
export default class Tree extends React.Component<TreeProps, TreeState> {
    static defaultProps: TreeProps;
    private _containerDivRef;
    private _itemDict;
    private _rootNodeId;
    private _uniqueId;
    private _currentlyFocusedNode;
    private _repaintTimeoutId;
    private _isVerticalScrollBarVisible;
    private _tableRefs;
    private _needReset;
    private _isUnmounted;
    state: {
        hasError: boolean;
        errorText: string;
    };
    constructor(props: TreeProps);
    static IsUndefinedOrNullOrEmpty: (obj: any) => boolean;
    componentDidMount(): void;
    componentWillUnmount(): void;
    repaint: (callback?: () => void) => void;
    private forceUpdateInternal;
    resetError: () => void;
    getCheckedState: (nodeId: NumberOrString) => CheckedStateEnum | undefined;
    getHasChildrenState: (nodeId: NumberOrString) => boolean | undefined;
    isKnownNodeById: (nodeId: NumberOrString) => boolean;
    isNodeExpanded: (nodeId: NumberOrString) => boolean | undefined;
    isNodeFocused: (nodeId: NumberOrString) => boolean | undefined;
    isNodeDisabled: (nodeId: NumberOrString) => boolean | undefined;
    isNodeCheckboxVisible: (nodeId: NumberOrString) => boolean | undefined;
    getNodeLevel: (nodeId: NumberOrString) => number | undefined;
    isNodeChildrenLoaded: (nodeId: NumberOrString) => boolean | undefined;
    getNodeParentId: (nodeId: NumberOrString) => NumberOrString | undefined;
    getNodeValueById: (nodeId: NumberOrString) => any | undefined;
    reset: () => void;
    private createRootNodeData;
    private loadChildNodes;
    private acquireRootNodeId;
    private acquireDataFromFunction;
    private acquireDataFromObject;
    private acquireDataFromNode;
    private acquireDataForDataNode;
    private onToggleChild;
    private toggleNode;
    private onClickCellFocusing;
    private onCheckboxCheckedChanged;
    private collectCheckedNodeIds;
    private checkNode;
    private uncheckNode;
    private recursiveCheckParents;
    private changeChildrenCheckedStateToChecked;
    private changeChildrenCheckedStateToUnchecked;
    private defaultCellRenderer;
    private defaultRowRenderer;
    private recursiveNodeCreator;
    private renderRows;
    private renderWithCheckAllHeader;
    private renderDisableCover;
    private renderError;
    private displayError;
    render(): JSX.Element;
}
export {};
