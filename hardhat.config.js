require("@nomiclabs/hardhat-waffle");

module.exports = {
	solidity: "0.8.17",
	paths: {
		sources: "./contracts",
		tests: "./test",
		cache: "./cache",
		artifacts: "./artifacts",
	},
};
