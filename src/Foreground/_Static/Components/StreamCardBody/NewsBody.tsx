import styles from '../../css/Components/StreamCardBody/NewsBody.module.scss';

import { type RichText } from '../../Classes/BrightSpaceApi';
// Loader Function
interface Props {
  Content: RichText;
}
const NewsBody = ({ Content }: Props) => {
  // TODO: Parse the html to react, apply better coloring that works with our dark colors
  return (
    <div
      className={styles.markDown}
      dangerouslySetInnerHTML={{ __html: Content.html || Content.text }}
    ></div>
  );
};

export default NewsBody;
