(function(e,t){"object"===typeof exports&&"object"===typeof module?module.exports=t():"function"===typeof define&&define.amd?define([],t):"object"===typeof exports?exports["VoxApp"]=t():e["VoxApp"]=t()})("undefined"!==typeof self?self:this,(function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="fae3")}({"1eb2":function(e,t,n){"use strict";if("undefined"!==typeof window){var o=window.document.currentScript,r=n("8875");o=r(),"currentScript"in document||Object.defineProperty(document,"currentScript",{get:r});var i=o&&o.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);i&&(n.p=i[1])}},"5ff4":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=n("b3d1");document.title="Rendering & Art";let r=new o.DemoLoader;r.initialize()},8875:function(e,t,n){var o,r,i;(function(n,l){r=[],o=l,i="function"===typeof o?o.apply(t,r):o,void 0===i||(e.exports=i)})("undefined"!==typeof self&&self,(function(){function e(){var t=Object.getOwnPropertyDescriptor(document,"currentScript");if(!t&&"currentScript"in document&&document.currentScript)return document.currentScript;if(t&&t.get!==e&&document.currentScript)return document.currentScript;try{throw new Error}catch(p){var n,o,r,i=/.*at [^(]*\((.*):(.+):(.+)\)$/gi,l=/@([^@]*):(\d+):(\d+)\s*$/gi,s=i.exec(p.stack)||l.exec(p.stack),d=s&&s[1]||!1,c=s&&s[2]||!1,u=document.location.href.replace(document.location.hash,""),f=document.getElementsByTagName("script");d===u&&(n=document.documentElement.outerHTML,o=new RegExp("(?:[^\\n]+?\\n){0,"+(c-2)+"}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*","i"),r=n.replace(o,"$1").trim());for(var a=0;a<f.length;a++){if("interactive"===f[a].readyState)return f[a];if(f[a].src===d)return f[a];if(d===u&&f[a].innerHTML&&f[a].innerHTML.trim()===r)return f[a]}return null}}return e}))},b3d1:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});class o{constructor(){this.m_bodyDiv=null,this.m_infoDiv=null}initialize(){let e=location.href+"";e=this.parseUrl(e),this.initUI(),this.load(e)}load(e){let t=new XMLHttpRequest;t.open("GET",e,!0),t.onerror=function(e){},t.onprogress=e=>{this.showLoadInfo(e,t)},t.onload=()=>{let e=document.createElement("script");e.onerror=e=>{},e.innerHTML=t.response,document.head.appendChild(e),this.loadFinish()},t.send(null)}showLoadInfo(e,t){this.showLoadProgressInfo(e,t)}parseUrl(e){let t=e.split("?");if(t.length<2||t[0].indexOf("renderCase")<1)return"";let n=t[1];if(t=n.split("&"),t.length<2||t[0].indexOf("sample")<0)return"";if(n=t[1],t=n.split("="),t.length<2||"demo"!=t[0])return"";let o=location.href+"",r="";return o.indexOf("artvily.")>0&&(r="http://www.artvily.com:9090/"),r+"static/voxweb3d/demos/"+t[1]+".js"}initUI(){document.body.style.background="#000000",this.m_bodyDiv=document.createElement("div"),this.m_bodyDiv.style.width="100vw",this.m_bodyDiv.style.height="100vh",this.elementCenter(this.m_bodyDiv),document.body.appendChild(this.m_bodyDiv),document.body.style.margin="0",this.showInfo("init...")}showInfo(e){null==this.m_infoDiv&&(this.m_infoDiv=document.createElement("div"),this.m_infoDiv.style.backgroundColor="rgba(255,255,255,0.1)",this.m_infoDiv.style.color="#00ee00",this.elementCenter(this.m_infoDiv),this.m_bodyDiv.appendChild(this.m_infoDiv)),this.m_infoDiv.innerHTML=e}showLoadProgressInfo(e,t){let n=0;if(e.total>0||e.lengthComputable)n=Math.min(1,e.loaded/e.total);else{let o=parseInt(t.getResponseHeader("content-length"));o>0&&(o*=4,n=Math.min(1,e.loaded/o))}let o="loading "+n+"% ";this.showInfo(o)}showLoadStart(){this.showInfo("loading 0% ")}showLoaded(){this.showInfo("100% ")}loadFinish(){null!=this.m_bodyDiv&&(this.m_bodyDiv.parentElement.removeChild(this.m_bodyDiv),this.m_bodyDiv=null)}elementCenter(e,t="50%",n="50%",o="absolute"){e.style.textAlign="center",e.style.display="flex",e.style.flexDirection="column",e.style.justifyContent="center",e.style.alignItems="center"}}t.DemoLoader=o,t.default=o},fae3:function(e,t,n){"use strict";n.r(t);n("1eb2");var o=n("5ff4");for(var r in o)["default"].indexOf(r)<0&&function(e){n.d(t,e,(function(){return o[e]}))}(r)}})}));