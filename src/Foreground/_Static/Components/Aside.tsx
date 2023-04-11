import styles from '../css/Components/Aside.module.scss';
// Components
import React, { useState, useEffect, memo } from 'react';
import Link from './Link';
import Brightspace from '../Classes/BrightSpaceApi';
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
      const classList = await brightSpace.getClassList();
      const classListImg = await brightSpace.getClassImages(classList);
      const classes = [];
      for (const classInfo of classListImg) {
        if (classInfo.isActive) return <></>;
        else
          classes.push(
            <li>
              <Link
                Title={classInfo.name}
                Href={classInfo.href}
                Active={true}
                Route={() => Route(brightSpace)}
              >
                <h3>{classInfo.name}</h3>
              </Link>
            </li>
          );
      }
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
