import { ethers, hardhatArguments, run } from "hardhat";
import { getIMXAddress } from "./utils";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying Contracts with the account:", deployer.address);
    console.log("Account Balance:", (await deployer.getBalance()).toString());

    if (!hardhatArguments.network) {
        throw new Error("please pass --network");
    }
    await deploy(hardhatArguments.network);
}
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function deploy(network: string) {
    const Registration = await ethers.getContractFactory("Registration");
    const imx_address = getIMXAddress(network);
    const asset = await Registration.deploy(imx_address);
    console.log("Deployed Contract Address:", asset.address);
    console.log('Verifying contract in 5 minutes...');
    await sleep(60000 * 5);
    await run("verify:verify", {
        address: asset.address,
        constructorArguments: [
            imx_address
        ],
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
