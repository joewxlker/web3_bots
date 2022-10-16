//@ts-ignore
import * as Ethers from 'ethers';
//@ts-ignore;

export async function computeBuyOrderFromTransaction(provider: any, tx: Ethers.Transaction): Promise<{
    gasLimit: Ethers.BigNumber, buyGasPrice: Ethers.BigNumber, sellGasPrice: Ethers.BigNumber
}> {
    const transaction = await provider.getTransaction(tx);
    const gasLimit = Ethers.utils.parseUnits(transaction.gasLimit.toString(), 'wei');
    const buyGasPrice = calculate_gas_price("buy", transaction.gasPrice)
    const sellGasPrice = calculate_gas_price("sell", transaction.gasPrice)
    return { buyGasPrice, gasLimit, sellGasPrice }
}

export default function calculate_gas_price(action: 'buy' | 'sell', amount: Ethers.BigNumber) {
    if (action === "buy") {
        return Ethers.utils.parseUnits(amount.add(2).toString(), 'wei')
    } else {
        return Ethers.utils.parseUnits(amount.sub(2).toString(), 'wei')
    }
}