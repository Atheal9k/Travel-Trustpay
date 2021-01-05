pragma solidity 0.7.5;

import "./FlightToken.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract payTrust is Ownable{
    
    using SafeMath for uint;
    
   
    struct Customer {
        uint id;
        string name;
        address payable customerAddress;
        uint redeemEndTime1;
        uint redeemEndTime2;
        uint redeemEndTime3;
        uint hardEndTime;
        uint customerBalanceETH;
        uint customerBalanceTokens;
    }
    
    FlightToken public flightToken;
    
    mapping(uint => Customer) public customers;
    
    uint public nextCustomerId;
    uint public redeemTime1;
    uint public redeemTime2;
    uint public redeemTime3;
    uint public deadlineToRedeem;
    uint public refundAmount2;
    uint public refundAmount3;
    uint public refundAmount4;
    uint public totalAmountEthForWithdrawal;

    event DepositSuccessful(string indexed name, uint indexed nextCustomerId);
    event RedeemSuccessful(uint indexed id, uint amount);
    
    constructor(address _flightToken) public {
        //initializes the token address
        flightToken = FlightToken(_flightToken);
    }
    
    function resetRedeemTime(uint time1, uint time2, uint time3, uint _deadlineToRedeem) external onlyOwner(){
        //change redeemTime base
        redeemTime1 = time1;
        redeemTime2 = time2;
        redeemTime3 = time3;
        deadlineToRedeem = _deadlineToRedeem;
    }

    function setRefundAmount(uint refund2, uint refund3, uint refund4) external onlyOwner(){
        //set how much customer gets back after time limits. "7" means customer gets back 70% of initial. "5" means 50%
        refundAmount2 = refund2;
        refundAmount3 = refund3;
        refundAmount4 = refund4;
    }
    
    
    function deposit(string memory name, uint tokensToMint, address payable customerAddress) external payable{
        //When the customers calls this, the unique properties of their redeem times are updated to tied to them.
        require(msg.value > 0);
        
        uint _redeemTime1 = redeemTime1;
        uint _redeemTime2 = redeemTime2;
        uint _redeemTime3 = redeemTime3;
        uint _deadlineToRedeem = deadlineToRedeem;

        _redeemTime1 = _redeemTime1.add(block.timestamp);
        _redeemTime2 = _redeemTime2.add(block.timestamp);
        _redeemTime3 = _redeemTime3.add(block.timestamp);
        _deadlineToRedeem = _deadlineToRedeem.add(block.timestamp);


        customers[nextCustomerId] = Customer(
            nextCustomerId, 
            name, 
            customerAddress, 
            _redeemTime1, 
            _redeemTime2, 
            _redeemTime3, 
            _deadlineToRedeem, 
            msg.value, 
            tokensToMint
            );
        flightToken.mint(msg.sender, tokensToMint);
        emit DepositSuccessful(name, nextCustomerId);
        nextCustomerId = nextCustomerId.add(1);
    }

    function redeem(uint id, uint amount) external {
        //customers calls this if they want their deposits back. The function will calculate how much they are allowed of their initial deposit...
        //customers get back. Then the function will burn the tokens.
        require(customers[id].customerBalanceTokens >= amount, "must have more than 0 or have sufficient amount of flight tokens");
        require(block.timestamp < customers[id].hardEndTime, "Your redeem time is over");
        require(amount >= 1000, "must redeem 1000 or more flight tokens");
        
        if(block.timestamp < customers[id].redeemEndTime1) {
        calculateRedeemAmounts(id, 10);
        }
        else if(block.timestamp < customers[id].redeemEndTime2) {
        calculateRedeemAmounts(id, refundAmount2);
        }
        else if(block.timestamp < customers[id].redeemEndTime3) {
        calculateRedeemAmounts(id, refundAmount3);
        }
        else if(block.timestamp < customers[id].hardEndTime) {
        calculateRedeemAmounts(id, refundAmount4);
        }
        
        flightToken.burn(msg.sender, amount);
        emit RedeemSuccessful(id, amount);
    }
    
    function withdrawETH(uint id) external onlyOwner(){
        require(customers[id].customerBalanceETH > 0);
        require(block.timestamp > customers[id].hardEndTime);
        uint toTransfer = customers[id].customerBalanceETH;
        customers[id].customerAddress.transfer(toTransfer);
        toTransfer = 0;
    }
    
    function calculateAmoutOfAllETHForWithdrawal() external onlyOwner(){
        for (uint i=0;i < nextCustomerId; i++) {
            if (block.timestamp > customers[i].hardEndTime) {
                 totalAmountEthForWithdrawal += customers[i].customerBalanceETH;
                 customers[i].customerBalanceETH = 0;
            }
        }
    }
    
    function withdrawAllEth() external onlyOwner() {
        uint toTransfer = totalAmountEthForWithdrawal;
        totalAmountEthForWithdrawal = 0;
        msg.sender.transfer(toTransfer);
    }
    
    function calculateRedeemAmounts(uint id, uint _amount) internal {
        //calculates the amount customers get back when they redeem
        //after every redeemTime period, customers get less and less of their initial deposits
        uint toTransfer = (customers[id].customerBalanceETH.mul(_amount)).div(10);
        customers[id].customerBalanceETH = customers[id].customerBalanceETH.sub(customers[id].customerBalanceETH);
        customers[id].customerBalanceTokens = customers[id].customerBalanceTokens.sub(customers[id].customerBalanceTokens);
        customers[id].customerAddress.transfer(toTransfer);
        toTransfer = 0;
    }
}








