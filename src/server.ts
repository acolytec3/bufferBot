import fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { getArbitrumOneSdk } from "@dethcrypto/eth-sdk-client";
import { ethers } from "ethers";
import config from "../config.json";
const server: FastifyInstance = fastify({});
const provider = new ethers.providers.EtherscanProvider(
  "arbitrum",
  config.alchemyKey
);
const signer = new ethers.Wallet(config.key, provider);
const tradeBodyJsonSchema = {
  type: "object",
  properties: {
    pair: { type: "string" },
    price: { type: "string" },
    direction: { type: "string" },
  },
};
const opts: RouteShorthandOptions = {
  schema: {
    body: tradeBodyJsonSchema,
    response: {
      200: {
        type: "object",
        properties: {
          data: {
            type: "string",
          },
        },
      },
    },
  },
};

type Order = {
  pair: string;
  price: string;
  direction: string;
};

const pairs = {
  ETHUSD: "0x89dd9ba4d290045211a6ce597a98181c7f9d899d",
};

const wlIPs = ["52.89.214.238", "34.212.75.30", "54.218.53.128", "52.32.178.7"];

server.post("/", opts, async (req, res) => {
  const trade = req.body as Order;
  if (
    wlIPs.findIndex((el) => el === <string>req.headers["x-forwarded-for"]) > -1
  ) {
    await makeTrade({
      pair: trade.pair,
      price: trade.price,
      direction: trade.direction,
    });
    return { data: "ok " };
  } else {
    return { code: 401 };
  }
});

const makeTrade = async (trade: Order) => {
  const sdk = getArbitrumOneSdk(signer);
  let contract: string = "";
  switch (trade.pair) {
    case "ETHUSD":
      contract = pairs.ETHUSD;
    default:
      "";
  }

  try {
    const gas = await sdk.buffer.estimateGas.initiateTrade(
      "1000000",
      "300",
      trade.direction === "above",
      contract,
      parseFloat(trade.price) * 10 ** 8,
      "50",
      true,
      "",
      0
    );
    const gasPrice = await provider.getGasPrice();
    const nonce = await provider.getTransactionCount(signer.address)
    const tradeRes = await sdk.buffer.initiateTrade(
      "1000000", // Trade value is 1 USDC
      "300", // Timelimit is 5 minutes (5 * 60 seconds)
      trade.direction === "above", // Trade is "long" if alert from TV is "above", otherwise "short"
      contract, // Matched to the pair from TV alert
      parseFloat(trade.price) * 10 ** 8, // Current price times 10^8 - Contract uses 8 decimal places
      "50", // Slippage (defaults to 50 bips like web ui)
      true, // Allow partial fill
      "", // Referral code -- defaults to blank
      0, // Optopi token ID -- we default to 0 but you could check in the contract
      {
        gasLimit: gas.add(100000),
        maxFeePerGas: gasPrice,
        maxPriorityFeePerGas: ethers.BigNumber.from(1),
        nonce: nonce
      }
    );
    const txReceipt = await tradeRes.wait();
    console.log(txReceipt);
  } catch (err) {
    console.log(err);
  }
};
const start = async () => {
  console.log("starting up");
  await server.listen({ port: 3000 });
};

start();
