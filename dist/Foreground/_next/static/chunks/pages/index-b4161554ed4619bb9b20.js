(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{7553:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return se}});var r,a,c=n(646),s=n(9623),i=n(3992),o=n(7729),u=n(9207),l=n(6601),d=n(9931),p=n(7460),h=n(2847),f=n.n(h);function m(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function v(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?m(Object(n),!0).forEach((function(t){(0,p.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):m(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}!function(e){e.ep="ep",e.le="le",e.lp="lp",e.lr="lr"}(r||(r={})),function(e){e[e.Module=0]="Module",e[e.Topic=1]="Topic"}(a||(a={}));var x,g,_=function(){function e(){(0,l.Z)(this,e),(0,p.Z)(this,"version",{ep:"1.0.0",le:"1.0.0",lp:"1.0.0",lr:"1.0.0"}),(0,p.Z)(this,"token",""),(0,p.Z)(this,"uid",""),this.uid=localStorage.getItem("Session.UserId"),this._start()}return(0,d.Z)(e,[{key:"_start",value:function(){var e=(0,u.Z)(f().mark((function e(){var t=this;return f().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.versions();case 2:e.sent.forEach((function(e){e.ProductCode!=r.ep&&e.ProductCode!=r.le&&e.ProductCode!=r.lp&&e.ProductCode!=r.lr||(t.version[e.ProductCode]=e.LatestVersion)})),this._getToken(!0),setInterval((function(){return window.requestIdleCallback((function(){return t._getToken(!0)}),{timeout:1e3})}),3e5);case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"_fetch",value:function(){var e=(0,u.Z)(f().mark((function e(t){var n,r,a=arguments;return f().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:{},t.startsWith("/")&&(t="https://durham.elearningontario.ca/d2l".concat(t)),n.headers=v({"content-type":"application/x-www-form-urlencoded, application/json"},n.headers),e.next=5,fetch(t,n);case 5:return r=e.sent,e.abrupt("return",r.json());case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"_getToken",value:function(){var e=(0,u.Z)(f().mark((function e(){var t,n=arguments;return f().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n.length>0&&void 0!==n[0]&&n[0])&&""!=this.token){e.next=6;break}return e.next=4,this._fetch("/lp/auth/oauth2/token",{headers:{"x-csrf-token":localStorage.getItem("XSRF.Token")},body:"scope=*:*:*",method:"POST"});case 4:t=e.sent,this.token=t.access_token;case 6:return e.abrupt("return",this.token);case 7:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"versions",value:function(){var e=(0,u.Z)(f().mark((function e(){return f().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this._fetch("/api/versions/");case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()}]),e}(),j=n(2221),b=n.n(j),w=n(1232),y=function(){return(0,w.jsx)("section",{className:b().container,children:(0,w.jsx)("div",{className:b().loader,children:new Array(9).map((function(e,t){return(0,w.jsx)("div",{},t)}))})})},S=n(298),k=n.n(S),C=n(6620),N=n.n(C),T=n(6911),O=n(2379),I=n(4882),B=n(3169),D=n(3754),Z=n(1495),P=function(e){e.brightSpace;return(0,w.jsxs)("nav",{className:N().container,children:[(0,w.jsx)("div",{className:"".concat(N().side," ").concat(N().leftSide),children:(0,w.jsx)(T.Z,{"aria-label":"aside",className:N().IconButton,children:(0,w.jsx)(O.Z,{className:N().Icon,component:I.Z,viewBox:"0 0 24 24"})})}),(0,w.jsx)("div",{className:N().center,children:(0,w.jsx)("input",{className:N().SearchBar,placeholder:"Search",type:"text"})}),(0,w.jsxs)("div",{className:"".concat(N().side," ").concat(N().rightSide),children:[(0,w.jsx)(T.Z,{"aria-label":"aside",className:N().IconButton,children:(0,w.jsx)(O.Z,{className:N().Icon,component:B.Z,viewBox:"0 0 24 24"})}),(0,w.jsx)(T.Z,{"aria-label":"aside",className:N().IconButton,children:(0,w.jsx)(O.Z,{className:N().Icon,component:D.Z,viewBox:"0 0 24 24"})}),(0,w.jsx)(T.Z,{"aria-label":"aside",className:N().IconButton,children:(0,w.jsx)(O.Z,{className:N().Icon,component:Z.Z,viewBox:"0 0 24 24"})}),(0,w.jsx)(T.Z,{"aria-label":"aside",className:N().IconButton,children:(0,w.jsx)("picture",{className:N().Icon,children:(0,w.jsx)("img",{src:"https://durham.elearningontario.ca/d2l/api/lp/1.32/profile/myProfile/image"})})})]})]})},R=n(3568),A=n.n(R),z=function(e){var t=e.Title,n=e.Href,r=e.Active,a=e.children,c=e.Route;return(0,w.jsx)("div",{onClick:function(){var e,a;e=t,a=n,r&&(c?(history.pushState({Title:e,Url:a},e,a),c()):window.location.href=a)},children:a})},E=function(e){var t=e.Name,n=e.Active,r=e.Href,a=e.Picture,c=e.StartDate,s=e.Route;return(0,w.jsx)("div",{className:[A().container,n?A().disabled:" "].join(" "),children:(0,w.jsxs)(z,{Title:t,Href:r,Active:!n,Route:s,children:[(0,w.jsx)("picture",{children:(0,w.jsx)("img",{src:a})}),(0,w.jsxs)("div",{className:A().content,children:[(0,w.jsx)("h4",{children:t}),n?(0,w.jsx)("h6",{children:"Closed"}):(0,w.jsxs)("h6",{children:["Closes | ",new Date(c).toDateString()]})]})]})})},M=function(e){var t=e.brightSpace,n=e.Route,r=(0,i.useState)((0,w.jsx)(w.Fragment,{})),a=r[0],c=r[1];return(0,i.useEffect)((function(){(0,u.Z)(f().mark((function e(){var r,a,s;return f().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=(new Date).valueOf(),e.t0=t,e.t1="https://bc59e98c-eabc-4d42-98e1-edfe93518966.enrollments.api.brightspace.com/users/".concat(t.uid,"?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false"),e.t2="Bearer ",e.next=6,t._getToken();case 6:return e.t3=e.sent,e.t4=e.t2.concat.call(e.t2,e.t3),e.t5={authorization:e.t4},e.t6={headers:e.t5},e.next=12,e.t0._fetch.call(e.t0,e.t1,e.t6);case 12:return a=e.sent,e.next=15,Promise.all(a.entities.map(function(){var e=(0,u.Z)(f().mark((function e(a){var c,s,i,o,l,d,p,h;return f().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c=a.href,e.t0=t,e.t1=c,e.t2="Bearer ",e.next=6,t._getToken();case 6:return e.t3=e.sent,e.t4=e.t2.concat.call(e.t2,e.t3),e.t5={authorization:e.t4},e.t6={headers:e.t5},e.next=12,e.t0._fetch.call(e.t0,e.t1,e.t6);case 12:return s=e.sent,e.t7=t,e.t8=s.links[1].href,e.t9="Bearer ",e.next=18,t._getToken();case 18:return e.t10=e.sent,e.t11=e.t9.concat.call(e.t9,e.t10),e.t12={authorization:e.t11},e.t13={headers:e.t12},e.next=24,e.t7._fetch.call(e.t7,e.t8,e.t13);case 24:return i=e.sent,e.next=27,window.fetch(i.entities[2].href).then((function(e){return e.json()})).catch((0,u.Z)(f().mark((function e(){return f().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=t,e.t1=i.entities[2].href,e.t2="Bearer ",e.next=5,t._getToken();case 5:return e.t3=e.sent,e.t4=e.t2.concat.call(e.t2,e.t3),e.t5={authorization:e.t4},e.t6={headers:e.t5},e.next=11,e.t0._fetch.call(e.t0,e.t1,e.t6).catch((function(){return"https://blog.fluidui.com/content/images/2019/01/imageedit_1_9273372713.png"}));case 11:return e.abrupt("return",e.sent);case 12:case"end":return e.stop()}}),e)}))));case 27:return o=e.sent,l=i.properties,d=l.endDate,p=l.name,h=l.startDate,e.abrupt("return",(0,w.jsx)(E,{Name:p,Active:new Date(d).valueOf()<r,Href:i.links[0].href.replace("https://bc59e98c-eabc-4d42-98e1-edfe93518966.folio.api.brightspace.com/organizations/","https://durham.elearningontario.ca/d2l/home/"),Picture:o.links?o.links[2].href:o,StartDate:h,Route:function(){return n(t)}}));case 30:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 15:s=e.sent,c((0,w.jsx)(w.Fragment,{children:s}));case 17:case"end":return e.stop()}}),e)})))()}),[]),(0,w.jsxs)("section",{className:k().container,children:[(0,w.jsx)(P,{brightSpace:t}),(0,w.jsx)("section",{className:k().list,children:a})]})},U=n(1021),F=n(9413),H=n.n(F);!function(e){e.News="News",e.Content="Content",e.Discussions="Discussions",e.Assignments="Assignments",e.Quizzes="Quizzes"}(x||(x={})),function(e){e.Complete="Complete",e.Unread="Unread",e.OverDue="DueDate"}(g||(g={}));var L=n(4934),W=n.n(L),V=function(e){var t=e.Name,n=e.Picture,r=e.StartDate;return(0,w.jsxs)("header",{className:W().container,children:[(0,w.jsx)("picture",{children:(0,w.jsx)("img",{src:n})}),(0,w.jsxs)("div",{className:W().content,children:[(0,w.jsx)("h4",{children:t}),(0,w.jsxs)("h6",{children:["Closes | ",new Date(r).toDateString()]})]})]})},Q=n(420),X=n.n(Q),$=n(9213),q=n(3699),G=function(e){var t,n=e.Id,r=e.Title,a=e.Progress,c=e.Category,s=e.StartDate,o=e.Content,u=!0,l=(0,i.useState)(!1),d=l[0],h=l[1],f=(0,i.useState)((0,w.jsx)(y,{})),m=f[0],v=f[1],g=(t={},(0,p.Z)(t,x.News,$.Z),(0,p.Z)(t,x.Content,q.Z),t)[c];return(0,w.jsxs)("div",{className:X().container,id:n.toString(),children:[(0,w.jsxs)("div",{className:X().titleBlock,onClick:function(){return function(){var e,t;if(!d&&u){var n;switch(h(!0),u=!1,c){case x.News:n=(0,w.jsx)("div",{dangerouslySetInnerHTML:{__html:(null===o||void 0===o?void 0:o.Html)||o.Text},className:X().Markdown});break;case x.Content:var r=o;switch(!0){case/docs\.google\.com/i.test(r):n=(0,w.jsx)("iframe",{allow:"encrypted-media *;",width:"100%",scrolling:"no",src:r,children:"The File Is Having Issues Being Shown"});break;case/www\.youtube\.com/i.test(r):n=(0,w.jsx)("object",{data:"https://www.youtube.com/embed/".concat(new URL(r).searchParams.get("v")),type:"application/pdf",width:"100%",height:"auto",children:(0,w.jsx)("embed",{src:"https://www.youtube.com/embed/".concat(new URL(r).searchParams.get("v")),type:"application/pdf"})});break;case/\.(doc|docm|docm|docx|docx|dotx|potx|ppt|pptm|pptm|pptx|xlw|xls|xlsm|xlsm|xlsx|xltx)/i.test(r):(void 0==navigator.mimeTypes||void 0!==(null===(e=navigator)||void 0===e?void 0:e.mimeTypes["application/x-nacl"])&&(0,U.Z)((null===(t=navigator)||void 0===t?void 0:t.plugins)||[{filename:""}]).some((function(e){return"gbkeegbaiigmenfmjfclcdgdpimamgkj"==e.filename})))&&(n=(0,w.jsx)("iframe",{allow:"encrypted-media *;",width:"100%",scrolling:"no",src:r,children:"The File Is Having Issues Being Shown"}));break;case/\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)/i.test(r):n=(0,w.jsx)("picture",{className:X().contentMedia,children:(0,w.jsx)("img",{src:r})});break;case/\.(3gp|aac|flac|mpg|mpeg|mp3|mp4|m4a|m4v|m4p|oga|ogg|ogv|ogg|mov|wav|webm)/i.test(r):n=(0,w.jsxs)("video",{className:X().contentMedia,controls:!0,children:[(0,w.jsx)("source",{src:r}),"Your Browser Does Not Support The Video Type"]});break;case/\.(pdf)/i.test(r):n=(0,w.jsx)("object",{data:r,type:"application/pdf",width:"100%",height:"auto",children:(0,w.jsx)("embed",{src:r,type:"application/pdf"})});break;case r.startsWith("/")&&/\.(html|htm)/i.test(r):n=(0,w.jsx)("iframe",{allow:"encrypted-media *;",width:"100%",src:r,children:"The Page is having some trouble showing"});break;default:console.log("rendering is not yet implemented for content at url: ".concat(r))}break;default:console.log("Viewing For Category ".concat(c," is not yet implemented"))}n&&v((0,w.jsx)(w.Fragment,{children:n}))}else h(!d)}()},children:[(0,w.jsx)("div",{className:[X().titleIcon,a].join(" "),children:(0,w.jsx)(O.Z,{className:X().Icon,component:g,viewBox:"0 0 24 24"})}),(0,w.jsxs)("div",{className:X().titleText,children:[(0,w.jsx)("h2",{children:r}),(0,w.jsx)("h5",{children:new Date(s).toDateString()})]})]}),(0,w.jsx)("div",{className:[X().cardBody,d?X().visible:""].join(" "),children:m})]},n)},Y=n(7237),J=n.n(Y),K=function(e){var t=e.Type,n=e.Active,r=e.ToggleType;return(0,w.jsx)("div",{className:[J().container,n?" ":J().disabled].join(" "),onClick:function(){return r(t)},children:t})};function ee(e,t){var n="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"===typeof e)return te(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return te(e,t)}(e))||t&&e&&"number"===typeof e.length){n&&(e=n);var r=0,a=function(){};return{s:a,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c,s=!0,i=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return s=e.done,e},e:function(e){i=!0,c=e},f:function(){try{s||null==n.return||n.return()}finally{if(i)throw c}}}}function te(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function ne(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function re(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?ne(Object(n),!0).forEach((function(t){(0,p.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ne(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var ae=function(e){var t,n,r=e.brightSpace,c=e.Route,s=e.ClassId,o=(0,i.useState)((0,w.jsx)(w.Fragment,{})),l=o[0],d=o[1],p=(0,i.useState)((0,w.jsx)(w.Fragment,{})),h=p[0],m=p[1],v=(0,i.useState)(!0),_=v[0],j=v[1],b=(0,i.useState)(!0),y=b[0],S=b[1],k=(0,i.useState)(!0),C=k[0],N=k[1],T=(0,i.useState)(!0),O=T[0],I=T[1],B=(0,i.useState)(!0),D=B[0],Z=B[1];(0,i.useEffect)((function(){(function(){var e=(0,u.Z)(f().mark((function e(){var t,n,i,o,l,p,h,v,_,j,b,y;return f().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=r,e.t1="https://bc59e98c-eabc-4d42-98e1-edfe93518966.organizations.api.brightspace.com/".concat(s),e.t2="Bearer ",e.next=5,r._getToken();case 5:return e.t3=e.sent,e.t4=e.t2.concat.call(e.t2,e.t3),e.t5={authorization:e.t4},e.t6={headers:e.t5},e.next=11,e.t0._fetch.call(e.t0,e.t1,e.t6);case 11:return t=e.sent,n=t.properties,i=t.entities,e.next=16,window.fetch(i[2].href).then((function(e){return e.json()})).catch((0,u.Z)(f().mark((function e(){return f().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=r,e.t1=i[2].href,e.t2="Bearer ",e.next=5,r._getToken();case 5:return e.t3=e.sent,e.t4=e.t2.concat.call(e.t2,e.t3),e.t5={authorization:e.t4},e.t6={headers:e.t5},e.next=11,e.t0._fetch.call(e.t0,e.t1,e.t6).catch((function(){return"https://blog.fluidui.com/content/images/2019/01/imageedit_1_9273372713.png"}));case 11:return e.abrupt("return",e.sent);case 12:case"end":return e.stop()}}),e)}))));case 16:return o=e.sent,m((0,w.jsx)(V,{Name:n.name,Picture:o.links?o.links[2].href:o,StartDate:n.startDate})),l=[],e.next=21,r._fetch("/api/le/".concat(r.version.le,"/").concat(s,"/news/"));case 21:return e.sent.forEach((function(e){l.push((0,w.jsx)(G,{Id:e.Id,Title:e.Title,Progress:g.Complete,Category:x.News,StartDate:e.StartDate,Content:e.Body,Route:c}))})),e.next=25,r._fetch("/api/le/unstable/".concat(s,"/content/userprogress/?pageSize=99999"));case 25:return p=e.sent,h=function(){var e=(0,u.Z)(f().mark((function e(t){var n;return f().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=[],e.next=3,Promise.all(t.map(function(){var e=(0,u.Z)(f().mark((function e(t){var c;return f().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:e.t0=t.Type,e.next=e.t0===a.Module?3:e.t0===a.Topic?15:17;break;case 3:return e.next=5,r._fetch("/api/le/".concat(r.version.le,"/").concat(s,"/content/modules/").concat(t.Id,"/structure/"));case 5:return c=e.sent,e.t1=n.push,e.t2=n,e.t3=U.Z,e.next=11,h(c);case 11:return e.t4=e.sent,e.t5=(0,e.t3)(e.t4),e.t1.apply.call(e.t1,e.t2,e.t5),e.abrupt("break",17);case 15:return n.push(re(re({},t),{},{Read:p.Objects.some((function(e){return e.ObjectId==t.Id&&e.IsRead}))})),e.abrupt("break",17);case 17:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 3:return e.abrupt("return",n);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),e.next=29,r._fetch("/api/le/".concat(r.version.le,"/").concat(s,"/content/root/"));case 29:return v=e.sent,e.next=32,h(v);case 32:_=e.sent,j=ee(_);try{for(j.s();!(b=j.n()).done;)y=b.value,l.push((0,w.jsx)(G,{Id:y.Id,Title:y.Title,Progress:[g.Unread,g.Complete][y.Read?1:0],Category:x.Content,StartDate:y.LastModifiedDate,Content:y.Url,Route:c}))}catch(S){j.e(S)}finally{j.f()}d((0,w.jsx)(w.Fragment,{children:l}));case 36:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[]);var R=function(e){switch(e){case x.News:j((function(e){return!e}));break;case x.Content:S((function(e){return!e}));break;case x.Discussions:N((function(e){return!e}));break;case x.Assignments:I((function(e){return!e}));break;case x.Quizzes:Z((function(e){return!e}))}};return(0,w.jsxs)("section",{className:H().container,children:[(0,w.jsx)(P,{brightSpace:r}),(0,w.jsxs)("section",{className:H().content,children:[h,(0,w.jsxs)("section",{className:H().stream,children:[(0,w.jsxs)("div",{className:H().chipContainer,children:[(0,w.jsx)(K,{Type:x.News,Active:_,ToggleType:R}),(0,w.jsx)(K,{Type:x.Content,Active:y,ToggleType:R}),(0,w.jsx)(K,{Type:x.Discussions,Active:C,ToggleType:R}),(0,w.jsx)(K,{Type:x.Assignments,Active:O,ToggleType:R}),(0,w.jsx)(K,{Type:x.Quizzes,Active:D,ToggleType:R})]}),(null===l||void 0===l||null===(t=l.props)||void 0===t||null===(n=t.children)||void 0===n?void 0:n.filter((function(e){switch(e.props.Category){case x.News:return _;default:return!0}})))||(0,w.jsx)(w.Fragment,{})]})]})]})};function ce(){ce=function(e,t){return new n(e,void 0,t)};var e=RegExp.prototype,t=new WeakMap;function n(e,r,a){var c=new RegExp(e,r);return t.set(c,a||t.get(e)),(0,s.Z)(c,n.prototype)}function r(e,n){var r=t.get(n);return Object.keys(r).reduce((function(t,n){return t[n]=e[r[n]],t}),Object.create(null))}return(0,c.Z)(n,RegExp),n.prototype.exec=function(t){var n=e.exec.call(this,t);return n&&(n.groups=r(n,this)),n},n.prototype[Symbol.replace]=function(n,a){if("string"===typeof a){var c=t.get(this);return e[Symbol.replace].call(this,n,a.replace(/\$<([^>]+)>/g,(function(e,t){return"$"+c[t]})))}if("function"===typeof a){var s=this;return e[Symbol.replace].call(this,n,(function(){var e=arguments;return"object"!==typeof e[e.length-1]&&(e=[].slice.call(e)).push(r(e,s)),a.apply(this,e)}))}return e[Symbol.replace].call(this,n,a)},ce.apply(this,arguments)}var se=function(){var e=(0,i.useState)((0,w.jsx)(y,{})),t=e[0],n=e[1],r=function e(t){var r=window.location.pathname;switch(!0){case/\/d2l\/home\/([^/]*)$/.test(r):var a,c,s=(null===(a=r.match(ce(/\/d2l\/home\/((?:(?!\/)[\s\S])*)$/,{id:1})))||void 0===a||null===(c=a.groups)||void 0===c?void 0:c.id)||"";n((0,w.jsx)(ae,{brightSpace:t,Route:e,ClassId:s}));break;case"/d2l/home"==r:default:n((0,w.jsx)(M,{brightSpace:t,Route:e})),console.log(window.location.pathname)}};return(0,i.useEffect)((function(){var e=new _;r(e)}),[]),(0,w.jsxs)(w.Fragment,{children:[(0,w.jsxs)(o.default,{children:[(0,w.jsx)("title",{children:"test"}),(0,w.jsx)("meta",{name:"viewport",content:"initial-scale=1.0, width=device-width"}),(0,w.jsx)("link",{rel:"icon",type:"image/png",href:"/favicon.png"}),(0,w.jsx)("meta",{name:"description",content:"A Serverless React Based Chat Application Similar To Discord, Using Firebase."})]}),t]})}},8738:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(7553)}])},3568:function(e){e.exports={container:"ClassCard_container__3bZ-R",content:"ClassCard_content__2yiYZ",disabled:"ClassCard_disabled__14zcG"}},4934:function(e){e.exports={container:"ClassHeaderCard_container__3HrXx",content:"ClassHeaderCard_content__1fxOt"}},6620:function(e){e.exports={container:"NavBar_container__3IqSA",side:"NavBar_side__3muHW",center:"NavBar_center__3E86B",rightSide:"NavBar_rightSide__1SXd1",SearchBar:"NavBar_SearchBar__31W89",Icon:"NavBar_Icon__3DVuB",IconButton:"NavBar_IconButton__1hPZ3"}},420:function(e){e.exports={container:"StreamCard_container__2ubM5",hidden:"StreamCard_hidden__1e2gm",titleBlock:"StreamCard_titleBlock__3MkW5",titleIcon:"StreamCard_titleIcon__2CLpI",DueDate:"StreamCard_DueDate__1vKVq",Unread:"StreamCard_Unread__RTpBG",titleText:"StreamCard_titleText__1zlQP",Markdown:"StreamCard_Markdown__1-lU8",contentMedia:"StreamCard_contentMedia__97EqL",cardBody:"StreamCard_cardBody__1DOL3",visible:"StreamCard_visible__1VWJy"}},7237:function(e){e.exports={container:"StreamChip_container__3xRj6",disabled:"StreamChip_disabled__kZoYS"}},298:function(e){e.exports={container:"ClassList_container__2hWRp",list:"ClassList_list__3rI0R"}},9413:function(e){e.exports={container:"ClassRoom_container__1j7l6",content:"ClassRoom_content__EvU3F",stream:"ClassRoom_stream__2pcrz",chipContainer:"ClassRoom_chipContainer__G55Bg"}},2221:function(e){e.exports={container:"Loader_container__1Rrbz",loader:"Loader_loader__9-c8B"}}},function(e){e.O(0,[774,443,888,179],(function(){return t=8738,e(e.s=t);var t}));var t=e.O();_N_E=t}]);