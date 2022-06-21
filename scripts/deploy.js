const { ethers, run, network } = require("hardhat");

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage"); // bc we import ethers from hardhat, SimpleStorage is automatically found
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  const deployed = await simpleStorage.deployed();
  console.log(`Deployed contract to ${simpleStorage.address}`);

  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    // we are on rinkeby and the etherscan api key is defined
    console.log("Waiting for block confirmations...");
    await simpleStorage.deployTransaction.wait(6); // wait six blocks before verifying contract
    await verify(simpleStorage.address, []);
  }

  // at this point the contract is deployed and verified
  const currentValue = await simpleStorage.retrieve();
  console.log(`Current value: ${currentValue}`);

  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated value: ${updatedValue}`);
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
