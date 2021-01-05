import React, { useState, useContext } from "react";
import { LoadingContext, ConnectedContext, AccountsContext } from "./App";
import Spinner from "./Spinner";

const DepositFiat = ({ deposit, price }) => {
  const [names, setNames] = useState("");
  const [amount, setAmount] = useState(undefined);
  const [amountEth, setAmountEth] = useState(undefined);

  const loading = useContext(LoadingContext);
  const { isConnected, setIsConnected } = useContext(ConnectedContext);

  const updateNames = (e) => {
    e.preventDefault();
    setNames(e.target.value);
  };

  const updateAmount = (e) => {
    e.preventDefault();
    setAmount(e.target.value);
    setAmountEth(e.target.value / price);
  };

  // const updateAmountEth = (e) => {
  //     e.preventDefault();
  //     setAmountEth(e.target.value);
  // }

  const submitValue = (e) => {
    e.preventDefault();
    const name = e.target.elements[0].value;
    const amount = e.target.elements[1].value;
    const ethToSend = e.target.elements[2].value;
    //const ethToSend = 100.5
    deposit(name, amount, ethToSend);
    setNames("");
    setAmount("");
    setAmountEth("");
  };

  return (
    <div id="main">
      <i class="fas fa-arrow-down fa-2x"></i>
      <article id="intro">
        <section>
          <h3 class="major">Deposit</h3>
          <form onSubmit={submitValue}>
            <div class="fields">
              <div class="field half">
                <label for="demo-name">Name</label>
                <input
                  type="text"
                  name="demo-name"
                  id="demo-name"
                  value={names}
                  placeholder="Enter Customer Name"
                  onChange={updateNames}
                />
              </div>
              <div class="field half">
                <label for="demo-email">Amount Of Tokens To Mint</label>
                <input
                  type="text"
                  name="demo-name"
                  id="demo-name"
                  value={amount}
                  placeholder="Enter Token To Mint"
                  onChange={updateAmount}
                />
              </div>

              <div class="field half">
                <label for="demo-email">Amount Of ETH To Send</label>
                <input
                  type="text"
                  name="demo-name"
                  id="demo-name-eth"
                  value={amountEth}
                  placeholder="Amout Of ETH To Send"
                  disabled
                />
              </div>

              <div className="depositPageButton">
                {isConnected === "connected" ? (
                  loading ? (
                    <Spinner />
                  ) : (
                    <button id="depositButton">Submit To Blockchain</button>
                  )
                ) : (
                  <button disabled>Please Connect Your Wallet</button>
                )}
              </div>
            </div>
          </form>
        </section>
      </article>
    </div>
  );
};

export default DepositFiat;
