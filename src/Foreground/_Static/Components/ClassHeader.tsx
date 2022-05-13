import styles from '../css/Components/ClassHeaderCard.module.scss';

// Loader Function
interface HeaderProps {
  Name: string;
  Picture: string;
  StartDate: string;
}
const HeaderCard = ({ Name, Picture, StartDate }: HeaderProps) => {
  return (
    <header className={styles.container}>
      <picture>
        <img src={Picture} />
      </picture>
      <div className={styles.content}>
        <h4>{Name}</h4>
        <h6>Closes | {new Date(StartDate).toDateString()}</h6>
      </div>
    </header>
  );
};
export default HeaderCard;
