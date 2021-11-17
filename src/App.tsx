import React, { useEffect, useState } from 'react';
import './App.scss';
import 'antd/dist/antd.css'
import server from './server';
import { client } from './client';
import ConversionWidget from './components/Conversions/Conversions';
import sales from './types';
import moment from 'moment'
import DateRangeFilter from './components/DateRangeFilter/DateRangeFilter';
import MetricSelector from './components/MetricSelector/MetricSelector';
import { Col, Row, Space, Spin } from 'antd';
import { ConfigContext } from './context';
import { CompactPicker } from 'react-color';

function App() {
  server({});

  const config = {dateFormat: 'DD/MM/YYYY'};
  const [dataPoints, setDataPoints] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentMetric, setCurrentMetric] = useState('visits');
  const [colorConfig, setColorConfig] = useState({
    currentPeriod: '#413ea0',
    comparePeriod: '#82ca9d'
  });

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

  const onColorChange = ({color, type}: any) => {
    setColorConfig({
      ...colorConfig,
      [type]: color
    })
  }

  return (
    <ConfigContext.Provider value={config}>
      <div className="App">
        {dataPoints.length ? 
          <div>
            <div className="info-message">
              <Space direction="vertical">
                <h2>Select a date range</h2>
                <div className="light">When a date range is selected, the data points outside the range will be filtered out.</div>
                <DateRangeFilter onChange={filterData} minDate={getDate(dataPoints[0])} maxDate={getDate(dataPoints[dataPoints.length - 1])} />
                <h2>Toggle metric</h2>
                <div className="light">Switching between different metric types will change the chart data.</div>
                <MetricSelector onChange={onMetricChange} />
              </Space>
            </div>
            <ConversionWidget colorConfig={colorConfig} data={filteredData} metric={currentMetric} />
            <div className="info-message">
              <h2>Select a chart bar colour</h2>
              <div className="light">When a color selected it'll change colour of the for the corresponding chart bar</div>
            </div>
            <Row className="color-picker-container" gutter={16}>
              <Col>
                <h3>Current period</h3>
                <CompactPicker onChange={(color) => onColorChange({ color: color.hex, type: 'currentPeriod'})} />
              </Col>
              <Col>
                <h3>Compare period</h3>
                <CompactPicker onChange={(color) => onColorChange({ color: color.hex, type: 'comparePeriod'})} />
              </Col>
            </Row>
          </div>
        : <div className="loader"><Spin tip="Loading..."></Spin></div>}
      </div>
    </ConfigContext.Provider>
  );
}

export default App;
