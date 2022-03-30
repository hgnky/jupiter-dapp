import { ethers } from "ethers";
import { getAddresses, TOKEN_DECIMALS } from "../../constants";
import { JupiterTokenContract, DaiTokenContract, PresaleABI } from "../../abi";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import React from "react";
import { RootState } from "../store";
import { IToken } from "../../helpers/tokens";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        test: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);
    const testContract = new ethers.Contract(addresses.JUPITER_ADDRESS, JupiterTokenContract, provider);
    const testBalance = await testContract.balanceOf(address);
    return {
        balances: {
            test: (testBalance / Math.pow(10, TOKEN_DECIMALS)).toString(),
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
    balances: {
        test: string;
        avax: string;
    }, 
    presale: {
        capable: any;
        userInfo: any;
    };
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    let testBalance = 0;
    let capable = 0;
    let userInfo;
    const addresses = getAddresses(networkID);
    
    const etherBalance = await provider.getBalance(address);

    if (addresses.JUPITER_ADDRESS) {
        const testContract = new ethers.Contract(addresses.JUPITER_ADDRESS, JupiterTokenContract, provider);
        testBalance = await testContract.balanceOf(address);
    }
    
    if (addresses.PRESALE_ADDRESS) {
        const presaleContract = new ethers.Contract(addresses.PRESALE_ADDRESS, PresaleABI, provider);
        capable = await presaleContract.getUserRemainingAllocation(address);
        userInfo = await presaleContract.usersInvestments(address);
    }

    return {
        balances: {
            test: (testBalance / Math.pow(10, TOKEN_DECIMALS)).toString(),
            avax: ethers.utils.formatEther(etherBalance),
        },
        presale: {
            capable: ethers.utils.formatEther(capable),
            userInfo: ethers.utils.formatEther(userInfo),
        }
    };
});


interface ICalcUserTokenDetails {
    address: string;
    token: IToken;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserTokenDetails {
    allowance: number;
    balance: number;
    isETH?: boolean;
}

export const calculateUserTokenDetails = createAsyncThunk("account/calculateUserTokenDetails", async ({ address, token, networkID, provider }: ICalcUserTokenDetails) => {
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                token: "",
                address: "0x0",
                img: "",
                allowance: Number(0),
                balance: Number(0),
            });
        });
    }

    if (token.isETH) {
        const avaxBalance = await provider.getSigner(address).getBalance();
        const avaxVal = ethers.utils.formatEther(avaxBalance);
        return {
            token: token.name,
            tokenIcon: token.img,
            balance: Number(avaxVal),
            isETH: true,
        };
    }

    const tokenContract = new ethers.Contract(token.address, DaiTokenContract, provider);

    let allowance,
    balance = await tokenContract.balanceOf(address);
    const balanceVal = Number(balance) / Math.pow(10, token.decimals);
    
    return {
        token: token.name,
        address: token.address,
        img: token.img,
        allowance: Number(allowance),
        balance: Number(balanceVal),
    };
});

export interface IAccountSlice {
    balances: {
        stest: string;
        test: string;
    };
    loading: boolean;
    staking: {
        test: number;
    };
    tokens: { [key: string]: IUserTokenDetails };
}

const initialState: IAccountSlice = {
    loading: true,
    balances: { stest: "", test: "" },
    staking: { test: 0 },
    tokens: {},
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserTokenDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserTokenDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const token = action.payload.token;
                state.tokens[token] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserTokenDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
