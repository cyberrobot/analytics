import { FC, useState } from "react";
import { Radio } from 'antd';

interface MetricSelectorProps {
  onChange: (metric: string) => void;
}
 
const MetricSelector: FC<MetricSelectorProps> = ({ onChange }) => {
  const [selectedMetric, setSelectedMetric] = useState('visits');

  const onMetricChange = (value: string) => {
    setSelectedMetric(value);
    onChange(value);
  }

  return (
    <Radio.Group onChange={(e) => onMetricChange(e.target.value)} value={selectedMetric}>
      <Radio value={'visits'}>Visits</Radio>
      <Radio value={'revenue'}>Revenue</Radio>
    </Radio.Group>
    
  );
}
 
export default MetricSelector;