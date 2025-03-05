pragma circom 2.0.0;

template Vote() {
    // Private input: the vote (should be 0 or 1)
    signal input vote;
    // Public output: the candidate (for simplicity, we output the vote itself)
    signal output candidate;

    // Enforce candidate equals vote.
    candidate <== vote;
    
    // Ensure vote is either 0 or 1: vote*(vote-1) must equal 0.
    signal check;
    check <== vote * (vote - 1);
    check === 0;
}

component main = Vote();
