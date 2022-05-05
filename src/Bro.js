import React, { useState } from "react";
import { ethers } from "ethers";
import "./WalletCard.css";
import { PolygonTwabRewardsContract } from "./twabContract.js";
import { BroContract } from "./broContract.js";
import github from "./github.png";
import bronder from "./bronder.png";
import discord from "./discord.png";
import { decentralBro } from "./randoBro.js";
import { polygonTWABRewardsAddress, polygonTWABRewardsAbi } from "./constaBro";

const discordUrl = "https://soon.tm/hahahahaha";
const gitHubUrl = "https://github.com/underethsea/bro";

const promotionId = 12;
const epochIds = [0];

const Bro = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Yo Wallet");
  const [bros, setBros] = useState(null);
  const [twabContract, setTwabContract] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [walletBros, setWalletBros] = useState(null);
  const [transHash, setTransHash] = useState(null)

  // const [userBalance, setUserBalance] = useState(null);
  // const [signer, setSigner] = useState(null);
  // const [provider, setProvider] = useState(null);

  const getBroClaimable = async (account) => {
    let broBalance = await PolygonTwabRewardsContract.getRewardsAmount(
      account,
      promotionId,
      epochIds
    ,{gasLimit: 400000});
    return broBalance.toString() / 1e18;
  };

  const getWalletBros = (address) => {
    try {
      BroContract.balanceOf(address).then((daBalance) => {
        let countYourBros = parseFloat(ethers.utils.formatUnits(daBalance, 18));
        setWalletBros(countYourBros);
      });
    } catch (error) {
      setWalletBros(null);
      console.log(error);
    }
  };

  const updateConnection = () => {
    try {
      let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      setErrorMessage(null);

      // setProvider(tempProvider);
      let tempSigner = tempProvider.getSigner();
      // setSigner(tempSigner);

      let tempContract = new ethers.Contract(
        polygonTWABRewardsAddress,
        polygonTWABRewardsAbi,
        tempSigner
      );
      setTwabContract(tempContract);

      tempProvider.getNetwork().then((chainId) => {
        setChainId(chainId.chainId);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const connectWalletHandler = () => {
    if (window.ethereum && defaultAccount == null) {
      // set ethers provider
      updateConnection();

      // connect to metamask
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          setConnButtonText(result[0].substring(0, 8));
          setDefaultAccount(result[0]);
          getWalletBros(result[0]);
          getBroClaimable(result[0]).then((bros) => setBros(bros));
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else if (!window.ethereum) {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
    updateConnection();
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateConnection();
  };
  // listen for account changes
  if (!window.ethereum) {
    console.log("no metamask");
  } else {
    window.ethereum.on("accountsChanged", accountChangedHandler);
    window.ethereum.on("chainChanged", chainChangedHandler);
  }

  const claimBros = async () => {
    if (chainId !== 137) {
      setErrorMessage("Polygon only, bro");
      return;
    } else {
      console.log(twabContract);
      twabContract.claimRewards(defaultAccount, 12, [0]).then((ok) => {
        console.log(ok);
        getWalletBros();
        setTransHash(ok.hash); 
      });
    }
  };

  //   useEffect(() => {

  //     if (defaultAccount) {
  // 		      provider.getBalance(defaultAccount).then((balanceResult) => {console.log(balanceResult);if(balanceResult){
  //         setUserBalance(ethers.utils.formatEther(balanceResult));}
  //       });
  //     }
  //   }, [defaultAccount]);

  return (
    <div>
      <div className="walletBros">
        {walletBros && walletBros !== 0 ? walletBros : ""}
      </div>
      <div className="connecion">
        <button className="broButton" onClick={connectWalletHandler}>
          {connButtonText}
        </button>
      </div>
      <center>
        <div className="walletCard">
          <div className="header">
            <h1>
              <img src={bronder} className="headerImg" alt="bronder" /> FOR
              POOLERS
            </h1>
            <div>{decentralBro}</div>{" "}
          </div>
          {/* <h4> Connection to MetaMask using ethers.js </h4> */}

          {defaultAccount && (
            <div>
              {/* <div className="accountDisplay">
            <h3>Address: {defaultAccount}</h3>
          </div> */}
              <div className="balanceDisplay">
                {/* <h3>MATIC Balance: {userBalance}</h3> */}
              </div>
              <div></div>
              {bros ? (
                <h3>
                  <div>
                    <button className="broButton" onClick={claimBros}>
                      Claim Yo
                    </button>{" "}
                    {bros} BT
                  </div>

                  {/* <div>Chain {chainId}</div> */}
                </h3>
              ) : !walletBros ? (
                "no BT claimable, BRO"
              ) : ''}
              {!bros && walletBros ? (walletBros + ' BT') : ''}
              {transHash && <a href={"https://polygonscan.com/tx/" + {transHash}}>View claim on PolygonScan</a>}
            </div>
          )}
          {errorMessage}
        </div>
        <div className="github">
          <a href={gitHubUrl}>
            <img src={github} className="iconBro" alt="github" />
          </a>
          <a href={discordUrl}>
            <img src={discord} className="iconBro" alt="discord" />
          </a>
        </div>
      </center>
    </div>
  );
};

export default Bro;
