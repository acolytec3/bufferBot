import { defineConfig } from '@dethcrypto/eth-sdk'
import config from '../config.json'
export default defineConfig({
  contracts: {
    arbitrumOne: {
      buffer: '0x0e0A1241C9cE6649d5D30134a194BA3E24130305',
    },
  },
  rpc: {
    arbitrumOne: `https://arb-mainnet.g.alchemy.com/v2/${config.alchemyKey}`,
  }
})