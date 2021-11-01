import styles from '../css/Components/StreamChip.module.scss';

import { StreamType } from '../Classes/Types';
// Loader Function
interface ChipProps {
  Type: StreamType;
}
const FilterChip = ({ Type }: ChipProps) => {
  return (
    <label className={[styles.container, styles[Type]].join(' ')} htmlFor={`${Type}-ExpandState`}>
      {Type}
    </label>
  );
};

export default FilterChip;
