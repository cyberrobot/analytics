import moment from "moment";
import { FC } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart, Line, Bar, Legend } from 'recharts';
import { sales } from "../../types";

type ConversionWidgetProps = {
  data: sales[]
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
      return (
        <div className="custom-tooltip">
          <h4>{moment(props['date']).format('DD/MM/YYYY')}</h4>
          <div className="period-type">Current period</div>
          <div style={{color: '#413ea0'}}>{`Visits : ${props.current_period['visits']}`}</div>
          <div style={{color: '#413ea0'}}>{`Transactions : ${props.current_period['transactions']}`}</div>
          <div className="period-type">Compare period</div>
          <div style={{color: '#82ca9d'}}>{`Visits : ${props.compare_period['visits']}`}</div>
          <div style={{color: '#82ca9d'}}>{`Transactions : ${props.compare_period['transactions']}`}</div>
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
      <Bar dataKey={(data) => data.current_period.visits} barSize={20} fill="#413ea0" />
      <Bar dataKey={(data) => data.compare_period.visits} barSize={20} fill="#82ca9d" />
    </ComposedChart>
  );
}
 
export default ConversionWidget;