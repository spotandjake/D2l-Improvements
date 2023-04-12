if (localStorage.getItem('Extension-Disabled') != 'true') {
  // Inject The Stop
  const script = document.createElement('script');
  script.innerText = 'window.stop()';
  document.body.appendChild(script);
  // Clear Page
  document.head.replaceChildren();
  document.body.replaceChildren();
  // Create Our Class Handler Method
  class MessageHandler {
    private handles: Map<number, (o: object) => void>;
    constructor() {
      this.handles = new Map();
      // Add Listener To Deal With Handlers
      window.addEventListener(
        'message',
        (event) => {
          if (event.data.type != 'FROM_EXTENSION') return;
          switch (event.data.action) {
            case 'sendFrontEndUrl': {
              if (this.handles.has(event.data.id)) {
                const callback = this.handles.get(event.data.id);
                this.handles.delete(event.data.id);
                if (callback != undefined) callback(event.data.data);
              }
              break;
            }
          }
        },
        false
      );
    }
    _genId() {
      return Math.floor(Math.random() * Date.now());
    }
    // Routes
    getFrontEndUrl(uri: string) {
      const id = this._genId();
      // Listen For Response
      return new Promise((resolve) => {
        this.handles.set(id, (event) => resolve(event));
        // post Original Message
        window.postMessage(
          {
            type: 'FROM_PAGE',
            action: 'getFrontEndUrl',
            id: id,
            data: uri,
          },
          '*'
        );
      });
    }
  }
  // Create Message Handler
  (async () => {
    const handler = new MessageHandler();
    const frontEndUrl = (await handler.getFrontEndUrl(
      './Foreground/index.html'
    )) as string;
    // Fetch Our Content
    const _content = await fetch(frontEndUrl, {
      credentials: 'include',
    }).catch((e) => console.log(e));
    if (_content == undefined) return;
    const content = await _content.text();
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(content, 'text/html');
    const rebuildNode = async (node: Element): Promise<Element> => {
      let newNode;
      switch (node.nodeName) {
        case 'LINK':
          newNode = node.cloneNode(true) as HTMLLinkElement;
          if ((<HTMLLinkElement>node).href) {
            const source = (<HTMLLinkElement>node).href;
            if (source.startsWith('https://durham.elearningontario.ca/_ext')) {
              let newSource = source.slice(
                'https://durham.elearningontario.ca/_ext'.length
              );
              newSource = (await handler.getFrontEndUrl(newSource)) as string;
              newNode.href = newSource;
            } else {
              newNode.href = source;
            }
          }
          break;
        case 'SCRIPT':
          newNode = document.createElement('script');
          if ((<HTMLScriptElement>node).async)
            newNode.async = (<HTMLScriptElement>node).async;
          if ((<HTMLScriptElement>node).defer)
            newNode.defer = (<HTMLScriptElement>node).defer;
          if ((<HTMLScriptElement>node).noModule)
            newNode.noModule = (<HTMLScriptElement>node).noModule;
          if ((<HTMLScriptElement>node).src) {
            const source = (<HTMLScriptElement>node).src;
            if (source.startsWith('https://durham.elearningontario.ca/_ext')) {
              let newSource = source.slice(
                'https://durham.elearningontario.ca/_ext'.length
              );
              newSource = (await handler.getFrontEndUrl(newSource)) as string;
              newNode.src = newSource;
            } else {
              newNode.src = source;
            }
          }
          if ((<HTMLScriptElement>node).type)
            newNode.type = (<HTMLScriptElement>node).type;
          if ((<HTMLScriptElement>node).textContent)
            newNode.textContent = (<HTMLScriptElement>node).textContent;
          if ((<HTMLScriptElement>node).id)
            newNode.id = (<HTMLScriptElement>node).id;
          break;
        case 'META':
        case 'TITLE':
          newNode = node.cloneNode(true);
          break;
        default:
          newNode = node.cloneNode(true);
      }
      return <Element>newNode;
    };
    const head = [];
    const body = [];
    for (const node of [...htmlDoc.head.children]) {
      head.push(await rebuildNode(node));
    }
    for (const node of [...htmlDoc.body.children]) {
      body.push(await rebuildNode(node));
    }
    // Append Children
    document.head.append(...head);
    document.body.append(...body);
  })();
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
