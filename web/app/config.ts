import { http, createConfig } from "wagmi";
import { sepolia, mainnet } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [injected(), metaMask()],
  transports: {
    [sepolia.id]: http(
      "https://eth-sepolia.g.alchemy.com/v2/fQZ3GExRdziF2fHUbxX6Jwt9w18XWj37",
    ),
    [mainnet.id]: http(
      "https://eth-mainnet.g.alchemy.com/v2/fQZ3GExRdziF2fHUbxX6Jwt9w18XWj37",
    ),
  },
});
