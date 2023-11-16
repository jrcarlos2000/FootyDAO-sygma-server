import dotenv from "dotenv";
import { ethers } from "ethers";
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
