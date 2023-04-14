import styles from '../../css/Components/StreamCardBody/NewsBody.module.scss';

import { type NewsItem } from '../../Classes/BrightSpaceApi';
// Loader Function
interface Props {
  Item: NewsItem;
}
const NewsBody = ({ Item }: Props) => {
  // TODO: Parse the html to react, apply better coloring that works with our dark colors
  return (
    <div
      className={styles.markDown}
      dangerouslySetInnerHTML={{ __html: Item.body.html || Item.body.text }}
    ></div>
  );
};

export default NewsBody;
