import React, { useState } from 'react';
import styles from '../css/Components/StreamCard.module.scss';

import SvgIcon from '@material-ui/core/SvgIcon';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
// Types
import { StreamType } from '../Classes/Types';
import { RichText } from '../Classes/BrightspaceTypes';
// Loader Function
interface ClassCardProps {
  Id: number;
  Title: string;
  Category: StreamType;
  StartDate: string;
  Content: RichText;
  Route: Function;
}
const ClassCard = ({
  Id,
  Title,
  Category,
  StartDate,
  Content,
}: ClassCardProps) => {
  const [_cardOpen, setCardOpen] = useState(false);
  const [_cardContent, setCardContent] = useState(<></>);
  const ContentIcon = {
    [StreamType.News]: AccountCircleIcon,
  }[Category];
  const click = () => {
    if (!_cardOpen) {
      // InnerContent
      let content: JSX.Element = <></>;
      switch (Category) {
        case StreamType.News:
          content = (
            <div
              dangerouslySetInnerHTML={{
                __html:
                  (Content as RichText)?.Html || (Content as RichText).Text,
              }}
              className={styles.Markdown}
            ></div>
          );
          break;
        default:
          alert(`Viewing For Category ${Category} is not yet implemented`);
      }
      // Set Content
      setCardContent(<div className={styles.cardBody}>{content}</div>);
      setCardOpen(true);
    } else {
      setCardContent(<></>);
      setCardOpen(false);
    }
  };
  return (
    <div className={styles.container} key={Id}>
      <div className={styles.titleBlock} onClick={() => click()}>
        <div className={styles.titleIcon}>
          <SvgIcon
            className={styles.Icon}
            component={ContentIcon}
            viewBox="0 0 24 24"
          />
        </div>
        <div className={styles.titleText}>
          <h2>{Title}</h2>
          <h5>{new Date(StartDate).toDateString()}</h5>
        </div>
      </div>
      <div className={styles.cardBody}>{_cardContent}</div>
    </div>
  );
};

export default ClassCard;
