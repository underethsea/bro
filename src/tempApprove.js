// hack for approving bronders (unverified contract) for create promotion

import React, { useState} from "react";
import { ethers } from "ethers";
import "./WalletCard.css";
import { PolygonTwabRewardsContract } from "./twabContract.js";

const approveAmount = ethers.constants.MaxInt256

const polygonTWABRewardsAddress = '0xCa9adB15E33948199066f772C3cb02B62356d764'
const polygonTWABRewardsAbi = JSON.parse('[{"inputs":[{"internalType":"contract ITicket","name":"_ticket","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"promotionId","type":"uint256"}],"name":"PromotionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"promotionId","type":"uint256"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PromotionDestroyed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"promotionId","type":"uint256"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"epochNumber","type":"uint8"}],"name":"PromotionEnded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"promotionId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"numberOfEpochs","type":"uint256"}],"name":"PromotionExtended","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"promotionId","type":"uint256"},{"indexed":false,"internalType":"uint8[]","name":"epochIds","type":"uint8[]"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RewardsClaimed","type":"event"},{"inputs":[],"name":"GRACE_PERIOD","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_promotionId","type":"uint256"},{"internalType":"uint8[]","name":"_epochIds","type":"uint8[]"}],"name":"claimRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"_token","type":"address"},{"internalType":"uint64","name":"_startTimestamp","type":"uint64"},{"internalType":"uint256","name":"_tokensPerEpoch","type":"uint256"},{"internalType":"uint48","name":"_epochDuration","type":"uint48"},{"internalType":"uint8","name":"_numberOfEpochs","type":"uint8"}],"name":"createPromotion","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_promotionId","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"destroyPromotion","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_promotionId","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"endPromotion","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_promotionId","type":"uint256"},{"internalType":"uint8","name":"_numberOfEpochs","type":"uint8"}],"name":"extendPromotion","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_promotionId","type":"uint256"}],"name":"getCurrentEpochId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_promotionId","type":"uint256"}],"name":"getPromotion","outputs":[{"components":[{"internalType":"address","name":"creator","type":"address"},{"internalType":"uint64","name":"startTimestamp","type":"uint64"},{"internalType":"uint8","name":"numberOfEpochs","type":"uint8"},{"internalType":"uint48","name":"epochDuration","type":"uint48"},{"internalType":"uint48","name":"createdAt","type":"uint48"},{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint256","name":"tokensPerEpoch","type":"uint256"},{"internalType":"uint256","name":"rewardsUnclaimed","type":"uint256"}],"internalType":"struct ITwabRewards.Promotion","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_promotionId","type":"uint256"}],"name":"getRemainingRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_promotionId","type":"uint256"},{"internalType":"uint8[]","name":"_epochIds","type":"uint8[]"}],"name":"getRewardsAmount","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ticket","outputs":[{"internalType":"contract ITicket","name":"","type":"address"}],"stateMutability":"view","type":"function"}]')
const broAddress="0x3Cf7F62e861B777261af7096c8B93Da5dA060A93"
const broAbi = [" function approve(address spender, uint rawAmount) external returns (bool)"]
const Approve = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
//   const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  // const [provider, setProvider] = useState(null);
//   const [bros, setBros] = useState(null);
  const [twabContract,setTwabContract] = useState(null)
  // const [signer,setSigner] = useState(null)
  const [chainId,setChainId] = useState(null)
  const [broContract,setBroContract] = useState(null)

  // const getBroClaimable = async (account) => {
  //   console.log(account);
  //   const promotionId = 10;
  //   // const epochIds = 0;
  //   let broBalance = await PolygonTwabRewardsContract.getRewardsAmount(
  //     account,
  //     promotionId,
  //     [0]
  //   );
  //   console.log(broBalance);
  //   return broBalance.toString() / 1e18;
  // };

  const updateConnection = () => {
	let tempProvider = new ethers.providers.Web3Provider(window.ethereum)

	// setProvider(tempProvider);
	let tempSigner = tempProvider.getSigner()
	// setSigner(tempSigner)

	let tempContract = new ethers.Contract(polygonTWABRewardsAddress,polygonTWABRewardsAbi,tempSigner)
	setTwabContract(tempContract)

    const tempBroContract = new ethers.Contract(broAddress,broAbi,tempSigner)
    setBroContract(tempBroContract)


	tempProvider.getNetwork().then(chainId => {console.log(chainId);setChainId(chainId.chainId)})
	
  }
  const connectWalletHandler = () => {
    if (window.ethereum && defaultAccount == null) {
      // set ethers provider
      updateConnection()

      // connect to metamask
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          setConnButtonText("Connected " + result[0].substr(0,5));
          setDefaultAccount(result[0]);
        //   getBroClaimable(result[0]).then((bros) => setBros(bros));
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
  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);
  // const claimBros = async () => {
	//   console.log(twabContract)
  //   twabContract.claimRewards(defaultAccount, 10, [0]).then(
  //     (ok) => console.log(ok)
  //   );
  // };

  const approveBros = async () => {
      broContract.approve(polygonTWABRewardsAddress,approveAmount).then(ok=>console.log(ok))
  }

//   useEffect(() => {

//     if (defaultAccount) {
// 		      provider.getBalance(defaultAccount).then((balanceResult) => {console.log(balanceResult);if(balanceResult){
//         setUserBalance(ethers.utils.formatEther(balanceResult));}
//       });
//     }
//   }, [defaultAccount]);


  return (
    <div className="walletCard">
      {/* <h4> Connection to MetaMask using ethers.js </h4> */}
      <button onClick={connectWalletHandler}>{connButtonText}</button>
      {defaultAccount && (
        <div>
          {/* <div className="accountDisplay">
            <h3>Address: {defaultAccount}</h3>
          </div> */}
          <div className="balanceDisplay">
            {/* <h3>MATIC Balance: {userBalance}</h3> */}
            <div>
                  <button onClick={approveBros}>Approve BRT</button>
                </div>
            {/* {bros ? 
              <h3>
                BRO Claimable: {bros}
                <div>
                  <button onClick={claimBros}>Claim</button>
                </div>
				<div>Chain {chainId}</div>
              </h3>
			 : 'no bros claimable'}*/}
      </div>
        </div>
      )} 
      {errorMessage}
    </div>
  );
};

export default Approve;
