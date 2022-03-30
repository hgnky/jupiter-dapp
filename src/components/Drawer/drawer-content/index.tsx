import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./social";
import LogoIcon from "../../../assets/icons/test-logo.svg";
// import DashboardIcon from "../../../assets/icons/dashboard.svg";
// import AccountIcon from "../../../assets/icons/stake.svg";
import { trim, shorten } from "../../../helpers";
import { useAddress } from "../../../hooks";
import { Link } from "@material-ui/core";
// import { Skeleton } from "@material-ui/lab";
import "./drawer-content.scss";
// import DocsIcon from "../../../assets/icons/stake.svg";
import classnames from "classnames";

function NavContent() {
    const [isActive] = useState();
    const address = useAddress();

    const checkPage = useCallback((location: any, page: string): boolean => {
        const currentPath = location.pathname.replace("/", "");
        if (currentPath.indexOf("presale") >= 0 && page === "presale") {
            return true;
        }
        if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
            return true;
        }
        if (currentPath.indexOf("account") >= 0 && page === "account") {
            return true;
        }
        if (currentPath.indexOf("calculator") >= 0 && page === "calculator") {
            return true;
        }
        if (currentPath.indexOf("swap") >= 0 && page === "swap") {
            return true;
        }
        return false;
    }, []);

    return (
        <div className="dapp-sidebar">
            <div className="branding-header">
                <Link href="/" target="_blank">
                    <img alt="" src={LogoIcon} width={270}/>
                    {/* <div className="logotext">
                        <p>JUPITER</p>
                    </div> */}
                </Link>

                {address && (
                    <div className="wallet-link">
                        <Link href={`https://app.zerion.io/${address}/overview`} target="_blank">
                            <p>{shorten(address)}</p>
                        </Link>
                    </div>
                )}
            </div>

            <div className="dapp-menu-links">
                <div className="dapp-nav">
                    <Link
                        component={NavLink}
                        to="/presale"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "presale");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <p>Presale</p>
                        </div>
                    </Link>

                    <Link
                        component={NavLink}
                        to="/dashboard"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "dashboard");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <p>Dashboard</p>
                        </div>
                    </Link>

                    <Link
                        component={NavLink}
                        to="/account"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "account");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <p>Account</p>
                        </div>
                    </Link>

                    <Link
                        component={NavLink}
                        to="/calculator"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "calculator");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <p>Calculator</p>
                        </div>
                    </Link>
                    

                    <Link
                        component={NavLink}
                        to="/swap"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "swap");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <p>Swap</p>
                        </div>
                    </Link>

                    {/* <Link 
                        href="https://app.uniswap.org/#/swap?chain=ropsten&inputCurrency=ETH&outputCurrency=0xC5088bE8F7D1bE00b306B74c066b4A765E9c7126" 
                        target="_blank"
                        className={classnames("button-dapp-menu", { active: isActive })}
                    > 
                        <div className="dapp-menu-item">
                            <p>Swap</p>
                        </div>
                    </Link> */}

                    <Link 
                        href="https://moonshinestaking.gitbook.io/jupiter/" 
                        target="_blank"
                        className={classnames("button-dapp-menu", { active: isActive })}
                    > 
                        <div className="dapp-menu-item">
                            <p>Docs</p>
                        </div>
                    </Link>
                </div>
            </div>
            <Social />
        </div>
    );
}

export default NavContent;
