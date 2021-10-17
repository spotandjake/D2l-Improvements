import styles from '../css/Components/StreamChip.module.scss';

import { StreamType } from '../Classes/Types';
// Loader Function
interface ChipProps {
  Type: StreamType;
  Active: boolean;
  ToggleType: Function;
}
const FilterChip = ({ Type, Active, ToggleType }: ChipProps) => {
  return (
    <div
      className={[styles.container, Active ? ' ' : styles.disabled].join(' ')}
      onClick={() => ToggleType(Type)}
    >
      {Type}
    </div>
  );
};

export default FilterChip;
