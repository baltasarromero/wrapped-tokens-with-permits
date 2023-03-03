import { JsonRpcProvider } from "@ethersproject/providers";
import { parse } from "dotenv";
import { Wallet } from "ethers";
const fs = require('fs');



const loadData = (path) => {
    try {
      return fs.readFileSync(path, 'utf8')
    } catch (err) {
      console.error(err)
      return false
    }
  }


export async function main( _path: string, _password: string) {
    const provider: JsonRpcProvider = new JsonRpcProvider(
        "http://127.0.0.1:8545"
    );


    const encryptedWalletFile = loadData(_path);
    const encryptedJson = JSON.parse(encryptedWalletFile);
    const userWallet = await Wallet.fromEncryptedJson(encryptedJson, _password);
   
    console.log("this is the address", userWallet.address);
} 