const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting", function () {
	let verifier, voting, owner, addr1;

	beforeEach(async function () {
		[owner, addr1] = await ethers.getSigners();

		const Verifier = await ethers.getContractFactory("Verifier");
		verifier = await Verifier.deploy();
		await verifier.deployed();

		const Voting = await ethers.getContractFactory("Voting");
		voting = await Voting.deploy(verifier.address);
		await voting.deployed();
	});

	it("Should allow voting with a valid proof", async function () {
		const candidate = 1;
		// Dummy proof values (these should come from snarkjs in a real scenario)
		const a = [1, 2];
		const b = [
			[3, 4],
			[5, 6],
		];
		const c = [7, 8];
		const input = [candidate]; // input[0] must equal candidate

		await expect(voting.connect(addr1).vote(candidate, a, b, c, input)).to.emit(voting, "VoteCast").withArgs(addr1.address, candidate);

		expect(await voting.votes(candidate)).to.equal(1);
		expect(await voting.hasVoted(addr1.address)).to.be.true;
	});

	it("Should not allow double voting", async function () {
		const candidate = 1;
		const a = [1, 2];
		const b = [
			[3, 4],
			[5, 6],
		];
		const c = [7, 8];
		const input = [candidate];

		await voting.connect(addr1).vote(candidate, a, b, c, input);
		await expect(voting.connect(addr1).vote(candidate, a, b, c, input)).to.be.revertedWith("Voting: Already voted");
	});

	it("Should reject vote if proof input does not match candidate", async function () {
		const candidate = 1;
		const wrongCandidate = 0;
		const a = [1, 2];
		const b = [
			[3, 4],
			[5, 6],
		];
		const c = [7, 8];
		const input = [wrongCandidate];

		await expect(voting.connect(addr1).vote(candidate, a, b, c, input)).to.be.revertedWith("Voting: Candidate mismatch in proof");
	});
});
