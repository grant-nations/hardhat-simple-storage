const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage", () => {
  let simpleStorageFactory, simpleStorage;
  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  });

  it("Should start with a favorite number of 0", async () => {
    const currentValue = await simpleStorage.retrieve();
    assert.equal(currentValue.toString(), "0");
  });

  it("Should update when store is called", async () => {
    expectedVal = "9";
    const transactionResponse = await simpleStorage.store(expectedVal);
    await transactionResponse.wait(1);

    const currentValue = await simpleStorage.retrieve();
    assert.equal(currentValue.toString(), expectedVal);
  });
});
