import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from 'moment';
import { changeDeposit } from "../../store/slices/presalethunk";
import { getAddresses } from "../../constants";
import { useWeb3Context } from "src/hooks";
import { isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Link,
  useMediaQuery,
} from "@material-ui/core";
import "./style.scss";
import Progress from 'react-progressbar';
import contractImg from "src/assets/icons/pngegg.png";
import logoImg from "src/assets/icons/logo.png";
import ProgressCountdown from './ProgressCountdown';
import { shorten } from "../../helpers";
import { error } from "../../store/slices/messages-slice";
import { ethers } from "ethers";

function Presale() {
  const dispatch = useDispatch();
  const smallerScreen = useMediaQuery("(max-width: 594px)");
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const networkID = chainID;
  const JUPITER_ADDRESS = getAddresses(networkID).JUPITER_ADDRESS;
  const PRESALE_ADDRESS = getAddresses(networkID).PRESALE_ADDRESS;
  const [quantity, setQuantity] = useState("");

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  const avaxBalance = useSelector(state => {
    return state.account.balances && state.account.balances.avax;
  });
  const jupiterBalance = useSelector(state => {
    return state.account.balances && state.account.balances.test;
  });
  const price = useSelector(state => {
    return state.app.price;
  });
  const wprice = useSelector(state => {
    return state.app.wprice;
  });
  const capable = useSelector(state => {
    return state.account.presale && state.account.presale.capable;
  });
  const starttime = useSelector(state => {
    return state.app.starttime;
  });
  const endtime = useSelector(state => {
    return state.app.endtime;
  });
  const minEthlimit = useSelector(state => {
    return state.app.minEthlimit;
  });
  const maxEthlimit = useSelector(state => {
    return state.app.maxEthlimit;
  });
  const hardCap = useSelector(state => {
    return state.app.hardCap;
  });
  const totalRaisedAVAX = useSelector(state => {
    return state.app.totalRaisedAVAX;
  });
  const pEndTimestamp = useSelector(state => {
    return state.app.pEndTimestamp;
  });
  const userInfo = useSelector(state => {
    return state.account.presale && state.account.presale.userInfo;
  });
  const iswllisted = useSelector(state => {
    return state.account.presale && state.account.presale.iswl;
  });
  
  const setMax = () => {
    if(avaxBalance > capable) {
      setQuantity(capable);
    } else {
      setQuantity(avaxBalance);
    }
  };

  const onChangeDeposit = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error({text:"Please enter a value!"}));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "ether");

    if (action === "presale" && gweiValue.gt(ethers.utils.parseUnits(avaxBalance, "ether"))) {
      return dispatch(error({text:"You cannot deposit more than your AVAX balance."}));
    } else if (action === "presale" && gweiValue.gt(ethers.utils.parseUnits(maxEthlimit, "ether"))) {
      return dispatch(error({text:"You cannot deposit more than Max contribute amount."}));
    } else if (action === "presale" && gweiValue.lt(ethers.utils.parseUnits(minEthlimit, "ether"))) {
      return dispatch(error({text:"You cannot deposit less than Min contribute amount."}));
    }
    await dispatch(changeDeposit({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };

  const started = starttime ? Date.now() >= starttime.getTime() : false;
  const ended = endtime ? Date.now() >= endtime.getTime() : false;
  const inPrivate = pEndTimestamp ? started && Date.now() < pEndTimestamp.getTime() : false;

  const isAllowanceDataLoading = hardCap == undefined;
  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>
  );

  return (
    <div className="stake-view">
        <Grid item className={`ohm-card`}>
            <div className="stake-top-metrics">
              {!iswllisted && <Typography variant="body1" className="privatesale-note" color="textSecondary">
                This is private sale, to participate in private sale, you need to register WL list. You are not registered yet.</Typography>}
            {!ended && starttime &&
                  <Box mb={3}>
                    <Typography variant="h5" color="textSecondary" className="title">
                      {started ? 'PreSale Ends In' : 'PreSale Starts In'}
                    </Typography>
                    <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={started ? endtime : starttime} description="Presale Starts" />
                  </Box>
                }
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Paper className="presale-card">
                    <Typography variant="body1" className="presale-note" color="textSecondary">
                      {ended ? 
                      <>
                      Presale ended
                      </> : started ? 
                        <div style={{color:'#2cd337'}}>
                          Presale now is live
                        </div> :
                      <>
                      Presale is not open yet
                      </>}
                    </Typography>
                    <Typography variant="h5" color="textSecondary" className="title">
                      Contribute To Get JUPITER<br/><br/>
                    </Typography>
                    <Grid container className="claimarea">
                        <Grid xs={12} sm={6} md={6} lg={6} style={{marginBottom: '10px'}}>
                          <FormControl className="deposit-input" variant="outlined">
                            <InputLabel htmlFor="amount-input"></InputLabel>
                            <OutlinedInput
                              id="amount-input"
                              type="number"
                              placeholder="Enter an amount"
                              className="stake-input"
                              value={quantity}
                              width="70%"
                              onChange={e => setQuantity(e.target.value)}
                              labelWidth={0}
                              endAdornment={
                                <InputAdornment position="end">
                                  <Button variant="text" onClick={setMax} style={{color:"#fff"}}>
                                    Max
                                  </Button>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={6} lg={6} style={{marginBottom: '10px'}}>
                          {address ? 
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={!iswllisted || isAllowanceDataLoading || isPendingTxn(pendingTransactions, "deposit")}
                            onClick={() => {
                              onChangeDeposit("presale");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "deposit", "Contribute")}
                          </Button> : 
                          <div className="wallet-menu" id="wallet-menu">
                            {modalButton}
                          </div>
                          }
                        </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Paper className="presale-card">
                    <Typography variant="h6" color="textSecondary">
                      Your JUPITER Balance:
                    </Typography>
                    <Typography variant="h5" color="textSecondary" className="title">
                    {jupiterBalance ? new Intl.NumberFormat({
                      style: "currency",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(jupiterBalance): 0} JUPITER<br/><br/>
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      Your Available Contribute Amount:
                    </Typography>
                    <Typography variant="h5" color="textSecondary" className="title">
                    {capable ? new Intl.NumberFormat({
                      style: "currency",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(capable): 0} AVAX<br/><br/>
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      Your Contributed Amount:
                    </Typography>
                    <Typography variant="h5" color="textSecondary" className="title">
                    {userInfo ? new Intl.NumberFormat({
                      style: "currency",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(userInfo): 0} AVAX<br/><br/>
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                    SoftCap:
                    </Typography>
                    <Typography variant="h5" color="textSecondary" className="title">
                    {hardCap ? new Intl.NumberFormat({
                      style: "currency",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(300): 0} AVAX<br/><br/>
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      HardCap:
                    </Typography>
                    <Typography variant="h5" color="textSecondary" className="title" style={minEthlimit && {marginBottom:'10px'}}>
                    {hardCap ? new Intl.NumberFormat({
                      style: "currency",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(hardCap): 0} AVAX
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Paper className="presale-card">
                    <Typography variant="h6" color="textSecondary">
                    PreSale Price:
                    </Typography>
                    <Typography variant="h5" color="textSecondary" className="title">
                    {price ? new Intl.NumberFormat({
                      style: "currency",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(inPrivate ? wprice : price):0} JUPITER <small>Per 1AVAX</small><br/><br/>
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                    Launch Price:
                    </Typography>
                    <Typography variant="h5" color="textSecondary" className="title">
                    {price ? new Intl.NumberFormat({
                      style: "currency",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(5000):0} JUPITER <small>Per 1AVAX</small><br/><br/>
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      Min Contribute:
                    </Typography>
                    <Typography variant="h5" color="textSecondary" className="title">
                    {minEthlimit ? new Intl.NumberFormat({
                      style: "currency",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(minEthlimit):0} AVAX <small>Per Wallet</small><br/><br/>
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      Max Contribute:
                    </Typography>
                    <Typography variant="h5" color="textSecondary" className="title">
                    {minEthlimit ? new Intl.NumberFormat({
                      style: "currency",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(maxEthlimit):0} AVAX <small>Per Wallet</small><br/><br/>
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      Total Contributed Amount:
                    </Typography>
                    {totalRaisedAVAX && (<Progress animation={3} completed={totalRaisedAVAX/hardCap*100} className="progress">
                      <p>
                      {userInfo ? new Intl.NumberFormat({
                      style: "currency",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                      }).format(totalRaisedAVAX/hardCap*100): 0}%
                      </p>
                    </Progress>)}
                    <Typography variant="h5" color="textSecondary" className="title">
                    {totalRaisedAVAX ? new Intl.NumberFormat({
                      style: "currency",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(totalRaisedAVAX): 0} AVAX
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper className="presale-card contract-area" >
                    <div className="contract-area">
                      <img src={logoImg} height="70px" width= "70px" style={{ marginTop: "7px" }}/>
                      <Typography variant="h6" className="puretext">
                        <p className="title">JUPITER Token Address</p>
                        <Link href={`https://snowtrace.io/address/${JUPITER_ADDRESS}`} target="_blank">{smallerScreen ? shorten(JUPITER_ADDRESS) : JUPITER_ADDRESS}</Link>
                      </Typography>
                    </div>
                    <div className="contract-area">
                      <img src={contractImg} height="70px" width= "70px" style={{ marginTop: "7px" }}/>
                      <Typography variant="h6" className="puretext">
                        <p className="title">Presale Contract Address</p>
                        <Link href={`https://snowtrace.io/address/${PRESALE_ADDRESS}`} target="_blank">{smallerScreen ? shorten(PRESALE_ADDRESS) : PRESALE_ADDRESS}</Link>
                      </Typography>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </div>
        </Grid>
    </div>
  );
}

export default Presale;
