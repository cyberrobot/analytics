import { Button, DatePicker, Space } from 'antd';
import moment from 'moment';
import { FC, useContext, useState } from 'react';
import { ConfigContext } from '../../context';

const { RangePicker } = DatePicker;

type DateRangeFilterProps = {
  onChange: ({dateStart, dateEnd}: { dateStart: moment.Moment | null, dateEnd: moment.Moment | null}) => void,
  minDate: moment.Moment,
  maxDate: moment.Moment
}
 
const DateRangeFilter: FC<DateRangeFilterProps> = ({ onChange, minDate, maxDate }) => {
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const { dateFormat } = useContext(ConfigContext);

  const setDate = (range: any) => {
    if (range === null) {
      onChange({
        dateStart: null,
        dateEnd: null
      });
      return;
    }

    setDateStart(range[0].startOf('day'));
    setDateEnd(range[1].endOf('day'));
  }

  const onApply = () => {
    onChange({
      dateStart,
      dateEnd
    });
  }

  const setLimits = (currentDate: moment.Moment) => {
    return currentDate.isBefore(minDate) || currentDate.isAfter(maxDate);
  }
  
  return (
    <div className="date-range-filter">
      <Space>
        <RangePicker format={dateFormat} onChange={(dates: any) => setDate(dates)} disabledDate={setLimits} />
        <Button type="primary" onClick={onApply}>Apply</Button>
      </Space>
    </div>
  );
}
 
export default DateRangeFilter;