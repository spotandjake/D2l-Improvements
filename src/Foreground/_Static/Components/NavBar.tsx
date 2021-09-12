import styles from '../css/Components/NavBar.module.scss';
// Import Components
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import MenuIcon from '@material-ui/icons/Menu';
import MailIcon from '@material-ui/icons/Mail';
import MessageIcon from '@material-ui/icons/Message';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Brightspace from '../Classes/Brightspace';
interface props {
  brightSpace: Brightspace;
}
// Loader Function
// TODO: add watcher for notifications
// TODO: add toggle for notification viewers
// TODO: add fetch for account profile picture
// TODO: add search
// TODO: make aside button work
const NavBar = ({ brightSpace }: props) => {
  return (
    <section className={styles.container}>
      <div className={`${styles.side} ${styles.leftSide}`}>
        <IconButton aria-label="aside" className={styles.IconButton}>
          <SvgIcon className={styles.Icon} component={MenuIcon} viewBox="0 0 24 24" />
        </IconButton>
      </div>
      <div className={styles.center}>
        <input className={styles.SearchBar} placeholder="Search" type="text" />
      </div>
      <div className={`${styles.side} ${styles.rightSide}`}>
        <IconButton aria-label="aside" className={styles.IconButton}>
          <SvgIcon className={styles.Icon} component={MailIcon} viewBox="0 0 24 24" />
        </IconButton>
        <IconButton aria-label="aside" className={styles.IconButton}>
          <SvgIcon className={styles.Icon} component={MessageIcon} viewBox="0 0 24 24" />
        </IconButton>
        <IconButton aria-label="aside" className={styles.IconButton}>
          <SvgIcon className={styles.Icon} component={NotificationsIcon} viewBox="0 0 24 24" />
        </IconButton>
        <IconButton aria-label="aside" className={styles.IconButton}>
          <SvgIcon className={styles.Icon} component={AccountBoxIcon} viewBox="0 0 24 24" />
        </IconButton>
      </div>
    </section>
  );
};

export default NavBar;