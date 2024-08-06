import { ethers, run, network } from "hardhat"

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")

  console.log("Deploying Contract...")
  const simpleStorage = await SimpleStorageFactory.deploy()
  await simpleStorage.waitForDeployment()
  const address = await simpleStorage.getAddress()
  console.log(`Deployed contract to ${address}`)

  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block txes...")
    await simpleStorage.deploymentTransaction()?.wait(6)
    await verify(address, [])
  }

  const currentValue = await simpleStorage.retrieve()
  console.log(`Current value is ${currentValue}`)

  // Update the current value
  const transactionResponse = await simpleStorage.store(7)
  await transactionResponse.wait(1)
  const updatedValue = await simpleStorage.retrieve()
  console.log(`Updated value is: ${updatedValue}`)
}

async function verify(contractAddress: string, args: any[]) {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (err: any) {
    if (err.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified")
    } else {
      console.log("The following error occurred while verifying: ", err)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
