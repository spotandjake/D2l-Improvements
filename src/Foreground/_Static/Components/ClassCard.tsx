import styles from '../css/Components/ClassCard.module.scss';
import Link from './Link';

// Loader Function
interface ClassCardProps {
  Name: string;
  Active: boolean;
  Href: string;
  Picture: string;
  StartDate: string;
}
const ClassCard = ({
  Name,
  Active,
  Href,
  Picture,
  StartDate,
}: ClassCardProps) => {
  return (
    <div
      className={[styles.container, Active ? ' ' : styles.disabled].join(' ')}
    >
      <Link Href={Href} Active={Active}>
        <picture>
          <img src={Picture} />
        </picture>
        <div className={styles.content}>
          <h4>{Name}</h4>
          {Active ? (
            <h6>Closes | {new Date(StartDate).toDateString()}</h6>
          ) : (
            <h6>Closed</h6>
          )}
        </div>
      </Link>
    </div>
  );
};
export default ClassCard;
