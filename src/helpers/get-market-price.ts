import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { getAddresses } from "../constants";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const addresses = getAddresses(networkID);
    const testEthAddress = addresses.JUPITERETHLP;
    const pairContract = new ethers.Contract(testEthAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    
    const ethUsdtAddress = addresses.ETHUSDTLP;
    const pairContract1 = new ethers.Contract(ethUsdtAddress, LpReserveContract, provider);
    const reserves1 = await pairContract1.getReserves();
    const ethPrice = reserves1[1] / reserves1[0];
    const marketPrice = reserves[1] / reserves[0] * ethPrice;
    return marketPrice;
}
