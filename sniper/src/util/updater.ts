import { OWENER } from "../constants";

export default async function Updater(data: any, provider: any, contractAddress: string) {
    const transaction = await provider.getTransaction(data);
    if (!transaction || transaction.to !== contractAddress) return null;
    console.log(transaction);
}