import moment from "moment";
import { FC } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis, ComposedChart, Line, Bar } from 'recharts';
import { conversion } from "../../types";

type ConversionWidgetProps = {
  data: conversion[]
}

type TickProps = {
  x: any,
  y: any,
  stroke: any,
  payload: any
}
 
const ConversionWidget: FC<ConversionWidgetProps> = ({ data }) => {
  const tick = ({ x, y, stroke, payload }: TickProps) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text className="custom-tick" x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
          {moment(payload.value).format('DD/MM/YYYY')}
        </text>
      </g>
    );
  };

  const tooltipFormatter = ({active, payload, label}: any) => {
    if (active && payload && payload.length) {
      const props = payload[0].payload;
      const conversion = (props['transactions'] / props['visits'] * 100).toFixed(2);
      return (
        <div className="custom-tooltip">
          <h4>{moment(props['date']).format('DD/MM/YYYY')}</h4>
          <div>{`Visits : ${props['visits']}`}</div>
          <div>{`Transactions : ${props['transactions']}`}</div>
          <div>{`Conversion : ${conversion}%`}</div>
        </div>
      );
    }
  
    return null;
  }

  return (
    <ComposedChart 
      data={data} 
      width={1000} 
      height={450}>
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis dataKey="date" name="date" tick={tick} height={75} interval={2} />
      <YAxis />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} content={tooltipFormatter} />
      <Bar dataKey="visits" barSize={20} fill="#413ea0" />
      <Line type="monotone" dataKey="transactions" stroke="#ff7300" />
    </ComposedChart>
  );
}
 
export default ConversionWidget;