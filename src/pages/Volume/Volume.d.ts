export interface TableListItem {
    ID: number;
    pCode: string;
    pName: string;
    customer: string;
    initVolume: string;
    pManeger: string;
    startDate: string;
}

export interface FormValueType extends Partial<TableListItem> {
    target?: string;
    template?: string;
    type?: string;
    time?: string;
    frequency?: string;
}

export interface UpdateFormProps {
    onCancel: (flag?: boolean, formVals?: FormValueType) => void;
    onSubmit: (values: FormValueType) => Promise<void>;
    updateModalVisible: boolean;
    values: Partial<TableListItem>;
}

