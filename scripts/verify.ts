
/* eslint-disable node/no-unpublished-import */
import { HardhatRuntimeEnvironment } from 'hardhat/types'
// eslint-disable-next-line node/no-missing-import
import { DeployFunction, Create2DeployOptions } from 'hardhat-deploy/types'
import { networkConfig, developmentChains } from "../hardhat-helper-config"
import { ethers, run, deployments, getNamedAccounts, getChainId, network } from "hardhat"
import { string } from 'hardhat/internal/core/params/argumentTypes'
import { Address } from 'hardhat-deploy/types'
function sleep (ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export async function verify () {
    const { deploy, log, get, deterministic } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()
    let linkTokenAddress, oracle
    if (developmentChains.includes(network.name)) {
        const linkToken = await get("LinkToken")
        const MockOracle = await get("MockOracle")
        linkTokenAddress = linkToken.address
        oracle = MockOracle.address
    } else {
        linkTokenAddress = networkConfig[network.name].linkToken!
        oracle = networkConfig[network.name].oracle
    }
    const jobId = ethers.utils.toUtf8Bytes(networkConfig[network.name].jobId!)
    const fee = networkConfig[network.name].fundAmount
    let constructorArgs = [oracle, jobId, fee, linkTokenAddress]
    let scavengerHunt = await ethers.getContractAt('ScavengerHunt', "0x8094a967D62cF4b6ee3A75AEe083A52cfD9048e0")
    console.log(`Started verification`)
    await run('verify:verify', {
        address: scavengerHunt.address,
        constructorArguments: constructorArgs,
    })
    console.log("Verified")
}

verify()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
