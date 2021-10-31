!function() {
  function e(e, t, n, r) {
    t = t || function(e) {
      return null == e ? '' : String(e).replace(a, s);
    };
    var i = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&#34;',
      '\'': '&#39;'
    }, a = /[&<>'"]/g;
    function s(e) {
      return i[e] || e;
    }
    var o = '';
    function c(e) {
      null != e && (o += e);
    }
    return c('<div class="StreamCard" id="'), c(e.Id), c('" Category="'), c(e.Category), 
    c('" _url="'), c(e._url), c('">\r\n  <div class="StreamCardIcon '), c(e.CompletionType), 
    c('">\r\n    <span class="material-icons">\r\n      '), 'Info' == e.type ? c('\r\n        account_circle\r\n      ') : 'Content' == e.type ? c('\r\n        class\r\n      ') : 'Assignment' == e.type ? c('\r\n        assignment\r\n      ') : c('\r\n        article\r\n      '), 
    c('\r\n    </span>\r\n  </div>\r\n  <div class="StreamCardTitle">\r\n    <h1>'), 
    c(t(e.Title)), c('</h1>\r\n    <h3>'), c(t(e.StartDate)), c('</h3>\r\n  </div>\r\n  <div class="StreamCardBody">\r\n    '), 
    'Assignment' == e.type ? c('\r\n      <div class="FileSubmit">\r\n        <div class="UploadedFiles"></div>\r\n        <div class="FileForm">\r\n          <textarea class="FileFormDescription"></textarea>\r\n          <button class="FileFormAdd">Add or create</button>\r\n          <button class="FileFormSubmit">Submit</button>\r\n        </div>\r\n      </div>\r\n    ') : 'Quiz' == e.type ? (c('\r\n      <div>\r\n        <div>\r\n          '), 
    c(e.Body.Html), c('\r\n        </div>\r\n        <div>\r\n          <a class="btn" href="'), 
    c(e._url), c('">Start Quiz</a>\r\n        </div>\r\n      </div>\r\n    ')) : 'Content' == e.type ? c('\r\n      <div class="Loader">\r\n        <div class="lds-grid">\r\n          <div></div>\r\n          <div></div>\r\n          <div></div>\r\n          <div></div>\r\n          <div></div>\r\n          <div></div>\r\n          <div></div>\r\n          <div></div>\r\n          <div></div>\r\n        </div>\r\n      </div>\r\n    ') : (c('\r\n      '), 
    c(e.Body.Html), c('\r\n    ')), c('\r\n  </div>\r\n</div>'), o;
  }
  class t {
    constructor(e, t, n, r, i) {
      this.Handler = new Map, window.postMessage({
        type: 'FROM_EXTENSION',
        action: 'LOAD',
        config: {
          developerKey: e,
          clientId: t,
          appId: n,
          scope: r,
          mimeTypes: i
        }
      }, '*'), window.addEventListener('message', (e => {
        if (e.source == window && e.data.type && 'FROM_PAGE' == e.data.type) switch (e.data.action) {
         case 'EXPORT':
         case 'CALLBACK':
          if (this.Handler.has(e.data.id)) {
            const t = this.Handler.get(e.data.id);
            this.Handler.delete(e.data.id), t(e.data.data);
          }
        }
      }), !1);
    }
    _genId() {
      return Math.floor(Math.random() * Date.now());
    }
    show(e, t = {}) {
      const n = this._genId();
      this.Handler.set(n, e), window.postMessage({
        type: 'FROM_EXTENSION',
        action: 'SHOW',
        id: n,
        config: t
      }, '*');
    }
    export(e) {
      const t = this._genId();
      return new Promise((n => {
        this.Handler.set(t, (e => n(e))), window.postMessage({
          type: 'FROM_EXTENSION',
          action: 'EXPORT',
          id: t,
          fileId: e
        }, '*');
      }));
    }
  }
  const n = 'xxBOUNDARYxx', r = (e, t) => {
    const r = `--${n}--\r\n`, i = `--${n}\r\n`;
    let a = `${i}Content-Type: application/json\r\n\r\n${JSON.stringify(e)}\r\n`;
    return t.forEach((({fileName: e, fileType: t, fileContent: n}) => {
      a += `${i}Content-Disposition: form-data; name=""; filename="${e}"\r\nContent-Type: ${t}\r\n\r\n${n}\r\n${r}`;
    })), a;
  }, i = 'HOME', a = 'STREAM', s = new class {
    constructor() {
      this.organizationURL = 'https://bc59e98c-eabc-4d42-98e1-edfe93518966.organizations.api.brightspace.com/', 
      this.location = i, this.token, this.data = {}, this.uid, this.cid, this.cancel, 
      this.apiVersion = {};
    }
    async start(e) {
      this.data = e, this.cid = e.orgUnitId, await this._apiVersion(), setInterval((() => this.getToken(!0)), 3e5);
      let t = i;
      switch (!0) {
       case /\/d2l\/home\/[^/]+$/.test(window.location.pathname):
        t = a, this.cid = window.location.pathname.replace('/d2l/home/', '');
        break;

       case '/d2l/home' == window.location.pathname:
       default:
        t = i;
      }
      this.setPage(t);
    }
    async _apiVersion() {
      const e = await fetch('https://durham.elearningontario.ca/d2l/api/versions/');
      (await e.json()).forEach((({LatestVersion: e, ProductCode: t, SupportedVersions: n}) => {
        this.apiVersion[t] = e;
      }));
    }
    async getToken(e = !1) {
      if (e || !this.token) {
        const e = await fetch('https://durham.elearningontario.ca/d2l/lp/auth/oauth2/token', {
          headers: {
            'content-type': 'application/x-www-form-urlencoded, application/json',
            'x-csrf-token': localStorage.getItem('XSRF.Token')
          },
          body: 'scope=*:*:*',
          method: 'POST'
        }).then((e => e.json())).catch((() => localStorage.getItem('D2L.Fetch.Tokens'))) || {
          access_token: null
        };
        return this.token = e.access_token, this.token;
      }
      return this.token;
    }
    setPage(s) {
      const o = document.getElementById('Content').classList;
      switch ('function' == typeof this.cancel && this.cancel(), s) {
       case i:
        for (this.cid = null, this.cancel = (async e => {
          const t = (new Date).valueOf(), n = document.getElementById('main'), r = await fetch(`https://bc59e98c-eabc-4d42-98e1-edfe93518966.enrollments.api.brightspace.com/users/${e.uid}?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false`, {
            headers: {
              authorization: `Bearer ${await e.getToken()}`
            }
          }).then((e => e.json())), i = await Promise.all(r.entities.map((async ({href: n}) => {
            const r = await fetch(n, {
              headers: {
                authorization: `Bearer ${await e.getToken()}`
              },
              method: 'GET'
            }), i = await r.json(), a = await fetch(i.links[1].href, {
              headers: {
                authorization: `Bearer ${await e.getToken()}`
              },
              method: 'GET'
            }), s = await a.json(), o = await fetch(s.entities[2].href).then((e => e.json())).catch((async () => await fetch(s.entities[2].href, {
              headers: {
                authorization: `Bearer ${await e.getToken()}`
              }
            }).then((e => e.json())).catch((() => 'https://blog.fluidui.com/content/images/2019/01/imageedit_1_9273372713.png')))), {endDate: c, name: l} = s.properties;
            return {
              name: l,
              disabled: new Date(c).valueOf() < t,
              href: s.links[0].href.replace('https://bc59e98c-eabc-4d42-98e1-edfe93518966.folio.api.brightspace.com/organizations/', 'https://durham.elearningontario.ca/d2l/home/'),
              picture: o.links ? o.links[2].href : o,
              Text: `Closes | ${new Date(c).toDateString()}`
            };
          })));
          n.innerHTML = function(e, t, n, r) {
            t = t || function(e) {
              return null == e ? '' : String(e).replace(a, s);
            };
            var i = {
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&#34;',
              '\'': '&#39;'
            }, a = /[&<>'"]/g;
            function s(e) {
              return i[e] || e;
            }
            var o = '';
            function c(e) {
              null != e && (o += e);
            }
            return c('<section class="ClassContainer Search" id="ClassContainer">\r\n  '), e.classes.forEach((e => {
              c('\r\n    <div class="classCard" '), c(t(e.disabled ? 'disabled' : '')), c(' class_link="'), 
              c(t(e.href)), c('">\r\n      <picture>\r\n        <img src="'), c(e.picture), c('">\r\n      </picture>\r\n      <div class="classCardContent">\r\n        <h4>'), 
              c(t(e.name)), c('</h4>\r\n        <h6>'), c(t(e.disabled ? 'Closed' : e.Text)), 
              c('</h6>\r\n      </div>\r\n    </div>\r\n  ');
            })), c('\r\n</section>'), o;
          }({
            classes: i
          });
          const a = e => {
            window.location.href = e.getAttribute('class_link');
          };
          return [ ...n.querySelector('#ClassContainer').children ].forEach((e => {
            '' != e.getAttribute('disabled') && e.addEventListener('click', (() => a(e)));
          })), () => {
            [ ...n.querySelector('#ClassContainer').children ].forEach((e => {
              e.removeEventListener('click', (() => a(e)));
            }));
          };
        })(this); o.length > 0; ) o.remove(o.item(0));
        o.add('Home');
        break;

       case a:
        for (this.cancel = (async i => {
          const a = document.getElementById('main'), s = await fetch(`${i.organizationURL}${i.cid}`, {
            headers: {
              Accept: 'application/vnd.siren+json',
              authorization: `Bearer ${await i.getToken()}`
            }
          }), o = await s.json(), c = await fetch(o.entities[2].href), l = await c.json().catch((() => 'https://durham.elearningontario.ca/d2l/img/0/Framework.UserProfileBadge.actProfileDaylight100.png?v=20.21.8.31658')), d = {
            name: o.properties.name,
            description: o.properties.description,
            picture: l.links ? l.links[2].href : l,
            teacher: {
              name: 'TODO',
              picture: 'https://durham.elearningontario.ca/d2l/img/0/Framework.UserProfileBadge.actProfileDaylight100.png?v=20.21.8.31658'
            }
          }, {html: h, assignments: u} = await (async t => {
            const n = [], r = await fetch(`/d2l/api/le/${t.apiVersion.le}/${t.cid}/news/`);
            (await r.json()).forEach((t => {
              t.StartDate = new Date(t.StartDate).toDateString(), t.Category = 'ChipFilterHome', 
              t.type = 'Info', n.push({
                date: new Date(t.StartDate).valueOf(),
                element: e({
                  ...t,
                  CompletionType: 'OnSubmission'
                })
              });
            }));
            const i = await fetch(`/d2l/api/le/unstable/${t.cid}/content/userprogress/?pageSize=99999`), a = await i.json(), s = async e => {
              const n = [];
              return await Promise.all(e.map((async e => {
                switch (e.Type) {
                 case 1:
                  n.push({
                    ...e,
                    isRead: a.Objects.some((t => t.ObjectId == e.Id && t.IsRead))
                  });
                  break;

                 case 0:
                  {
                    const r = await fetch(`/d2l/api/le/${t.apiVersion.le}/${t.cid}/content/modules/${e.Id}/structure/`), i = await r.json();
                    n.push(...await s(i));
                    break;
                  }
                }
              }))), n;
            }, o = await fetch(`/d2l/api/le/${t.apiVersion.le}/${t.cid}/content/root/`), c = await o.json(), l = await s(c);
            for (const t of l) {
              const r = 1 == t.ActivityType ? `${window.location.origin}${t.Url}` : t.Url;
              n.push({
                date: new Date(t.LastModifiedDate).valueOf(),
                element: e({
                  Id: t.Id,
                  Category: 'ChipFilterContent',
                  type: 'Content',
                  Title: t.Title,
                  CompletionType: t.isRead ? 'OnSubmission' : 'Unread',
                  StartDate: new Date(t.LastModifiedDate).toDateString(),
                  _url: r
                })
              });
            }
            const d = await fetch(`/d2l/api/le/${t.apiVersion.le}/${t.cid}/dropbox/folders/`), h = await d.json();
            h.forEach((t => {
              n.push({
                date: new Date(t.DueDate).valueOf(),
                element: e({
                  Id: t.Id,
                  Category: 'ChipFilterAssignments',
                  type: 'Assignment',
                  Title: t.Name,
                  CompletionType: [ 'OnSubmission', 'DueDate', 'OnSubmission', 'OnSubmission' ][t.CompletionType],
                  StartDate: new Date(t.DueDate).toDateString(),
                  Body: {
                    Html: ''
                  }
                })
              });
            }));
            const u = await fetch(`/d2l/api/le/${t.apiVersion.le}/${t.cid}/quizzes/`), m = await u.json();
            for (const r of m.Objects) n.push({
              date: new Date(r.DueDate).valueOf(),
              element: e({
                Id: r.QuizId,
                Category: 'ChipFilterQuizzes',
                type: 'Quiz',
                Title: r.Name,
                CompletionType: 'OnSubmission',
                StartDate: new Date(r.DueDate).toDateString(),
                Body: {
                  Html: r.Description.Text.Html
                },
                _url: `/d2l/lms/quizzing/user/quiz_summary.d2l?qi=${r.QuizId}&ou=${t.cid}`
              })
            });
            return {
              html: n.sort(((e, t) => t.date - e.date)).map((e => e.element)).join('\n'),
              assignments: h,
              content: l
            };
          })(i);
          a.innerHTML = function(e, t, n, r) {
            t = t || function(e) {
              return null == e ? '' : String(e).replace(a, s);
            };
            var i = {
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&#34;',
              '\'': '&#39;'
            }, a = /[&<>'"]/g;
            function s(e) {
              return i[e] || e;
            }
            var o = '';
            function c(e) {
              null != e && (o += e);
            }
            return c('\x3c!-- Top --\x3e\r\n<section class="ClassPicture">\r\n  <picture>\r\n    <img src="https://s.brightspace.com/course-images/images/590cea69-f3f4-47aa-88c1-e69b9c5fd86f/banner-wide-low-density-max-size.jpg" />\r\n  </picture>\r\n  <div class="ClassPictureContent">\r\n    <h1>'), 
            c(t(e.classData.name)), c('</h1>\r\n    <h2>'), c(t(e.classData.description)), c('</h2>\r\n    <h4>Meet Link: <a>Link</a></h4>\r\n  </div>\r\n</section>\r\n<div class="StreamFilter" id="ChipFilters">\r\n  <div class="ChipFilter Active" id="ChipFilterHome"><span class="material-icons chipIcon">home</span><p>Stream</p></div>\r\n  <div class="ChipFilter Active" id="ChipFilterContent"><span class="material-icons chipIcon">source</span><p>Content</p></div>\r\n  <div class="ChipFilter Active" id="ChipFilterDiscussions"><span class="material-icons chipIcon">chat</span><p>Discussions</p></div>\r\n  <div class="ChipFilter Active" id="ChipFilterAssignments"><span class="material-icons chipIcon">assignment</span><p>Assignments</p></div>\r\n  <div class="ChipFilter Active" id="ChipFilterQuizzes"><span class="material-icons chipIcon">quiz</span><p>Quizzes</p></div>\r\n</div>\r\n\x3c!-- Stream Announcements --\x3e\r\n<section class="StreamCards Search Filter">'), 
            c(e.announcements), c('</section>'), o;
          }({
            announcements: h,
            classData: d
          });
          const m = async e => {
            if (e.classList.contains('Active')) e.classList.remove('Active'); else if (e.classList.add('Active'), 
            'ChipFilterContent' == e.getAttribute('Category')) {
              e.querySelector('.StreamCardIcon').classList.contains('Unread') && (await fetch(`/d2l/api/le/unstable/${i.cid}/content/topics/${e.id}/view`, {
                headers: {
                  authorization: `Bearer ${await i.getToken()}`
                },
                method: 'POST'
              }), e.querySelector('.StreamCardIcon').classList.remove('Unread'), e.querySelector('.StreamCardIcon').classList.add('OnSubmission')), 
              e.classList.add('Active');
              const t = e.getAttribute('_url');
              let n = `<a class="btn" href="${t}">View Content</a>`;
              if (/\.(docx|jpg|mp4|pdf|png|gif|doc|xlsm|xlsx|xls|DOC|ppt|pptx|xlw)$/i.test(t) || /docs\.google\.com/.test(t)) if (/\.(jpg)/i.test(t)) n = `<img width="100%" src="/d2l/api/le/${i.apiVersion.le}/${i.cid}/content/topics/${e.id}/file?stream=true">`; else if (/\.(mp4)/i.test(t)) n = `\n            <video width="100%" height="auto" controls="">\n              <source src="${t}">\n              Your browser does not support the video tag.\n            </video>`; else if (/\.(xlsm|xlsx|xls|pptx|xlw)/i.test(t) || /docs\.google\.com/.test(t)) n = `<iframe class="StreamIframe" allow="encrypted-media *;" width="100%" scrolling="no" src="${t}">${n}</iframe>`; else {
                const t = await fetch(`/d2l/le/content/${i.cid}/topics/files/download/${e.id}/DirectFileTopicDownload`);
                n = `<iframe class="StreamIframe" allow="encrypted-media *;" width="100%" scrolling="no" src="${URL.createObjectURL(await t.blob())}">${n}</iframe>`;
              } else if (t.includes('www.youtube.com')) {
                const e = new URL(t).searchParams.get('v');
                n = `<object data="https://www.youtube.com/embed/${e}" width="100%" height="auto">\n            <embed src="https://www.youtube.com/embed/${e}" width="100%" height="auto"> </embed>\n            Error: Embedded data could not be displayed.\n          </object>`;
              } else try {
                const e = await fetch(t), r = await e.blob();
                switch (r.type) {
                 case 'text/html':
                  n = `<object data="${t}" width="100%" height="auto">\n                  <embed src="${t}" width="100%" height="auto"> </embed>\n                  Error: Embedded data could not be displayed.\n                </object>`;
                  break;

                 case 'application/octet-stream':
                 case 'application/x-msaccess':
                  n = `<a class="btn" href="${t}">Dowload Content</a>`;
                  break;

                 default:
                  console.log(r), console.log(t), console.log('================================================================');
                }
              } catch (e) {
                console.log('There was an error opening this');
              }
              e.querySelector('.StreamCardBody').innerHTML = n;
            }
          }, p = new t('AIzaSyCVB1GYyFHjovliBp1mphU7bJIldMu-Xaw', '624818190747-mufqrqsbd9ggra85p5k7binndne89o6c.apps.googleusercontent.com', 'united-rope-234818', [ 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.readonly' ], '');
          [ ...a.querySelector('section.StreamCards').children ].forEach((e => {
            e.addEventListener('click', (() => m(e))), e.querySelector('.StreamCardBody').addEventListener('click', (e => e.stopPropagation())), 
            'ChipFilterAssignments' == e.getAttribute('Category') && (e.querySelector('.FileFormAdd').addEventListener('click', (() => {
              const t = u.find((t => t.Id == e.id));
              console.log(t), p.show((t => {
                if ('picked' == t.action) {
                  const n = e.querySelector('.UploadedFiles');
                  t.docs.forEach((async e => {
                    n.insertAdjacentHTML('beforeend', function(e, t, n, r) {
                      t = t || function(e) {
                        return null == e ? '' : String(e).replace(a, s);
                      };
                      var i = {
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&#34;',
                        '\'': '&#39;'
                      }, a = /[&<>'"]/g;
                      function s(e) {
                        return i[e] || e;
                      }
                      var o = '';
                      function c(e) {
                        null != e && (o += e);
                      }
                      return c('<div class="UploadedFile" onClick="window.open(\''), c(e.href), c('\');" documentId="'), 
                      c(e.documentId), c('">\r\n  <picture>\r\n    <img src="'), c(e.thumbnail), c('" />\r\n  </picture>\r\n  <span class="FileTitle">'), 
                      c(t(e.name)), c('</span>\r\n  <span class="FileRemove material-icons" onClick="this.parentNode.remove();event.stopPropagation();">close</span>\r\n</div>'), 
                      o;
                    }({
                      name: e.name,
                      href: e.url,
                      thumbnail: e.thumbnail,
                      documentId: e.id
                    }));
                  }));
                }
              }));
            })), e.querySelector('.FileFormSubmit').addEventListener('click', (async () => {
              const t = (await Promise.all([ ...e.querySelector('.UploadedFiles').children ].map((async e => {
                const t = e.getAttribute('documentid'), n = await p.export(t).catch((() => null));
                return 0 == n.status && alert('There was an issue uploading the file'), {
                  status: n.status,
                  name: `${e.querySelector('.FileTitle').innerText}.pdf`,
                  type: 'application/pdf',
                  body: n.body.body
                };
              })))).filter((e => 1 == e.status)).map((e => ({
                name: e.name,
                type: e.type,
                body: e.body
              }))), a = e.querySelector('.FileFormDescription').value;
              e.querySelector('.UploadedFiles').innerHTML = '', e.querySelector('.FileFormDescription').value = '';
              const s = await fetch(`/d2l/api/le/1.41/${i.cid}/dropbox/folders/${e.id}/submissions/mysubmissions/`, {
                method: 'POST',
                headers: {
                  authorization: `Bearer ${await i.getToken()}`,
                  'Content-Type': `multipart/mixed;boundary=${n}`
                },
                body: r({
                  Text: a,
                  Html: ''
                }, t.length > 0 ? t : [ {
                  name: 'Comment.txt',
                  type: 'text/html',
                  Description: a
                } ])
              });
              await s.text();
            })));
          }));
          const g = document.getElementById('ChipFilters'), f = document.querySelector('.Filter'), v = e => {
            e.classList.toggle('Active', !e.classList.contains('Active'));
            const t = [ ...g.querySelectorAll('.ChipFilter') ];
            [ ...f.children ].forEach((e => e.classList.toggle('Filtered', !t.some((t => t.classList.contains('Active') && t.id == e.getAttribute('Category'))))));
          };
          return [ ...g.children ].forEach((e => {
            e.addEventListener('click', (() => v(e)));
          })), () => {
            [ ...a.querySelector('section.StreamCards').children ].forEach((e => {
              e.removeEventListener('click', (() => m(e)));
            })), [ ...g.children ].forEach((e => {
              e.removeEventListener('click', (() => v(e)));
            }));
          };
        })(this); o.length > 0; ) o.remove(o.item(0));
        o.add('Stream');
        break;

       default:
        return void console.log(`Unknown location: ${s}`);
      }
      this.location = s;
    }
  };
  function o(e) {
    return Array.isArray ? Array.isArray(e) : '[object Array]' === p(e);
  }
  function c(e) {
    return 'string' == typeof e;
  }
  function l(e) {
    return 'number' == typeof e;
  }
  function d(e) {
    return !0 === e || !1 === e || function(e) {
      return h(e) && null !== e;
    }(e) && '[object Boolean]' == p(e);
  }
  function h(e) {
    return 'object' == typeof e;
  }
  function u(e) {
    return null != e;
  }
  function m(e) {
    return !e.trim().length;
  }
  function p(e) {
    return null == e ? void 0 === e ? '[object Undefined]' : '[object Null]' : Object.prototype.toString.call(e);
  }
  const g = Object.prototype.hasOwnProperty;
  class f {
    constructor(e) {
      this._keys = [], this._keyMap = {};
      let t = 0;
      e.forEach((e => {
        let n = v(e);
        t += n.weight, this._keys.push(n), this._keyMap[n.id] = n, t += n.weight;
      })), this._keys.forEach((e => {
        e.weight /= t;
      }));
    }
    get(e) {
      return this._keyMap[e];
    }
    keys() {
      return this._keys;
    }
    toJSON() {
      return JSON.stringify(this._keys);
    }
  }
  function v(e) {
    let t = null, n = null, r = null, i = 1;
    if (c(e) || o(e)) r = e, t = y(e), n = w(e); else {
      if (!g.call(e, 'name')) throw new Error('Missing name property in key');
      const a = e.name;
      if (r = a, g.call(e, 'weight') && (i = e.weight, i <= 0)) throw new Error((e => `Property 'weight' in key '${e}' must be a positive integer`)(a));
      t = y(a), n = w(a);
    }
    return {
      path: t,
      id: n,
      weight: i,
      src: r
    };
  }
  function y(e) {
    return o(e) ? e : e.split('.');
  }
  function w(e) {
    return o(e) ? e.join('.') : e;
  }
  var b = {
    isCaseSensitive: !1,
    includeScore: !1,
    keys: [],
    shouldSort: !0,
    sortFn: (e, t) => e.score === t.score ? e.idx < t.idx ? -1 : 1 : e.score < t.score ? -1 : 1,
    includeMatches: !1,
    findAllMatches: !1,
    minMatchCharLength: 1,
    location: 0,
    threshold: .6,
    distance: 100,
    useExtendedSearch: !1,
    getFn: function(e, t) {
      let n = [], r = !1;
      const i = (e, t, a) => {
        if (u(e)) if (t[a]) {
          const s = e[t[a]];
          if (!u(s)) return;
          if (a === t.length - 1 && (c(s) || l(s) || d(s))) n.push(function(e) {
            return null == e ? '' : function(e) {
              if ('string' == typeof e) return e;
              let t = e + '';
              return '0' == t && 1 / e == -1 / 0 ? '-0' : t;
            }(e);
          }(s)); else if (o(s)) {
            r = !0;
            for (let e = 0, n = s.length; e < n; e += 1) i(s[e], t, a + 1);
          } else t.length && i(s, t, a + 1);
        } else n.push(e);
      };
      return i(e, c(t) ? t.split('.') : t, 0), r ? n : n[0];
    },
    ignoreLocation: !1,
    ignoreFieldNorm: !1
  };
  const x = /[^ ]+/g;
  class S {
    constructor({getFn: e = b.getFn} = {}) {
      this.norm = function(e = 3) {
        const t = new Map, n = Math.pow(10, e);
        return {
          get(e) {
            const r = e.match(x).length;
            if (t.has(r)) return t.get(r);
            const i = 1 / Math.sqrt(r), a = parseFloat(Math.round(i * n) / n);
            return t.set(r, a), a;
          },
          clear() {
            t.clear();
          }
        };
      }(3), this.getFn = e, this.isCreated = !1, this.setIndexRecords();
    }
    setSources(e = []) {
      this.docs = e;
    }
    setIndexRecords(e = []) {
      this.records = e;
    }
    setKeys(e = []) {
      this.keys = e, this._keysMap = {}, e.forEach(((e, t) => {
        this._keysMap[e.id] = t;
      }));
    }
    create() {
      !this.isCreated && this.docs.length && (this.isCreated = !0, c(this.docs[0]) ? this.docs.forEach(((e, t) => {
        this._addString(e, t);
      })) : this.docs.forEach(((e, t) => {
        this._addObject(e, t);
      })), this.norm.clear());
    }
    add(e) {
      const t = this.size();
      c(e) ? this._addString(e, t) : this._addObject(e, t);
    }
    removeAt(e) {
      this.records.splice(e, 1);
      for (let t = e, n = this.size(); t < n; t += 1) this.records[t].i -= 1;
    }
    getValueForItemAtKeyId(e, t) {
      return e[this._keysMap[t]];
    }
    size() {
      return this.records.length;
    }
    _addString(e, t) {
      if (!u(e) || m(e)) return;
      let n = {
        v: e,
        i: t,
        n: this.norm.get(e)
      };
      this.records.push(n);
    }
    _addObject(e, t) {
      let n = {
        i: t,
        $: {}
      };
      this.keys.forEach(((t, r) => {
        let i = this.getFn(e, t.path);
        if (u(i)) if (o(i)) {
          let e = [];
          const t = [ {
            nestedArrIndex: -1,
            value: i
          } ];
          for (;t.length; ) {
            const {nestedArrIndex: n, value: r} = t.pop();
            if (u(r)) if (c(r) && !m(r)) {
              let t = {
                v: r,
                i: n,
                n: this.norm.get(r)
              };
              e.push(t);
            } else o(r) && r.forEach(((e, n) => {
              t.push({
                nestedArrIndex: n,
                value: e
              });
            }));
          }
          n.$[r] = e;
        } else if (!m(i)) {
          let e = {
            v: i,
            n: this.norm.get(i)
          };
          n.$[r] = e;
        }
      })), this.records.push(n);
    }
    toJSON() {
      return {
        keys: this.keys,
        records: this.records
      };
    }
  }
  function C(e, t, {getFn: n = b.getFn} = {}) {
    const r = new S({
      getFn: n
    });
    return r.setKeys(e.map(v)), r.setSources(t), r.create(), r;
  }
  function k(e, {errors: t = 0, currentLocation: n = 0, expectedLocation: r = 0, distance: i = b.distance, ignoreLocation: a = b.ignoreLocation} = {}) {
    const s = t / e.length;
    if (a) return s;
    const o = Math.abs(r - n);
    return i ? s + o / i : o ? 1 : s;
  }
  function M(e, t, n, {location: r = b.location, distance: i = b.distance, threshold: a = b.threshold, findAllMatches: s = b.findAllMatches, minMatchCharLength: o = b.minMatchCharLength, includeMatches: c = b.includeMatches, ignoreLocation: l = b.ignoreLocation} = {}) {
    if (t.length > 32) throw new Error('Pattern length exceeds max of 32.');
    const d = t.length, h = e.length, u = Math.max(0, Math.min(r, h));
    let m = a, p = u;
    const g = o > 1 || c, f = g ? Array(h) : [];
    let v;
    for (;(v = e.indexOf(t, p)) > -1; ) {
      let e = k(t, {
        currentLocation: v,
        expectedLocation: u,
        distance: i,
        ignoreLocation: l
      });
      if (m = Math.min(e, m), p = v + d, g) {
        let e = 0;
        for (;e < d; ) f[v + e] = 1, e += 1;
      }
    }
    p = -1;
    let y = [], w = 1, x = d + h;
    const S = 1 << d - 1;
    for (let r = 0; r < d; r += 1) {
      let a = 0, o = x;
      for (;a < o; ) k(t, {
        errors: r,
        currentLocation: u + o,
        expectedLocation: u,
        distance: i,
        ignoreLocation: l
      }) <= m ? a = o : x = o, o = Math.floor((x - a) / 2 + a);
      x = o;
      let c = Math.max(1, u - o + 1), v = s ? h : Math.min(u + o, h) + d, b = Array(v + 2);
      b[v + 1] = (1 << r) - 1;
      for (let a = v; a >= c; a -= 1) {
        let s = a - 1, o = n[e.charAt(s)];
        if (g && (f[s] = +!!o), b[a] = (b[a + 1] << 1 | 1) & o, r && (b[a] |= (y[a + 1] | y[a]) << 1 | 1 | y[a + 1]), 
        b[a] & S && (w = k(t, {
          errors: r,
          currentLocation: s,
          expectedLocation: u,
          distance: i,
          ignoreLocation: l
        }), w <= m)) {
          if (m = w, p = s, p <= u) break;
          c = Math.max(1, 2 * u - p);
        }
      }
      if (k(t, {
        errors: r + 1,
        currentLocation: u,
        expectedLocation: u,
        distance: i,
        ignoreLocation: l
      }) > m) break;
      y = b;
    }
    const C = {
      isMatch: p >= 0,
      score: Math.max(.001, w)
    };
    if (g) {
      const e = function(e = [], t = b.minMatchCharLength) {
        let n = [], r = -1, i = -1, a = 0;
        for (let s = e.length; a < s; a += 1) {
          let s = e[a];
          s && -1 === r ? r = a : s || -1 === r || (i = a - 1, i - r + 1 >= t && n.push([ r, i ]), 
          r = -1);
        }
        return e[a - 1] && a - r >= t && n.push([ r, a - 1 ]), n;
      }(f, o);
      e.length ? c && (C.indices = e) : C.isMatch = !1;
    }
    return C;
  }
  function B(e) {
    let t = {};
    for (let n = 0, r = e.length; n < r; n += 1) {
      const i = e.charAt(n);
      t[i] = (t[i] || 0) | 1 << r - n - 1;
    }
    return t;
  }
  class I {
    constructor(e, {location: t = b.location, threshold: n = b.threshold, distance: r = b.distance, includeMatches: i = b.includeMatches, findAllMatches: a = b.findAllMatches, minMatchCharLength: s = b.minMatchCharLength, isCaseSensitive: o = b.isCaseSensitive, ignoreLocation: c = b.ignoreLocation} = {}) {
      if (this.options = {
        location: t,
        threshold: n,
        distance: r,
        includeMatches: i,
        findAllMatches: a,
        minMatchCharLength: s,
        isCaseSensitive: o,
        ignoreLocation: c
      }, this.pattern = o ? e : e.toLowerCase(), this.chunks = [], !this.pattern.length) return;
      const l = (e, t) => {
        this.chunks.push({
          pattern: e,
          alphabet: B(e),
          startIndex: t
        });
      }, d = this.pattern.length;
      if (d > 32) {
        let e = 0;
        const t = d % 32, n = d - t;
        for (;e < n; ) l(this.pattern.substr(e, 32), e), e += 32;
        if (t) {
          const e = d - 32;
          l(this.pattern.substr(e), e);
        }
      } else l(this.pattern, 0);
    }
    searchIn(e) {
      const {isCaseSensitive: t, includeMatches: n} = this.options;
      if (t || (e = e.toLowerCase()), this.pattern === e) {
        let t = {
          isMatch: !0,
          score: 0
        };
        return n && (t.indices = [ [ 0, e.length - 1 ] ]), t;
      }
      const {location: r, distance: i, threshold: a, findAllMatches: s, minMatchCharLength: o, ignoreLocation: c} = this.options;
      let l = [], d = 0, h = !1;
      this.chunks.forEach((({pattern: t, alphabet: u, startIndex: m}) => {
        const {isMatch: p, score: g, indices: f} = M(e, t, u, {
          location: r + m,
          distance: i,
          threshold: a,
          findAllMatches: s,
          minMatchCharLength: o,
          includeMatches: n,
          ignoreLocation: c
        });
        p && (h = !0), d += g, p && f && (l = [ ...l, ...f ]);
      }));
      let u = {
        isMatch: h,
        score: h ? d / this.chunks.length : 1
      };
      return h && n && (u.indices = l), u;
    }
  }
  class L {
    constructor(e) {
      this.pattern = e;
    }
    static isMultiMatch(e) {
      return F(e, this.multiRegex);
    }
    static isSingleMatch(e) {
      return F(e, this.singleRegex);
    }
    search() {}
  }
  function F(e, t) {
    const n = e.match(t);
    return n ? n[1] : null;
  }
  class A extends L {
    constructor(e, {location: t = b.location, threshold: n = b.threshold, distance: r = b.distance, includeMatches: i = b.includeMatches, findAllMatches: a = b.findAllMatches, minMatchCharLength: s = b.minMatchCharLength, isCaseSensitive: o = b.isCaseSensitive, ignoreLocation: c = b.ignoreLocation} = {}) {
      super(e), this._bitapSearch = new I(e, {
        location: t,
        threshold: n,
        distance: r,
        includeMatches: i,
        findAllMatches: a,
        minMatchCharLength: s,
        isCaseSensitive: o,
        ignoreLocation: c
      });
    }
    static get type() {
      return 'fuzzy';
    }
    static get multiRegex() {
      return /^"(.*)"$/;
    }
    static get singleRegex() {
      return /^(.*)$/;
    }
    search(e) {
      return this._bitapSearch.searchIn(e);
    }
  }
  class E extends L {
    constructor(e) {
      super(e);
    }
    static get type() {
      return 'include';
    }
    static get multiRegex() {
      return /^'"(.*)"$/;
    }
    static get singleRegex() {
      return /^'(.*)$/;
    }
    search(e) {
      let t, n = 0;
      const r = [], i = this.pattern.length;
      for (;(t = e.indexOf(this.pattern, n)) > -1; ) n = t + i, r.push([ t, n - 1 ]);
      const a = !!r.length;
      return {
        isMatch: a,
        score: a ? 0 : 1,
        indices: r
      };
    }
  }
  const $ = [ class extends L {
    constructor(e) {
      super(e);
    }
    static get type() {
      return 'exact';
    }
    static get multiRegex() {
      return /^="(.*)"$/;
    }
    static get singleRegex() {
      return /^=(.*)$/;
    }
    search(e) {
      const t = e === this.pattern;
      return {
        isMatch: t,
        score: t ? 0 : 1,
        indices: [ 0, this.pattern.length - 1 ]
      };
    }
  }, E, class extends L {
    constructor(e) {
      super(e);
    }
    static get type() {
      return 'prefix-exact';
    }
    static get multiRegex() {
      return /^\^"(.*)"$/;
    }
    static get singleRegex() {
      return /^\^(.*)$/;
    }
    search(e) {
      const t = e.startsWith(this.pattern);
      return {
        isMatch: t,
        score: t ? 0 : 1,
        indices: [ 0, this.pattern.length - 1 ]
      };
    }
  }, class extends L {
    constructor(e) {
      super(e);
    }
    static get type() {
      return 'inverse-prefix-exact';
    }
    static get multiRegex() {
      return /^!\^"(.*)"$/;
    }
    static get singleRegex() {
      return /^!\^(.*)$/;
    }
    search(e) {
      const t = !e.startsWith(this.pattern);
      return {
        isMatch: t,
        score: t ? 0 : 1,
        indices: [ 0, e.length - 1 ]
      };
    }
  }, class extends L {
    constructor(e) {
      super(e);
    }
    static get type() {
      return 'inverse-suffix-exact';
    }
    static get multiRegex() {
      return /^!"(.*)"\$$/;
    }
    static get singleRegex() {
      return /^!(.*)\$$/;
    }
    search(e) {
      const t = !e.endsWith(this.pattern);
      return {
        isMatch: t,
        score: t ? 0 : 1,
        indices: [ 0, e.length - 1 ]
      };
    }
  }, class extends L {
    constructor(e) {
      super(e);
    }
    static get type() {
      return 'suffix-exact';
    }
    static get multiRegex() {
      return /^"(.*)"\$$/;
    }
    static get singleRegex() {
      return /^(.*)\$$/;
    }
    search(e) {
      const t = e.endsWith(this.pattern);
      return {
        isMatch: t,
        score: t ? 0 : 1,
        indices: [ e.length - this.pattern.length, e.length - 1 ]
      };
    }
  }, class extends L {
    constructor(e) {
      super(e);
    }
    static get type() {
      return 'inverse-exact';
    }
    static get multiRegex() {
      return /^!"(.*)"$/;
    }
    static get singleRegex() {
      return /^!(.*)$/;
    }
    search(e) {
      const t = -1 === e.indexOf(this.pattern);
      return {
        isMatch: t,
        score: t ? 0 : 1,
        indices: [ 0, e.length - 1 ]
      };
    }
  }, A ], T = $.length, D = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/, _ = new Set([ A.type, E.type ]), z = [];
  function O(e, t) {
    for (let n = 0, r = z.length; n < r; n += 1) {
      let r = z[n];
      if (r.condition(e, t)) return new r(e, t);
    }
    return new I(e, t);
  }
  const N = '$and', j = '$path', P = e => !(!e[N] && !e.$or), R = e => ({
    [N]: Object.keys(e).map((t => ({
      [t]: e[t]
    })))
  });
  function H(e, t, {auto: n = !0} = {}) {
    const r = e => {
      let i = Object.keys(e);
      const a = (e => !!e[j])(e);
      if (!a && i.length > 1 && !P(e)) return r(R(e));
      if ((e => !o(e) && h(e) && !P(e))(e)) {
        const r = a ? e[j] : i[0], s = a ? e.$val : e[r];
        if (!c(s)) throw new Error((e => 'Invalid value for key ' + e)(r));
        const o = {
          keyId: w(r),
          pattern: s
        };
        return n && (o.searcher = O(s, t)), o;
      }
      let s = {
        children: [],
        operator: i[0]
      };
      return i.forEach((t => {
        const n = e[t];
        o(n) && n.forEach((e => {
          s.children.push(r(e));
        }));
      })), s;
    };
    return P(e) || (e = R(e)), r(e);
  }
  function q(e, t) {
    const n = e.matches;
    t.matches = [], u(n) && n.forEach((e => {
      if (!u(e.indices) || !e.indices.length) return;
      const {indices: n, value: r} = e;
      let i = {
        indices: n,
        value: r
      };
      e.key && (i.key = e.key.src), e.idx > -1 && (i.refIndex = e.idx), t.matches.push(i);
    }));
  }
  function U(e, t) {
    t.score = e.score;
  }
  class G {
    constructor(e, t = {}, n) {
      this.options = {
        ...b,
        ...t
      }, this.options.useExtendedSearch, this._keyStore = new f(this.options.keys), this.setCollection(e, n);
    }
    setCollection(e, t) {
      if (this._docs = e, t && !(t instanceof S)) throw new Error('Incorrect \'index\' type');
      this._myIndex = t || C(this.options.keys, this._docs, {
        getFn: this.options.getFn
      });
    }
    add(e) {
      u(e) && (this._docs.push(e), this._myIndex.add(e));
    }
    remove(e = (() => !1)) {
      const t = [];
      for (let n = 0, r = this._docs.length; n < r; n += 1) {
        const i = this._docs[n];
        e(i, n) && (this.removeAt(n), n -= 1, r -= 1, t.push(i));
      }
      return t;
    }
    removeAt(e) {
      this._docs.splice(e, 1), this._myIndex.removeAt(e);
    }
    getIndex() {
      return this._myIndex;
    }
    search(e, {limit: t = -1} = {}) {
      const {includeMatches: n, includeScore: r, shouldSort: i, sortFn: a, ignoreFieldNorm: s} = this.options;
      let o = c(e) ? c(this._docs[0]) ? this._searchStringList(e) : this._searchObjectList(e) : this._searchLogical(e);
      return function(e, {ignoreFieldNorm: t = b.ignoreFieldNorm}) {
        e.forEach((e => {
          let n = 1;
          e.matches.forEach((({key: e, norm: r, score: i}) => {
            const a = e ? e.weight : null;
            n *= Math.pow(0 === i && a ? Number.EPSILON : i, (a || 1) * (t ? 1 : r));
          })), e.score = n;
        }));
      }(o, {
        ignoreFieldNorm: s
      }), i && o.sort(a), l(t) && t > -1 && (o = o.slice(0, t)), function(e, t, {includeMatches: n = b.includeMatches, includeScore: r = b.includeScore} = {}) {
        const i = [];
        return n && i.push(q), r && i.push(U), e.map((e => {
          const {idx: n} = e, r = {
            item: t[n],
            refIndex: n
          };
          return i.length && i.forEach((t => {
            t(e, r);
          })), r;
        }));
      }(o, this._docs, {
        includeMatches: n,
        includeScore: r
      });
    }
    _searchStringList(e) {
      const t = O(e, this.options), {records: n} = this._myIndex, r = [];
      return n.forEach((({v: e, i: n, n: i}) => {
        if (!u(e)) return;
        const {isMatch: a, score: s, indices: o} = t.searchIn(e);
        a && r.push({
          item: e,
          idx: n,
          matches: [ {
            score: s,
            value: e,
            norm: i,
            indices: o
          } ]
        });
      })), r;
    }
    _searchLogical(e) {
      const t = H(e, this.options), n = (e, t, r) => {
        if (!e.children) {
          const {keyId: n, searcher: i} = e, a = this._findMatches({
            key: this._keyStore.get(n),
            value: this._myIndex.getValueForItemAtKeyId(t, n),
            searcher: i
          });
          return a && a.length ? [ {
            idx: r,
            item: t,
            matches: a
          } ] : [];
        }
        switch (e.operator) {
         case N:
          {
            const i = [];
            for (let a = 0, s = e.children.length; a < s; a += 1) {
              const s = e.children[a], o = n(s, t, r);
              if (!o.length) return [];
              i.push(...o);
            }
            return i;
          }

         case '$or':
          {
            const i = [];
            for (let a = 0, s = e.children.length; a < s; a += 1) {
              const s = e.children[a], o = n(s, t, r);
              if (o.length) {
                i.push(...o);
                break;
              }
            }
            return i;
          }
        }
      }, r = this._myIndex.records, i = {}, a = [];
      return r.forEach((({$: e, i: r}) => {
        if (u(e)) {
          let s = n(t, e, r);
          s.length && (i[r] || (i[r] = {
            idx: r,
            item: e,
            matches: []
          }, a.push(i[r])), s.forEach((({matches: e}) => {
            i[r].matches.push(...e);
          })));
        }
      })), a;
    }
    _searchObjectList(e) {
      const t = O(e, this.options), {keys: n, records: r} = this._myIndex, i = [];
      return r.forEach((({$: e, i: r}) => {
        if (!u(e)) return;
        let a = [];
        n.forEach(((n, r) => {
          a.push(...this._findMatches({
            key: n,
            value: e[r],
            searcher: t
          }));
        })), a.length && i.push({
          idx: r,
          item: e,
          matches: a
        });
      })), i;
    }
    _findMatches({key: e, value: t, searcher: n}) {
      if (!u(t)) return [];
      let r = [];
      if (o(t)) t.forEach((({v: t, i: i, n: a}) => {
        if (!u(t)) return;
        const {isMatch: s, score: o, indices: c} = n.searchIn(t);
        s && r.push({
          score: o,
          key: e,
          value: t,
          idx: i,
          norm: a,
          indices: c
        });
      })); else {
        const {v: i, n: a} = t, {isMatch: s, score: o, indices: c} = n.searchIn(i);
        s && r.push({
          score: o,
          key: e,
          value: i,
          norm: a,
          indices: c
        });
      }
      return r;
    }
  }
  G.version = '6.4.6', G.createIndex = C, G.parseIndex = function(e, {getFn: t = b.getFn} = {}) {
    const {keys: n, records: r} = e, i = new S({
      getFn: t
    });
    return i.setKeys(n), i.setIndexRecords(r), i;
  }, G.config = b, function(...e) {
    z.push(...e);
  }(class {
    constructor(e, {isCaseSensitive: t = b.isCaseSensitive, includeMatches: n = b.includeMatches, minMatchCharLength: r = b.minMatchCharLength, ignoreLocation: i = b.ignoreLocation, findAllMatches: a = b.findAllMatches, location: s = b.location, threshold: o = b.threshold, distance: c = b.distance} = {}) {
      this.query = null, this.options = {
        isCaseSensitive: t,
        includeMatches: n,
        minMatchCharLength: r,
        findAllMatches: a,
        ignoreLocation: i,
        location: s,
        threshold: o,
        distance: c
      }, this.pattern = t ? e : e.toLowerCase(), this.query = function(e, t = {}) {
        return e.split('|').map((e => {
          let n = e.trim().split(D).filter((e => e && !!e.trim())), r = [];
          for (let e = 0, i = n.length; e < i; e += 1) {
            const i = n[e];
            let a = !1, s = -1;
            for (;!a && ++s < T; ) {
              const e = $[s];
              let n = e.isMultiMatch(i);
              n && (r.push(new e(n, t)), a = !0);
            }
            if (!a) for (s = -1; ++s < T; ) {
              const e = $[s];
              let n = e.isSingleMatch(i);
              if (n) {
                r.push(new e(n, t));
                break;
              }
            }
          }
          return r;
        }));
      }(this.pattern, this.options);
    }
    static condition(e, t) {
      return t.useExtendedSearch;
    }
    searchIn(e) {
      const t = this.query;
      if (!t) return {
        isMatch: !1,
        score: 1
      };
      const {includeMatches: n, isCaseSensitive: r} = this.options;
      e = r ? e : e.toLowerCase();
      let i = 0, a = [], s = 0;
      for (let r = 0, o = t.length; r < o; r += 1) {
        const o = t[r];
        a.length = 0, i = 0;
        for (let t = 0, r = o.length; t < r; t += 1) {
          const r = o[t], {isMatch: c, indices: l, score: d} = r.search(e);
          if (!c) {
            s = 0, i = 0, a.length = 0;
            break;
          }
          if (i += 1, s += d, n) {
            const e = r.constructor.type;
            _.has(e) ? a = [ ...a, ...l ] : a.push(l);
          }
        }
        if (i) {
          let e = {
            isMatch: !0,
            score: s / i
          };
          return n && (e.indices = a), e;
        }
      }
      return {
        isMatch: !1,
        score: 1
      };
    }
  });
  const V = async e => JSON.parse((await e.text()).trim().substr(9));
  document.head.innerHTML = `<title>${document.title}</title>`, document.body.innerHTML = '', 
  (async () => {
    const e = JSON.parse(document.documentElement.getAttribute('data-he-context'));
    var t;
    s.uid = localStorage.getItem('Session.UserId'), document.head.innerHTML = function(e, t, n, r) {
      t = t || function(e) {
        return null == e ? '' : String(e).replace(a, s);
      };
      var i = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&#34;',
        '\'': '&#39;'
      }, a = /[&<>'"]/g;
      function s(e) {
        return i[e] || e;
      }
      var o = '';
      function c(e) {
        null != e && (o += e);
      }
      return c('<meta charset="utf-8">\r\n<link rel="icon" href="https://s.brightspace.com/lib/favicon/2.0.0/favicon.ico">\r\n<title>'), 
      c(t(e.title)), c('</title>\r\n<meta name="description" content="D2l Overhaul">\r\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n\x3c!-- FONT --\x3e\r\n<style>/* fallback */\r\n@font-face {\r\n  font-family: \'Material Icons\';\r\n  font-style: normal;\r\n  font-weight: 400;\r\n  src: url(https://fonts.gstatic.com/s/materialicons/v99/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format(\'woff2\');\r\n}\r\n\r\n.material-icons {\r\n  font-family: \'Material Icons\';\r\n  font-weight: normal;\r\n  font-style: normal;\r\n  font-size: 24px;  /* Preferred icon size */\r\n  display: inline-block;\r\n  line-height: 1;\r\n  text-transform: none;\r\n  letter-spacing: normal;\r\n  word-wrap: normal;\r\n  white-space: nowrap;\r\n  direction: ltr;\r\n  user-select: none;\r\n\r\n  /* Support for all WebKit browsers. */\r\n  -webkit-font-smoothing: antialiased;\r\n  /* Support for Safari and Chrome. */\r\n  text-rendering: optimizeLegibility;\r\n\r\n  /* Support for Firefox. */\r\n  -moz-osx-font-smoothing: grayscale;\r\n\r\n  /* Support for IE. */\r\n  font-feature-settings: \'liga\';\r\n}\r\n/* Rules for sizing the icon. */\r\n.material-icons.md-18 { font-size: 18px; }\r\n.material-icons.md-24 { font-size: 24px; }\r\n.material-icons.md-36 { font-size: 36px; }\r\n.material-icons.md-48 { font-size: 48px; }\r\n\r\n/* Rules for using icons as black on a light background. */\r\n.material-icons.md-dark { color: rgba(0, 0, 0, 0.54); }\r\n.material-icons.md-dark.md-inactive { color: rgba(0, 0, 0, 0.26); }\r\n\r\n/* Rules for using icons as white on a dark background. */\r\n.material-icons.md-light { color: rgba(255, 255, 255, 1); }\r\n.material-icons.md-light.md-inactive { color: rgba(255, 255, 255, 0.3); }\r\n\r\n/* Rules for using icons as orange on a dark background. */\r\n.material-icons.orange600 { color: #FB8C00; }</style>\r\n<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" type="text/css">\r\n<link href="https://fonts.googleapis.com/css?family=Google+Sans:300,400,500" rel="stylesheet" type="text/css">\r\n\x3c!-- CSS --\x3e\r\n<style>:root {\r\n  --Background: #0c0c0c;\r\n  --Foreground: #18181b;\r\n  --Border: #252525;\r\n  --Text-Main: #fff;\r\n\r\n  --Active: #3367d6;\r\n}\r\n</style>\r\n<style>/* General Page Stuff */\nhtml,\nbody {\n  height: 100%;\n  width: 100%;\n  font-family: \'Roboto\', Helvetica, Arial, sans-serif;\n  color: var(--Text-Main); }\n\nbody {\n  margin: 0;\n  background-color: var(--Background);\n  position: relative; }\n\n* {\n  box-sizing: border-box; }\n\npicture,\npicture img {\n  display: block;\n  height: 100%;\n  width: 100%; }\n\n*::-webkit-scrollbar {\n  width: 16px; }\n\n*::-webkit-scrollbar-thumb {\n  background: #dadce0;\n  background-clip: padding-box;\n  border: 4px solid transparent;\n  border-radius: 8px;\n  box-shadow: none;\n  min-height: 50px; }\n\n*::-webkit-scrollbar-track {\n  background: none;\n  border: none; }\n\n/* Text */\nh1,\nh2 {\n  color: var(--Text-Main); }\n\nh1 {\n  font-size: 1.375rem;\n  font-weight: 500;\n  line-height: 1.75rem;\n  font-family: \'Google Sans\', Roboto, Arial, sans-serif; }\n\nh2 {\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.25rem;\n  margin: 0; }\n\n/* Aside */\n.SideBar {\n  display: flex;\n  flex-direction: column;\n  height: 100vh;\n  width: 19rem;\n  padding: 0.5rem 0;\n  z-index: 990;\n  box-shadow: 0 8px 10px 1px #00000024, 0 3px 14px 2px #0000001f,\r 0 5px 5px -3px #00000033;\n  background-color: var(--Foreground);\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  overflow-y: scroll;\n  max-width: 0;\n  transition: max-width 0.5s; }\n  .SideBar.Active {\n    max-width: 100%; }\n  .SideBar hr {\n    border-top: 0.0625rem solid var(--Border);\n    margin: 0.5rem; }\n\n.SideBarSection {\n  flex-grow: 1;\n  min-height: max-content; }\n\n.SideBarHeader {\n  padding: 0 1rem;\n  letter-spacing: 0.01785714em;\n  font-family: \'Google Sans\', Roboto, Arial, sans-serif;\n  font-size: 0.875rem;\n  font-weight: 500;\n  line-height: 1.25rem; }\n\n.SideBarItem {\n  display: flex;\n  align-content: center;\n  border-radius: 0 2rem 2rem 0;\n  height: 3.5rem;\n  padding-left: 1.5rem;\n  margin-right: 1rem;\n  cursor: pointer;\n  text-decoration: none;\n  color: #fff; }\n  .SideBarItem .SideBarItemText {\n    margin-left: 1rem;\n    font-family: \'Google Sans\', Roboto, Arial, sans-serif;\n    letter-spacing: 0.01785714em;\n    font-size: 0.875rem;\n    font-weight: 500;\n    overflow: hidden;\n    white-space: nowrap;\n    margin-right: 4rem;\n    text-overflow: ellipsis; }\n  .SideBarItem span {\n    line-height: 3.5rem; }\n  .SideBarItem:hover {\n    background-color: #343434; }\n\n/* Content */\n#Content {\n  min-height: 100%;\n  height: min-content;\n  width: 100%;\n  display: flex;\n  flex-direction: column; }\n\n#Content > * {\n  padding: 1rem; }\n\nmain {\n  height: 100%;\n  width: 100%; }\n\n/* Home Page */\n.Home > main {\n  max-width: 70rem;\n  margin: auto;\n  display: grid; }\n\n/* Loader Page */\n.Loader {\n  display: flex;\n  align-content: center;\n  flex-direction: column; }\n\n.lds-grid {\n  margin: auto;\n  display: grid;\n  grid-template-columns: repeat(3, 16px);\n  grid-template-rows: repeat(3, 16px);\n  grid-gap: 8px; }\n\n.lds-grid div {\n  border-radius: 50%;\n  background: #fff;\n  animation: lds-grid 1.2s linear infinite; }\n\n.lds-grid div:nth-child(1) {\n  animation-delay: 0s; }\n\n.lds-grid div:nth-child(2),\n.lds-grid div:nth-child(4) {\n  animation-delay: -0.4s; }\n\n.lds-grid div:nth-child(3),\n.lds-grid div:nth-child(5),\n.lds-grid div:nth-child(7) {\n  animation-delay: -0.8s; }\n\n.lds-grid div:nth-child(6),\n.lds-grid div:nth-child(8) {\n  animation-delay: -1.2s; }\n\n.lds-grid div:nth-child(9) {\n  animation-delay: -1.6s; }\n\n@keyframes lds-grid {\n  0%,\n  100% {\n    opacity: 1; }\n  50% {\n    opacity: 0.5; } }\n\n/* General */\n.Hidden,\n.Filtered {\n  display: none !important; }\n\n/* Hovers */\n.StreamCard {\n  cursor: pointer; }\n\n.StreamCard:hover {\n  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);\n  border-radius: 0.75rem; }\n\n/* Components */\n.NavBar {\n  padding: 0.75rem 1rem !important;\n  height: 4rem;\n  width: 100%;\n  background: var(--Foreground);\n  display: grid;\n  grid-template-columns: 2.5rem auto max-content;\n  position: relative; }\n  .NavBar .AsideButton {\n    display: flex;\n    align-content: center;\n    border-radius: 50%; }\n    .NavBar .AsideButton:hover {\n      background: var(--Background); }\n    .NavBar .AsideButton svg {\n      margin: auto;\n      width: 2rem;\n      height: 2rem; }\n  .NavBar input {\n    height: 2.5rem;\n    width: 50%;\n    margin: auto;\n    display: block;\n    background-color: #212121;\n    outline: none;\n    border: none;\n    border-radius: 0.5rem;\n    padding: 0.5rem;\n    color: #fff; }\n  .NavBar .Account {\n    display: grid;\n    grid-template-columns: repeat(4, 2.5rem);\n    grid-gap: 0.25rem; }\n    .NavBar .Account span {\n      width: 2.5rem;\n      height: 2.5rem;\n      text-align: center;\n      line-height: 2.5rem; }\n      .NavBar .Account span.Active {\n        color: #fb8c00; }\n    .NavBar .Account .Profile picture {\n      padding: 0.25rem; }\n    .NavBar .Account span,\n    .NavBar .Account div {\n      cursor: pointer;\n      border-radius: 0.5rem; }\n    .NavBar .Account span:hover,\n    .NavBar .Account div:hover {\n      background-color: #2f3033; }\n\n.ClassContainer {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  grid-gap: 2rem;\n  margin: 1rem auto;\n  width: 100%; }\n\n.classCard {\n  width: 100%;\n  aspect-ratio: 16 / 7;\n  position: relative;\n  border-radius: 1rem;\n  overflow: hidden;\n  cursor: pointer; }\n  .classCard img {\n    min-height: 100%;\n    width: 100%; }\n  .classCard picture {\n    display: block;\n    height: 100%;\n    width: 100%;\n    position: absolute;\n    top: 0;\n    left: 0; }\n  .classCard .classCardContent {\n    position: absolute;\n    width: 100%;\n    padding: 1rem 2rem;\n    bottom: 0;\n    left: 0; }\n    .classCard .classCardContent h4,\n    .classCard .classCardContent h6 {\n      color: #f2f2f2;\n      font-style: normal;\n      margin-bottom: 1rem;\n      margin-top: 0; }\n    .classCard .classCardContent h4 {\n      font-weight: bold;\n      font-size: 1.6rem;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap; }\n    .classCard .classCardContent h6 {\n      font-weight: 500;\n      font-size: 0.9rem; }\n  .classCard[disabled] img {\n    filter: brightness(0.5) blur(10px); }\n  .classCard:hover {\n    transform: scale(1.05); }\n\n.Profile {\n  height: 100%;\n  aspect-ratio: 1 / 1;\n  border-radius: 50%; }\n\n/* Stream */\n.Stream > main {\n  flex-grow: 1;\n  min-height: max-content;\n  width: calc(100% - 2 * 1.5rem);\n  max-width: 62.5rem;\n  margin: 0 auto;\n  padding: 0 !important; }\n\n.ClassPicture {\n  margin: 1.5rem 0;\n  overflow: hidden;\n  border-radius: 1rem;\n  position: relative; }\n\n.ClassPictureContent {\n  display: flex;\n  flex-direction: column;\n  padding: 1.5rem;\n  margin: 0;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%; }\n  .ClassPictureContent h1,\n  .ClassPictureContent h2 {\n    margin: 0; }\n  .ClassPictureContent h4 {\n    margin-top: 0.4rem;\n    font-weight: 500;\n    font-style: normal; }\n\n.ChipFilter {\n  display: inline-flex;\n  height: max-content;\n  width: max-content;\n  padding: 0.25rem 0.5rem;\n  border: 0.0625rem solid var(--Border);\n  border-radius: 2rem;\n  font-size: 0.75rem;\n  cursor: pointer;\n  user-select: none;\n  background-color: var(--Foreground); }\n  .ChipFilter .chipIcon {\n    border-radius: 50%;\n    padding: 0.25rem;\n    font-size: 0.75rem;\n    margin-right: 0.25rem;\n    background-color: var(--Active); }\n  .ChipFilter p {\n    margin: auto;\n    display: inline-block; }\n  .ChipFilter:hover {\n    background-color: #343434; }\n  .ChipFilter.Active {\n    background-color: var(--Active); }\n\n/* Stream Cards */\n.StreamCard {\n  width: 100%;\n  height: 4rem;\n  background-color: var(--Foreground);\n  border: 0.0625rem solid var(--Border);\n  border-radius: 0.5rem;\n  display: grid;\n  grid-template-columns: max-content 1fr;\n  grid-template-rows: 3rem max-content;\n  grid-template-areas: \'Icon Title\'\r \'Content Content\';\n  padding: 0.5rem;\n  grid-gap: 0.5rem;\n  margin: 1rem 0; }\n  .StreamCard h1,\n  .StreamCard h3 {\n    margin: 0; }\n  .StreamCard h3 {\n    font-size: 0.75rem; }\n  .StreamCard.Active,\n  .StreamCard.Active > .StreamCardBody {\n    height: max-content; }\n\n.StreamCardTitle {\n  grid-area: Title; }\n\n.StreamCardIcon {\n  grid-area: Icon;\n  background-color: var(--Background);\n  width: 3rem;\n  height: 3rem;\n  border-radius: 2rem;\n  display: flex;\n  align-content: center; }\n  .StreamCardIcon.OnSubmission {\n    background-color: var(--Active); }\n  .StreamCardIcon.DueDate {\n    background-color: #e91e63; }\n  .StreamCardIcon.Unread {\n    background-color: #fb8c00; }\n  .StreamCardIcon span {\n    margin: auto; }\n\n.StreamIframe {\n  border: none;\n  overflow: hidden;\n  height: calc(100vh - 64px);\n  width: 100%;\n  background: #fff; }\n\n.StreamCardBody {\n  grid-area: Content;\n  overflow: hidden;\n  width: 100%;\n  height: 0;\n  cursor: auto; }\n  .StreamCardBody img,\n  .StreamCardBody video {\n    border-radius: 0.5rem; }\n  .StreamCardBody .btn {\n    display: block;\n    background-color: var(--Active);\n    padding: 0.75rem 1rem;\n    color: #fff;\n    border-radius: 0.5rem;\n    height: max-content;\n    width: max-content;\n    text-decoration: none; }\n    .StreamCardBody .btn:hover {\n      background-color: #fb8c00; }\n  .StreamCardBody object {\n    aspect-ratio: 16 /9; }\n  .StreamCardBody .Loader {\n    min-height: 20rem; }\n\n.FileSubmit {\n  height: 12.5rem;\n  display: grid;\n  grid-template-columns: 75% 1fr; }\n  .FileSubmit .UploadedFiles {\n    display: flex;\n    flex-wrap: wrap;\n    overflow-y: auto; }\n    .FileSubmit .UploadedFiles .UploadedFile {\n      width: 8rem;\n      height: 4.5rem;\n      background: var(--Background);\n      border-radius: 0.5rem;\n      margin: 0.25rem;\n      position: relative;\n      overflow: hidden; }\n      .FileSubmit .UploadedFiles .UploadedFile .FileTitle {\n        position: absolute;\n        bottom: 0;\n        left: 0;\n        width: 100%;\n        background-color: rgba(0, 0, 0, 0.75);\n        color: #fff;\n        font-size: 0.75rem;\n        white-space: nowrap;\n        text-overflow: ellipsis;\n        padding: 0 0.5rem; }\n      .FileSubmit .UploadedFiles .UploadedFile .FileRemove {\n        position: absolute;\n        top: 0;\n        right: 0;\n        background-color: rgba(0, 0, 0, 0.75);\n        color: #fff;\n        font-size: 0.75rem;\n        padding: 0.25rem;\n        border-radius: 0 0 0 0.5rem; }\n  .FileSubmit .FileForm {\n    display: flex;\n    flex-direction: column; }\n    .FileSubmit .FileForm textarea {\n      background-color: #222222;\n      border: 0.0625rem solid var(--Border);\n      flex-grow: 1;\n      border-radius: 0.5rem;\n      resize: none;\n      outline: none;\n      color: #fff;\n      padding: 0.5rem; }\n    .FileSubmit .FileForm button {\n      background-color: var(--Active);\n      margin-top: 1rem;\n      height: 2rem;\n      border-radius: 0.5rem;\n      border: none;\n      outline: none;\n      cursor: pointer; }\n      .FileSubmit .FileForm button:hover {\n        opacity: 0.75; }\n\n.DropDown {\n  min-height: 30rem;\n  width: 25rem;\n  border-radius: 0.5rem;\n  border: 0.0625rem solid var(--Border);\n  background-color: var(--Foreground);\n  position: absolute;\n  top: 100%;\n  right: 0;\n  z-index: 2;\n  padding: 1rem;\n  margin: -0.25rem 0.5rem;\n  overflow-y: scroll; }\n\n.NotificationShade {\n  list-style: none;\n  padding-inline-start: 0; }\n  .NotificationShade li {\n    border-bottom: 1px solid white;\n    padding-top: 1rem; }\n    .NotificationShade li a {\n      color: #fff;\n      text-decoration: none;\n      font-size: 1.5rem;\n      display: -webkit-box;\n      -webkit-line-clamp: 1;\n      -webkit-box-orient: vertical;\n      overflow: hidden; }\n    .NotificationShade li img {\n      display: none; }\n</style>'), 
      o;
    }({
      title: document.title
    }), document.body.innerHTML = function(e, t, n, r) {
      var i = '';
      function a(e) {
        null != e && (i += e);
      }
      return a('<aside class="SideBar" id="SideBar"></aside>\r\n<section id="Content">\r\n  \x3c!-- NavBar --\x3e\r\n  '), 
      a(e.navBar), a('\r\n  \x3c!-- Main Body --\x3e\r\n  <main id="main" class="Loader">\r\n    <div class="lds-grid">\r\n      <div></div>\r\n      <div></div>\r\n      <div></div>\r\n      <div></div>\r\n      <div></div>\r\n      <div></div>\r\n      <div></div>\r\n      <div></div>\r\n      <div></div>\r\n    </div>\r\n  </main>\r\n</section>'), 
      i;
    }({
      content: null,
      navBar: (t = '', t += '<nav class="NavBar" id="NavBar">\r\n  <div class="AsideButton" id="AsideButtton">\r\n    <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" class=" NMm5M"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>\r\n  </div>\r\n  <div>\r\n    <input id="Search" placeholder="Search" type="text" />\r\n  </div>\r\n  <div class="Account">\r\n    <span class="material-icons" id="MailButton">\r\n      mail\r\n    </span>\r\n    <span class="material-icons" id="MessageButton">\r\n      message\r\n    </span>      \r\n    <span class="material-icons" id="NotificationButton">\r\n      notifications\r\n    </span>\r\n    <div class="Profile" id="AccountButtton">\r\n      <picture>\r\n        <img src="https://durham.elearningontario.ca/d2l/api/lp/1.32/profile/myProfile/image" />\r\n      </picture>\r\n    </div>\r\n  </div>\r\n</nav>', 
      t)
    });
    const n = document.createElement('script');
    n.src = chrome.runtime.getURL('./client.js'), document.body.appendChild(n), ((e, t) => {
      const n = document.getElementById('main'), r = document.getElementById('SideBar'), i = document.getElementById('AsideButtton'), a = document.getElementById('Search'), s = document.getElementById('MailButton'), o = document.getElementById('MessageButton'), c = document.getElementById('NotificationButton');
      i.addEventListener('click', (e => {
        e.stopPropagation(), r.classList.add('Active');
      })), a.addEventListener('keyup', (() => {
        const e = [];
        if (n.querySelectorAll('.Search').forEach((t => e.push(...t.children))), '' == a.value.trim()) return void e.forEach((e => e.classList.toggle('Hidden', !1)));
        const t = e.map(((e, t) => ({
          Name: e.querySelector('h1').innerText,
          Teacher: e.querySelector('h2')?.innerText || '',
          child: e,
          id: t
        }))), r = (i = t, s = a.value, new G(i, {
          isCaseSensitive: !1,
          includeScore: !0,
          shouldSort: !0,
          useExtendedSearch: !0,
          ignoreLocation: !0,
          keys: [ 'Name', 'Teacher' ]
        }).search(s));
        var i, s;
        t.forEach((e => {
          e.child.classList.toggle('Hidden', !r.some((t => t.item.id == e.id && t.score < .5)));
        }));
      }));
      const l = async () => {
        const e = await fetch('/d2l/activityFeed/checkForNewAlerts?isXhr=true&requestId=3&X-D2L-Session=no-keep-alive'), t = await V(e);
        t.Payload && [ 'Messages', 'Grades' ].forEach((e => {
          const n = t.Payload.includes(e);
          switch (e) {
           case 'Messages':
            s.classList.toggle('Active', n);
            break;

           case 'Grades':
            c.classList.toggle('Active', n);
            break;

           default:
            alert(`Unknown Notification Type ${e}`);
          }
        }));
      };
      l(), setInterval((() => l()), 5e3);
      const d = async (n, r) => {
        n.stopPropagation();
        const i = document.getElementById('DropDown');
        var a;
        i && i.remove(), e.insertAdjacentHTML('beforeend', (a = '', a += '<div class="DropDown" id="DropDown">\r\n  <h3>Notifications</h3>\r\n  <hr />\r\n  <ul class="NotificationShade">\r\n  </ul>\r\n</div>'));
        let s = '';
        switch (r) {
         case 'MailButton':
          {
            const e = await fetch(`/d2l/MiniBar/${t.cid}/ActivityFeed/GetAlertsDaylight?Category=2&_d2l_prc$headingLevel=2&_d2l_prc$scope=&_d2l_prc$hasActiveForm=false&isXhr=true&requestId=3`, {
              method: 'GET'
            });
            s = (await V(e)).Payload.Html;
            break;
          }

         case 'MessageButton':
          break;

         case 'NotificationButton':
          {
            const e = await fetch(`/d2l/MiniBar/${t.cid}/ActivityFeed/GetAlertsDaylight?Category=1&_d2l_prc$headingLevel=2&_d2l_prc$scope=&_d2l_prc$hasActiveForm=false&isXhr=true&requestId=3`, {
              method: 'GET'
            });
            s = (await V(e)).Payload.Html;
            break;
          }
        }
        const o = document.getElementById('DropDown'), c = (new DOMParser).parseFromString(s, 'text/html');
        o.querySelector('.NotificationShade').innerHTML = c.querySelector('.vui-list').innerHTML, 
        o.addEventListener('click', (e => e.stopPropagation()));
      };
      s.addEventListener('click', (e => d(e, 'MailButton'))), o.addEventListener('click', (e => d(e, 'MessageButton'))), 
      c.addEventListener('click', (e => d(e, 'NotificationButton'))), document.addEventListener('click', (() => {
        const e = document.getElementById('DropDown');
        e && e.remove(), r.classList.contains('Active') && r.classList.remove('Active');
      }));
    })(document.getElementById('NavBar'), s), (async (e, t) => {
      const n = (new Date).valueOf(), r = await fetch(`https://bc59e98c-eabc-4d42-98e1-edfe93518966.enrollments.api.brightspace.com/users/${t.uid}?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false`, {
        headers: {
          authorization: `Bearer ${await t.getToken()}`
        }
      }).then((e => e.json())), i = await Promise.all(r.entities.map((async ({href: e}) => {
        const r = await fetch(e, {
          headers: {
            authorization: `Bearer ${await t.getToken()}`
          },
          method: 'GET'
        }), i = await r.json(), a = await fetch(i.links[1].href, {
          headers: {
            authorization: `Bearer ${await t.getToken()}`
          },
          method: 'GET'
        }), s = await a.json(), {endDate: o, name: c} = s.properties;
        return {
          name: c,
          disabled: new Date(o).valueOf() < n,
          href: s.links[0].href.replace('https://bc59e98c-eabc-4d42-98e1-edfe93518966.folio.api.brightspace.com/organizations/', 'https://durham.elearningontario.ca/d2l/home/')
        };
      })));
      e.innerHTML = function(e, t, n, r) {
        t = t || function(e) {
          return null == e ? '' : String(e).replace(a, s);
        };
        var i = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&#34;',
          '\'': '&#39;'
        }, a = /[&<>'"]/g;
        function s(e) {
          return i[e] || e;
        }
        var o = '';
        function c(e) {
          null != e && (o += e);
        }
        return c('<a class="SideBarItem" id="SideBarClassesBtn"><span class="material-icons">home</span><span class="SideBarItemText">Classes</span></a>\r\n<a class="SideBarItem" id="SideBarCalenderBtn"><span class="material-icons">calendar_today</span><span class="SideBarItemText">Calender</span></a>\r\n<hr />\r\n<div class="SideBarSection" id="SideBarClasses">\r\n  <div class="SideBarHeader">Enrolled</div>\r\n  '), 
        e.classes.forEach((e => {
          c('\r\n    '), e.disabled || (c('\r\n      <a class="SideBarItem" id="SideBarCalenderBtn" href="'), 
          c(t(e.href)), c('"><span class="material-icons">class</span><span class="SideBarItemText">'), 
          c(t(e.name)), c('</span></a>\r\n    ')), c('\r\n  ');
        })), c('\r\n</div>\r\n<hr />\r\n<a class="SideBarItem" id="SideBarSettingsBtn"><span class="material-icons">settings</span><span class="SideBarItemText">Settings</span></a>'), 
        o;
      }({
        classes: i
      }), document.getElementById('SideBarClassesBtn').addEventListener('click', (() => {
        t.setPage('HOME');
      }));
    })(document.getElementById('SideBar'), s), await s.start(e);
  })();
}();
