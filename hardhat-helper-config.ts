export interface networkConfigItem {
  id: number
  fundAmount: string
  jobId: string
  oracle: string
  linkToken?: string
  vrfCoordinator?: string
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
  hardhat: {
    id: 31337,
    linkToken: "0xa36085F69e2889c224210F603D836748e7dC0088",
    oracle: "0xc57b33452b4f7bb189bb5afae9cc4aba1f7a4fd8",
    jobId: "d5270d1c311941d0b08bead21fea7747",
    fundAmount: "1000000000000000000",
  },
  kovan: {
    id: 42,
    linkToken: "0xa36085F69e2889c224210F603D836748e7dC0088",
    oracle: "0xc57b33452b4f7bb189bb5afae9cc4aba1f7a4fd8",
    jobId: "0b267c5ec7af4cc4b5ede6de8e3bd980",
    fundAmount: "1000000000000000000",
  },
  rinkeby: {
    id: 4,
    linkToken: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
    oracle: "0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8",
    jobId: "531092b9b5304e2b849f3c28671065bc",
    fundAmount: "1000000000000000000",
  },
  polygon: {
    id: 137,
    linkToken: "0xb0897686c545045afc77cf20ec7a532e3120e0f1",
    oracle: "0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8",
    jobId: "531092b9b5304e2b849f3c28671065bc",
    fundAmount: "1000000000000000000",
  },
}

export const developmentChains = ["hardhat", "localhost"]

