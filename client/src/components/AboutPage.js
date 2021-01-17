import React from "react"

const AboutPage = () => {
  return (
    <div id="main">
      <i class="fas fa-arrow-down fa-2x" />
      <article id="contact">
        <h2 class="major">About</h2>
        <div className="explanation">
          The Ethereum blockchain allows a decentralized guarentee of refunds to
          customers - reducing the amount of chargebacks and giving customers a
          peace of mind with 100% guarenteed refunds.
        </div>
        <h2 class="major">How This dApp Works</h2>
        <div className="explanation">
          When USDC is deposited, the smart contract will print the equivalent
          amout Flight Tokens for the customer. For example, if 1000 USDC is
          deposited, the contract will give the customer 1000 Flight Tokens.
          These Flight Tokens are a representation to allow customers to Redeem
          these Flight Tokens at any time if they want a refund.
        </div>
        <h2 class="major">Refunds</h2>
        <div className="explanation">
          Each customer will have their own unique refund times. The further
          away from their last refund time means customers are entitled to more
          of their money back - but not 100%
        </div>
        <h2 class="major">Incentives</h2>
        <div className="explanation">
          Companies are incentived to honour customer refunds because if they
          don't, the money is stuck on the blockchain for at least 1 year.
        </div>
      </article>
    </div>
  )
}

export default AboutPage
