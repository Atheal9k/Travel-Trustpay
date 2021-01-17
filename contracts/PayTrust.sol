pragma solidity 0.7.5;

import "./FlightToken.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract payTrust is Ownable {
    using SafeMath for uint256;

    struct Customer {
        uint256 id;
        string name;
        address payable customerAddress;
        uint256 redeemEndTime1;
        uint256 redeemEndTime2;
        uint256 redeemEndTime3;
        uint256 hardEndTime;
        uint256 customerBalanceStableCoin;
        uint256 customerBalanceTokens;
    }

    IERC20 public USDC;
    FlightToken public flightToken;

    mapping(uint256 => Customer) public customers;

    uint256 public nextCustomerId;
    uint256 public redeemTime1;
    uint256 public redeemTime2;
    uint256 public redeemTime3;
    uint256 public deadlineToRedeem;
    uint256 public refundAmount2;
    uint256 public refundAmount3;
    uint256 public refundAmount4;
    uint256 public totalAmountEthForWithdrawal;

    event DepositSuccessful(
        string indexed name,
        uint256 indexed nextCustomerId
    );
    event RedeemSuccessful(uint256 indexed id, uint256 amount);

    constructor(address _flightToken, address _usdc) public {
        //initializes the token address
        flightToken = FlightToken(_flightToken);
        USDC = IERC20(_usdc);
    }

    function resetRedeemTime(
        uint256 time1,
        uint256 time2,
        uint256 time3,
        uint256 _deadlineToRedeem
    ) external onlyOwner() {
        //change redeemTime base
        redeemTime1 = time1;
        redeemTime2 = time2;
        redeemTime3 = time3;
        deadlineToRedeem = _deadlineToRedeem;
    }

    function setRefundAmount(
        uint256 refund2,
        uint256 refund3,
        uint256 refund4
    ) external onlyOwner() {
        //set how much customer gets back after time limits. "7" means customer gets back 70% of initial. "5" means 50%
        refundAmount2 = refund2;
        refundAmount3 = refund3;
        refundAmount4 = refund4;
    }

    function deposit(
        string memory name,
        uint256 tokensToMint,
        uint256 stablecoinAmount,
        address payable customerAddress
    ) external payable {
        //When the customers calls this, the unique properties of their redeem times are updated to tied to them.
        require(stablecoinAmount > 0, "must deposit more than 0 stable coin");

        uint256 _redeemTime1 = redeemTime1;
        uint256 _redeemTime2 = redeemTime2;
        uint256 _redeemTime3 = redeemTime3;
        uint256 _deadlineToRedeem = deadlineToRedeem;

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
            stablecoinAmount,
            tokensToMint
        );
        USDC.transferFrom(msg.sender, address(this), stablecoinAmount);
        flightToken.mint(address(this), tokensToMint);
        emit DepositSuccessful(name, nextCustomerId);
        nextCustomerId = nextCustomerId.add(1);
    }

    function redeem(uint256 id, uint256 amount) external {
        //customers calls this if they want their deposits back. The function will calculate how much they are allowed of their initial deposit...
        //customers get back. Then the function will burn the tokens.
        require(
            customers[id].customerBalanceTokens >= amount,
            "must have more than 0 or have sufficient amount of flight tokens"
        );
        require(
            block.timestamp < customers[id].hardEndTime,
            "Your redeem time is over"
        );
        require(amount >= 1000, "must redeem 1000 or more flight tokens");

        if (block.timestamp < customers[id].redeemEndTime1) {
            calculateRedeemAmounts(id, 10);
        } else if (block.timestamp < customers[id].redeemEndTime2) {
            calculateRedeemAmounts(id, refundAmount2);
        } else if (block.timestamp < customers[id].redeemEndTime3) {
            calculateRedeemAmounts(id, refundAmount3);
        } else if (block.timestamp < customers[id].hardEndTime) {
            calculateRedeemAmounts(id, refundAmount4);
        }

        flightToken.burn(address(this), amount);
        emit RedeemSuccessful(id, amount);
    }

    function withdrawStableCoin(uint256 id) external onlyOwner() {
        require(customers[id].customerBalanceStableCoin > 0);
        require(block.timestamp > customers[id].hardEndTime);
        uint256 toTransfer = customers[id].customerBalanceStableCoin;
        USDC.approve(address(this), toTransfer);
        USDC.transfer(customers[id].customerAddress, toTransfer);
        toTransfer = 0;
    }

    function calculateAmoutOfAllStableCoinForWithdrawal() external onlyOwner() {
        for (uint256 i = 0; i < nextCustomerId; i++) {
            if (block.timestamp > customers[i].hardEndTime) {
                totalAmountEthForWithdrawal += customers[i]
                    .customerBalanceStableCoin;
                customers[i].customerBalanceStableCoin = 0;
            }
        }
    }

    function withdrawAllStableCoin() external onlyOwner() {
        uint256 toTransfer = totalAmountEthForWithdrawal;
        USDC.approve(address(this), toTransfer);
        totalAmountEthForWithdrawal = 0;
        USDC.transfer(msg.sender, toTransfer);
    }

    function calculateRedeemAmounts(uint256 id, uint256 _amount) internal {
        //calculates the amount customers get back when they redeem
        //after every redeemTime period, customers get less and less of their initial deposits

        // uint toTransfer = (customers[id].customerBalanceETH.mul(_amount)).div(10);
        // customers[id].customerBalanceETH = customers[id].customerBalanceETH.sub(customers[id].customerBalanceETH);
        // customers[id].customerBalanceTokens = customers[id].customerBalanceTokens.sub(customers[id].customerBalanceTokens);
        // customers[id].customerAddress.transfer(toTransfer);
        // toTransfer = 0;

        uint256 toTransfer =
            (customers[id].customerBalanceStableCoin.mul(_amount)).div(10);
        customers[id].customerBalanceStableCoin = customers[id]
            .customerBalanceStableCoin
            .sub(customers[id].customerBalanceStableCoin);
        customers[id].customerBalanceTokens = customers[id]
            .customerBalanceTokens
            .sub(customers[id].customerBalanceTokens);
        USDC.approve(address(this), toTransfer);
        USDC.transfer(customers[id].customerAddress, toTransfer);
        toTransfer = 0;
    }
}
