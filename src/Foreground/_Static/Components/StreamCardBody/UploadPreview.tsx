import styles from '../../css/Components/StreamCardBody/UploadPreview.module.scss';
import Image from 'next/image';
// Loader Function
interface Props {
  id: string;
  name: string;
  iconUrl: string;
  removeSelf: (id: string) => void;
}
const UploadPreview = ({ id, name, iconUrl, removeSelf }: Props) => {
  return (
    <div className={styles.container} onClick={() => removeSelf(id)}>
      <Image src={iconUrl} alt="File Preview" fill />
      <span>{name}</span>
    </div>
  );
};

export default UploadPreview;
