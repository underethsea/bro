import {ethers} from 'ethers'
import {AlchemyProvider} from './provider.js'
const brosAddress = '0x3Cf7F62e861B777261af7096c8B93Da5dA060A93'
const brosAbi = ["function balanceOf(address) public view returns (uint256)"]
const BroContract = new ethers.Contract(brosAddress,brosAbi,AlchemyProvider)
export {BroContract}