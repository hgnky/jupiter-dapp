import { IPendingTxn } from "./pending-txns-slice";
import { IAccountSlice } from "./account-slice";
import { IAppSlice } from "./app-slice";
import { MessagesState } from "./messages-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from '../../constants';

export interface IReduxState {
    pendingTransactions: IPendingTxn[];
    account: IAccountSlice;
    app: IAppSlice;
    messages: MessagesState;
}

export interface IJsonRPCError {
    readonly message: string;
    readonly code: number;
}

export interface IBaseAsyncThunk {
    readonly networkID: Networks;
    readonly provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IValueAsyncThunk extends IBaseAsyncThunk {
    readonly value: string;
    readonly address: string;
}

export interface IActionValueAsyncThunk extends IValueAsyncThunk {
    readonly action: string;
    readonly callback?: () => void;
    readonly isOld?: boolean;
}