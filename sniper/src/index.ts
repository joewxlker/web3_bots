import { computeBuyOrderFromTransaction } from "./util/calculategas";
import { redirectAccounts, SELL_ON_RUG_PENDING, USE_DYNAMIC_ABI } from "./constants";
import { buyToken, sellToken } from "./util";
import * as Ethers from 'ethers';
import Logger from "./util/logger";
const abiDecoder = require('abi-decoder');
import {
    accounts,
    BUY_INTERVAL_IN_MILLISECONDS,
    customWsProvider,
    LOG_TOKEN_URLS_ON_STARTUP,
    MAX_AMOUNT_OF_BUYS_PER_ACCOUNT,
    REDIRECT_TOKENS_ACCOUNTS
} from './constants'
import getABIFromContractAddress from "./util/fetchABI";
require('dotenv').config({ path: '.env' });
var colors = require('colors');
const express = require("express");
const http = require('http');
const app = express(); colors.enable();
const PORT = process.env.PORT || 3880 || 3001;
var readline = require('readline');

const init = async (contract: Ethers.Contract, abi: Ethers.ContractInterface) => {

    let buyPending: boolean = false;
    let count: number = 0;

    await Logger('INIT', contract);

    if (LOG_TOKEN_URLS_ON_STARTUP) {
        await Logger('ETHERSCAN', contract);
        await Logger('DEXTOOLS', contract);
        await Logger('PANCAKE', contract);
        await Logger('HONEYPOT', contract);
    }

    const interval = setInterval(() => {
        if (buyPending) return process.stdout.clearLine(0);
        if (count !== 4) count++;
        if (count === 4) count = 0;
        const characters = ['|', '\\', '-', '/'];
        let dots: Array<string> = [''];
        let spaces: Array<string> = [' ', ' ', ' ', ' '];
        for (let i = 0; i < count; i++) {
            dots.push('.');
            spaces.shift();
        }
        process.stdout.write(` ~ INDEXING, Waiting for first pending txn${dots.join('')}${spaces.join('')}${characters[count]}\r`);
    }, 200);

    // Only listens for completed transactions from the contract
    contract.on("Transfer", async (from: string, to: string, data: Ethers.BigNumber, event: any) => {

        if (buyPending) return;

        buyPending = true;
        process.stdout.clearLine(0);
        console.log('GOING IN TO BUY')
        let output: any[] = [];

        if (BUY_INTERVAL_IN_MILLISECONDS !== null) {
            let buyCount: number = 0;
            const buyInterval = setInterval(async () => {
                buyCount++
                for (let i = 0; i < accounts.length; i++) {
                    const { buyGasPrice, gasLimit, buyPrice } = await computeBuyOrderFromTransaction(customWsProvider, event.transactionHash, i);
                    const buy = await buyToken(accounts[i], contract.address, gasLimit, buyGasPrice, buyPrice, REDIRECT_TOKENS_ACCOUNTS && REDIRECT_TOKENS_ACCOUNTS[i]);
                    output.push(buy);
                }
                if (buyCount >= MAX_AMOUNT_OF_BUYS_PER_ACCOUNT) {
                    clearInterval(buyInterval);
                    console.log("OUTPUT :: ", output);
                }
            }, 1);
            return listenToRugPending();
        }

        if (BUY_INTERVAL_IN_MILLISECONDS === null) {
            for (let i = 0; i < accounts.length; i++) {
                const { buyGasPrice, gasLimit, buyPrice } = await computeBuyOrderFromTransaction(customWsProvider, event.transactionHash, i);
                const buy = await buyToken(accounts[i], contract.address, gasLimit, buyGasPrice, buyPrice, REDIRECT_TOKENS_ACCOUNTS && REDIRECT_TOKENS_ACCOUNTS[i]);
                output.push(buy);
            }
            console.log("OUTPUT :: ", output);
            clearInterval(interval);
            return listenToRugPending();
        }

        return console.log("DID NOT BUY");
        /**
         * 
         *  Attempts to send transaction and logs output to the console.
         * 
         */
    })

    const listenToRugPending = () => {
        customWsProvider.on('pending', async (data: any) => {
            abiDecoder.addABI(abi);
            const transaction = await customWsProvider.getTransaction(data);
            if (!transaction) return;
            if (!transaction.to) return;
            if (transaction.to.toLowerCase() !== contract.address.toLowerCase()) return;
            const decodedData = abiDecoder.decodeMethod(transaction.data);
            decodedData?.name !== 'approve' && console.log(decodedData)
            if (decodedData.name === 'remove liquidity') {
                console.log('attempting to sell');
                if (SELL_ON_RUG_PENDING) {
                    for (let i = 0; i < accounts.length; i++) {
                        await sellToken(REDIRECT_TOKENS_ACCOUNTS ? redirectAccounts[i] : accounts[i], contract.address, transaction.gasLimit, transaction.gasPrice!);
                        return process.exit();
                    }
                }
            }
            // clearInterval(interval);
            // process.stdout.clearLine(0);
        })
    }

    customWsProvider._websocket.on("error", async (ep: any) => {
        let count: number = 3;
        const interval = setInterval(() => {
            if (count !== 4) count++;
            if (count === 4) count = 0;
            const characters = ['|', '\\', '-', '/'];
            let dots: Array<string> = [''];
            let spaces: Array<string> = [' ', ' ', ' ', ' '];
            for (let i = 0; i < count; i++) {
                dots.push('.');
                spaces.shift();
            }
            process.stdout.write(`Unable to connect to ${ep.subdomain} retrying in ${count}s${dots}${spaces}${characters}\r`);
        })
        customWsProvider._websocket.terminate();
        setTimeout(init, 3000);
        setTimeout(() => {
            process.stdout.clearLine(0)
        }, 3100);
        return () => clearInterval(interval);
    }, 1000);

    customWsProvider._websocket.on("close", async (code: any) => {
        let count: number = 3;
        const interval = setInterval(() => {
            if (count !== 4) count++;
            if (count === 4) count = 0;
            const characters = ['|', '\\', '-', '/'];
            let dots: Array<string> = [''];
            let spaces: Array<string> = [' ', ' ', ' ', ' '];
            for (let i = 0; i < count; i++) {
                dots.push('.');
                spaces.shift();
            }
            process.stdout.write(
                `Connection lost with code ${code}! Attempting reconnect in ${count}s${count}s${dots}${spaces}${characters}\r`
            );
        }, 1000)
        customWsProvider._websocket.terminate();
        setTimeout(init, 3000);
        setTimeout(() => {
            process.stdout.clearLine(0)
        }, 3100);
        return () => {
            clearInterval(interval);
        };
    });
}

//now we create the express server
const server = http.createServer(app);
// we launch the server
server.listen(PORT, () => {
});

async function preStart() {
    if (USE_DYNAMIC_ABI) {
        try {
            var rl = readline.createInterface(
                process.stdin, process.stdout);
            rl.question('Contract address: ', async (address: string) => {
                if (!address || address == '') return preStart();
                const abi = await getABIFromContractAddress(address);
                const contract = new Ethers.ethers.Contract(address, abi!, accounts[0]);
                init(contract, abi);
            });
        } catch (err) {
            console.log(err)
        }
    }
}

preStart();