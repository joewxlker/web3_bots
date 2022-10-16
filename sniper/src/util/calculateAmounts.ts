import { BUY_AMOUNT, router, SLIPPAGE_ON_BUY, SLIPPAGE_ON_SELL, WETH_CONTRACT } from "../constants";
const ethers = require('ethers');
import * as Ethers from 'ethers'

export default async function calculateAmounts(account: Ethers.Wallet, contractAddress: string, txnType: 'SELL' | 'BUY'): Promise<{
    amountIn: Ethers.BigNumber, amountOutMin: Ethers.BigNumber
}> {
    const amountIn = ethers.utils.parseEther(BUY_AMOUNT.toString());
    const amounts = await router(account).getAmountsOut(amountIn, [WETH_CONTRACT, contractAddress]);
    const amountOutMin = amounts[1].sub(amounts[1].div(100).mul(txnType === 'BUY' ? SLIPPAGE_ON_BUY : SLIPPAGE_ON_SELL));
    return { amountIn, amountOutMin }
} 