import styles from '../css/Views/ClassList.module.scss';
// Components
import NavBar from '../Components/NavBar';
import Brightspace from '../Classes/Brightspace';
interface props {
  brightSpace: Brightspace;
}
// Loader Function
const ClassList = ({ brightSpace }: props) => {
  return (
    <section className={styles.container}>
      {/* NavBar */}
      <NavBar brightSpace={brightSpace} />
      {/* TODO: ClassList */}
    </section>
  );
};

export default ClassList;