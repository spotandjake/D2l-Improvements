import styles from '../css/Components/Aside.module.scss';
// Components
import React, { useState, memo, useEffect } from 'react';
import Link from './Link';
import Brightspace from '../Classes/BrightSpaceApi';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
interface props {
  brightSpace: Brightspace;
  Active: boolean;
  showAside?: (any) => void;
}
// Loader Function
const Aside = ({ brightSpace, Active, showAside }: props) => {
  const [_classList, setClassList] = useState(<></>);
  // Fetch the classList
  useEffect(() => {
    (async () => {
      const classList = await brightSpace.getClassList();
      const classes = [
        <li>
          <Link Href={'/d2l/home'} Active={true}>
            <h3>Home</h3>
          </Link>
        </li>,
      ];
      for (const classInfo of classList) {
        if (classInfo.isActive)
          classes.push(
            <li>
              <Link Href={classInfo.href} Active={true}>
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
