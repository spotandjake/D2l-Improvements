import AsideTemplate from '../../templates/Aside.ejs';
const Aside = async (aside, app) => {
  const Today = new Date().valueOf();
  // Fetch Classes
  const classData = await fetch(`https://${app.orgID}.enrollments.api.brightspace.com/users/${app.uid}?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false`, {
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
    const {endDate, name} = classInfo.properties;
    return {
      name: name,
      disabled: new Date(endDate).valueOf() < Today,
      href: classInfo.links[0].href.replace(`https://${app.orgID}.folio.api.brightspace.com/organizations/', 'https://durham.elearningontario.ca/d2l/home/`) //TODO: fix this url
    };
  }));
  // Add Template
  aside.innerHTML = AsideTemplate({ classes: classes });
  // Get Elements from Aside
  const classesBtn = document.getElementById('SideBarClassesBtn');
  // const calenderBtn = document.getElementById('SideBarCalenderBtn');
  // const settingsBtn = document.getElementById('SideBarSettingsBtn');
  // Handle Button Clicks
  classesBtn.addEventListener('click', () => {
    app.setPage('HOME');
  });
};
export default Aside;
