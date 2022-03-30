import { Networks } from "./blockchain";

const ETH_MAINNET = {
    JUPITER_ADDRESS: "0x0D9Fb46a844e765Fb109ACf115b2f31a157aE99e",
    JUPITERETHLP: "0x9cb0e94242055E5DBDfF92f66d8DBFe4DFD99341",
    ETHUSDTLP: "0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE",
    PRESALE_ADDRESS: "0xB65Cc5035728E7E19BbaEC11A28d9411938951e2"
};

const AVAX_MAINNET = {
    JUPITER_ADDRESS: "0x0D9Fb46a844e765Fb109ACf115b2f31a157aE99e",
    JUPITERETHLP: "0x9cb0e94242055E5DBDfF92f66d8DBFe4DFD99341",
    ETHUSDTLP: "0x87dee1cc9ffd464b79e058ba20387c1984aed86a",
    PRESALE_ADDRESS: "0xB65Cc5035728E7E19BbaEC11A28d9411938951e2"
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
