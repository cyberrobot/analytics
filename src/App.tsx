import React, { useEffect, useState } from 'react';
import './App.scss';
import 'antd/dist/antd.css'
import server from './server';
import { client } from './client';
import ConversionWidget from './components/Conversions';
import conversion from './types';
import moment from 'moment'
import DateRangeFilter from './components/DateRangeFilter';

function App() {
  server({});

  const [dataPoints, setDataPoints] = useState([]);

  const getNormalizedData = (data: any) => {
    return data.map((dataPoint: conversion) => ({
      ...dataPoint,
      date: moment(dataPoint.date).format('DD/MM/YYYY')
    }))
  }

  const filterData = ({dateStart, dateEnd}: any) => {
    const result = dataPoints.filter((dataPoint: conversion) => {
      const toMoment = moment(dataPoint.date, 'DD/MM/YYYY').startOf('day');
      return toMoment.isSameOrBefore(dateEnd) && toMoment.isSameOrAfter(dateStart);
    });
    setDataPoints(result);
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
      {dataPoints.length ? 
        <div>
          <DateRangeFilter onChange={filterData} />
          <ConversionWidget data={dataPoints} />
        </div>
      : <div>Loading...</div>}
    </div>
  );
}

export default App;
