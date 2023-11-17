import dotenv from "dotenv";
import { ethers, providers } from "ethers";
import {
  EVMAssetTransfer,
  Environment,
  getTransferStatusData,
} from "@buildwithsygma/sygma-sdk-core";

dotenv.config();

export const distributeRewards = async (req: any, res: any) => {
  const { userStringArray, totalAmount, fanTokenId } = req.params;
  // split commas
  const users = userStringArray.split(",");

  // create provider
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  // create contract
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS!,
    [
      "function distributeRewards(address[] memory _users, uint256 _totalAmount, uint256 _fanTokenId)",
    ],
    wallet
  );

  // call contract
  const tx = await contract.distributeRewards(users, totalAmount, fanTokenId);
  tx.wait()
    .then((receipt: any) => {
      console.log(receipt);
      res.status(200).send();
    })
    .catch((err: any) => {
      console.log(err);
      res.status(500).send();
    });
};

const getStatus = async (
  txHash: string
): Promise<{ status: string; explorerUrl: string } | void> => {
  try {
    const data = await getTransferStatusData(Environment.TESTNET, txHash);

    return data as { status: string; explorerUrl: string };
  } catch (e) {
    console.log("error:", e);
  }
};

export const collectMoneyFromGame = async (req: any, res: any) => {
  const { gameId } = req.params;

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_URL_GOERLI
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  // collect money from game
  const footyDAOAdapter = new ethers.Contract(
    "0x1E40E4d7D541294f3621dF3e8E2fA70Db72480aA",
    ["function withdraw(uint256 _gameId) external"],
    wallet
  );

  const footyDAO = new ethers.Contract(
    "0x29840eFC5f8727B1A2c852298B0d0f69Ab2d87AA",
    ["function getOwner(uint256 _gameId) external view returns (address)"],
    new ethers.providers.JsonRpcProvider(process.env.RPC_URL_SEPOLIA)
  );

  const gameOwner = await footyDAO.getOwner(gameId);

  const tx = await footyDAOAdapter.withdraw(gameId);

  const receipt = await tx.wait();

  // get first param after selector
  const amount = receipt.logs[receipt.logs.length - 1].data.slice(0, 66);

  const assetTransfer = new EVMAssetTransfer();
  // @ts-ignore-next-line
  await assetTransfer.init(provider, Environment.TESTNET);

  const transfer = await assetTransfer.createFungibleTransfer(
    await wallet.getAddress(),
    parseInt(process.env.SEPOLIA_CHAIN_ID!),
    gameOwner,
    process.env.RESOURCE_ID!,
    amount
  );

  let fee = await assetTransfer.getFee(transfer);
  console.log(fee);
  const approvals = await assetTransfer.buildApprovals(transfer, fee);
  // console.log(fee, approvals);
  for (const approval of approvals) {
    const response = await wallet.sendTransaction(
      approval as providers.TransactionRequest
    );
    await response.wait();
    console.log("Sent approval with hash: ", response.hash);
  }
  // 0xbce812d24255d94bbb5f5c51e384640a492ac178;
  // manually approve max uint
  // const tokenContract = new ethers.Contract(
  //   "0xA9C41B54e635259EB1C72Fde4a6844D82eD00cde",
  //   [
  //     "function approve(address spender, uint256 amount) external returns (bool)",
  //   ],
  //   wallet
  // );
  // const approveTx = await tokenContract.approve(
  //   "0xa5b71C034a8370AAF0326a5B646A36A9d7C821E7",
  //   ethers.constants.MaxUint256
  // );
  // await approveTx.wait();

  let transferTx = await assetTransfer.buildTransferTransaction(transfer, fee);
  const response = await wallet.sendTransaction(
    transferTx as providers.TransactionRequest
  );
  console.log("Sent transfer with hash: ", response.hash);

  let dataResponse: undefined | { status: string; explorerUrl: string };

  const id = setInterval(() => {
    getStatus(response.hash)
      .then((data) => {
        if (data) {
          dataResponse = data;
          console.log("Status of the transfer", data.status);
        }
      })
      .catch((e) => {
        console.log("error:", e);
        console.log("Transfer still not indexed, retrying...");
        res.status(500).send();
      });

    if (dataResponse && dataResponse.status === "executed") {
      console.log("Transfer executed successfully");
      clearInterval(id);
      res.status(200).send({
        status: dataResponse.status,
        explorerUrl: dataResponse.explorerUrl,
      });
    }
  }, 5000);
};
