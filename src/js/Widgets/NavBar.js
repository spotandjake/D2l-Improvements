// Imports
import Fuse from '../libs/fuse.js';
// Import Templates
import DropDown from '../../templates/DropDown.ejs';
// Search Function
const Search = (dataSet, query, keys) => {
  const fuse = new Fuse(dataSet, {
    isCaseSensitive: false,
    includeScore: true,
    shouldSort: true,
    useExtendedSearch: true,
    ignoreLocation: true,
    keys: keys,
  });
  return fuse.search(query);
};
const parseResponse = async (response) => JSON.parse((await response.text()).trim().substr(9));
const NavBar = (navBar, app) => {
  const main = document.getElementById('main');
  const aside = document.getElementById('SideBar');
  const asideBtn = document.getElementById('AsideButtton');
  const searchBar = document.getElementById('Search');
  // const accountButton = document.getElementById('AccountButtton');
  const mailButton = document.getElementById('MailButton');
  const messageButton = document.getElementById('MessageButton');
  const notificationButton = document.getElementById('NotificationButton');
  // Generation
  // Handlers
  // Aside
  asideBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    aside.classList.add('Active');
  });
  // Search
  searchBar.addEventListener('keyup', () => {
    const children = [];
    main.querySelectorAll('.Search').forEach((item) => children.push(...item.children));
    // Gather All Data
    if (searchBar.value.trim() == '') {
      children.forEach((child) =>
        child.classList.toggle('Hidden', false)
      );
      return;
    }
    const data = children.map((child, i) => {
      const Name = child.querySelector('h1').innerText;
      const Teacher = child.querySelector('h2')?.innerText || '';
      return {
        Name: Name,
        Teacher: Teacher,
        child: child,
        id: i,
      };
    });
    const results = Search(data, searchBar.value, ['Name', 'Teacher']);
    data.forEach((child) => {
      child.child.classList.toggle(
        'Hidden',
        !results.some((result) => result.item.id == child.id && result.score < 0.5)
      );
    });
  });
  // Notification Alert
  const alertWatch = async () => {
    const response = await fetch('/d2l/activityFeed/checkForNewAlerts?isXhr=true&requestId=3&X-D2L-Session=no-keep-alive');
    const res = await parseResponse(response);
    if (res.Payload) {
      [ 'Messages', 'Grades' ].forEach((type) => {
        const active = res.Payload.includes(type);
        switch (type) {
          case 'Messages':
            mailButton.classList.toggle('Active', active);
            break;
          case 'Grades':
            notificationButton.classList.toggle('Active', active);
            break;
          default:
            alert(`Unknown Notification Type ${type}`);
        }
      });
    }
  };
  alertWatch();
  setInterval(() => alertWatch(), 5000);
  // Notification Button
  const alertDropDown = async (e, type) => {
    e.stopPropagation();
    const _dropDown = document.getElementById('DropDown');
    if (_dropDown) _dropDown.remove();
    // Spawn Dropdown
    navBar.insertAdjacentHTML('beforeend', DropDown({}));
    // Deal with the dropdown types
    switch (type) {
      case 'MailButton': {
        const response = await fetch(`https://durham.elearningontario.ca/d2l/api/lp/${app.apiVersion.lp}/alerts/user/${app.uid}`, {
          headers: {authorization: `Bearer ${await app.getToken()}`},
          method:'GET',
        });
        console.log(await response.text());
        break;
      }
      case 'MessageButton':
        break;
      case 'NotificationButton': {
        const response = await fetch(`/d2l/MiniBar/${app.cid}/ActivityFeed/GetAlertsDaylight?Category=1&_d2l_prc$headingLevel=2&_d2l_prc$scope=&_d2l_prc$hasActiveForm=false&isXhr=true&requestId=3`, {
          method: 'GET',
        });
        const res = await parseResponse(response);
        console.log(res);
        break;
      }
    }
    const dropDown = document.getElementById('DropDown');
    dropDown.addEventListener('click', (e) => e.stopPropagation());
  };
  mailButton.addEventListener('click', (e) => alertDropDown(e, 'MailButton'));
  messageButton.addEventListener('click', (e) => alertDropDown(e, 'MessageButton'));
  notificationButton.addEventListener('click', (e) => alertDropDown(e, 'NotificationButton'));
  document.addEventListener('click', () => {
    const dropDown = document.getElementById('DropDown');
    if (dropDown) dropDown.remove();
    if (aside.classList.contains('Active')) aside.classList.remove('Active');
  });
};

export default NavBar;