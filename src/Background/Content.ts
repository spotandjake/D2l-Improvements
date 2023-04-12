if (localStorage.getItem('Extension-Disabled') != 'true') {
  // Clear Page
  document.head.replaceChildren();
  document.body.replaceChildren();
  // Inject Injection Script
  const scriptInjector = document.createElement('script');
  scriptInjector.src = chrome.runtime.getURL('./Background/Inject.js');
  (document.head || document.documentElement).appendChild(scriptInjector);
  // Setup Message Handler
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
} else {
  // Add Enable Extension Button
  const list = document.querySelector(
    '.d2l-navigation-s-personal-menu d2l-dropdown-content ul ul'
  );
  // Create Button
  const buttonWrapper = document.createElement('li');
  const buttonSpan = document.createElement('span');
  const button = document.createElement('a');
  buttonSpan.style.whiteSpace = 'nowrap;';
  button.classList.add('d2l-link');
  button.onclick = () => {
    localStorage.setItem('Extension-Disabled', 'false');
    location.reload();
  };
  button.innerText = 'Enable Extension';
  buttonSpan.append(button);
  buttonWrapper.append(buttonSpan);
  // Add it too the dom
  list?.prepend(buttonWrapper);
}
