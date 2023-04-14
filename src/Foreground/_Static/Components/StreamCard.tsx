import React, { useState } from 'react';
import styles from '../css/Components/StreamCard.module.scss';

import SvgIcon from '@material-ui/core/SvgIcon';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ClassRoundedIcon from '@material-ui/icons/ClassRounded';
import AssignmentRoundedIcon from '@material-ui/icons/AssignmentRounded';
import Loader from '../Views/Loader';
// Card Body Types
import NewsBody from './StreamCardBody/NewsBody';
import ContentBody from './StreamCardBody/ContentBody';
import AssignmentBody from './StreamCardBody/AssignmentBody';
// Types
import { StreamType, CompletionType } from '../Classes/Types';
import Brightspace, { type NewsItem, type AssignmentItem} from '../Classes/BrightSpaceApi';
// Loader Function
// TODO: Replace itemContent with a content item
type Body = NewsItem | AssignmentItem | { name: string, itemID: number, itemContent: string };
interface StreamCardProps {
  brightSpace: Brightspace;
  fetchStreamData: () => void;
  // TODO: use progress and StartDate off the types
  Progress: CompletionType;
  StartDate: string;
  Category: StreamType;
  Item: Body;
}
const GenerateBody = (brightSpace: Brightspace, Category: StreamType, Item: Body) => {
  switch (Category) {
    // TODO: make this type safe
    case StreamType.News:
      //@ts-ignore
      return <NewsBody Item={Item} />;
    case StreamType.Content:
      //@ts-ignore
      return <ContentBody Content={Item.itemContent} />;
    case StreamType.Assignments:
      //@ts-ignore
      return <AssignmentBody brightSpace={brightSpace} Item={Item} />;
    default:
      console.log(`Implement Viewing for Category: ${Category}`);
      console.log(Item);
      return <Loader />;
  }
};
const StreamCard = ({
  brightSpace,
  fetchStreamData,
  Progress,
  Category,
  StartDate,
  Item
}: StreamCardProps) => {
  const [currentContent, setCurrentContent] = useState(<Loader />);
  const [loaded, setLoaded] = useState(false);
  const renderBody = () => {
    if (!loaded) {
      // Handle Read
      if (Progress == CompletionType.Unread && Category == StreamType.Content) {
        brightSpace.setClassContentRead(Item.itemID);
        fetchStreamData();
      }
      // Render The Body
      setCurrentContent(GenerateBody(brightSpace, Category, Item));
      setLoaded(true);
    }
  };
  const ContentIcon = {
    [StreamType.News]: AccountCircleIcon,
    [StreamType.Content]: ClassRoundedIcon,
    [StreamType.Assignments]: AssignmentRoundedIcon,
  }[Category];
  return (
    <label
      className={[styles.container, styles[Category]].join(' ')}
      htmlFor={`${Item.itemID}-ExpandState`}
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
          <h2>{Item.name}</h2>
          <h5>{new Date(StartDate).toDateString()}</h5>
        </div>
        {Category == StreamType.Content ? (
          <a
            className={styles.inlineButton}
            onClick={(evt) => evt.stopPropagation()}
            //@ts-ignore
            href={Item.itemContent}
            download
          >
            <span>Download</span>
          </a>
        ) : (
          <></>
        )}
      </div>
      {/* Label State */}
      <input type="checkbox" id={`${Item.itemID}-ExpandState`} />
      {/* Expanded Content */}
      <div className={styles.expandContainer}>
        <hr />
        {currentContent}
      </div>
    </label>
  );
};
export default StreamCard;
