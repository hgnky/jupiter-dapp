import { useSelector } from "react-redux";
import { useMemo } from "react";
import { Grid, Zoom, Box, Paper } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAppSlice } from "../../store/slices/app-slice";
import ProgressCountdown from "../../components/Countdown/Countdown";

function Dashboard() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);

    const rebaseTime = app.lastRebaseTime;

    return (
        <div className="dashboard-view">
            <div className="dashboard-infos-wrap">
                
                <Box className={`hero-metrics`}>
                    <Paper className="test-card">
                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
                            <Box className="metric market">
                                <div className="box-card">
                                    <p className="card-title">JUPITER Price</p>
                                    <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trim(app.marketPrice, 4)}`}</p>
                                </div>
                            </Box>

                            <Box className="metric price">
                                <div className="box-card">
                                    <p className="card-title">Market Cap</p>
                                    <p className="card-value">
                                        {isAppLoading ? (
                                            <Skeleton width="160px" />
                                        ) : (
                                            new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                                maximumFractionDigits: 0,
                                                minimumFractionDigits: 0,
                                            }).format(app.marketCap)
                                        )}
                                    </p>
                                </div>
                            </Box>

                            <Box className="metric wsoprice">
                                <div className="box-card">
                                    <p className="card-title">Circulating Supply</p>
                                    <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : (
                                            new Intl.NumberFormat("en-US", {
                                                maximumFractionDigits: 2,
                                                minimumFractionDigits: 0,
                                            }).format(app.circSupply)
                                        )}</p>
                                </div>
                            </Box>

                            <Box className="metric circ">
                                <div className="box-card">
                                    <p className="card-title">Backed Liquidity</p>
                                    <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : `100%`}</p>
                                </div>
                            </Box>

                            <Box className="metric bpo">
                                <div className="box-card">
                                    <p className="card-title">Next Reabase</p>
                                    <ProgressCountdown deadline={rebaseTime} />
                                </div>
                            </Box>

                            <Box className="metric index">
                                <div className="box-card">
                                    <p className="card-title">Total Supply</p>
                                    <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : (
                                            new Intl.NumberFormat("en-US", {
                                                maximumFractionDigits: 2,
                                                minimumFractionDigits: 0,
                                            }).format(app.totalSupply)
                                        )}</p>
                                </div>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
                <Zoom in={true}>
                    
                    <Grid container spacing={3}>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">JUPITER Price</p>
                                <p className="card-value-grad">{isAppLoading ? <Skeleton width="100px" /> : `$${trim(app.marketPrice, 4)}`}</p>
                            </div>
                        </Grid>
                        

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Market Value of Treasury Asset</p>
                                <p className="card-value-grad">{isAppLoading ? <Skeleton width="250px" /> : (
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(app.treasuryBalance)
                                    )}</p>
                            </div>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Pool Value</p>
                                <p className="card-value-grad">{isAppLoading ? <Skeleton width="250px" /> : (
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(app.poolBalance)
                                    )}</p>
                            </div>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">JUPITER Insurance Fund Value</p>
                                <p className="card-value-grad">{isAppLoading ? <Skeleton width="250px" /> : (
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(app.sifBalance)
                                    )}</p>
                            </div>
                        </Grid>
                        
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title"># Value of FirePit</p>
                                <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : (
                                        new Intl.NumberFormat("en-US", {
                                            maximumFractionDigits: 2,
                                            minimumFractionDigits: 0,
                                        }).format(app.fireBalance) + ' JUPITER'
                                    )}</p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">$ Value of FirePit</p>
                                <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : (
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(app.fireBalanceUSD)
                                    )}</p>
                            </div>
                        </Grid>

                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">% FirePit : Supply</p>
                                <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : (
                                        new Intl.NumberFormat("en-US", {
                                            maximumFractionDigits: 2,
                                            minimumFractionDigits: 0,
                                        }).format(app.firePitPercent)+' %'
                                    )}</p>
                            </div>
                        </Grid>
                    </Grid>
                </Zoom>
            </div>
        </div>
    );
}

export default Dashboard;
