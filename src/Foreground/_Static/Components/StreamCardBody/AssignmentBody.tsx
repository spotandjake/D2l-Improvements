import styles from '../../css/Components/StreamCardBody/AssignmentBody.module.scss';
import Brightspace, { type AssignmentItem } from '../../Classes/BrightSpaceApi';
import useDrivePicker from 'react-google-drive-picker';
import React, { useState } from 'react';
import UploadPreview from './UploadPreview';
// Loader Function
interface Props {
  brightSpace: Brightspace;
  Item: AssignmentItem;
}
// {
//   customInstructions: RichText;
//   attachments: FileBlock[];
//   assessment: {
//     scoreDenominator: number | null;
//     // TODO: Add Rubric
//   };
//   linkAttachments: Link[];
// }
async function blobToBase64Async(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onerror = (e) => reject(fileReader.error);
    fileReader.onloadend = (e) => {
      const dataUrl = fileReader.result as string;
      // remove "data:mime/type;base64," prefix from data url
      const base64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
      resolve(base64);
      // resolve(dataUrl);
    };
    fileReader.readAsDataURL(blob);
  });
}

const AssignmentBody = ({ brightSpace, Item }: Props) => {
  const [commentValue, setCommentValue] = useState('');
  const [uploads, setUploads] = useState([]);
  // Handle File Picker
  const [openPicker,authResponse] = useDrivePicker();  
  const handleOpenPicker = () => {
    openPicker({
      clientId: '624818190747-mufqrqsbd9ggra85p5k7binndne89o6c.apps.googleusercontent.com',
      developerKey: 'AIzaSyCVB1GYyFHjovliBp1mphU7bJIldMu-Xaw',
      viewId: 'DOCS',
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        if (data.action === 'cancel') return;
        if (data.docs == undefined) return;
        // Add The Docs to the list of uploads
        setUploads((oldState) => [...oldState, ...data.docs]);
      },
    });
  };
  const removeItem = (id: string) => {
    // Remove the matching element from the list
    setUploads((oldUploads) => oldUploads.filter((upload) => upload.id != id));
  };
  // Submit
  const submitFile = async () => {
    console.log(uploads);
    // Map Files
    const uploadBundle = await Promise.all(uploads.map(async (upload) => {
      // TODO: Support Google Files Through Export Based On MimeType
      // Get File
      const res = await fetch (`https://www.googleapis.com/drive/v3/files/${upload.id}?alt=media`, {
        headers: {
          'Authorization': `Bearer ${authResponse.access_token}`,
          'Content-Type': upload.mimeType,
        }
      });
      const fileBlob = await res.blob();
      // Return
      return {
        fileName: upload.name,
        fileType: upload.mimeType,
        fileContent: await fileBlob.text(),
      };
    }));
    console.log(uploadBundle);
    // Send Request
    await brightSpace.submitAssignment(Item.itemID, uploadBundle, {
      text: commentValue,
      html:  `<p>${commentValue}</p>`,
    });
    // Clear Uploads
    setUploads([]);
    // Clear Comments
    setCommentValue('');
  };
  // Render
  return (
    <div className={styles.container} onClick={(e) => e.preventDefault()}>
      <div className={styles.InstructionBox}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pretium urna sit amet placerat egestas. Fusce accumsan dictum luctus. Maecenas condimentum diam sed dapibus euismod. Ut lorem odio, laoreet nec leo a, ultricies commodo tortor. In dignissim tortor nec faucibus lobortis. Proin rutrum nunc at metus venenatis, ac lacinia ligula pharetra. Aenean eu dictum est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In mauris sapien, consectetur convallis enim nec, venenatis consequat eros. Phasellus in magna ac dui euismod aliquam a in nunc. Nam pulvinar elementum massa, a consequat massa fermentum sed. Nam luctus, ante id ultricies placerat, nisi dui elementum ante, accumsan laoreet magna nibh eu urna. Cras quis ipsum id libero fringilla laoreet ac et est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pretium urna sit amet placerat egestas. Fusce accumsan dictum luctus. Maecenas condimentum diam sed dapibus euismod. Ut lorem odio, laoreet nec leo a, ultricies commodo tortor. In dignissim tortor nec faucibus lobortis. Proin rutrum nunc at metus venenatis, ac lacinia ligula pharetra. Aenean eu dictum est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In mauris sapien, consectetur convallis enim nec, venenatis consequat eros. Phasellus in magna ac dui euismod aliquam a in nunc. Nam pulvinar elementum massa, a consequat massa fermentum sed. Nam luctus, ante id ultricies placerat, nisi dui elementum ante, accumsan laoreet magna nibh eu urna. Cras quis ipsum id libero fringilla laoreet ac et est.</div>
      <div className={styles.SubmissionBox}>
        <textarea onChange={(evt) => setCommentValue(evt.target.value)} value={commentValue}></textarea>
        <button className={styles.Button} onClick={() => submitFile()}>Submit</button>
      </div>
      <div className={styles.Submissions}>
        <div className={styles.SubmissionHeader}>Submissions:</div>
        <div className={styles.SubmissionContent}>
          {uploads.map((upload) => {
            return <UploadPreview
              id={upload.id}
              name={upload.name}
              iconUrl={upload.iconUrl}
              removeSelf={removeItem}
            />;
          })}
        </div>
        <div className={styles.SubmissionFooter}>
          <span className={styles.AddSpan}><button className={styles.Button} onClick={handleOpenPicker}>Add File</button></span>
          <span><p>Submissions: {Math.max(Item.totalFiles, 0)}</p></span>
          <span><p>Unread: {Math.max(Item.unreadFiles, 0)}</p></span>
          <span><p>Flagged: {Math.max(Item.flaggedFiles, 0)}</p></span>
        </div>
      </div>
    </div>
  );
};

export default AssignmentBody;
