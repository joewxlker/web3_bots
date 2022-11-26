const ethers = require('ethers');
import * as Ethers from 'ethers';
require('dotenv').config()

export const PAN_ROUTER_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
export const WBNB_CONTRACT = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const UNI_WOUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
export const WETH_CONTRACT = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

/** 
 * 
 *  Buy amount in ethereum - Only need to set if MATCH_MOST_RECENT_BUY_AMOUNT = false 
 * 
 * */
export const BUY_AMOUNT: number = 0.02

export const SLIPPAGE_ON_SELL: number = 20;
export const SLIPPAGE_ON_BUY: number = 20;

// This is just configuration, no need to change
export const customWsProvider = new ethers.providers.WebSocketProvider(process.env.WSS!, { name: 'ethereum', chainId: 1 });

/**
 *  create extra accounts here 
 * 
 *  @example export const accountThree: Ethers.wallet = new ethers.Wallet(process.env.SECRET_THREE!).connect(customWsProvider)
 * 
 * */
export const accountOne: Ethers.Wallet = new ethers.Wallet(process.env.SECRET_ONE!).connect(customWsProvider);
export const accountTwo: Ethers.Wallet = new ethers.Wallet(process.env.SECRET_TWO!).connect(customWsProvider);
export const accounts: Array<Ethers.Wallet> = [accountOne, accountTwo, /** add accounts to this array to use them */];

export const redirectOne: Ethers.Wallet = new ethers.Wallet(process.env.SECRET_REDIRECT_ONE).connect(customWsProvider)
export const redirectTwo: Ethers.Wallet = new ethers.Wallet(process.env.SECRET_REDIRECT_TWO).connect(customWsProvider)
export const redirectAccounts: Array<Ethers.Wallet> = [redirectOne, redirectTwo, /** add redireect account to this array to use them */];
/**
 * 
 *  enter the contract addresses of the redirect accounts here
 * 
 */
export const REDIRECT_TOKENS_ACCOUNTS: Array<string> | null = ['0x85DFaDf707D571627252a52318B7c5Ef25A425a2', '0xc1f5e33028792765c4d9cabeA3eFce0FC652c2cF']


/**
 * 
 * If set to true will generate ABI from contract address;
 * This feature will decrease performance which may lead to undesired behaivours.
 * 
 */
export const USE_DYNAMIC_ABI: boolean = true


/** 
 * 
 *  If set to true will ignore honeypot scanner
 *  !! Only set to true if you are willing to buy honeypot
 * 
 * */
export const IGNORE_HONEYPOT_SCAN: boolean = true;


/**
 * 
 *  If set to true, will log token etherscan, dextools, pancakeswap and honeypot urls
 * 
 */
export const LOG_TOKEN_URLS_ON_STARTUP: boolean = true;


/**
 * 
 *  Set BUY_INTERVAL_IN_MILLISECONDS to null to buy once per address;
 *  
 */
export const BUY_INTERVAL_IN_MILLISECONDS: number | null = 1;
export const MAX_AMOUNT_OF_BUYS_PER_ACCOUNT: number = 2;

/**
 * 
 *  If set to true will buy at the same price as the most recent transaction
 * 
 */
export const MATCH_MOST_RECENT_BUY_AMOUNT: boolean = false;


export const SELL_ON_RUG_PENDING: boolean = true

