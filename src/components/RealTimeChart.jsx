import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchKlines, fetchSymbols, fetchCurrentPrice } from '../api/binance';
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const RealTimeChart = () => {
    const [chartData, setChartData ] = useState({ labels: [], datasets: [] });
    const [symbols, setSymbols] = useState([]);
    const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
    const [selectedInterval, setSelectedInterval] = useState('30m');
    const [currentPrice, setCurrentPrice] = useState(null);

    const intervals = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M'];

    const fetchData = async () => {
        const data = await fetchKlines(selectedSymbol, selectedInterval);
        if (data.length === 0) return;

        const labels = data.map(item => new Date(item[0]).toLocaleTimeString());
        const prices = data.map(item => item[4]);

        setChartData({
            labels,
            datasets: [
                {
                    label: `${selectedSymbol}`,
                    data: prices,
                    borderColor: 'rgb(75, 192, 192, 1)',
                    backgroundColor: 'rgb(75, 192, 192, 0.2)',
                },
            ],
        });
    };

    const fetchPrice = async () => {
        try {
            const price = await fetchCurrentPrice(selectedSymbol);
            if (!price){
                console.error('Failed to fetch price, received:', price);
                return;
            }
            setCurrentPrice(price);
        } catch (error) {
            console.error('Error fetching price:', error);
        }
    };

    useEffect(() => {
        const fetchSymbolsList = async () => {
            const symbolsList = await fetchSymbols();
            setSymbols(symbolsList);
        };

        fetchSymbolsList();
    }, []);

    useEffect(() => {
        fetchData();
        fetchPrice();

        const dataInterval = setInterval(() => {
            fetchData();
        }, 30000);

        const priceInterval = setInterval(() => {
            fetchPrice();
        }, 5000);

        return () => {
            clearInterval(dataInterval);
            clearInterval(priceInterval);
        };
    }, [selectedSymbol, selectedInterval])

  
  return (
    <div className='container mx-auto p-4'>
        <h2 className='text-2xl md:text-3xl font-bold text-center mb-4'>Real-Time {selectedSymbol} Chart</h2>
        {currentPrice && (
            <p className='text-center text-lg mb-4 bg-blue-100 border border-blue-300 p-4 rounded'>
                Current Price of {selectedSymbol}: ${parseFloat(currentPrice).toFixed(2)}
            </p>
        )}
        <div className="flex flex-col md:flex-row justify-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className='border p-2 rounded mr-4'
            >
                {symbols.map((symbol) => (
                    <option key={symbol} value={symbol}>
                        {symbol}
                    </option>
                ))}
            </select>
            <select
                value={selectedInterval}
                onChange={(e) => setSelectedInterval(e.target.value)}
                className='border p-2 rounded'
            >
                {intervals.map((interval) => (
                    <option key={interval} value={interval}>
                       {interval} 
                    </option>
                ))}
            </select>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
            {chartData.labels.length > 0 ? (
             <Line data={chartData}  />
            ) : (
                <p className='text-center'>Loading data....</p>
            )}
        </div>
    </div>
  );
};

export default RealTimeChart;