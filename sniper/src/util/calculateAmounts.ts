import { BUY_AMOUNT, router, SLIPPAGE_ON_BUY, WETH_CONTRACT } from "../constants";
const ethers = require('ethers');
import * as Ethers from 'ethers'

export default async function (account: Ethers.Wallet, contractAddress: string): Promise<{
    amountIn: Ethers.BigNumber, amountOutMin: Ethers.BigNumber
}> {
    const amountIn = ethers.utils.parseEther(BUY_AMOUNT.toString());
    const amounts = await router(account).getAmountsOut(amountIn, [WETH_CONTRACT, contractAddress]);
    const amountOutMin = amounts[1].sub(amounts[1].div(100).mul(SLIPPAGE_ON_BUY));
    return { amountIn, amountOutMin }
} 