let MyContract = artifacts.require("./MyContract.sol");
let ReuniaoContract = artifacts.require("./ReuniaoContract.sol");

module.exports = function(deployer) {
  deployer.deploy(MyContract);
  deployer.deploy(ReuniaoContract);
};
