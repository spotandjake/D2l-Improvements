import React, { useState, useEffect } from 'react';
import styles from '../css/Components/NavBar.module.scss';
// Import Components
import IdleTimer from 'react-idle-timer';
import Loader from '../Views/Loader';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import MenuIcon from '@material-ui/icons/Menu';
import MailIcon from '@material-ui/icons/MailOutlined';
import MessageIcon from '@material-ui/icons/CommentOutlined';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Brightspace from '../Classes/Brightspace';
interface props {
  brightSpace: Brightspace;
}
const enum AlertShadeState {
  Mail = 'Mail',
  Message = 'Message',
  Notification = 'Alert',
  Profile = 'Profile',
  Closed = 'Closed'
}
// Loader Function
// TODO: add search
// TODO: make aside button work
const parseResponse = async (response) => JSON.parse((await response.text()).trim().substr(9));
const NavBar = ({ brightSpace }: props) => {
  const [_refreshRate, setRefreshRate] = useState(1000*30);
  const [ alertState, setAlertState ] = useState(AlertShadeState.Closed);
  const [ activeAlerts, setActiveAlerts ] = useState([]);
  const [ alertContent, setAlertContent ] = useState(<Loader />);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const fetchAlerts = async () => {
      // Fetch the results
      const response = await fetch('/d2l/activityFeed/checkForNewAlerts?isXhr=true&requestId=3&X-D2L-Session=no-keep-alive');
      const results = await parseResponse(response);
      if (!Array.isArray(results.Payload)) setActiveAlerts([]);
      else {
        const activeTypes = [];
        [ 'Messages', 'Grades' ].forEach((type) => {
          if (!results.Payload.includes(type)) return;
          switch (type) {
            case 'Messages':
              activeTypes.push('Mail');
              break;
            case 'Grades':
              activeTypes.push('Alert');
              break;
            default:
              alert(`Unknown Notification Type ${type}`);
          }
        });
        setActiveAlerts(activeTypes);
      }
      // Set the next timeout time
      timeout = setTimeout(fetchAlerts, _refreshRate);
    };
    fetchAlerts();
    return () => clearTimeout(timeout);
  }, []);
  const click = async (viewType: AlertShadeState) => {
    if (alertState === viewType || viewType == AlertShadeState.Closed) {
      // Close the alert box
      setAlertState(AlertShadeState.Closed);
      setAlertContent(<Loader />);
    } else {
      // Open the alert box
      setAlertState(viewType);
      // Fetch content
      const category = [ '', AlertShadeState.Notification, AlertShadeState.Mail ].indexOf(viewType);
      if (category != -1) {
        const response = await fetch(`/d2l/MiniBar/${brightSpace.cid}/ActivityFeed/GetAlertsDaylight?Category=${category}&requestId=3`);
        const res = await parseResponse(response);
        // Parse the html content
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(res.Payload.Html, 'text/html');
        setAlertContent(
          <>
            <h2>{alertState}</h2>
            <hr />
            <div>
              <div className={styles.NotificationShade} dangerouslySetInnerHTML={{__html: htmlDoc.querySelector('.vui-list').innerHTML }}></div>
            </div>
          </>
        );
      } else if (viewType == AlertShadeState.Profile) {
        // Add the settings ui
        setAlertContent(
          <ul className={styles.dropDown}>
            <li><button>Disable Extension</button></li>
            <li><button>Profile</button></li>
            <li><button>Settings</button></li>
            <li><a href='https://durham.elearningontario.ca/d2l/logout'>Log Out</a></li>
          </ul>
        );
      } else {
        setAlertContent(<>
          <h2>{alertState}</h2>
          <hr />
          <div>
            <Loader />
          </div>
        </>);
      }
    }
  };
  // Stuff
  return (
    <nav className={styles.container}>
      {/* Idle Timer */}
      <IdleTimer
        timeout={1000 * 30}
        onActive={() => setRefreshRate(1000*30)}
        onIdle={() => setRefreshRate(1000*60*5)}
        debounce={250}
      />
      <div className={`${styles.side} ${styles.leftSide}`}>
        <IconButton aria-label="aside" className={styles.IconButton}>
          <SvgIcon
            className={styles.Icon}
            component={MenuIcon}
            viewBox="0 0 24 24"
          />
        </IconButton>
      </div>
      <div className={styles.center}>
        <input className={styles.SearchBar} placeholder="Search" type="text" />
      </div>
      <ClickAwayListener onClickAway={() => click(AlertShadeState.Closed)}>
        <div className={`${styles.side} ${styles.rightSide}`}>
          <IconButton aria-label="Mail" className={[styles.IconButton, activeAlerts.includes('Mail') ? styles.Active : ''].join(' ')} onClick={() => click(AlertShadeState.Mail)}>
            <SvgIcon
              className={styles.Icon}
              component={MailIcon}
              viewBox="0 0 24 24"
            />
          </IconButton>
          <IconButton aria-label="Message" className={[styles.IconButton, activeAlerts.includes('Message') ? styles.Active : ''].join(' ')} onClick={() => click(AlertShadeState.Message)}>
            <SvgIcon
              className={styles.Icon}
              component={MessageIcon}
              viewBox="0 0 24 24"
            />
          </IconButton>
          <IconButton aria-label="Alerts" className={[styles.IconButton, activeAlerts.includes('Alert') ? styles.Active : ''].join(' ')} onClick={() => click(AlertShadeState.Notification)}>
            <SvgIcon
              className={styles.Icon}
              component={NotificationsIcon}
              viewBox="0 0 24 24"
            />
          </IconButton>
          <IconButton aria-label="Profile" className={styles.IconButton} onClick={() => click(AlertShadeState.Profile)}>
            <picture className={styles.Icon}>
              <img
                src={
                  'https://durham.elearningontario.ca/d2l/api/lp/1.32/profile/myProfile/image'
                }
              />
            </picture>
          </IconButton>
          <div className={[ styles.alertArea, alertState == AlertShadeState.Closed ? '' : styles.open ].join(' ')}>
            {alertContent}
          </div>
        </div>
      </ClickAwayListener>
    </nav>
  );
};

export default NavBar;
