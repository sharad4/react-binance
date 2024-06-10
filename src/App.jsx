import React from "react";
import RealTimeChart from "./components/RealTimeChart";



const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <header className="w-full bg-blue-600 p-4">
        <h1 className="text-3xl text-white text-center">Binance BTC/USDT Real-Time Chart</h1>
      </header>
      <main className="w-full flex-grow flex justify-center items-center">
        <RealTimeChart />
      </main>
    </div>
  )
}

export default App;