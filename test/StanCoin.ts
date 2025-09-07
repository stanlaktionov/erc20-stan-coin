import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("StanCoin", function () {
  it("Should work", async function () {
    const coin = await ethers.deployContract("StanCoin");
    expect(await coin.totalSupply()).to.equal(1000000000000000000000000n);
  });
});
