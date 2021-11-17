import moment from "moment";
import { FC, useContext } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart, Bar } from 'recharts';
import { ConfigContext } from "../../context";
import { sales } from "../../types";

type ConversionWidgetProps = {
  data: sales[],
  metric: string
}

type TickProps = {
  x: any,
  y: any,
  stroke: any,
  payload: any
}
 
const ConversionWidget: FC<ConversionWidgetProps> = ({ data, metric }) => {
  const { dateFormat } = useContext(ConfigContext);
  
  const tick = ({ x, y, stroke, payload }: TickProps) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text className="custom-tick" x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
          {moment(payload.value).format(dateFormat)}
        </text>
      </g>
    );
  };

  const tooltipFormatter = ({active, payload, label}: any) => {
    if (active && payload && payload.length) {
      const props = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <h4>{moment(props['date']).format(dateFormat)}</h4>
          <div className="period-type">Current period</div>
          <div style={{color: '#413ea0'}}>{`Visits : ${props.current_period['visits']}`}</div>
          <div style={{color: '#413ea0'}}>{`Transactions : £${props.current_period['transactions']}`}</div>
          <div className="period-type">Compare period</div>
          <div style={{color: '#82ca9d'}}>{`Visits : ${props.compare_period['visits']}`}</div>
          <div style={{color: '#82ca9d'}}>{`Transactions : £${props.compare_period['transactions']}`}</div>
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
      <Bar dataKey={(data) => data.current_period[metric]} barSize={20} fill="#413ea0" />
      <Bar dataKey={(data) => data.compare_period[metric]} barSize={20} fill="#82ca9d" />
    </ComposedChart>
  );
}
 
export default ConversionWidget;