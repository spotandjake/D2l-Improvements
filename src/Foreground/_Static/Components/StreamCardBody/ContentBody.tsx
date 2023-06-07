import styles from '../../css/Components/StreamCardBody/ContentBody.module.scss';
import Loader from '../../Views/Loader';
import { useState, useEffect } from 'react';

import { type UploadResult, getStorage, ref, uploadBytes } from 'firebase/storage';
import BrightSpace from '../../Classes/BrightSpaceApi';

import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

const sendToServer = async (url: string, orgID: string) => {
  const fileExt = url.split('.').pop();
  // Get from server
  const fileResponse = await fetch(url);
  const fileBlob = await fileResponse.blob();
  // Generate Random Name
  const fileName = Math.floor(Math.random() * Date.now()).toString(16);
  // Send To Server
  const storage = getStorage();
  const storageRef = ref(storage, `/D2lServer/${orgID}/${fileName}.${fileExt}`);

  // Raw string is the default if no format is provided
  const snapshot: UploadResult | undefined = await uploadBytes(
    storageRef,
    fileBlob
  ).catch(() => undefined);
  if (snapshot == undefined) {
    console.log('Error Uploading Content File');
    return {
      sucess: false,
      url: ''
    };
  }
  // Send to server
  return {
    sucess: true,
    url: `https://storage.googleapis.com/united-rope-234818.appspot.com/D2lServer/${orgID}/${fileName}.${fileExt}`,
  };
};
// Loader Function
interface Props {
  brightSpace: BrightSpace;
  Content: string;
}
const ContentViewer = ({ Content, brightSpace }: Props) => {
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
            brightSpace.getClassID()
          );
          if (serverData.sucess) {
            // Get File url
            setContent(
              <DocViewer
                documents={[{ uri: serverData.url }]}
                pluginRenderers={DocViewerRenderers}
              />
            );
          } else console.log('err loading');
          // TODO: If we fail set the content to a failure message, and maybe try again
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
const ContentBody = ({ Content, brightSpace }: Props) => {
  // Render
  return (
    <div className={styles.container}>
      <ContentViewer Content={Content} brightSpace={brightSpace} />
    </div>
  );
};

export default ContentBody;
