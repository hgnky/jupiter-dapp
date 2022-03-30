import { Networks } from "./blockchain";

const ETH_MAINNET = {
    JUPITER_ADDRESS: "0xE5bA47fD94CB645ba4119222e34fB33F59C7CD90",
    JUPITERETHLP: "0xf5D9b8947b11DdF5eE33374cC2865E775EBE00Dc",
    ETHUSDTLP: "0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE",
    PRESALE_ADDRESS: "0x945bD92Df21d833af83405640B10FEc6601FB822"
};

const AVAX_MAINNET = {
    JUPITER_ADDRESS: "0x3058A5e76986339C107b3F6636B774cE7328123B",
    JUPITERETHLP: "0xc3f2efc924ee37db29d3bdfdb8dbe22680848cc4",
    ETHUSDTLP: "0x87dee1cc9ffd464b79e058ba20387c1984aed86a",
    PRESALE_ADDRESS: "0x945bD92Df21d833af83405640B10FEc6601FB822"
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
