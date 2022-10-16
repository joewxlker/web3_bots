const ethers = require('ethers')
const web3 = require('Web3');
//@ts-ignore
import * as Ethers from 'ethers';
import erc20, { WBNB_CONTRACT, router, UNI_WOUTER, WETH_CONTRACT, SLIPPAGE_ON_SELL, SLIPPAGE_ON_BUY } from "../constants";
import { abi, swapAbi } from "../constants/abis";
import calculateAmounts from './calculateAmounts';
import Logger, { LogTransactionURL } from './logger';
var colors = require('colors');

colors.enable()

export const sellToken = async (account: Ethers.Wallet, tokenContract: string, gasLimit: Ethers.BigNumber, gasPrice: Ethers.BigNumber, value = 99) => {

    try {
        const sellTokenContract = new ethers.Contract(tokenContract, swapAbi, account)
        const contract = new ethers.Contract(UNI_WOUTER, abi, account)
        const accountAddress = account.address
        const tokenBalance = await erc20(account, tokenContract).balanceOf(accountAddress);
        let amountOutMin = 0;
        const amountIn = tokenBalance.mul(value).div(100)

        const amounts = await router(account).getAmountsOut(amountIn, [WETH_CONTRACT, tokenContract]);
        amountOutMin = amounts[1].sub(amounts[1].div(100).mul(SLIPPAGE_ON_SELL));

        // amountOutMin = amounts[1]
        const approve = await sellTokenContract.approve(UNI_WOUTER, amountIn)
        const receipt_approve = await approve.wait();

        if (receipt_approve && receipt_approve.blockNumber && receipt_approve.status === 1) {
            Logger('APPROVED');

            const swap_txn = await contract.swapExactTokensForETHSupportingFeeOnTransferTokens(
                amountIn, amountOutMin,
                [tokenContract, WETH_CONTRACT],
                accountAddress,
                (Date.now() + 1000 * 60 * 10),
                { 'gasLimit': gasLimit, 'gasPrice': gasPrice, })

            const receipt = await swap_txn.wait();
            if (receipt && receipt.blockNumber && receipt.status === 1) { // 0 - failed, 1 - success
                process.stdout.write(`Transaction https://etherscan.io/tx/${receipt.transactionHash} mined, status success`);
            } else if (receipt && receipt.blockNumber && receipt.status === 0) {
                process.stdout.write(`Transaction https://etherscan.io/tx/${receipt.transactionHash} mined, status failed`);
            } else {
                process.stdout.write(`Transaction https://etherscan.io/tx/${receipt.transactionHash} not mined`);
            }
        }
        Logger('BUY_EXCECUTED')
    }
    catch (err: any) {
        console.log(err.code)
    }

}

export const buyToken = async (account: Ethers.Wallet, tokenContract: string, gasLimit: Ethers.BigNumber, gasPrice: Ethers.BigNumber): Promise<string | null> => {

    try {
        const { amountIn, amountOutMin } = await calculateAmounts(account, tokenContract, 'BUY');
        const tx = await router(account).swapExactETHForTokensSupportingFeeOnTransferTokens(
            amountOutMin,
            [WETH_CONTRACT, tokenContract],
            account.address,
            (Date.now() + 1000 * 60 * 10),
            { 'value': amountIn, 'gasLimit': gasLimit, 'gasPrice': gasPrice, },);
        return LogTransactionURL(await tx.wait());
    }
    catch (err: any) {
        Logger('ERROR', err.code.toString());
        return null;
    }
}

