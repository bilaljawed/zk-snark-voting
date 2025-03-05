async function main() {
	const [deployer] = await ethers.getSigners();
	console.log("Deploying contracts with account:", deployer.address);

	// Deploy the Verifier contract
	const Verifier = await ethers.getContractFactory("Verifier");
	const verifier = await Verifier.deploy();
	await verifier.deployed();
	console.log("Verifier deployed to:", verifier.address);

	// Deploy the Voting contract with the Verifier's address
	const Voting = await ethers.getContractFactory("Voting");
	const voting = await Voting.deploy(verifier.address);
	await voting.deployed();
	console.log("Voting deployed to:", voting.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
