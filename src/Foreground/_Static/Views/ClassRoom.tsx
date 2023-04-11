import styles from '../css/Views/ClassRoom.module.scss';
// Types
import {
  ContentObject,
  ContentType,
  ObjectListPage,
  UserProgressData,
  Module,
  Topic,
} from '../Classes/BrightspaceTypes';
import { StreamType, CompletionType } from '../Classes/Types';
import { useParams } from 'react-router-dom';
// Imports
import Fuse from 'fuse.js';
// Components
import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import IdleTimer from 'react-idle-timer';
import ClassHeader from '../Components/ClassHeader';
import StreamCard from '../Components/StreamCard';
import StreamChip from '../Components/StreamChip';
import Brightspace, { type RichText }  from '../Classes/BrightSpaceApi';
interface props {
  brightSpace: Brightspace;
  searchValue: string;
}
interface StreamItem {
  date: number;
  title: string;
  body: string | RichText;
  elm: JSX.Element;
}
// Loader Function
const ClassRoom = ({ brightSpace, searchValue }: props) => {
  const [_refreshRate, setRefreshRate] = useState(1000 * 30);
  const [_streamContent, setStreamContent] = useState(undefined);
  const [_headerContent, setHeaderContent] = useState(<Loader />);
  const { classID } = useParams();
  brightSpace.setClassID(classID);
  // TODO: Rewrite this using the new api
  // Fetch the classList
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const fetchStreamData = async () => {
      // Stream
      const stream: StreamItem[] = [];
      // fetch News
      const streamNews = await brightSpace.getClassNews();
      for (const newsItem of streamNews) {
        stream.push({
          date: new Date(newsItem.startDate).getTime(),
          title: newsItem.title,
          body: newsItem.body.text || newsItem.body.html,
          elm: (
            <StreamCard
              key={newsItem.itemID}
              Id={newsItem.itemID}
              Title={newsItem.title}
              Progress={CompletionType.Complete}
              Category={StreamType.News}
              StartDate={newsItem.startDate}
              Content={newsItem.body}
            />
          ),
        });
      }
      // Fetch Content
      // TODO: Figure out how to make this run faster
      // TODO: We want to fetch smaller lists and make use of the next feature.
      //@ts-ignore
      const readModules: ObjectListPage<UserProgressData> =
        await brightSpace._fetch(
          `/d2l/api/le/unstable/${brightSpace.getClassID()}/content/userprogress/?pageSize=99999`
        );
      const parseContent = async (
        content: (ContentObject | Module | Topic)[]
      ) => {
        const _contentItems: Topic[] = [];
        await Promise.all(
          content.map(async (contentElement) => {
            switch (contentElement.Type) {
              case ContentType.Module: {
                // Module
                //@ts-ignore
                const moduleContent: (Module | Topic)[] =
                  await brightSpace._fetch(
                    `/d2l/api/le/${
                      (
                        await brightSpace.getVersions()
                      ).le
                    }/${brightSpace.getClassID()}/content/modules/${
                      contentElement.Id
                    }/structure/`
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
      //@ts-ignore
      const rootContent: ContentObject[] = await brightSpace._fetch(
        `/d2l/api/le/${
          (
            await brightSpace.getVersions()
          ).le
        }/${brightSpace.getClassID()}/content/root/`
      );
      const contentStream = await parseContent(rootContent);
      for (const contentItem of contentStream) {
        stream.push({
          title: contentItem.Title,
          body: '',
          date: new Date(contentItem.LastModifiedDate).getTime(),
          elm: (
            <StreamCard
              key={contentItem.Id}
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
            />
          ),
        });
      }
      // TODO: Fetch Discussions
      // TODO: Fetch Assignments
      // TODO: Fetch Quizzes
      // Set Page Content
      setStreamContent(stream.sort((a, b) => b.date - a.date));
      timeout = setTimeout(fetchStreamData, _refreshRate);
    };
    (async () => {
      // Fetch Stuff For Header
      //@ts-ignore
      const { properties, entities } = await brightSpace._fetch(
        `https://bc59e98c-eabc-4d42-98e1-edfe93518966.organizations.api.brightspace.com/${brightSpace.getClassID()}`
      );
      const imageInfo = await window
        .fetch(entities[2].href)
        .then((res) => res.json())
        .catch(async () => {
          return await brightSpace
            ._fetch(entities[2].href)
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
      fetchStreamData();
    })();
    return () => clearTimeout(timeout);
  }, [classID]);
  // Render the classes
  return (
    <section className={styles.container}>
      {/* Idle Timer */}
      <IdleTimer
        timeout={1000 * 30}
        onActive={() => setRefreshRate(1000 * 30)}
        onIdle={() => setRefreshRate(1000 * 60 * 15)}
        debounce={250}
      />
      {/* Page Content */}
      <section className={styles.content}>
        {/* Class Heading */}
        {_headerContent}
        {/* ClassStream */}
        <section className={styles.stream}>
          <input
            type="checkbox"
            id={`${StreamType.News}-ExpandState`}
            defaultChecked={true}
          />
          <input
            type="checkbox"
            id={`${StreamType.Content}-ExpandState`}
            defaultChecked={true}
          />
          <input
            type="checkbox"
            id={`${StreamType.Discussions}-ExpandState`}
            defaultChecked={true}
          />
          <input
            type="checkbox"
            id={`${StreamType.Assignments}-ExpandState`}
            defaultChecked={true}
          />
          <input
            type="checkbox"
            id={`${StreamType.Quizzes}-ExpandState`}
            defaultChecked={true}
          />
          {/* Class Filter Chips */}
          <div className={styles.chipContainer}>
            <StreamChip Type={StreamType.News} />
            <StreamChip Type={StreamType.Content} />
            <StreamChip Type={StreamType.Discussions} />
            <StreamChip Type={StreamType.Assignments} />
            <StreamChip Type={StreamType.Quizzes} />
          </div>
          {/* Stream Content */}
          {(() => {
            if (_streamContent == undefined) return <Loader />;

            const content = _streamContent;
            // Filter
            if (searchValue != '') {
              const fuse = new Fuse<StreamItem>(_streamContent, {
                includeScore: true,
                findAllMatches: true,
                shouldSort: true,
                useExtendedSearch: true,
                // Search in `author` and in `tags` array
                keys: ['title', 'body'],
              });
              const result = fuse.search(searchValue);
              return <>{result.map((a) => a.item.elm)}</>;
            } else return <>{content.map((a) => a.elm)}</>;
          })()}
        </section>
      </section>
    </section>
  );
};

export default ClassRoom;
