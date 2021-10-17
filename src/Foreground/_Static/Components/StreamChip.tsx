import styles from '../css/Components/StreamChip.module.scss';

import { StreamType } from '../Classes/Types';
// Loader Function
interface ChipProps {
  Type: StreamType;
  ToggleType: Function;
}
const FilterChip = ({ Type, ToggleType }: ChipProps) => {
  return (
    <div
      className={[styles.container, styles[Type]].join(' ')}
      onClick={() => ToggleType(Type)}
    >
      {Type}
    </div>
  );
};

export default FilterChip;
