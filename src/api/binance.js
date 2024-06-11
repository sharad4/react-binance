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

export const fetchSymbols = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/exchangeInfo`);
        return response.data.symbols.map(symbol => symbol.symbol);
    } catch (error) {
        console.error('Error fetching symbols: ', error);
        return [];
    }
};

export const fetchCurrentPrice = async (symbol = 'BTCUSDT') => {
  try {
    const response = await axios.get(`${BASE_URL}/ticker/price`, {
      params: {
        symbol,
      },
    });
    return response.data.price;
  } catch (error) {
    console.error('Error fetching current price: ', error);
    return null;
  }
}
