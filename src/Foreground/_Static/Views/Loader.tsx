import styles from '../css/Views/Loader.module.scss';
// Loader Function
const Loader = () => {
  return (
    <section className={styles.container}>
      <div className={styles.loader}>
        <div></div><div></div><div></div>
        <div></div><div></div><div></div>
        <div></div><div></div><div></div>
      </div>
    </section>
  );
};

export default Loader;