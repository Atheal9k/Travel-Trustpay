pragma solidity 0.7.5;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FlightToken is ERC20, Ownable {
    address public payTrust;
    
    constructor()ERC20 ("Flight Token", "FTT") public {
        
    }
    
    function mint(address to, uint amount) external onlyPayTrust(){
       
        _mint(to, amount);
    }
    
    function burn(address customerAccount, uint amount) external onlyPayTrust() {
        
        _burn(customerAccount, amount);
    }
    
    function setCallers(address _payTrust) external onlyOwner() {
        payTrust = _payTrust;
    }
    
    modifier onlyPayTrust {
        require(msg.sender == payTrust);
        _;
    }
    
}