import { NumberOrString } from "../Tree";

export type BasicItem = {
    id: NumberOrString,
    parentId: NumberOrString,
    hasChildren: boolean,
    isCheckable?: boolean,
    isDisabled?: boolean,
    title: string,
    hint?: string
}

export type ThemeProps = {
    width: string;
    height: string;
}
