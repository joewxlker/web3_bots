import calculate_gas_price, { computeBuyOrderFromTransaction } from "./util/calculategas";
import { ABI, BUY_AMOUNT } from './constants'
import { iface, CONTRACT, UNI_WOUTER } from "./constants";
import { buyToken, sellToken } from "./util";
import HoneypotScan, { HoneypotChains } from '@normalizex/honeypot-is';
//@ts-ignore
import * as Ethers from 'ethers';
import Logger from "./util/logger";
import Updater from "./util/updater";
const ethers = require('ethers');
require('dotenv').config({ path: '.env' });
var colors = require('colors');
const express = require("express");
const http = require('http');
const app = express();
const PORT = process.env.PORT || 3880 || 3001;
colors.enable()
const customWsProvider = new ethers.providers.WebSocketProvider(process.env.WSS!, { name: 'ethereum', chainId: 1 });
const accountOne: Ethers.Wallet = new ethers.Wallet(process.env.SECRET!).connect(customWsProvider);
const contract: Ethers.Contract = new ethers.Contract(CONTRACT, ABI, accountOne);

const init = async () => {

    let buyPending: boolean = false;
    let count: number = 0;

    const honeyPotScan = (await HoneypotScan(contract.address, 'eth'));
    await Logger('INIT', contract);
    if (honeyPotScan.is_honeypot) {
        console.log(honeyPotScan)
        Logger('SCAMM')
        return process.exit();
    };
    await Logger('ETHERSCAN', contract);
    await Logger('DEXTOOLS', contract);
    await Logger('PANCAKE', contract);
    await Logger('HONEYPOT', contract);

    const interval = setInterval(() => {
        if (buyPending) return
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
        buyPending = true;
        const { buyGasPrice, gasLimit } = await computeBuyOrderFromTransaction(customWsProvider, event.transactionHash);
        const honeyPotScan = (await HoneypotScan(contract.address, 'eth'));
        if (honeyPotScan.is_honeypot) { Logger('SCAMM'); process.exit() };
        const buy = await buyToken(accountOne, CONTRACT, gasLimit, buyGasPrice);
        const result = !buy ? console.log('execution failed') : console.log(buy);
        clearInterval(interval);
        !buy && process.exit();
        return result;
    })

    customWsProvider.on('pending', async (data: any) => {
        Updater(data, customWsProvider, contract.address);
    })

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