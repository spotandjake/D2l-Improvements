import styles from '../css/Views/ClassRoom.module.scss';
// Types
import { NewsItem } from '../Classes/BrightspaceTypes';
import { StreamType } from '../Classes/Types';
// Components
import React, { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import ClassHeader from '../Components/ClassHeader';
import StreamCard from '../Components/StreamCard';
import Brightspace from '../Classes/Brightspace';
interface props {
  brightSpace: Brightspace;
  Route: Function;
  ClassId: string;
}
// Loader Function
const ClassRoom = ({ brightSpace, Route, ClassId }: props) => {
  const [_classContent, setClassContent] = useState(<></>);
  // Fetch the classList
  useEffect(() => {
    (async () => {
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
      // Stream
      const stream: JSX.Element[] = [];
      // TODO: fetch
      const streamNews: NewsItem[] = await brightSpace._fetch(
        `/api/le/${brightSpace.version.le}/${ClassId}/news/`
      );
      console.log(streamNews);
      streamNews.forEach((newsItem: NewsItem) => {
        stream.push(
          <StreamCard
            Id={newsItem.Id}
            Title={newsItem.Title}
            Category={StreamType.News}
            StartDate={newsItem.StartDate}
            Content={newsItem.Body}
            Route={Route}
          />
        );
      });
      // Set Page Content
      setClassContent(
        <section className={styles.content}>
          {/* Class Heading */}
          <ClassHeader
            Name={properties.name}
            Picture={imageInfo.links ? imageInfo.links[2].href : imageInfo}
            StartDate={properties.startDate}
          />
          {/* TODO: Class Filter Chips */}
          {/* TODO: ClassStream */}
          <section className={styles.stream}>{stream}</section>
        </section>
      );
    })();
  }, []);
  // Render the classes
  return (
    <section className={styles.container}>
      {/* NavBar */}
      <NavBar brightSpace={brightSpace} />
      {/* Page Content */}
      {_classContent}
    </section>
  );
};

export default ClassRoom;
