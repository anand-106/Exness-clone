import React, { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import axios from 'axios';

export default function CandleChart({symbolValue,trades}) {
  const chartContainerRef = useRef(null);
  const [intervalValue,setIntervalValue]= useState("trades_1m")
  const chartRef = useRef(null);
  const candleSeries = useRef(null)
  const currentCandle = useRef(null)

  useEffect(() => {
    if (!chartContainerRef.current) return;


    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      candleSeries.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      width: 900,
      height: 400,
      layout: {
        background: { type: 'solid', color: '#141d22' },
        textColor: '#ffffff',
      },
      grid: {
        vertLines: {
          color: '#334155',   
          style: 0,           
        },
        horzLines: {
          color: '#334155',   
          style: 0,
        },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: '#475569',
      },
      timeScale: {
        borderColor: '#475569',
      },
    });

    chartRef.current = chart;
    candleSeries.current = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

   
    currentCandle.current = null;

    
    axios.get(`http://localhost:4000/candles?symbol=${symbolValue}&limit=100&interval=${intervalValue}`)
      .then(res => {
        
        if (res.data && Array.isArray(res.data) && candleSeries.current) {
          candleSeries.current.setData(res.data);
          chart.timeScale().fitContent();
        } else {
          console.warn('Invalid candle data received:', res.data);
        }
      })
      .catch(err => {
        console.error('Error loading candle data:', err);
       
      });

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      candleSeries.current = null;
      currentCandle.current = null;
    };
  }, [intervalValue, symbolValue]);

  useEffect(() => {
    try {
      const tick = trades[symbolValue];

      if (!tick || !candleSeries.current) return;

      const ts = Math.floor(new Date(tick.time).getTime() / 1000);

      let step = 60;
      if (intervalValue === "trades_5m") step = 300;
      if (intervalValue === "trades_15m") step = 900;

      const candleTime = Math.floor(ts / step) * step;

      if (!currentCandle.current || currentCandle.current.time !== candleTime) {
        currentCandle.current = {
          time: candleTime, 
          open: tick.price,
          high: tick.price,
          low: tick.price,
          close: tick.price,
        }
      } else {
        currentCandle.current.high = Math.max(tick.price, currentCandle.current.high);
        currentCandle.current.low = Math.min(tick.price, currentCandle.current.low);
        currentCandle.current.close = tick.price;
      }
      
      candleSeries.current.update(currentCandle.current);
    } catch (err) {
      console.error('Error updating candle:', err);
    }
  }, [trades, symbolValue, intervalValue])

  return <div className='p-1 bg-[#3f474a] mt-1 w-[930px]'>
    <div className="bg-[#141d22] rounded-md w-full">
      <select
        value={intervalValue}
        onChange={(e) => {setIntervalValue(e.target.value)}}
        className='outline-0'
      >
        <option value="trades_1m">1 min</option>
        <option value="trades_5m">5 min</option>
        <option value="trades_15m">15 min</option>
      </select>
      
      <div ref={chartContainerRef} style={{ width: '600px', height: '400px' }} />
    </div>
  </div>
}
