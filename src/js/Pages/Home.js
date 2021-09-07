// Imports
import classTemplate from '../../templates/ClassCards/ClassCards.ejs';
// Data
export default async (app) => {
  const Today = new Date().valueOf();
  // Fetch Dom Elements
  const main = document.getElementById('main');
  // Fetch Classes Data
  const classData = await fetch(`https://bc59e98c-eabc-4d42-98e1-edfe93518966.enrollments.api.brightspace.com/users/${app.uid}?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false`, {
    headers: {
      authorization: `Bearer ${await app.getToken()}`
    }
  }).then(r => r.json());
  // Put on Page
  const classes = await Promise.all(classData.entities.map(async ({ href }) => {
    const _classResources = await fetch(href, {
      headers: {authorization: `Bearer ${await app.getToken()}`},
      method:'GET',
    });
    const classResources = await _classResources.json();
    const _classInfo = await fetch(classResources.links[1].href, {
      headers: {authorization: `Bearer ${await app.getToken()}`},
      method:'GET',
    });
    const classInfo = await _classInfo.json();
    // Get Image
    const _imageInfo = await fetch(classInfo.entities[2].href);
    const imageInfo = await _imageInfo.json().catch(() => 'https://durham.elearningontario.ca/d2l/img/0/Framework.UserProfileBadge.actProfileDaylight100.png?v=20.21.8.31658'); //TODO: fix this url
    // TODO: Get Teacher Info
    const {endDate, name} = classInfo.properties;
    return {
      name: name,
      disabled: new Date(endDate).valueOf() < Today,
      href: classInfo.links[0].href.replace('https://bc59e98c-eabc-4d42-98e1-edfe93518966.folio.api.brightspace.com/organizations/', 'https://durham.elearningontario.ca/d2l/home/'), //TODO: fix this url
      picture: imageInfo.links ? imageInfo.links[2].href : imageInfo, //TODO: fix this url
      teacher: {
        name: 'TODO', //TODO: fix this url
        picture: 'https://durham.elearningontario.ca/d2l/img/0/Framework.UserProfileBadge.actProfileDaylight100.png?v=20.21.8.31658', //TODO: fix this url
      }
    };
  }));
  main.innerHTML = classTemplate({ classes: classes });
  // OnClick Function
  const cancelFunction = (elm) => {
    window.location.href = elm.getAttribute('class_link');
  };
  // Determine OnClick
  [...main.querySelector('#ClassContainer').children].forEach((elm) => {
    if (elm.getAttribute('disabled') == '') return;
    elm.addEventListener('click', () => cancelFunction(elm));
  });
  // Return Our Cancel Function
  return () => {
    [...main.querySelector('#ClassContainer').children].forEach((elm) => {
      elm.removeEventListener('click', () => cancelFunction(elm));
    });
  };
};