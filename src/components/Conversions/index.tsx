import { FC } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <ScatterChart 
      width={1000} 
      height={450}
      margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" name="Date" tick={tick} height={75} interval={2} />
      <YAxis type="number" dataKey="transactions" name="Transactions" />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <Scatter name="Conversion" data={data} fill="#8884d8" />
    </ScatterChart>
  );
}
 
export default ConversionWidget;