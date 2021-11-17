import React, { useEffect, useState } from 'react';
import './App.scss';
import 'antd/dist/antd.css'
import server from './server';
import { client } from './client';
import ConversionWidget from './components/Conversions';
import sales from './types';
import moment from 'moment'
import DateRangeFilter from './components/DateRangeFilter';
import MetricSelector from './components/MetricSelector';
import { Space, Spin } from 'antd';
import { ConfigContext } from './context';

function App() {
  server({});

  const config = {dateFormat: 'DD/MM/YYYY'};
  const [dataPoints, setDataPoints] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentMetric, setCurrentMetric] = useState('visits')

  const filterData = ({dateStart, dateEnd}: any) => {
    if (dateStart === null && dateEnd === null) {
      setFilteredData(dataPoints);
      return;
    }

    const result = [...dataPoints].filter((dataPoint: sales) => {
      const toMoment = moment(dataPoint.date).startOf('day');
      return toMoment.isSameOrBefore(dateEnd) && toMoment.isSameOrAfter(dateStart);
    });
    setFilteredData(result);
  }

  useEffect(() => {
    const fetchData = async () => {
      client.get('/api/sales').then((response: any) => {
        setDataPoints(response);
        setFilteredData(response);
      });
    }

    fetchData();
  }, []);

  const getDate = (dataPoint: sales) => {
      return moment(dataPoint.date);
  }

  const onMetricChange = (metric: string) => {
    setCurrentMetric(metric);
  }

  return (
    <ConfigContext.Provider value={config}>
      <div className="App">
        {dataPoints.length ? 
          <div>
            <div>
              <Space>
                <DateRangeFilter onChange={filterData} minDate={getDate(dataPoints[0])} maxDate={getDate(dataPoints[dataPoints.length - 1])} />
                <MetricSelector onChange={onMetricChange} />
              </Space>
            </div>
            <ConversionWidget data={filteredData} metric={currentMetric} />
          </div>
        : <div className="loader"><Spin tip="Loading..."></Spin></div>}
      </div>
    </ConfigContext.Provider>
  );
}

export default App;
