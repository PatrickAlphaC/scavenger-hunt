/* eslint-disable no-process-exit */
import { ethers, deployments, run, network } from 'hardhat'
import { networkConfig } from "../hardhat-helper-config"

function sleep (ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export async function attemptPassword () {
    const { get } = deployments
    const accounts = await ethers.getSigners()
    const ScavengerHunt = await ethers.getContractFactory('ScavengerHunt')
    const ScavengerHuntDeployment = await get('ScavengerHunt')
    // eslint-disable-next-line no-undef
    const scavengerHunt = new ethers.Contract(ScavengerHuntDeployment.address, ScavengerHunt.interface, accounts[0])
    await run("fund-link", { contract: scavengerHunt.address, linkaddress: networkConfig[network.name].linkToken! })
    const requestTx = await scavengerHunt.attemptPassword("FreeBe")
    const requestReceipt = await requestTx.wait()
    let requestId = requestReceipt.events![4].topics[1]
    console.log(`Entered with requestId of ${requestId}!\n  Waiting for response...`)
    await sleep(120 * 1000)
    console.log(`Your mint is ${await scavengerHunt.tokenIdTaken(1)}`)
    console.log("If the answer is 0, you likely have to just wait longer!")
    return requestTx
}

attemptPassword()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
