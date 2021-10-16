import styles from "../css/Views/ClassList.module.scss";
// Components
import React, { useState, useEffect } from "react";
import NavBar from "../Components/NavBar";
import Brightspace from "../Classes/Brightspace";
interface props {
  brightSpace: Brightspace;
  Route: Function;
  ClassId: string;
}
// Loader Function
const ClassRoom = ({ brightSpace, Route, ClassId }: props) => {
  const [_classStream, setClassStream] = useState(<></>);
  // Fetch the classList
  useEffect(() => {
    (async () => {
      console.log(ClassId);
      // Fetch Stuff For Stream
    })();
  }, []);
  // Render the classes
  return (
    <section className={styles.container}>
      {/* NavBar */}
      <NavBar brightSpace={brightSpace} />
      {/* TODO: ClassList */}
      <section className={styles.list}>{_classStream}</section>
    </section>
  );
};

export default ClassRoom;
