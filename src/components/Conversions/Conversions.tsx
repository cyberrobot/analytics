import moment from "moment";
import { FC, useContext } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart, Bar } from 'recharts';
import { ConfigContext } from "../../context";
import { sales } from "../../types";

type ConversionWidgetProps = {
  data: sales[],
  metric: string,
  colorConfig: {
    currentPeriod: string
  }
}

type TickProps = {
  x: any,
  y: any,
  stroke: any,
  payload: any
}
 
const ConversionWidget: FC<ConversionWidgetProps> = ({ data, metric, colorConfig }) => {
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

  const capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

  const isRevenueMetric = metric === 'revenue';

  const tooltipFormatter = ({active, payload, label}: any) => {
    if (active && payload && payload.length) {
      const props = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <h4>Apple Store Birmingham</h4>
          <dl>
            <dt className="period-type">{capitalize(metric)}:</dt>
            <dd>{isRevenueMetric ? `£${props.current_period[metric].toFixed(2)}` : props.current_period[metric]}</dd>
            <dt className="period-type">Date:</dt>
            <dd>{moment(props['date']).format(dateFormat)}</dd>
          </dl>
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
      <Bar dataKey={(data) => data.current_period[metric]} barSize={20} fill={colorConfig.currentPeriod} />
    </ComposedChart>
  );
}
 
export default ConversionWidget;