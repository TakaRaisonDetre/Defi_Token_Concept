pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {

string public name ="SCV Token Bank";
DappToken public dappToken;
DaiToken public daiToken;
address public owner;


address[] public stakers;
mapping(address => uint) public stakingBalance; 
mapping(address => bool) public hasStaked;
mapping(address=> bool)  public isStaking;

constructor(DappToken _dappToken, DaiToken _daiToken) public{
   dappToken = _dappToken;
   daiToken = _daiToken;
   owner = msg.sender;
}

// 1 stake tokens  (deposite)

function stakeTokens(uint _amount) public {
    // Require amount greater than 0
    require(_amount > 0, "amount cannot be 0");

    // transfer Dai to this contract for staking
    daiToken.transferFrom(msg.sender, address(this), _amount);
    // Update staking balance
    stakingBalance[msg.sender]=stakingBalance[msg.sender] + _amount;
    // add user to stakers array "only if they have not staked already
    if(!hasStaked[msg.sender]){
        stakers.push(msg.sender);
    }
   // update staking status
    isStaking[msg.sender] = true;
    hasStaked[msg.sender] = true;
}

// 2 unstaking token (withdraw)
function unstakeTokens() public {
    // Fetch staking balance
    uint balance = stakingBalance[msg.sender];
    // require amount greater than 0
    require(balance > 0, "staking balance cannot be 0");
    // transfer Mock Dai token to this contract for staking
    daiToken.transfer(msg.sender, balance);
    // Reset staking balance 
    stakingBalance[msg.sender] = 0;
    // Update staking status
    isStaking[msg.sender] = false;
}




// 3 issuing token  
function issueTokens() public {
    // only onwer can call this function 
    require(msg.sender==owner, "caller must be the owner");

    // issue tokens to all stakers
    for(uint i=0; i<stakers.length; i++){
        address recipient=stakers[i];
        uint balance = stakingBalance[recipient];
        if(balance>0){
         dappToken.transfer(recipient, balance);
        }
       
    }
}


}