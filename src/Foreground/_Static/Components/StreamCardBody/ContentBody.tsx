import styles from '../../css/Components/StreamCardBody/ContentBody.module.scss';
import Loader from '../../Views/Loader';
// Loader Function
interface Props {
  Content: string;
}
const ContentViewer = ({ Content }: Props) => {
  switch (true) {
    case /docs\.google\.com/i.test(Content):
      return (
        <iframe
          allow="encrypted-media *;"
          width="100%"
          scrolling="no"
          src={Content}
        >
          The File Is Having Issues Being Shown
        </iframe>
      );
    case /www\.youtube\.com/i.test(Content):
      return (
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
    case /\.(doc|docm|docm|docx|docx|dotx|potx|ppt|pptm|pptm|pptx|xlw|xls|xlsm|xlsm|xlsx|xltx)/i.test(
      Content
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
        return (
          <iframe
            allow="encrypted-media *;"
            width="100%"
            scrolling="no"
            src={Content}
          >
            The File Is Having Issues Being Shown
          </iframe>
        );
      } else {
        // TODO: Support this
        // Use an alternative rendering method
        console.log('Office Viewer Unsupported');
        console.log(Content);
        return <Loader />;
      }
    case /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)/i.test(
      Content
    ): {
      // TODO: onError find another way to get ahold of the image
      return (
        <picture className={styles.contentMedia}>
          <img src={Content} />
        </picture>
      );
    }
    case /\.(3gp|aac|flac|mpg|mpeg|mp3|mp4|m4a|m4v|m4p|oga|ogg|ogv|ogg|mov|wav|webm)/i.test(
      Content
    ): {
      // TODO: onError find another way to get ahold of the image
      return (
        <video className={styles.contentMedia} controls>
          <source src={Content} />
          Your Browser Does Not Support The Video Type
        </video>
      );
    }
    case /\.(pdf)/i.test(Content):
      return (
        <object
          data={Content}
          type="application/pdf"
          width="100%"
          height="auto"
        >
          <embed src={Content} type="application/pdf"></embed>
        </object>
      );
    case Content.startsWith('/') && /\.(html|htm)/i.test(Content):
      return (
        <iframe allow="encrypted-media *;" width="100%" src={Content}>
          The Page is having some trouble showing
        </iframe>
      );
    default:
      // TODO: let the user choose the renderer for future use
      console.log(
        `rendering is not yet implemented for content at url: ${Content}`
      );
      return <Loader/>;
  }
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
