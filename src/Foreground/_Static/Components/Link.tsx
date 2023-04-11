import { Link as RouterLink } from 'react-router-dom';
import styles from '../css/Components/Link.module.scss';
interface LinkProps {
  Href: string;
  Active: boolean;
  children: JSX.Element[] | JSX.Element;
}
const Link = ({ Href, Active, children }: LinkProps) => {
  // TODO: Implement Active
  return (
    <div>
      <RouterLink to={Href} className={styles.linkBody}>
        {children}
      </RouterLink>
    </div>
  );
};

export default Link;
