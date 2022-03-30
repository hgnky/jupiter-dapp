import { BigNumber, ethers } from "ethers";
import { getAddresses, TOKEN_DECIMALS } from "../../constants";
import { JupiterTokenContract, PresaleABI } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getMarketPrice, getTokenPrice } from "../../helpers";
import { RootState } from "../store";
import axios from "axios"

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
}

export const loadAppDetails = createAsyncThunk(
    "app/loadAppDetails",
    //@ts-ignore
    async ({ networkID, provider }: ILoadAppDetails) => {
        // const daiPrice = getTokenPrice("MIM");

        const addresses = getAddresses(networkID);

        // const ohmPrice = getTokenPrice("OHM");
        // const ohmAmount = 1512.12854088 * ohmPrice;

        // const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
//_____________________Presale Start____________________________
        const presaleContract = new ethers.Contract(addresses.PRESALE_ADDRESS, PresaleABI, provider);
        const price = await presaleContract.tokenRatePerEth();
    
        const startTime = await presaleContract.startTime();
        const startTimestamp = new Date(startTime.mul(1000).toNumber());
        const endTime = await presaleContract.endTime();
        const endTimestamp = new Date(endTime.mul(1000).toNumber());
    
        const minEthlimit = await presaleContract.minETHLimit();
        const maxEthlimit = await presaleContract.maxETHLimit();
        const hardCap = await presaleContract.hardCap();
        const totalRaisedAVAX = await presaleContract.totalRaisedAVAX();
        const soldAmount = await presaleContract.totaltokenSold();
//_____________________Presale End____________________________

        const currentBlock = await provider.getBlockNumber();
        const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;
        
        const testContract = new ethers.Contract(addresses.JUPITER_ADDRESS, JupiterTokenContract, provider);

        const marketPrice = ((await getMarketPrice(networkID, provider)) / Math.pow(10, 9));

        const totalSupply = (await testContract.totalSupply()) / Math.pow(10, TOKEN_DECIMALS);

        const firePitAddress = await testContract.firePit();

        const fireBalance = await testContract.balanceOf(firePitAddress) / Math.pow(10, TOKEN_DECIMALS)

        const fireBalanceUSD = fireBalance * marketPrice

        const firePitPercent = fireBalance / totalSupply * 100

        const circSupply = totalSupply - fireBalance;

        const lastRebaseTimestamp : BigNumber = await testContract._lastRebasedTime()

        const lastRebaseTime = lastRebaseTimestamp.mul(1000).toNumber() + 15 * 60 * 1000

        const treasuryAddress = await testContract.treasuryReceiver()

        const pairAddress = await testContract.pairAddress()

        const sifAddress = await testContract.jupiterInsuranceFundReceiver()

        const url = ((address : string) => `https://openapi.debank.com/v1/user/chain_balance?id=${address}&chain_id=eth`)

        const treasuryBalance = (await axios.get(url(treasuryAddress))).data.usd_value

        const poolBalance = (await axios.get(url(pairAddress))).data.usd_value + await testContract.balanceOf(pairAddress) * marketPrice / Math.pow(10, TOKEN_DECIMALS)

        const sifBalance = (await axios.get(url(sifAddress))).data.usd_value

        // console.log('debug5', await testContract.balanceOf(treasuryAddress))

        const marketCap = totalSupply * marketPrice;

        let rebaseRate = 0

        const initRebaseStartTime = await testContract._initRebaseStartTime()

        const deltaTime = Date.now() - initRebaseStartTime.mul(1000).toNumber()

        const oneYear = 365 * 24 * 3600 * 1000

        const rateDecimal = await testContract.RATE_DECIMALS()

        if (deltaTime < oneYear) {
            rebaseRate = 2355 / Math.pow(10, rateDecimal)
        } else if (deltaTime >= 7 * oneYear) {
            rebaseRate = 2 / Math.pow(10, rateDecimal)
        } else if (deltaTime >= 15 * oneYear / 10) {
            rebaseRate = 14 / Math.pow(10, rateDecimal)
        } else if (deltaTime >= oneYear) {
            rebaseRate = 211 / Math.pow(10, rateDecimal)
        }

        const oneDayRate = Math.pow((1 + rebaseRate), 96) - 1 // 96 rebases per day

        const fiveDayRate = Math.pow((1 + rebaseRate), 5 * 96) - 1

        const apy = Math.pow((1 + rebaseRate), 365 * 96) - 1




        // const epoch = await stakingContract.epoch();
        // const stakingReward = epoch.distribute;
        // const stakingRebase = stakingReward / circ;
        // const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
        // const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

        // const currentIndex = await stakingContract.index();
        // const nextRebase = Number(epoch.endBlock.toString());
        // const treasuryRunway = rfvTreasury / circSupply;
        // const runway = Math.log(treasuryRunway) / Math.log(1 + stakingRebase) / 3;

        return {
            // currentIndex: Number(ethers.utils.formatUnits(currentIndex, "gwei")) / 4.5,
            price: price,
            starttime: startTimestamp,
            endtime: endTimestamp,
            minEthlimit: ethers.utils.formatEther(minEthlimit),
            maxEthlimit: ethers.utils.formatEther(maxEthlimit),
            hardCap: ethers.utils.formatEther(hardCap),
            totalRaisedAVAX: ethers.utils.formatEther(totalRaisedAVAX),
            soldAmount: ethers.utils.formatEther(soldAmount),
            totalSupply,
            marketCap,
            currentBlock,
            circSupply,
            treasuryBalance,
            poolBalance,
            sifBalance,
            fireBalance,
            fireBalanceUSD,
            firePitPercent,
            lastRebaseTime,
            marketPrice,
            currentBlockTime,
            rebaseRate,
            oneDayRate,
            fiveDayRate,
            apy
        };
    },
);

const initialState = {
    loading: true,
};

export interface IAppSlice {
    loading: boolean;
    firePitPercent: number;
    marketPrice: number;
    marketCap: number;
    circSupply: number;
    currentIndex: string;
    currentBlock: number;
    currentBlockTime: number;
    fireBalance: number;
    treasuryBalance: number;
    poolBalance:  number,
    sifBalance: number,
    fireBalanceUSD: number;
    lastRebaseTime: Date;
    networkID: number;
    rebaseRate: number;
    totalSupply: number;
    oneDayRate: number;
    fiveDayRate: number;
    apy: number;
    readonly price: unknown;
    readonly starttime: unknown;
    readonly endtime: unknown;
    readonly minEthlimit: unknown;
    readonly maxEthlimit: unknown;
    readonly hardCap: unknown;
    readonly totalRaisedBNB: unknown;
    readonly soldAmount: unknown;
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchAppSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAppDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(loadAppDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAppDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
