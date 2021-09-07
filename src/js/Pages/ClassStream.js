// Imports
import pageTemplate from '../../templates/Pages/ClassStream.ejs';
import cardTemplate from '../../templates/Stream-Card.ejs';
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
  console.log(assignments);
  // Fetch Quizzes
  // Sort All Items by date
  // Return All Items
  return items.sort((a, b) => b.date - a.date).map((e) => e.element).join('\n');
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
  const html = await fetchStream(app);
  // Call Are Calender Widget
  main.innerHTML = pageTemplate({ announcements: html, classData: classData });
  // Click Function
  const clickFunction = (elm) => {
    if (elm.classList.contains('Active')) elm.classList.remove('Active');
    else elm.classList.add('Active');
  };
  // Add Our Listeners
  [...main.querySelector('section.StreamCards').children].forEach((elm) => {
    elm.addEventListener('click', () => clickFunction(elm));
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