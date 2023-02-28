import { ethers } from "hardhat";
import hre from 'hardhat';

export async function main( _privateKey: string) {
  await hre.run('print', { message: `Private Key:  ${_privateKey}` });
  const selectedNetwork: string = hre.network.name;
  await hre.run('print', { message: `Deploying to network:  ${selectedNetwork}` });
  const wallet = new ethers.Wallet(_privateKey, ethers.provider); // New wallet with the privateKey passed from CLI as param
  await hre.run('print', { message: `Deploying contract with account: ${wallet.address}` });
  const ETH_WRAPPER_FACTORY = await ethers.getContractFactory("ETHWrapper");
  const ethWrapperContract = await ETH_WRAPPER_FACTORY.connect(wallet).deploy();
  await ethWrapperContract.deployed();
  await hre.run('print', { message: `ETHWrapperContract was deployed to ${ethWrapperContract.address}` });  
  const weth = await ethWrapperContract.WETHToken();

  await hre.run('print', { message: `WETH address ${weth}` });
 
}