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
  let LinkToken: Deployment, MockOracle: Deployment, ScavengerHuntDeployment: Deployment
  let scavengerHunt: ScavengerHunt
  let mockOracle: MockOracle
  let accounts: SignerWithAddress[]
  let player: SignerWithAddress, admin: SignerWithAddress, playerTwo: SignerWithAddress
  beforeEach(async () => {
    if (developmentChains.includes(network.name)) {
      runTest = true
    }
    await deployments.fixture(["all"])
    accounts = await ethers.getSigners()
    admin = accounts[0]
    player = accounts[1]
    playerTwo = accounts[2]
    ScavengerHuntDeployment = await deployments.get("ScavengerHunt")
    LinkToken = await deployments.get('LinkToken')
    MockOracle = await deployments.get('MockOracle')
    scavengerHunt = await ethers.getContractAt("ScavengerHunt", ScavengerHuntDeployment.address, player)
    mockOracle = await ethers.getContractAt("MockOracle", MockOracle.address, admin)
  })

  it("Should allow people to attempt password", async () => {
    if (runTest) {
      const oracleResponseInt = 1
      const oracleResponse = ethers.utils.hexZeroPad(ethers.utils.hexlify(oracleResponseInt), 32)
      expect(await scavengerHunt.tokenIdTaken(oracleResponse)).to.equal(false)
      await run("fund-link", { contract: scavengerHunt.address, linkaddress: LinkToken.address, fundamount: "2000000000000000000" }) // 1 LINK
      let transactionResponse = await scavengerHunt.attemptPassword("FreeBe")
      let transactionReceipt = await transactionResponse.wait()
      let requestId = transactionReceipt.events![4].topics[1]
      let tx = await mockOracle.fulfillOracleRequest(requestId, oracleResponse)
      await tx.wait()
      expect(await scavengerHunt.tokenIdTaken(oracleResponseInt)).to.equal(true)
      expect(await scavengerHunt.ownerOf(oracleResponseInt)).to.equal(player.address)

      // It also shouldn't allow someone to steal
      scavengerHunt = await ethers.getContractAt("ScavengerHunt", ScavengerHuntDeployment.address, playerTwo)
      transactionResponse = await scavengerHunt.attemptPassword("FreeBe")
      transactionReceipt = await transactionResponse.wait()
      requestId = transactionReceipt.events![4].topics[1]
      tx = await mockOracle.fulfillOracleRequest(requestId, oracleResponse)
      expect(await scavengerHunt.ownerOf(oracleResponseInt)).to.equal(player.address)

    }
  })
})

