// Import Modules
import app from './App.js';
import NavBar from './Widgets/NavBar.js';
import Aside from './Widgets/Aside.js';
// Import Templates
import head from '../templates/head.ejs';
import body from '../templates/body.ejs';
import NavTemplate from '../templates/NavBar.ejs';
// Remove the stuff as early as possible
document.head.innerHTML = `<title>${document.title}</title>`;
document.body.innerHTML = '';
// Start
const start = async () => {
  // Get Data from Page
  const data = JSON.parse(
    document.documentElement.getAttribute('data-he-context')
  );
  app.uid = localStorage.getItem('Session.UserId');
  // Cleanup Original Page
  document.head.innerHTML = head({
    title: document.title
  });
  document.body.innerHTML = body({ content: null, navBar: NavTemplate() });
  const script = document.createElement('script');
  // eslint-disable-next-line no-undef
  script.src = chrome.runtime.getURL('./client.js');
  document.body.appendChild(script);
  // NavBar
  NavBar(document.getElementById('NavBar'), app);
  // Aside
  Aside(document.getElementById('SideBar'), app);
  // Create the Page
  await app.start(data);
};
start();
