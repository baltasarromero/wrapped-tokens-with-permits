import { ethers } from "hardhat";

export async function main() {
    const ETHWrapperFactory = await ethers.getContractFactory("ETHWrapper"); 
    const ethWrapperContract = await ETHWrapperFactory.deploy();
    console.log("Waiting for ETHWrapperContract deployment...");
    await ethWrapperContract.deployed();
    console.log(`ETHWrapper contract is deployed to ${ethWrapperContract.address}`);
    const WETH = await ethWrapperContract.WETHToken();
    console.log(`Weth Token address ${WETH}`);
}
