import React, { useState, useContext } from "react"
import { LoadingContext, ConnectedContext } from "./App"
import Spinner from "./Spinner"

const Withdraw = ({ withdrawStableCoin, withdrawAllStableCoin }) => {
  const [id, setId] = useState("")

  const loading = useContext(LoadingContext)
  const { isConnected, setIsConnected } = useContext(ConnectedContext)

  const updateId = (e) => {
    e.preventDefault()
    setId(e.target.value)
  }

  const submitValue = (e) => {
    e.preventDefault()
    const id = e.target.elements[0].value
    withdrawStableCoin(id)
    setId("")
  }

  const submitWithdrawAll = (e) => {
    e.preventDefault()
    withdrawAllStableCoin()
  }

  return (
    <div id="main">
      <i class="fas fa-arrow-down fa-2x"></i>
      <article id="intro">
        <section>
          <h3 class="major">Deposit</h3>
          <form onSubmit={submitValue}>
            <div class="fields">
              <div class="field half">
                <label for="demo-name">Enter Customer ID</label>
                <input
                  type="text"
                  name="demo-name"
                  id="demo-name"
                  value={id}
                  placeholder="Enter Customer ID"
                  onChange={updateId}
                />
              </div>

              <div className="depositPageButton">
                {isConnected === "connected" ? (
                  loading ? (
                    <Spinner />
                  ) : (
                    <button id="depositButton">Withdraw USDC</button>
                  )
                ) : (
                  <button disabled>Please Connect Your Wallet</button>
                )}
              </div>
            </div>
          </form>

          <div className="depositPageButton" onClick={submitWithdrawAll}>
            {isConnected === "connected" ? (
              loading ? (
                <Spinner />
              ) : (
                <button id="depositButton">Withdraw All USDC</button>
              )
            ) : (
              <button disabled>Please Connect Your Wallet</button>
            )}
          </div>
        </section>
      </article>
    </div>
  )
}

export default Withdraw
