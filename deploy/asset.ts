import { ethers, hardhatArguments, run } from "hardhat";
import { getIMXAddress, getEnv, sleep } from "./utils";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying Contract with the account:", deployer.address);
    console.log("Account Balance:", (await deployer.getBalance()).toString());

    if (!hardhatArguments.network) {
        throw new Error("please pass --network");
    }

    const owner = getEnv("CONTRACT_OWNER_ADDRESS");
    const name = getEnv("CONTRACT_NAME");
    const symbol = getEnv("CONTRACT_SYMBOL");

    const Asset = await ethers.getContractFactory("Asset");
    const imxAddress = getIMXAddress(hardhatArguments.network);
    const asset = await Asset.deploy(owner, name, symbol, imxAddress);
    console.log("Deployed Contract Address:", asset.address);
    console.log('Verifying contract in 5 minutes...');
    await sleep(60000 * 5);
    await run("verify:verify", {
        address: asset.address,
        constructorArguments: [owner, name, symbol, imxAddress],
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
