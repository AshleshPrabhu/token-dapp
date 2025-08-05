import { http, createConfig } from "wagmi";
import { sepolia, mainnet } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [injected(), metaMask()],
  transports: {
    [sepolia.id]: http(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    ),
    [mainnet.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    ),
  },
});
