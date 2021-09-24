const Volcano = artifacts.require("VolcanoCoin");
//const VolcanoToken = artifacts.require("VolcanoToken");
const truffleAssert = require('truffle-assertions');
contract("Volcano", accounts => {
    it("should mint 10000 VolcanoCoin", async () => {
    const instance = await Volcano.deployed();
    //console.log(instance);
    const totalSupply = await instance.totalSupply.call();
    assert.equal(
        totalSupply.toNumber(),
       10000,
        "Minting Failed",
        );
    });

    it("0xcB7C09fEF1a308143D9bf328F2C33f33FaA46bC2 should have 0 balance", async () => {
    const instance = await Volcano.deployed();
    //console.log(instance);
    const add_balance = await instance.balanceOf.call("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
    assert.equal(
        add_balance.toNumber(),
       0,
        "Initialize with 0 balance failed",
        );
    });

    it("Owner should have 10000 tokens", async () => {
    const instance = await Volcano.deployed();
    //console.log(instance);
    const owner = await instance.owner.call();
    const balance = await instance.balanceOf.call(owner);
    assert.equal(
        balance.toNumber(),
       10000,
        "Initial minting to owner failed",
        );
    });
});

/*contract("VolcanoToken", accounts => {
    it("should start with no tokens", async () => {
    const instance = await VolcanoToken.deployed();
    //console.log(instance);
    const owner = await instance.owner.call();
    const ownerBal = await instance.balanceOf.call(owner);
    assert.equal(
        ownerBal.toNumber(),
       0,
        "Initialization Failed",
        );
    });

    it("minting should give 1 token", async () => {
    const instance = await VolcanoToken.deployed();
    //console.log(instance);
    const owner = await instance.owner.call();
    await instance.mint({from: owner});
    const ownerBal = await instance.balanceOf.call(owner);
    assert.equal(
        ownerBal.toNumber(),
       1,
        "Minting Failed",
        );
    });

    it("addresses should initialize with 0 balance", async () => {
      const instance = await VolcanoToken.deployed();
      const recipient = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
      const recipBal = await instance.balanceOf.call(recipient);
      assert.equal(
          recipBal.toNumber(),
         0,
          "Initialize with 0 balance failed",
        );
    });

    it("tokens can be transferred by owner", async () => {
    const instance = await VolcanoToken.deployed();
    const owner = await instance.owner.call();
    const recipient = (await web3.eth.getAccounts())[1];
    //await instance.mint({from: owner});
    await instance.safeTransferFrom(owner, recipient, 0);
    const ownerBal = await instance.balanceOf.call(owner);
    const recipBal = await instance.balanceOf.call(recipient);
    assert.equal(
        ownerBal.toNumber(),
       0,
        "Transfer Failed: Owner still has token",
        );

    assert.equal(
        recipBal.toNumber(),
       1,
        "Transfer Failed: Recipient did not recieve token",
        );

    });

    it("non-owner cannot burn tokens", async () => {
    const instance = await VolcanoToken.deployed();
    const hacker = "0xAE0F0e3bc47Aa699De97373822D825E4A3665698";

    await truffleAssert.fails(
      instance.burn(0, {from: hacker}),
      "You do not have permission to burn this token"
    );

  });

    it("burn removes token from balance", async () => {
    const instance = await VolcanoToken.deployed();
    const tokenOwner = await instance.ownerOf(0);
    await instance.burn(0, {from: tokenOwner});
    const recipBal = await instance.balanceOf.call(tokenOwner);

    assert.equal(
        recipBal.toNumber(),
       0,
        "Balance did not decrease",
        );

    });

    it("burnt tokens cannot be spent", async () => {
    const instance = await VolcanoToken.deployed();
    const prevOwner = (await web3.eth.getAccounts())[1];
    const recipient = (await web3.eth.getAccounts())[2];

    await truffleAssert.fails(
      instance.safeTransferFrom(prevOwner, recipient, 0),
      " VM Exception while processing transaction: revert ERC721: operator query for nonexistent token -- Reason given: ERC721: operator query for nonexistent token."
      );
    });
});
*/
