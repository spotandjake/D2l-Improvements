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
  // Sort All Items by date
  // Return All Items
  return {
    html: items.sort((a, b) => b.date - a.date).map((e) => e.element).join('\n'), 
    assignments: assignments
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
  const clickFunction = (elm) => {
    if (elm.classList.contains('Active')) elm.classList.remove('Active');
    else elm.classList.add('Active');
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