const axios = require('axios');
import cheerio from 'cheerio';
import { ethers } from 'ethers';

export default async function getABIFromContractAddress(contractAddress: string): Promise<ethers.ContractInterface> {
    try {
        const { data } = await axios.get(`https://etherscan.io/token/${contractAddress}#code`);
        const $ = cheerio.load(data);
        return JSON.parse($.html()
            .split('<pre class="wordwrap js-copytextarea2 scrollbar-custom" id="js-copytextarea2" style="height: 200px; max-height: 400px; margin-top: 5px;">')[1]
            .split('</pre>')[0]
        )
    } catch (e: any) {
        console.error(`Error while fetching data for ${contractAddress} - ${e.message}`);
        process.exit();
    }
}

