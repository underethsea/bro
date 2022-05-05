import {ethers} from 'ethers'
const id = process.env.REACT_APP_ALCHEMY_KEY
const url = 'https://polygon-mainnet.g.alchemy.com/v2/' + id
export const AlchemyProvider = new ethers.providers.JsonRpcProvider(url);