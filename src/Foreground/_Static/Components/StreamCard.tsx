import React, { useState } from 'react';
import styles from '../css/Components/StreamCard.module.scss';

import SvgIcon from '@material-ui/core/SvgIcon';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ClassRoundedIcon from '@material-ui/icons/ClassRounded';
import Loader from '../Views/Loader';
// Types
import { StreamType, CompletionType } from '../Classes/Types';
import { RichText } from '../Classes/BrightspaceTypes';
// Loader Function
interface ClassCardProps {
  Id: number;
  Title: string;
  Progress: CompletionType;
  Category: StreamType;
  StartDate: string;
  Content: RichText | string;
  Route: Function;
}
const ClassCard = ({
  Id,
  Title,
  Progress,
  Category,
  StartDate,
  Content,
}: ClassCardProps) => {
  let firstOpen = true;
  const [_cardOpen, setCardOpen] = useState(false);
  const [_cardContent, setCardContent] = useState(<Loader />);
  const ContentIcon = {
    [StreamType.News]: AccountCircleIcon,
    [StreamType.Content]: ClassRoundedIcon,
  }[Category];
  const click = () => {
    if (!_cardOpen && firstOpen) {
      setCardOpen(true);
      firstOpen = false;
      // InnerContent
      let content: JSX.Element | null;
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
        case StreamType.Content: {
          const _content = Content as string;
          switch (true) {
            case /docs\.google\.com/i.test(_content):
              content = (
                <iframe
                  allow="encrypted-media *;"
                  width="100%"
                  scrolling="no"
                  src={_content}
                >
                  The File Is Having Issues Being Shown
                </iframe>
              );
              break;
            case /www\.youtube\.com/i.test(_content):
              content = (
                <object
                  data={`https://www.youtube.com/embed/${new URL(
                    _content
                  ).searchParams.get('v')}`}
                  type="application/pdf"
                  width="100%"
                  height="auto"
                >
                  <embed
                    src={`https://www.youtube.com/embed/${new URL(
                      _content
                    ).searchParams.get('v')}`}
                    type="application/pdf"
                  ></embed>
                </object>
              );
              break;
            case /\.(doc|docm|docm|docx|docx|dotx|potx|ppt|pptm|pptm|pptx|xlw|xls|xlsm|xlsm|xlsx|xltx)/i.test(
              _content
            ):
              // TODO: make a custom renderer for these
              // Check the office extension is supported
              if (
                navigator.mimeTypes == undefined ||
                (navigator?.mimeTypes['application/x-nacl'] !== undefined &&
                  [...(navigator?.plugins || [{ filename: '' }])].some(
                    ({ filename }) =>
                      filename == 'gbkeegbaiigmenfmjfclcdgdpimamgkj'
                  ))
              ) {
                // Use the file viewer
                content = (
                  <iframe
                    allow="encrypted-media *;"
                    width="100%"
                    scrolling="no"
                    src={_content}
                  >
                    The File Is Having Issues Being Shown
                  </iframe>
                );
              } else {
                // TODO: Support this
                // Use an alternative rendering method
                // console.log('Office Viewer Unsupported');
              }
              break;
            case /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)/i.test(
              _content
            ): {
              // TODO: onError find another way to get ahold of the image
              content = (
                <picture className={styles.contentMedia}>
                  <img src={_content} />
                </picture>
              );
              break;
            }
            case /\.(3gp|aac|flac|mpg|mpeg|mp3|mp4|m4a|m4v|m4p|oga|ogg|ogv|ogg|mov|wav|webm)/i.test(
              _content
            ): {
              // TODO: onError find another way to get ahold of the image
              content = (
                <video className={styles.contentMedia} controls>
                  <source src={_content} />
                  Your Browser Does Not Support The Video Type
                </video>
              );
              break;
            }
            case /\.(pdf)/i.test(_content):
              content = (
                <object
                  data={_content}
                  type="application/pdf"
                  width="100%"
                  height="auto"
                >
                  <embed src={_content} type="application/pdf"></embed>
                </object>
              );
              break;
            case _content.startsWith('/') && /\.(html|htm)/i.test(_content):
              content = (
                <iframe allow="encrypted-media *;" width="100%" src={_content}>
                  The Page is having some trouble showing
                </iframe>
              );
              break;
            default:
              // TODO: let the user choose the renderer for future use
              console.log(
                `rendering is not yet implemented for content at url: ${_content}`
              );
              break;
          }
          break;
        }
        default:
          console.log(
            `Viewing For Category ${Category} is not yet implemented`
          );
      }
      // Set Content
      if (content) {
        setCardContent(<>{content}</>);
      }
    } else if (!_cardOpen) setCardOpen(true);
    else setCardOpen(false);
  };
  return (
    <div className={styles.container} key={Id} id={Id.toString()}>
      <div className={styles.titleBlock} onClick={() => click()}>
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
      </div>
      <div
        className={[styles.cardBody, _cardOpen ? styles.visible : ''].join(' ')}
      >
        {_cardContent}
      </div>
    </div>
  );
};
export default ClassCard;
