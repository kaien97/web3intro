const VolcanoCoin = artifacts.require("VolcanoCoin");

module.exports = function(deployer) {
  deployer.deploy(VolcanoCoin);
};
