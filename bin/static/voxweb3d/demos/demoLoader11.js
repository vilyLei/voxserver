(function(t,e){"object"===typeof exports&&"object"===typeof module?module.exports=e():"function"===typeof define&&define.amd?define([],e):"object"===typeof exports?exports["VoxWeb"]=e():t["VoxWeb"]=e()})("undefined"!==typeof self?self:this,(function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var i=e[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(o,i,function(e){return t[e]}.bind(null,i));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s="fae3")}({"1eb2":function(t,e,n){"use strict";if("undefined"!==typeof window){var o=window.document.currentScript,i=n("8875");o=i(),"currentScript"in document||Object.defineProperty(document,"currentScript",{get:i});var r=o&&o.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);r&&(n.p=r[1])}},"1f99":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const o=n("b3d1");document.title="Rendering & Art";let i=new o.DemoLoader;i.initialize()},8875:function(t,e,n){var o,i,r;(function(n,s){i=[],o=s,r="function"===typeof o?o.apply(e,i):o,void 0===r||(t.exports=r)})("undefined"!==typeof self&&self,(function(){function t(){var e=Object.getOwnPropertyDescriptor(document,"currentScript");if(!e&&"currentScript"in document&&document.currentScript)return document.currentScript;if(e&&e.get!==t&&document.currentScript)return document.currentScript;try{throw new Error}catch(h){var n,o,i,r=/.*at [^(]*\((.*):(.+):(.+)\)$/gi,s=/@([^@]*):(\d+):(\d+)\s*$/gi,l=r.exec(h.stack)||s.exec(h.stack),u=l&&l[1]||!1,a=l&&l[2]||!1,d=document.location.href.replace(document.location.hash,""),c=document.getElementsByTagName("script");u===d&&(n=document.documentElement.outerHTML,o=new RegExp("(?:[^\\n]+?\\n){0,"+(a-2)+"}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*","i"),i=n.replace(o,"$1").trim());for(var f=0;f<c.length;f++){if("interactive"===c[f].readyState)return c[f];if(c[f].src===u)return c[f];if(u===d&&c[f].innerHTML&&c[f].innerHTML.trim()===i)return c[f]}return null}}return t}))},b3d1:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class o{constructor(){this.item=null,this.m_t=0,this.m_gooutId=-1,this.m_flag=0,this.m_timeoutId=-1}start(){this.m_t=Date.now(),this.item&&this.item.pay&&"Free"==this.item.pay?this.finishCall():this.autoUpdate()}autoGo(){this.m_gooutId>-1&&clearTimeout(this.m_gooutId),this.m_flag++,this.m_flag>2?this.finishCall():this.m_gooutId=setTimeout(this.autoGo.bind(this),100)}autoUpdate(){this.m_timeoutId>-1&&clearTimeout(this.m_timeoutId);let t=Date.now()-this.m_t,e=t/2e3,n=!1;e>=1?(e=1,n=!0):this.m_timeoutId=setTimeout(this.autoUpdate.bind(this),50),e=1-e,e=Math.round(100*e);let o="私人服务带宽小</br>请稍等两秒:&nbsp",i="%</br>需要加速请联系作者</br>email:&nbspvily313@126.com";this.item&&this.item.pay||(i="%"),e>=10?this.setInfoCall(o+e+i):this.setInfoCall(o+"&nbsp&nbsp"+e+i),n&&this.autoGo()}}class i{constructor(){this.mWP=new o,this.m_name="",this.mBDV=null,this.mIDV=null}initialize(){let t=location.href+"";t=this.parseUrl(t),this.initUI();let e=location.href+"",n="";e.indexOf("artvily.")>0&&(n="http://www.artvily.com:9090/"),this.showInfo("loading..."),this.loadInfo(n+"static/voxweb3d/demos/info.json?vtk="+Math.random()+"uf8"+Date.now(),t)}loadModule(t){let e=new XMLHttpRequest;e.open("GET",t,!0),e.onerror=function(t){},e.onprogress=t=>{this.showLoadInfo(t,e)},e.onload=()=>{let t=document.createElement("script");t.onerror=t=>{},t.innerHTML=e.response,document.head.appendChild(t),this.loadFinish()},e.send(null)}loadInfo(t,e){let n=new XMLHttpRequest;n.open("GET",t,!0),n.onerror=function(t){},n.onprogress=t=>{},n.onload=()=>{let t=n.response,o=JSON.parse(t),i=new Map,r=o.demos;for(let e=0;e<r.length;++e)i.set(r[e].name,r[e]);let s=null;i.has(this.m_name)&&(s=i.get(this.m_name),e=e+"?dtk="+s.ver);let l=this.mWP;l.item=s,l.setInfoCall=t=>{this.showInfo(t)},l.finishCall=()=>{this.showInfo("loading 1% "),this.loadModule(e)},l.start()},n.send(null)}showLoadInfo(t,e){this.showPro(t,e)}parseUrl(t){let e=t.split("?");if(e.length<2||e[0].indexOf("renderCase")<1)return"";let n=e[1];if(e=n.split("&"),e.length<2||e[0].indexOf("sample")<0)return"";if(n=e[1],e=n.split("="),e.length<2||"demo"!=e[0])return"";let o=location.href+"",i="";return o.indexOf("artvily.")>0&&(i="http://www.artvily.com:9090/"),this.m_name=e[1],i+"static/voxweb3d/demos/"+e[1]+".js"}initUI(){let t=document.body;t.style.background="#000000";let e=this.mBDV;e=document.createElement("div"),e.style.width="100vw",e.style.height="100vh",this.elementCenter(e),t.appendChild(e),t.style.margin="0",this.mBDV=e,this.showInfo("init...")}showInfo(t){let e=this.mIDV;null==e&&(e=document.createElement("div"),e.style.backgroundColor="rgba(255,255,255,0.1)",e.style.color="#00ee00",this.elementCenter(e),this.mBDV.appendChild(e)),e.innerHTML=t,this.mIDV=e}showPro(t,e){let n=0;if(t.total>0||t.lengthComputable)n=Math.min(1,t.loaded/t.total);else{let o=parseInt(e.getResponseHeader("content-length"));o>0&&(o*=4,n=Math.min(1,t.loaded/o))}this.showInfo("loading "+Math.round(100*n)+"% ")}showLoadStart(){this.showInfo("loading 1% ")}showLoaded(){this.showInfo("100% ")}loadFinish(){let t=this.mBDV;t&&(t.parentElement.removeChild(t),this.mBDV=null)}elementCenter(t,e="50%",n="50%",o="absolute"){const i=t.style;i.textAlign="center",i.display="flex",i.flexDirection="column",i.justifyContent="center"}}e.DemoLoader=i,e.default=i},fae3:function(t,e,n){"use strict";n.r(e);n("1eb2");var o=n("1f99");for(var i in o)["default"].indexOf(i)<0&&function(t){n.d(e,t,(function(){return o[t]}))}(i)}})}));