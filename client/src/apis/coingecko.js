import axios from "axios"

export default axios.create({
  baseURL: "https://api.coingecko.com/api/v3/simple/price?",
  params: {
    ids: "usd-coin",
    vs_currencies: "aud",
  },
})
