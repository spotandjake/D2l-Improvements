// Imports
import pageTemplate from '../../templates/Pages/ClassStream.ejs';
import cardTemplate from '../../templates/Stream-Card.ejs';
import uploadedFileTemplate from '../../templates/UploadedFile.ejs';
import Picker from '../libs/googlePicker.js';
// Fetch Announcement Helper
const fetchStream = async (app) => {
  const items = []; // Convert from a list of html strings to a list of html strings with dates
  // Map Main News Content
  const _stream = await fetch(`/d2l/api/le/${app.apiVersion.le}/${app.cid}/news/`);
  const stream = await _stream.json();
  stream.forEach((elm) => {
    elm.StartDate = new Date(elm.StartDate).toDateString();
    elm.Category = 'ChipFilterHome';
    elm.type = 'Info';
    items.push({
      date: new Date(elm.StartDate).valueOf(),
      element: cardTemplate({ ...elm, CompletionType: 'OnSubmission' })
    });
  });
  // Fetch Content
  const _readModules = await fetch(`/d2l/api/le/unstable/${app.cid}/content/userprogress/?pageSize=99999`);
  const readModules = await _readModules.json();
  const parseContent = async (content) => {
    const _contentItems = [];
    await Promise.all(content.map(async (contentElement) => {
      switch (contentElement.Type) {
        case 1: // Topic
          _contentItems.push({
            ...contentElement,
            isRead: readModules.Objects.some((elm) => elm.ObjectId == contentElement.Id && elm.IsRead)
          });
          break;
        case 0: { // Module
          const _moduleContent = await fetch(`/d2l/api/le/${app.apiVersion.le}/${app.cid}/content/modules/${contentElement.Id}/structure/`);
          const moduleContent = await _moduleContent.json();
          _contentItems.push(...(await parseContent(moduleContent)));
          break;
        }
      }
    }));
    return _contentItems;
  };
  const _rootContent = await fetch(`/d2l/api/le/${app.apiVersion.le}/${app.cid}/content/root/`);
  const rootContent = await _rootContent.json();
  const contentStream = await parseContent(rootContent);
  for (const elm of contentStream) {
    let _url = elm.ActivityType == 1 ? `${window.location.origin}${elm.Url}` : elm.Url; // TODO: Improve Previewer
    items.push({
      date: new Date(elm.LastModifiedDate).valueOf(), // TODO: Preferably get the date it was shown
      element: cardTemplate({
        Id: elm.Id,
        Category: 'ChipFilterContent',
        type: 'Content',
        Title: elm.Title,
        CompletionType: elm.isRead ? 'OnSubmission' : 'Unread',
        StartDate: new Date(elm.LastModifiedDate).toDateString(),
        Body: {
          Html: `<a href="${_url}">Download</a>`
        },
        _url: _url
      })
    });
  }
  // Fetch discussions
  // Fetch Assignments
  const _assignments = await fetch(`/d2l/api/le/${app.apiVersion.le}/${app.cid}/dropbox/folders/`);
  const assignments = await _assignments.json();
  assignments.forEach((elm) => {
    items.push({
      date: new Date(elm.DueDate).valueOf(),
      element: cardTemplate({
        Id: elm.Id,
        Category: 'ChipFilterAssignments',
        type: 'Assignment',
        Title: elm.Name,
        CompletionType: [ 'OnSubmission', 'DueDate', 'OnSubmission', 'OnSubmission'][elm.CompletionType],
        StartDate: new Date(elm.DueDate).toDateString(),
        Body: { Html: '' }
      })
    });
  });
  // Fetch Quizzes
  const _quizzes = await fetch(`/d2l/api/le/${app.apiVersion.le}/${app.cid}/quizzes/`);
  const quizzes = await _quizzes.json();
  for (const quiz of quizzes.Objects) {
    items.push({
      date: new Date(quiz.DueDate).valueOf(),
      element: cardTemplate({
        Id: quiz.QuizId,
        Category: 'ChipFilterQuizzes',
        type: 'Quiz',
        Title: quiz.Name,
        CompletionType: 'OnSubmission',
        StartDate: new Date(quiz.DueDate).toDateString(),
        Body: {
          Html: quiz.Description.Text.Html
        },
        _url: `/d2l/lms/quizzing/user/quiz_summary.d2l?qi=${quiz.QuizId}&ou=${app.cid}`
      })
    });
  }
  // Sort All Items by date
  // Return All Items
  return {
    html: items.sort((a, b) => b.date - a.date).map((e) => e.element).join('\n'), 
    assignments: assignments,
    content: contentStream
  };
};
// Data
export default async (app) => {
  // Fetch Dom Elements
  const main = document.getElementById('main');
  // Fetch Class Data
  const _classInfo = await fetch(`${app.organizationURL}${app.cid}`, {
    headers: {
      Accept: 'application/vnd.siren+json',
      authorization: `Bearer ${await app.getToken()}`
    }
  });
  const classInfo = await _classInfo.json();
  // Get Image
  const _imageInfo = await fetch(classInfo.entities[2].href);
  const imageInfo = await _imageInfo.json().catch(() => 'https://durham.elearningontario.ca/d2l/img/0/Framework.UserProfileBadge.actProfileDaylight100.png?v=20.21.8.31658');
  // TODO: Get Teacher Info
  const classData = {
    name: classInfo.properties.name,
    description: classInfo.properties.description,
    picture: imageInfo.links ? imageInfo.links[2].href : imageInfo,
    teacher: {
      name: 'TODO',
      picture: 'https://durham.elearningontario.ca/d2l/img/0/Framework.UserProfileBadge.actProfileDaylight100.png?v=20.21.8.31658',
    }
  };
  // Fetch Stream Data
  const { html, assignments } = await fetchStream(app);
  // Call Are Calender Widget
  main.innerHTML = pageTemplate({ announcements: html, classData: classData });
  // Click Function
  const clickFunction = async (elm) => {
    if (elm.classList.contains('Active')) elm.classList.remove('Active');
    else {
      elm.classList.add('Active');
      // Add Our Content Read Update
      const catagory = elm.getAttribute('Category');
      if (catagory == 'ChipFilterContent') {
        if (elm.querySelector('.StreamCardIcon').classList.contains('Unread')) {
          await fetch(`/d2l/api/le/unstable/${app.cid}/content/topics/${elm.id}/view`, {
            headers: {
              authorization: `Bearer ${await app.getToken()}`
            },
            method: 'POST'
          });
          elm.querySelector('.StreamCardIcon').classList.remove('Unread');
          elm.querySelector('.StreamCardIcon').classList.add('OnSubmission');
        }
        elm.classList.add('Active');
        // Content
        let _url = elm.getAttribute('_url');
        let html = `<a href="${_url}">Download</a>`;
        if (/\.(docx|jpg|mp4|pdf|png|gif|doc)$/.test(_url) || /docs\.google\.com/.test(_url)) {
          if (/\.(jpg)/.test(_url)) {
            html = `<img width="100%" src="/d2l/api/le/${app.apiVersion.le}/${app.cid}/content/topics/${elm.id}/file?stream=true">`;
          } else if (/\.(mp4)/.test(_url)) {
            html = `
            <video width="100%" height="auto" controls="">
              <source src="${_url}">
              Your browser does not support the video tag.
            </video>`;
          } else {
            const _fileData = await fetch(`/d2l/le/content/${app.cid}/topics/files/download/${elm.id}/DirectFileTopicDownload`)
            html = `<iframe class="StreamIframe" allow="encrypted-media *;" width="100%" scrolling="no" src="${URL.createObjectURL(await _fileData.blob())}">${html}</iframe>`;
          }
        }
        elm.querySelector('.StreamCardBody').innerHTML = html;
      }
    }
  };
  // Add Our Listeners
  const picker = new Picker(
    'AIzaSyCVB1GYyFHjovliBp1mphU7bJIldMu-Xaw',
    '624818190747-mufqrqsbd9ggra85p5k7binndne89o6c.apps.googleusercontent.com',
    'united-rope-234818',
    [
      'https://www.googleapis.com/auth/drive', //TODO be more specific here
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.readonly'
    ],
    ''
  );
  [...main.querySelector('section.StreamCards').children].forEach((elm) => {
    elm.addEventListener('click', () => clickFunction(elm));
    elm.querySelector('.StreamCardBody').addEventListener('click', (e) => e.stopPropagation());
    // Add Our Listeners For Our Assignments Buttons
    if (elm.getAttribute('Category') == 'ChipFilterAssignments') {
      // TODO: Mark View
      // TODO: View Old Submissions
      // TODO: allow viewing of related work and rubric
      elm.querySelector('.FileFormAdd').addEventListener('click', (e) => {
        const assignment = assignments.find((project) => project.Id == elm.id);
        console.log(assignment);
        picker.show((data) => {
          if (data.action == 'picked') {
            const uploadedFiles = elm.querySelector('.UploadedFiles');
            data.docs.forEach(async (doc) => {
              uploadedFiles.insertAdjacentHTML(
                'beforeend',
                uploadedFileTemplate({
                  name: doc.name,
                  href: doc.url,
                  thumbnail: doc.thumbnail,
                  documentId: doc.id
                })
              );
            });
          }
        });
      });
      elm.querySelector('.FileFormSubmit').addEventListener('click', async (e) => {
        // Loop Over All Submitted Files
        const uploadedFiles = await Promise.all(
          [...elm.querySelector('.UploadedFiles').children].map(async (_file) => {
            const fileId = _file.getAttribute('documentid');
            return await picker.export(fileId);
          })
        );
        const Description = elm.querySelector('.FileFormDescription').value;
        elm.querySelector('.UploadedFiles').innerHTML = '';
        elm.querySelector('.FileFormDescription').value = '';
        // TODO: Submit files, convert file to correct format
        const submissionBody = {
          files: uploadedFiles,
          description: Description
        };
        console.log(submissionBody);
        alert('Submitted');
      });
    }
  });
  // Handle Our Filters
  const filterParent = document.getElementById('ChipFilters');
  const filteredRegion = document.querySelector('.Filter');
  const filterCards = (elm) => {
    elm.classList.toggle('Active', !elm.classList.contains('Active'));
    const chips = [...filterParent.querySelectorAll('.ChipFilter')];
    [...filteredRegion.children].forEach((elm) => elm.classList.toggle('Filtered', !chips.some((chip) => chip.classList.contains('Active') && chip.id == elm.getAttribute('Category'))));
  };
  [...filterParent.children].forEach((elm) => {
    elm.addEventListener('click', () => filterCards(elm));
  });
  // Return Our Cancel Function
  return () => {
    [...main.querySelector('section.StreamCards').children].forEach((elm) => {
      elm.removeEventListener('click', () => clickFunction(elm));
    });
    [...filterParent.children].forEach((elm) => {
      elm.removeEventListener('click', () => filterCards(elm));
    });
  };
};