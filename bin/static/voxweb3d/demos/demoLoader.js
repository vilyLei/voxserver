(function(e,t){"object"===typeof exports&&"object"===typeof module?module.exports=t():"function"===typeof define&&define.amd?define([],t):"object"===typeof exports?exports["VoxApp"]=t():e["VoxApp"]=t()})("undefined"!==typeof self?self:this,(function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="fae3")}({"1eb2":function(e,t,n){"use strict";if("undefined"!==typeof window){var o=window.document.currentScript,r=n("8875");o=r(),"currentScript"in document||Object.defineProperty(document,"currentScript",{get:r});var i=o&&o.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);i&&(n.p=i[1])}},8875:function(e,t,n){var o,r,i;(function(n,s){r=[],o=s,i="function"===typeof o?o.apply(t,r):o,void 0===i||(e.exports=i)})("undefined"!==typeof self&&self,(function(){function e(){var t=Object.getOwnPropertyDescriptor(document,"currentScript");if(!t&&"currentScript"in document&&document.currentScript)return document.currentScript;if(t&&t.get!==e&&document.currentScript)return document.currentScript;try{throw new Error}catch(p){var n,o,r,i=/.*at [^(]*\((.*):(.+):(.+)\)$/gi,s=/@([^@]*):(\d+):(\d+)\s*$/gi,c=i.exec(p.stack)||s.exec(p.stack),d=c&&c[1]||!1,u=c&&c[2]||!1,l=document.location.href.replace(document.location.hash,""),f=document.getElementsByTagName("script");d===l&&(n=document.documentElement.outerHTML,o=new RegExp("(?:[^\\n]+?\\n){0,"+(u-2)+"}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*","i"),r=n.replace(o,"$1").trim());for(var a=0;a<f.length;a++){if("interactive"===f[a].readyState)return f[a];if(f[a].src===d)return f[a];if(d===l&&f[a].innerHTML&&f[a].innerHTML.trim()===r)return f[a]}return null}}return e}))},b3d1:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});class o{constructor(){this.A=null,this.B=null}initialize(){let e=location.href+"";e=this.parseUrl(e),this.initUI(),this.load(e)}load(e){let t=new XMLHttpRequest;t.open("GET",e,!0),t.onerror=function(e){},t.onprogress=e=>{this.showLoadInfo(e)},t.onload=()=>{let e=document.createElement("script");e.onerror=e=>{},e.innerHTML=t.response,document.head.appendChild(e),this.loadFinish()},t.send(null)}showLoadInfo(e){this.showLoadProgressInfo(e)}parseUrl(e){let t=e.split("?");if(t.length<2||t[0].indexOf("renderCase")<1)return"";let n=t[1];return t=n.split("&"),t.length<2||t[0].indexOf("sample")<0?"":(n=t[1],t=n.split("="),t.length<2||"demo"!=t[0]?"":"static/voxweb3d/demos/"+t[1]+".js")}initUI(){document.body.style.background="#000000",this.A=document.createElement("div"),this.A.style.width="100vw",this.A.style.height="100vh",this.elementCenter(this.A),document.body.appendChild(this.A),document.body.style.margin="0",this.showInfo("init...")}showInfo(e){null==this.B&&(this.B=document.createElement("div"),this.B.style.backgroundColor="rgba(255,255,255,0.1)",this.B.style.color="#00ee00",this.elementCenter(this.B),this.A.appendChild(this.B)),this.B.innerHTML=e}showLoadProgressInfo(e){let t="loading "+Math.round(100*e.loaded/e.total)+"% ";this.showInfo(t)}showLoadStart(){this.showInfo("loading 0%")}showLoaded(){this.showInfo("100%")}loadFinish(){null!=this.A&&(this.A.parentElement.removeChild(this.A),this.A=null)}elementCenter(e,t="50%",n="50%",o="absolute"){e.style.textAlign="center",e.style.display="flex",e.style.flexDirection="column",e.style.justifyContent="center",e.style.alignItems="center"}}t.DemoLoader=o,t.default=o},b88e:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=n("b3d1");document.title="Vox APP";let r=new o.DemoLoader;r.initialize()},fae3:function(e,t,n){"use strict";n.r(t);n("1eb2");var o=n("b88e");for(var r in o)["default"].indexOf(r)<0&&function(e){n.d(t,e,(function(){return o[e]}))}(r)}})}));