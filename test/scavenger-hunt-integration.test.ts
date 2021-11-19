import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { network, deployments, ethers, run } from "hardhat"
import { ScavengerHunt } from "../typechain/ScavengerHunt"
import { MockOracle } from "../typechain/MockOracle"
import { Deployment } from 'hardhat-deploy/dist/types'
import { expect } from 'chai'
const { developmentChains, networkConfig } = require("../hardhat-helper-config")

function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('ScavengerHunt', async () => {
  let runTest = false
  let ScavengerHuntDeployment: Deployment
  let scavengerHunt: ScavengerHunt
  let accounts: SignerWithAddress[]
  let player: SignerWithAddress
  let linkTokenAddress: string, oracleAddress: string
  beforeEach(async () => {
    if (!developmentChains.includes(network.name)) {
      runTest = true
    }
    accounts = await ethers.getSigners()
    player = accounts[0]
    ScavengerHuntDeployment = await deployments.get('ScavengerHunt')
    scavengerHunt = await ethers.getContractAt('ScavengerHunt', ScavengerHuntDeployment.address, player)
    linkTokenAddress = networkConfig[network.name].linkToken!
    oracleAddress = networkConfig[network.name].oracle!
  })

  it("Should allow people to attempt password", async () => {
    if (runTest) {
      const oracleResponseInt = 1
      const oracleResponse = ethers.utils.hexZeroPad(ethers.utils.hexlify(oracleResponseInt), 32)
      expect(await scavengerHunt.tokenIdTaken(oracleResponse)).to.equal(false)
      await run("fund-link", { contract: scavengerHunt.address, linkaddress: linkTokenAddress, fundamount: "2000000000000000000" }) // 1 LINK
      let transactionResponse = await scavengerHunt.attemptPassword("FreeBe")
      let transactionReceipt = await transactionResponse.wait()
      await sleep(250 * 1000)
      expect(await scavengerHunt.tokenIdTaken(oracleResponseInt)).to.equal(true)
    }
  })
})

