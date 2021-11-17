import { Button, DatePicker, Space } from 'antd';
import moment from 'moment';
import { FC, useState } from 'react';

const { RangePicker } = DatePicker;

type DateRangeFilterProps = {
  onChange: ({dateStart, dateEnd}: { dateStart: moment.Moment | undefined, dateEnd: moment.Moment | undefined}) => void
}
 
const DateRangeFilter: FC<DateRangeFilterProps> = ({ onChange }) => {
  const [dateStart, setDateStart] = useState();
  const [dateEnd, setDateEnd] = useState();

  const setDate = (range: any) => {
    setDateStart(range[0].startOf('day'));
    setDateEnd(range[1].endOf('day'));
  }

  const onApply = () => {
    onChange({
      dateStart,
      dateEnd
    });
  }
  
  return (
    <div className="date-range-filter">
      <Space>
        <RangePicker onChange={(dates: any) => setDate(dates)} />
        <Button type="primary" onClick={onApply}>Apply</Button>
      </Space>
    </div>
  );
}
 
export default DateRangeFilter;