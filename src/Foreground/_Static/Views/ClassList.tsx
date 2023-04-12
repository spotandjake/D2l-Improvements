import styles from '../css/Views/ClassList.module.scss';
// Components
import React, { useState, useEffect, memo } from 'react';
import Brightspace from '../Classes/BrightSpaceApi';
import ClassCard from '../Components/ClassCard';
interface props {
  brightSpace: Brightspace;
}
// Loader Function
const ClassList = ({ brightSpace }: props) => {
  const [_classList, setClassList] = useState(<></>);
  // Fetch the classList
  useEffect(() => {
    (async () => {
      const classList = await brightSpace.getClassList();
      const classListImg = await brightSpace.getClassImages(classList);
      const classes = [];
      for (const classInfo of classListImg) {
        classes.push(
          <ClassCard
            Name={classInfo.name}
            Active={classInfo.isActive}
            Href={classInfo.href}
            Picture={classInfo.imageLink}
            StartDate={classInfo.startDate}
          />
        );
      }
      // Set State
      setClassList(<>{classes}</>);
    })();
  }, []);
  // Render the classes
  return (
    <section className={styles.container}>
      {/* ClassList */}
      <section className={styles.list}>{_classList}</section>
    </section>
  );
};

export default memo(ClassList);
