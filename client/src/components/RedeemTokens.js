import React, { useState, useContext } from "react";
import { LoadingContext, ConnectedContext } from "./App";
import Spinner from "./Spinner";

const RedeemTokens = ({ redeem }) => {
  const [id, setId] = useState("");
  const [amount, setAmount] = useState(undefined);

  const loading = useContext(LoadingContext);
  const { isConnected, setIsConnected } = useContext(ConnectedContext);

  const updateId = (e) => {
    e.preventDefault();
    setId(e.target.value);
  };

  const updateAmount = (e) => {
    e.preventDefault();
    setAmount(e.target.value);
  };

  const submitValue = (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    const amount = e.target.elements[1].value;
    redeem(id, amount);
    setId("");
    setAmount("");
  };

  return (
    <div id="main">
      <i class="fas fa-arrow-down fa-2x"></i>
      <article id="intro">
        <section>
          <h3 class="major">Redeem Tokens</h3>
          <form onSubmit={submitValue}>
            <div class="fields">
              <div class="field half">
                <label for="demo-name">Customer ID</label>
                <input
                  type="text"
                  name="demo-name"
                  id="demo-name"
                  value={id}
                  placeholder="Enter Customer ID"
                  onChange={updateId}
                />
              </div>
              <div class="field half">
                <label for="demo-email">Amount Of Tokens To Redeem</label>
                <input
                  type="text"
                  name="demo-name"
                  id="demo-name"
                  value={amount}
                  placeholder="Enter Token To Redeem"
                  onChange={updateAmount}
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

export default RedeemTokens;
