const axios = require('axios');
import cheerio from 'cheerio';
import { ethers } from 'ethers';

export default async function getABIFromContractAddress(contractAddress: string): Promise<ethers.ContractInterface> {
    try {
        const { data } = await axios.get(`https://etherscan.io/token/${contractAddress}#code`);
        const $ = cheerio.load(data);
        return JSON.parse($.html()
            .split('<pre class="wordwrap js-copytextarea2" id="js-copytextarea2" style="height: 200px; max-height: 400px; margin-top: 5px;">')[1]
            .split('</pre><br></div><div class="mb-4"><div class="d-md-flex justify-content-between align-items-center bg-white-content py-2"><h4 class="card-header-title">')[0]
        )
    } catch (e: any) {
        console.error(`Error while fetching data for ${contractAddress} - ${e.message}`);
        process.exit();
    }
}

