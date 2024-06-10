import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchKlines, fetchSymbols } from '../api/binance';
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

    useEffect(() => {
        const fetchSymbolsList = async () => {
            const symbolsList = await fetchSymbols();
            setSymbols(symbolsList);
        };

        fetchSymbolsList();

        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 30000);

        return () => clearInterval(interval);
    }, [selectedSymbol, selectedInterval]);

  
  return (
    <div className='container mx-auto p-4'>
        <h2 className='text-2xl font-bold text-center mb4'>Real-Time BTC/USDT Chart</h2>
        <div className="flex justify-center mb-4">
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
             <Line data={chartData} />
            ) : (
                <p className='text-center'>Loading data....</p>
            )}
        </div>
    </div>
  );
};

export default RealTimeChart;