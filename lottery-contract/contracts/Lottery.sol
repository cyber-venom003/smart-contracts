// SPDX-License-Identifier: ISC

pragma solidity ^0.8.3;

contract Lottery {
    address public manager;
    
    address payable[] public players;
    
    constructor() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether);
        
        players.push(payable(msg.sender));
    }
    
    function generateRandom() private view returns(uint) {
        return uint(keccak256(abi.encode(block.difficulty, block.timestamp, players)));
    }
    
    function pickWinner() public restricted {
        uint randomIndex = generateRandom() % players.length;
        players[randomIndex].transfer(address(this).balance);
        players = new address payable[](0);
    }
    
    modifier restricted() {
        require(manager == msg.sender);
        _;
    }
    
    function getPlayers() public view returns(address payable[] memory){
        return players;
    }
}