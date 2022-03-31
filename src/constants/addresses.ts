import { Networks } from "./blockchain";

const ETH_MAINNET = {
    JUPITER_ADDRESS: "0x5c5Dd26D963d9779f3cE30a1EA8ffA8663f774b8",
    JUPITERETHLP: "0xDBe8F13E428b37bf04c16f9f49978e341657cEEE",
    ETHUSDTLP: "0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE",
    PRESALE_ADDRESS: "0x15fac1b9BfCD9C1c6FD636e025EdDB9d0E7156D8"
};

const AVAX_MAINNET = {
    JUPITER_ADDRESS: "0x5c5Dd26D963d9779f3cE30a1EA8ffA8663f774b8",
    JUPITERETHLP: "0xDBe8F13E428b37bf04c16f9f49978e341657cEEE",
    ETHUSDTLP: "0x87dee1cc9ffd464b79e058ba20387c1984aed86a",
    PRESALE_ADDRESS: "0x15fac1b9BfCD9C1c6FD636e025EdDB9d0E7156D8"
}


export const getAddresses = (networkID: number) => {
    if (networkID === Networks.ETH) {
        return ETH_MAINNET;
    }
    else if (networkID === Networks.AVAX) {
        return AVAX_MAINNET;
    }
    else {
        throw Error("Network don't support");
    }
};
