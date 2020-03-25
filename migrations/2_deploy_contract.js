const SneakerFactory = artifacts.require("SneakerFactory");
const SellSneaker = artifacts.require("SellSneaker");

module.exports = function(deployer) {
  deployer.deploy(SneakerFactory).then((x)=> {
    return deployer.deploy(SellSneaker,"0xb52ed94e7244d6F30D73255b8d4D0A366D22c790",SneakerFactory.address);
  })
};

