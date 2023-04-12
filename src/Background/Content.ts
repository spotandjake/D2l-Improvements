// TODO: Improve this
const a = document.createElement('script');
a.src = chrome.runtime.getURL('./Background/Inject.js');
a.onload = function () {
  //@ts-ignore
  this.remove();
};
(document.head || document.documentElement).appendChild(a);
window.addEventListener('message', async (event) => {
  if (event.data.type != 'FROM_PAGE') return;
  switch (event.data.action) {
    case 'getFrontEndUrl':
      window.postMessage(
        {
          type: 'FROM_EXTENSION',
          action: 'sendFrontEndUrl',
          id: event.data.id,
          data: chrome.runtime.getURL(event.data.data),
        },
        '*'
      );
      break;
  }
});
