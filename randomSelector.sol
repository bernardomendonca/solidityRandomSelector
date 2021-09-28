pragma solidity ^0.4.17;
// ^ OK to ignore the red underline.

// This contract allows a "manager" to start a contract to randomly select a person from a poll
// The "manager" is whoemver deployed the contract

contract Lottery {
    //
    address public manager;
    //initialising dynamic array with addresses:
    address[] public players;

    function Lottery() public {
        manager = msg.sender;
    }

    // enter function -> When someone enters the draw, we add their address to the array
    // since the player has to pay to some ETH to enter the dray, it's a payable function:
    function enter() payable {
        players.push(msg.sender);
    }
}