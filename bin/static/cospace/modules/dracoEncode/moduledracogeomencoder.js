(function(e,t){"object"===typeof exports&&"object"===typeof module?module.exports=t():"function"===typeof define&&define.amd?define([],t):"object"===typeof exports?exports["ModuleDracoGeomEncoder"]=t():e["ModuleDracoGeomEncoder"]=t()})("undefined"!==typeof self?self:this,(function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s="fae3")}({"1eb2":function(e,t,r){"use strict";if("undefined"!==typeof window){var n=window.document.currentScript,o=r("8875");n=o(),"currentScript"in document||Object.defineProperty(document,"currentScript",{get:o});var a=n&&n.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);a&&(r.p=a[1])}},"2e55":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});class n{}n.PARSE="DRACO_PARSE",n.ENCODE="DRACO_ENCODE",n.THREAD_ACQUIRE_DATA="DRACO_THREAD_ACQUIRE_DATA",n.THREAD_TRANSMIT_DATA="DRACO_THREAD_TRANSMIT_DATA",t.DracoTaskCMD=n},"77de":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r("2e55");let o=n.DracoTaskCMD;class a{receiveCall(e){Date.now();let t=e.streams;const r=this.encoder,n=new r.Encoder;let o=e.descriptor,a=Math.round(10-o.compressionLevel);a<0?a=0:a>10&&(a=10),n.SetSpeedOptions(a,a),n.SetAttributeQuantization(r.POSITION,o.posQuantization),n.SetAttributeQuantization(r.TEX_COORD,o.uvQuantization),n.SetAttributeQuantization(r.NORMAL,o.nvQuantization),n.SetAttributeQuantization(r.GENERIC,o.genericQuantization);const s=new r.MeshBuilder,i=new r.Mesh,c={indices:t[3],vertices:t[0],texcoords:t[1],normals:t[2],colors:null},u=c.indices.length/3,d=c.vertices.length;s.AddFacesToMesh(i,u,c.indices),s.AddFloatAttributeToMesh(i,r.POSITION,d,3,c.vertices),null!=c.normals&&s.AddFloatAttributeToMesh(i,r.NORMAL,d,3,c.normals),null!=c.colors&&s.AddFloatAttributeToMesh(i,r.COLOR,d,3,c.colors),null!=c.texcoords&&s.AddFloatAttributeToMesh(i,r.TEX_COORD,d,2,c.texcoords);const l=new r.DracoInt8Array,f=n.EncodeMeshToDracoBuffer(i,l),h=new Int8Array(f);for(let T=0;T<f;T++)h[T]=l.GetValue(T);r.destroy(i),r.destroy(s),r.destroy(n),r.destroy(l);let p=new Array(t.length+1);for(let T=0;T<t.length;++T)p[T]=t[T].buffer;p[t.length]=h.buffer;let m={data:h,transfers:p,errorFlag:0};return m}}class s{constructor(){this.m_dependencyFinish=!1,this.m_wasmData=null,this.m_currTaskClass=-1,this.threadIndex=0,this.encoder=null,this.encoderObj={wasmBinary:null},this.dracoParser=new a,this.m_currTaskClass=ThreadCore.getCurrTaskClass(),ThreadCore.setCurrTaskClass(this.m_currTaskClass),ThreadCore.acquireData(this,{},o.THREAD_ACQUIRE_DATA),ThreadCore.useDependency(this),ThreadCore.resetCurrTaskClass()}postDataMessage(e,t){ThreadCore.postMessageToThread(e,t)}initEncoder(e){let t=e.streams[0];this.encoderObj["wasmBinary"]=t,this.encoderObj["onModuleLoaded"]=r=>{this.encoder=r,this.dracoParser.encoder=r,ThreadCore.setCurrTaskClass(this.m_currTaskClass),ThreadCore.transmitData(this,e,o.THREAD_TRANSMIT_DATA,[t]),ThreadCore.initializeExternModule(this),ThreadCore.resetCurrTaskClass()},DracoEncoderModule(this.encoderObj)}receiveData(e){switch(e.taskCmd){case o.ENCODE:let t=this.dracoParser.receiveCall(e);e.data={buf:t.data,errorFlag:t.errorFlag},this.postDataMessage(e,t.transfers);break;case o.THREAD_ACQUIRE_DATA:this.threadIndex=e.threadIndex,this.m_wasmData=e.data,this.m_dependencyFinish&&null!=this.m_wasmData&&this.initEncoder(this.m_wasmData);break;default:break}}getUniqueName(){return"dracoGeomEncoder"}dependencyFinish(){this.m_dependencyFinish=!0,this.m_dependencyFinish&&null!=this.m_wasmData&&this.initEncoder(this.m_wasmData)}}t.DracoGeomEncodeTask=s;new s},8875:function(e,t,r){var n,o,a;(function(r,s){o=[],n=s,a="function"===typeof n?n.apply(t,o):n,void 0===a||(e.exports=a)})("undefined"!==typeof self&&self,(function(){function e(){var t=Object.getOwnPropertyDescriptor(document,"currentScript");if(!t&&"currentScript"in document&&document.currentScript)return document.currentScript;if(t&&t.get!==e&&document.currentScript)return document.currentScript;try{throw new Error}catch(h){var r,n,o,a=/.*at [^(]*\((.*):(.+):(.+)\)$/gi,s=/@([^@]*):(\d+):(\d+)\s*$/gi,i=a.exec(h.stack)||s.exec(h.stack),c=i&&i[1]||!1,u=i&&i[2]||!1,d=document.location.href.replace(document.location.hash,""),l=document.getElementsByTagName("script");c===d&&(r=document.documentElement.outerHTML,n=new RegExp("(?:[^\\n]+?\\n){0,"+(u-2)+"}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*","i"),o=r.replace(n,"$1").trim());for(var f=0;f<l.length;f++){if("interactive"===l[f].readyState)return l[f];if(l[f].src===c)return l[f];if(c===d&&l[f].innerHTML&&l[f].innerHTML.trim()===o)return l[f]}return null}}return e}))},fae3:function(e,t,r){"use strict";r.r(t);r("1eb2");var n=r("77de");for(var o in n)["default"].indexOf(o)<0&&function(e){r.d(t,e,(function(){return n[e]}))}(o)}})}));