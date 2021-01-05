const PayTrust = artifacts.require("./PayTrust.sol");
const FlightToken = artifacts.require("./FlightToken.sol");

module.exports = async function(deployer) {
  await deployer.deploy(FlightToken);
  const flightToken = await FlightToken.deployed()
  const flightTokenAddress = await flightToken.address;
 

  await deployer.deploy(PayTrust, flightTokenAddress);
  const payTrust = await PayTrust.deployed()
  const payTrustAddress = await payTrust.address;
  await flightToken.setCallers(payTrustAddress);

  //initilize redeem times
  //60,30,15 days prior to the end date of year (times are all in seconds)
  await payTrust.resetRedeemTime(26372952,28927206,30260952,31556952)

  //initilize refund amounts
  await payTrust.setRefundAmount(9,8,7)
};
