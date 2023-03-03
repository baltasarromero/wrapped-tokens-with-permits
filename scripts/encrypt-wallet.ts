import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "ethers";
const fs = require('fs');

export async function main( _privateKey: string, _password: string) {
    const provider: JsonRpcProvider = new JsonRpcProvider(
        "http://127.0.0.1:8545"
    );

    const userWallet = new Wallet(_privateKey, provider) // CREATING A WALLET INSTANCE
    const encryptedWallet = await userWallet.encrypt(_password);

    try {
        fs.writeFileSync("./scripts/encrypted.json", JSON.stringify(encryptedWallet))
    } catch (err) {
        console.error(err)
    }     
} 