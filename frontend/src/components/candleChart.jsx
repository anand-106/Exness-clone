import React, { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import axios from 'axios';

export default function CandleChart({symbolValue}) {
  const chartContainerRef = useRef(null);
  const [intervalValue,setIntervalValue]= useState("trades_1m")
  

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: 600,
      height: 400,
      layout: {
        background: { type: 'solid', color: '#141d22' },
        textColor: '#ffffff',
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    axios.get(`http://localhost:4000/candles?symbol=${symbolValue}&limit=100&interval=${intervalValue}`).then(
        res=>{
            candleSeries.setData(res.data);
        }
    )

    

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [intervalValue,symbolValue]);

  return <div>
    <select
    value={intervalValue}
    onChange={(e)=>{setIntervalValue(e.target.value)}}
    >
        <option value="trades_1m">1 min</option>
        <option value="trades_5m">5 min</option>
        <option value="trades_15m">15 min</option>

    </select>
    
      <div ref={chartContainerRef} style={{ width: '600px', height: '400px' }} />
    </div>
}
