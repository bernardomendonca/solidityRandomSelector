pragma solidity ^0.4.17;
// ^ OK to ignore the red underline.

// This contract allows a "manager" to start a contract to randomly select a person from a poll
// The "manager" is whoemver deployed the contract

contract randomSelector {
    //
    address public manager;
    //initialising dynamic array with addresses:
    address[] public players;

    function randomSelector() public {
        manager = msg.sender;
    }

    // enter function -> When someone enters the draw, we add their address to the array
    // since the player has to pay to some ETH to enter the dray, it's a payable function:
    function enter() payable {
        //make sure minimum amount of ether is sent
        //remember -> msg.value is a global property that gives back the amount of ETH in WEI!
        //0.01 ETH = 10000000000000000 WEI
        // using ether after the value, converter it to ether
        require(msg.value > 0.01 ether);

        players.push(msg.sender);

    }

    //This is a pseudo-random number generator that takes the following attributes and pass tehm through the SHA3 algorithm (keccack256)
    //current block difficulty + current time + addressess of players
    function random() private view returns (uint) {
        return uint(sha3(block.difficulty, now, players));
    }

    function pickWinner() public restricted() {
        // only the "manager" should be able to call this function

        uint index = random() % players.length;
        //this.balance refers to the amount of contract in this contract
        players[index].transfer(this.balance);
        //reset contract state
        players = new address[](0);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address[]){
        return players;
    }
}