import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Zoom } from "@material-ui/core";
import RebaseTimer from "../../components/RebaseTimer";
import { trim } from "../../helpers";
import "./account.scss";
import { useWeb3Context } from "../../hooks";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import ProgressCountdown from "../../components/Countdown/Countdown";

function Stake() {
    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const rebaseTime = useSelector<IReduxState, Date>(state => state.app.lastRebaseTime);
    const marketPrice = useSelector<IReduxState, number>(state => {
        return state.app.marketPrice;
    });

    const rebaseRate = useSelector<IReduxState, number>(state => {
        return state.app.rebaseRate;
    });

    const oneDayRate = useSelector<IReduxState, number>(state => {
        return state.app.oneDayRate;
    });

    const fiveDayRate = useSelector<IReduxState, number>(state => {
        return state.app.fiveDayRate;
    });

    const apy = useSelector<IReduxState, number>(state => {
        return state.app.apy;
    });

    const testBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.test;
    });

    const balanceUSD = marketPrice * Number(testBalance)
    
    const nextReward = Number(testBalance) * rebaseRate

    const trimmedTestBalance = trim(Number(testBalance), 5);
    // const trimmedStakingAPY = trim(stakingAPY * 100, 1);
    // const stakingRebasePercentage = trim(stakingRebase * 100, 4);
    // const nextRewardValue = trim((Number(stakingRebasePercentage) / 100) * Number(trimmedStestBalance), 6);

    return (
        <div className="stake-view">
            <Grid className="stake-card-grid" container direction="column" spacing={2}>

                <Grid item>
                    <div className="stake-card-metrics">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                <div className="stake-card">
                                    <p className="stake-card-metrics-title">Your Balance</p>
                                    <p className="stake-card-metrics-value">
                                        {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                                maximumFractionDigits: 2,
                                                minimumFractionDigits: 0,
                                            }).format(balanceUSD)}
                                    </p>
                                    <p className="stake-card-metrics-sub">
                                        {trimmedTestBalance} JUPITER
                                    </p>
                                </div>
                            </Grid>

                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                <div className="stake-card">
                                    <p className="stake-card-metrics-title">APY</p>
                                    <p className="stake-card-metrics-value">
                                        {new Intl.NumberFormat("en-US", {
                                                maximumFractionDigits: 2,
                                                minimumFractionDigits: 0,
                                            }).format(apy * 100)} %
                                    </p>
                                    <p className="stake-card-metrics-sub">
                                        {`Daily ROI ${new Intl.NumberFormat("en-US", {
                                                maximumFractionDigits: 2,
                                                minimumFractionDigits: 0,
                                            }).format(oneDayRate * 100)} %`}
                                    </p>
                                </div>
                            </Grid>

                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                <div className="stake-card">
                                    <p className="stake-card-metrics-title">Next Rebase</p>
                                    <p className="stake-card-metrics-value">
                                        <ProgressCountdown deadline={rebaseTime} />
                                    </p>
                                    <p className="stake-card-metrics-sub">You will earn money soon</p>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
            <Zoom in={true}>
                <div className="stake-card">
                    <Grid className="stake-card-grid" container direction="column" spacing={2}>

                        <div className="stake-card-area">
                            <div>
                                <div className="stake-user-data">
                                    <div className="data-row">
                                        <p className="data-row-name">Current JUPITER Price</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trim(marketPrice, 4)}`}</p>
                                    </div>

                                    <div className="data-row">
                                        <p className="data-row-name">Next Reward Amount</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(nextReward, 5)} JUPITER</>}</p>
                                    </div>

                                    <div className="data-row">
                                        <p className="data-row-name">Next Reward Amount USD</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : `$${trim(marketPrice * nextReward, 5)}`}</p>
                                    </div>

                                    <div className="data-row">
                                        <p className="data-row-name">Next Reward Yield</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{rebaseRate * 100}%</>}</p>
                                    </div>

                                    <div className="data-row">
                                        <p className="data-row-name">ROI(1-Day Rate) USD</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : `$${trim(marketPrice * oneDayRate * Number(testBalance), 5)}`}</p>
                                    </div>

                                    <div className="data-row">
                                        <p className="data-row-name">ROI(5-Day Rate)</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(fiveDayRate * 100, 2)}%</>}</p>
                                    </div>

                                    <div className="data-row">
                                        <p className="data-row-name">ROI(5-Day Rate) USD</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : `$${trim(marketPrice * fiveDayRate * Number(testBalance), 5)}`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Stake;
