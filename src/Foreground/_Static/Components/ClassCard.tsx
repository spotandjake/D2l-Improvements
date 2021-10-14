import styles from '../css/Components/ClassCard.module.scss';

// Loader Function
interface ClassCardProps {
  Name: string;
  Active: boolean;
  Href: string;
  Picture: string;
}
const ClassCard = (props: ClassCardProps) => {
  return (
    <section className={styles.container}>
    </section>
  );
};

export default ClassCard;