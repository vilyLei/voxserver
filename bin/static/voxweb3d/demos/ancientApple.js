(function(t,e){"object"===typeof exports&&"object"===typeof module?module.exports=e():"function"===typeof define&&define.amd?define([],e):"object"===typeof exports?exports["VoxApp"]=e():t["VoxApp"]=e()})("undefined"!==typeof self?self:this,(function(){return function(t){var e={};function i(s){if(e[s])return e[s].exports;var a=e[s]={i:s,l:!1,exports:{}};return t[s].call(a.exports,a,a.exports,i),a.l=!0,a.exports}return i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)i.d(s,a,function(e){return t[e]}.bind(null,a));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s="fae3")}({"0dae":function(t,e,i){"use strict";var s=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const a=s(i("c497")),r=s(i("8e17")),n=i("4301"),l=s(i("2e85")),o=s(i("97e3"));function h(t){function e(i){t.run(),window.requestAnimationFrame(e)}t.initialize(),window.requestAnimationFrame(e)}class d{constructor(){this.m_voxAppEngine=null,this.m_voxAppBase=null,this.m_voxAppObjData=null,this.m_voxAppShadow=null,this.m_mf=new l.default,this.m_scene=new o.default,this.pbrMaterialEnabled=!1,this.lambertMaterialEnabled=!0,this.m_geomDataParser=null,this.m_mesh=null,this.m_pos01=new r.default(-150,100,-170),this.m_pos02=new r.default(150,0,150)}setLoadedModuleFlag(t){this.m_mf.addFlag(t),this.m_mf.hasAllSysModules()?this.initLightScene():this.m_mf.hasEngineModule()&&this.initEngine(),this.m_mf.hasObjDataModule()&&this.initObjData(),this.m_scene.addMaterial(t)}buildMeshData(){if(null==this.m_mesh&&null!=this.m_rscene&&null!=this.m_geomDataParser){let t=this.m_geomDataParser,e=this.m_rscene.entityBlock.createMesh();e.setVS(t.getVS()),e.setUVS(t.getUVS()),e.setNVS(t.getNVS()),e.setIVS(t.getIVS()),this.m_mesh=e,this.m_scene.addDataMesh(e),this.m_scene.initCommonScene(1)}}setObjDataUrl(t){this.m_objDataUrl=t}initObjData(){if(null==this.m_voxAppObjData){let t=new AppObjData.Instance;t.load(this.m_objDataUrl,t=>{this.m_geomDataParser=t,this.buildMeshData(),this.m_scene.preloadData()}),this.m_voxAppObjData=t}}initEngine(){if(null==this.m_voxAppEngine){let t=new AppEngine.Instance,e=new AppBase.Instance,i=AppEngine.RendererDevice;this.m_voxAppEngine=t,this.m_voxAppBase=e;let s=new a.default;s.setPolygonOffsetEanbled(!1),s.setAttriAlpha(!1),s.setAttriAntialias(!0),s.setCamProject(45,30,9e3),s.setCamPosition(1e3,1e3,1e3),t.initialize(!1,s),i.SetWebBodyColor("black"),this.m_rscene=t.getRendererScene(),e.initialize(this.m_rscene),t.setSyncLookEnabled(!0),h(t),this.m_scene.initialize(e,this.m_rscene),this.buildMeshData()}}initLightScene(){if(null==this.m_voxAppEngine&&this.initEngine(),null==this.m_materialCtx){let t=new n.MaterialContextParam;t.shaderLibVersion="v101",t.pointLightsTotal=1,t.directionLightsTotal=2,t.spotLightsTotal=0,t.loadAllShaderCode=!0,t.shaderCodeBinary=!0,t.pbrMaterialEnabled=this.pbrMaterialEnabled,t.lambertMaterialEnabled=this.lambertMaterialEnabled,t.shaderFileNickname=!0,t.vsmFboIndex=0,t.vsmEnabled=!0,this.m_materialCtx=this.m_voxAppBase.createMaterialContext(),this.m_materialCtx.addShaderLibListener(this),this.initEnvLight(),this.buildLightModule(t),this.buildShadowModule(t),this.m_materialCtx.initialize(this.m_rscene,t),this.m_scene.setMaterialContext(this.m_materialCtx),this.m_voxAppEngine.setMaterialContext(this.m_materialCtx)}}shaderLibLoadComplete(t,e){if(this.lambertMaterialEnabled){let t=this.m_materialCtx.envLightModule;t.setAmbientColorRGB3f(3,3,3),t.setEnvAmbientLightAreaOffset(-500,-500),t.setEnvAmbientLightAreaSize(1e3,1e3),t.setEnvAmbientMap(this.m_materialCtx.getTextureByUrl("static/assets/brn_03.jpg"))}this.m_scene.initCommonScene(2)}buildShadowModule(t){if(this.m_mf.hasShadowModule()){this.m_voxAppShadow=new AppShadow.Instance;let e=this.m_voxAppShadow.createVSMShadow(t.vsmFboIndex);e.setCameraPosition(new r.default(1,800,1)),e.setCameraNear(10),e.setCameraFar(3e3),e.setMapSize(512,512),e.setCameraViewSize(4e3,4e3),e.setShadowRadius(2),e.setShadowBias(-5e-4),e.initialize(this.m_rscene,[0],3e3),e.setShadowIntensity(.8),e.setColorIntensity(.3),this.m_materialCtx.vsmModule=e}}initEnvLight(){if(this.m_mf.hasEnvLightModule()){let t=new AppEnvLightModule.Instance,e=t.createEnvLightModule(this.m_rscene);e.initialize(),e.setFogColorRGB3f(0,.8,.1),this.m_materialCtx.envLightModule=e}}buildLightModule(t){if(this.m_mf.hasLightModule()){let e=new AppLightModule.Instance,i=e.createLightModule(this.m_rscene);for(let s=0;s<t.pointLightsTotal;++s)i.appendPointLight();for(let s=0;s<t.directionLightsTotal;++s)i.appendDirectionLight();for(let s=0;s<t.spotLightsTotal;++s)i.appendSpotLight();return this.initLightModuleData(i),this.m_materialCtx.lightModule=i,i}return null}initLightModuleData(t){let e=t.getPointLightAt(0);null!=e&&(e.position.setXYZ(0,190,0),e.color.setRGB3f(0,2.2,0),e.attenuationFactor1=1e-5,e.attenuationFactor2=5e-5);let i=t.getSpotLightAt(0);null!=i&&(i.position.setXYZ(0,30,0),i.direction.setXYZ(0,-1,0),i.color.setRGB3f(0,40.2,0),i.attenuationFactor1=1e-6,i.attenuationFactor2=1e-6,i.angleDegree=30);let s=t.getDirectionLightAt(0);null!=s&&(s.color.setRGB3f(2,0,0),s.direction.setXYZ(-1,-1,0),s=t.getDirectionLightAt(1),null!=s&&(s.color.setRGB3f(0,0,2),s.direction.setXYZ(1,1,0))),t.update()}}e.default=d},"1eb2":function(t,e,i){"use strict";if("undefined"!==typeof window){var s=window.document.currentScript,a=i("8875");s=a(),"currentScript"in document||Object.defineProperty(document,"currentScript",{get:a});var r=s&&s.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);r&&(i.p=r[1])}},"2be0":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class s{constructor(){this.uuid="BinaryLoader"}async load(t,e,i=""){const s=new FileReader;s.onload=t=>{e.loaded(s.result,this.uuid)};const a=new XMLHttpRequest;a.open("GET",t,!0),""!=i&&a.setRequestHeader("Range",i),a.responseType="blob",a.onload=t=>{a.status<=206?s.readAsArrayBuffer(a.response):e.loadError(a.status,this.uuid)},a.onerror=t=>{e.loadError(a.status,this.uuid)},a.send(null)}}e.default=s},"2e85":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class s{constructor(){this.m_flag=0}static Initialize(){let t=s,e=s;e.SYS_MODULE_LOADED=t.AppEnvLight|t.AppLight|t.AppShadow}reset(){this.m_flag=0}addFlag(t){this.m_flag|=t}getFlag(){return this.m_flag}hasEngineModule(){return(s.ENGINE_LOADED&this.m_flag)==s.ENGINE_LOADED}hasAllSysModules(){return(s.SYS_MODULE_LOADED&this.m_flag)==s.SYS_MODULE_LOADED}hasEnvLightModule(){return(s.AppEnvLight&this.m_flag)==s.AppEnvLight}hasLightModule(){return(s.AppLight&this.m_flag)==s.AppLight}hasShadowModule(){return(s.AppShadow&this.m_flag)==s.AppShadow}hasObjDataModule(){return(s.AppObjData&this.m_flag)==s.AppObjData}isObjDataModule(t){return t==s.AppObjData}isLambert(t){return t==s.AppLambert}isPBR(t){return t==s.AppPBR}}s.AppEngine=1,s.AppBase=2,s.AppEnvLight=4,s.AppLight=8,s.AppShadow=16,s.AppObjData=32,s.AppLambert=64,s.AppPBR=128,s.ENGINE_LOADED=3,s.SYS_MODULE_LOADED=31,e.default=s},3930:function(t,e,i){"use strict";var s=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const a=s(i("6e01"));class r{constructor(t=1,e=1,i=1,s=1){this.r=1,this.g=1,this.b=1,this.a=1,this.r=t,this.g=e,this.b=i,this.a=s}setRGB3Bytes(t,e,i){this.r=t/255,this.g=e/255,this.b=i/255}setRGB3f(t,e,i){this.r=t,this.g=e,this.b=i}setRGBUint24(t){this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(255&t)/255}getRGBUint24(){return(Math.round(255*this.r)<<16)+(Math.round(255*this.g)<<8)+Math.round(255*this.b)}setRGBA4f(t,e,i,s){this.r=t,this.g=e,this.b=i,this.a=s}copyFrom(t){this.r=t.r,this.g=t.g,this.b=t.b,this.a=t.a}copyFromRGB(t){this.r=t.r,this.g=t.g,this.b=t.b}scaleBy(t){this.r*=t,this.g*=t,this.b*=t}inverseRGB(){this.r=1-this.r,this.g=1-this.g,this.b=1-this.b}randomRGB(t=1,e=0){this.r=Math.random()*t,this.g=Math.random()*t,this.b=Math.random()*t,this.r+=e,this.g+=e,this.b+=e}normalizeRandom(t=1,e=0){this.r=Math.random(),this.g=Math.random(),this.b=Math.random();let i=Math.sqrt(this.r*this.r+this.g*this.g+this.b*this.b);i>a.default.MATH_MIN_POSITIVE&&(this.r=t*this.r/i,this.g=t*this.g/i,this.b=t*this.b/i),this.r+=e,this.g+=e,this.b+=e}normalize(t){void 0==t&&(t=1);let e=Math.sqrt(this.r*this.r+this.g*this.g+this.b*this.b);e>a.default.MATH_MIN_POSITIVE&&(this.r=t*this.r/e,this.g=t*this.g/e,this.b=t*this.b/e)}getCSSDecRGBAColor(){let t=Math.floor(255*this.r),e=Math.floor(255*this.g),i=Math.floor(255*this.b),s=this.a;return"rgba("+t+","+e+","+i+","+s+")"}getCSSHeXRGBColor(){let t="#",e=Math.floor(255*this.r);return t+=e<15?"0"+e.toString(16):""+e.toString(16),e=Math.floor(255*this.g),t+=e<15?"0"+e.toString(16):""+e.toString(16),e=Math.floor(255*this.b),t+=e<15?"0"+e.toString(16):""+e.toString(16),t}toString(){return"[Color4(r="+this.r+", g="+this.g+",b="+this.b+",a="+this.a+")]"}}e.default=r},"3bda":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const s=i("a567");class a{static SetDebugEnabled(t){a.s_debugEanbled=t}static SetXY(t,e){a.s_leftX=t,a.s_topY=e}static SetTextBgColor(t){a.s_textBGColor=s.RGBColorUtil.uint24RGBToCSSHeXRGBColor(t),null!=a.s_infoDiv&&(a.s_infoDiv.style.backgroundColor=this.s_textBGColor)}static SetTextColor(t){a.s_textColor=s.RGBColorUtil.uint24RGBToCSSHeXRGBColor(t),null!=a.s_infoDiv&&(a.s_infoDiv.style.color=this.s_textColor)}static SetTextBgEnabled(t){if(this.s_textBgEnabled=t,null!=a.s_infoDiv){let t=a.s_infoDiv;a.s_textBgEnabled?t.style.backgroundColor=this.s_textBGColor:t.style.backgroundColor=""}}static ShowLog(t){a.s_debugEanbled&&(a.s_logStr.length>0?a.s_logStr+="<br/>"+t:a.s_logStr=t,a.UpdateDivText())}static GetLog(){return a.s_logStr}static ShowLogOnce(t){a.s_debugEanbled&&(a.s_logStr=t,a.UpdateDivText())}static ClearLog(t=""){a.s_debugEanbled&&(a.s_logStr=t,a.UpdateDivText())}static UpdateDivText(){if(a.s_debugEanbled)if(null!=a.s_infoDiv)a.s_infoDiv.innerHTML=a.s_logStr;else{let t=document.createElement("div");t.style.color="";let e=t;e.width=128,e.height=64,a.s_textBgEnabled?e.style.backgroundColor=this.s_textBGColor:e.style.backgroundColor="",e.style.color=this.s_textColor,e.style.left=a.s_leftX+"px",e.style.top=a.s_topY+"px",e.style.zIndex="9999",e.style.position="absolute",document.body.appendChild(e),a.s_infoDiv=e,e.innerHTML=a.s_logStr}}static ShowAtTop(){null!=a.s_infoDiv&&(a.s_infoDiv.parentElement.removeChild(a.s_infoDiv),document.body.appendChild(a.s_infoDiv))}}a.s_logStr="",a.s_infoDiv=null,a.s_debugEanbled=!1,a.s_textBGColor="#aa0033",a.s_textColor="#000000",a.s_textBgEnabled=!0,a.s_leftX=0,a.s_topY=128,e.default=a},4301:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class s{constructor(){this.pointLightsTotal=1,this.directionLightsTotal=1,this.spotLightsTotal=0,this.vsmFboIndex=0,this.vsmEnabled=!0,this.loadAllShaderCode=!1,this.shaderCodeBinary=!1,this.shaderLibVersion="",this.shaderFileNickname=!1,this.lambertMaterialEnabled=!0,this.pbrMaterialEnabled=!0,this.buildBinaryFile=!1}}e.MaterialContextParam=s},5216:function(t,e,i){"use strict";var s;Object.defineProperty(e,"__esModule",{value:!0}),function(t){t[t["ENV_LIGHT_PARAM"]=0]="ENV_LIGHT_PARAM",t[t["ENV_AMBIENT_LIGHT"]=1]="ENV_AMBIENT_LIGHT",t[t["FOG"]=2]="FOG",t[t["FOG_EXP2"]=3]="FOG_EXP2",t[t["VSM_SHADOW"]=4]="VSM_SHADOW",t[t["GLOBAL_LIGHT"]=5]="GLOBAL_LIGHT"}(s||(s={})),e.MaterialPipeType=s},"5ff4":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const s=i("a7f1");document.title="Rendering & Art";let a=new s.AppLoader;a.initialize()},"6e01":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class s{static Clamp(t,e,i){return Math.max(Math.min(t,i),e)}static IsPowerOf2(t){return 0==(t&t-1)}static CalcCeilPowerOfTwo(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}static CalcNearestCeilPow2(t){return Math.pow(2,Math.round(Math.log(t)/Math.LN2))}static CalcFloorCeilPow2(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}static DegreeToRadian(t){return s.MATH_PI_OVER_180*t}static Log2(t){return Math.log(t)/Math.LN2}static GetMaxMipMapLevel(t,e){return Math.round(s.Log2(Math.max(t,e))+1)}static SafeACos(t){return t<=-1?s.MATH_PI:t>=1?0:Math.acos(t)}static GetNearestCeilPow2(t){let e=1;while(e<t)e<<=1;return e}static GetMinRadian(t,e){return e%=s.MATH_2PI,t%=s.MATH_2PI,e<t?(e=s.MATH_2PI-t+e,e>s.MATH_PI?e-s.MATH_2PI:e):e>t?(t=s.MATH_2PI-e+t,t>s.MATH_PI?s.MATH_2PI-t:-t):0}static GetMinDegree(t,e){let i=0;return e>=270&&t<90?i=(e-(t+360))%180:e<=90&&t>=270?i=(e+360-t)%180:(i=e-t,i>180?(i-=360,i%=360):i<-180&&(i+=360,i%=360)),i}static GetDegreeByXY(t,e){if(Math.abs(t)<1e-5)return e>=0?270:90;let i=180*Math.atan(e/t)/Math.PI;return t>=0?i:180+i}static GetRadianByXY(t,e){if(Math.abs(t)<s.MATH_MIN_POSITIVE)return e>=0?s.MATH_1PER2PI:s.MATH_3PER2PI;let i=Math.atan(e/t);return t>=0?i:s.MATH_PI+i}static GetRadianByCos(t,e,i){var a=Math.acos(t);return e>=0?a:s.MATH_PI+a}}s.MATH_MIN_POSITIVE=1e-5,s.MATH_MAX_NEGATIVE=-1e-5,s.MATH_MAX_POSITIVE=268435454,s.MATH_MIN_NEGATIVE=-268435454,s.MATH_1_OVER_255=1/255,s.MATH_PI=Math.PI,s.MATH_2PI=2*s.MATH_PI,s.MATH_3PER2PI=1.5*s.MATH_PI,s.MATH_1PER2PI=.5*s.MATH_PI,s.MATH_1_OVER_PI=1/s.MATH_PI,s.MATH_1_OVER_360=1/360,s.MATH_1_OVER_180=1/180,s.MATH_180_OVER_PI=180/s.MATH_PI,s.MATH_PI_OVER_180=s.MATH_PI/180,s.MATH_LN2=.6931471805599453,e.default=s},8875:function(t,e,i){var s,a,r;(function(i,n){a=[],s=n,r="function"===typeof s?s.apply(e,a):s,void 0===r||(t.exports=r)})("undefined"!==typeof self&&self,(function(){function t(){var e=Object.getOwnPropertyDescriptor(document,"currentScript");if(!e&&"currentScript"in document&&document.currentScript)return document.currentScript;if(e&&e.get!==t&&document.currentScript)return document.currentScript;try{throw new Error}catch(c){var i,s,a,r=/.*at [^(]*\((.*):(.+):(.+)\)$/gi,n=/@([^@]*):(\d+):(\d+)\s*$/gi,l=r.exec(c.stack)||n.exec(c.stack),o=l&&l[1]||!1,h=l&&l[2]||!1,d=document.location.href.replace(document.location.hash,""),u=document.getElementsByTagName("script");o===d&&(i=document.documentElement.outerHTML,s=new RegExp("(?:[^\\n]+?\\n){0,"+(h-2)+"}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*","i"),a=i.replace(s,"$1").trim());for(var p=0;p<u.length;p++){if("interactive"===u[p].readyState)return u[p];if(u[p].src===o)return u[p];if(o===d&&u[p].innerHTML&&u[p].innerHTML.trim()===a)return u[p]}return null}}return t}))},"8e17":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const s=180/Math.PI,a=1e-7;class r{constructor(t=0,e=0,i=0,s=1){this.x=0,this.y=0,this.z=0,this.w=0,this.x=t,this.y=e,this.z=i,this.w=s}clone(){return new r(this.x,this.y,this.z,this.w)}setTo(t,e,i,s=1){this.x=t,this.y=e,this.z=i,this.w=s}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}setXYZ(t,e,i){this.x=t,this.y=e,this.z=i}copyFrom(t){this.x=t.x,this.y=t.y,this.z=t.z}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}multBy(t){this.x*=t.x,this.y*=t.y,this.z*=t.z}normalize(){let t=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);t>a&&(this.x/=t,this.y/=t,this.z/=t)}normalizeTo(t){let e=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);e>a?(t.x=this.x/e,t.y=this.y/e,t.z=this.z/e):(t.x=this.x,t.y=this.y,t.z=this.z)}scaleVector(t){this.x*=t.x,this.y*=t.y,this.z*=t.z}scaleBy(t){this.x*=t,this.y*=t,this.z*=t}negate(){this.x=-this.x,this.y=-this.y,this.z=-this.z}equalsXYZ(t){return Math.abs(this.x-t.x)<a&&Math.abs(this.y-t.y)<a&&Math.abs(this.z-t.z)<a}equalsAll(t){return Math.abs(this.x-t.x)<a&&Math.abs(this.y-t.y)<a&&Math.abs(this.z-t.z)<a&&Math.abs(this.w-t.w)<a}project(){let t=1/this.w;this.x*=t,this.y*=t,this.z*=t}getLength(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}getLengthSquared(){return this.x*this.x+this.y*this.y+this.z*this.z}addBy(t){this.x+=t.x,this.y+=t.y,this.z+=t.z}subtractBy(t){this.x-=t.x,this.y-=t.y,this.z-=t.z}subtract(t){return new r(this.x-t.x,this.y-t.y,this.z-t.z)}add(t){return new r(this.x+t.x,this.y+t.y,this.z+t.z)}crossProduct(t){return new r(this.y*t.z-this.z*t.y,this.z*t.x-this.x*t.z,this.x*t.y-this.y*t.x)}crossBy(t){let e=this.y*t.z-this.z*t.y,i=this.z*t.x-this.x*t.z,s=this.x*t.y-this.y*t.x;this.x=e,this.y=i,this.z=s}reflectBy(t){let e=2*(this.x*t.x+this.y*t.y+this.z*t.z);this.x=this.x-e*t.x,this.y=this.y-e*t.y,this.z=this.z-e*t.z}scaleVecTo(t,e){this.x=t.x*e,this.y=t.y*e,this.z=t.z*e}subVecsTo(t,e){this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z}addVecsTo(t,e){this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z}crossVecsTo(t,e){this.x=t.y*e.z-t.z*e.y,this.y=t.z*e.x-t.x*e.z,this.z=t.x*e.y-t.y*e.x}toString(){return"Vector3D("+this.x+this.y+this.z+")"}static Cross(t,e,i){i.x=t.y*e.z-t.z*e.y,i.y=t.z*e.x-t.x*e.z,i.z=t.x*e.y-t.y*e.x}static CrossSubtract(t,e,i,s,a){n.x=e.x-t.x,n.y=e.y-t.y,n.z=e.z-t.z,l.x=s.x-i.x,l.y=s.y-i.y,l.z=s.z-i.z,t=n,i=l,a.x=t.y*i.z-t.z*i.y,a.y=t.z*i.x-t.x*i.z,a.z=t.x*i.y-t.y*i.x}static Subtract(t,e,i){i.x=t.x-e.x,i.y=t.y-e.y,i.z=t.z-e.z}static DistanceSquared(t,e){return n.x=t.x-e.x,n.y=t.y-e.y,n.z=t.z-e.z,n.getLengthSquared()}static DistanceXYZ(t,e,i,s,a,r){return n.x=t-s,n.y=e-a,n.z=i-r,n.getLength()}static Distance(t,e){return n.x=t.x-e.x,n.y=t.y-e.y,n.z=t.z-e.z,n.getLength()}static AngleBetween(t,e){return t.normalizeTo(n),e.normalizeTo(l),Math.acos(n.dot(l))*s}static RadianBetween(t,e){return t.normalizeTo(n),e.normalizeTo(l),Math.acos(n.dot(l))}static RadianBetween2(t,e){let i=t.getLengthSquared(),s=e.getLengthSquared();return n.x=t.x-e.x,n.y=t.y-e.y,n.z=t.z-e.z,Math.acos((i+s-n.getLengthSquared())/(2*Math.sqrt(i)*Math.sqrt(s)))}static Reflect(t,e,i){let s=2*(t.x*e.x+t.y*e.y+t.z*e.z);i.x=t.x-s*e.x,i.y=t.y-s*e.y,i.z=t.z-s*e.z}}r.X_AXIS=new r(1,0,0),r.Y_AXIS=new r(0,1,0),r.Z_AXIS=new r(0,0,1),r.ZERO=new r(0,0,0),r.ONE=new r(1,1,1);const n=new r,l=new r;e.default=r},"973c":function(t,e,i){"use strict";var s=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const a=s(i("3930")),r=s(i("2be0")),n=i("f3a2");class l{constructor(){this.m_appLambert=null,this.m_preLoadMaps=!0}preload(){}active(t,e){this.m_materialCtx=e,null==this.m_appLambert&&(this.m_rscene=t,this.m_appLambert=new AppLambert.Instance,this.m_appLambert.initialize(this.m_rscene)),this.preloadMap(this.m_materialCtx,"box",!0,!1,!0)}loaded(t,e){}loadError(t,e){}loadSpecularData(t){let e="static/bytes/spe.mdf";t&&(e="static/bytes/speBrn.bin");let i=new r.default;i.load(e,this)}preloadMap(t,e,i=!0,s=!0,a=!1,r=!1){this.m_preLoadMaps&&(this.m_preLoadMaps=!1,t.getTextureByUrl("static/assets/disp/"+e+"_COLOR.png"),t.getTextureByUrl("static/assets/disp/"+e+"_SPEC.png"),i&&t.getTextureByUrl("static/assets/disp/"+e+"_NRM.png"),r&&t.getTextureByUrl("static/assets/disp/"+e+"_OCC.png"),this.m_preLoadMaps=!1)}useMaps(t,e,i=!0,s=!0,a=!1,r=!1){t.diffuseMap=this.m_materialCtx.getTextureByUrl("static/assets/disp/"+e+"_COLOR.png"),t.specularMap=this.m_materialCtx.getTextureByUrl("static/assets/disp/"+e+"_SPEC.png"),i&&(t.normalMap=this.m_materialCtx.getTextureByUrl("static/assets/disp/"+e+"_NRM.png")),r&&(t.aoMap=this.m_materialCtx.getTextureByUrl("static/assets/disp/"+e+"_OCC.png")),s&&null!=t.vertUniform&&(t.vertUniform.displacementMap=this.m_materialCtx.getTextureByUrl("static/assets/disp/"+e+"_DISP.png")),t.shadowReceiveEnabled=a}getUUID(){return n.ShaderCodeUUID.Lambert}createMaterial(){let t=this.m_appLambert.createMaterial(),e=t.getDecorator(),i=e.vertUniform;t.setMaterialPipeline(this.m_materialCtx.pipeline),e.envAmbientLightEnabled=!0,i.uvTransformEnabled=!0,this.useMaps(e,"box",!0,!1,!0),e.fogEnabled=!0,e.lightEnabled=!0,e.initialize(),i.setDisplacementParams(3,0),e.setSpecularIntensity(64);let s=new a.default;return s.normalizeRandom(1.1),e.setSpecularColor(s),t}isEnabled(){return null!=this.m_materialCtx&&this.m_materialCtx.hasShaderCodeObjectWithUUID(this.getUUID())}}e.default=l},"97e3":function(t,e,i){"use strict";var s=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const a=i("5216"),r=s(i("a176"));class n{constructor(){this.m_appBase=null,this.m_appLambert=null,this.m_materialBuilder=new r.default,this.m_defaultEntities=[],this.m_entities=[],this.m_meshs=[],this.m_moduleFlag=0,this.m_timeoutId=-1}preloadData(){this.m_materialBuilder.preloadData()}addDataMesh(t){let e=this.m_rscene;this.m_meshs.push(t);let i=this.m_materialBuilder.createDefaultMaterial();i.initializeByCodeBuf(!0),t.setVtxBufRenderData(i),t.initialize();let s=400,a=this.m_rscene.entityBlock.createEntity();a.setMesh(t),a.setMaterial(i),a.setScaleXYZ(s,s,s),e.addEntity(a),this.m_defaultEntities.push(a)}initialize(t,e){this.m_appBase=t,this.m_rscene=e,this.m_rscene.setClearRGBColor3f(.1,.4,.2),this.m_materialBuilder.initialize(this.m_appBase,this.m_rscene)}setMaterialContext(t){this.m_materialCtx=t,this.m_materialBuilder.setMaterialContext(this.m_materialCtx),this.initEnvBox()}addMaterial(t){t=this.m_materialBuilder.addMaterial(t),t>0&&(this.m_moduleFlag=t)}update(){this.m_timeoutId>-1&&clearTimeout(this.m_timeoutId);let t=this.m_rscene;for(let e=0;e<this.m_entities.length;++e)if(this.m_entities[e].isInRendererProcess()){const i=this.m_defaultEntities[e];t.removeEntity(i),this.m_defaultEntities.splice(e,1),this.m_entities.splice(e,1)}this.m_defaultEntities.length>0&&(this.m_timeoutId=setTimeout(this.update.bind(this),20))}initCommonScene(t=0){let e=this.m_materialBuilder.isEnabledWithFlag(this.m_moduleFlag)&&this.m_meshs.length>0;if(!e)return;let i=this.m_rscene;if(this.m_defaultEntities.length>0){this.update();let t=this.m_materialBuilder.createMaterialWithFlag(this.m_moduleFlag),e=400,s=i.entityBlock.createEntity();s.setMaterial(t),s.copyMeshFrom(this.m_defaultEntities[0]),s.setScaleXYZ(e,e,e),i.addEntity(s),this.m_entities.push(s),e=700;let a=i.entityBlock.createEntity();a.setMaterial(t),a.copyMeshFrom(i.entityBlock.unitBox),a.setScaleXYZ(e,.05*e,e),a.setXYZ(0,-200,0),i.addEntity(a),this.m_entities.push(a)}}initEnvBox(){let t=this.m_rscene.getRenderProxy().renderingState,e=this.m_rscene,i=this.m_appBase.createDefaultMaterial();i.pipeTypes=[a.MaterialPipeType.FOG_EXP2],i.setMaterialPipeline(this.m_materialCtx.pipeline),i.setTextureList([this.m_materialCtx.getTextureByUrl("static/assets/box.jpg")]),i.initializeByCodeBuf(!1);let s=3e3,r=e.entityBlock.createEntity();r.setRenderState(t.FRONT_CULLFACE_NORMAL_STATE),r.setMaterial(i),r.copyMeshFrom(e.entityBlock.unitBox),r.setScaleXYZ(s,s,s),e.addEntity(r,1)}}e.default=n},a176:function(t,e,i){"use strict";var s=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const a=s(i("3930")),r=s(i("2e85")),n=s(i("973c")),l=s(i("bf1e")),o=s(i("3bda"));class h{constructor(){this.m_appBase=null,this.m_builderMap=new Map}initialize(t,e){this.m_appBase=t,this.m_rscene=e}setMaterialContext(t){this.m_materialCtx=t;for(const[e,i]of this.m_builderMap)i.active(this.m_rscene,this.m_materialCtx)}preloadData(){}createDefaultMaterial(){let t=this.m_appBase.createDefaultMaterial();return t.normalEnabled=!0,t.setTextureList([this.m_rscene.textureBlock.createRGBATex2D(32,32,new a.default(.2,.8,.4))]),t}addMaterial(t){let e=this.m_builderMap.get(t);if(null==e){switch(t){case r.default.AppLambert:e=new n.default,e.preload();break;case r.default.AppPBR:e=new l.default,e.preload();break;default:break}if(null!=e)return null!=this.m_materialCtx&&e.active(this.m_rscene,this.m_materialCtx),this.m_builderMap.set(t,e),t}return 0}isEnabledWithFlag(t){let e=this.m_builderMap.get(t);return o.default.ShowLog(t+",isEnabled()): "+(null!=e)+", "+(null!=e&&e.isEnabled())),null!=e&&e.isEnabled()}hasMaterialWithFlag(t){return this.m_builderMap.has(t)}createMaterialWithFlag(t){let e=this.m_builderMap.get(t);return null!=e?e.createMaterial():null}}e.default=h},a567:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class s{static uint24RGBToCSSHeXRGBColor(t){let e=Math.round(t).toString(16);if(e.length>6)e=e.slice(-6);else if(e.length<6){let t=6-e.length;const i="000000";e=i.slice(0,t)+e}return"#"+e}}e.RGBColorUtil=s},a7f1:function(t,e,i){"use strict";var s=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const a=s(i("2e85")),r=s(i("0dae"));let n="",l="static/publish/build/",o=location.href+"";o.indexOf("artvily.")>0&&(n="http://www.artvily.com:9090/",l=n+"static/publish/apple/");class h{constructor(){this.viewer=new r.default}loadedWithIndex(t){this.viewer.setLoadedModuleFlag(t)}}class d{constructor(){this.m_appShell=new h,this.m_mf=new a.default,this.m_initOther=!0,this.m_bodyDiv=null,this.m_infoDiv=null}initialize(){let t=location.href+"";t=this.parseUrl(t);let e=n+"static/assets/obj/apple_01.obj";this.m_appShell.viewer.setObjDataUrl(e),this.initUI(),a.default.Initialize(),this.loadEngine()}loadEngine(){let t,e=l+"AppEngine.package.js",i=l+"AppBase.package.js";t=new u(a.default.AppEngine,e,this),t=new u(a.default.AppBase,i,this);let s=l+"AppObjData.package.js";t=new u(a.default.AppObjData,s,this)}loadAppFunctions(){let t,e=l+"AppEnvLightModule.package.js",i=l+"AppLightModule.package.js";t=new u(a.default.AppEnvLight,e,this),t=new u(a.default.AppLight,i,this);let s=l+"AppShadow.package.js";t=new u(a.default.AppShadow,s,this);let r=this.m_appShell.viewer,n=!0;if(n){let e=l+"AppPBR.package.js";t=new u(a.default.AppPBR,e,this),r.lambertMaterialEnabled=!1,r.pbrMaterialEnabled=!0}else{let e=l+"AppLambert.package.js";t=new u(a.default.AppLambert,e,this),r.lambertMaterialEnabled=!0,r.pbrMaterialEnabled=!1}}showLoadInfo(t,e=0){e==a.default.AppEngine&&this.showLoadProgressInfo(t)}parseUrl(t){let e=t.split("?");if(e.length<2||e[0].indexOf("renderCase")<1)return"";let i=e[1];return e=i.split("&"),e.length<2||e[0].indexOf("sample")<0?"":(i=e[1],e=i.split("="),e.length<2||"demo"!=e[0]?"":"static/voxweb3d/demos/"+e[1]+".js")}initUI(){document.body.style.background="#000000",this.m_bodyDiv=document.createElement("div"),this.m_bodyDiv.style.width="100vw",this.m_bodyDiv.style.height="100vh",this.elementCenter(this.m_bodyDiv),document.body.appendChild(this.m_bodyDiv),document.body.style.margin="0",this.showInfo("init...")}showInfo(t){null==this.m_infoDiv&&(this.m_infoDiv=document.createElement("div"),this.m_infoDiv.style.backgroundColor="rgba(255,255,255,0.1)",this.m_infoDiv.style.color="#00ee00",this.elementCenter(this.m_infoDiv),this.m_bodyDiv.appendChild(this.m_infoDiv)),this.m_infoDiv.innerHTML=t}showLoadProgressInfo(t){let e="loading "+Math.round(100*t)+"% ";this.showInfo(e)}showLoadStart(){this.showInfo("loading 0%")}showLoaded(){this.showInfo("100%")}loadFinish(t=0){t==a.default.AppEngine&&null!=this.m_bodyDiv&&(this.m_bodyDiv.parentElement.removeChild(this.m_bodyDiv),this.m_bodyDiv=null),this.m_appShell.loadedWithIndex(t),this.m_mf.addFlag(t),this.m_initOther&&this.m_mf.hasEngineModule()&&(this.m_initOther=!1,this.loadAppFunctions())}elementCenter(t,e="50%",i="50%",s="absolute"){t.style.textAlign="center",t.style.display="flex",t.style.flexDirection="column",t.style.justifyContent="center",t.style.alignItems="center"}}e.AppLoader=d;class u{constructor(t,e,i){this.index=0,this.index=t,this.load(e,i)}load(t,e){let i=new XMLHttpRequest;i.open("GET",t,!0),i.onerror=function(t){},i.onprogress=t=>{let s=0;if(t.total>0||t.lengthComputable)s=Math.min(1,t.loaded/t.total);else{let e=parseInt(i.getResponseHeader("content-length"));e>0&&(e*=4,s=Math.min(1,t.loaded/e))}null!=e&&e.showLoadInfo(s,this.index)},i.onload=()=>{let t=document.createElement("script");t.onerror=t=>{},t.innerHTML=i.response,document.head.appendChild(t),null!=e&&e.loadFinish(this.index)},i.send(null)}}e.default=d},bf1e:function(t,e,i){"use strict";var s=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const a=s(i("2be0")),r=i("f3a2");class n{constructor(){this.m_appPBR=null,this.m_preLoadMaps=!0,this.m_loadSpecularData=!0,this.m_specEnvMapbuffer=null,this.m_specEnvMap=null}preload(){this.loadSpecularData(!0)}active(t,e){this.m_materialCtx=e,null==this.m_appPBR&&(this.m_rscene=t,this.m_appPBR=new AppPBR.Instance,this.m_appPBR.initialize(this.m_rscene)),this.preloadMap(this.m_materialCtx,"box",!0,!1,!0)}loaded(t,e){this.m_specEnvMapbuffer=t,null!=this.m_appPBR&&(this.m_specEnvMap=this.m_appPBR.createSpecularTex(this.m_specEnvMapbuffer,!0,this.m_specEnvMap))}loadError(t,e){}loadSpecularData(t){if(this.m_loadSpecularData){let e="static/bytes/spe.mdf";t&&(e="static/bytes/spb.bin");let i=new a.default;i.load(e,this),this.m_loadSpecularData=!1}}preloadMap(t,e,i=!0,s=!0,a=!1,r=!1){if(this.m_preLoadMaps){let t="rust_coarse_01";t="medieval_blocks_02",t="rough_plaster_broken",this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/"+t+"_diff_1k.jpg"),this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/"+t+"_nor_1k.jpg"),this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/"+t+"_arm_1k.jpg"),this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/"+t+"_disp_1k.jpg"),this.m_preLoadMaps=!1}}useMaps(t,e,i=!0,s=!0,a=!1,r=!1){t.diffuseMap=this.m_materialCtx.getTextureByUrl("static/assets/disp/"+e+"_COLOR.png"),t.specularMap=this.m_materialCtx.getTextureByUrl("static/assets/disp/"+e+"_SPEC.png"),i&&(t.normalMap=this.m_materialCtx.getTextureByUrl("static/assets/disp/"+e+"_NRM.png")),r&&(t.aoMap=this.m_materialCtx.getTextureByUrl("static/assets/disp/"+e+"_OCC.png")),s&&null!=t.vertUniform&&(t.vertUniform.displacementMap=this.m_materialCtx.getTextureByUrl("static/assets/disp/"+e+"_DISP.png")),t.shadowReceiveEnabled=a}getUUID(){return r.ShaderCodeUUID.PBR}isEnabled(){let t=null!=this.m_materialCtx&&this.m_materialCtx.hasShaderCodeObjectWithUUID(this.getUUID());return t}createMaterial(){null==this.m_specEnvMap&&(this.m_specEnvMap=this.m_appPBR.createSpecularTex(this.m_specEnvMapbuffer,!0,this.m_specEnvMap));let t=null,e=null,i=null,s=!0,a="rust_coarse_01";a="medieval_blocks_02",a="rough_plaster_broken",t=this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/"+a+"_diff_1k.jpg"),e=this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/"+a+"_nor_1k.jpg"),i=this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/"+a+"_arm_1k.jpg");let r=null;r=this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/"+a+"_disp_1k.jpg");let n=null;n=r;let l={diffuseMap:t,normalMap:e,armMap:i,displacementMap:r,parallaxMap:n,metallic:1,roughness:.4,ao:1};l.specularEnvMap=this.m_specEnvMap,l.shadowReceiveEnabled=!0,l.fogEnabled=s;let o=this.m_appPBR.createMaterial(),h=o.getDecorator(),d=h.vertUniform;return o.setMaterialPipeline(this.m_materialCtx.pipeline),h.scatterEnabled=!1,h.woolEnabled=!0,h.absorbEnabled=!1,h.normalNoiseEnabled=!1,h.setMetallic(l.metallic),h.setRoughness(l.roughness),h.setAO(l.ao),h.shadowReceiveEnabled=l.shadowReceiveEnabled,h.fogEnabled=l.fogEnabled,h.armMap=l.armMap,h.specularEnvMap=l.specularEnvMap,h.diffuseMap=l.diffuseMap,h.normalMap=l.normalMap,h.aoMap=l.aoMap,d.displacementMap=l.displacementMap,h.parallaxMap=l.parallaxMap,h.initialize(),d.initialize(),d.setDisplacementParams(.02,-.01),h.setAlbedoColor(1,1,1),h.setScatterIntensity(8),h.setParallaxParams(1,10,5,.02),h.setSideIntensity(8),o}}e.default=n},c497:function(t,e,i){"use strict";var s=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const a=s(i("8e17"));class r{constructor(t=null){this.m_matrix4AllocateSize=8192,this.m_mainDiv=null,this.m_renderContextAttri={depth:!0,premultipliedAlpha:!1,alpha:!0,antialias:!1,stencil:!1,preserveDrawingBuffer:!0,powerPreference:"high-performance"},this.m_tickUpdateTime=20,this.m_polygonOffsetEnabled=!1,this.m_ditherEnabled=!1,this.autoSyncRenderBufferAndWindowSize=!0,this.maxWebGLVersion=2,this.cameraPerspectiveEnabled=!0,this.evtFlowEnabled=!1,this.camProjParam=new a.default(45,10,5e3),this.camPosition=new a.default(2e3,2e3,2e3),this.camLookAtPos=new a.default(0,0,0),this.camUpDirect=new a.default(0,1,0),this.batchEnabled=!0,this.processFixedState=!1,this.m_mainDiv=t,this.autoSyncRenderBufferAndWindowSize=null==t}setTickUpdateTime(t){t=Math.round(t),this.m_tickUpdateTime=t>5?t:5}getTickUpdateTime(){return this.m_tickUpdateTime}setPolygonOffsetEanbled(t){this.m_polygonOffsetEnabled=t}getPolygonOffsetEanbled(){return this.m_polygonOffsetEnabled}setDitherEanbled(t){this.m_ditherEnabled=t}getDitherEanbled(){return this.m_ditherEnabled}getDiv(){return this.m_mainDiv}getRenderContextAttri(){return this.m_renderContextAttri}setAttriDepth(t){this.m_renderContextAttri.depth=t}setAttriStencil(t){this.m_renderContextAttri.stencil=t}setAttriAlpha(t){this.m_renderContextAttri.alpha=t}setAttriPremultipliedAlpha(t){this.m_renderContextAttri.premultipliedAlpha=t}setAttriAntialias(t){this.m_renderContextAttri.antialias=t}setAttripreserveDrawingBuffer(t){this.m_renderContextAttri.preserveDrawingBuffer=t}setAttriHightPowerPreference(t){this.m_renderContextAttri.powerPreference=t?"high-performance":"default"}setMatrix4AllocateSize(t){t<1024&&(t=1024),this.m_matrix4AllocateSize=t}getMatrix4AllocateSize(){return this.m_matrix4AllocateSize}setCamProject(t,e,i){if(e>=i)throw Error("Error Camera cear > far !!!");this.camProjParam.setTo(t,e,i)}setCamPosition(t,e,i){this.camPosition.setTo(t,e,i)}setCamLookAtPos(t,e,i){this.camLookAtPos.setTo(t,e,i)}setCamUpDirect(t,e,i){this.camUpDirect.setTo(t,e,i)}}e.default=r},f3a2:function(t,e,i){"use strict";var s;Object.defineProperty(e,"__esModule",{value:!0}),function(t){t["None"]="",t["Default"]="pbr",t["Lambert"]="lambert",t["PBR"]="pbr"}(s||(s={})),e.ShaderCodeUUID=s},fae3:function(t,e,i){"use strict";i.r(e);i("1eb2");var s=i("5ff4");for(var a in s)["default"].indexOf(a)<0&&function(t){i.d(e,t,(function(){return s[t]}))}(a)}})}));