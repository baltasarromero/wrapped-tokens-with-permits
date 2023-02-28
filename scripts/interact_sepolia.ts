import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const ETHWrapperArtifact = require("../artifacts/contracts/ETHWrapper.sol/ETHWrapper.json");
const WETHArtifact = require("../artifacts/contracts/WETH.sol/WETH.json");

import { ethers } from "hardhat";
import { InfuraProvider } from "@ethersproject/providers";
import { Contract, Wallet } from "ethers";
import { ETHWrapper, WETH } from "../typechain-types";

async function main() {
    const provider: InfuraProvider = new InfuraProvider(
        "sepolia",
        process.env.INFURA_PROJECT_ID
    );

    const wallet1: Wallet = new Wallet(process.env.WALLET_1_PK || "", provider);

    const ethWrapper = <ETHWrapper>(
        new Contract(
            //process.env.ETH_WRAPPER_SEPOLIA_ADDRESS || "",
            "0xB81b0f86A40C6155156edfd0C128a7FdFCC93995",
            ETHWrapperArtifact.abi,
            wallet1
        )
    ); 

    
    let balance = await wallet1.getBalance();

    console.log("wallet balance", ethers.utils.formatEther(balance.toString()));
    const wrapValue = ethers.utils.parseEther("0.0003");

    const wethAddressFromWrapper = await ethWrapper.WETHToken();
    console.log(`WETH Address is ${wethAddressFromWrapper}`);

    // Interact with WETH directly
    const weth = <WETH>(
        new Contract(wethAddressFromWrapper, WETHArtifact.abi, wallet1)
    ); 

    let encodePacked = ethers.utils.solidityPack(["string", "uint256"], ["byNumber", 1])

    let digest = ethers.utils.keccak256(encodePacked)

    console.log("Encoded data:", encodePacked );
    console.log("Hashed data:", digest );
   
    let wrapViaFallbackTx = {
        to: ethWrapper.address,
        value: wrapValue,
        data: digest
    };
    
    await wallet1.sendTransaction(wrapViaFallbackTx);

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

    let senderWETHBalance = await weth.balanceOf(wallet1.address);
    console.log(
        `wallet 1 with address: ${
            wallet1.address
        } has a balance of ${ethers.utils.formatEther(
            senderWETHBalance.toString()
        )} `
    );

    // unwrap
    // unwrapping requires first to approve ethWrapper contract to withdraw from the sender's balance
    /*  const approveTx = await weth.approve(ethWrapper.address, wrapValue);
    await approveTx.wait();
    
    const unwrapTx = await ethWrapper.unwrap(wrapValue)
    await unwrapTx.wait()
    
    balance = await weth.balanceOf(wallet1.address)
    console.log("Balance after unwrapping:", ethers.utils.formatEther(balance.toString()))
    
    let contractETHBalance = await provider.getBalance(ethWrapper.address);
    console.log("Contract ETH balance after unwrapping:", ethers.utils.formatEther(contractETHBalance.toString())); */
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
