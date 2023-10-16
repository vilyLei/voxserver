(function(t,e){"object"===typeof exports&&"object"===typeof module?module.exports=e():"function"===typeof define&&define.amd?define([],e):"object"===typeof exports?exports["AppShadow"]=e():t["AppShadow"]=e()})("undefined"!==typeof self?self:this,(function(){return function(t){var e={};function s(a){if(e[a])return e[a].exports;var r=e[a]={i:a,l:!1,exports:{}};return t[a].call(r.exports,r,r.exports,s),r.l=!0,r.exports}return s.m=t,s.c=e,s.d=function(t,e,a){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(s.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)s.d(a,r,function(e){return t[e]}.bind(null,r));return a},s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s="fae3")}({"05f8":function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class a{constructor(t){this.A=-1,this.B=null,this.C=!1,this.D=null,this.D=t,this.A=a.n++}getUid(){return this.A}update(){null!=this.B&&this.C&&(this.C=!1,this.B.uProbe.update())}getGlobalUinform(){return null!=this.B?this.B.cloneUniform():null}destroy(){null!=this.B&&this.B.destroy(),this.B=null,this.D=null}}a.n=0,e.MaterialPipeBase=a},"084e":function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class a{constructor(t,e=!0){this.D=null,this.uProbe=null,this.uniform=null,this.D=t,e&&(this.uProbe=t.createShaderUniformProbe(),this.uniform=t.createShaderGlobalUniform())}getNames(){return[]}cloneUniform(){return this.D.cloneShaderGlobalUniform(this.uniform)}buildData(){this.D.updateGlobalUinformDataFromProbe(this.uniform,this.uProbe,this.getNames()),this.uProbe.update()}destroy(){this.uProbe=null,this.uniform=null,this.D=null}}e.GlobalUniformParamBase=a},"1eb2":function(t,e,s){"use strict";if("undefined"!==typeof window){var a=window.document.currentScript,r=s("8875");a=r(),"currentScript"in document||Object.defineProperty(document,"currentScript",{get:r});var i=a&&a.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);i&&(s.p=i[1])}},5216:function(t,e,s){"use strict";var a;Object.defineProperty(e,"__esModule",{value:!0}),function(t){t[t["ENV_LIGHT_PARAM"]=0]="ENV_LIGHT_PARAM",t[t["ENV_AMBIENT_LIGHT"]=1]="ENV_AMBIENT_LIGHT",t[t["FOG"]=2]="FOG",t[t["FOG_EXP2"]=3]="FOG_EXP2",t[t["VSM_SHADOW"]=4]="VSM_SHADOW",t[t["GLOBAL_LIGHT"]=5]="GLOBAL_LIGHT"}(a||(a={})),e.MaterialPipeType=a},"5d74":function(t,e,s){"use strict";var a=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const r=a(s("b3bd"));class i{constructor(t,e,s){this.E=!0,this.F=new Float32Array([1,1,1,4]),this.vertColorEnabled=!1,this.premultiplyAlpha=!1,this.fogEnabled=!1,this.G=null,this.E=t,this.H="OccBlur",this.H+=t?"H":"V",this.G=e,this.F[3]=s}setShadowRadius(t){this.F[3]=t}buildBufParams(){}buildTextureList(t){t.add2DMap(this.G,"",!1)}buildShader(t){this.E&&t.addDefine("HORIZONAL_PASS","1"),t.addDefine("SAMPLE_RATE","0.25"),t.addDefine("HALF_SAMPLE_RATE","0.125"),t.uniform.useViewPort(!1,!0),t.addFragUniform("vec4","u_params",0),t.useVertSpaceMats(!1,!1,!1),t.addFragMainCode("\nconst float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)\nconst float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)\n\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\n\nconst float ShiftRight8 = 1. / 256.;\n\nvec4 packDepthToRGBA( const in float v ) {\n    vec4 r = vec4( fract( v * PackFactors ), v );\n    r.yzw -= r.xyz * ShiftRight8; // tidy overflow\n    return r * PackUpscale;\n}\n\nfloat unpackRGBAToDepth( const in vec4 v ) {\n    return dot( v, UnpackFactors );\n}\n\nvec4 pack2HalfToRGBA( vec2 v ) {\n    vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ));\n    return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w);\n}\nvec2 unpackRGBATo2Half( vec4 v ) {\n    return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );\n}\nvoid main() {\n\n    float mean = 0.0;\n    float squared_mean = 0.0;\n    \n    vec2 resolution = u_viewParam.zw;\n    \n    float radius = u_params[3];\n    vec4 c4 = VOX_Texture2D( u_sampler0, ( gl_FragCoord.xy ) / resolution );    \n    // This seems totally useless but it's a crazy work around for a Adreno compiler bug\n    float depth = unpackRGBAToDepth( c4 );\n\n    for ( float i = -1.0; i < 1.0 ; i += SAMPLE_RATE) {\n\n        #ifdef HORIZONAL_PASS\n\n            vec2 distribution = unpackRGBATo2Half( VOX_Texture2D( u_sampler0, ( gl_FragCoord.xy + vec2( i, 0.0 ) * radius ) / resolution ) );\n            mean += distribution.x;\n            squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;\n\n        #else\n\n            float depth = unpackRGBAToDepth( VOX_Texture2D( u_sampler0, ( gl_FragCoord.xy + vec2( 0.0, i ) * radius ) / resolution ) );\n            mean += depth;\n            squared_mean += depth * depth;\n\n        #endif\n\n    }\n\n    mean = mean * HALF_SAMPLE_RATE;\n    squared_mean = squared_mean * HALF_SAMPLE_RATE;\n\n    float std_dev = sqrt( squared_mean - mean * mean );\n\n    FragColor0 = pack2HalfToRGBA( vec2( mean, std_dev ) );\n\n}\n"),t.addVertMainCode("\nvoid main() {\n    gl_Position =  vec4(a_vs,1.0);\n}\n")}createUniformData(){let t=new r.default;return t.uniformNameList=["u_params"],t.dataList=[this.F],t}getUniqueName(){return this.H}}e.OccBlurDecorator=i},"84e4":function(t,e,s){"use strict";var a=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const r=a(s("e439"));e.ShadowVSMModule=r.default;class i{constructor(){}createVSMShadow(t){return new r.default(t)}}e.Instance=i},8875:function(t,e,s){var a,r,i;(function(s,n){r=[],a=n,i="function"===typeof a?a.apply(e,r):a,void 0===i||(t.exports=i)})("undefined"!==typeof self&&self,(function(){function t(){var e=Object.getOwnPropertyDescriptor(document,"currentScript");if(!e&&"currentScript"in document&&document.currentScript)return document.currentScript;if(e&&e.get!==t&&document.currentScript)return document.currentScript;try{throw new Error}catch(d){var s,a,r,i=/.*at [^(]*\((.*):(.+):(.+)\)$/gi,n=/@([^@]*):(\d+):(\d+)\s*$/gi,o=i.exec(d.stack)||n.exec(d.stack),h=o&&o[1]||!1,u=o&&o[2]||!1,c=document.location.href.replace(document.location.hash,""),l=document.getElementsByTagName("script");h===c&&(s=document.documentElement.outerHTML,a=new RegExp("(?:[^\\n]+?\\n){0,"+(u-2)+"}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*","i"),r=s.replace(a,"$1").trim());for(var m=0;m<l.length;m++){if("interactive"===l[m].readyState)return l[m];if(l[m].src===h)return l[m];if(h===c&&l[m].innerHTML&&l[m].innerHTML.trim()===r)return l[m]}return null}}return t}))},"8e17":function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const a=180/Math.PI,r=1e-5;class i{constructor(t=0,e=0,s=0,a=1){this.x=0,this.y=0,this.z=0,this.w=0,this.x=t,this.y=e,this.z=s,this.w=a}clone(){return new i(this.x,this.y,this.z,this.w)}setTo(t,e,s,a=1){this.x=t,this.y=e,this.z=s,this.w=a}setXYZ(t,e,s){this.x=t,this.y=e,this.z=s}copyFrom(t){this.x=t.x,this.y=t.y,this.z=t.z}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}multBy(t){this.x*=t.x,this.y*=t.y,this.z*=t.z}normalize(){let t=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);t>r&&(this.x/=t,this.y/=t,this.z/=t)}normalizeTo(t){let e=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);e>r?(t.x=this.x/e,t.y=this.y/e,t.z=this.z/e):(t.x=this.x,t.y=this.y,t.z=this.z)}scaleVector(t){this.x*=t.x,this.y*=t.y,this.z*=t.z}scaleBy(t){this.x*=t,this.y*=t,this.z*=t}negate(){this.x=-this.x,this.y=-this.y,this.z=-this.z}equalsXYZ(t){return Math.abs(this.x-t.x)<r&&Math.abs(this.y-t.y)<r&&Math.abs(this.z-t.z)<r}equalsAll(t){return Math.abs(this.x-t.x)<r&&Math.abs(this.y-t.y)<r&&Math.abs(this.z-t.z)<r&&Math.abs(this.w-t.w)<r}project(){let t=1/this.w;this.x*=t,this.y*=t,this.z*=t}getLength(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}getLengthSquared(){return this.x*this.x+this.y*this.y+this.z*this.z}addBy(t){this.x+=t.x,this.y+=t.y,this.z+=t.z}subtractBy(t){this.x-=t.x,this.y-=t.y,this.z-=t.z}subtract(t){return new i(this.x-t.x,this.y-t.y,this.z-t.z)}add(t){return new i(this.x+t.x,this.y+t.y,this.z+t.z)}crossProduct(t){return new i(this.y*t.z-this.z*t.y,this.z*t.x-this.x*t.z,this.x*t.y-this.y*t.x)}crossBy(t){let e=this.y*t.z-this.z*t.y,s=this.z*t.x-this.x*t.z,a=this.x*t.y-this.y*t.x;this.x=e,this.y=s,this.z=a}reflectBy(t){let e=2*(this.x*t.x+this.y*t.y+this.z*t.z);this.x=this.x-e*t.x,this.y=this.y-e*t.y,this.z=this.z-e*t.z}scaleVecTo(t,e){this.x=t.x*e,this.y=t.y*e,this.z=t.z*e}subVecsTo(t,e){this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z}addVecsTo(t,e){this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z}crossVecsTo(t,e){this.x=t.y*e.z-t.z*e.y,this.y=t.z*e.x-t.x*e.z,this.z=t.x*e.y-t.y*e.x}toString(){return"Vector3D("+this.x+this.y+this.z+")"}static Cross(t,e,s){s.x=t.y*e.z-t.z*e.y,s.y=t.z*e.x-t.x*e.z,s.z=t.x*e.y-t.y*e.x}static CrossSubtract(t,e,s,a,r){i.__vtor3Stv0.x=e.x-t.x,i.__vtor3Stv0.y=e.y-t.y,i.__vtor3Stv0.z=e.z-t.z,i.__vtor3Stv1.x=a.x-s.x,i.__vtor3Stv1.y=a.y-s.y,i.__vtor3Stv1.z=a.z-s.z,t=i.__vtor3Stv0,s=i.__vtor3Stv1,r.x=t.y*s.z-t.z*s.y,r.y=t.z*s.x-t.x*s.z,r.z=t.x*s.y-t.y*s.x}static Subtract(t,e,s){s.x=t.x-e.x,s.y=t.y-e.y,s.z=t.z-e.z}static DistanceSquared(t,e){return i.__vtor3Stv0.x=t.x-e.x,i.__vtor3Stv0.y=t.y-e.y,i.__vtor3Stv0.z=t.z-e.z,i.__vtor3Stv0.getLengthSquared()}static DistanceXYZ(t,e,s,a,r,n){return i.__vtor3Stv0.x=t-a,i.__vtor3Stv0.y=e-r,i.__vtor3Stv0.z=s-n,i.__vtor3Stv0.getLength()}static Distance(t,e){return i.__vtor3Stv0.x=t.x-e.x,i.__vtor3Stv0.y=t.y-e.y,i.__vtor3Stv0.z=t.z-e.z,i.__vtor3Stv0.getLength()}static AngleBetween(t,e){return t.normalizeTo(i.__vtor3Stv0),e.normalizeTo(i.__vtor3Stv1),Math.acos(i.__vtor3Stv0.dot(i.__vtor3Stv1))*a}static RadianBetween(t,e){return t.normalizeTo(i.__vtor3Stv0),e.normalizeTo(i.__vtor3Stv1),Math.acos(i.__vtor3Stv0.dot(i.__vtor3Stv1))}static RadianBetween2(t,e){let s=t.getLengthSquared(),a=e.getLengthSquared();return i.__vtor3Stv0.x=t.x-e.x,i.__vtor3Stv0.y=t.y-e.y,i.__vtor3Stv0.z=t.z-e.z,Math.acos((s+a-i.__vtor3Stv0.getLengthSquared())/(2*Math.sqrt(s)*Math.sqrt(a)))}static Reflect(t,e,s){let a=2*(t.x*e.x+t.y*e.y+t.z*e.z);s.x=t.x-a*e.x,s.y=t.y-a*e.y,s.z=t.z-a*e.z}}i.X_AXIS=new i(1,0,0),i.Y_AXIS=new i(0,1,0),i.Z_AXIS=new i(0,0,1),i.__vtor3Stv0=new i,i.__vtor3Stv1=new i,i.ZERO=new i,e.default=i},a9f4:function(t,e,s){"use strict";var a;Object.defineProperty(e,"__esModule",{value:!0}),function(t){t[t["Default"]=1]="Default",t[t["VSM"]=1]="VSM"}(a||(a={})),e.ShadowMode=a},ab73:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class a{constructor(){this.type="vec4",this.data=null,this.name="u_vsmParams",this.arrayLength=3}}class r{constructor(){this.type="vec4",this.data=new Float32Array([.1,.1,.1,1,1,.1,600,3500,.3,0,.9,5e-4,0,0,800,800,-500,-500,1e3,1e3]),this.name="u_envLightParams",this.arrayLength=5}}class i{constructor(){this.type="mat4",this.data=null,this.name="u_shadowMat",this.arrayLength=0}}class n{constructor(){this.type="vec4",this.data=null,this.name="u_stageParam",this.arrayLength=0}}class o{constructor(){this.type="vec4",this.data=null,this.name="u_viewParam",this.arrayLength=0}}class h{constructor(){this.type="vec4",this.data=null,this.name="u_frustumParam",this.arrayLength=0}}class u{constructor(){this.type="vec4",this.data=null,this.name="u_cameraPosition",this.arrayLength=0}}class c{constructor(){this.type="vec4",this.positionName="u_lightPositions",this.colorName="u_lightColors"}}class l{}l.LocalTransformMatUNS="u_objMat",l.CameraViewMatUNS="u_viewMat",l.CameraProjectiveMatUNS="u_projMat",l.FrustumParam=new h,l.CameraPosParam=new u,l.StageParam=new n,l.ViewportParam=new o,l.ShadowMatrix=new i,l.ShadowVSMParams=new a,l.GlobalLight=new c,l.EnvLightParams=new r,e.default=l},b3bd:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class a{constructor(){this.uns="",this.types=null,this.uniformSize=0,this.uniformNameList=null,this.locations=null,this.dataList=null,this.calcModels=null,this.always=!0,this.next=null}getDataRefFromUniformName(t){if(null!=this.uniformNameList){let e=this.uniformNameList,s=e.length;for(let a=0;a<s;++a)if(t==e[a])return this.dataList[a]}return null}setDataRefFromUniformName(t,e){if(null!=this.uniformNameList){let s=this.uniformNameList,a=s.length;for(let r=0;r<a;++r)if(t==s[r]){this.dataList[r]=e;break}}}copyDataFromProbe(t){this.types=[];for(let e=0;e<t.uniformsTotal;++e)this.types.push(t.uniformTypes[e]);this.uniformSize=t.uniformsTotal}destroy(){let t=0,e=this.dataList.length;for(;t<e;++t)this.dataList[t]=null;if(null!=this.calcModels)for(e=this.calcModels.length,t=0;t<e;++t)this.calcModels[t].destroy(),this.calcModels[t]=null;this.dataList=null,this.types=null,this.locations=null,this.calcModels=null}}e.default=a},b498:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const a=s("5216"),r=s("05f8"),i=s("ff8e"),n=s("a9f4"),o=s("d846");class h extends r.MaterialPipeBase{constructor(){super(...arguments),this.I=null,this.J=null,this.K=null,this.L=null,this.M=-1}setShadowMap(t){this.L=t}resetPipe(){}getTextures(t,e,s){return null!=this.L?(null==e&&(e=[]),e.push(this.L),t.uniform.addShadowMap(n.ShadowMode.VSM),e):null}useShaderPipe(t,e){null!=this.B&&(t.addDefine("VOX_USE_SHADOW","1"),t.addVarying("vec4","v_shadowPos"),this.B.use(t),t.addShaderObject(o.VSMShaderCode))}getPipeTypes(){return[a.MaterialPipeType.VSM_SHADOW]}getPipeKey(t){switch(t){case a.MaterialPipeType.VSM_SHADOW:return"["+t+"]";default:break}return""}initialize(t,e){if(null==this.B){this.I=t,this.J=e,this.J.identity(),this.J.setScaleXYZ(.5,.5,.5),this.J.setTranslationXYZ(.5,.5,.5);let s=new i.GlobalVSMShadowUniformParam(this.D);this.K=s.buildUniformData(this.I.getLocalFS32()),this.B=s}}updateShadowCamera(t){this.M!=t.version&&(this.M=t.version,this.I.copyFrom(t.getVPMatrix()),this.I.append(this.J),this.setDirec(t.getNV()),this.C=!0)}setShadowParam(t,e,s){this.K[0]=t,this.K[1]=e,this.K[2]=s,this.C=!0}setShadowIntensity(t){this.K[3]=t,this.C=!0}setColorIntensity(t){this.K[6]=t,this.C=!0}setShadowRadius(t){this.K[2]=t,this.C=!0}setShadowBias(t){this.K[0]=t,this.C=!0}setShadowSize(t,e){this.K[4]=t,this.K[5]=e,this.C=!0}setDirec(t){this.K[8]=-t.x,this.K[9]=-t.y,this.K[10]=-t.z,this.C=!0}destroy(){this.L=null,this.I=null,this.K=null,this.J=null,super.destroy()}}e.default=h},ca07:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class a{constructor(){this.vertColorEnabled=!1,this.premultiplyAlpha=!1,this.fogEnabled=!1,this.H="DepthWrite"}buildBufParams(){}buildTextureList(t){}buildShader(t){t.addVarying("vec4","v_pos"),t.addFragMainCode("\nconst float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)\nconst float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)\n\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\n\nconst float ShiftRight8 = 1. / 256.;\n\nvec4 packDepthToRGBA( const in float v ) {\n\tvec4 r = vec4( fract( v * PackFactors ), v );\n\tr.yzw -= r.xyz * ShiftRight8; // tidy overflow\n\treturn r * PackUpscale;\n}\nvoid main() {\n    // Higher precision equivalent of the gl_FragCoord.z. This assumes depthRange has been left to its default values.\n    float fragCoordZ = 0.5 * v_pos[2] / v_pos[3] + 0.5;\n    FragColor0 = packDepthToRGBA( fragCoordZ );\n}\n"),t.addVertMainCode("\nvoid main() {\n    worldPosition = u_objMat * vec4(a_vs, 1.0);\n    viewPosition = u_viewMat * worldPosition;\n    gl_Position =  u_projMat * viewPosition;\n    v_pos = gl_Position;\n}\n")}createUniformData(){return null}getUniqueName(){return this.H}}e.DepthWriteDecorator=a},d846:function(t,e,s){"use strict";s.r(e),s.d(e,"VSMShaderCode",(function(){return i}));var a="vec4 pack2HalfToRGBA( vec2 v ) {\r\n\tvec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ));\r\n\treturn vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w);\r\n}\r\nvec2 unpackRGBATo2Half( vec4 v ) {\r\n\treturn vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );\r\n}\r\n\r\nvec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {\r\n\r\n    return unpackRGBATo2Half( VOX_Texture2D( shadow, uv ) );\r\n\r\n}\r\n#ifdef VOX_USE_SHADOW\r\nfloat VSMShadow (sampler2D shadow, vec2 uv, float compare ) {\r\n\r\n    float occlusion = 1.0;\r\n\r\n    vec2 distribution = texture2DDistribution( shadow, uv );\r\n\r\n    float hard_shadow = step( compare , distribution.x ); // Hard Shadow\r\n\r\n    if (hard_shadow != 1.0 ) {\r\n\r\n        float distance = compare - distribution.x ;\r\n        float variance = max( 0.0, distribution.y * distribution.y );\r\n        float softness_probability = variance / (variance + distance * distance ); // Chebeyshevs inequality\r\n        softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 ); // 0.3 reduces light bleed\r\n        occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );\r\n\r\n    }\r\n    return occlusion;\r\n\r\n}\r\nfloat getVSMShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\r\n\r\n    //float shadow = 1.0;\r\n    \r\n    shadowCoord.xyz /= shadowCoord.w;\r\n    shadowCoord.z += shadowBias;\r\n    \r\n    // if ( something && something ) breaks ATI OpenGL shader compiler\r\n    // if ( all( something, something ) ) using this instead\r\n\r\n    bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\r\n    bool inFrustum = all( inFrustumVec );\r\n\r\n    bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\r\n\r\n    bool frustumTest = all( frustumTestVec );\r\n\r\n    return frustumTest ? VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z ) : 1.0;\r\n    // if ( frustumTest ) {\r\n    //     shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );\r\n    // }\r\n    // return shadow;\r\n}\r\nfloat getVSMShadowFactor(in vec4 shadowPos) {\r\n    \r\n    float shadow = getVSMShadow( VOX_VSM_SHADOW_MAP, u_vsmParams[1].xy, u_vsmParams[0].x, u_vsmParams[0].z, shadowPos );\r\n    float shadowIntensity = 1.0 - u_vsmParams[0].w;\r\n    shadow = clamp(shadow, 0.0, 1.0) * (1.0 - shadowIntensity) + shadowIntensity;\r\n    float f = clamp(dot(worldNormal,u_vsmParams[2].xyz),0.001,1.0);\r\n    shadow = f > 0.0001 ? min(shadow,clamp(f, shadowIntensity,1.0)) : shadowIntensity;\r\n    f = u_vsmParams[1].z;\r\n    return shadow * (1.0 - f) + f;\r\n}\r\nvoid useVSMShadow(inout vec4 color) {\r\n    \r\n    float factor = getVSMShadowFactor(v_shadowPos);\r\n    color.xyz *= vec3(factor);\r\n}\r\n#endif";let r="\nvoid calcShadowPos(in vec4 wpos) {\n    v_shadowPos = u_shadowMat * wpos;\n}\n";const i={vert:"",vert_head:r,vert_body:"\n#ifdef VOX_USE_SHADOW\n    // if use real worldPosition , it maybe make shadow calculation error.\n    calcShadowPos( oWorldPosition );\n#endif\n",frag:"",frag_head:a,frag_body:"\n#ifdef VOX_USE_SHADOW\nuseVSMShadow( FragColor0 );\n#endif\n"}},e439:function(t,e,s){"use strict";var a=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const r=a(s("8e17")),i=s("5d74"),n=s("ca07"),o=a(s("b498"));class h{constructor(t){this.N=null,this.O=null,this.P=null,this.Q=null,this.R=null,this.S=null,this.T=null,this.U=new r.default(1,800,1),this.V=-5e-4,this.W=2,this.X=.8,this.Y=.1,this.Z=512,this.a=512,this.b=3e3,this.c=3e3,this.d=10,this.e=3e3,this.f=null,this.g=null,this.h=0,this.i=null,this.j=-1,this.k=-1,this.l=-1,this.m=120,this.force=!0,this.h=t}resetPipe(){}getTextures(t,e,s){return this.O.getTextures(t,e,s)}useShaderPipe(t,e){this.O.useShaderPipe(t,e)}getPipeTypes(){return this.O.getPipeTypes()}getPipeKey(t){return this.O.getPipeKey(t)}getGlobalUinform(){return this.O.getGlobalUinform()}initialize(t,e,s=120,a=!1){null==this.N&&(this.N=t,this.m=s,this.i=e.slice(0),this.initConfig(e,!1))}setMapSize(t,e){this.Z=t,this.a=e}setCameraPosition(t){this.U.copyFrom(t)}setCameraNear(t){this.d=t}setCameraFar(t){this.e=t}setCameraViewSize(t,e){this.b=t,this.c=e}setShadowRadius(t){this.W=t}setShadowBias(t){this.V=t}setShadowIntensity(t){this.X=t,null!=this.O&&this.O.setShadowIntensity(this.X)}setColorIntensity(t){this.Y=t,null!=this.O&&this.O.setColorIntensity(this.Y)}getShadowMap(){return this.f}getVSMData(){return this.O}getCamera(){return this.P}setRendererProcessIDList(t){null!=this.Q&&(this.i=t.slice(0),this.Q.setRProcessIDList(t))}initConfig(t,e=!1){let s=this.N,a=this.N.getRenderProxy().renderingState;this.O=new o.default(this.N.getRenderProxy().uniformContext),this.O.initialize(s.createMatrix4(),s.createMatrix4()),this.O.setShadowIntensity(this.X);let r=this.N.materialBlock.createSimpleMaterial(new n.DepthWriteDecorator);this.Q=this.N.createFBOInstance(),this.Q.asynFBOSizeWithViewport(),this.Q.setClearRGBAColor4f(1,1,1,1),this.Q.createFBOAt(this.h,this.Z,this.a,!0,!1,0),this.f=this.Q.setRenderToRGBATexture(null,0),this.Q.setRProcessIDList(t),this.Q.setGlobalRenderState(a.NORMAL_STATE),this.Q.setGlobalMaterial(r,!1,!1),this.R=this.N.createFBOInstance(),this.R.asynFBOSizeWithViewport(),this.R.setClearRGBAColor4f(1,1,1,1),this.R.createFBOAt(this.h,this.Z,this.a,!0,!1,0),this.g=this.R.setRenderToRGBATexture(null,0);let h=new i.OccBlurDecorator(!1,this.f,this.W),u=this.N.materialBlock.createSimpleMaterial(h),c=this.N.entityBlock.createEntity();c.copyMeshFrom(this.N.entityBlock.screenPlane),c.setMaterial(u),this.S=c,h=new i.OccBlurDecorator(!0,this.g,this.W),u=this.N.materialBlock.createSimpleMaterial(h);let l=this.N.entityBlock.createEntity();l.copyMeshFrom(this.N.entityBlock.screenPlane),l.setMaterial(u),this.T=l,this.P=this.N.createCamera(),this.O.setShadowMap(this.getShadowMap()),this.updateData()}updateData(){if(null!=this.P){let t=this.b,e=this.c;this.P.lookAtRH(this.U,r.default.ZERO,r.default.Z_AXIS),this.P.orthoRH(this.d,this.e,-.5*e,.5*e,-.5*t,.5*t),this.P.setViewXY(0,0),this.P.setViewSize(t,e),this.P.update()}null!=this.O&&(this.Q.resizeFBO(this.Z,this.a),this.R.resizeFBO(this.Z,this.a),this.O.updateShadowCamera(this.P),this.O.setShadowRadius(this.W),this.O.setShadowBias(this.V),this.O.setShadowSize(this.Z,this.a),this.O.update())}upate(){this.m=32,this.l=this.P.version,this.updateData()}getRendererProcessStatus(){let t=31;for(let e=0;e<this.i.length;++e)t+=t*this.N.getRenderProcessAt(e).getStatus();return t}run(){this.P.version!=this.l&&(this.l=this.P.version,this.O.updateShadowCamera(this.P),this.O.update());let t=this.force;if(t)this.buildShadow();else{if(this.j!=this.N.getRendererStatus()){let e=this.getRendererProcessStatus();this.k!=e&&(this.k=e,t=!0),this.j=this.N.getRendererStatus()}this.m>0&&(this.m%15==0&&(t=!0),this.m--),t&&this.buildShadow()}this.force=!1}buildShadow(){this.Q.useCamera(this.P,!1),this.Q.run(!0,!0,!0,!0),this.Q.useMainCamera(),this.R.setRenderToRGBATexture(this.g,0),this.R.runBegin(),this.R.drawEntity(this.S,!1,!0),this.R.runEnd(),this.R.setRenderToRGBATexture(this.f,0),this.R.runBegin(),this.R.drawEntity(this.T,!1,!0),this.R.runEnd(),this.R.setRenderToBackBuffer()}}e.ShadowVSMModule=h,e.default=h},fae3:function(t,e,s){"use strict";s.r(e);s("1eb2");var a=s("84e4");for(var r in a)["default"].indexOf(r)<0&&function(t){s.d(e,t,(function(){return a[t]}))}(r)},ff8e:function(t,e,s){"use strict";var a=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const r=a(s("ab73")),i=s("084e");class n extends i.GlobalUniformParamBase{getNames(){return[r.default.ShadowMatrix.name,r.default.ShadowVSMParams.name]}buildUniformData(t){let e=new Float32Array([-5e-4,0,4,.8,512,512,.1,0,1,1,1,0]);return this.uProbe.addMat4Data(t,1),this.uProbe.addVec4Data(e,r.default.ShadowVSMParams.arrayLength),this.buildData(),e}use(t,e=1){t.addFragUniformParam(r.default.ShadowVSMParams),t.addVertUniformParam(r.default.ShadowMatrix)}}e.GlobalVSMShadowUniformParam=n}})}));