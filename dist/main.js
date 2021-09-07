!function() {
  const e = 'HOME', t = 'STREAM', n = new class {
    constructor() {
      this.organizationURL = 'https://bc59e98c-eabc-4d42-98e1-edfe93518966.organizations.api.brightspace.com/', 
      this.location = e, this.token, this.data = {}, this.uid, this.cid, this.cancel, 
      this.apiVersion = {};
    }
    async start(n) {
      this.data = n, this.cid = n.orgUnitId, await this._apiVersion(), setInterval((() => this.getToken(!0)), 3e5);
      let i = e;
      switch (!0) {
       case /\/d2l\/home\/[^/]+$/.test(window.location.pathname):
        i = t, this.cid = window.location.pathname.replace('/d2l/home/', '');
        break;

       case '/d2l/home' == window.location.pathname:
       default:
        i = e;
      }
      this.setPage(i);
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
    setPage(n) {
      const i = document.getElementById('Content').classList;
      switch ('function' == typeof this.cancel && this.cancel(), n) {
       case e:
        for (this.cid = null, this.cancel = (async e => {
          const t = (new Date).valueOf(), n = document.getElementById('main'), i = await fetch(`https://bc59e98c-eabc-4d42-98e1-edfe93518966.enrollments.api.brightspace.com/users/${e.uid}?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false`, {
            headers: {
              authorization: `Bearer ${await e.getToken()}`
            }
          }).then((e => e.json())), r = await Promise.all(i.entities.map((async ({href: n}) => {
            const i = await fetch(n, {
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
              disabled: new Date(l).valueOf() < t,
              href: s.links[0].href.replace('https://bc59e98c-eabc-4d42-98e1-edfe93518966.folio.api.brightspace.com/organizations/', 'https://durham.elearningontario.ca/d2l/home/'),
              picture: c.links ? c.links[2].href : c,
              teacher: {
                name: 'TODO',
                picture: 'https://durham.elearningontario.ca/d2l/img/0/Framework.UserProfileBadge.actProfileDaylight100.png?v=20.21.8.31658'
              }
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
              c('\n    <div class="Class" '), c(t(e.disabled ? 'disabled' : '')), c(' class_link="'), 
              c(t(e.href)), c('">\n      <picture>\n        <img src="'), c(e.picture), c('" />\n      </picture>\n      <div>\n        <h1>'), 
              c(t(e.name)), c('</h1>\n        <div>\n          <div class="Profile">\n            <picture>\n              <img src="'), 
              c(e.teacher.picture), c('" />\n            </picture>\n          </div>\n          <h2>'), 
              c(t(e.teacher.name)), c('</h2>\n        </div>\n      </div>\n    </div>\n  ');
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
        })(this); i.length > 0; ) i.remove(i.item(0));
        i.add('Home');
        break;

       case t:
        for (this.cancel = (async e => {
          const t = document.getElementById('main'), n = await fetch(`${e.organizationURL}${e.cid}`, {
            headers: {
              Accept: 'application/vnd.siren+json',
              authorization: `Bearer ${await e.getToken()}`
            }
          }), i = await n.json(), r = await fetch(i.entities[2].href), a = await r.json().catch((() => 'https://durham.elearningontario.ca/d2l/img/0/Framework.UserProfileBadge.actProfileDaylight100.png?v=20.21.8.31658')), s = {
            name: i.properties.name,
            description: i.properties.description,
            picture: a.links ? a.links[2].href : a,
            teacher: {
              name: 'TODO',
              picture: 'https://durham.elearningontario.ca/d2l/img/0/Framework.UserProfileBadge.actProfileDaylight100.png?v=20.21.8.31658'
            }
          }, o = await (async e => {
            const t = await fetch(`/d2l/api/le/${e.apiVersion.le}/${e.cid}/news/`);
            return (await t.json()).map((e => (e.StartDate = new Date(e.StartDate).toDateString(), 
            e.Category = 'ChipFilterHome', function(e, t, n, i) {
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
              return c('<div class="StreamCard" id="'), c(e.Id), c('" Category="'), c(e.Category), 
              c('">\n  <div class="StreamCardIcon">\n    <svg focusable="false" width="24" height="24" viewBox="0 0 24 24" class=" NMm5M"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h2v8l2.5-1.5L13 12V4h5v16z"></path></svg>\n  </div>\n  <div class="StreamCardTitle">\n    <h1>'), 
              c(t(e.Title)), c('</h1>\n    <h3>'), c(t(e.StartDate)), c('</h3>\n  </div>\n  <div class="StreamCardBody">'), 
              c(e.Body.Html), c('</div>\n</div>'), o;
            }(e)))).join('\n');
          })(e);
          t.innerHTML = function(e, t, n, i) {
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
            return c('\x3c!-- Top --\x3e\n<section class="ClassPicture">\n  <picture>\n    <img src="https://s.brightspace.com/course-images/images/590cea69-f3f4-47aa-88c1-e69b9c5fd86f/banner-wide-low-density-max-size.jpg" />\n  </picture>\n  <div class="ClassPictureContent">\n    <h1>'), 
            c(t(e.classData.name)), c('</h1>\n    <h2>'), c(t(e.classData.description)), c('</h2>\n    <h4>Meet Link: <a>Link</a></h4>\n  </div>\n</section>\n<div class="StreamFilter" id="ChipFilters">\n  <div class="ChipFilter" id="ChipFilterHome"><span class="material-icons chipIcon">home</span><p>Stream</p></div>\n  <div class="ChipFilter" id="ChipFilterContent"><span class="material-icons chipIcon">source</span><p>Content</p></div>\n  <div class="ChipFilter" id="ChipFilterDiscussions"><span class="material-icons chipIcon">chat</span><p>Discussions</p></div>\n  <div class="ChipFilter" id="ChipFilterAssignments"><span class="material-icons chipIcon">assignment</span><p>Assignments</p></div>\n  <div class="ChipFilter" id="ChipFilterQuizzes"><span class="material-icons chipIcon">quiz</span><p>Quizzes</p></div>\n</div>\n\x3c!-- Stream Announcements --\x3e\n<section class="StreamCards Search Filter">'), 
            c(e.announcements), c('</section>'), o;
          }({
            announcements: o,
            classData: s
          });
          const c = e => {
            e.classList.contains('Active') ? e.classList.remove('Active') : e.classList.add('Active');
          };
          [ ...t.querySelector('section.StreamCards').children ].forEach((e => {
            e.addEventListener('click', (() => c(e)));
          }));
          const l = document.getElementById('ChipFilters'), d = document.querySelector('.Filter'), h = e => {
            e.classList.toggle('Active', !e.classList.contains('Active'));
            const t = [ ...l.querySelectorAll('.ChipFilter') ];
            t.some((e => e.classList.contains('Active'))) ? [ ...d.children ].forEach((e => e.classList.toggle('Filtered', !t.some((t => t.classList.contains('Active') && t.id == e.getAttribute('Category')))))) : [ ...d.children ].forEach((e => e.classList.remove('Filtered')));
          };
          return [ ...l.children ].forEach((e => {
            e.addEventListener('click', (() => h(e)));
          })), () => {
            [ ...t.querySelector('section.StreamCards').children ].forEach((e => {
              e.removeEventListener('click', (() => c(e)));
            })), [ ...l.children ].forEach((e => {
              e.removeEventListener('click', (() => h(e)));
            }));
          };
        })(this); i.length > 0; ) i.remove(i.item(0));
        i.add('Stream');
        break;

       default:
        return void console.log(`Unknown location: ${n}`);
      }
      this.location = n;
    }
  };
  function i(e) {
    return Array.isArray ? Array.isArray(e) : '[object Array]' === d(e);
  }
  function r(e) {
    return 'string' == typeof e;
  }
  function a(e) {
    return 'number' == typeof e;
  }
  function s(e) {
    return !0 === e || !1 === e || function(e) {
      return o(e) && null !== e;
    }(e) && '[object Boolean]' == d(e);
  }
  function o(e) {
    return 'object' == typeof e;
  }
  function c(e) {
    return null != e;
  }
  function l(e) {
    return !e.trim().length;
  }
  function d(e) {
    return null == e ? void 0 === e ? '[object Undefined]' : '[object Null]' : Object.prototype.toString.call(e);
  }
  const h = Object.prototype.hasOwnProperty;
  class u {
    constructor(e) {
      this._keys = [], this._keyMap = {};
      let t = 0;
      e.forEach((e => {
        let n = g(e);
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
  function g(e) {
    let t = null, n = null, a = null, s = 1;
    if (r(e) || i(e)) a = e, t = m(e), n = p(e); else {
      if (!h.call(e, 'name')) throw new Error('Missing name property in key');
      const i = e.name;
      if (a = i, h.call(e, 'weight') && (s = e.weight, s <= 0)) throw new Error((e => `Property 'weight' in key '${e}' must be a positive integer`)(i));
      t = m(i), n = p(i);
    }
    return {
      path: t,
      id: n,
      weight: s,
      src: a
    };
  }
  function m(e) {
    return i(e) ? e : e.split('.');
  }
  function p(e) {
    return i(e) ? e.join('.') : e;
  }
  var f = {
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
      let n = [], o = !1;
      const l = (e, t, d) => {
        if (c(e)) if (t[d]) {
          const h = e[t[d]];
          if (!c(h)) return;
          if (d === t.length - 1 && (r(h) || a(h) || s(h))) n.push(function(e) {
            return null == e ? '' : function(e) {
              if ('string' == typeof e) return e;
              let t = e + '';
              return '0' == t && 1 / e == -1 / 0 ? '-0' : t;
            }(e);
          }(h)); else if (i(h)) {
            o = !0;
            for (let e = 0, n = h.length; e < n; e += 1) l(h[e], t, d + 1);
          } else t.length && l(h, t, d + 1);
        } else n.push(e);
      };
      return l(e, r(t) ? t.split('.') : t, 0), o ? n : n[0];
    },
    ignoreLocation: !1,
    ignoreFieldNorm: !1
  };
  const v = /[^ ]+/g;
  class y {
    constructor({getFn: e = f.getFn} = {}) {
      this.norm = function(e = 3) {
        const t = new Map, n = Math.pow(10, e);
        return {
          get(e) {
            const i = e.match(v).length;
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
      !this.isCreated && this.docs.length && (this.isCreated = !0, r(this.docs[0]) ? this.docs.forEach(((e, t) => {
        this._addString(e, t);
      })) : this.docs.forEach(((e, t) => {
        this._addObject(e, t);
      })), this.norm.clear());
    }
    add(e) {
      const t = this.size();
      r(e) ? this._addString(e, t) : this._addObject(e, t);
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
      if (!c(e) || l(e)) return;
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
      this.keys.forEach(((t, a) => {
        let s = this.getFn(e, t.path);
        if (c(s)) if (i(s)) {
          let e = [];
          const t = [ {
            nestedArrIndex: -1,
            value: s
          } ];
          for (;t.length; ) {
            const {nestedArrIndex: n, value: a} = t.pop();
            if (c(a)) if (r(a) && !l(a)) {
              let t = {
                v: a,
                i: n,
                n: this.norm.get(a)
              };
              e.push(t);
            } else i(a) && a.forEach(((e, n) => {
              t.push({
                nestedArrIndex: n,
                value: e
              });
            }));
          }
          n.$[a] = e;
        } else if (!l(s)) {
          let e = {
            v: s,
            n: this.norm.get(s)
          };
          n.$[a] = e;
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
  function x(e, t, {getFn: n = f.getFn} = {}) {
    const i = new y({
      getFn: n
    });
    return i.setKeys(e.map(g)), i.setSources(t), i.create(), i;
  }
  function w(e, {errors: t = 0, currentLocation: n = 0, expectedLocation: i = 0, distance: r = f.distance, ignoreLocation: a = f.ignoreLocation} = {}) {
    const s = t / e.length;
    if (a) return s;
    const o = Math.abs(i - n);
    return r ? s + o / r : o ? 1 : s;
  }
  function b(e, t, n, {location: i = f.location, distance: r = f.distance, threshold: a = f.threshold, findAllMatches: s = f.findAllMatches, minMatchCharLength: o = f.minMatchCharLength, includeMatches: c = f.includeMatches, ignoreLocation: l = f.ignoreLocation} = {}) {
    if (t.length > 32) throw new Error('Pattern length exceeds max of 32.');
    const d = t.length, h = e.length, u = Math.max(0, Math.min(i, h));
    let g = a, m = u;
    const p = o > 1 || c, v = p ? Array(h) : [];
    let y;
    for (;(y = e.indexOf(t, m)) > -1; ) {
      let e = w(t, {
        currentLocation: y,
        expectedLocation: u,
        distance: r,
        ignoreLocation: l
      });
      if (g = Math.min(e, g), m = y + d, p) {
        let e = 0;
        for (;e < d; ) v[y + e] = 1, e += 1;
      }
    }
    m = -1;
    let x = [], b = 1, S = d + h;
    const k = 1 << d - 1;
    for (let i = 0; i < d; i += 1) {
      let a = 0, o = S;
      for (;a < o; ) w(t, {
        errors: i,
        currentLocation: u + o,
        expectedLocation: u,
        distance: r,
        ignoreLocation: l
      }) <= g ? a = o : S = o, o = Math.floor((S - a) / 2 + a);
      S = o;
      let c = Math.max(1, u - o + 1), f = s ? h : Math.min(u + o, h) + d, y = Array(f + 2);
      y[f + 1] = (1 << i) - 1;
      for (let a = f; a >= c; a -= 1) {
        let s = a - 1, o = n[e.charAt(s)];
        if (p && (v[s] = +!!o), y[a] = (y[a + 1] << 1 | 1) & o, i && (y[a] |= (x[a + 1] | x[a]) << 1 | 1 | x[a + 1]), 
        y[a] & k && (b = w(t, {
          errors: i,
          currentLocation: s,
          expectedLocation: u,
          distance: r,
          ignoreLocation: l
        }), b <= g)) {
          if (g = b, m = s, m <= u) break;
          c = Math.max(1, 2 * u - m);
        }
      }
      if (w(t, {
        errors: i + 1,
        currentLocation: u,
        expectedLocation: u,
        distance: r,
        ignoreLocation: l
      }) > g) break;
      x = y;
    }
    const C = {
      isMatch: m >= 0,
      score: Math.max(.001, b)
    };
    if (p) {
      const e = function(e = [], t = f.minMatchCharLength) {
        let n = [], i = -1, r = -1, a = 0;
        for (let s = e.length; a < s; a += 1) {
          let s = e[a];
          s && -1 === i ? i = a : s || -1 === i || (r = a - 1, r - i + 1 >= t && n.push([ i, r ]), 
          i = -1);
        }
        return e[a - 1] && a - i >= t && n.push([ i, a - 1 ]), n;
      }(v, o);
      e.length ? c && (C.indices = e) : C.isMatch = !1;
    }
    return C;
  }
  function S(e) {
    let t = {};
    for (let n = 0, i = e.length; n < i; n += 1) {
      const r = e.charAt(n);
      t[r] = (t[r] || 0) | 1 << i - n - 1;
    }
    return t;
  }
  class k {
    constructor(e, {location: t = f.location, threshold: n = f.threshold, distance: i = f.distance, includeMatches: r = f.includeMatches, findAllMatches: a = f.findAllMatches, minMatchCharLength: s = f.minMatchCharLength, isCaseSensitive: o = f.isCaseSensitive, ignoreLocation: c = f.ignoreLocation} = {}) {
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
          alphabet: S(e),
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
      this.chunks.forEach((({pattern: t, alphabet: u, startIndex: g}) => {
        const {isMatch: m, score: p, indices: f} = b(e, t, u, {
          location: i + g,
          distance: r,
          threshold: a,
          findAllMatches: s,
          minMatchCharLength: o,
          includeMatches: n,
          ignoreLocation: c
        });
        m && (h = !0), d += p, m && f && (l = [ ...l, ...f ]);
      }));
      let u = {
        isMatch: h,
        score: h ? d / this.chunks.length : 1
      };
      return h && n && (u.indices = l), u;
    }
  }
  class C {
    constructor(e) {
      this.pattern = e;
    }
    static isMultiMatch(e) {
      return M(e, this.multiRegex);
    }
    static isSingleMatch(e) {
      return M(e, this.singleRegex);
    }
    search() {}
  }
  function M(e, t) {
    const n = e.match(t);
    return n ? n[1] : null;
  }
  class B extends C {
    constructor(e, {location: t = f.location, threshold: n = f.threshold, distance: i = f.distance, includeMatches: r = f.includeMatches, findAllMatches: a = f.findAllMatches, minMatchCharLength: s = f.minMatchCharLength, isCaseSensitive: o = f.isCaseSensitive, ignoreLocation: c = f.ignoreLocation} = {}) {
      super(e), this._bitapSearch = new k(e, {
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
  class L extends C {
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
  const I = [ class extends C {
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
  }, L, class extends C {
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
  }, class extends C {
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
  }, class extends C {
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
  }, class extends C {
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
  }, class extends C {
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
  }, B ], E = I.length, A = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/, F = new Set([ B.type, L.type ]), _ = [];
  function $(e, t) {
    for (let n = 0, i = _.length; n < i; n += 1) {
      let i = _[n];
      if (i.condition(e, t)) return new i(e, t);
    }
    return new k(e, t);
  }
  const z = '$and', T = '$path', P = e => !(!e[z] && !e.$or), D = e => ({
    [z]: Object.keys(e).map((t => ({
      [t]: e[t]
    })))
  });
  function N(e, t, {auto: n = !0} = {}) {
    const a = e => {
      let s = Object.keys(e);
      const c = (e => !!e[T])(e);
      if (!c && s.length > 1 && !P(e)) return a(D(e));
      if ((e => !i(e) && o(e) && !P(e))(e)) {
        const i = c ? e[T] : s[0], a = c ? e.$val : e[i];
        if (!r(a)) throw new Error((e => 'Invalid value for key ' + e)(i));
        const o = {
          keyId: p(i),
          pattern: a
        };
        return n && (o.searcher = $(a, t)), o;
      }
      let l = {
        children: [],
        operator: s[0]
      };
      return s.forEach((t => {
        const n = e[t];
        i(n) && n.forEach((e => {
          l.children.push(a(e));
        }));
      })), l;
    };
    return P(e) || (e = D(e)), a(e);
  }
  function R(e, t) {
    const n = e.matches;
    t.matches = [], c(n) && n.forEach((e => {
      if (!c(e.indices) || !e.indices.length) return;
      const {indices: n, value: i} = e;
      let r = {
        indices: n,
        value: i
      };
      e.key && (r.key = e.key.src), e.idx > -1 && (r.refIndex = e.idx), t.matches.push(r);
    }));
  }
  function O(e, t) {
    t.score = e.score;
  }
  class j {
    constructor(e, t = {}, n) {
      this.options = {
        ...f,
        ...t
      }, this.options.useExtendedSearch, this._keyStore = new u(this.options.keys), this.setCollection(e, n);
    }
    setCollection(e, t) {
      if (this._docs = e, t && !(t instanceof y)) throw new Error('Incorrect \'index\' type');
      this._myIndex = t || x(this.options.keys, this._docs, {
        getFn: this.options.getFn
      });
    }
    add(e) {
      c(e) && (this._docs.push(e), this._myIndex.add(e));
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
      const {includeMatches: n, includeScore: i, shouldSort: s, sortFn: o, ignoreFieldNorm: c} = this.options;
      let l = r(e) ? r(this._docs[0]) ? this._searchStringList(e) : this._searchObjectList(e) : this._searchLogical(e);
      return function(e, {ignoreFieldNorm: t = f.ignoreFieldNorm}) {
        e.forEach((e => {
          let n = 1;
          e.matches.forEach((({key: e, norm: i, score: r}) => {
            const a = e ? e.weight : null;
            n *= Math.pow(0 === r && a ? Number.EPSILON : r, (a || 1) * (t ? 1 : i));
          })), e.score = n;
        }));
      }(l, {
        ignoreFieldNorm: c
      }), s && l.sort(o), a(t) && t > -1 && (l = l.slice(0, t)), function(e, t, {includeMatches: n = f.includeMatches, includeScore: i = f.includeScore} = {}) {
        const r = [];
        return n && r.push(R), i && r.push(O), e.map((e => {
          const {idx: n} = e, i = {
            item: t[n],
            refIndex: n
          };
          return r.length && r.forEach((t => {
            t(e, i);
          })), i;
        }));
      }(l, this._docs, {
        includeMatches: n,
        includeScore: i
      });
    }
    _searchStringList(e) {
      const t = $(e, this.options), {records: n} = this._myIndex, i = [];
      return n.forEach((({v: e, i: n, n: r}) => {
        if (!c(e)) return;
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
      const t = N(e, this.options), n = (e, t, i) => {
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
         case z:
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
        if (c(e)) {
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
      const t = $(e, this.options), {keys: n, records: i} = this._myIndex, r = [];
      return i.forEach((({$: e, i: i}) => {
        if (!c(e)) return;
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
      if (!c(t)) return [];
      let r = [];
      if (i(t)) t.forEach((({v: t, i: i, n: a}) => {
        if (!c(t)) return;
        const {isMatch: s, score: o, indices: l} = n.searchIn(t);
        s && r.push({
          score: o,
          key: e,
          value: t,
          idx: i,
          norm: a,
          indices: l
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
  j.version = '6.4.6', j.createIndex = x, j.parseIndex = function(e, {getFn: t = f.getFn} = {}) {
    const {keys: n, records: i} = e, r = new y({
      getFn: t
    });
    return r.setKeys(n), r.setIndexRecords(i), r;
  }, j.config = f, function(...e) {
    _.push(...e);
  }(class {
    constructor(e, {isCaseSensitive: t = f.isCaseSensitive, includeMatches: n = f.includeMatches, minMatchCharLength: i = f.minMatchCharLength, ignoreLocation: r = f.ignoreLocation, findAllMatches: a = f.findAllMatches, location: s = f.location, threshold: o = f.threshold, distance: c = f.distance} = {}) {
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
          let n = e.trim().split(A).filter((e => e && !!e.trim())), i = [];
          for (let e = 0, r = n.length; e < r; e += 1) {
            const r = n[e];
            let a = !1, s = -1;
            for (;!a && ++s < E; ) {
              const e = I[s];
              let n = e.isMultiMatch(r);
              n && (i.push(new e(n, t)), a = !0);
            }
            if (!a) for (s = -1; ++s < E; ) {
              const e = I[s];
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
            F.has(e) ? a = [ ...a, ...l ] : a.push(l);
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
  const H = async e => JSON.parse((await e.text()).trim().substr(9));
  document.head.innerHTML = `<title>${document.title}</title>`, document.body.innerHTML = '', 
  (async () => {
    const e = JSON.parse(document.documentElement.getAttribute('data-he-context'));
    var t;
    n.uid = localStorage.getItem('Session.UserId'), document.head.innerHTML = function(e, t, n, i) {
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
      c(t(e.title)), c('</title>\n<meta name="description" content="D2l Overhaul">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\x3c!-- FONT --\x3e\n<style>/* fallback */\r\n@font-face {\r\n  font-family: \'Material Icons\';\r\n  font-style: normal;\r\n  font-weight: 400;\r\n  src: url(https://fonts.gstatic.com/s/materialicons/v99/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format(\'woff2\');\r\n}\r\n\r\n.material-icons {\r\n  font-family: \'Material Icons\';\r\n  font-weight: normal;\r\n  font-style: normal;\r\n  font-size: 24px;  /* Preferred icon size */\r\n  display: inline-block;\r\n  line-height: 1;\r\n  text-transform: none;\r\n  letter-spacing: normal;\r\n  word-wrap: normal;\r\n  white-space: nowrap;\r\n  direction: ltr;\r\n  user-select: none;\r\n\r\n  /* Support for all WebKit browsers. */\r\n  -webkit-font-smoothing: antialiased;\r\n  /* Support for Safari and Chrome. */\r\n  text-rendering: optimizeLegibility;\r\n\r\n  /* Support for Firefox. */\r\n  -moz-osx-font-smoothing: grayscale;\r\n\r\n  /* Support for IE. */\r\n  font-feature-settings: \'liga\';\r\n}\r\n/* Rules for sizing the icon. */\r\n.material-icons.md-18 { font-size: 18px; }\r\n.material-icons.md-24 { font-size: 24px; }\r\n.material-icons.md-36 { font-size: 36px; }\r\n.material-icons.md-48 { font-size: 48px; }\r\n\r\n/* Rules for using icons as black on a light background. */\r\n.material-icons.md-dark { color: rgba(0, 0, 0, 0.54); }\r\n.material-icons.md-dark.md-inactive { color: rgba(0, 0, 0, 0.26); }\r\n\r\n/* Rules for using icons as white on a dark background. */\r\n.material-icons.md-light { color: rgba(255, 255, 255, 1); }\r\n.material-icons.md-light.md-inactive { color: rgba(255, 255, 255, 0.3); }\r\n\r\n/* Rules for using icons as orange on a dark background. */\r\n.material-icons.orange600 { color: #FB8C00; }</style>\n<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" type="text/css">\n<link href="https://fonts.googleapis.com/css?family=Google+Sans:300,400,500" rel="stylesheet" type="text/css">\n\x3c!-- CSS --\x3e\n<style>:root {\n  --Background: #2C2C2C;\n  --Foreground: #3C3C3C;\n  --Border: #4A4A4A;\n  --Text-Main: #fff;\n}</style>\n<style>/* General Page Stuff */\nhtml, body {\n  height: 100%;\n  width: 100%;\n  font-family: \'Roboto\',Helvetica,Arial,sans-serif;\n  color: var(--Text-Main); }\n\nbody {\n  margin: 0;\n  background-color: var(--Background);\n  position: relative; }\n\n* {\n  box-sizing: border-box; }\n\npicture, picture img {\n  display: block;\n  height: 100%;\n  width: 100%; }\n\n*::-webkit-scrollbar {\n  width: 16px; }\n\n*::-webkit-scrollbar-thumb {\n  background: #dadce0;\n  background-clip: padding-box;\n  border: 4px solid transparent;\n  border-radius: 8px;\n  box-shadow: none;\n  min-height: 50px; }\n\n*::-webkit-scrollbar-track {\n  background: none;\n  border: none; }\n\n/* Text */\nh1 {\n  color: var(--Text-Main);\n  font-size: 1.375rem;\n  font-weight: 500;\n  line-height: 1.75rem;\n  font-family: \'Google Sans\',Roboto,Arial,sans-serif; }\n\nh2 {\n  color: var(--Text-Main);\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.25rem;\n  margin: 0; }\n\n/* Aside */\n.SideBar {\n  display: flex;\n  flex-direction: column;\n  height: 100vh;\n  width: 19rem;\n  padding: .5rem 0;\n  z-index: 990;\n  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);\n  background-color: var(--Foreground);\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  overflow-y: scroll;\n  max-width: 0;\n  transition: max-width .5s; }\n  .SideBar.Active {\n    max-width: 100%; }\n\n.SideBarSeperator {\n  border-top: 0.0625rem solid var(--Border);\n  margin: .5rem 0; }\n\n.SideBarSection {\n  flex-grow: 1;\n  min-height: max-content; }\n\n.SideBarHeader {\n  padding: 0 1rem;\n  letter-spacing: .01785714em;\n  font-family: \'Google Sans\',Roboto,Arial,sans-serif;\n  font-size: 0.875rem;\n  font-weight: 500;\n  line-height: 1.25rem; }\n\n.SideBarItem {\n  display: flex;\n  align-content: center;\n  border-radius: 0 2rem 2rem 0;\n  height: 3.5rem;\n  padding-left: 1.5rem;\n  margin-right: 1rem;\n  cursor: pointer;\n  text-decoration: none;\n  color: #fff; }\n  .SideBarItem .SideBarItemText {\n    margin-left: 1rem;\n    font-family: \'Google Sans\',Roboto,Arial,sans-serif;\n    letter-spacing: .01785714em;\n    font-size: 0.875rem;\n    font-weight: 500;\n    overflow: hidden;\n    white-space: nowrap;\n    margin-right: 4rem;\n    text-overflow: ellipsis; }\n  .SideBarItem span {\n    line-height: 3.5rem; }\n  .SideBarItem:hover {\n    background-color: #343434; }\n\n/* Content */\n#Content {\n  min-height: 100%;\n  height: min-content;\n  width: 100%;\n  display: flex;\n  flex-direction: column; }\n\n#Content > * {\n  padding: 1rem; }\n\nmain {\n  height: 100%;\n  width: 100%; }\n\n/* Home Page */\n.Home > main {\n  max-width: 70rem;\n  margin: auto;\n  display: grid; }\n\n/* Loader Page */\nmain.Loader {\n  display: flex;\n  align-content: center;\n  flex-direction: column; }\n\n.lds-grid {\n  margin: auto;\n  display: grid;\n  grid-template-columns: repeat(3, 16px);\n  grid-template-rows: repeat(3, 16px);\n  grid-gap: 8px; }\n\n.lds-grid div {\n  border-radius: 50%;\n  background: #fff;\n  animation: lds-grid 1.2s linear infinite; }\n\n.lds-grid div:nth-child(1) {\n  animation-delay: 0s; }\n\n.lds-grid div:nth-child(2), .lds-grid div:nth-child(4) {\n  animation-delay: -0.4s; }\n\n.lds-grid div:nth-child(3), .lds-grid div:nth-child(5), .lds-grid div:nth-child(7) {\n  animation-delay: -0.8s; }\n\n.lds-grid div:nth-child(6), .lds-grid div:nth-child(8) {\n  animation-delay: -1.2s; }\n\n.lds-grid div:nth-child(9) {\n  animation-delay: -1.6s; }\n\n@keyframes lds-grid {\n  0%, 100% {\n    opacity: 1; }\n  50% {\n    opacity: 0.5; } }\n\n/* General */\n.Hidden, .Filtered {\n  display: none !important; }\n\n/* Hovers */\n.Class, .StreamCard {\n  cursor: pointer; }\n\n.Class:hover, .StreamCard:hover {\n  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);\n  border-radius: .75rem; }\n\n/* Components */\n.NavBar {\n  padding: .75rem 1rem !important;\n  height: 4rem;\n  width: 100%;\n  background: var(--Foreground);\n  display: grid;\n  grid-template-columns: 2.5rem auto max-content;\n  position: relative; }\n  .NavBar .AsideButton {\n    display: flex;\n    align-content: center;\n    border-radius: 50%; }\n    .NavBar .AsideButton:hover {\n      background: var(--Background); }\n    .NavBar .AsideButton svg {\n      margin: auto;\n      width: 2rem;\n      height: 2rem; }\n  .NavBar input {\n    height: 2.5rem;\n    width: 50%;\n    margin: auto;\n    display: block;\n    background-color: #212121;\n    outline: none;\n    border: none;\n    border-radius: .5rem;\n    padding: .5rem;\n    color: #fff; }\n  .NavBar .Account {\n    display: grid;\n    grid-template-columns: repeat(4, 2.5rem);\n    grid-gap: .25rem; }\n    .NavBar .Account span {\n      width: 2.5rem;\n      height: 2.5rem;\n      text-align: center;\n      line-height: 2.5rem; }\n      .NavBar .Account span.Active {\n        color: #FB8C00; }\n    .NavBar .Account .Profile picture {\n      padding: .25rem; }\n    .NavBar .Account span, .NavBar .Account div {\n      cursor: pointer;\n      border-radius: .5rem; }\n    .NavBar .Account span:hover, .NavBar .Account div:hover {\n      background-color: #2F3033; }\n\n.ClassContainer {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: repeat(auto-fit, min-content);\n  grid-gap: 2rem; }\n\n.Class {\n  height: 15rem;\n  width: 100%;\n  overflow: hidden;\n  background-color: var(--Foreground);\n  border: 0.0625rem solid var(--Border);\n  border-radius: .5rem;\n  position: relative;\n  z-index: 0; }\n\n.Class > div {\n  height: 100%;\n  width: 100%;\n  background: rgba(0, 0, 0, 0.25);\n  padding: 1rem;\n  display: grid;\n  grid-template-rows: auto 3rem; }\n\n.Class div div {\n  display: flex; }\n\n.Class h2 {\n  height: 100%;\n  line-height: 3rem;\n  padding-left: 1rem; }\n\n.Class > picture {\n  z-index: -1;\n  position: absolute; }\n\n.Class[disabled] > picture {\n  filter: grayscale(100%); }\n\n.Profile {\n  height: 100%;\n  aspect-ratio: 1 / 1;\n  border-radius: 50%; }\n\n/* Stream */\n.Stream > main {\n  flex-grow: 1;\n  min-height: max-content;\n  width: calc(100% - 2*1.5rem);\n  max-width: 62.5rem;\n  margin: 0 auto;\n  padding: 0 !important; }\n\n.ClassPicture {\n  margin: 1.5rem 0;\n  overflow: hidden;\n  border-radius: 1rem;\n  position: relative; }\n\n.ClassPictureContent {\n  display: flex;\n  flex-direction: column;\n  padding: 1.5rem;\n  margin: 0;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%; }\n\n.ClassPictureContent h1, .ClassPictureContent h2 {\n  margin: 0; }\n\n.ClassPictureContent h4 {\n  margin-top: .4rem;\n  font-weight: 500;\n  font-style: normal; }\n\n.ChipFilter {\n  display: inline-flex;\n  height: max-content;\n  width: max-content;\n  padding: .25rem .5rem;\n  border: 0.0625rem solid var(--Border);\n  border-radius: 2rem;\n  font-size: .75rem;\n  cursor: pointer;\n  user-select: none;\n  background-color: var(--Foreground); }\n  .ChipFilter .chipIcon {\n    border-radius: 50%;\n    padding: .25rem;\n    font-size: .75rem;\n    margin-right: .25rem;\n    background-color: #3367D6; }\n  .ChipFilter p {\n    margin: auto;\n    display: inline-block; }\n  .ChipFilter:hover {\n    background-color: #343434; }\n  .ChipFilter.Active {\n    background-color: #181818; }\n\n/* Stream Cards */\n.StreamCard {\n  width: 100%;\n  height: 4rem;\n  background-color: var(--Foreground);\n  border: 0.0625rem solid var(--Border);\n  border-radius: .5rem;\n  display: grid;\n  grid-template-columns: max-content 1fr;\n  grid-template-rows: 3rem max-content;\n  grid-template-areas: \'Icon Title\'\r \'Content Content\';\n  padding: .5rem;\n  grid-gap: .5rem;\n  margin: 1rem 0; }\n\n.StreamCardTitle {\n  grid-area: Title; }\n\n.StreamCard h1, .StreamCard h3 {\n  margin: 0; }\n\n.StreamCard h3 {\n  font-size: .75rem; }\n\n.StreamCardIcon {\n  grid-area: Icon;\n  background: #3367d6;\n  width: 3rem;\n  height: 3rem;\n  border-radius: 2rem;\n  display: flex;\n  align-content: center; }\n\n.StreamCardIcon > svg {\n  margin: auto; }\n\n.StreamCardBody {\n  grid-area: Content;\n  overflow: hidden;\n  width: 100%;\n  height: 0; }\n\n.StreamCard.Active, .StreamCard.Active > .StreamCardBody {\n  height: max-content; }\n\n.DropDown {\n  min-height: 30rem;\n  width: 20rem;\n  border-radius: .5rem;\n  border: 0.0625rem solid var(--Border);\n  background-color: var(--Foreground);\n  position: absolute;\n  top: 100%;\n  right: 0;\n  z-index: 2;\n  padding: 1rem;\n  margin: -.25rem .5rem;\n  overflow-y: scroll; }\n</style>'), 
      o;
    }({
      title: document.title
    }), document.body.innerHTML = function(e, t, n, i) {
      var r = '';
      function a(e) {
        null != e && (r += e);
      }
      return a('<aside class="SideBar" id="SideBar"></aside>\n<section id="Content">\n  \x3c!-- NavBar --\x3e\n  '), 
      a(e.navBar), a('\n  \x3c!-- Main Body --\x3e\n  <main id="main" class="Loader">\n    <div class="lds-grid">\n      <div></div>\n      <div></div>\n      <div></div>\n      <div></div>\n      <div></div>\n      <div></div>\n      <div></div>\n      <div></div>\n      <div></div>\n    </div>\n  </main>\n</section>'), 
      r;
    }({
      content: null,
      navBar: (t = '', t += '<nav class="NavBar" id="NavBar">\r\n  <div class="AsideButton" id="AsideButtton">\r\n    <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" class=" NMm5M"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>\r\n  </div>\r\n  <div>\r\n    <input id="Search" placeholder="Search" type="text" />\r\n  </div>\r\n  <div class="Account">\r\n    <span class="material-icons" id="MailButton">\r\n      mail\r\n    </span>\r\n    <span class="material-icons" id="MessageButton">\r\n      message\r\n    </span>      \r\n    <span class="material-icons" id="NotificationButton">\r\n      notifications\r\n    </span>\r\n    <div class="Profile" id="AccountButtton">\r\n      <picture>\r\n        <img src="https://durham.elearningontario.ca/d2l/api/lp/1.32/profile/myProfile/image" />\r\n      </picture>\r\n    </div>\r\n  </div>\r\n</nav>', 
      t)
    }), ((e, t) => {
      const n = document.getElementById('main'), i = document.getElementById('SideBar'), r = document.getElementById('AsideButtton'), a = document.getElementById('Search'), s = document.getElementById('MailButton'), o = document.getElementById('MessageButton'), c = document.getElementById('NotificationButton');
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
        }))), i = (r = t, s = a.value, new j(r, {
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
        const e = await fetch('/d2l/activityFeed/checkForNewAlerts?isXhr=true&requestId=3&X-D2L-Session=no-keep-alive'), t = await H(e);
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
      const d = async (n, i) => {
        n.stopPropagation();
        const r = document.getElementById('DropDown');
        var a;
        switch (r && r.remove(), e.insertAdjacentHTML('beforeend', (a = '', a += '<div class="DropDown" id="DropDown">\r\n\r\n</div>')), 
        i) {
         case 'MailButton':
          {
            const e = await fetch(`https://durham.elearningontario.ca/d2l/api/lp/${t.apiVersion.lp}/alerts/user/${t.uid}`, {
              headers: {
                authorization: `Bearer ${await t.getToken()}`
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
            const e = await fetch(`/d2l/MiniBar/${t.cid}/ActivityFeed/GetAlertsDaylight?Category=1&_d2l_prc$headingLevel=2&_d2l_prc$scope=&_d2l_prc$hasActiveForm=false&isXhr=true&requestId=3`, {
              method: 'GET'
            }), n = await H(e);
            console.log(n);
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
    })(document.getElementById('NavBar'), n), (async (e, t) => {
      const n = (new Date).valueOf(), i = await fetch(`https://bc59e98c-eabc-4d42-98e1-edfe93518966.enrollments.api.brightspace.com/users/${t.uid}?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false`, {
        headers: {
          authorization: `Bearer ${await t.getToken()}`
        }
      }).then((e => e.json())), r = await Promise.all(i.entities.map((async ({href: e}) => {
        const i = await fetch(e, {
          headers: {
            authorization: `Bearer ${await t.getToken()}`
          },
          method: 'GET'
        }), r = await i.json(), a = await fetch(r.links[1].href, {
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
        return c('<a class="SideBarItem" id="SideBarClassesBtn"><span class="material-icons">home</span><span class="SideBarItemText">Classes</span></a>\r\n<a class="SideBarItem" id="SideBarCalenderBtn"><span class="material-icons">calendar_today</span><span class="SideBarItemText">Calender</span></a>\r\n<div class="SideBarSeperator"></div>\r\n<div class="SideBarSection" id="SideBarClasses">\r\n  <div class="SideBarHeader">Enrolled</div>\r\n  '), 
        e.classes.forEach((e => {
          c('\r\n    '), e.disabled || (c('\r\n      <a class="SideBarItem" id="SideBarCalenderBtn" href="'), 
          c(t(e.href)), c('"><span class="material-icons">class</span><span class="SideBarItemText">'), 
          c(t(e.name)), c('</span></a>\r\n    ')), c('\r\n  ');
        })), c('\r\n</div>\r\n<div class="SideBarSeperator"></div>\r\n<a class="SideBarItem" id="SideBarSettingsBtn"><span class="material-icons">settings</span><span class="SideBarItemText">Settings</span></a>'), 
        o;
      }({
        classes: r
      }), document.getElementById('SideBarClassesBtn').addEventListener('click', (() => {
        t.setPage('HOME');
      }));
    })(document.getElementById('SideBar'), n), await n.start(e);
  })();
}();
