import { computeBuyOrderFromTransaction } from "./util/calculategas";
import { accounts, contract, customWsProvider, IGNORE_HONEYPOT_SCAN, LOG_TOKEN_URLS_ON_STARTUP } from './constants'
import { CONTRACT } from "./constants";
import { buyToken, sellToken } from "./util";
import HoneypotScan from '@normalizex/honeypot-is';
import * as Ethers from 'ethers';
import Logger from "./util/logger";
require('dotenv').config({ path: '.env' });
var colors = require('colors');
const express = require("express");
const http = require('http');
const app = express(); colors.enable();
const PORT = process.env.PORT || 3880 || 3001;

const init = async () => {

    let buyPending: boolean = false;
    let count: number = 0;

    await Logger('INIT', contract);

    const honeyPotScan = (await HoneypotScan(contract.address, 'eth'));
    if (honeyPotScan.is_honeypot && !IGNORE_HONEYPOT_SCAN) {
        console.log(honeyPotScan)
        Logger('SCAMM')
        return process.exit();
    };

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

    contract.on("Transfer", async (from: string, to: string, data: Ethers.BigNumber, event: any) => {
        if (buyPending) return;
        const honeyPotScan = (await HoneypotScan(contract.address, 'eth'));
        if (honeyPotScan.is_honeypot) { Logger('SCAMM'); process.exit() };
        buyPending = true;
        console.log('going in to buy')
        /**
         * 
         *  checks that the contract is not a honeypot and 
         *  that the recorded transaction includes necessary data
         *  Process terminates if honey pot detected.
         *
         */


        let output = []
        for (let i = 0; i < accounts.length; i++) {
            const { buyGasPrice, gasLimit } = await computeBuyOrderFromTransaction(customWsProvider, event.transactionHash, i);
            const buy = await buyToken(accounts[i], CONTRACT, gasLimit, buyGasPrice);
            output.push(buy);
        }
        console.log(output);
        clearInterval(interval);
        return process.exit();
        /**
         * 
         *  Attempts to send transaction and logs output to the console.
         * 
         */
    })

    // customWsProvider.on('pending', async (data: any) => {

    //     if (buyPending) return;
    //     const transaction = await customWsProvider.getTransaction(data);
    //     if (!transaction) return;
    //     if (transaction.to !== contract.address) return;
    //     const honeyPotScan = (await HoneypotScan(contract.address, 'eth'));
    //     if (honeyPotScan.is_honeypot) { Logger('SCAMM'); process.exit() };
    //     buyPending = true;
    //     console.log('going in to buy')
    //     /**
    //      * 
    //      * checks that the contract is not a honeypot and 
    //      * that the recorded transaction includes necessary data
    //      * Process terminates if honey pot detected.
    //      *
    //      */

    //     const { gasLimit, buyGasPrice } = await computeBuyOrderFromTransaction(customWsProvider, null, transaction);
    //     const buy = await buyToken(accountOne, CONTRACT, gasLimit, buyGasPrice);
    //     const result = !buy ? console.log('execution failed') : console.log(buy);
    //     !buy && process.exit();
    //     return result;
    //     /**
    //      * 
    //      * Attempts to send transaction and logs output to the console.
    //      * 
    //      */

    // })

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

init();
//now we create the express server
const server = http.createServer(app);
// we launch the server
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});