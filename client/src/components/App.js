import React, { useEffect, useState } from "react"
import PayTrust from "../contracts/payTrust.json"
import getWeb3 from "../getWeb3"
import { BrowserRouter, Link, Route, Switch } from "react-router-dom"
import Container from "./Container"
import DepositFiat from "./DepositFiat"
import RedeemTokens from "./RedeemTokens"
import CheckBalance from "./CheckBalance"
import ContactPage from "./ContactPage"
import AboutPage from "./AboutPage"
import coingecko from "../apis/coingecko"
import Withdraw from "./Withdraw"
import USDC20 from "../contracts/ERC20.json"
import USDCAddress from "../contracts/USDCMock.json"

export const LoadingContext = React.createContext()
export const AccountsContext = React.createContext({ setAccounts: () => {} })
export const ConnectedContext = React.createContext({
  setIsConnected: () => {},
})

function App() {
  const [web3, setWeb3] = useState(undefined)
  const [accounts, setAccounts] = useState(undefined)
  const [contract, setContract] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [stableCoinPrice, setStableCoinPrice] = useState(undefined)
  const [isConnected, setIsConnected] = useState("")
  const [tokenBalance, setTokenBalance] = useState(undefined)
  const [stableCoinBalance, setStableCoinBalance] = useState(undefined)
  const [customerName, setCustomerName] = useState("")
  const [timeRemaining1, setTimeRemaining1] = useState([])
  const [timeRemaining2, setTimeRemaining2] = useState([])
  const [timeRemaining3, setTimeRemaining3] = useState([])
  const [timeRemaining4, setTimeRemaining4] = useState([])

  const [uContract, setUContract] = useState(undefined)

  const ethDecimals = 10 ** 18

  //set function not actually setting value so have to manually do it

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = PayTrust.networks[networkId]
      const contract = new web3.eth.Contract(
        PayTrust.abi,
        deployedNetwork && deployedNetwork.address
      )

      const USDCObject = USDCAddress.networks[networkId]
      const USDCContract = new web3.eth.Contract(
        USDC20.abi,
        USDCObject && USDCObject.address
      )

      setUContract(USDCContract)

      console.log(accounts)
      if (typeof accounts !== "undefined") {
        setIsConnected("connected")
      } else {
        setIsConnected("disconnected")
      }
      setAccounts(accounts)
      setWeb3(web3)
      setContract(contract)
    }
    init()
  }, [])

  useEffect(() => {
    const getStableCoinPrice = async () => {
      const response = await coingecko.get()
      console.log(response.data["usd-coin"].aud)
      // prettier-ignore
      setStableCoinPrice(response.data["usd-coin"].aud)
    }
    setInterval(getStableCoinPrice, 3000)
  }, [stableCoinPrice])

  const deposit = async (name, amount, stableCoinToSend) => {
    let amountString = amount.toString()
    amount = web3.utils.toWei(amountString, "ether").toString()

    let stableCoinAmountString = stableCoinToSend.toString()
    stableCoinToSend = web3.utils
      .toWei(stableCoinAmountString, "ether")
      .toString()

    const address = accounts[0]
    try {
      setLoading(true)
      await uContract.methods
        .approve(contract._address, stableCoinToSend)
        .send({ from: accounts[0] })

      const res = await uContract.methods
        .allowance(address, "0xe3Aab3F1795Bb5bf037ae04DBfBe4fa59b19FEc2")
        .call()
      console.log("allowed " + res)

      let log = await contract.methods
        .deposit(name, amount, stableCoinToSend, address)
        .send({ from: accounts[0] })
      setLoading(false)
      alert(
        `Deposit Successful for ID: ${log.events.DepositSuccessful.returnValues.nextCustomerId}`
      )
    } catch (err) {
      setLoading(false)
      alert("Deposit was not successful")
    }
  }

  const redeem = async (id, amount) => {
    let amountString = amount.toString()
    amount = web3.utils.toWei(amountString, "ether").toString()

    try {
      setLoading(true)
      let log = await contract.methods
        .redeem(id, amount)
        .send({ from: accounts[0] })
      setLoading(false)
      alert(
        `Redeemed: ${amount / ethDecimals} Flight Tokens for Customer: ${
          log.events.RedeemSuccessful.returnValues.id
        }`
      )
    } catch (err) {
      setLoading(false)
      alert("Redeem was not successful")
    }
  }

  const getTimeRemaining = async (customer) => {
    const now = new Date().getTime()
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }
    const redeemTimeEnd1 = new Date(
      parseInt(customer.redeemEndTime1) * 1000
    ).toLocaleDateString(undefined, options)
    const redeemTimeEnd2 = new Date(
      parseInt(customer.redeemEndTime2) * 1000
    ).toLocaleDateString(undefined, options)
    const redeemTimeEnd3 = new Date(
      parseInt(customer.redeemEndTime3) * 1000
    ).toLocaleDateString(undefined, options)
    const redeemTimeEnd4 = new Date(
      parseInt(customer.hardEndTime) * 1000
    ).toLocaleDateString(undefined, options)

    setTimeRemaining1([redeemTimeEnd1])
    setTimeRemaining2([redeemTimeEnd2])
    setTimeRemaining3([redeemTimeEnd3])
    setTimeRemaining4([redeemTimeEnd4])
  }

  const getTokenBalances = async (id) => {
    const customerObject = await contract.methods.customers(id).call()
    setTokenBalance(customerObject.customerBalanceTokens / ethDecimals)
    const stableCoinBalanceToRead =
      customerObject.customerBalanceStableCoin / ethDecimals
    let _stableCoinBalanceToRead = stableCoinBalanceToRead.toFixed(4)
    setStableCoinBalance(_stableCoinBalanceToRead)
    setCustomerName(customerObject.name)
    getTimeRemaining(customerObject)
  }

  const withdrawStableCoin = async (id) => {
    await contract.methods.withdrawStableCoin(id).send({ from: accounts[0] })
  }

  const withdrawAllStableCoin = async () => {
    await contract.methods
      .calculateAmoutOfAllStableCoinForWithdrawal()
      .send({ from: accounts[0] })
    await contract.methods.withdrawAllStableCoin().send({ from: accounts[0] })
  }

  return (
    <div>
      <BrowserRouter>
        <LoadingContext.Provider value={loading}>
          <ConnectedContext.Provider value={{ isConnected, setIsConnected }}>
            <AccountsContext.Provider value={{ accounts, setAccounts }}>
              <Container />
              <Switch>
                <Route path="/deposit-fiat">
                  <DepositFiat deposit={deposit} price={stableCoinPrice} />
                </Route>
                <Route path="/redeem-tokens">
                  <RedeemTokens redeem={redeem} />
                </Route>
                <Route path="/check-balance">
                  <CheckBalance
                    getTokenBalance={getTokenBalances}
                    tokenBalance={tokenBalance}
                    stableCoinBalance={stableCoinBalance}
                    customerName={customerName}
                    timeRemaining1={timeRemaining1}
                    timeRemaining2={timeRemaining2}
                    timeRemaining3={timeRemaining3}
                    timeRemaining4={timeRemaining4}
                  />
                </Route>
                <Route path="/about-page">
                  <AboutPage />
                </Route>
                <Route path="/contact-page">
                  <ContactPage />
                </Route>
                <Route path="/withdraw-page">
                  <Withdraw
                    withdrawStableCoin={withdrawStableCoin}
                    withdrawAllStableCoin={withdrawAllStableCoin}
                  />
                </Route>
              </Switch>
            </AccountsContext.Provider>
          </ConnectedContext.Provider>
        </LoadingContext.Provider>
      </BrowserRouter>
      <div id="bg"></div>
    </div>
  )
}

export default App
