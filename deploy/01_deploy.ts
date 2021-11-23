/* eslint-disable node/no-unpublished-import */
import { HardhatRuntimeEnvironment } from 'hardhat/types'
// eslint-disable-next-line node/no-missing-import
import { DeployFunction, Create2DeployOptions } from 'hardhat-deploy/types'
import { networkConfig, developmentChains } from "../hardhat-helper-config"
import { ethers, run } from "hardhat"

function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}


const deployScavengerHunt: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts, getChainId } = hre
  const { deploy, log, get, deterministic } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = await getChainId()
  let linkTokenAddress, oracle
  if (developmentChains.includes(hre.network.name)) {
    const linkToken = await get("LinkToken")
    const MockOracle = await get("MockOracle")
    linkTokenAddress = linkToken.address
    oracle = MockOracle.address
  } else {
    linkTokenAddress = networkConfig[hre.network.name].linkToken!
    oracle = networkConfig[hre.network.name].oracle
  }
  const jobId = ethers.utils.toUtf8Bytes(networkConfig[hre.network.name].jobId!)
  const fee = networkConfig[hre.network.name].fundAmount
  let constructorArgs = [oracle, jobId, fee, linkTokenAddress]
  const scavengerHunt = await deploy("ScavengerHunt", {
    from: deployer,
    args: constructorArgs,
    log: true,
  })
  log(`ScavengerHunt deployed at ${scavengerHunt.address}`)
  if (!developmentChains.includes(hre.network.name)) {
    await verify(scavengerHunt.address, constructorArgs)
  }
}
export default deployScavengerHunt
deployScavengerHunt.tags = ['all', 'scavengerHunt']

async function verify (address: string, constructorArguments: any[]) {
  await sleep(30000)
  console.log(`Started verification`)
  await run('verify:verify', {
    address,
    constructorArguments,
  })
  console.log("Verified")
}
