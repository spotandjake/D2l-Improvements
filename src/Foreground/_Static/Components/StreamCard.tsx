import styles from '../css/Components/StreamCard.module.scss';
// Types
import { StreamType } from '../Classes/Types';
// Loader Function
interface ClassCardProps {
  Id: number;
  Title: string;
  Category: StreamType;
  StartDate: string;
  Route: Function;
}
const ClassCard = ({ Id, Title, Category, StartDate }: ClassCardProps) => {
  return (
    <div className={styles.container} key={Id} >
      <div className={styles.titleIcon}>
        <span></span>
      </div>
      <div className={styles.titleBlock}>
        <h2>{Title}</h2>
        <h5>{new Date(StartDate).toDateString()}</h5>
      </div>
      <div className={styles.cardBody}>
      </div>
    </div>
  );
};

export default ClassCard;