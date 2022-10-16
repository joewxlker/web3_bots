const ethers = require('ethers');
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

export const ABI = 'replace with ABI'
// ABI = ['function: ..., { doSomthing: '', }'] <-- abi doesnt use quotation around outside brackets

export const CONTRACT: string = 'insert contract address inside quotation marks';

// export const OWNER: string = 'insert owner address here';
// OWNER does nothing, dont need yet;

export const BUY_AMOUNT: number = 0.001
// Buy amount in ethereum

export const IGNORE_HONEYPOT_SCAN: boolean = false;
// If set to true will ignore honeypot scanner 
// !! Only set to true if you are willing to buy honeypot

export const SLIPPAGE_ON_SELL: number = 20;

export const SLIPPAGE_ON_BUY: number = 20;
