import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("StanCoinModule", (m) => {
  const coin = m.contract("StanCoin");
  return { coin };
});
