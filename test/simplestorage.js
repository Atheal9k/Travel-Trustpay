const PayTrust = artifacts.require("./PayTrust.sol");
const FlightToken = artifacts.require("./FlightToken.sol");

contract("PayTrust", async(accounts) => {

  before(async () => {
    flightToken = await FlightToken.deployed()
    
    payTrust = await PayTrust.deployed()
  
  
  })

  it("should deposit", async () => {
    
    await flightToken.setCallers(payTrust.address);
    await payTrust.deposit("jkfes", 100, 1000, payTrust.address);

  })
});
