import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import { HardhatUserConfig, task, subtask} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const lazyImport = async (module: any) => {
  return await import(module);
};

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    // Goerli Testnet
    goerli: {
      url: process.env.INFURA_GOERLI_URL || "",
      chainId: 5,
      accounts: [
      ],
    },
    sepolia: {
      url: process.env.INFURA_SEPOLIA_URL || "",
      chainId: 11155111,
      accounts: [
      ],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at <https://etherscan.io/>
    apiKey: process.env.ETHERSCAN_API_KEY || ""
  }
};


task("deploy", "Deploys contracts").setAction(async () => {
  const { main } = await lazyImport("./scripts/deploy");
  await main();
});


task("deploy-with-pk", "Deploys contract with pk")
  .addParam("privateKey", "Please provide the private key")
  .setAction(async ({ privateKey}) => {
    const { main } = await lazyImport("./scripts/deploy-with-pk");
    await main(privateKey);
  });  

task("encrypt-wallet", "Encrypt-wallet")
  .addParam("privateKey", "Please provide the private key")
  .addParam("password", "Please provide the password to un-encrypt the wallet")
  .setAction(async ({ privateKey, password}) => {
    const { main } = await lazyImport("./scripts/encrypt-wallet");
    await main(privateKey, password);
  });  

task("decrypt-wallet", "Decrypt-wallet")
  .addParam("path", "Please provide the path to the encrypted wallet file")
  .addParam("password", "Please provide the password to un-encrypt the wallet")
  .setAction(async ({ path, password}) => {
    const { main } = await lazyImport("./scripts/decrypt-wallet");
    await main(path, password);
  });    

subtask("print", "Prints a message")
  .addParam("message", "The message to print")
  .setAction(async (taskArgs) => {
    console.log(taskArgs.message);
  });

export default config;
