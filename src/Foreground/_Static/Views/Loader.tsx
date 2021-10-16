import styles from '../css/Views/Loader.module.scss';
// Loader Function
const Loader = () => {
  return (
    <section className={styles.container}>
      <div className={styles.loader}>
        {new Array(9).map((_, i) => <div key={i}></div>)}
      </div>
    </section>
  );
};

export default Loader;