// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Verifier.sol";

contract Voting {
    Verifier public verifier;
    mapping(address => bool) public hasVoted;
    mapping(uint => uint) public votes; // candidate ID => vote count

    event VoteCast(address voter, uint candidate);

    constructor(address _verifier) {
        verifier = Verifier(_verifier);
    }

    /**
     * @notice Cast a vote for a candidate with a valid zk-SNARK proof.
     * @param candidate The candidate identifier.
     * @param a Proof parameter a.
     * @param b Proof parameter b.
     * @param c Proof parameter c.
     * @param input Public inputs of the proof. For demonstration, input[0] must equal candidate.
     */
    function vote(
        uint candidate,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[] memory input
    ) public {
        require(!hasVoted[msg.sender], "Voting: Already voted");
        require(input.length > 0, "Voting: Invalid proof input");
        require(input[0] == candidate, "Voting: Candidate mismatch in proof");

        bool valid = verifier.verifyProof(a, b, c, input);
        require(valid, "Voting: Invalid proof");

        votes[candidate] += 1;
        hasVoted[msg.sender] = true;
        emit VoteCast(msg.sender, candidate);
    }
}
