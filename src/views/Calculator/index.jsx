import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import "./calculator.scss";
import { Grid, InputAdornment, OutlinedInput, Zoom, Slider, Paper, Box, Typography } from "@material-ui/core";
import { trim } from "../../helpers";
import { Skeleton } from "@material-ui/lab";

function Calculator() {
    const isAppLoading = useSelector(state => state.app.loading);
    const marketPrice = useSelector(state => {
        return state.app.marketPrice;
    });
    const stakingAPY = useSelector(state => {
        return state.app.apy;
    });
    const testBalance = useSelector(state => {
        return state.account.balances && state.account.balances.test;
    });

    const trimmedStakingAPY = trim(stakingAPY * 100, 1);
    const trimmedTestBalance = trim(Number(testBalance), 5);
    const trimeMarketPrice = trim(marketPrice, 2);

    const [testAmount, setTestAmount] = useState(trimmedTestBalance);
    const [rewardYield, setRewardYield] = useState(trimmedStakingAPY);
    const [priceAtPurchase, setPriceAtPurchase] = useState(trimeMarketPrice);
    const [futureMarketPrice, setFutureMarketPrice] = useState(trimeMarketPrice);
    const [days, setDays] = useState(30);

    const [rewardsEstimation, setRewardsEstimation] = useState("0");
    const [potentialReturn, setPotentialReturn] = useState("0");

    const calcInitialInvestment = () => {
        const test = Number(testAmount) || 0;
        const price = parseFloat(priceAtPurchase) || 0;
        const amount = test * price;
        return trim(amount, 2);
    };

    const calcCurrentWealth = () => {
        const test = Number(testAmount) || 0;
        const price = parseFloat(trimeMarketPrice);
        const amount = test * price;
        return trim(amount, 4);
    };

    const [initialInvestment, setInitialInvestment] = useState(calcInitialInvestment());

    useEffect(() => {
        const newInitialInvestment = calcInitialInvestment();
        setInitialInvestment(newInitialInvestment);
    }, [testAmount, priceAtPurchase]);

    const calcNewBalance = () => {
        let value = parseFloat(rewardYield) / 100;
        value = Math.pow(value - 1, 1 / (365 * 3)) - 1 || 0;
        let balance = Number(testAmount);
        for (let i = 0; i < days * 3; i++) {
            balance += balance * value;
        }
        return balance;
    };

    useEffect(() => {
        const newBalance = calcNewBalance();
        setRewardsEstimation(trim(newBalance, 6));
        const newPotentialReturn = newBalance * (parseFloat(futureMarketPrice) || 0);
        setPotentialReturn(trim(newPotentialReturn, 2));
    }, [days, rewardYield, futureMarketPrice, testAmount]);

    return (
        <div className="calculator-view">
            <Zoom in={true}>
                <Paper className="ohm-card calculator-card">
                    <Grid className="calculator-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <Box className="calculator-card-header">
                                <Typography variant="h5" className="calculator-card-header-title">Calculator</Typography>
                                <Typography variant="body2" className="calculator-card-header-subtitle">Estimate your returns</Typography>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box className="calculator-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                        <Box className="calculator-card-apy">
                                            <Typography variant="h5" color="textSecondary" className="calculator-card-metrics-title">JUPITER Price</Typography>
                                            <Typography variant="h4" className="calculator-card-metrics-value">{isAppLoading ? <Skeleton width="100px"/> : `$${trimeMarketPrice}`}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                        <Box className="calculator-card-tvl">
                                            <Typography variant="h5" color="textSecondary" className="calculator-card-metrics-title">Current APY</Typography>
                                            <Typography variant="h4" className="calculator-card-metrics-value">
                                                {isAppLoading ? <Skeleton width="100px" /> : <>{new Intl.NumberFormat("en-US").format(Number(trimmedStakingAPY))}%</>}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                        <Box className="calculator-card-index">
                                            <Typography variant="h5" color="textSecondary" className="calculator-card-metrics-title">Your JUPITER Balance</Typography>
                                            <Typography variant="h4" className="calculator-card-metrics-value">{isAppLoading ? <Skeleton width="100px" /> : <>{trimmedTestBalance} JUPITER</>}</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        <Box className="calculator-card-area">
                            <Box>
                                <Box className="calculator-card-action-area">
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Box className="calculator-card-action-area-inp-wrap">
                                                <Typography variant="h6" className="calculator-card-action-area-inp-wrap-title">JUPITER Amount</Typography>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="calculator-card-action-input"
                                                    value={testAmount}
                                                    onChange={e => setTestAmount(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={() => setTestAmount(trimmedTestBalance)} className="stake-card-action-input-btn">
                                                                <Typography>Max</Typography>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box className="calculator-card-action-area-inp-wrap">
                                                <Typography variant="h6" className="calculator-card-action-area-inp-wrap-title">APY (%)</Typography>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="calculator-card-action-input"
                                                    value={rewardYield}
                                                    onChange={e => setRewardYield(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={() => setRewardYield(trimmedStakingAPY)} className="stake-card-action-input-btn">
                                                                <Typography>Current</Typography>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box className="calculator-card-action-area-inp-wrap">
                                                <Typography variant="h6" className="calculator-card-action-area-inp-wrap-title">JUPITER price at purchase ($)</Typography>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="calculator-card-action-input"
                                                    value={priceAtPurchase}
                                                    onChange={e => setPriceAtPurchase(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={() => setPriceAtPurchase(trimeMarketPrice)} className="stake-card-action-input-btn">
                                                                <Typography>Current</Typography>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box className="calculator-card-action-area-inp-wrap">
                                                <Typography variant="h6" className="calculator-card-action-area-inp-wrap-title">Future JUPITER market price ($)</Typography>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="calculator-card-action-input"
                                                    value={futureMarketPrice}
                                                    onChange={e => setFutureMarketPrice(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={() => setFutureMarketPrice(trimeMarketPrice)} className="stake-card-action-input-btn">
                                                                <Typography>Current</Typography>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box className="calculator-days-slider-wrap">
                                    <Typography className="calculator-days-slider-wrap-title">{`${days} day${days > 1 ? "s" : ""}`}</Typography>
                                    <Slider className="calculator-days-slider" min={1} max={365} value={days} onChange={(e, newValue) => setDays(newValue)} />
                                </Box>
                                <Box className="calculator-user-data">
                                    <Box className="data-row">
                                        <Typography className="data-row-title">Your initial investment</Typography>
                                        <Typography className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>${initialInvestment}</>}</Typography>
                                    </Box>
                                    <Box className="data-row">
                                        <Typography className="data-row-title">Current wealth</Typography>
                                        <Typography className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>${calcCurrentWealth()}</>}</Typography>
                                    </Box>
                                    <Box className="data-row">
                                        <Typography className="data-row-title">JUPITER rewards estimation</Typography>
                                        <Typography className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{rewardsEstimation} JUPITER</>}</Typography>
                                    </Box>
                                    <Box className="data-row">
                                        <Typography className="data-row-title">Potential return</Typography>
                                        <Typography className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>${potentialReturn}</>}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Paper>
            </Zoom>
        </div>
    );
}

export default Calculator;