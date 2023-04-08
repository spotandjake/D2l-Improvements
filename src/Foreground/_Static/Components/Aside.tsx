import styles from '../css/Components/Aside.module.scss';
// Components
import React, { useState, useEffect, memo } from 'react';
import Link from './Link';
import Brightspace from '../Classes/Brightspace';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
interface props {
  brightSpace: Brightspace;
  Route: Function;
  Active: boolean;
  showAside?: (any) => void;
}
// Loader Function
const Aside = ({ brightSpace, Route, Active, showAside }: props) => {
  const [_classList, setClassList] = useState(<></>);
  // Fetch the classList
  useEffect(() => {
    (async () => {
      const Today = new Date().valueOf();
      const classList = await brightSpace._fetch(
        `https://bc59e98c-eabc-4d42-98e1-edfe93518966.enrollments.api.brightspace.com/users/${brightSpace.uid}?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false`,
        {
          headers: {
            authorization: `Bearer ${await brightSpace._getToken()}`,
          },
        }
      );
      const classes: JSX.Element[] = await Promise.all(
        classList.entities.map(async ({ href }) => {
          const classResources = await brightSpace._fetch(href, {
            headers: {
              authorization: `Bearer ${await brightSpace._getToken()}`,
            },
          });
          const classInfo = await brightSpace._fetch(
            classResources.links[1].href,
            {
              headers: {
                authorization: `Bearer ${await brightSpace._getToken()}`,
              },
            }
          );
          const { endDate, name } = classInfo.properties;
          if (new Date(endDate).valueOf() < Today) return <></>;
          else
            return (
              <li>
                <Link
                  Title={name}
                  Href={classInfo.links[0].href.replace(
                    'https://bc59e98c-eabc-4d42-98e1-edfe93518966.folio.api.brightspace.com/organizations/',
                    'https://durham.elearningontario.ca/d2l/home/'
                  )}
                  Active={true}
                  Route={() => Route(brightSpace)}
                >
                  <h3>{name}</h3>
                </Link>
              </li>
            );
        })
      );
      // Set State
      setClassList(<ul>{classes}</ul>);
    })();
  }, []);
  // Render the classes
  return (
    <aside
      className={[styles.container, Active ? styles.Active : ''].join(' ')}
    >
      <ClickAwayListener onClickAway={() => showAside(() => false)}>
        {_classList}
      </ClickAwayListener>
    </aside>
  );
};

export default memo(Aside);
