import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchKlines } from '../api/binance';
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

    const fetchData = async () => {
        const data = await fetchKlines();
        if (data.length === 0) return;

        const labels = data.map(item => new Date(item[0]).toLocaleTimeString());
        const prices = data.map(item => item[4]);

        setChartData({
            labels,
            datasets: [
                {
                    label: 'BTC/USDT',
                    data: prices,
                    borderColor: 'rgb(75, 192, 192, 1)',
                    backgroundColor: 'rgb(75, 192, 192, 0.2)',
                },
            ],
        });
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

  
  return (
    <div className='container mx-auto p-4'>
        <h2 className='text-2xl font-bold text-center mb4'>Real-Time BTC/USDT Chart</h2>
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