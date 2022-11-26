export enum Status {
    MINED_SUCCESS = 'MINED_SUCCESS',
    NOT_MINED = 'NOT_MINED',
    MINED_FAILED = 'MINED_FAILED'
}

export default async function Logger(type?: string, data?: any, txn?: Array<string>) {
    //@ts-ignore
    type === 'ETHERSCAN' && data ? console.log('Etherscan: ', ` "https://etherscan.io/token/${data.address}"`.green) : //@ts-ignore
        type === 'PANCAKE' && data ? console.log('Pancake: ', `https://pancakeswap.finance/swap?chainId=1&outputCurrency=${data.address}`.green) : //@ts-ignore
            type === 'DEXTOOLS' && data ? console.log('Dextools: ', `"https://www.dextools.io/app/ether/pair-explorer/${data.address}"`.green) : //@ts-ignore
                type === 'HONEYPOT' && data ? console.log('Honeypot.is: ', `https://honeypot.is/ethereum?address=${data.address}`.green) : //@ts-ignore
                    type === 'SCAMM' ? console.log('DEV IS A HONEYPOT RUGGING SKEMMAR ( . Y . ) PROCESS TERMINATED'.red) :
                        type === 'SCAM_CHECK_PASSED' ? console.log(`tokensniffer passed, Going in to buy for ${data} ETH.`) :
                            type === 'BUY_EXCECUTED' ? console.log('excecution finished, waiting on txn') :
                                type === 'INIT' && data ? console.log('listening to: ', `${await data.name()}`) :
                                    type === 'TXN_RECEIPT' && txn ? logOutput(data, txn) :
                                        type === 'APPROVED' ? console.log('Approved') :
                                            type === 'ERROR' && console.log(data);
}

const logOutput = (data: any, txn: Array<string>) => {
    console.log(txn);
    for (let v in data) console.log(data[v])
}

export function LogTransactionURL(txnHash: any): string | null {
    const result = !txnHash ? null : txnHash.status === 2 ? Status.MINED_FAILED : txnHash.status === 1 ? Status.MINED_SUCCESS : Status.NOT_MINED;
    Logger('TXN_RECIEPT', [txnHash, result],)
    return result;
}