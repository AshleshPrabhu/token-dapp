import { ethers } from "ethers";
import ABI from "./abi";

const tokenAddress = "0x31b2da62a1fccb0d99eeaf0940a3127045a86830";
export const provider = new ethers.JsonRpcProvider(
  "https://eth-sepolia.g.alchemy.com/v2/fQZ3GExRdziF2fHUbxX6Jwt9w18XWj37",
);
const tokenContract = new ethers.Contract(tokenAddress, ABI, provider);

export default tokenContract;
