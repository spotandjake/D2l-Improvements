import styles from '../css/Views/ClassList.module.scss';
// Components
import React, { useState } from 'react';
import NavBar from '../Components/NavBar';
import Brightspace from '../Classes/Brightspace';
import ClassCard from '../Components/ClassCard';
interface props {
  brightSpace: Brightspace;
}
// Loader Function
const ClassList = ({ brightSpace }: props) => {
  const [ _classList, setClassList ] = useState(<></>);
  // Fetch the classList
  (async () => {
    const Today = new Date().valueOf();
    const classList = await brightSpace._fetch(`https://bc59e98c-eabc-4d42-98e1-edfe93518966.enrollments.api.brightspace.com/users/${brightSpace.uid}?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false`, {
      headers: {
        authorization: `Bearer ${await brightSpace._getToken()}`
      }
    });
    const classes = await Promise.all(classList.entities.map(async ({ href }) => {
      const classResources = await brightSpace._fetch(href, {
        headers: {
          authorization: `Bearer ${await brightSpace._getToken()}`
        }
      });
      const classInfo = await brightSpace._fetch(classResources.links[1].href, {
        headers: {
          authorization: `Bearer ${await brightSpace._getToken()}`
        }
      });
      const imageInfo = await window.fetch(classInfo.entities[2].href).then((res) => res.json())
        .catch(() => '/d2l/img/0/Framework.UserProfileBadge.actProfileDaylight100.png?v=20.21.8.31658'); // TODO: fix
      // TODO: Get Teacher Info
      const { endDate, name } = classInfo.properties;
      console.log('Loop For Some Reason');
      return (
        <ClassCard
          Name={name}
          Active={new Date(endDate).valueOf() < Today}
          Href={classInfo.links[0].href.replace('https://bc59e98c-eabc-4d42-98e1-edfe93518966.folio.api.brightspace.com/organizations/', 'https://durham.elearningontario.ca/d2l/home/')}
          Picture={imageInfo.links ? imageInfo.links[2].href : imageInfo}
        />
      );
    }));
    // Set State
    //@ts-ignore
    setClassList(classes);
  })();
  // Render the classes
  return (
    <section className={styles.container}>
      {/* NavBar */}
      <NavBar brightSpace={brightSpace} />
      {/* TODO: ClassList */}
      <section>
        {_classList}
      </section>
    </section>
  );
};

export default ClassList;