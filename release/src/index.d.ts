import * as React from 'react';

declare module "jzo-components-tree" {

    export enum ToggleMode {
        Select,
        Deselect
    }

    export enum CheckedStateEnum {
        Checked,
        Unchecked,
        Undetermined
    }

    export type NumberOrString = string | number;
    export type FuncOrStrRetNumOrStr = string | ((e: TreeNodeEventArgs) => NumberOrString);
    export type FuncOrStrOrNumRetNumOrStr = string | number | ((e: TreeNodeEventArgs) => NumberOrString);
    export type FuncOrStrRetStr = string | ((e: TreeNodeEventArgs) => String);
    export type FuncOrStrRetBool = string | ((e: TreeNodeEventArgs) => boolean);

    export interface TreeEventArgs {
        component: Tree;
    }

    export interface TreeNodeEventArgs extends TreeEventArgs {
        nodeItem: any;
    }

    export interface LoadItemEventArgs extends TreeEventArgs {
        nodeParentId: NumberOrString;
        nodeParentLevel: number;
    }

    export interface ExpandedRowKeysChangedEventArgs extends TreeEventArgs {
        previousRowKeys: Array<NumberOrString>;
        currentRowKeys: Array<NumberOrString>;
        expandedRowKey: NumberOrString;
    }

    export interface CheckedRowKeysChangedEventArgs extends TreeEventArgs {
        clickedRowKey: NumberOrString;
        previousRowKeys: Array<NumberOrString>;
        currentRowKeys: Array<NumberOrString>;
        checkedRowKeys: Array<NumberOrString>;
        uncheckedRowKeys: Array<NumberOrString>;
    }

    export interface FocusedRowKeyChangedEventArgs extends TreeEventArgs {
        previousRowKey: NumberOrString;
        focusedRowKey: NumberOrString;
    }

    export interface RenderCellItemEventArgs extends TreeNodeEventArgs {
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

    export interface RenderRowItemEventArgs extends RenderCellItemEventArgs {
        onFocusingClickFunction: Function,
        onToggleIconClickFunction: Function,
        onCheckboxCheckedChangedFunction: Function,
        containerDivReactRef: React.RefObject<HTMLDivElement>;
    }

    export interface TreeProps {
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
        nodeDescendantToggleMode?: ToggleMode;
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

    export default class Tree extends React.Component<TreeProps> { }
}
