import styles from '../../css/Components/StreamCardBody/ContentBody.module.scss';
import Loader from '../../Views/Loader';
import { useState, useEffect } from 'react';

import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
const sendToServer = async (url, server) => {
  // Get from server
  const fileResponse = await fetch(url);
  const fileBlob = await fileResponse.blob();
  // Send to server
  const fd = new FormData();
  fd.append('file', fileBlob, 'file.out');
  const postResponse = await fetch(server, {
    method: 'POST',
    cache: 'no-cache',
    body: fd,
  });
  const postData = await postResponse.json();
  return postData;
};
// Loader Function
interface Props {
  Content: string;
}
const ContentViewer = ({ Content }: Props) => {
  const [_content, setContent] = useState(<Loader />);
  useEffect(() => {
    switch (true) {
      case /docs\.google\.com/i.test(Content):
        setContent(
          <iframe
            allow="encrypted-media *;"
            width="100%"
            scrolling="no"
            src={Content}
          >
            The File Is Having Issues Being Shown
          </iframe>
        );
        break;
      case /www\.youtube\.com/i.test(Content):
        setContent(
          <object
            data={`https://www.youtube.com/embed/${new URL(
              Content
            ).searchParams.get('v')}`}
            type="application/pdf"
            width="100%"
            height="auto"
          >
            <embed
              src={`https://www.youtube.com/embed/${new URL(
                Content
              ).searchParams.get('v')}`}
              type="application/pdf"
            ></embed>
          </object>
        );
        break;
      case /\.(doc|docm|docm|docx|docx|dotx|potx|ppt|pptm|pptm|pptx|xlw|xls|xlsm|xlsm|xlsx|xltx)/i.test(
        Content
      ): {
        (async () => {
          const serverData = await sendToServer(
            Content,
            'https://filecache.spotandjake.repl.co/save'
          );
          if (serverData.status == 'Ok') {
            // Get File url
            const fileExt = Content.split('.').pop();
            const serverUrl = `https://filecache.spotandjake.repl.co/load/${serverData.id}.${fileExt}`;
            setContent(
              <DocViewer
                documents={[{ uri: serverUrl }]}
                pluginRenderers={DocViewerRenderers}
              />
            );
          } else console.log('err loading');
        })();
        break;
      }
      case /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)/i.test(
        Content
      ):
        setContent(
          <picture className={styles.contentMedia}>
            <img src={Content} />
          </picture>
        );
        break;
      case /\.(3gp|aac|flac|mpg|mpeg|mp3|mp4|m4a|m4v|m4p|oga|ogg|ogv|ogg|mov|wav|webm)/i.test(
        Content
      ):
        setContent(
          <video className={styles.contentMedia} controls>
            <source src={Content} />
            Your Browser Does Not Support The Video Type
          </video>
        );
        break;
      case /\.(pdf)/i.test(Content):
        setContent(
          <object
            data={Content}
            type="application/pdf"
            width="100%"
            height="auto"
          >
            <embed src={Content} type="application/pdf"></embed>
          </object>
        );
        break;
      case Content.startsWith('/') && /\.(html|htm)/i.test(Content):
        setContent(
          <iframe allow="encrypted-media *;" width="100%" src={Content}>
            The Page is having some trouble showing
          </iframe>
        );
        break;
      default:
        // TODO: let the user choose the renderer for future use
        console.log(
          `rendering is not yet implemented for content at url: ${Content}`
        );
        break;
    }
  }, []);
  return _content;
};
const ContentBody = ({ Content }: Props) => {
  // Render
  return (
    <div className={styles.container}>
      <ContentViewer Content={Content} />
    </div>
  );
};

export default ContentBody;
