import axios from 'axios';

export default axios.create({
    baseURL: 'https://api.coingecko.com/api/v3/simple/price?',
    params: {
        ids: 'ethereum',
        vs_currencies: 'aud'
    }
})