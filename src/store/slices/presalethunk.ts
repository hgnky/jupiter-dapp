import { ethers, BigNumber } from "ethers";
import { getAddresses } from "../../constants";
import { messages } from "../../constants/messages";
import { PresaleABI } from "../../abi";
import { clearPendingTxn, fetchPendingTxns } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBalances } from "./account-slice";
import { error, info } from "../slices/messages-slice";
import { IActionValueAsyncThunk, IJsonRPCError } from "./state.interface";


interface IUAData {
  address: string;
  value?: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}


export const changeDeposit = createAsyncThunk(
  "presale/changeDeposit",
  async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    
    const addresses = getAddresses(networkID);

    if (!provider) {
      dispatch(error({text: messages.please_connect_wallet}));
      return;
    }

    const signer = provider.getSigner();
    const presale = new ethers.Contract(addresses.PRESALE_ADDRESS, PresaleABI, signer);

    let depositTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      uaData.type = "presale";
      console.log("depositing......");
      console.log("value", ethers.utils.parseUnits(value, "ether"));
      console.log(address);
      console.log(presale);
      depositTx = await presale.deposit({value:ethers.utils.parseUnits(value, "ether"), gasLimit:3600000});
      const pendingTxnType = "depositing";
      uaData.txHash = depositTx.hash;
      dispatch(fetchPendingTxns({ txnHash: depositTx.hash, text: "Depositing...", type: pendingTxnType }));
      await depositTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      console.log('log->rpcError2', 2);
      const rpcError = e as IJsonRPCError;
      console.log('log->rpcError', rpcError);
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error(
            {text: "You may be trying to deposit more than your balance! Error code: 32603. Message: ds-math-sub-underflow"},
          ),
        );
      } else {
        dispatch(error({text: rpcError.message}));
      }
      return;
    } finally {
      if (depositTx) {
        // segmentUA(uaData);

        dispatch(clearPendingTxn(depositTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);
