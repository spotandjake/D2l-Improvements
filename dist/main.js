!function() {
  function e(e, t, n, i) {
    t = t || function(e) {
      return null == e ? '' : String(e).replace(a, s);
    };
    var r = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&#34;',
      '\'': '&#39;'
    }, a = /[&<>'"]/g;
    function s(e) {
      return r[e] || e;
    }
    var o = '';
    function c(e) {
      null != e && (o += e);
    }
    if (c('<div class="StreamCard" id="'), c(e.Id), c('" Category="'), c(e.Category), 
    c('" _url="'), c(e._url), c('">\n  <div class="StreamCardIcon '), c(e.CompletionType), 
    c('">\n    <span class="material-icons">\n      '), 'Info' == e.type ? c('\n        account_circle\n      ') : 'Content' == e.type ? c('\n        class\n      ') : 'Assignment' == e.type ? c('\n        assignment\n      ') : c('\n        article\n      '), 
    c('\n    </span>\n  </div>\n  <div class="StreamCardTitle">\n    <h1>'), c(t(e.Title)), 
    c('</h1>\n    <h3>'), c(t(e.StartDate)), c('</h3>\n  </div>\n  <div class="StreamCardBody">\n    '), 
    'Assignment' == e.type) c('\n      <div class="FileSubmit">\n        <div class="UploadedFiles"></div>\n        <div class="FileForm">\n          <span>10/10</span>\n          <hr />\n          <textarea class="FileFormDescription"></textarea>\n          <button class="FileFormAdd">Add or create</button>\n          <button class="FileFormSubmit">Submit</button>\n        </div>\n      </div>\n    '); else if ('Quiz' == e.type) c('\n      <div>\n        <div>\n          '), 
    c(e.Body.Html), c('\n        </div>\n        <div>\n          <a class="btn" href="'), 
    c(e._url), c('">Start Quiz</a>\n        </div>\n      </div>\n    '); else if ('Content' == e.type) {
      c('\n      <div class="Loader">\n        <div class="lds-grid">\n          ');
      for (let e = 0; e < 9; e++) c('\n            <div></div>\n          ');
      c('\n        </div>\n      </div>\n    ');
    } else c('\n      '), c(e.Body.Html), c('\n    ');
    return c('\n  </div>\n</div>\n'), o;
  }
  class t {
    constructor(e, t, n, i, r) {
      this.Handler = new Map, window.postMessage({
        type: 'FROM_EXTENSION',
        action: 'LOAD',
        config: {
          developerKey: e,
          clientId: t,
          appId: n,
          scope: i,
          mimeTypes: r
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
  const n = 'xxBOUNDARYxx', i = (e, t) => {
    const i = `--${n}--\r\n`, r = `--${n}\r\n`;
    let a = `${r}Content-Type: application/json\r\n\r\n${JSON.stringify(e)}\r\n`;
    return t.forEach((({fileName: e, fileType: t, fileContent: n}) => {
      a += `${r}Content-Disposition: form-data; name=""; filename="${e}"\r\nContent-Type: ${t}\r\n\r\n${n}\r\n${i}`;
    })), a;
  }, r = 'HOME', a = 'STREAM', s = new class {
    constructor() {
      this.orgID = 'bc59e98c-eabc-4d42-98e1-edfe93518966', this.location = r, this.token, 
      this.data = {}, this.uid, this.cid, this.cancel, this.apiVersion = {};
    }
    async start(e) {
      this.data = e, this.cid = e.orgUnitId, await this._apiVersion(), setInterval((() => this.getToken(!0)), 3e5);
      let t = r;
      switch (!0) {
       case /\/d2l\/home\/[^/]+$/.test(window.location.pathname):
        t = a, this.cid = window.location.pathname.replace('/d2l/home/', '');
        break;

       case '/d2l/home' == window.location.pathname:
       default:
        t = r;
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
       case r:
        for (this.cid = null, this.cancel = (async e => {
          const t = (new Date).valueOf(), n = document.getElementById('main'), i = await fetch(`https://${e.orgID}.enrollments.api.brightspace.com/users/${e.uid}?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false`, {
            headers: {
              authorization: `Bearer ${await e.getToken()}`
            }
          }).then((e => e.json())), r = await Promise.all(i.entities.map((async ({href: n}) => {
            const i = await fetch(n, {
              headers: {
                authorization: `Bearer ${await e.getToken()}`
              }
            }), r = await i.json(), a = await fetch(r.links[1].href, {
              headers: {
                authorization: `Bearer ${await e.getToken()}`
              }
            }), s = await a.json(), o = await fetch(s.entities[2].href).then((e => e.json())).catch((async () => await fetch(s.entities[2].href, {
              headers: {
                authorization: `Bearer ${await e.getToken()}`
              }
            }).then((e => e.json())).catch((() => 'https://blog.fluidui.com/content/images/2019/01/imageedit_1_9273372713.png')))), {endDate: c, name: l} = s.properties;
            return {
              name: l,
              disabled: new Date(c).valueOf() < t,
              href: s.links[0].href.replace(`https://${e.orgID}.folio.api.brightspace.com/organizations/`, 'https://durham.elearningontario.ca/d2l/home/'),
              picture: o.links ? o.links[2].href : o,
              Text: `Closes | ${new Date(c).toDateString()}`
            };
          })));
          n.innerHTML = function(e, t, n, i) {
            t = t || function(e) {
              return null == e ? '' : String(e).replace(a, s);
            };
            var r = {
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&#34;',
              '\'': '&#39;'
            }, a = /[&<>'"]/g;
            function s(e) {
              return r[e] || e;
            }
            var o = '';
            function c(e) {
              null != e && (o += e);
            }
            return c('<section class="ClassContainer Search" id="ClassContainer">\n  '), e.classes.forEach((e => {
              c('\n    <div class="classCard" '), c(t(e.disabled ? 'disabled' : '')), c(' class_link="'), 
              c(t(e.href)), c('">\n      <picture>\n        <img src="'), c(e.picture), c('">\n      </picture>\n      <div class="classCardContent">\n        <h4>'), 
              c(t(e.name)), c('</h4>\n        <h6>'), c(t(e.disabled ? 'Closed' : e.Text)), c('</h6>\n      </div>\n    </div>\n  ');
            })), c('\n</section>'), o;
          }({
            classes: r
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
        for (this.cancel = (async r => {
          const a = document.getElementById('main'), s = await fetch(`https://${r.orgID}.organizations.api.brightspace.com/${r.cid}`, {
            headers: {
              Accept: 'application/vnd.siren+json',
              authorization: `Bearer ${await r.getToken()}`
            }
          }), o = await s.json(), c = await fetch(o.entities[2].href), l = await c.json().catch((() => 'https://durham.elearningontario.ca/d2l/img/0/Framework.UserProfileBadge.actProfileDaylight100.png?v=20.21.8.31658')), d = {
            name: o.properties.name,
            description: o.properties.description,
            picture: l.links ? l.links[2].href : l
          }, {html: h, assignments: u} = await (async t => {
            const n = [], i = await fetch(`/d2l/api/le/${t.apiVersion.le}/${t.cid}/news/`);
            (await i.json()).forEach((t => {
              t.StartDate = new Date(t.StartDate).toDateString(), t.Category = 'ChipFilterHome', 
              t.type = 'Info', n.push({
                date: new Date(t.StartDate).valueOf(),
                element: e({
                  ...t,
                  CompletionType: 'OnSubmission'
                })
              });
            }));
            const r = await fetch(`/d2l/api/le/unstable/${t.cid}/content/userprogress/?pageSize=99999`), a = await r.json(), s = async e => {
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
                    const i = await fetch(`/d2l/api/le/${t.apiVersion.le}/${t.cid}/content/modules/${e.Id}/structure/`), r = await i.json();
                    n.push(...await s(r));
                    break;
                  }
                }
              }))), n;
            }, o = await fetch(`/d2l/api/le/${t.apiVersion.le}/${t.cid}/content/root/`), c = await o.json(), l = await s(c);
            for (const t of l) {
              const i = 1 == t.ActivityType ? `${window.location.origin}${t.Url}` : t.Url;
              n.push({
                date: new Date(t.LastModifiedDate).valueOf(),
                element: e({
                  Id: t.Id,
                  Category: 'ChipFilterContent',
                  type: 'Content',
                  Title: t.Title,
                  CompletionType: t.isRead ? 'OnSubmission' : 'Unread',
                  StartDate: new Date(t.LastModifiedDate).toDateString(),
                  _url: i
                })
              });
            }
            const d = await fetch(`/d2l/api/le/${t.apiVersion.le}/${t.cid}/dropbox/folders/`), h = await d.json();
            for (const i of h) {
              const r = i.GradeItemId ? await fetch(`/d2l/api/le/${t.apiVersion.le}/${t.cid}/grades/${i.GradeItemId}/values/${t.uid}`).then((e => e.json())).catch((() => 'Mark could not be retrieved')) : 'Not Yet Marked';
              console.log(r), n.push({
                date: new Date(i.DueDate).valueOf(),
                element: e({
                  Id: i.Id,
                  Category: 'ChipFilterAssignments',
                  type: 'Assignment',
                  Title: i.Name,
                  CompletionType: [ 'OnSubmission', 'DueDate', 'OnSubmission', 'OnSubmission' ][i.CompletionType],
                  StartDate: new Date(i.DueDate).toDateString(),
                  Body: {
                    Html: ''
                  }
                })
              });
            }
            const u = await fetch(`/d2l/api/le/${t.apiVersion.le}/${t.cid}/quizzes/`), m = await u.json();
            for (const i of m.Objects) n.push({
              date: new Date(i.DueDate).valueOf(),
              element: e({
                Id: i.QuizId,
                Category: 'ChipFilterQuizzes',
                type: 'Quiz',
                Title: i.Name,
                CompletionType: 'OnSubmission',
                StartDate: new Date(i.DueDate).toDateString(),
                Body: {
                  Html: i.Description.Text.Html
                },
                _url: `/d2l/lms/quizzing/user/quiz_summary.d2l?qi=${i.QuizId}&ou=${t.cid}`
              })
            });
            return {
              html: n.sort(((e, t) => t.date - e.date)).map((e => e.element)).join('\n'),
              assignments: h,
              content: l
            };
          })(r);
          a.innerHTML = function(e, t, n, i) {
            t = t || function(e) {
              return null == e ? '' : String(e).replace(a, s);
            };
            var r = {
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&#34;',
              '\'': '&#39;'
            }, a = /[&<>'"]/g;
            function s(e) {
              return r[e] || e;
            }
            var o = '';
            function c(e) {
              null != e && (o += e);
            }
            return c('\x3c!-- Top --\x3e\n<section class="ClassPicture">\n  <picture>\n    <img src="'), 
            c(t(e.classData.picture)), c('" />\n  </picture>\n  <div class="ClassPictureContent">\n    <h1>'), 
            c(t(e.classData.name)), c('</h1>\n    <h2>'), c(t(e.classData.description)), c('</h2>\n  </div>\n</section>\n<div class="StreamFilter" id="ChipFilters">\n  <div class="ChipFilter Active" id="ChipFilterHome"><span class="material-icons chipIcon">home</span><p>Stream</p></div>\n  <div class="ChipFilter Active" id="ChipFilterContent"><span class="material-icons chipIcon">source</span><p>Content</p></div>\n  <div class="ChipFilter Active" id="ChipFilterDiscussions"><span class="material-icons chipIcon">chat</span><p>Discussions</p></div>\n  <div class="ChipFilter Active" id="ChipFilterAssignments"><span class="material-icons chipIcon">assignment</span><p>Assignments</p></div>\n  <div class="ChipFilter Active" id="ChipFilterQuizzes"><span class="material-icons chipIcon">quiz</span><p>Quizzes</p></div>\n</div>\n\x3c!-- Stream Announcements --\x3e\n<section class="StreamCards Search Filter">'), 
            c(e.announcements), c('</section>\n'), o;
          }({
            announcements: h,
            classData: d
          });
          const m = async e => {
            if (e.classList.contains('Active')) e.classList.remove('Active'); else if (e.classList.add('Active'), 
            'ChipFilterContent' == e.getAttribute('Category')) {
              e.querySelector('.StreamCardIcon').classList.contains('Unread') && (await fetch(`/d2l/api/le/unstable/${r.cid}/content/topics/${e.id}/view`, {
                headers: {
                  authorization: `Bearer ${await r.getToken()}`
                },
                method: 'POST'
              }), e.querySelector('.StreamCardIcon').classList.remove('Unread'), e.querySelector('.StreamCardIcon').classList.add('OnSubmission')), 
              e.classList.add('Active');
              const t = e.getAttribute('_url');
              let n = `<a class="btn" href="${t}">View Content</a>`;
              switch (!0) {
               case /docs\.google\.com/i.test(t):
                n = `<iframe allow="encrypted-media *;" width="100%" scrolling="no" src="${t}"></iframe>`;
                break;

               case /www\.youtube\.com/i.test(t):
                n = `<object data="https://www.youtube.com/embed/${new URL(t).searchParams.get('v')}" type="application/pdf" width="100%" height="auto">\n            <embed src="https://www.youtube.com/embed/${new URL(t).searchParams.get('v')} type="application/pdf"></embed></object>`;
                break;

               case /\.(doc|docm|docm|docx|docx|dotx|potx|ppt|pptm|pptm|pptx|xlw|xls|xlsm|xlsm|xlsx|xltx)/i.test(t):
                break;

               case /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)/i.test(t):
                n = `<picture class="contentMedia"><img src="${t}" /></picture>`;
                break;

               case /\.(3gp|aac|flac|mpg|mpeg|mp3|mp4|m4a|m4v|m4p|oga|ogg|ogv|ogg|mov|wav|webm)/i.test(t):
                n = `<video class="contentMedia" controls><source src="${t}" /></video>`;

               case /\.(pdf)/i.test(t):
               case _content.startsWith('/') && /\.(html|htm)/i.test(t):
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
                    n.insertAdjacentHTML('beforeend', function(e, t, n, i) {
                      t = t || function(e) {
                        return null == e ? '' : String(e).replace(a, s);
                      };
                      var r = {
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&#34;',
                        '\'': '&#39;'
                      }, a = /[&<>'"]/g;
                      function s(e) {
                        return r[e] || e;
                      }
                      var o = '';
                      function c(e) {
                        null != e && (o += e);
                      }
                      return c('<div class="UploadedFile" onClick="window.open(\''), c(e.href), c('\');" documentId="'), 
                      c(e.documentId), c('">\n  <picture>\n    <img src="'), c(e.thumbnail), c('" />\n  </picture>\n  <span class="FileTitle">'), 
                      c(t(e.name)), c('</span>\n  <span class="FileRemove material-icons" onClick="this.parentNode.remove();event.stopPropagation();">close</span>\n</div>'), 
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
              const s = await fetch(`/d2l/api/le/1.41/${r.cid}/dropbox/folders/${e.id}/submissions/mysubmissions/`, {
                method: 'POST',
                headers: {
                  authorization: `Bearer ${await r.getToken()}`,
                  'Content-Type': `multipart/mixed;boundary=${n}`
                },
                body: i({
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
    let t = null, n = null, i = null, r = 1;
    if (c(e) || o(e)) i = e, t = y(e), n = w(e); else {
      if (!g.call(e, 'name')) throw new Error('Missing name property in key');
      const a = e.name;
      if (i = a, g.call(e, 'weight') && (r = e.weight, r <= 0)) throw new Error((e => `Property 'weight' in key '${e}' must be a positive integer`)(a));
      t = y(a), n = w(a);
    }
    return {
      path: t,
      id: n,
      weight: r,
      src: i
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
      let n = [], i = !1;
      const r = (e, t, a) => {
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
            i = !0;
            for (let e = 0, n = s.length; e < n; e += 1) r(s[e], t, a + 1);
          } else t.length && r(s, t, a + 1);
        } else n.push(e);
      };
      return r(e, c(t) ? t.split('.') : t, 0), i ? n : n[0];
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
            const i = e.match(x).length;
            if (t.has(i)) return t.get(i);
            const r = 1 / Math.sqrt(i), a = parseFloat(Math.round(r * n) / n);
            return t.set(i, a), a;
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
      this.keys.forEach(((t, i) => {
        let r = this.getFn(e, t.path);
        if (u(r)) if (o(r)) {
          let e = [];
          const t = [ {
            nestedArrIndex: -1,
            value: r
          } ];
          for (;t.length; ) {
            const {nestedArrIndex: n, value: i} = t.pop();
            if (u(i)) if (c(i) && !m(i)) {
              let t = {
                v: i,
                i: n,
                n: this.norm.get(i)
              };
              e.push(t);
            } else o(i) && i.forEach(((e, n) => {
              t.push({
                nestedArrIndex: n,
                value: e
              });
            }));
          }
          n.$[i] = e;
        } else if (!m(r)) {
          let e = {
            v: r,
            n: this.norm.get(r)
          };
          n.$[i] = e;
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
    const i = new S({
      getFn: n
    });
    return i.setKeys(e.map(v)), i.setSources(t), i.create(), i;
  }
  function k(e, {errors: t = 0, currentLocation: n = 0, expectedLocation: i = 0, distance: r = b.distance, ignoreLocation: a = b.ignoreLocation} = {}) {
    const s = t / e.length;
    if (a) return s;
    const o = Math.abs(i - n);
    return r ? s + o / r : o ? 1 : s;
  }
  function M(e, t, n, {location: i = b.location, distance: r = b.distance, threshold: a = b.threshold, findAllMatches: s = b.findAllMatches, minMatchCharLength: o = b.minMatchCharLength, includeMatches: c = b.includeMatches, ignoreLocation: l = b.ignoreLocation} = {}) {
    if (t.length > 32) throw new Error('Pattern length exceeds max of 32.');
    const d = t.length, h = e.length, u = Math.max(0, Math.min(i, h));
    let m = a, p = u;
    const g = o > 1 || c, f = g ? Array(h) : [];
    let v;
    for (;(v = e.indexOf(t, p)) > -1; ) {
      let e = k(t, {
        currentLocation: v,
        expectedLocation: u,
        distance: r,
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
    for (let i = 0; i < d; i += 1) {
      let a = 0, o = x;
      for (;a < o; ) k(t, {
        errors: i,
        currentLocation: u + o,
        expectedLocation: u,
        distance: r,
        ignoreLocation: l
      }) <= m ? a = o : x = o, o = Math.floor((x - a) / 2 + a);
      x = o;
      let c = Math.max(1, u - o + 1), v = s ? h : Math.min(u + o, h) + d, b = Array(v + 2);
      b[v + 1] = (1 << i) - 1;
      for (let a = v; a >= c; a -= 1) {
        let s = a - 1, o = n[e.charAt(s)];
        if (g && (f[s] = +!!o), b[a] = (b[a + 1] << 1 | 1) & o, i && (b[a] |= (y[a + 1] | y[a]) << 1 | 1 | y[a + 1]), 
        b[a] & S && (w = k(t, {
          errors: i,
          currentLocation: s,
          expectedLocation: u,
          distance: r,
          ignoreLocation: l
        }), w <= m)) {
          if (m = w, p = s, p <= u) break;
          c = Math.max(1, 2 * u - p);
        }
      }
      if (k(t, {
        errors: i + 1,
        currentLocation: u,
        expectedLocation: u,
        distance: r,
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
        let n = [], i = -1, r = -1, a = 0;
        for (let s = e.length; a < s; a += 1) {
          let s = e[a];
          s && -1 === i ? i = a : s || -1 === i || (r = a - 1, r - i + 1 >= t && n.push([ i, r ]), 
          i = -1);
        }
        return e[a - 1] && a - i >= t && n.push([ i, a - 1 ]), n;
      }(f, o);
      e.length ? c && (C.indices = e) : C.isMatch = !1;
    }
    return C;
  }
  function I(e) {
    let t = {};
    for (let n = 0, i = e.length; n < i; n += 1) {
      const r = e.charAt(n);
      t[r] = (t[r] || 0) | 1 << i - n - 1;
    }
    return t;
  }
  class B {
    constructor(e, {location: t = b.location, threshold: n = b.threshold, distance: i = b.distance, includeMatches: r = b.includeMatches, findAllMatches: a = b.findAllMatches, minMatchCharLength: s = b.minMatchCharLength, isCaseSensitive: o = b.isCaseSensitive, ignoreLocation: c = b.ignoreLocation} = {}) {
      if (this.options = {
        location: t,
        threshold: n,
        distance: i,
        includeMatches: r,
        findAllMatches: a,
        minMatchCharLength: s,
        isCaseSensitive: o,
        ignoreLocation: c
      }, this.pattern = o ? e : e.toLowerCase(), this.chunks = [], !this.pattern.length) return;
      const l = (e, t) => {
        this.chunks.push({
          pattern: e,
          alphabet: I(e),
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
      const {location: i, distance: r, threshold: a, findAllMatches: s, minMatchCharLength: o, ignoreLocation: c} = this.options;
      let l = [], d = 0, h = !1;
      this.chunks.forEach((({pattern: t, alphabet: u, startIndex: m}) => {
        const {isMatch: p, score: g, indices: f} = M(e, t, u, {
          location: i + m,
          distance: r,
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
    constructor(e, {location: t = b.location, threshold: n = b.threshold, distance: i = b.distance, includeMatches: r = b.includeMatches, findAllMatches: a = b.findAllMatches, minMatchCharLength: s = b.minMatchCharLength, isCaseSensitive: o = b.isCaseSensitive, ignoreLocation: c = b.ignoreLocation} = {}) {
      super(e), this._bitapSearch = new B(e, {
        location: t,
        threshold: n,
        distance: i,
        includeMatches: r,
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
      const i = [], r = this.pattern.length;
      for (;(t = e.indexOf(this.pattern, n)) > -1; ) n = t + r, i.push([ t, n - 1 ]);
      const a = !!i.length;
      return {
        isMatch: a,
        score: a ? 0 : 1,
        indices: i
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
  }, A ], D = $.length, T = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/, _ = new Set([ A.type, E.type ]), z = [];
  function N(e, t) {
    for (let n = 0, i = z.length; n < i; n += 1) {
      let i = z[n];
      if (i.condition(e, t)) return new i(e, t);
    }
    return new B(e, t);
  }
  const O = '$and', j = '$path', P = e => !(!e[O] && !e.$or), R = e => ({
    [O]: Object.keys(e).map((t => ({
      [t]: e[t]
    })))
  });
  function H(e, t, {auto: n = !0} = {}) {
    const i = e => {
      let r = Object.keys(e);
      const a = (e => !!e[j])(e);
      if (!a && r.length > 1 && !P(e)) return i(R(e));
      if ((e => !o(e) && h(e) && !P(e))(e)) {
        const i = a ? e[j] : r[0], s = a ? e.$val : e[i];
        if (!c(s)) throw new Error((e => 'Invalid value for key ' + e)(i));
        const o = {
          keyId: w(i),
          pattern: s
        };
        return n && (o.searcher = N(s, t)), o;
      }
      let s = {
        children: [],
        operator: r[0]
      };
      return r.forEach((t => {
        const n = e[t];
        o(n) && n.forEach((e => {
          s.children.push(i(e));
        }));
      })), s;
    };
    return P(e) || (e = R(e)), i(e);
  }
  function q(e, t) {
    const n = e.matches;
    t.matches = [], u(n) && n.forEach((e => {
      if (!u(e.indices) || !e.indices.length) return;
      const {indices: n, value: i} = e;
      let r = {
        indices: n,
        value: i
      };
      e.key && (r.key = e.key.src), e.idx > -1 && (r.refIndex = e.idx), t.matches.push(r);
    }));
  }
  function U(e, t) {
    t.score = e.score;
  }
  class V {
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
      for (let n = 0, i = this._docs.length; n < i; n += 1) {
        const r = this._docs[n];
        e(r, n) && (this.removeAt(n), n -= 1, i -= 1, t.push(r));
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
      const {includeMatches: n, includeScore: i, shouldSort: r, sortFn: a, ignoreFieldNorm: s} = this.options;
      let o = c(e) ? c(this._docs[0]) ? this._searchStringList(e) : this._searchObjectList(e) : this._searchLogical(e);
      return function(e, {ignoreFieldNorm: t = b.ignoreFieldNorm}) {
        e.forEach((e => {
          let n = 1;
          e.matches.forEach((({key: e, norm: i, score: r}) => {
            const a = e ? e.weight : null;
            n *= Math.pow(0 === r && a ? Number.EPSILON : r, (a || 1) * (t ? 1 : i));
          })), e.score = n;
        }));
      }(o, {
        ignoreFieldNorm: s
      }), r && o.sort(a), l(t) && t > -1 && (o = o.slice(0, t)), function(e, t, {includeMatches: n = b.includeMatches, includeScore: i = b.includeScore} = {}) {
        const r = [];
        return n && r.push(q), i && r.push(U), e.map((e => {
          const {idx: n} = e, i = {
            item: t[n],
            refIndex: n
          };
          return r.length && r.forEach((t => {
            t(e, i);
          })), i;
        }));
      }(o, this._docs, {
        includeMatches: n,
        includeScore: i
      });
    }
    _searchStringList(e) {
      const t = N(e, this.options), {records: n} = this._myIndex, i = [];
      return n.forEach((({v: e, i: n, n: r}) => {
        if (!u(e)) return;
        const {isMatch: a, score: s, indices: o} = t.searchIn(e);
        a && i.push({
          item: e,
          idx: n,
          matches: [ {
            score: s,
            value: e,
            norm: r,
            indices: o
          } ]
        });
      })), i;
    }
    _searchLogical(e) {
      const t = H(e, this.options), n = (e, t, i) => {
        if (!e.children) {
          const {keyId: n, searcher: r} = e, a = this._findMatches({
            key: this._keyStore.get(n),
            value: this._myIndex.getValueForItemAtKeyId(t, n),
            searcher: r
          });
          return a && a.length ? [ {
            idx: i,
            item: t,
            matches: a
          } ] : [];
        }
        switch (e.operator) {
         case O:
          {
            const r = [];
            for (let a = 0, s = e.children.length; a < s; a += 1) {
              const s = e.children[a], o = n(s, t, i);
              if (!o.length) return [];
              r.push(...o);
            }
            return r;
          }

         case '$or':
          {
            const r = [];
            for (let a = 0, s = e.children.length; a < s; a += 1) {
              const s = e.children[a], o = n(s, t, i);
              if (o.length) {
                r.push(...o);
                break;
              }
            }
            return r;
          }
        }
      }, i = this._myIndex.records, r = {}, a = [];
      return i.forEach((({$: e, i: i}) => {
        if (u(e)) {
          let s = n(t, e, i);
          s.length && (r[i] || (r[i] = {
            idx: i,
            item: e,
            matches: []
          }, a.push(r[i])), s.forEach((({matches: e}) => {
            r[i].matches.push(...e);
          })));
        }
      })), a;
    }
    _searchObjectList(e) {
      const t = N(e, this.options), {keys: n, records: i} = this._myIndex, r = [];
      return i.forEach((({$: e, i: i}) => {
        if (!u(e)) return;
        let a = [];
        n.forEach(((n, i) => {
          a.push(...this._findMatches({
            key: n,
            value: e[i],
            searcher: t
          }));
        })), a.length && r.push({
          idx: i,
          item: e,
          matches: a
        });
      })), r;
    }
    _findMatches({key: e, value: t, searcher: n}) {
      if (!u(t)) return [];
      let i = [];
      if (o(t)) t.forEach((({v: t, i: r, n: a}) => {
        if (!u(t)) return;
        const {isMatch: s, score: o, indices: c} = n.searchIn(t);
        s && i.push({
          score: o,
          key: e,
          value: t,
          idx: r,
          norm: a,
          indices: c
        });
      })); else {
        const {v: r, n: a} = t, {isMatch: s, score: o, indices: c} = n.searchIn(r);
        s && i.push({
          score: o,
          key: e,
          value: r,
          norm: a,
          indices: c
        });
      }
      return i;
    }
  }
  V.version = '6.4.6', V.createIndex = C, V.parseIndex = function(e, {getFn: t = b.getFn} = {}) {
    const {keys: n, records: i} = e, r = new S({
      getFn: t
    });
    return r.setKeys(n), r.setIndexRecords(i), r;
  }, V.config = b, function(...e) {
    z.push(...e);
  }(class {
    constructor(e, {isCaseSensitive: t = b.isCaseSensitive, includeMatches: n = b.includeMatches, minMatchCharLength: i = b.minMatchCharLength, ignoreLocation: r = b.ignoreLocation, findAllMatches: a = b.findAllMatches, location: s = b.location, threshold: o = b.threshold, distance: c = b.distance} = {}) {
      this.query = null, this.options = {
        isCaseSensitive: t,
        includeMatches: n,
        minMatchCharLength: i,
        findAllMatches: a,
        ignoreLocation: r,
        location: s,
        threshold: o,
        distance: c
      }, this.pattern = t ? e : e.toLowerCase(), this.query = function(e, t = {}) {
        return e.split('|').map((e => {
          let n = e.trim().split(T).filter((e => e && !!e.trim())), i = [];
          for (let e = 0, r = n.length; e < r; e += 1) {
            const r = n[e];
            let a = !1, s = -1;
            for (;!a && ++s < D; ) {
              const e = $[s];
              let n = e.isMultiMatch(r);
              n && (i.push(new e(n, t)), a = !0);
            }
            if (!a) for (s = -1; ++s < D; ) {
              const e = $[s];
              let n = e.isSingleMatch(r);
              if (n) {
                i.push(new e(n, t));
                break;
              }
            }
          }
          return i;
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
      const {includeMatches: n, isCaseSensitive: i} = this.options;
      e = i ? e : e.toLowerCase();
      let r = 0, a = [], s = 0;
      for (let i = 0, o = t.length; i < o; i += 1) {
        const o = t[i];
        a.length = 0, r = 0;
        for (let t = 0, i = o.length; t < i; t += 1) {
          const i = o[t], {isMatch: c, indices: l, score: d} = i.search(e);
          if (!c) {
            s = 0, r = 0, a.length = 0;
            break;
          }
          if (r += 1, s += d, n) {
            const e = i.constructor.type;
            _.has(e) ? a = [ ...a, ...l ] : a.push(l);
          }
        }
        if (r) {
          let e = {
            isMatch: !0,
            score: s / r
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
  const G = async e => JSON.parse((await e.text()).trim().substr(9));
  document.head.innerHTML = `<title>${document.title}</title>`, document.body.innerHTML = '', 
  (async () => {
    const e = JSON.parse(document.documentElement.getAttribute('data-he-context'));
    var t;
    s.uid = localStorage.getItem('Session.UserId'), document.head.innerHTML = function(e, t, n, i) {
      t = t || function(e) {
        return null == e ? '' : String(e).replace(a, s);
      };
      var r = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&#34;',
        '\'': '&#39;'
      }, a = /[&<>'"]/g;
      function s(e) {
        return r[e] || e;
      }
      var o = '';
      function c(e) {
        null != e && (o += e);
      }
      return c('<meta charset="utf-8">\n<link rel="icon" href="https://s.brightspace.com/lib/favicon/2.0.0/favicon.ico">\n<title>'), 
      c(t(e.title)), c('</title>\n<meta name="description" content="D2l Overhaul">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\x3c!-- FONT --\x3e\n<style>\n@font-face {\n  font-family: \'Material Icons\';\n  font-style: normal;\n  font-weight: 400;\n  src: url(https://fonts.gstatic.com/s/materialicons/v99/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format(\'woff2\');\n}\n\n.material-icons {\n  font-family: \'Material Icons\';\n  font-weight: normal;\n  font-style: normal;\n  font-size: 24px;  \n  display: inline-block;\n  line-height: 1;\n  text-transform: none;\n  letter-spacing: normal;\n  word-wrap: normal;\n  white-space: nowrap;\n  direction: ltr;\n  user-select: none;\n\n  \n  -webkit-font-smoothing: antialiased;\n  \n  text-rendering: optimizeLegibility;\n\n  \n  -moz-osx-font-smoothing: grayscale;\n\n  \n  font-feature-settings: \'liga\';\n}\n\n.material-icons.md-18 { font-size: 18px; }\n.material-icons.md-24 { font-size: 24px; }\n.material-icons.md-36 { font-size: 36px; }\n.material-icons.md-48 { font-size: 48px; }\n\n\n.material-icons.md-dark { color: rgba(0, 0, 0, 0.54); }\n.material-icons.md-dark.md-inactive { color: rgba(0, 0, 0, 0.26); }\n\n\n.material-icons.md-light { color: rgba(255, 255, 255, 1); }\n.material-icons.md-light.md-inactive { color: rgba(255, 255, 255, 0.3); }\n\n\n.material-icons.orange600 { color: #FB8C00; }</style>\n<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" type="text/css">\n<link href="https://fonts.googleapis.com/css?family=Google+Sans:300,400,500" rel="stylesheet" type="text/css">\n\x3c!-- CSS --\x3e\n<style>:root {\n  --Background: #0c0c0c;\n  --Foreground: #18181b;\n  --Border: #252525;\n  --Text-Main: #fff;\n\n  --Active: #3367d6;\n}\n</style>\n<style>html,body{height:100%;width:100%;font-family:\'Roboto\', Helvetica, Arial, sans-serif;color:var(--Text-Main)}body{margin:0;background-color:var(--Background);position:relative}*{box-sizing:border-box}picture,picture img{display:block;height:100%;width:100%}*::-webkit-scrollbar{width:16px}*::-webkit-scrollbar-thumb{background:#dadce0;background-clip:padding-box;border:4px solid transparent;border-radius:8px;box-shadow:none;min-height:50px}*::-webkit-scrollbar-track{background:none;border:none}h1,h2{color:var(--Text-Main)}h1{font-size:1.375rem;font-weight:500;line-height:1.75rem;font-family:\'Google Sans\', Roboto, Arial, sans-serif}h2{font-size:1rem;font-weight:400;line-height:1.25rem;margin:0}.SideBar{display:flex;flex-direction:column;height:100vh;width:19rem;padding:0.5rem 0;z-index:990;box-shadow:0 8px 10px 1px #00000024, 0 3px 14px 2px #0000001f, 0 5px 5px -3px #00000033;background-color:var(--Foreground);position:fixed;top:0;left:0;bottom:0;overflow-y:scroll;max-width:0;transition:max-width 0.5s}.SideBar.Active{max-width:100%}.SideBar hr{border-top:0.0625rem solid var(--Border);margin:0.5rem}.SideBarSection{flex-grow:1;min-height:max-content}.SideBarHeader{padding:0 1rem;letter-spacing:0.01785714em;font-family:\'Google Sans\', Roboto, Arial, sans-serif;font-size:0.875rem;font-weight:500;line-height:1.25rem}.SideBarItem{display:flex;align-content:center;border-radius:0 2rem 2rem 0;height:3.5rem;padding-left:1.5rem;margin-right:1rem;cursor:pointer;text-decoration:none;color:#fff}.SideBarItem .SideBarItemText{margin-left:1rem;font-family:\'Google Sans\', Roboto, Arial, sans-serif;letter-spacing:0.01785714em;font-size:0.875rem;font-weight:500;overflow:hidden;white-space:nowrap;margin-right:4rem;text-overflow:ellipsis}.SideBarItem span{line-height:3.5rem}.SideBarItem:hover{background-color:#343434}#Content{min-height:100%;height:min-content;width:100%;display:flex;flex-direction:column}#Content>*{padding:1rem}main{height:100%;width:100%}.Home>main{max-width:70rem;margin:auto;display:grid}.Loader{display:flex;align-content:center;flex-direction:column}.lds-grid{margin:auto;display:grid;grid-template-columns:repeat(3, 16px);grid-template-rows:repeat(3, 16px);grid-gap:8px}.lds-grid div{border-radius:50%;background:#fff;animation:lds-grid 1.2s linear infinite}.lds-grid div:nth-child(1){animation-delay:0s}.lds-grid div:nth-child(2),.lds-grid div:nth-child(4){animation-delay:-0.4s}.lds-grid div:nth-child(3),.lds-grid div:nth-child(5),.lds-grid div:nth-child(7){animation-delay:-0.8s}.lds-grid div:nth-child(6),.lds-grid div:nth-child(8){animation-delay:-1.2s}.lds-grid div:nth-child(9){animation-delay:-1.6s}@keyframes lds-grid{0%,100%{opacity:1}50%{opacity:0.5}}.Hidden,.Filtered{display:none !important}.StreamCard{cursor:pointer}.StreamCard:hover{box-shadow:0 8px 10px 1px rgba(0,0,0,0.14),0 3px 14px 2px rgba(0,0,0,0.12),0 5px 5px -3px rgba(0,0,0,0.2);border-radius:0.75rem}.NavBar{padding:.75rem 1rem !important;background-color:var(--Foreground);height:4rem;width:100%;display:flex;position:relative}.NavBar .side,.NavBar .center{flex:1 1 0;display:flex;align-content:center;margin:auto 0}.NavBar .center{flex-basis:calc(100% - 80rem)}.NavBar .rightSide{justify-content:end}.NavBar .AsideButton{border-radius:50%;width:2.5rem;height:2.5rem;text-align:center;line-height:2.5rem;cursor:pointer}.NavBar .AsideButton:hover{background:var(--Background)}.NavBar input{height:2.5rem;width:100%;display:block;background-color:var(--Background);outline:none;border:none;border-radius:0.5rem;padding:0.5rem;color:#cccccc}.NavBar .Account{display:grid;grid-template-columns:repeat(4, 2.5rem);grid-gap:0.25rem;margin-left:auto}.NavBar .Account span{width:2.5rem;height:2.5rem;text-align:center;line-height:2.5rem}.NavBar .Account span.Active{color:#fb8c00}.NavBar .Account .Profile picture{padding:0.25rem}.NavBar .Account span,.NavBar .Account div{cursor:pointer;border-radius:0.5rem}.NavBar .Account span:hover,.NavBar .Account div:hover{background-color:#2f3033}.ClassContainer{display:grid;grid-template-columns:repeat(2, 1fr);grid-gap:2rem;margin:1rem auto;width:100%}.classCard{width:100%;aspect-ratio:16 / 7;position:relative;border-radius:1rem;overflow:hidden;cursor:pointer}.classCard img{min-height:100%;width:100%}.classCard picture{height:100%;width:100%;position:absolute;top:0;left:0}.classCard .classCardContent{position:absolute;width:100%;padding:1rem 2rem;bottom:0;left:0}.classCard .classCardContent h4,.classCard .classCardContent h6{color:#f2f2f2;font-style:normal;margin-bottom:1rem;margin-top:0}.classCard .classCardContent h4{font-weight:bold;font-size:1.6rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.classCard .classCardContent h6{font-weight:500;font-size:0.9rem}.classCard[disabled] img{filter:brightness(0.5) blur(10px)}.classCard:hover{transform:scale(1.05)}.Profile{height:100%;aspect-ratio:1 / 1;border-radius:50%}.Stream>main{flex-grow:1;min-height:max-content;width:calc(100% - 2 * 1.5rem);max-width:62.5rem;margin:0 auto;padding:0 !important}.ClassPicture{margin:1.5rem 0;overflow:hidden;border-radius:1rem;position:relative;aspect-ratio:4 / 1}.ClassPictureContent{display:flex;flex-direction:column;padding:1.5rem;margin:0;position:absolute;top:0;left:0;width:100%;height:100%}.ClassPictureContent h1,.ClassPictureContent h2{margin:0}.ClassPictureContent h4{margin-top:0.4rem;font-weight:500;font-style:normal}.ChipFilter{display:inline-flex;height:max-content;width:max-content;padding:0.25rem 0.5rem;border:0.0625rem solid var(--Border);border-radius:2rem;font-size:0.75rem;cursor:pointer;user-select:none;background-color:var(--Foreground)}.ChipFilter .chipIcon{border-radius:50%;padding:0.25rem;font-size:0.75rem;margin-right:0.25rem;background-color:var(--Active)}.ChipFilter p{margin:auto;display:inline-block}.ChipFilter:hover{background-color:#343434}.ChipFilter.Active{background-color:var(--Active)}.StreamCard{width:100%;height:4rem;background-color:var(--Foreground);border:0.0625rem solid var(--Border);border-radius:0.5rem;display:grid;grid-template-columns:max-content 1fr;grid-template-rows:3rem max-content;grid-template-areas:\'Icon Title\' \'Content Content\';padding:0.5rem;grid-gap:0.5rem;margin:1rem 0}.StreamCard h1,.StreamCard h3{margin:0}.StreamCard h3{font-size:0.75rem}.StreamCard.Active,.StreamCard.Active>.StreamCardBody{height:max-content}.StreamCardTitle{grid-area:Title}.StreamCardIcon{grid-area:Icon;background-color:var(--Background);width:3rem;height:3rem;border-radius:2rem;display:flex;align-content:center}.StreamCardIcon.OnSubmission{background-color:var(--Active)}.StreamCardIcon.DueDate{background-color:#e91e63}.StreamCardIcon.Unread{background-color:#fb8c00}.StreamCardIcon span{margin:auto}.StreamIframe{border:none;overflow:hidden;height:calc(100vh - 64px);width:100%;background:#fff}.StreamCardBody{grid-area:Content;overflow:hidden;width:100%;height:0;cursor:auto}.StreamCardBody img,.StreamCardBody video{border-radius:0.5rem}.StreamCardBody .btn{display:block;background-color:var(--Active);padding:0.75rem 1rem;color:#fff;border-radius:0.5rem;height:max-content;width:max-content;text-decoration:none}.StreamCardBody .btn:hover{background-color:#fb8c00}.StreamCardBody object{aspect-ratio:16 /9}.StreamCardBody .Loader{min-height:20rem}.FileSubmit{height:12.5rem;display:grid;grid-template-columns:75% 1fr}.FileSubmit .UploadedFiles{display:flex;flex-wrap:wrap;overflow-y:auto}.FileSubmit .UploadedFiles .UploadedFile{width:8rem;height:4.5rem;background:var(--Background);border-radius:0.5rem;margin:0.25rem;position:relative;overflow:hidden}.FileSubmit .UploadedFiles .UploadedFile .FileTitle{position:absolute;bottom:0;left:0;width:100%;background-color:rgba(0,0,0,0.75);color:#fff;font-size:0.75rem;white-space:nowrap;text-overflow:ellipsis;padding:0 0.5rem}.FileSubmit .UploadedFiles .UploadedFile .FileRemove{position:absolute;top:0;right:0;background-color:rgba(0,0,0,0.75);color:#fff;font-size:0.75rem;padding:0.25rem;border-radius:0 0 0 0.5rem}.FileSubmit .FileForm{display:flex;flex-direction:column}.FileSubmit .FileForm textarea{background-color:#222222;border:0.0625rem solid var(--Border);flex-grow:1;border-radius:0.5rem;resize:none;outline:none;color:#fff;padding:0.5rem}.FileSubmit .FileForm button{background-color:var(--Active);margin-top:1rem;height:2rem;border-radius:0.5rem;border:none;outline:none;cursor:pointer}.FileSubmit .FileForm button:hover{opacity:0.75}.DropDown{min-height:30rem;width:25rem;border-radius:0.5rem;border:0.0625rem solid var(--Border);background-color:var(--Foreground);position:absolute;top:100%;right:0;z-index:2;padding:1rem;margin:-0.25rem 0.5rem;overflow-y:scroll}.NotificationShade{list-style:none;padding-inline-start:0}.NotificationShade li{border-bottom:1px solid white;padding-top:1rem}.NotificationShade li a{color:#fff;text-decoration:none;font-size:1.5rem;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}.NotificationShade li img{display:none}\n</style>'), 
      o;
    }({
      title: document.title
    }), document.body.innerHTML = function(e, t, n, i) {
      var r = '';
      function a(e) {
        null != e && (r += e);
      }
      a('<aside class="SideBar" id="SideBar"></aside>\n<section id="Content">\n  \x3c!-- NavBar --\x3e\n  '), 
      a(e.navBar), a('\n  \x3c!-- Main Body --\x3e\n  <main id="main" class="Loader">\n    <div class="lds-grid">\n      ');
      for (let e = 0; e < 9; e++) a('\n        <div></div>\n      ');
      return a('\n    </div>\n  </main>\n</section>\n'), r;
    }({
      content: null,
      navBar: (t = '', t += '<nav class="NavBar" id="NavBar">\n  <div class="side">\n    <span class="material-icons AsideButton" id="AsideButton">\n      menu\n    </span>\n  </div>\n  <div class="center">\n    <input id="Search" placeholder="Search" type="text" />\n  </div>\n  <div class="side">\n    <div class="Account">\n      <span class="material-icons" id="MailButton">\n        mail\n      </span>\n      <span class="material-icons" id="MessageButton">\n        message\n      </span>      \n      <span class="material-icons" id="NotificationButton">\n        notifications\n      </span>\n      <div class="Profile" id="AccountButtton">\n        <picture>\n          <img src="/d2l/api/lp/1.32/profile/myProfile/image" />\n        </picture>\n      </div>\n    </div>\n  </div>\n</nav>\n', 
      t)
    });
    const n = document.createElement('script');
    n.src = chrome.runtime.getURL('./client.js'), document.body.appendChild(n), ((e, t) => {
      const n = document.getElementById('main'), i = document.getElementById('SideBar'), r = document.getElementById('AsideButton'), a = document.getElementById('Search'), s = document.getElementById('MailButton'), o = document.getElementById('MessageButton'), c = document.getElementById('NotificationButton');
      r.addEventListener('click', (e => {
        e.stopPropagation(), i.classList.add('Active');
      })), a.addEventListener('keyup', (() => {
        const e = [];
        if (n.querySelectorAll('.Search').forEach((t => e.push(...t.children))), '' == a.value.trim()) return void e.forEach((e => e.classList.toggle('Hidden', !1)));
        const t = e.map(((e, t) => ({
          Name: e.querySelector('h1').innerText,
          Teacher: e.querySelector('h2')?.innerText || '',
          child: e,
          id: t
        }))), i = (r = t, s = a.value, new V(r, {
          isCaseSensitive: !1,
          includeScore: !0,
          shouldSort: !0,
          useExtendedSearch: !0,
          ignoreLocation: !0,
          keys: [ 'Name', 'Teacher' ]
        }).search(s));
        var r, s;
        t.forEach((e => {
          e.child.classList.toggle('Hidden', !i.some((t => t.item.id == e.id && t.score < .5)));
        }));
      }));
      const l = async () => {
        const e = await fetch('/d2l/activityFeed/checkForNewAlerts?isXhr=true&requestId=3&X-D2L-Session=no-keep-alive'), t = await G(e);
        [ 'Messages', 'Grades' ].forEach((e => {
          const n = (t.Payload || []).includes(e);
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
      const d = async (n, i) => {
        n.stopPropagation();
        const r = document.getElementById('DropDown');
        var a;
        r && r.remove(), e.insertAdjacentHTML('beforeend', (a = '', a += '<div class="DropDown" id="DropDown">\n  <h3>Notifications</h3>\n  <hr />\n  <ul class="NotificationShade">\n  </ul>\n</div>'));
        let o = '';
        switch (i) {
         case 'MailButton':
          {
            const e = await fetch(`/d2l/MiniBar/${t.cid}/ActivityFeed/GetAlertsDaylight?Category=2&requestId=3`);
            o = (await G(e)).Payload.Html, s.classList.toggle('Active', !1);
            break;
          }

         case 'MessageButton':
          break;

         case 'NotificationButton':
          {
            const e = await fetch(`/d2l/MiniBar/${t.cid}/ActivityFeed/GetAlertsDaylight?Category=1&requestId=3`);
            o = (await G(e)).Payload.Html, c.classList.toggle('Active', !1);
            break;
          }
        }
        const l = document.getElementById('DropDown'), d = (new DOMParser).parseFromString(o, 'text/html');
        l.querySelector('.NotificationShade').innerHTML = d.querySelector('.vui-list').innerHTML, 
        l.addEventListener('click', (e => e.stopPropagation()));
      };
      s.addEventListener('click', (e => d(e, 'MailButton'))), o.addEventListener('click', (e => d(e, 'MessageButton'))), 
      c.addEventListener('click', (e => d(e, 'NotificationButton'))), document.addEventListener('click', (() => {
        const e = document.getElementById('DropDown');
        e && e.remove(), i.classList.contains('Active') && i.classList.remove('Active');
      }));
    })(document.getElementById('NavBar'), s), (async (e, t) => {
      const n = (new Date).valueOf(), i = await fetch(`https://${t.orgID}.enrollments.api.brightspace.com/users/${t.uid}?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false`, {
        headers: {
          authorization: `Bearer ${await t.getToken()}`
        }
      }).then((e => e.json())), r = await Promise.all(i.entities.map((async ({href: e}) => {
        const i = await fetch(e, {
          headers: {
            authorization: `Bearer ${await t.getToken()}`
          }
        }), r = await i.json(), a = await fetch(r.links[1].href, {
          headers: {
            authorization: `Bearer ${await t.getToken()}`
          }
        }), {properties: {endDate: s, name: o}, links: c} = await a.json();
        return {
          name: o,
          disabled: new Date(s).valueOf() < n,
          href: c[0].href.replace(`https://${t.orgID}.folio.api.brightspace.com/organizations/', 'https://durham.elearningontario.ca/d2l/home/`)
        };
      })));
      e.innerHTML = function(e, t, n, i) {
        t = t || function(e) {
          return null == e ? '' : String(e).replace(a, s);
        };
        var r = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&#34;',
          '\'': '&#39;'
        }, a = /[&<>'"]/g;
        function s(e) {
          return r[e] || e;
        }
        var o = '';
        function c(e) {
          null != e && (o += e);
        }
        return c('<a class="SideBarItem" id="SideBarClassesBtn"><span class="material-icons">home</span><span class="SideBarItemText">Classes</span></a>\n<a class="SideBarItem" id="SideBarCalenderBtn"><span class="material-icons">calendar_today</span><span class="SideBarItemText">Calender</span></a>\n<hr />\n<div class="SideBarSection" id="SideBarClasses">\n  <div class="SideBarHeader">Enrolled</div>\n  '), 
        e.classes.forEach((e => {
          c('\n    '), e.disabled || (c('\n      <a class="SideBarItem" id="SideBarCalenderBtn" href="'), 
          c(t(e.href)), c('"><span class="material-icons">class</span><span class="SideBarItemText">'), 
          c(t(e.name)), c('</span></a>\n    ')), c('\n  ');
        })), c('\n</div>\n<hr />\n<a class="SideBarItem" id="SideBarSettingsBtn"><span class="material-icons">settings</span><span class="SideBarItemText">Settings</span></a>'), 
        o;
      }({
        classes: r
      }), document.getElementById('SideBarClassesBtn').addEventListener('click', (() => t.setPage('HOME')));
    })(document.getElementById('SideBar'), s), await s.start(e);
  })();
}();
