import "./style.scss";
import { Grid, Zoom } from "@material-ui/core";
import { getAddresses } from "../../constants";
import { DEFAULD_NETWORK } from "../../constants/blockchain";

function Swap() {
    const addresses = getAddresses(DEFAULD_NETWORK);
    return (
        <div className="swap-view">
            <Zoom in={true}>
                <Grid className="swap-card-grid" container direction="column" spacing={2}>
                    <iframe src={'https://app.bogged.finance/avax/swap?chain=avalanche&tokenIn=AVAX&tokenOut='+addresses.JUPITER_ADDRESS+'&embed=1&theme=dark'} class="bogged-dex"></iframe>
                </Grid>
            </Zoom>
        </div>
    );
}

export default Swap;