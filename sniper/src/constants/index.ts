const ethers = require('ethers');
import * as Ethers from 'ethers';
require('dotenv').config()

export const PAN_ROUTER_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
export const WBNB_CONTRACT = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const UNI_WOUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
export const WETH_CONTRACT = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

export default function erc20(account: any, tokenAddress: string) {
    return new ethers.Contract(
        tokenAddress,
        [{
            "constant": true,
            "inputs": [{ "name": "_owner", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "name": "balance", "type": "uint256" }],
            "payable": false,
            "type": "function"
        },
        { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
        { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
        {
            "constant": false,
            "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }],
            "name": "approve",
            "outputs": [{ "name": "", "type": "bool" }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        ],
        account
    );
}

export function router(account: any) {
    return new ethers.Contract(
        UNI_WOUTER,
        [
            'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
            'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
            'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
            'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
            'function swapExactTokensForETH (uint amountOutMin, address[] calldata path, address to, uint deadline) external payable'
        ],
        account
    );
}

export const iface = new ethers.utils.Interface(['function    swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)',
    'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)',
    'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin,address[] calldata path,address to,uint deadline)'])

export const ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "_maxTxAmount", "type": "uint256" }], "name": "MaxTxAmountUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address[]", "name": "bots_", "type": "address[]" }], "name": "addbot", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "manualsend", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "manualswap", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "openTrading", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "removeLimits", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "onoff", "type": "bool" }], "name": "setCooldownEnabled", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newTax", "type": "uint256" }], "name": "setStandardTax", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]

/**
 * 
 * ABI = ['function: ..., { doSomthing: '', }'] <-- abi doesnt use quotation around outside brackets
 * 
**/

export const CONTRACT: string = '0xbe7738bddbdac4db67f5ad2495286d56a64d4032';

/**
 * 
 *  export const OWNER: string = 'insert owner address here';
 *  OWNER does nothing, dont need yet;
 * 
**/

export const BUY_AMOUNT: number = 0.005

/** 
 * 
 *  Buy amount in ethereum
 * 
 * */

export const SLIPPAGE_ON_SELL: number = 20;

export const SLIPPAGE_ON_BUY: number = 20;

export const customWsProvider = new ethers.providers.WebSocketProvider(process.env.WSS!, { name: 'ethereum', chainId: 1 });

export const accountOne: Ethers.Wallet = new ethers.Wallet(process.env.SECRET_ONE!).connect(customWsProvider);
export const accountTwo: Ethers.Wallet = new ethers.Wallet(process.env.SECRET_TWO!).connect(customWsProvider);

/**
 *  create extra accounts here 
 * 
 *  @example export const accountTwo: Ethers.wallet = new ethers.Wallet(process.env.SECRET_TWO!).connect(customWsProvider)
 * 
 * */

export const contract: Ethers.Contract = new ethers.Contract(CONTRACT, ABI, accountOne);
export const accounts: Array<Ethers.Wallet> = [accountOne, accountTwo];

// SETTINGS

export const IGNORE_HONEYPOT_SCAN: boolean = false;

/** 
 * 
 *  If set to true will ignore honeypot scanner
 *  !! Only set to true if you are willing to buy honeypot
 * 
 * */

export const LOG_TOKEN_URLS_ON_STARTUP: boolean = true;

// export const MATCH_MOST_RECENT_BUY_AMOUNT: boolean = true;