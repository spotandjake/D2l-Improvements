(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{569:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return H}});var r,a=n(646),c=n(9623),s=n(3992),i=n(7729),o=n(9207),u=n(6601),l=n(9931),h=n(7460),p=n(2847),d=n.n(p);function f(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function v(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?f(Object(n),!0).forEach((function(t){(0,h.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}!function(e){e.ep="ep",e.le="le",e.lp="lp",e.lr="lr"}(r||(r={}));var x=function(){function e(){(0,u.Z)(this,e),(0,h.Z)(this,"version",{ep:"1.0.0",le:"1.0.0",lp:"1.0.0",lr:"1.0.0"}),(0,h.Z)(this,"token",""),(0,h.Z)(this,"uid",""),this.uid=localStorage.getItem("Session.UserId"),this._start()}return(0,l.Z)(e,[{key:"_start",value:function(){var e=(0,o.Z)(d().mark((function e(){var t=this;return d().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.versions();case 2:e.sent.forEach((function(e){e.ProductCode!=r.ep&&e.ProductCode!=r.le&&e.ProductCode!=r.lp&&e.ProductCode!=r.lr||(t.version[e.ProductCode]=e.LatestVersion)})),this._getToken(!0),setInterval((function(){return window.requestIdleCallback((function(){return t._getToken(!0)}),{timeout:1e3})}),3e5);case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"_fetch",value:function(){var e=(0,o.Z)(d().mark((function e(t){var n,r,a=arguments;return d().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:{},t.startsWith("/")&&(t="https://durham.elearningontario.ca/d2l".concat(t)),n.headers=v({"content-type":"application/x-www-form-urlencoded, application/json"},n.headers),e.next=5,fetch(t,n);case 5:return r=e.sent,e.abrupt("return",r.json());case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"_getToken",value:function(){var e=(0,o.Z)(d().mark((function e(){var t,n=arguments;return d().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n.length>0&&void 0!==n[0]&&n[0])&&""!=this.token){e.next=6;break}return e.next=4,this._fetch("/lp/auth/oauth2/token",{headers:{"x-csrf-token":localStorage.getItem("XSRF.Token")},body:"scope=*:*:*",method:"POST"});case 4:t=e.sent,this.token=t.access_token;case 6:return e.abrupt("return",this.token);case 7:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"versions",value:function(){var e=(0,o.Z)(d().mark((function e(){return d().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this._fetch("/api/versions/");case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()}]),e}(),m=n(2221),_=n.n(m),g=n(1232),j=function(){return(0,g.jsx)("section",{className:_().container,children:(0,g.jsx)("div",{className:_().loader,children:new Array(9).map((function(e,t){return(0,g.jsx)("div",{},t)}))})})},b=n(298),w=n.n(b),k=n(6620),y=n.n(k),S=n(6911),N=n(2379),Z=n(4882),B=n(8324),I=n(3782),O=n(6615),C=n(4607),P=function(e){e.brightSpace;return(0,g.jsxs)("section",{className:y().container,children:[(0,g.jsx)("div",{className:"".concat(y().side," ").concat(y().leftSide),children:(0,g.jsx)(S.Z,{"aria-label":"aside",className:y().IconButton,children:(0,g.jsx)(N.Z,{className:y().Icon,component:Z.Z,viewBox:"0 0 24 24"})})}),(0,g.jsx)("div",{className:y().center,children:(0,g.jsx)("input",{className:y().SearchBar,placeholder:"Search",type:"text"})}),(0,g.jsxs)("div",{className:"".concat(y().side," ").concat(y().rightSide),children:[(0,g.jsx)(S.Z,{"aria-label":"aside",className:y().IconButton,children:(0,g.jsx)(N.Z,{className:y().Icon,component:B.Z,viewBox:"0 0 24 24"})}),(0,g.jsx)(S.Z,{"aria-label":"aside",className:y().IconButton,children:(0,g.jsx)(N.Z,{className:y().Icon,component:I.Z,viewBox:"0 0 24 24"})}),(0,g.jsx)(S.Z,{"aria-label":"aside",className:y().IconButton,children:(0,g.jsx)(N.Z,{className:y().Icon,component:O.Z,viewBox:"0 0 24 24"})}),(0,g.jsx)(S.Z,{"aria-label":"aside",className:y().IconButton,children:(0,g.jsx)(N.Z,{className:y().Icon,component:C.Z,viewBox:"0 0 24 24"})})]})]})},R=n(3568),E=n.n(R),T=function(e){var t=e.Title,n=e.Href,r=e.Active,a=e.children,c=e.Route;return(0,g.jsx)("div",{onClick:function(){var e,a;e=t,a=n,r&&(c?(history.pushState({Title:e,Url:a},e,a),c()):window.location.href=a)},children:a})},D=function(e){var t=e.Name,n=e.Active,r=e.Href,a=e.Picture,c=e.StartDate,s=e.Route;return(0,g.jsx)("section",{className:[E().container,n?E().disabled:" "].join(" "),children:(0,g.jsxs)(T,{Title:t,Href:r,Active:!n,Route:s,children:[(0,g.jsx)("picture",{children:(0,g.jsx)("img",{src:a})}),(0,g.jsxs)("div",{className:E().content,children:[(0,g.jsx)("h4",{children:t}),n?(0,g.jsx)("h6",{children:"Closed"}):(0,g.jsxs)("h6",{children:["Closes | ",new Date(c).toDateString()]})]})]})})},z=function(e){var t=e.brightSpace,n=e.Route,r=(0,s.useState)((0,g.jsx)(g.Fragment,{})),a=r[0],c=r[1];return(0,s.useEffect)((function(){(0,o.Z)(d().mark((function e(){var r,a,s;return d().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=(new Date).valueOf(),e.t0=t,e.t1="https://bc59e98c-eabc-4d42-98e1-edfe93518966.enrollments.api.brightspace.com/users/".concat(t.uid,"?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false"),e.t2="Bearer ",e.next=6,t._getToken();case 6:return e.t3=e.sent,e.t4=e.t2.concat.call(e.t2,e.t3),e.t5={authorization:e.t4},e.t6={headers:e.t5},e.next=12,e.t0._fetch.call(e.t0,e.t1,e.t6);case 12:return a=e.sent,e.next=15,Promise.all(a.entities.map(function(){var e=(0,o.Z)(d().mark((function e(a){var c,s,i,u,l,h,p,f;return d().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c=a.href,e.t0=t,e.t1=c,e.t2="Bearer ",e.next=6,t._getToken();case 6:return e.t3=e.sent,e.t4=e.t2.concat.call(e.t2,e.t3),e.t5={authorization:e.t4},e.t6={headers:e.t5},e.next=12,e.t0._fetch.call(e.t0,e.t1,e.t6);case 12:return s=e.sent,e.t7=t,e.t8=s.links[1].href,e.t9="Bearer ",e.next=18,t._getToken();case 18:return e.t10=e.sent,e.t11=e.t9.concat.call(e.t9,e.t10),e.t12={authorization:e.t11},e.t13={headers:e.t12},e.next=24,e.t7._fetch.call(e.t7,e.t8,e.t13);case 24:return i=e.sent,e.next=27,window.fetch(i.entities[2].href).then((function(e){return e.json()})).catch((0,o.Z)(d().mark((function e(){return d().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=t,e.t1=i.entities[2].href,e.t2="Bearer ",e.next=5,t._getToken();case 5:return e.t3=e.sent,e.t4=e.t2.concat.call(e.t2,e.t3),e.t5={authorization:e.t4},e.t6={headers:e.t5},e.next=11,e.t0._fetch.call(e.t0,e.t1,e.t6).catch((function(){return"https://blog.fluidui.com/content/images/2019/01/imageedit_1_9273372713.png"}));case 11:return e.abrupt("return",e.sent);case 12:case"end":return e.stop()}}),e)}))));case 27:return u=e.sent,l=i.properties,h=l.endDate,p=l.name,f=l.startDate,e.abrupt("return",(0,g.jsx)(D,{Name:p,Active:new Date(h).valueOf()<r,Href:i.links[0].href.replace("https://bc59e98c-eabc-4d42-98e1-edfe93518966.folio.api.brightspace.com/organizations/","https://durham.elearningontario.ca/d2l/home/"),Picture:u.links?u.links[2].href:u,StartDate:f,Route:function(){return n(t)}}));case 30:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 15:s=e.sent,c((0,g.jsx)(g.Fragment,{children:s}));case 17:case"end":return e.stop()}}),e)})))()}),[]),(0,g.jsxs)("section",{className:w().container,children:[(0,g.jsx)(P,{brightSpace:t}),(0,g.jsx)("section",{className:w().list,children:a})]})},A=function(e){var t=e.brightSpace,n=(e.Route,e.ClassId),r=(0,s.useState)((0,g.jsx)(g.Fragment,{})),a=r[0];r[1];return(0,s.useEffect)((function(){(0,o.Z)(d().mark((function e(){return d().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log(n);case 1:case"end":return e.stop()}}),e)})))()}),[]),(0,g.jsxs)("section",{className:w().container,children:[(0,g.jsx)(P,{brightSpace:t}),(0,g.jsx)("section",{className:w().list,children:a})]})};function F(){F=function(e,t){return new n(e,void 0,t)};var e=RegExp.prototype,t=new WeakMap;function n(e,r,a){var s=new RegExp(e,r);return t.set(s,a||t.get(e)),(0,c.Z)(s,n.prototype)}function r(e,n){var r=t.get(n);return Object.keys(r).reduce((function(t,n){return t[n]=e[r[n]],t}),Object.create(null))}return(0,a.Z)(n,RegExp),n.prototype.exec=function(t){var n=e.exec.call(this,t);return n&&(n.groups=r(n,this)),n},n.prototype[Symbol.replace]=function(n,a){if("string"===typeof a){var c=t.get(this);return e[Symbol.replace].call(this,n,a.replace(/\$<([^>]+)>/g,(function(e,t){return"$"+c[t]})))}if("function"===typeof a){var s=this;return e[Symbol.replace].call(this,n,(function(){var e=arguments;return"object"!==typeof e[e.length-1]&&(e=[].slice.call(e)).push(r(e,s)),a.apply(this,e)}))}return e[Symbol.replace].call(this,n,a)},F.apply(this,arguments)}var H=function(){var e=(0,s.useState)((0,g.jsx)(j,{})),t=e[0],n=e[1],r=function e(t){var r=window.location.pathname;switch(!0){case/\/d2l\/home\/([^/]*)$/.test(r):var a,c,s=(null===(a=r.match(F(/\/d2l\/home\/((?:(?!\/)[\s\S])*)$/,{id:1})))||void 0===a||null===(c=a.groups)||void 0===c?void 0:c.id)||"";n((0,g.jsx)(A,{brightSpace:t,Route:e,ClassId:s}));break;case"/d2l/home"==r:default:n((0,g.jsx)(z,{brightSpace:t,Route:e})),console.log(window.location.pathname)}};return(0,s.useEffect)((function(){var e=new x;r(e)}),[]),(0,g.jsxs)(g.Fragment,{children:[(0,g.jsxs)(i.default,{children:[(0,g.jsx)("title",{children:"test"}),(0,g.jsx)("meta",{name:"viewport",content:"initial-scale=1.0, width=device-width"}),(0,g.jsx)("link",{rel:"icon",type:"image/png",href:"/favicon.png"}),(0,g.jsx)("meta",{name:"description",content:"A Serverless React Based Chat Application Similar To Discord, Using Firebase."})]}),t]})}},8738:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(569)}])},3568:function(e){e.exports={container:"ClassCard_container__3bZ-R",content:"ClassCard_content__2yiYZ",disabled:"ClassCard_disabled__14zcG"}},6620:function(e){e.exports={container:"NavBar_container__3IqSA",side:"NavBar_side__3muHW",center:"NavBar_center__3E86B",rightSide:"NavBar_rightSide__1SXd1",SearchBar:"NavBar_SearchBar__31W89",Icon:"NavBar_Icon__3DVuB",IconButton:"NavBar_IconButton__1hPZ3"}},298:function(e){e.exports={container:"ClassList_container__2hWRp",list:"ClassList_list__3rI0R"}},2221:function(e){e.exports={container:"Loader_container__1Rrbz",loader:"Loader_loader__9-c8B"}}},function(e){e.O(0,[774,640,888,179],(function(){return t=8738,e(e.s=t);var t}));var t=e.O();_N_E=t}]);