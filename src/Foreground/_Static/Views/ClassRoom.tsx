import styles from '../css/Views/ClassRoom.module.scss';
// Types
import {
  NewsItem,
  ContentObject,
  ContentType,
  ObjectListPage,
  UserProgressData,
  Module,
  Topic,
} from '../Classes/BrightspaceTypes';
import { StreamType, CompletionType } from '../Classes/Types';
// Components
import React, { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import ClassHeader from '../Components/ClassHeader';
import StreamCard from '../Components/StreamCard';
import StreamChip from '../Components/StreamChip';
import Brightspace from '../Classes/Brightspace';
interface props {
  brightSpace: Brightspace;
  Route: Function;
  ClassId: string;
}
// Loader Function
const ClassRoom = ({ brightSpace, Route, ClassId }: props) => {
  const [_streamContent, setStreamContent] = useState(<></>);
  const [_headerContent, setHeaderContent] = useState(<></>);
  const [_filterNews, setFilterNews] = useState(true);
  const [_filterContent, setFilterContent] = useState(true);
  const [_filterDiscussions, setFilterDiscussions] = useState(true);
  const [_filterAssignments, setFilterAssignments] = useState(true);
  const [_filterQuizzes, setFilterQuizzes] = useState(true);
  // Fetch the classList
  useEffect(() => {
    const fetchStreamData = async () => {
      // Fetch Stuff For Header
      const { properties, entities } = await brightSpace._fetch(
        `https://bc59e98c-eabc-4d42-98e1-edfe93518966.organizations.api.brightspace.com/${ClassId}`,
        {
          headers: {
            authorization: `Bearer ${await brightSpace._getToken()}`,
          },
        }
      );
      const imageInfo = await window
        .fetch(entities[2].href)
        .then((res) => res.json())
        .catch(async () => {
          return await brightSpace
            ._fetch(entities[2].href, {
              headers: {
                authorization: `Bearer ${await brightSpace._getToken()}`,
              },
            })
            .catch(
              () =>
                'https://blog.fluidui.com/content/images/2019/01/imageedit_1_9273372713.png'
            );
        });
      setHeaderContent(
        <ClassHeader
          Name={properties.name}
          Picture={imageInfo.links ? imageInfo.links[2].href : imageInfo}
          StartDate={properties.startDate}
        />
      );
      // Stream
      const stream: JSX.Element[] = [];
      // fetch News
      const streamNews: NewsItem[] = await brightSpace._fetch(
        `/api/le/${brightSpace.version.le}/${ClassId}/news/`
      );
      streamNews.forEach((newsItem: NewsItem) => {
        stream.push(
          <StreamCard
            Id={newsItem.Id}
            Title={newsItem.Title}
            Progress={CompletionType.Complete}
            Category={StreamType.News}
            StartDate={newsItem.StartDate}
            Content={newsItem.Body}
            Route={Route}
          />
        );
      });
      // Fetch Content
      // TODO: Figure out how to make this run faster
      // TODO: We want to fetch smaller lists and make use of the next feature.
      const readModules: ObjectListPage<UserProgressData> =
        await brightSpace._fetch(
          `/api/le/unstable/${ClassId}/content/userprogress/?pageSize=99999`
        );
      const parseContent = async (
        content: (ContentObject | Module | Topic)[]
      ) => {
        const _contentItems: Topic[] = [];
        await Promise.all(
          content.map(async (contentElement) => {
            switch (contentElement.Type) {
              case ContentType.Module: {
                // TODO: I am pretty sure that this fetch is a little useless
                // Module
                const moduleContent: (Module | Topic)[] =
                  await brightSpace._fetch(
                    `/api/le/${brightSpace.version.le}/${ClassId}/content/modules/${contentElement.Id}/structure/`
                  );
                _contentItems.push(...(await parseContent(moduleContent)));
                break;
              }
              case ContentType.Topic: // Topic
                _contentItems.push({
                  ...contentElement,
                  Read: readModules.Objects.some(
                    (elm) => elm.ObjectId == contentElement.Id && elm.IsRead
                  ),
                });
                break;
            }
          })
        );
        return _contentItems;
      };
      const rootContent: ContentObject[] = await brightSpace._fetch(
        `/api/le/${brightSpace.version.le}/${ClassId}/content/root/`
      );
      const contentStream = await parseContent(rootContent);
      for (const contentItem of contentStream) {
        stream.push(
          <StreamCard
            Id={contentItem.Id}
            Title={contentItem.Title}
            Progress={
              [CompletionType.Unread, CompletionType.Complete][
                contentItem.Read ? 1 : 0
              ]
            }
            Category={StreamType.Content}
            StartDate={contentItem.LastModifiedDate}
            Content={contentItem.Url}
            Route={Route}
          />
        );
      }
      // TODO: Fetch Discussions
      // TODO: Fetch Assignments
      // TODO: Fetch Quizzes
      // Set Page Content
      setStreamContent(<>{stream}</>);
    };
    fetchStreamData();
    // const interval = setInterval(fetchStreamData, 10000);
    // return () => clearInterval(interval);
  }, []);
  const ToggleType = (type: StreamType) => {
    switch (type) {
      case StreamType.News:
        setFilterNews((prevState) => !prevState);
        break;
      case StreamType.Content:
        setFilterContent((prevState) => !prevState);
        break;
      case StreamType.Discussions:
        setFilterDiscussions((prevState) => !prevState);
        break;
      case StreamType.Assignments:
        setFilterAssignments((prevState) => !prevState);
        break;
      case StreamType.Quizzes:
        setFilterQuizzes((prevState) => !prevState);
        break;
    }
  };
  // Render the classes
  return (
    <section className={styles.container}>
      {/* NavBar */}
      <NavBar brightSpace={brightSpace} />
      {/* Page Content */}
      <section className={styles.content}>
        {/* Class Heading */}
        {_headerContent}
        {/* ClassStream */}
        <section className={styles.stream}>
          {/* Class Filter Chips */}
          <div className={styles.chipContainer}>
            <StreamChip
              Type={StreamType.News}
              Active={_filterNews}
              ToggleType={ToggleType}
            />
            <StreamChip
              Type={StreamType.Content}
              Active={_filterContent}
              ToggleType={ToggleType}
            />
            <StreamChip
              Type={StreamType.Discussions}
              Active={_filterDiscussions}
              ToggleType={ToggleType}
            />
            <StreamChip
              Type={StreamType.Assignments}
              Active={_filterAssignments}
              ToggleType={ToggleType}
            />
            <StreamChip
              Type={StreamType.Quizzes}
              Active={_filterQuizzes}
              ToggleType={ToggleType}
            />
          </div>
          {/* Stream Content */}
          {_streamContent?.props?.children?.filter((n) => {
            switch (n.props.Category) {
              case StreamType.News:
                return _filterNews;
              default:
                return true;
            }
          }) || <></>}
        </section>
      </section>
    </section>
  );
};

export default ClassRoom;
