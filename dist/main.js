!function() {
  function e(e, n, t, i) {
    n = n || function(e) {
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
    return c('<div class="StreamCard" id="'), c(e.Id), c('" Category="'), c(e.Category), 
    c('">\n  <div class="StreamCardIcon '), c(e.CompletionType), c('">\n    <span class="material-icons">\n      '), 
    'Info' == e.type ? c('\n        account_circle\n      ') : 'Content' == e.type ? c('\n        class\n      ') : 'Assignment' == e.type ? c('\n        assignment\n      ') : c('\n        article\n      '), 
    c('\n    </span>\n  </div>\n  <div class="StreamCardTitle">\n    <h1>'), c(n(e.Title)), 
    c('</h1>\n    <h3>'), c(n(e.StartDate)), c('</h3>\n  </div>\n  <div class="StreamCardBody">\n    '), 
    'Assignment' == e.type ? c('\n      <div class="FileSubmit">\n        <div class="UploadedFiles">\n          <div class="UploadedFile">\n\n          </div>\n          <div class="UploadedFile">\n\n          </div>\n          <div class="UploadedFile">\n\n          </div>\n          <div class="UploadedFile">\n\n          </div>\n          <div class="UploadedFile">\n\n          </div>\n          <div class="UploadedFile">\n\n          </div>\n          <div class="UploadedFile">\n\n          </div>\n        </div>\n        <div class="FileForm">\n          <textarea></textarea>\n          <button>Add or create</button>\n          <button>Submit</button>\n        </div>\n      </div>\n    ') : (c('\n      '), 
    c(e.Body.Html), c('\n    ')), c('\n  </div>\n</div>'), o;
  }
  const n = 'HOME', t = 'STREAM', i = new class {
    constructor() {
      this.organizationURL = 'https://bc59e98c-eabc-4d42-98e1-edfe93518966.organizations.api.brightspace.com/', 
      this.location = n, this.token, this.data = {}, this.uid, this.cid, this.cancel, 
      this.apiVersion = {};
    }
    async start(e) {
      this.data = e, this.cid = e.orgUnitId, await this._apiVersion(), setInterval((() => this.getToken(!0)), 3e5);
      let i = n;
      switch (!0) {
       case /\/d2l\/home\/[^/]+$/.test(window.location.pathname):
        i = t, this.cid = window.location.pathname.replace('/d2l/home/', '');
        break;

       case '/d2l/home' == window.location.pathname:
       default:
        i = n;
      }
      this.setPage(i);
    }
    async _apiVersion() {
      const e = await fetch('https://durham.elearningontario.ca/d2l/api/versions/');
      (await e.json()).forEach((({LatestVersion: e, ProductCode: n, SupportedVersions: t}) => {
        this.apiVersion[n] = e;
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
    setPage(i) {
      const r = document.getElementById('Content').classList;
      switch ('function' == typeof this.cancel && this.cancel(), i) {
       case n:
        for (this.cid = null, this.cancel = (async e => {
          const n = (new Date).valueOf(), t = document.getElementById('main'), i = await fetch(`https://bc59e98c-eabc-4d42-98e1-edfe93518966.enrollments.api.brightspace.com/users/${e.uid}?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false`, {
            headers: {
              authorization: `Bearer ${await e.getToken()}`
            }
          }).then((e => e.json())), r = await Promise.all(i.entities.map((async ({href: t}) => {
            const i = await fetch(t, {
              headers: {
                authorization: `Bearer ${await e.getToken()}`
              },
              method: 'GET'
            }), r = await i.json(), a = await fetch(r.links[1].href, {
              headers: {
                authorization: `Bearer ${await e.getToken()}`
              },
              method: 'GET'
            }), s = await a.json(), o = await fetch(s.entities[2].href), c = await o.json().catch((() => 'https://durham.elearningontario.ca/d2l/img/0/Framework.UserProfileBadge.actProfileDaylight100.png?v=20.21.8.31658')), {endDate: l, name: d} = s.properties;
            return {
              name: d,
              disabled: new Date(l).valueOf() < n,
              href: s.links[0].href.replace('https://bc59e98c-eabc-4d42-98e1-edfe93518966.folio.api.brightspace.com/organizations/', 'https://durham.elearningontario.ca/d2l/home/'),
              picture: c.links ? c.links[2].href : c,
              teacher: {
                name: 'TODO',
                picture: 'https://durham.elearningontario.ca/d2l/img/0/Framework.UserProfileBadge.actProfileDaylight100.png?v=20.21.8.31658'
              }
            };
          })));
          t.innerHTML = function(e, n, t, i) {
            n = n || function(e) {
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
              c('\n    <div class="Class" '), c(n(e.disabled ? 'disabled' : '')), c(' class_link="'), 
              c(n(e.href)), c('">\n      <picture>\n        <img src="'), c(e.picture), c('" />\n      </picture>\n      <div>\n        <h1>'), 
              c(n(e.name)), c('</h1>\n        <div>\n          <div class="Profile">\n            <picture>\n              <img src="'), 
              c(e.teacher.picture), c('" />\n            </picture>\n          </div>\n          <h2>'), 
              c(n(e.teacher.name)), c('</h2>\n        </div>\n      </div>\n    </div>\n  ');
            })), c('\n</section>'), o;
          }({
            classes: r
          });
          const a = e => {
            window.location.href = e.getAttribute('class_link');
          };
          return [ ...t.querySelector('#ClassContainer').children ].forEach((e => {
            '' != e.getAttribute('disabled') && e.addEventListener('click', (() => a(e)));
          })), () => {
            [ ...t.querySelector('#ClassContainer').children ].forEach((e => {
              e.removeEventListener('click', (() => a(e)));
            }));
          };
        })(this); r.length > 0; ) r.remove(r.item(0));
        r.add('Home');
        break;

       case t:
        for (this.cancel = (async n => {
          const t = document.getElementById('main'), i = await fetch(`${n.organizationURL}${n.cid}`, {
            headers: {
              Accept: 'application/vnd.siren+json',
              authorization: `Bearer ${await n.getToken()}`
            }
          }), r = await i.json(), a = await fetch(r.entities[2].href), s = await a.json().catch((() => 'https://durham.elearningontario.ca/d2l/img/0/Framework.UserProfileBadge.actProfileDaylight100.png?v=20.21.8.31658')), o = {
            name: r.properties.name,
            description: r.properties.description,
            picture: s.links ? s.links[2].href : s,
            teacher: {
              name: 'TODO',
              picture: 'https://durham.elearningontario.ca/d2l/img/0/Framework.UserProfileBadge.actProfileDaylight100.png?v=20.21.8.31658'
            }
          }, c = await (async n => {
            const t = [], i = await fetch(`/d2l/api/le/${n.apiVersion.le}/${n.cid}/news/`);
            (await i.json()).forEach((n => {
              n.StartDate = new Date(n.StartDate).toDateString(), n.Category = 'ChipFilterHome', 
              n.type = 'Info', t.push({
                date: new Date(n.StartDate).valueOf(),
                element: e({
                  ...n,
                  CompletionType: 'OnSubmission'
                })
              });
            }));
            const r = await fetch(`/d2l/api/le/${n.apiVersion.le}/${n.cid}/dropbox/folders/`), a = await r.json();
            return a.forEach((n => {
              t.push({
                date: new Date(n.DueDate).valueOf(),
                element: e({
                  Id: n.Id,
                  Category: 'ChipFilterAssignments',
                  type: 'Assignment',
                  Title: n.Name,
                  CompletionType: [ 'OnSubmission', 'DueDate', 'OnSubmission', 'OnSubmission' ][n.CompletionType],
                  StartDate: new Date(n.DueDate).toDateString(),
                  Body: {
                    Html: ''
                  }
                })
              });
            })), console.log(a), t.sort(((e, n) => n.date - e.date)).map((e => e.element)).join('\n');
          })(n);
          t.innerHTML = function(e, n, t, i) {
            n = n || function(e) {
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
            return c('\x3c!-- Top --\x3e\n<section class="ClassPicture">\n  <picture>\n    <img src="https://s.brightspace.com/course-images/images/590cea69-f3f4-47aa-88c1-e69b9c5fd86f/banner-wide-low-density-max-size.jpg" />\n  </picture>\n  <div class="ClassPictureContent">\n    <h1>'), 
            c(n(e.classData.name)), c('</h1>\n    <h2>'), c(n(e.classData.description)), c('</h2>\n    <h4>Meet Link: <a>Link</a></h4>\n  </div>\n</section>\n<div class="StreamFilter" id="ChipFilters">\n  <div class="ChipFilter Active" id="ChipFilterHome"><span class="material-icons chipIcon">home</span><p>Stream</p></div>\n  <div class="ChipFilter Active" id="ChipFilterContent"><span class="material-icons chipIcon">source</span><p>Content</p></div>\n  <div class="ChipFilter Active" id="ChipFilterDiscussions"><span class="material-icons chipIcon">chat</span><p>Discussions</p></div>\n  <div class="ChipFilter Active" id="ChipFilterAssignments"><span class="material-icons chipIcon">assignment</span><p>Assignments</p></div>\n  <div class="ChipFilter Active" id="ChipFilterQuizzes"><span class="material-icons chipIcon">quiz</span><p>Quizzes</p></div>\n</div>\n\x3c!-- Stream Announcements --\x3e\n<section class="StreamCards Search Filter">'), 
            c(e.announcements), c('</section>'), o;
          }({
            announcements: c,
            classData: o
          });
          const l = e => {
            e.classList.contains('Active') ? e.classList.remove('Active') : e.classList.add('Active');
          };
          [ ...t.querySelector('section.StreamCards').children ].forEach((e => {
            e.addEventListener('click', (() => l(e))), e.querySelector('.StreamCardBody').addEventListener('click', (e => e.stopPropagation()));
          }));
          const d = document.getElementById('ChipFilters'), h = document.querySelector('.Filter'), u = e => {
            e.classList.toggle('Active', !e.classList.contains('Active'));
            const n = [ ...d.querySelectorAll('.ChipFilter') ];
            [ ...h.children ].forEach((e => e.classList.toggle('Filtered', !n.some((n => n.classList.contains('Active') && n.id == e.getAttribute('Category'))))));
          };
          return [ ...d.children ].forEach((e => {
            e.addEventListener('click', (() => u(e)));
          })), () => {
            [ ...t.querySelector('section.StreamCards').children ].forEach((e => {
              e.removeEventListener('click', (() => l(e)));
            })), [ ...d.children ].forEach((e => {
              e.removeEventListener('click', (() => u(e)));
            }));
          };
        })(this); r.length > 0; ) r.remove(r.item(0));
        r.add('Stream');
        break;

       default:
        return void console.log(`Unknown location: ${i}`);
      }
      this.location = i;
    }
  };
  function r(e) {
    return Array.isArray ? Array.isArray(e) : '[object Array]' === h(e);
  }
  function a(e) {
    return 'string' == typeof e;
  }
  function s(e) {
    return 'number' == typeof e;
  }
  function o(e) {
    return !0 === e || !1 === e || function(e) {
      return c(e) && null !== e;
    }(e) && '[object Boolean]' == h(e);
  }
  function c(e) {
    return 'object' == typeof e;
  }
  function l(e) {
    return null != e;
  }
  function d(e) {
    return !e.trim().length;
  }
  function h(e) {
    return null == e ? void 0 === e ? '[object Undefined]' : '[object Null]' : Object.prototype.toString.call(e);
  }
  const u = Object.prototype.hasOwnProperty;
  class m {
    constructor(e) {
      this._keys = [], this._keyMap = {};
      let n = 0;
      e.forEach((e => {
        let t = g(e);
        n += t.weight, this._keys.push(t), this._keyMap[t.id] = t, n += t.weight;
      })), this._keys.forEach((e => {
        e.weight /= n;
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
  function g(e) {
    let n = null, t = null, i = null, s = 1;
    if (a(e) || r(e)) i = e, n = p(e), t = f(e); else {
      if (!u.call(e, 'name')) throw new Error('Missing name property in key');
      const r = e.name;
      if (i = r, u.call(e, 'weight') && (s = e.weight, s <= 0)) throw new Error((e => `Property 'weight' in key '${e}' must be a positive integer`)(r));
      n = p(r), t = f(r);
    }
    return {
      path: n,
      id: t,
      weight: s,
      src: i
    };
  }
  function p(e) {
    return r(e) ? e : e.split('.');
  }
  function f(e) {
    return r(e) ? e.join('.') : e;
  }
  var v = {
    isCaseSensitive: !1,
    includeScore: !1,
    keys: [],
    shouldSort: !0,
    sortFn: (e, n) => e.score === n.score ? e.idx < n.idx ? -1 : 1 : e.score < n.score ? -1 : 1,
    includeMatches: !1,
    findAllMatches: !1,
    minMatchCharLength: 1,
    location: 0,
    threshold: .6,
    distance: 100,
    useExtendedSearch: !1,
    getFn: function(e, n) {
      let t = [], i = !1;
      const c = (e, n, d) => {
        if (l(e)) if (n[d]) {
          const h = e[n[d]];
          if (!l(h)) return;
          if (d === n.length - 1 && (a(h) || s(h) || o(h))) t.push(function(e) {
            return null == e ? '' : function(e) {
              if ('string' == typeof e) return e;
              let n = e + '';
              return '0' == n && 1 / e == -1 / 0 ? '-0' : n;
            }(e);
          }(h)); else if (r(h)) {
            i = !0;
            for (let e = 0, t = h.length; e < t; e += 1) c(h[e], n, d + 1);
          } else n.length && c(h, n, d + 1);
        } else t.push(e);
      };
      return c(e, a(n) ? n.split('.') : n, 0), i ? t : t[0];
    },
    ignoreLocation: !1,
    ignoreFieldNorm: !1
  };
  const y = /[^ ]+/g;
  class x {
    constructor({getFn: e = v.getFn} = {}) {
      this.norm = function(e = 3) {
        const n = new Map, t = Math.pow(10, e);
        return {
          get(e) {
            const i = e.match(y).length;
            if (n.has(i)) return n.get(i);
            const r = 1 / Math.sqrt(i), a = parseFloat(Math.round(r * t) / t);
            return n.set(i, a), a;
          },
          clear() {
            n.clear();
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
      this.keys = e, this._keysMap = {}, e.forEach(((e, n) => {
        this._keysMap[e.id] = n;
      }));
    }
    create() {
      !this.isCreated && this.docs.length && (this.isCreated = !0, a(this.docs[0]) ? this.docs.forEach(((e, n) => {
        this._addString(e, n);
      })) : this.docs.forEach(((e, n) => {
        this._addObject(e, n);
      })), this.norm.clear());
    }
    add(e) {
      const n = this.size();
      a(e) ? this._addString(e, n) : this._addObject(e, n);
    }
    removeAt(e) {
      this.records.splice(e, 1);
      for (let n = e, t = this.size(); n < t; n += 1) this.records[n].i -= 1;
    }
    getValueForItemAtKeyId(e, n) {
      return e[this._keysMap[n]];
    }
    size() {
      return this.records.length;
    }
    _addString(e, n) {
      if (!l(e) || d(e)) return;
      let t = {
        v: e,
        i: n,
        n: this.norm.get(e)
      };
      this.records.push(t);
    }
    _addObject(e, n) {
      let t = {
        i: n,
        $: {}
      };
      this.keys.forEach(((n, i) => {
        let s = this.getFn(e, n.path);
        if (l(s)) if (r(s)) {
          let e = [];
          const n = [ {
            nestedArrIndex: -1,
            value: s
          } ];
          for (;n.length; ) {
            const {nestedArrIndex: t, value: i} = n.pop();
            if (l(i)) if (a(i) && !d(i)) {
              let n = {
                v: i,
                i: t,
                n: this.norm.get(i)
              };
              e.push(n);
            } else r(i) && i.forEach(((e, t) => {
              n.push({
                nestedArrIndex: t,
                value: e
              });
            }));
          }
          t.$[i] = e;
        } else if (!d(s)) {
          let e = {
            v: s,
            n: this.norm.get(s)
          };
          t.$[i] = e;
        }
      })), this.records.push(t);
    }
    toJSON() {
      return {
        keys: this.keys,
        records: this.records
      };
    }
  }
  function b(e, n, {getFn: t = v.getFn} = {}) {
    const i = new x({
      getFn: t
    });
    return i.setKeys(e.map(g)), i.setSources(n), i.create(), i;
  }
  function w(e, {errors: n = 0, currentLocation: t = 0, expectedLocation: i = 0, distance: r = v.distance, ignoreLocation: a = v.ignoreLocation} = {}) {
    const s = n / e.length;
    if (a) return s;
    const o = Math.abs(i - t);
    return r ? s + o / r : o ? 1 : s;
  }
  function S(e, n, t, {location: i = v.location, distance: r = v.distance, threshold: a = v.threshold, findAllMatches: s = v.findAllMatches, minMatchCharLength: o = v.minMatchCharLength, includeMatches: c = v.includeMatches, ignoreLocation: l = v.ignoreLocation} = {}) {
    if (n.length > 32) throw new Error('Pattern length exceeds max of 32.');
    const d = n.length, h = e.length, u = Math.max(0, Math.min(i, h));
    let m = a, g = u;
    const p = o > 1 || c, f = p ? Array(h) : [];
    let y;
    for (;(y = e.indexOf(n, g)) > -1; ) {
      let e = w(n, {
        currentLocation: y,
        expectedLocation: u,
        distance: r,
        ignoreLocation: l
      });
      if (m = Math.min(e, m), g = y + d, p) {
        let e = 0;
        for (;e < d; ) f[y + e] = 1, e += 1;
      }
    }
    g = -1;
    let x = [], b = 1, S = d + h;
    const k = 1 << d - 1;
    for (let i = 0; i < d; i += 1) {
      let a = 0, o = S;
      for (;a < o; ) w(n, {
        errors: i,
        currentLocation: u + o,
        expectedLocation: u,
        distance: r,
        ignoreLocation: l
      }) <= m ? a = o : S = o, o = Math.floor((S - a) / 2 + a);
      S = o;
      let c = Math.max(1, u - o + 1), v = s ? h : Math.min(u + o, h) + d, y = Array(v + 2);
      y[v + 1] = (1 << i) - 1;
      for (let a = v; a >= c; a -= 1) {
        let s = a - 1, o = t[e.charAt(s)];
        if (p && (f[s] = +!!o), y[a] = (y[a + 1] << 1 | 1) & o, i && (y[a] |= (x[a + 1] | x[a]) << 1 | 1 | x[a + 1]), 
        y[a] & k && (b = w(n, {
          errors: i,
          currentLocation: s,
          expectedLocation: u,
          distance: r,
          ignoreLocation: l
        }), b <= m)) {
          if (m = b, g = s, g <= u) break;
          c = Math.max(1, 2 * u - g);
        }
      }
      if (w(n, {
        errors: i + 1,
        currentLocation: u,
        expectedLocation: u,
        distance: r,
        ignoreLocation: l
      }) > m) break;
      x = y;
    }
    const C = {
      isMatch: g >= 0,
      score: Math.max(.001, b)
    };
    if (p) {
      const e = function(e = [], n = v.minMatchCharLength) {
        let t = [], i = -1, r = -1, a = 0;
        for (let s = e.length; a < s; a += 1) {
          let s = e[a];
          s && -1 === i ? i = a : s || -1 === i || (r = a - 1, r - i + 1 >= n && t.push([ i, r ]), 
          i = -1);
        }
        return e[a - 1] && a - i >= n && t.push([ i, a - 1 ]), t;
      }(f, o);
      e.length ? c && (C.indices = e) : C.isMatch = !1;
    }
    return C;
  }
  function k(e) {
    let n = {};
    for (let t = 0, i = e.length; t < i; t += 1) {
      const r = e.charAt(t);
      n[r] = (n[r] || 0) | 1 << i - t - 1;
    }
    return n;
  }
  class C {
    constructor(e, {location: n = v.location, threshold: t = v.threshold, distance: i = v.distance, includeMatches: r = v.includeMatches, findAllMatches: a = v.findAllMatches, minMatchCharLength: s = v.minMatchCharLength, isCaseSensitive: o = v.isCaseSensitive, ignoreLocation: c = v.ignoreLocation} = {}) {
      if (this.options = {
        location: n,
        threshold: t,
        distance: i,
        includeMatches: r,
        findAllMatches: a,
        minMatchCharLength: s,
        isCaseSensitive: o,
        ignoreLocation: c
      }, this.pattern = o ? e : e.toLowerCase(), this.chunks = [], !this.pattern.length) return;
      const l = (e, n) => {
        this.chunks.push({
          pattern: e,
          alphabet: k(e),
          startIndex: n
        });
      }, d = this.pattern.length;
      if (d > 32) {
        let e = 0;
        const n = d % 32, t = d - n;
        for (;e < t; ) l(this.pattern.substr(e, 32), e), e += 32;
        if (n) {
          const e = d - 32;
          l(this.pattern.substr(e), e);
        }
      } else l(this.pattern, 0);
    }
    searchIn(e) {
      const {isCaseSensitive: n, includeMatches: t} = this.options;
      if (n || (e = e.toLowerCase()), this.pattern === e) {
        let n = {
          isMatch: !0,
          score: 0
        };
        return t && (n.indices = [ [ 0, e.length - 1 ] ]), n;
      }
      const {location: i, distance: r, threshold: a, findAllMatches: s, minMatchCharLength: o, ignoreLocation: c} = this.options;
      let l = [], d = 0, h = !1;
      this.chunks.forEach((({pattern: n, alphabet: u, startIndex: m}) => {
        const {isMatch: g, score: p, indices: f} = S(e, n, u, {
          location: i + m,
          distance: r,
          threshold: a,
          findAllMatches: s,
          minMatchCharLength: o,
          includeMatches: t,
          ignoreLocation: c
        });
        g && (h = !0), d += p, g && f && (l = [ ...l, ...f ]);
      }));
      let u = {
        isMatch: h,
        score: h ? d / this.chunks.length : 1
      };
      return h && t && (u.indices = l), u;
    }
  }
  class M {
    constructor(e) {
      this.pattern = e;
    }
    static isMultiMatch(e) {
      return B(e, this.multiRegex);
    }
    static isSingleMatch(e) {
      return B(e, this.singleRegex);
    }
    search() {}
  }
  function B(e, n) {
    const t = e.match(n);
    return t ? t[1] : null;
  }
  class L extends M {
    constructor(e, {location: n = v.location, threshold: t = v.threshold, distance: i = v.distance, includeMatches: r = v.includeMatches, findAllMatches: a = v.findAllMatches, minMatchCharLength: s = v.minMatchCharLength, isCaseSensitive: o = v.isCaseSensitive, ignoreLocation: c = v.ignoreLocation} = {}) {
      super(e), this._bitapSearch = new C(e, {
        location: n,
        threshold: t,
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
  class I extends M {
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
      let n, t = 0;
      const i = [], r = this.pattern.length;
      for (;(n = e.indexOf(this.pattern, t)) > -1; ) t = n + r, i.push([ n, t - 1 ]);
      const a = !!i.length;
      return {
        isMatch: a,
        score: a ? 0 : 1,
        indices: i
      };
    }
  }
  const F = [ class extends M {
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
      const n = e === this.pattern;
      return {
        isMatch: n,
        score: n ? 0 : 1,
        indices: [ 0, this.pattern.length - 1 ]
      };
    }
  }, I, class extends M {
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
      const n = e.startsWith(this.pattern);
      return {
        isMatch: n,
        score: n ? 0 : 1,
        indices: [ 0, this.pattern.length - 1 ]
      };
    }
  }, class extends M {
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
      const n = !e.startsWith(this.pattern);
      return {
        isMatch: n,
        score: n ? 0 : 1,
        indices: [ 0, e.length - 1 ]
      };
    }
  }, class extends M {
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
      const n = !e.endsWith(this.pattern);
      return {
        isMatch: n,
        score: n ? 0 : 1,
        indices: [ 0, e.length - 1 ]
      };
    }
  }, class extends M {
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
      const n = e.endsWith(this.pattern);
      return {
        isMatch: n,
        score: n ? 0 : 1,
        indices: [ e.length - this.pattern.length, e.length - 1 ]
      };
    }
  }, class extends M {
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
      const n = -1 === e.indexOf(this.pattern);
      return {
        isMatch: n,
        score: n ? 0 : 1,
        indices: [ 0, e.length - 1 ]
      };
    }
  }, L ], A = F.length, E = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/, _ = new Set([ L.type, I.type ]), T = [];
  function $(e, n) {
    for (let t = 0, i = T.length; t < i; t += 1) {
      let i = T[t];
      if (i.condition(e, n)) return new i(e, n);
    }
    return new C(e, n);
  }
  const D = '$and', z = '$path', P = e => !(!e[D] && !e.$or), N = e => ({
    [D]: Object.keys(e).map((n => ({
      [n]: e[n]
    })))
  });
  function O(e, n, {auto: t = !0} = {}) {
    const i = e => {
      let s = Object.keys(e);
      const o = (e => !!e[z])(e);
      if (!o && s.length > 1 && !P(e)) return i(N(e));
      if ((e => !r(e) && c(e) && !P(e))(e)) {
        const i = o ? e[z] : s[0], r = o ? e.$val : e[i];
        if (!a(r)) throw new Error((e => 'Invalid value for key ' + e)(i));
        const c = {
          keyId: f(i),
          pattern: r
        };
        return t && (c.searcher = $(r, n)), c;
      }
      let l = {
        children: [],
        operator: s[0]
      };
      return s.forEach((n => {
        const t = e[n];
        r(t) && t.forEach((e => {
          l.children.push(i(e));
        }));
      })), l;
    };
    return P(e) || (e = N(e)), i(e);
  }
  function R(e, n) {
    const t = e.matches;
    n.matches = [], l(t) && t.forEach((e => {
      if (!l(e.indices) || !e.indices.length) return;
      const {indices: t, value: i} = e;
      let r = {
        indices: t,
        value: i
      };
      e.key && (r.key = e.key.src), e.idx > -1 && (r.refIndex = e.idx), n.matches.push(r);
    }));
  }
  function j(e, n) {
    n.score = e.score;
  }
  class H {
    constructor(e, n = {}, t) {
      this.options = {
        ...v,
        ...n
      }, this.options.useExtendedSearch, this._keyStore = new m(this.options.keys), this.setCollection(e, t);
    }
    setCollection(e, n) {
      if (this._docs = e, n && !(n instanceof x)) throw new Error('Incorrect \'index\' type');
      this._myIndex = n || b(this.options.keys, this._docs, {
        getFn: this.options.getFn
      });
    }
    add(e) {
      l(e) && (this._docs.push(e), this._myIndex.add(e));
    }
    remove(e = (() => !1)) {
      const n = [];
      for (let t = 0, i = this._docs.length; t < i; t += 1) {
        const r = this._docs[t];
        e(r, t) && (this.removeAt(t), t -= 1, i -= 1, n.push(r));
      }
      return n;
    }
    removeAt(e) {
      this._docs.splice(e, 1), this._myIndex.removeAt(e);
    }
    getIndex() {
      return this._myIndex;
    }
    search(e, {limit: n = -1} = {}) {
      const {includeMatches: t, includeScore: i, shouldSort: r, sortFn: o, ignoreFieldNorm: c} = this.options;
      let l = a(e) ? a(this._docs[0]) ? this._searchStringList(e) : this._searchObjectList(e) : this._searchLogical(e);
      return function(e, {ignoreFieldNorm: n = v.ignoreFieldNorm}) {
        e.forEach((e => {
          let t = 1;
          e.matches.forEach((({key: e, norm: i, score: r}) => {
            const a = e ? e.weight : null;
            t *= Math.pow(0 === r && a ? Number.EPSILON : r, (a || 1) * (n ? 1 : i));
          })), e.score = t;
        }));
      }(l, {
        ignoreFieldNorm: c
      }), r && l.sort(o), s(n) && n > -1 && (l = l.slice(0, n)), function(e, n, {includeMatches: t = v.includeMatches, includeScore: i = v.includeScore} = {}) {
        const r = [];
        return t && r.push(R), i && r.push(j), e.map((e => {
          const {idx: t} = e, i = {
            item: n[t],
            refIndex: t
          };
          return r.length && r.forEach((n => {
            n(e, i);
          })), i;
        }));
      }(l, this._docs, {
        includeMatches: t,
        includeScore: i
      });
    }
    _searchStringList(e) {
      const n = $(e, this.options), {records: t} = this._myIndex, i = [];
      return t.forEach((({v: e, i: t, n: r}) => {
        if (!l(e)) return;
        const {isMatch: a, score: s, indices: o} = n.searchIn(e);
        a && i.push({
          item: e,
          idx: t,
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
      const n = O(e, this.options), t = (e, n, i) => {
        if (!e.children) {
          const {keyId: t, searcher: r} = e, a = this._findMatches({
            key: this._keyStore.get(t),
            value: this._myIndex.getValueForItemAtKeyId(n, t),
            searcher: r
          });
          return a && a.length ? [ {
            idx: i,
            item: n,
            matches: a
          } ] : [];
        }
        switch (e.operator) {
         case D:
          {
            const r = [];
            for (let a = 0, s = e.children.length; a < s; a += 1) {
              const s = e.children[a], o = t(s, n, i);
              if (!o.length) return [];
              r.push(...o);
            }
            return r;
          }

         case '$or':
          {
            const r = [];
            for (let a = 0, s = e.children.length; a < s; a += 1) {
              const s = e.children[a], o = t(s, n, i);
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
        if (l(e)) {
          let s = t(n, e, i);
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
      const n = $(e, this.options), {keys: t, records: i} = this._myIndex, r = [];
      return i.forEach((({$: e, i: i}) => {
        if (!l(e)) return;
        let a = [];
        t.forEach(((t, i) => {
          a.push(...this._findMatches({
            key: t,
            value: e[i],
            searcher: n
          }));
        })), a.length && r.push({
          idx: i,
          item: e,
          matches: a
        });
      })), r;
    }
    _findMatches({key: e, value: n, searcher: t}) {
      if (!l(n)) return [];
      let i = [];
      if (r(n)) n.forEach((({v: n, i: r, n: a}) => {
        if (!l(n)) return;
        const {isMatch: s, score: o, indices: c} = t.searchIn(n);
        s && i.push({
          score: o,
          key: e,
          value: n,
          idx: r,
          norm: a,
          indices: c
        });
      })); else {
        const {v: r, n: a} = n, {isMatch: s, score: o, indices: c} = t.searchIn(r);
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
  H.version = '6.4.6', H.createIndex = b, H.parseIndex = function(e, {getFn: n = v.getFn} = {}) {
    const {keys: t, records: i} = e, r = new x({
      getFn: n
    });
    return r.setKeys(t), r.setIndexRecords(i), r;
  }, H.config = v, function(...e) {
    T.push(...e);
  }(class {
    constructor(e, {isCaseSensitive: n = v.isCaseSensitive, includeMatches: t = v.includeMatches, minMatchCharLength: i = v.minMatchCharLength, ignoreLocation: r = v.ignoreLocation, findAllMatches: a = v.findAllMatches, location: s = v.location, threshold: o = v.threshold, distance: c = v.distance} = {}) {
      this.query = null, this.options = {
        isCaseSensitive: n,
        includeMatches: t,
        minMatchCharLength: i,
        findAllMatches: a,
        ignoreLocation: r,
        location: s,
        threshold: o,
        distance: c
      }, this.pattern = n ? e : e.toLowerCase(), this.query = function(e, n = {}) {
        return e.split('|').map((e => {
          let t = e.trim().split(E).filter((e => e && !!e.trim())), i = [];
          for (let e = 0, r = t.length; e < r; e += 1) {
            const r = t[e];
            let a = !1, s = -1;
            for (;!a && ++s < A; ) {
              const e = F[s];
              let t = e.isMultiMatch(r);
              t && (i.push(new e(t, n)), a = !0);
            }
            if (!a) for (s = -1; ++s < A; ) {
              const e = F[s];
              let t = e.isSingleMatch(r);
              if (t) {
                i.push(new e(t, n));
                break;
              }
            }
          }
          return i;
        }));
      }(this.pattern, this.options);
    }
    static condition(e, n) {
      return n.useExtendedSearch;
    }
    searchIn(e) {
      const n = this.query;
      if (!n) return {
        isMatch: !1,
        score: 1
      };
      const {includeMatches: t, isCaseSensitive: i} = this.options;
      e = i ? e : e.toLowerCase();
      let r = 0, a = [], s = 0;
      for (let i = 0, o = n.length; i < o; i += 1) {
        const o = n[i];
        a.length = 0, r = 0;
        for (let n = 0, i = o.length; n < i; n += 1) {
          const i = o[n], {isMatch: c, indices: l, score: d} = i.search(e);
          if (!c) {
            s = 0, r = 0, a.length = 0;
            break;
          }
          if (r += 1, s += d, t) {
            const e = i.constructor.type;
            _.has(e) ? a = [ ...a, ...l ] : a.push(l);
          }
        }
        if (r) {
          let e = {
            isMatch: !0,
            score: s / r
          };
          return t && (e.indices = a), e;
        }
      }
      return {
        isMatch: !1,
        score: 1
      };
    }
  });
  const U = async e => JSON.parse((await e.text()).trim().substr(9));
  document.head.innerHTML = `<title>${document.title}</title>`, document.body.innerHTML = '', 
  (async () => {
    const e = JSON.parse(document.documentElement.getAttribute('data-he-context'));
    var n;
    i.uid = localStorage.getItem('Session.UserId'), document.head.innerHTML = function(e, n, t, i) {
      n = n || function(e) {
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
      c(n(e.title)), c('</title>\n<meta name="description" content="D2l Overhaul">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\x3c!-- FONT --\x3e\n<style>/* fallback */\r\n@font-face {\r\n  font-family: \'Material Icons\';\r\n  font-style: normal;\r\n  font-weight: 400;\r\n  src: url(https://fonts.gstatic.com/s/materialicons/v99/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format(\'woff2\');\r\n}\r\n\r\n.material-icons {\r\n  font-family: \'Material Icons\';\r\n  font-weight: normal;\r\n  font-style: normal;\r\n  font-size: 24px;  /* Preferred icon size */\r\n  display: inline-block;\r\n  line-height: 1;\r\n  text-transform: none;\r\n  letter-spacing: normal;\r\n  word-wrap: normal;\r\n  white-space: nowrap;\r\n  direction: ltr;\r\n  user-select: none;\r\n\r\n  /* Support for all WebKit browsers. */\r\n  -webkit-font-smoothing: antialiased;\r\n  /* Support for Safari and Chrome. */\r\n  text-rendering: optimizeLegibility;\r\n\r\n  /* Support for Firefox. */\r\n  -moz-osx-font-smoothing: grayscale;\r\n\r\n  /* Support for IE. */\r\n  font-feature-settings: \'liga\';\r\n}\r\n/* Rules for sizing the icon. */\r\n.material-icons.md-18 { font-size: 18px; }\r\n.material-icons.md-24 { font-size: 24px; }\r\n.material-icons.md-36 { font-size: 36px; }\r\n.material-icons.md-48 { font-size: 48px; }\r\n\r\n/* Rules for using icons as black on a light background. */\r\n.material-icons.md-dark { color: rgba(0, 0, 0, 0.54); }\r\n.material-icons.md-dark.md-inactive { color: rgba(0, 0, 0, 0.26); }\r\n\r\n/* Rules for using icons as white on a dark background. */\r\n.material-icons.md-light { color: rgba(255, 255, 255, 1); }\r\n.material-icons.md-light.md-inactive { color: rgba(255, 255, 255, 0.3); }\r\n\r\n/* Rules for using icons as orange on a dark background. */\r\n.material-icons.orange600 { color: #FB8C00; }</style>\n<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" type="text/css">\n<link href="https://fonts.googleapis.com/css?family=Google+Sans:300,400,500" rel="stylesheet" type="text/css">\n\x3c!-- CSS --\x3e\n<style>:root {\n  --Background: #2C2C2C;\n  --Foreground: #3C3C3C;\n  --Border: #4A4A4A;\n  --Text-Main: #fff;\n}</style>\n<style>/* General Page Stuff */\nhtml, body {\n  height: 100%;\n  width: 100%;\n  font-family: \'Roboto\',Helvetica,Arial,sans-serif;\n  color: var(--Text-Main); }\n\nbody {\n  margin: 0;\n  background-color: var(--Background);\n  position: relative; }\n\n* {\n  box-sizing: border-box; }\n\npicture, picture img {\n  display: block;\n  height: 100%;\n  width: 100%; }\n\n*::-webkit-scrollbar {\n  width: 16px; }\n\n*::-webkit-scrollbar-thumb {\n  background: #dadce0;\n  background-clip: padding-box;\n  border: 4px solid transparent;\n  border-radius: 8px;\n  box-shadow: none;\n  min-height: 50px; }\n\n*::-webkit-scrollbar-track {\n  background: none;\n  border: none; }\n\n/* Text */\nh1 {\n  color: var(--Text-Main);\n  font-size: 1.375rem;\n  font-weight: 500;\n  line-height: 1.75rem;\n  font-family: \'Google Sans\',Roboto,Arial,sans-serif; }\n\nh2 {\n  color: var(--Text-Main);\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.25rem;\n  margin: 0; }\n\n/* Aside */\n.SideBar {\n  display: flex;\n  flex-direction: column;\n  height: 100vh;\n  width: 19rem;\n  padding: .5rem 0;\n  z-index: 990;\n  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);\n  background-color: var(--Foreground);\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  overflow-y: scroll;\n  max-width: 0;\n  transition: max-width .5s; }\n  .SideBar.Active {\n    max-width: 100%; }\n\n.SideBarSeperator {\n  border-top: 0.0625rem solid var(--Border);\n  margin: .5rem 0; }\n\n.SideBarSection {\n  flex-grow: 1;\n  min-height: max-content; }\n\n.SideBarHeader {\n  padding: 0 1rem;\n  letter-spacing: .01785714em;\n  font-family: \'Google Sans\',Roboto,Arial,sans-serif;\n  font-size: 0.875rem;\n  font-weight: 500;\n  line-height: 1.25rem; }\n\n.SideBarItem {\n  display: flex;\n  align-content: center;\n  border-radius: 0 2rem 2rem 0;\n  height: 3.5rem;\n  padding-left: 1.5rem;\n  margin-right: 1rem;\n  cursor: pointer;\n  text-decoration: none;\n  color: #fff; }\n  .SideBarItem .SideBarItemText {\n    margin-left: 1rem;\n    font-family: \'Google Sans\',Roboto,Arial,sans-serif;\n    letter-spacing: .01785714em;\n    font-size: 0.875rem;\n    font-weight: 500;\n    overflow: hidden;\n    white-space: nowrap;\n    margin-right: 4rem;\n    text-overflow: ellipsis; }\n  .SideBarItem span {\n    line-height: 3.5rem; }\n  .SideBarItem:hover {\n    background-color: #343434; }\n\n/* Content */\n#Content {\n  min-height: 100%;\n  height: min-content;\n  width: 100%;\n  display: flex;\n  flex-direction: column; }\n\n#Content > * {\n  padding: 1rem; }\n\nmain {\n  height: 100%;\n  width: 100%; }\n\n/* Home Page */\n.Home > main {\n  max-width: 70rem;\n  margin: auto;\n  display: grid; }\n\n/* Loader Page */\nmain.Loader {\n  display: flex;\n  align-content: center;\n  flex-direction: column; }\n\n.lds-grid {\n  margin: auto;\n  display: grid;\n  grid-template-columns: repeat(3, 16px);\n  grid-template-rows: repeat(3, 16px);\n  grid-gap: 8px; }\n\n.lds-grid div {\n  border-radius: 50%;\n  background: #fff;\n  animation: lds-grid 1.2s linear infinite; }\n\n.lds-grid div:nth-child(1) {\n  animation-delay: 0s; }\n\n.lds-grid div:nth-child(2), .lds-grid div:nth-child(4) {\n  animation-delay: -0.4s; }\n\n.lds-grid div:nth-child(3), .lds-grid div:nth-child(5), .lds-grid div:nth-child(7) {\n  animation-delay: -0.8s; }\n\n.lds-grid div:nth-child(6), .lds-grid div:nth-child(8) {\n  animation-delay: -1.2s; }\n\n.lds-grid div:nth-child(9) {\n  animation-delay: -1.6s; }\n\n@keyframes lds-grid {\n  0%, 100% {\n    opacity: 1; }\n  50% {\n    opacity: 0.5; } }\n\n/* General */\n.Hidden, .Filtered {\n  display: none !important; }\n\n/* Hovers */\n.Class, .StreamCard {\n  cursor: pointer; }\n\n.Class:hover, .StreamCard:hover {\n  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);\n  border-radius: .75rem; }\n\n/* Components */\n.NavBar {\n  padding: .75rem 1rem !important;\n  height: 4rem;\n  width: 100%;\n  background: var(--Foreground);\n  display: grid;\n  grid-template-columns: 2.5rem auto max-content;\n  position: relative; }\n  .NavBar .AsideButton {\n    display: flex;\n    align-content: center;\n    border-radius: 50%; }\n    .NavBar .AsideButton:hover {\n      background: var(--Background); }\n    .NavBar .AsideButton svg {\n      margin: auto;\n      width: 2rem;\n      height: 2rem; }\n  .NavBar input {\n    height: 2.5rem;\n    width: 50%;\n    margin: auto;\n    display: block;\n    background-color: #212121;\n    outline: none;\n    border: none;\n    border-radius: .5rem;\n    padding: .5rem;\n    color: #fff; }\n  .NavBar .Account {\n    display: grid;\n    grid-template-columns: repeat(4, 2.5rem);\n    grid-gap: .25rem; }\n    .NavBar .Account span {\n      width: 2.5rem;\n      height: 2.5rem;\n      text-align: center;\n      line-height: 2.5rem; }\n      .NavBar .Account span.Active {\n        color: #FB8C00; }\n    .NavBar .Account .Profile picture {\n      padding: .25rem; }\n    .NavBar .Account span, .NavBar .Account div {\n      cursor: pointer;\n      border-radius: .5rem; }\n    .NavBar .Account span:hover, .NavBar .Account div:hover {\n      background-color: #2F3033; }\n\n.ClassContainer {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: repeat(auto-fit, min-content);\n  grid-gap: 2rem; }\n\n.Class {\n  height: 15rem;\n  width: 100%;\n  overflow: hidden;\n  background-color: var(--Foreground);\n  border: 0.0625rem solid var(--Border);\n  border-radius: .5rem;\n  position: relative;\n  z-index: 0; }\n  .Class h2 {\n    height: 100%;\n    line-height: 3rem;\n    padding-left: 1rem; }\n\n.Class > div {\n  height: 100%;\n  width: 100%;\n  background: rgba(0, 0, 0, 0.25);\n  padding: 1rem;\n  display: grid;\n  grid-template-rows: auto 3rem; }\n\n.Class div div {\n  display: flex; }\n\n.Class > picture {\n  z-index: -1;\n  position: absolute; }\n\n.Class[disabled] > picture {\n  filter: grayscale(100%); }\n\n.Profile {\n  height: 100%;\n  aspect-ratio: 1 / 1;\n  border-radius: 50%; }\n\n/* Stream */\n.Stream > main {\n  flex-grow: 1;\n  min-height: max-content;\n  width: calc(100% - 2*1.5rem);\n  max-width: 62.5rem;\n  margin: 0 auto;\n  padding: 0 !important; }\n\n.ClassPicture {\n  margin: 1.5rem 0;\n  overflow: hidden;\n  border-radius: 1rem;\n  position: relative; }\n\n.ClassPictureContent {\n  display: flex;\n  flex-direction: column;\n  padding: 1.5rem;\n  margin: 0;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%; }\n  .ClassPictureContent h1, .ClassPictureContent h2 {\n    margin: 0; }\n  .ClassPictureContent h4 {\n    margin-top: .4rem;\n    font-weight: 500;\n    font-style: normal; }\n\n.ChipFilter {\n  display: inline-flex;\n  height: max-content;\n  width: max-content;\n  padding: .25rem .5rem;\n  border: 0.0625rem solid var(--Border);\n  border-radius: 2rem;\n  font-size: .75rem;\n  cursor: pointer;\n  user-select: none;\n  background-color: var(--Foreground); }\n  .ChipFilter .chipIcon {\n    border-radius: 50%;\n    padding: .25rem;\n    font-size: .75rem;\n    margin-right: .25rem;\n    background-color: #3367D6; }\n  .ChipFilter p {\n    margin: auto;\n    display: inline-block; }\n  .ChipFilter:hover {\n    background-color: #343434; }\n  .ChipFilter.Active {\n    background-color: #181818; }\n\n/* Stream Cards */\n.StreamCard {\n  width: 100%;\n  height: 4rem;\n  background-color: var(--Foreground);\n  border: 0.0625rem solid var(--Border);\n  border-radius: .5rem;\n  display: grid;\n  grid-template-columns: max-content 1fr;\n  grid-template-rows: 3rem max-content;\n  grid-template-areas: \'Icon Title\'\r \'Content Content\';\n  padding: .5rem;\n  grid-gap: .5rem;\n  margin: 1rem 0; }\n  .StreamCard h1, .StreamCard h3 {\n    margin: 0; }\n  .StreamCard h3 {\n    font-size: .75rem; }\n\n.StreamCardTitle {\n  grid-area: Title; }\n\n.StreamCardIcon {\n  grid-area: Icon;\n  background-color: var(--Background);\n  width: 3rem;\n  height: 3rem;\n  border-radius: 2rem;\n  display: flex;\n  align-content: center; }\n  .StreamCardIcon.OnSubmission {\n    background-color: #3367d6; }\n  .StreamCardIcon.DueDate {\n    background-color: #e91e63; }\n  .StreamCardIcon.Unread {\n    background-color: #FB8C00; }\n  .StreamCardIcon span {\n    margin: auto; }\n\n.StreamCardBody {\n  grid-area: Content;\n  overflow: hidden;\n  width: 100%;\n  height: 0;\n  cursor: auto; }\n\n.StreamCard.Active, .StreamCard.Active > .StreamCardBody {\n  height: max-content; }\n\n.FileSubmit {\n  height: 12.5rem;\n  display: grid;\n  grid-template-columns: 75% 1fr; }\n  .FileSubmit .UploadedFiles {\n    display: flex;\n    flex-wrap: wrap;\n    overflow-y: auto; }\n    .FileSubmit .UploadedFiles .UploadedFile {\n      width: 8rem;\n      height: 4.5rem;\n      background: var(--Background);\n      border-radius: .5rem;\n      margin: .25rem; }\n  .FileSubmit .FileForm {\n    display: flex;\n    flex-direction: column; }\n    .FileSubmit .FileForm textarea {\n      background-color: #222222;\n      border: 0.0625rem solid var(--Border);\n      flex-grow: 1;\n      border-radius: .5rem;\n      resize: none;\n      outline: none;\n      color: #fff; }\n    .FileSubmit .FileForm button {\n      background-color: #3367D6;\n      margin-top: 1rem;\n      height: 2rem;\n      border-radius: .5rem;\n      border: none;\n      outline: none;\n      cursor: pointer; }\n      .FileSubmit .FileForm button:hover {\n        opacity: .75; }\n\n.DropDown {\n  min-height: 30rem;\n  width: 20rem;\n  border-radius: .5rem;\n  border: 0.0625rem solid var(--Border);\n  background-color: var(--Foreground);\n  position: absolute;\n  top: 100%;\n  right: 0;\n  z-index: 2;\n  padding: 1rem;\n  margin: -.25rem .5rem;\n  overflow-y: scroll; }\n</style>'), 
      o;
    }({
      title: document.title
    }), document.body.innerHTML = function(e, n, t, i) {
      var r = '';
      function a(e) {
        null != e && (r += e);
      }
      return a('<aside class="SideBar" id="SideBar"></aside>\n<section id="Content">\n  \x3c!-- NavBar --\x3e\n  '), 
      a(e.navBar), a('\n  \x3c!-- Main Body --\x3e\n  <main id="main" class="Loader">\n    <div class="lds-grid">\n      <div></div>\n      <div></div>\n      <div></div>\n      <div></div>\n      <div></div>\n      <div></div>\n      <div></div>\n      <div></div>\n      <div></div>\n    </div>\n  </main>\n</section>'), 
      r;
    }({
      content: null,
      navBar: (n = '', n += '<nav class="NavBar" id="NavBar">\r\n  <div class="AsideButton" id="AsideButtton">\r\n    <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" class=" NMm5M"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>\r\n  </div>\r\n  <div>\r\n    <input id="Search" placeholder="Search" type="text" />\r\n  </div>\r\n  <div class="Account">\r\n    <span class="material-icons" id="MailButton">\r\n      mail\r\n    </span>\r\n    <span class="material-icons" id="MessageButton">\r\n      message\r\n    </span>      \r\n    <span class="material-icons" id="NotificationButton">\r\n      notifications\r\n    </span>\r\n    <div class="Profile" id="AccountButtton">\r\n      <picture>\r\n        <img src="https://durham.elearningontario.ca/d2l/api/lp/1.32/profile/myProfile/image" />\r\n      </picture>\r\n    </div>\r\n  </div>\r\n</nav>', 
      n)
    }), ((e, n) => {
      const t = document.getElementById('main'), i = document.getElementById('SideBar'), r = document.getElementById('AsideButtton'), a = document.getElementById('Search'), s = document.getElementById('MailButton'), o = document.getElementById('MessageButton'), c = document.getElementById('NotificationButton');
      r.addEventListener('click', (e => {
        e.stopPropagation(), i.classList.add('Active');
      })), a.addEventListener('keyup', (() => {
        const e = [];
        if (t.querySelectorAll('.Search').forEach((n => e.push(...n.children))), '' == a.value.trim()) return void e.forEach((e => e.classList.toggle('Hidden', !1)));
        const n = e.map(((e, n) => ({
          Name: e.querySelector('h1').innerText,
          Teacher: e.querySelector('h2')?.innerText || '',
          child: e,
          id: n
        }))), i = (r = n, s = a.value, new H(r, {
          isCaseSensitive: !1,
          includeScore: !0,
          shouldSort: !0,
          useExtendedSearch: !0,
          ignoreLocation: !0,
          keys: [ 'Name', 'Teacher' ]
        }).search(s));
        var r, s;
        n.forEach((e => {
          e.child.classList.toggle('Hidden', !i.some((n => n.item.id == e.id && n.score < .5)));
        }));
      }));
      const l = async () => {
        const e = await fetch('/d2l/activityFeed/checkForNewAlerts?isXhr=true&requestId=3&X-D2L-Session=no-keep-alive'), n = await U(e);
        n.Payload && [ 'Messages', 'Grades' ].forEach((e => {
          const t = n.Payload.includes(e);
          switch (e) {
           case 'Messages':
            s.classList.toggle('Active', t);
            break;

           case 'Grades':
            c.classList.toggle('Active', t);
            break;

           default:
            alert(`Unknown Notification Type ${e}`);
          }
        }));
      };
      l(), setInterval((() => l()), 5e3);
      const d = async (t, i) => {
        t.stopPropagation();
        const r = document.getElementById('DropDown');
        var a;
        switch (r && r.remove(), e.insertAdjacentHTML('beforeend', (a = '', a += '<div class="DropDown" id="DropDown">\r\n\r\n</div>')), 
        i) {
         case 'MailButton':
          {
            const e = await fetch(`https://durham.elearningontario.ca/d2l/api/lp/${n.apiVersion.lp}/alerts/user/${n.uid}`, {
              headers: {
                authorization: `Bearer ${await n.getToken()}`
              },
              method: 'GET'
            });
            console.log(await e.text());
            break;
          }

         case 'MessageButton':
          break;

         case 'NotificationButton':
          {
            const e = await fetch(`/d2l/MiniBar/${n.cid}/ActivityFeed/GetAlertsDaylight?Category=1&_d2l_prc$headingLevel=2&_d2l_prc$scope=&_d2l_prc$hasActiveForm=false&isXhr=true&requestId=3`, {
              method: 'GET'
            }), t = await U(e);
            console.log(t);
            break;
          }
        }
        document.getElementById('DropDown').addEventListener('click', (e => e.stopPropagation()));
      };
      s.addEventListener('click', (e => d(e, 'MailButton'))), o.addEventListener('click', (e => d(e, 'MessageButton'))), 
      c.addEventListener('click', (e => d(e, 'NotificationButton'))), document.addEventListener('click', (() => {
        const e = document.getElementById('DropDown');
        e && e.remove(), i.classList.contains('Active') && i.classList.remove('Active');
      }));
    })(document.getElementById('NavBar'), i), (async (e, n) => {
      const t = (new Date).valueOf(), i = await fetch(`https://bc59e98c-eabc-4d42-98e1-edfe93518966.enrollments.api.brightspace.com/users/${n.uid}?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false`, {
        headers: {
          authorization: `Bearer ${await n.getToken()}`
        }
      }).then((e => e.json())), r = await Promise.all(i.entities.map((async ({href: e}) => {
        const i = await fetch(e, {
          headers: {
            authorization: `Bearer ${await n.getToken()}`
          },
          method: 'GET'
        }), r = await i.json(), a = await fetch(r.links[1].href, {
          headers: {
            authorization: `Bearer ${await n.getToken()}`
          },
          method: 'GET'
        }), s = await a.json(), {endDate: o, name: c} = s.properties;
        return {
          name: c,
          disabled: new Date(o).valueOf() < t,
          href: s.links[0].href.replace('https://bc59e98c-eabc-4d42-98e1-edfe93518966.folio.api.brightspace.com/organizations/', 'https://durham.elearningontario.ca/d2l/home/')
        };
      })));
      e.innerHTML = function(e, n, t, i) {
        n = n || function(e) {
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
        return c('<a class="SideBarItem" id="SideBarClassesBtn"><span class="material-icons">home</span><span class="SideBarItemText">Classes</span></a>\r\n<a class="SideBarItem" id="SideBarCalenderBtn"><span class="material-icons">calendar_today</span><span class="SideBarItemText">Calender</span></a>\r\n<div class="SideBarSeperator"></div>\r\n<div class="SideBarSection" id="SideBarClasses">\r\n  <div class="SideBarHeader">Enrolled</div>\r\n  '), 
        e.classes.forEach((e => {
          c('\r\n    '), e.disabled || (c('\r\n      <a class="SideBarItem" id="SideBarCalenderBtn" href="'), 
          c(n(e.href)), c('"><span class="material-icons">class</span><span class="SideBarItemText">'), 
          c(n(e.name)), c('</span></a>\r\n    ')), c('\r\n  ');
        })), c('\r\n</div>\r\n<div class="SideBarSeperator"></div>\r\n<a class="SideBarItem" id="SideBarSettingsBtn"><span class="material-icons">settings</span><span class="SideBarItemText">Settings</span></a>'), 
        o;
      }({
        classes: r
      }), document.getElementById('SideBarClassesBtn').addEventListener('click', (() => {
        n.setPage('HOME');
      }));
    })(document.getElementById('SideBar'), i), await i.start(e);
  })();
}();
