import styles from '../css/Components/NavBar.module.scss';
// Import Components
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import MenuIcon from '@material-ui/icons/Menu';
import MailIcon from '@material-ui/icons/MailOutlined';
import MessageIcon from '@material-ui/icons/CommentOutlined';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import Brightspace from '../Classes/Brightspace';
interface props {
  brightSpace: Brightspace;
}
// Loader Function
// TODO: add watcher for notifications
// TODO: add toggle for notification viewers
// TODO: add search
// TODO: make aside button work
const NavBar = ({ brightSpace }: props) => {
  return (
    <nav className={styles.container}>
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
      <div className={`${styles.side} ${styles.rightSide}`}>
        <IconButton aria-label="aside" className={styles.IconButton}>
          <SvgIcon
            className={styles.Icon}
            component={MailIcon}
            viewBox="0 0 24 24"
          />
        </IconButton>
        <IconButton aria-label="aside" className={styles.IconButton}>
          <SvgIcon
            className={styles.Icon}
            component={MessageIcon}
            viewBox="0 0 24 24"
          />
        </IconButton>
        <IconButton aria-label="aside" className={styles.IconButton}>
          <SvgIcon
            className={styles.Icon}
            component={NotificationsIcon}
            viewBox="0 0 24 24"
          />
        </IconButton>
        <IconButton aria-label="aside" className={styles.IconButton}>
          <picture className={styles.Icon}>
            <img
              src={
                'https://durham.elearningontario.ca/d2l/api/lp/1.32/profile/myProfile/image'
              }
            />
          </picture>
        </IconButton>
      </div>
    </nav>
  );
};

export default NavBar;
