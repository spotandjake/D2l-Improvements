import React, { useState } from 'react';
import styles from '../css/Components/StreamCard.module.scss';

import SvgIcon from '@material-ui/core/SvgIcon';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ClassRoundedIcon from '@material-ui/icons/ClassRounded';
import Loader from '../Views/Loader';
// Card Body Types
import NewsBody from './StreamCardBody/NewsBody';
import ContentBody from './StreamCardBody/ContentBody';
// Types
import { StreamType, CompletionType } from '../Classes/Types';
import { type RichText } from '../Classes/BrightSpaceApi';
// Loader Function
type ContentType = RichText | string;
interface ClassCardProps {
  Id: number;
  Title: string;
  Progress: CompletionType;
  Category: StreamType;
  StartDate: string;
  Content: ContentType;
}

const GenerateBody = (Category: StreamType, content: ContentType) => {
  switch (Category) {
    case StreamType.News:
      return <NewsBody Content={content as RichText} />;
    case StreamType.Content:
      return <ContentBody Content={content as string} />;
    default:
      console.log(`Implement Viewing for Category: ${Category}`);
      console.log(content);
      return <Loader />;
  }
};
const ClassCard = ({
  Id,
  Title,
  Progress,
  Category,
  StartDate,
  Content,
}: ClassCardProps) => {
  const [currentContent, setCurrentContent] = useState(<Loader />);
  const [loaded, setLoaded] = useState(false);
  const renderBody = () => {
    if (!loaded) {
      setCurrentContent(GenerateBody(Category, Content));
      setLoaded(true);
    }
  };
  const ContentIcon = {
    [StreamType.News]: AccountCircleIcon,
    [StreamType.Content]: ClassRoundedIcon,
  }[Category];
  return (
    <label
      className={[styles.container, styles[Category]].join(' ')}
      htmlFor={`${Id}-ExpandState`}
      onClick={() => renderBody()}
    >
      {/* Content */}
      <div className={styles.titleBlock}>
        <div className={[styles.titleIcon, Progress].join(' ')}>
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
        {Category == StreamType.Content ? (
          <a
            className={styles.inlineButton}
            onClick={(evt) => evt.stopPropagation()}
            href={Content as string}
            download
          >
            <span>Download</span>
          </a>
        ) : (
          <></>
        )}
      </div>
      {/* Label State */}
      <input type="checkbox" id={`${Id}-ExpandState`} />
      {/* Expanded Content */}
      <div className={styles.expandContainer}>
        <hr />
        {currentContent}
      </div>
    </label>
  );
};
export default ClassCard;
