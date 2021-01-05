import React, { useEffect, useState } from "react";
import PayTrust from "../contracts/payTrust.json";
import getWeb3 from "../getWeb3";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import Container from "./Container";
import DepositFiat from "./DepositFiat";
import RedeemTokens from "./RedeemTokens";
import CheckBalance from "./CheckBalance";
import ContactPage from "./ContactPage";
import coingecko from "../apis/coingecko";

export const LoadingContext = React.createContext();
export const AccountsContext = React.createContext({ setAccounts: () => {} });
export const ConnectedContext = React.createContext({
  setIsConnected: () => {},
});

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [ethPrice, setEthPrice] = useState(undefined);
  const [isConnected, setIsConnected] = useState("");
  const [tokenBalance, setTokenBalance] = useState(undefined);
  const [ethBalance, setEthBalance] = useState(undefined);
  const [customerName, setCustomerName] = useState("");
  const [timeRemaining1, setTimeRemaining1] = useState([]);
  const [timeRemaining2, setTimeRemaining2] = useState([]);
  const [timeRemaining3, setTimeRemaining3] = useState([]);
  const [timeRemaining4, setTimeRemaining4] = useState([]);

  const ethDecimals = 10 ** 18;

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PayTrust.networks[networkId];
      const contract = new web3.eth.Contract(
        PayTrust.abi,
        deployedNetwork && deployedNetwork.address
      );

      console.log(accounts);
      if (typeof accounts !== "undefined") {
        setIsConnected("connected");
      } else {
        setIsConnected("disconnected");
      }
      setAccounts(accounts);
      setWeb3(web3);
      setContract(contract);
    };
    init();
  }, []);

  useEffect(() => {
    const getEthPrice = async () => {
      const response = await coingecko.get();
      setEthPrice(response.data.ethereum.aud);
    };
    setInterval(getEthPrice, 3000);
  }, [ethPrice]);

  const deposit = async (name, amount, ethToSend) => {
    let amountString = amount.toString();
    amount = web3.utils.toWei(amountString, "ether").toString();

    let ethAmountString = ethToSend.toString();
    ethToSend = web3.utils.toWei(ethAmountString, "ether").toString();

    const address = accounts[0];
    try {
      setLoading(true);
      let log = await contract.methods
        .deposit(name, amount, address)
        .send({ from: accounts[0], value: ethToSend });
      setLoading(false);
      alert(
        `Deposit Successful for ID: ${log.events.DepositSuccessful.returnValues.nextCustomerId}`
      );
    } catch (err) {
      setLoading(false);
      alert("Deposit was not successful");
    }
  };

  const redeem = async (id, amount) => {
    let amountString = amount.toString();
    amount = web3.utils.toWei(amountString, "ether").toString();

    try {
      setLoading(true);
      let log = await contract.methods
        .redeem(id, amount)
        .send({ from: accounts[0] });
      setLoading(false);
      alert(
        `Redeemed: ${amount / ethDecimals} Flight Tokens for Customer: ${
          log.events.RedeemSuccessful.returnValues.id
        }`
      );
    } catch (err) {
      setLoading(false);
      alert("Redeem was not successful");
    }
  };

  const getTimeRemaining = async (customer) => {
    const now = new Date().getTime();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const redeemTimeEnd1 = new Date(
      parseInt(customer.redeemEndTime1) * 1000
    ).toLocaleDateString(undefined, options);
    const redeemTimeEnd2 = new Date(
      parseInt(customer.redeemEndTime2) * 1000
    ).toLocaleDateString(undefined, options);
    const redeemTimeEnd3 = new Date(
      parseInt(customer.redeemEndTime3) * 1000
    ).toLocaleDateString(undefined, options);
    const redeemTimeEnd4 = new Date(
      parseInt(customer.hardEndTime) * 1000
    ).toLocaleDateString(undefined, options);

    setTimeRemaining1([redeemTimeEnd1]);
    setTimeRemaining2([redeemTimeEnd2]);
    setTimeRemaining3([redeemTimeEnd3]);
    setTimeRemaining4([redeemTimeEnd4]);
  };

  const getTokenBalances = async (id) => {
    const customerObject = await contract.methods.customers(id).call();
    setTokenBalance(customerObject.customerBalanceTokens / ethDecimals);
    const ethBalanceToRead = customerObject.customerBalanceETH / ethDecimals;
    let _ethBalanceToRead = ethBalanceToRead.toFixed(4);
    setEthBalance(_ethBalanceToRead);
    setCustomerName(customerObject.name);
    getTimeRemaining(customerObject);
  };

  return (
    <div>
      <BrowserRouter>
        <LoadingContext.Provider value={loading}>
          <ConnectedContext.Provider value={{ isConnected, setIsConnected }}>
            <AccountsContext.Provider value={{ accounts, setAccounts }}>
              <Container />
              <Switch>
                <Route path="/deposit-fiat">
                  <DepositFiat deposit={deposit} price={ethPrice} />
                </Route>
                <Route path="/redeem-tokens">
                  <RedeemTokens redeem={redeem} />
                </Route>
                <Route path="/check-balance">
                  <CheckBalance
                    getTokenBalance={getTokenBalances}
                    tokenBalance={tokenBalance}
                    ethBalance={ethBalance}
                    customerName={customerName}
                    timeRemaining1={timeRemaining1}
                    timeRemaining2={timeRemaining2}
                    timeRemaining3={timeRemaining3}
                    timeRemaining4={timeRemaining4}
                  />
                </Route>
                <Route path="/contact-page">
                  <ContactPage />
                </Route>
              </Switch>
            </AccountsContext.Provider>
          </ConnectedContext.Provider>
        </LoadingContext.Provider>
      </BrowserRouter>
      <div id="bg"></div>
    </div>
  );
}

export default App;
