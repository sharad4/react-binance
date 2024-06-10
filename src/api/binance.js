import axios from "axios";

const BASE_URL = 'https://api.binance.com/api/v3';

export const fetchKlines = async(symbol = 'BTCUSDT', interval = '30m') => {
  try {
    const response = await axios.get(`${BASE_URL}/klines`, {
        params: {
            symbol,
            interval,
        },
    });

    return response.data;

  } catch (error) {
    console.log('Error fetching klines data: ', error);
    return [];
  }
}
