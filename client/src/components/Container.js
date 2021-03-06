import React, { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import "../assets/css/main.css"
import "../assets/css/noscript.css"
import ConnectWallet from "./ConnectWallet"
import { ConnectedContext } from "./App"
import logo from "../images/ttp2.png"

const Container = ({}) => {
  const { isConnected, setIsConnected } = useContext(ConnectedContext)
  console.log(isConnected)
  return (
    <>
      <body class="is-preload">
        <div id="wrapper">
          <header id="header">
            <div class="logo">
              <span class="icon fa-map"></span>
            </div>
            <div class="content">
              <div class="inner">
                <img class="logoImg" src={logo} />
                <p>
                  Guaranteed Refunds For Travel
                  <br />
                  For Your Peace Of Mind
                </p>
                <ConnectWallet />
              </div>
            </div>
            <nav>
              <ul>
                <li>
                  <Link to="/deposit-fiat">Deposit AUD</Link>
                </li>
                <li>
                  <Link to="/redeem-tokens">Redeem Flight Tokens</Link>
                </li>
                <li>
                  <Link to="/check-balance">Check Balance</Link>
                </li>
                <li>
                  <Link to="/withdraw-page">Withdraw USDC</Link>
                </li>
                <li>
                  <Link to="/about-page">About Blockchain</Link>
                </li>
                <li>
                  <Link to="/contact-page">Contact</Link>
                </li>
              </ul>
            </nav>
          </header>

          <footer id="footer">
            <p class="copyright">&copy; Untitled. Design: </p>
          </footer>
        </div>
      </body>
    </>
  )
}

export default Container
