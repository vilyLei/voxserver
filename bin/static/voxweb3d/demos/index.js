(function(e,t){"object"===typeof exports&&"object"===typeof module?module.exports=t():"function"===typeof define&&define.amd?define([],t):"object"===typeof exports?exports["VoxWeb"]=t():e["VoxWeb"]=t()})("undefined"!==typeof self?self:this,(function(){return function(e){var t={};function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(i,o,function(t){return e[t]}.bind(null,o));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="fae3")}({"1eb2":function(e,t,n){"use strict";if("undefined"!==typeof window){var i=window.document.currentScript,o=n("8875");i=o(),"currentScript"in document||Object.defineProperty(document,"currentScript",{get:o});var r=i&&i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);r&&(n.p=r[1])}},"1f99":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=n("caa2");let o=new i.EnginePage;o.initialize()},"7aa4":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});class i{static getDomain(e){var t=/http:\/\/([^\/]+)/i;let n=e.match(t);return null!=n&&n.length>0?n[0]:""}static getHostUrl(e){let t=location.href,n=i.getDomain(t),o=t.split(":");return t=o[0]+":"+o[1],e?t+":"+e+"/":n+"/"}static isEnabled(){let e=window.location.href;return e.indexOf(".artvily.com")>0}static filterUrl(e){if(e.indexOf("blob:")<0){let t=window.location.href;t.indexOf(".artvily.")>0&&(t="http://www.artvily.com:9090/",e=t+e)}return e}static getFileName(e,t=!1){if(e.indexOf("blob:")<0){let n=e.lastIndexOf("/");if(n<0)return"";let i=e.indexOf(".",n);if(i<0)return"";if(n+2<i){let o=e.slice(n+1,i);return t?o.toLocaleLowerCase():o}}return""}static getFileNameAndSuffixName(e,t=!1){if(e.indexOf("blob:")<0){let n=e.lastIndexOf("/"),i=e.indexOf(".",n);if(i<0)return"";let o=e.slice(n+1);return t?o.toLocaleLowerCase():o}return""}static getFileSuffixName(e,t=!1){if(e.indexOf("blob:")<0){let n=e.lastIndexOf("/"),i=e.indexOf(".",n);if(i<0)return"";let o=e.slice(i+1);return t?o.toLocaleLowerCase():o}return""}}t.default=i},8875:function(e,t,n){var i,o,r;(function(n,l){o=[],i=l,r="function"===typeof i?i.apply(t,o):i,void 0===r||(e.exports=r)})("undefined"!==typeof self&&self,(function(){function e(){var t=Object.getOwnPropertyDescriptor(document,"currentScript");if(!t&&"currentScript"in document&&document.currentScript)return document.currentScript;if(t&&t.get!==e&&document.currentScript)return document.currentScript;try{throw new Error}catch(m){var n,i,o,r=/.*at [^(]*\((.*):(.+):(.+)\)$/gi,l=/@([^@]*):(\d+):(\d+)\s*$/gi,s=r.exec(m.stack)||l.exec(m.stack),d=s&&s[1]||!1,a=s&&s[2]||!1,c=document.location.href.replace(document.location.hash,""),u=document.getElementsByTagName("script");d===c&&(n=document.documentElement.outerHTML,i=new RegExp("(?:[^\\n]+?\\n){0,"+(a-2)+"}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*","i"),o=n.replace(i,"$1").trim());for(var f=0;f<u.length;f++){if("interactive"===u[f].readyState)return u[f];if(u[f].src===d)return u[f];if(d===c&&u[f].innerHTML&&u[f].innerHTML.trim()===o)return u[f]}return null}}return e}))},caa2:function(e,t,n){"use strict";var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(n("7aa4"));class r{constructor(){this.m_htmlText="",this.m_host="",this.m_domin="",this.m_demoBodyDiv=null,this.m_infoDiv=null}initialize(){this.m_domin=o.default.getDomain(location.href),this.m_host=o.default.getHostUrl("9090"),this.m_host="",this.m_demoBodyDiv=document.getElementById("demos"),null==this.m_demoBodyDiv&&this.initUI(),this.loadData(this.m_host+"static/voxweb3d/demos/demos.json?ver="+Math.random()+Date.now()),this.initHeadApp()}initHeadApp(){let e=this.m_host+"static/voxweb3d/demos/camRoaming.js",t=new XMLHttpRequest;t.open("GET",e,!0),t.onerror=function(e){},t.onload=e=>{let n=document.createElement("script");n.onerror=e=>{},n.type="text/javascript",n.innerHTML=t.response,document.head.appendChild(n)},t.send(null)}parseData(e){let t,n="";n+="<center/>",n+='<hr style="height:3px;border:1px solid #444444;"/>',n+="<br/>",n+="ENGINE DEMOS",this.m_htmlText=n;let i=e.demos;for(let r=0;r<i.length;++r)t=i[r],this.addLinkHtmlLine(t.name,t.info,t.url);if(n="",void 0!==typeof CURR_PAGE_ST_INFO_LIST){let e=CURR_PAGE_ST_INFO_LIST;n="<br/><br/>",n+='<hr style="height:3px;border:1px solid #444444;"/>',n+="<font size=3>"+e[0]+" · "+e[1]+"</font>"}this.m_demoBodyDiv.innerHTML=this.m_htmlText+n;let o=document.getElementById("divBody");if(null!=o){let e=document.body,t=document.documentElement,n=Math.max(e.scrollHeight,e.offsetHeight,t.clientHeight,t.scrollHeight,t.offsetHeight);o.style.height=n+10+"px"}}addLinkHtmlLine(e,t,n){this.m_htmlText+="<br/>",void 0!==n&&""!=n||(n=this.m_domin+"/renderCase?sample=demoLoader&demo="+e),this.m_htmlText+=`<a id="link_demo" href="${n}" target="_blank">${t}</a>`}loadData(e){let t=new XMLHttpRequest;t.open("GET",e,!0),t.onerror=function(e){},t.onprogress=e=>{},t.onload=()=>{let e=t.response,n=JSON.parse(e);this.parseData(n)},t.send(null)}showLoadInfo(e){this.showLoadProgressInfo(e)}initUI(){this.m_demoBodyDiv=document.createElement("div"),this.m_demoBodyDiv.style.width="100vw",this.m_demoBodyDiv.style.height="100vh",document.body.appendChild(this.m_demoBodyDiv),document.body.style.margin="0",this.showInfo("init...")}showInfo(e){null==this.m_infoDiv&&(this.m_infoDiv=document.createElement("div"),this.m_infoDiv.style.backgroundColor="rgba(255,255,255,0.1)",this.m_infoDiv.style.color="#00ee00",this.elementCenter(this.m_infoDiv),this.m_demoBodyDiv.appendChild(this.m_infoDiv)),this.m_infoDiv.innerHTML=e}showLoadProgressInfo(e){let t="loading "+Math.round(100*e.loaded/e.total)+"% ";this.showInfo(t)}showLoadStart(){this.showInfo("loading 0%")}showLoaded(){this.showInfo("100%")}loadFinish(){null!=this.m_demoBodyDiv&&(this.m_demoBodyDiv.parentElement.removeChild(this.m_demoBodyDiv),this.m_demoBodyDiv=null)}elementCenter(e,t="50%",n="50%",i="absolute"){e.style.textAlign="center",e.style.display="flex",e.style.flexDirection="column",e.style.justifyContent="center",e.style.alignItems="center"}}t.EnginePage=r,t.default=r},fae3:function(e,t,n){"use strict";n.r(t);n("1eb2");var i=n("1f99");for(var o in i)["default"].indexOf(o)<0&&function(e){n.d(t,e,(function(){return i[e]}))}(o)}})}));