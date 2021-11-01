import styles from '../../css/Components/StreamCardBody/NewsBody.module.scss';

import { RichText } from '../../Classes/BrightspaceTypes';
// Loader Function
interface Props {
  Content: RichText
}
const NewsBody = ({ Content }: Props) => {
  // TODO: figure out the possible html and style options
  return (
    <div className={styles.markDown} dangerouslySetInnerHTML={{ __html: Content.Html || Content.Text }}></div>
  );
};

export default NewsBody;
