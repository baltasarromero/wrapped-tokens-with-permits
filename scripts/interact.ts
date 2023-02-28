import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const ETHWrapperArtifact = require("../artifacts/contracts/ETHWrapper.sol/ETHWrapper.json");
const WETHArtifact = require("../artifacts/contracts/WETH.sol/WETH.json");

import { ethers } from "hardhat";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Contract, Wallet } from "ethers";
import { ETHWrapper, WETH } from "../typechain-types";

async function main() {
    const provider: JsonRpcProvider = new JsonRpcProvider(
        "http://127.0.0.1:8545"
    );

    const wallet: Wallet = new Wallet(
        process.env.HH_ACCOUNT_0_PK || "",
        provider
    );

    const ethWrapper = <ETHWrapper>(
        new Contract(
            process.env.WRAPPER_CONTRACT_LOCAL_ADDRESS || "",
            ETHWrapperArtifact.abi,
            wallet
        )
    );

    const balance = await wallet.getBalance();
    console.log("wallet balance", ethers.utils.formatEther(balance.toString()));

    const wrapValue = ethers.utils.parseEther("0.0003");

    const wethAddressFromWrapper = await ethWrapper.WETHToken();
    console.log(`so far so good. WETH Address is ${wethAddressFromWrapper}`);

    // Interact with WETH directly
    const weth = <WETH>(
        new Contract(wethAddressFromWrapper, WETHArtifact.abi, wallet)
    );

    const tx = await ethWrapper.wrap({ value: wrapValue });
    await tx.wait();

    let contractETHWrapperBalance = await provider.getBalance(
        ethWrapper.address
    );
    console.log(
        "Contract ETHWrapper balance after wrapping:",
        contractETHWrapperBalance.toString()
    );
    let contractWETHBalance = await provider.getBalance(weth.address);
    console.log(
        "Contract WETH balance after wrapping:",
        ethers.utils.formatEther(contractWETHBalance.toString())
    );
    let senderWETHBalance = await weth.balanceOf(wallet.address);
    console.log("Sender ballance after wrapping", ethers.utils.formatEther(senderWETHBalance.toString()));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
