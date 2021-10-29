// Imports
import classTemplate from '../../templates/ClassCards/ClassCards.ejs';
// Data
export default async (app) => {
  const Today = new Date().valueOf();
  // Fetch Dom Elements
  const main = document.getElementById('main');
  // Fetch Classes Data
  const classData = await fetch(
    `https://${app.orgID}.enrollments.api.brightspace.com/users/${app.uid}?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false`,
    {
      headers: {
        authorization: `Bearer ${await app.getToken()}`,
      },
    }
  ).then((r) => r.json());
  // Put on Page
  const classes = await Promise.all(
    classData.entities.map(async ({ href }) => {
      const _classResources = await fetch(href, {
        headers: { authorization: `Bearer ${await app.getToken()}` }
      });
      const classResources = await _classResources.json();
      const _classInfo = await fetch(classResources.links[1].href, {
        headers: { authorization: `Bearer ${await app.getToken()}` }
      });
      const classInfo = await _classInfo.json();
      // Get Image
      const imageInfo = await fetch(classInfo.entities[2].href)
        .then((res) => res.json())
        .catch(async () => {
          return await fetch(classInfo.entities[2].href, {
            headers: {
              authorization: `Bearer ${await app.getToken()}`,
            },
          })
            .then((res) => res.json())
            .catch(
              () =>
                'https://blog.fluidui.com/content/images/2019/01/imageedit_1_9273372713.png'
            );
        });
      // TODO: Get Teacher Info
      const { endDate, name } = classInfo.properties;
      return {
        name: name,
        disabled: new Date(endDate).valueOf() < Today,
        href: classInfo.links[0].href.replace(
          `https://${app.orgID}.folio.api.brightspace.com/organizations/`,
          'https://durham.elearningontario.ca/d2l/home/'
        ), //TODO: fix this url
        picture: imageInfo.links ? imageInfo.links[2].href : imageInfo,
        Text: `Closes | ${new Date(endDate).toDateString()}`,
      };
    })
  );
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
