import React, { useState } from "react";
import ConnectWallet from "./ConnectWallet";

const CheckBalance = ({
  getTokenBalance,
  tokenBalance,
  ethBalance,
  customerName,
  timeRemaining1,
  timeRemaining2,
  timeRemaining3,
  timeRemaining4,
}) => {
  const [balances, setBalances] = useState(undefined);

  const updateBalances = (e) => {
    e.preventDefault();
    setBalances(e.target.value);
  };

  const submitValue = (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;

    getTokenBalance(id)
      .then((result) => {
        console.log("success");
      })
      .catch((err) => {
        console.log("failed");
      });
  };

  return (
    <div id="main">
      <i class="fas fa-arrow-down fa-2x"></i>
      <article id="intro">
        <h2 class="major">Balance</h2>
        <p>
          If you wish to cancel your booking, you may do so. Here are your
          deadlines to cancel. Cancelling will incur 1% to 4% charge depending
          which deadline you cancel on.
        </p>
        <form onSubmit={submitValue}>
          <div class="fields">
            <div class="field half">
              <label for="demo-name">Check Balances</label>
              <input
                type="text"
                name="demo-name"
                id="demo-name"
                value={balances}
                placeholder="Enter Customer ID"
                onChange={updateBalances}
              />
            </div>
          </div>
          <button>Update Balance</button>
        </form>

        <label className="balance-information">Customer Name:</label>
        <div>
          <h3 className="balance-information">{customerName}</h3>
        </div>
        <label className="balance-information">Flight Token Balance:</label>
        <div>
          <h3 className="balance-information">{tokenBalance}</h3>
        </div>
        <label className="balance-information">ETH Balance:</label>
        <div>
          <h3 className="balance-information">{ethBalance}</h3>
        </div>
        <label className="balance-information">First Cancel Deadline:</label>
        <div>
          <h3 className="balance-information">{timeRemaining1}</h3>
        </div>
        <label className="balance-information">Second Cancel Deadline:</label>
        <div>
          <h3 className="balance-information">{timeRemaining2}</h3>
        </div>
        <label className="balance-information">Third Cancel Deadline:</label>
        <div>
          <h3 className="balance-information">{timeRemaining3}</h3>
        </div>
        <label className="balance-information">Last Cancel Deadline:</label>
        <div>
          <h3 className="balance-information">{timeRemaining4}</h3>
        </div>
      </article>
    </div>
  );
};

export default CheckBalance;
