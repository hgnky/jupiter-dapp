import { Networks } from "./blockchain";

const ETH_MAINNET = {
    JUPITER_ADDRESS: "0xaD9686cF5EcD881B59787Bf105BFCCe790f202C5",
    JUPITERETHLP: "0x94e563cD2Fe5fa146B1474a066EF2a7b45D7A8B9",
    ETHUSDTLP: "0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE",
    PRESALE_ADDRESS: "0x698201eC4eE7342398eD7606FD488147911fa04c"
};

const AVAX_MAINNET = {
    JUPITER_ADDRESS: "0xaD9686cF5EcD881B59787Bf105BFCCe790f202C5",
    JUPITERETHLP: "0x94e563cD2Fe5fa146B1474a066EF2a7b45D7A8B9",
    ETHUSDTLP: "0x87dee1cc9ffd464b79e058ba20387c1984aed86a",
    PRESALE_ADDRESS: "0x698201eC4eE7342398eD7606FD488147911fa04c"
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
