import React, { useEffect, useState } from 'react';
import './App.scss';
import server from './server';
import { client } from './client';
import ConversionWidget from './components/Conversions';
import conversion from './types';
import moment from 'moment'

function App() {
  server({});

  const [dataPoints, setDataPoints] = useState([]);

  const getNormalizedData = (data: any) => {
    return data.map((dataPoint: conversion) => ({
      ...dataPoint,
      date: moment(dataPoint.date).format('DD/MM/YYYY')
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      client.get('/api/conversion').then((response) => {
        setDataPoints(getNormalizedData(response));
      });
    }

    fetchData();
  }, []);

  return (
    <div className="App">
      {dataPoints.length ? <ConversionWidget data={dataPoints} /> : <div>Loading...</div>}
    </div>
  );
}

export default App;
