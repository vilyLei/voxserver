(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VoxWebGPU"] = factory();
	else
		root["VoxWebGPU"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fae3");
/******/ })
/************************************************************************/
/******/ ({

/***/ "005f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class WGRUniform {
  constructor(ctx) {
    this.mUid = WGRUniform.sUid++;
    this.mCloned = false;
    this.mSubUfs = [];
    this.index = -1;
    this.layoutName = "";
    /**
     * bind group index
     */

    this.groupIndex = -1;
    this.mCtx = ctx;
    this.mWGC = ctx.getWGCtx();
  }

  getUid() {
    return this.mUid;
  }

  setValue(value, index = 0) {
    const v = this.versions[index];

    if (v.ver != value.version) {
      v.ver = value.version; // console.log("WGRUniform::setValue(), shared: ", v.shared, ', shdVarName: ',v.shdVarName);

      this.mWGC.buffer.updateUniformBuffer(this.buffers[index], value.data, this.ivs[index], value.byteOffset);
    }
  }

  isEnabled() {
    return this.buffers != null;
  }

  __$$updateSubUniforms() {
    const ufs = this.mSubUfs;

    if (ufs && this.buffers) {
      for (let i = 0, ln = ufs.length; i < ln; i++) {
        this.copySelfTo(ufs[i]);
      }
    }
  }

  copySelfTo(u) {
    u.index = this.index;
    u.layoutName = this.layoutName;
    u.buffers = this.buffers;
    u.bindGroup = this.bindGroup;
    u.groupIndex = this.groupIndex;
    u.versions = this.versions.slice(0); // console.log("copySelfTo(), u.versions: ", u.versions);
  }

  clone() {
    const u = new WGRUniform(this.mCtx);
    u.index = this.index;
    u.layoutName = this.layoutName;
    u.buffers = this.buffers;
    u.bindGroup = this.bindGroup;
    u.groupIndex = this.groupIndex;
    u.mCloned = true;
    this.mSubUfs.push(u);
    return u;
  }

  cloneMany(total) {
    const ls = new Array(total);

    for (let i = 0; i < total; ++i) {
      ls[i] = this.clone(); // ls[i].uid = 1000 + i;
    }

    return ls;
  }

  destroy() {
    if (this.mCtx) {
      this.mSubUfs = [];
      this.uvfs = null;

      if (this.mCloned) {
        this.index = -1;
        this.groupIndex = -1;
        this.buffers = null;
        this.bindGroup = null;
      } else {
        this.mCtx.removeUniform(this);
      }

      this.mCtx = null;
    }
  }

  __$$destroy() {
    this.groupIndex = -1;
    this.index = -1;
    this.mWGC = null;
    this.buffers = null;
  }

}

WGRUniform.sUid = 0;
exports.WGRUniform = WGRUniform;

/***/ }),

/***/ "0142":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGRendererPassImpl_1 = __webpack_require__("3e2f");

exports.WGRPassParam = WGRendererPassImpl_1.WGRPassParam;
exports.WGRendererPassImpl = WGRendererPassImpl_1.WGRendererPassImpl;

const WGRPColorAttachment_1 = __webpack_require__("8e9d");

const WGRPDepthStencilAttachment_1 = __webpack_require__("1d61");

const WGTextureDataDescriptor_1 = __webpack_require__("37b8");

class WGRendererPass {
  constructor(wgCtx, drawing = true) {
    this.mDrawing = true;
    this.name = "";
    this.passColors = [new WGRPColorAttachment_1.WGRPColorAttachment()];
    this.separate = false;
    this.enabled = true; // console.log("WGRendererPass::constructor(), drawing: ", drawing);

    this.mDrawing = drawing;

    if (wgCtx) {
      this.initialize(wgCtx);
    }
  }

  isDrawing() {
    return this.mDrawing;
  }

  get depthTexture() {
    return this.mDepthTexture;
  }

  initialize(wgCtx) {
    this.mWGCtx = wgCtx;
  }

  getPassParams() {
    return this.mParam;
  }

  build(params) {
    console.log("WGRendererPass::build() mDrawing: ", this.mDrawing, "params: ", params);

    if (this.mDrawing) {
      params.multisampleEnabled = params.sampleCount && params.sampleCount > 1;
      this.mParam = params;

      if (this.prevPass) {
        this.mDepthTexture = this.prevPass.mDepthTexture;
        this.colorView = this.prevPass.colorView;
      } else {
        this.createRenderPassTexture(params);
      }
    }
  }

  updateColorAttachmentView(colorAtt, t, onlyViewChange = false) {
    if (!colorAtt.view) {
      if (!onlyViewChange) {
        colorAtt.setParam(t);
      }

      if (!colorAtt.view) {
        let td = WGTextureDataDescriptor_1.texDescriptorFilter(t.texture);

        if (td) {
          const rttData = td.rttTexture;

          if (rttData) {
            const ctx = this.mWGCtx;

            if (rttData.texture === undefined) {
              const rtt = ctx.texture.createColorRTTTexture({
                format: td.format
              });
              rttData.texture = rtt;
              rttData.textureView = rtt.createView(); // colorAtt.gpuTexture = rtt;

              colorAtt.textureFormat = rtt.format;
              colorAtt.view = rttData.textureView;
              colorAtt.view.label = td.uuid;
              console.log("动态创建一个 color rtt gpu texture instance, colorAtt.textureFormat: ", colorAtt.textureFormat); // console.log("动态创建一个 color rtt gpu texture instance, view: ", colorAtt.view);

              console.log("动态创建一个 color rtt gpu texture instance, td: ", td);
            } else {
              colorAtt.view = rttData.textureView;
            } // console.log("updateColorAttachmentView(), rttData.textureView: ", rttData.textureView);


            colorAtt.texture = t.texture;
          }
        }
      }
    }
  }

  createRenderPassTexture(param) {
    const ctx = this.mWGCtx;
    let separate = this.separate;
    let sampleCount = 1;
    const multisampled = param.multisampleEnabled === true;
    param.multisampleEnabled = multisampled;

    if (multisampled) {
      sampleCount = param.sampleCount;
    }

    let size = [ctx.canvasWidth, ctx.canvasHeight];
    let pcs = this.passColors;
    let colorAtt = pcs[0]; // console.log("createRenderPassTexture(), this.separate: ", this.separate);
    // console.log("createRenderPassTexture(), sampleCount: ", sampleCount, ", multisampled: ", multisampled);

    if (separate) {
      let ls = param.colorAttachments;
      this.mColorAttachments = ls;

      if (ls && ls.length > 0) {
        for (let i = 1; i < ls.length; ++i) {
          pcs.push(new WGRPColorAttachment_1.WGRPColorAttachment());
        }

        for (let i = 0; i < ls.length; ++i) {// this.updateColorAttachmentView(colorAtt, ls[i]);
        }

        this.clearColor.setColor(pcs[0].clearValue); // console.log("xxx xxx pcs: ", pcs);
      } else {
        const texture = ctx.texture.createRTTTexture({
          size,
          sampleCount,
          format: ctx.presentationFormat,
          usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
        this.colorView = texture.createView();
        colorAtt.view = this.colorView;
        colorAtt.viewTexture = texture;
      }
    } else {
      if (multisampled) {
        const texture = ctx.texture.createRTTTexture({
          size,
          sampleCount,
          format: ctx.presentationFormat,
          usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
        this.colorView = texture.createView();
        colorAtt.view = this.colorView;
        colorAtt.viewTexture = texture;
      }
    }

    if (!(param.depthTestEnabled === false) || param.depthStencilAttachment) {
      let dsp = param.depthStencilAttachment;
      let dsAtt = this.passDepthStencil;
      if (!dsAtt) dsAtt = new WGRPDepthStencilAttachment_1.WGRPDepthStencilAttachment().setParam(dsp);
      this.passDepthStencil = dsAtt;

      if (!dsAtt.view) {
        size = [ctx.canvasWidth, ctx.canvasHeight];
        let format = "depth24plus";
        if (param.depthFormat !== undefined) format = param.depthFormat;
        const depthTexDesc = {
          size,
          sampleCount,
          format,
          usage: GPUTextureUsage.RENDER_ATTACHMENT
        };
        const depthTexture = ctx.texture.createRTTTexture(depthTexDesc);
        this.mDepthTexture = depthTexture;
        dsAtt.view = depthTexture.createView();
        dsAtt.viewTexture = depthTexture;
      }
    } // console.log("depthTexDesc: ", depthTexDesc, ", depthTexture: ", depthTexture);

  }

  runBegin() {
    const ctx = this.mWGCtx;
    const prev = this.prevPass;

    if (prev) {
      this.enabled = this.enabled && prev.enabled;
    }

    if (this.enabled && ctx.enabled) {
      const device = ctx.device;
      const param = this.mParam;
      this.commandEncoder = device.createCommandEncoder();
      const cmdEncoder = this.commandEncoder;

      if (this.mDrawing) {
        let pcs = this.passColors;
        const colorT = pcs[0];
        let dsAtt = this.passDepthStencil;
        const multisampleEnabled = param.multisampleEnabled;

        if (prev) {
          const prevColorAtt = prev.passColors[0];
          const prevDSAtt = prev.passDepthStencil;
          colorT.loadOp = "load";

          if (multisampleEnabled) {
            colorT.view = prevColorAtt.view;
            colorT.resolveTarget = prevColorAtt.resolveTarget;
          } else {
            colorT.view = prevColorAtt.view;
          }

          if (prevDSAtt) {
            if (!dsAtt) {
              dsAtt = new WGRPDepthStencilAttachment_1.WGRPDepthStencilAttachment();
              dsAtt.depthLoadOp = "load";
              this.passDepthStencil = dsAtt;
            }

            dsAtt = this.passDepthStencil;
            dsAtt.view = prevDSAtt.view;
          }
        } else {
          if (pcs.length == 1) {
            pcs[0].clearValue.copyFrom(this.clearColor);
          }

          if (this.separate) {
            // console.log("run a rpass, this.separate: ", this.separate,", multisampleEnabled: ", multisampleEnabled);
            const cts = this.mColorAttachments;

            if (cts !== undefined) {
              for (let i = 0; i < pcs.length; ++i) {
                const ct = pcs[i];
                const p = ct.param;
                const t = cts[i];

                if (!ct.view || p !== t || ct.texture !== t.texture) {
                  if (t.texture !== undefined) {
                    ct.view = null;
                    this.updateColorAttachmentView(ct, t, p === t);

                    if (i < 1 && p !== t) {
                      this.clearColor.setColor(ct.clearValue);
                    }
                  }
                }
              }
            }
          } else {
            if (multisampleEnabled) {
              colorT.resolveTarget = colorT.resolveTargetTexture ? colorT.resolveTarget : ctx.createCurrentView();
            } else {
              colorT.view = colorT.viewTexture ? colorT.view : ctx.createCurrentView();
            }
          }
        }

        let colorAttachments = this.passColors; // for test
        // if (this.separate) {
        // 	// const ca = colorAttachments[0];
        // 	let ca = colorAttachments[0];
        // 	console.log("xxx xxx ca0: ", ca);
        // 	ca = colorAttachments[1];
        // 	console.log("xxx xxx ca1: ", ca);
        // }

        let renderPassDescriptor;

        if (dsAtt) {
          renderPassDescriptor = {
            colorAttachments: colorAttachments,
            depthStencilAttachment: dsAtt
          };
        } else {
          renderPassDescriptor = {
            colorAttachments: colorAttachments
          };
        }

        this.passEncoder = cmdEncoder.beginRenderPass(renderPassDescriptor);
      } else {
        this.compPassEncoder = cmdEncoder.beginComputePass();
      }
    }
  }

  runEnd() {
    const ctx = this.mWGCtx;

    if (this.enabled && ctx.enabled) {
      if (this.mDrawing) {
        this.passEncoder.end();
      } else {
        this.compPassEncoder.end();
      }

      return this.commandEncoder.finish();
    }

    return null;
  }

  destroy() {
    this.mColorAttachments = null;
  }

}

exports.WGRendererPass = WGRendererPass;

/***/ }),

/***/ "0884":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "1d61":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CommonUtils_1 = __webpack_require__("fe0b");

class WGRPDepthStencilAttachment {
  constructor() {
    this.depthClearValue = 1.0;
    this.depthLoadOp = "clear";
    this.depthStoreOp = "store";
  }

  setParam(param) {
    if (param) {
      CommonUtils_1.copyFromObjectValueWithKey(param, this);
    }

    return this;
  }

}

exports.WGRPDepthStencilAttachment = WGRPDepthStencilAttachment;

/***/ }),

/***/ "1eb2":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__("8875")
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* unused harmony default export */ var _unused_webpack_default_export = (null);


/***/ }),

/***/ "222c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const BitConst_1 = __importDefault(__webpack_require__("626c"));

class WGRUnitState {
  constructor() {
    this.flag = 0;
    this.rf = 0;
    this.__$rever = 0;
  }

  set __$rendering(v) {
    if (v) {
      this.rf = BitConst_1.default.addBit(this.rf, BitConst_1.default.ONE_0);
    } else {
      this.rf = BitConst_1.default.removeBit(this.rf, BitConst_1.default.ONE_0);
    }
  }

  get __$rendering() {
    return BitConst_1.default.containsBit(this.rf, BitConst_1.default.ONE_0);
  }

  set __$inRenderer(v) {
    if (v) {
      this.rf = BitConst_1.default.addBit(this.rf, BitConst_1.default.ONE_1);
    } else {
      this.rf = BitConst_1.default.removeBit(this.rf, BitConst_1.default.ONE_1);
    } // if(!v) {
    // 	console.log("inRenderer CCCC 0 VVVVVVVV false");
    // }
    // console.log("inRenderer CCCC 0 v: ",v,", this.rf: ", this.rf,);
    // console.log("CCCC 0 Bit.containsBit(this.rf, Bit.ONE_1): ", Bit.containsBit(this.rf, Bit.ONE_1));

  }

  get __$inRenderer() {
    // console.log("inRenderer CCCC 1 this.rf: ", this.rf);
    // console.log("CCCC 1 Bit.containsBit(this.rf, Bit.ONE_1): ", Bit.containsBit(this.rf, Bit.ONE_1));
    return BitConst_1.default.containsBit(this.rf, BitConst_1.default.ONE_1);
  }

  isDrawable() {
    return this.flag < 1;
  }

  set renderable(v) {
    if (v) {
      this.flag = BitConst_1.default.removeBit(this.flag, BitConst_1.default.ONE_2);
    } else {
      this.flag = BitConst_1.default.addBit(this.flag, BitConst_1.default.ONE_2);
    }
  }

  get renderable() {
    return !BitConst_1.default.containsBit(this.flag, BitConst_1.default.ONE_2);
  }

  set camVisible(v) {
    if (v) {
      this.flag = BitConst_1.default.removeBit(this.flag, BitConst_1.default.ONE_1);
    } else {
      this.flag = BitConst_1.default.addBit(this.flag, BitConst_1.default.ONE_1);
    }
  }

  get camVisible() {
    return !BitConst_1.default.containsBit(this.flag, BitConst_1.default.ONE_1);
  }

  set visible(v) {
    if (v) {
      this.flag = BitConst_1.default.removeBit(this.flag, BitConst_1.default.ONE_0);
    } else {
      this.flag = BitConst_1.default.addBit(this.flag, BitConst_1.default.ONE_0);
    }
  }

  get visible() {
    return !BitConst_1.default.containsBit(this.flag, BitConst_1.default.ONE_0);
  }

}

exports.WGRUnitState = WGRUnitState;

/***/ }),

/***/ "2258":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * render pass reference
 */

class WGRPassWrapper {
  get rcommands() {
    if (this.node) {
      return this.node.rcommands;
    }

    return undefined;
  }

  get colorAttachments() {
    if (this.node) {
      return this.node.colorAttachments;
    }

    return undefined;
  }

  addEntity(entity) {
    if (this.node) {
      this.node.addEntity(entity);
    }

    return this;
  }

  setColorAttachmentClearEnabledAt(enabled, index = 0) {
    if (this.node) {
      this.node.setColorAttachmentClearEnabledAt(enabled, index);
    }

    return this;
  }

  render() {
    if (this.node) {
      this.node.render();
      const cmd = this.cmdWrapper;

      if (cmd) {
        //this.rcommands.concat(pass.rcommands);
        cmd.rcommands = cmd.rcommands.concat(this.node.rcommands);
      }
    }
  }

}

exports.WGRPassWrapper = WGRPassWrapper;

/***/ }),

/***/ "24fe":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const Vector3_1 = __importDefault(__webpack_require__("af80"));

function initializeCamera(param, cam) {
  let p = param;
  if (!p) p = {};
  let eye = p.eye ? new Vector3_1.default().toZero().setVector3(p.eye) : new Vector3_1.default(1100.0, 1100.0, 1100.0);
  let up = p.up ? new Vector3_1.default().toZero().setVector3(p.up) : new Vector3_1.default(0, 1, 0);
  let origin = p.origin ? new Vector3_1.default().toZero().setVector3(p.origin) : new Vector3_1.default();
  if (p.fovDegree === undefined) p.fovDegree = 45;
  if (p.near === undefined) p.near = 0.1;
  if (p.far === undefined) p.far = 8000;
  if (p.viewWidth === undefined) p.viewWidth = 512;
  if (p.viewHeight === undefined) p.viewHeight = 512;
  if (p.viewX === undefined) p.viewX = 0;
  if (p.viewY === undefined) p.viewY = 0;
  p.perspective = p.perspective === false || Number(p.perspective) === 0 ? false : true;
  const width = p.viewWidth;
  const height = p.viewHeight;

  if (p.perspective) {
    cam.perspectiveRH(Math.PI * p.fovDegree / 180.0, width / height, p.near, p.far);
  } else {
    cam.inversePerspectiveZ = true;
    cam.orthoRH(p.near, p.far, -0.5 * height, 0.5 * height, -0.5 * width, 0.5 * width);
  }

  cam.lookAtRH(eye, origin, up);
  cam.setViewXY(p.viewX, p.viewY);
  cam.setViewSize(width, height);
  cam.update();
  return cam;
}

exports.initializeCamera = initializeCamera;

/***/ }),

/***/ "2b0e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const GPUMipmapGenerator_1 = __webpack_require__("b3f5");

const CommonUtils_1 = __webpack_require__("fe0b");

const Conversion_1 = __webpack_require__("37f2");

class WebGPUTextureContext {
  constructor(wgCtx) {
    this.mipmapGenerator = new GPUMipmapGenerator_1.GPUMipmapGenerator();

    if (wgCtx) {
      this.initialize(wgCtx);
    }
  }

  initialize(wgCtx) {
    if (!this.mWGCtx && wgCtx) {
      this.mWGCtx = wgCtx;
      this.mipmapGenerator.initialize(wgCtx.device);
    }
  }

  createFloatRTTTexture(descriptor) {
    if (!descriptor) descriptor = {};

    if (!descriptor.format) {
      descriptor.format = "rgba16float";
    }

    return this.createRTTTexture(descriptor);
  }

  createColorRTTTexture(descriptor) {
    if (!descriptor) descriptor = {};

    if (!descriptor.format) {
      descriptor.format = "bgra8unorm";
    }

    return this.createRTTTexture(descriptor);
  }

  createDepthRTTTexture(descriptor) {
    if (!descriptor) descriptor = {};

    if (!descriptor.format) {
      descriptor.format = "depth24plus";
    }

    return this.createRTTTexture(descriptor);
  }

  createRTTTexture(descriptor) {
    if (!descriptor) descriptor = {};
    const ctx = this.mWGCtx;

    if (descriptor.size === undefined) {
      descriptor.size = [ctx.canvasWidth, ctx.canvasHeight];
    }

    if (!descriptor.format) {
      descriptor.format = ctx.presentationFormat;
    }

    if (descriptor.usage === undefined) {
      descriptor.usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING;
    }

    return this.createTexture(descriptor);
  }

  async createTex2DByUrl(url, generateMipmaps = true, flipY = false, format = "rgba8unorm") {
    const response = await fetch(url);
    let imageBitmap;

    try {
      imageBitmap = await createImageBitmap(await response.blob());
    } catch (e) {
      console.error("createMaterialTexture(), error url: ", url);
      return null;
    }

    const tex = this.createTex2DByImage(imageBitmap, generateMipmaps, flipY, format, url);
    tex.url = url;
    return tex;
  }

  createTexture(descriptor) {
    const device = this.mWGCtx.device;
    let tex = device.createTexture(descriptor);
    tex.uid = WebGPUTextureContext.sUid++;
    return tex;
  }

  checkTexDesc(descriptor, generateMipmaps) {
    if (descriptor.usage === undefined) descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;
    if (descriptor.mipLevelCount < 1) descriptor.mipLevelCount = 1;
    generateMipmaps = generateMipmaps && descriptor.mipLevelCount > 1;

    if (generateMipmaps) {
      descriptor.usage = descriptor.usage | GPUTextureUsage.RENDER_ATTACHMENT;
    }

    return generateMipmaps;
  }

  createTex2DByImage(image, generateMipmaps = true, flipY = false, format = "rgba8unorm", label) {
    const device = this.mWGCtx.device;
    const mipmapG = this.mipmapGenerator;
    let mipLevelCount = generateMipmaps ? GPUMipmapGenerator_1.calculateMipLevels(image.width, image.height) : 1;
    const descriptor = {
      dimension: "2d",
      size: {
        width: image.width,
        height: image.height,
        depthOrArrayLayers: 1
      },
      format,
      mipLevelCount
    };
    generateMipmaps = this.checkTexDesc(descriptor, generateMipmaps);
    let tex = this.createTexture(descriptor);
    device.queue.copyExternalImageToTexture({
      source: image,
      flipY
    }, {
      texture: tex
    }, [image.width, image.height]);

    if (generateMipmaps) {
      tex = mipmapG.generateMipmap(tex, descriptor);
    }

    return tex;
  }

  async createTexCubeByUrls(urls, generateMipmaps = true, flipY = false, format = "rgba8unorm") {
    const promises = urls.map(async src => {
      const response = await fetch(src);
      return createImageBitmap(await response.blob());
    });
    const images = await Promise.all(promises);
    const tex = this.createTexCubeByImages(images, generateMipmaps, flipY, format = "rgba8unorm");
    tex.url = urls[0];
    return tex;
  }

  createTexCubeByImages(images, generateMipmaps = true, flipY = false, format = "rgba8unorm", label) {
    let image = images[0];
    const queue = this.mWGCtx.queue;
    let mipLevelCount = generateMipmaps ? GPUMipmapGenerator_1.calculateMipLevels(image.width, image.height) : 1;
    const descriptor = {
      dimension: "2d",
      size: {
        width: image.width,
        height: image.height,
        depthOrArrayLayers: 6
      },
      format,
      mipLevelCount
    };
    generateMipmaps = this.checkTexDesc(descriptor, generateMipmaps);
    console.log("createTexCubeByImages(), descriptor: ", descriptor);
    let tex = this.createTexture(descriptor);

    for (let i = 0; i < images.length; ++i) {
      image = images[i];
      queue.copyExternalImageToTexture({
        source: image,
        flipY
      }, {
        texture: tex,
        origin: [0, 0, i]
      }, [image.width, image.height]);
    }

    if (generateMipmaps) {
      tex = this.mipmapGenerator.generateMipmap(tex, descriptor);
    }

    return tex;
  }

  createDataTexture(srcDatas, width, height, descriptor, generateMipmaps = false) {
    if (!descriptor) descriptor = {};

    if (!descriptor.format) {
      descriptor.format = "rgba8unorm";
    }

    console.log("descriptor.format: ", descriptor.format);

    switch (descriptor.format) {
      case "rgba16float":
        return this.create64BitsTexture(srcDatas, width, height, descriptor, generateMipmaps);
        break;

      case "bgra8unorm":
      case "rgba8unorm":
      case "rgb9e5ufloat":
        return this.create32BitsTexture(srcDatas, width, height, descriptor, generateMipmaps);

      default:
        break;
    }

    throw Error("Illegal operation !!!");
  }

  create32BitsTexture(srcDatas, width, height, descriptor, generateMipmaps = false) {
    generateMipmaps = generateMipmaps === true ? true : false;
    if (!descriptor) descriptor = {};

    if (!descriptor.format) {
      descriptor.format = "rgba8unorm";
    }

    let wgctx = this.mWGCtx;
    let datas = new Array(srcDatas.length);
    if (!descriptor) descriptor = {};

    if (!descriptor.usage) {
      descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;
    }

    if (!descriptor.size) {
      descriptor.size = [width, height];
    }

    console.log("this.create32BitsTexture(), descriptor.format: ", descriptor.format);

    switch (descriptor.format) {
      case "rgb9e5ufloat":
        generateMipmaps = false;

        for (let i = 0; i < srcDatas.length; ++i) {
          let rd = srcDatas[i];
          let tot = rd.length / 3;
          let k = 0;
          let data = new Int32Array(tot);

          for (let j = 0; j < tot; ++j) {
            data[j] = Conversion_1.packRGB9E5UFloat(rd[k], rd[k + 1], rd[k + 2]);
            k += 3;
          }

          datas[i] = data;
        }

        break;

      default:
        for (let i = 0; i < srcDatas.length; ++i) {
          let data = srcDatas[i]; // console.log('data instanceof Uint8Array: ', data instanceof Uint8Array, ', data.BYTES_PER_ELEMENT: ', data.BYTES_PER_ELEMENT);

          if (data.byteLength === undefined || data.BYTES_PER_ELEMENT != 1) {
            data = new Uint8Array(srcDatas[i]);
          }

          datas[i] = data;
        }

        break;
    }

    descriptor.mipLevelCount = generateMipmaps || datas.length > 1 ? GPUMipmapGenerator_1.calculateMipLevels(width, height) : 1;
    generateMipmaps = this.checkTexDesc(descriptor, generateMipmaps);
    let texture;

    if (descriptor.viewDimension === "cube") {
      descriptor.size = {
        width,
        height,
        depthOrArrayLayers: 6
      };
      texture = wgctx.device.createTexture(descriptor);
      let k = 0;

      for (let i = 0; i < descriptor.mipLevelCount; i++) {
        let bytesPerRow = width * 4;
        let rowsPerImage = height;

        for (let j = 0; j < 6; j++) {
          wgctx.device.queue.writeTexture({
            texture,
            mipLevel: i,
            origin: [0, 0, j]
          }, datas[k++], {
            bytesPerRow,
            rowsPerImage
          }, {
            width,
            height
          });
        }

        width >>= 1;
        height >>= 1;
      }
    } else {
      let rowsPerImage = height;
      texture = wgctx.device.createTexture(descriptor);

      for (let i = 0; i < datas.length; ++i) {
        let bytesPerRow = width * 4;
        wgctx.device.queue.writeTexture({
          texture,
          mipLevel: i,
          origin: [0, 0]
        }, datas[i], {
          bytesPerRow,
          rowsPerImage
        }, {
          width,
          height
        });
        width >>= 1;
        height >>= 1;
      }
    } // console.log("this.create32BitsTexture(), mipmapGenerator: ", generateMipmaps);


    if (generateMipmaps) {
      texture = this.mipmapGenerator.generateMipmap(texture, descriptor);
    }

    return texture;
  }

  create64BitsTexture(srcDatas, width, height, descriptor, generateMipmaps = false) {
    generateMipmaps = generateMipmaps === true ? true : false;

    if (!descriptor.format) {
      descriptor.format = "rgba16float";
    }

    let wgctx = this.mWGCtx;
    let datas = new Array(srcDatas.length);

    switch (descriptor.format) {
      case "rgba16float":
        for (let i = 0; i < srcDatas.length; i++) {
          let sd = srcDatas[i];
          let data = new Uint16Array(sd.length);

          for (let j = 0; j < sd.length; ++j) {
            data[j] = CommonUtils_1.toFloat16(sd[j]);
          }

          datas[i] = data;
        }

        break;

      default:
        break;
    }

    if (!descriptor) descriptor = {};

    if (!descriptor.size) {
      descriptor.size = [width, height];
    }

    descriptor.mipLevelCount = generateMipmaps ? GPUMipmapGenerator_1.calculateMipLevels(width, height) : 1;
    generateMipmaps = this.checkTexDesc(descriptor, generateMipmaps);
    let texture;

    if (descriptor.viewDimension === "cube") {
      descriptor.size = {
        width,
        height,
        depthOrArrayLayers: 6
      };
      texture = wgctx.device.createTexture(descriptor);
      let k = 0;

      for (let i = 0; i < descriptor.mipLevelCount; i++) {
        let bytesPerRow = width * 8;
        let rowsPerImage = height;

        for (let j = 0; j < 6; j++) {
          wgctx.device.queue.writeTexture({
            texture,
            mipLevel: i,
            origin: [0, 0, j]
          }, datas[k++], {
            bytesPerRow,
            rowsPerImage
          }, {
            width,
            height
          });
        }

        width >>= 1;
        height >>= 1;
      }
    } else {
      texture = wgctx.device.createTexture(descriptor);

      for (let i = 0; i < datas.length; i++) {
        let bytesPerRow = width * 8;
        wgctx.device.queue.writeTexture({
          texture,
          mipLevel: i
        }, datas[i], {
          bytesPerRow,
          rowsPerImage: height
        }, {
          width,
          height
        });
        width >>= 1;
        height >>= 1;
      }
    }

    if (generateMipmaps) {
      texture = this.mipmapGenerator.generateMipmap(texture, descriptor);
    }

    return texture;
  }

}

WebGPUTextureContext.sUid = 0;
exports.WebGPUTextureContext = WebGPUTextureContext;

/***/ }),

/***/ "2c77":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2023 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

Object.defineProperty(exports, "__esModule", {
  value: true
});
const __$mcv = 1e-5;

function lerp(x, y, t) {
  return (1 - t) * x + t * y;
}

function euclideanModulo(n, m) {
  return (n % m + m) % m;
}

function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
  return p;
}

function srgbToLinear(c) {
  return c < 0.04045 ? c * 0.0773993808 : Math.pow(c * 0.9478672986 + 0.0521327014, 2.4);
}

function linearToSRGB(c) {
  return c < 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 0.41666) - 0.055;
}

function getHexStr(v) {
  let t = Math.floor(v * 255.0);

  if (t > 0) {
    if (t < 0xf) {
      return "0" + t.toString(16);
    } else {
      return "" + t.toString(16);
    }
  } else {
    return '00';
  }
}

class Color4 {
  constructor(pr = 1.0, pg = 1.0, pb = 1.0, pa = 1.0) {
    this.h = 0;
    this.s = 0;
    this.l = 0;
    this.v = 0;
    this.c = 0;
    this.m = 0;
    this.y = 0;
    this.k = 0;
    this.r = pr;
    this.g = pg;
    this.b = pb;
    this.a = pa;
  }

  clone() {
    return new Color4(this.r, this.g, this.b, this.a);
  }

  setColor(color) {
    let v = color;

    if (v) {
      const c = this;
      const vs = v;

      if (vs.length !== undefined) {
        const len = vs.length;
        if (len > 0) c.r = vs[0];
        if (len > 1) c.g = vs[1];
        if (len > 2) c.b = vs[2];
        if (len > 3) c.a = vs[3];
      } else {
        const vo = v;
        if (vo.r !== undefined) c.r = vo.r;
        if (vo.g !== undefined) c.g = vo.g;
        if (vo.b !== undefined) c.b = vo.b;
        if (vo.a !== undefined) c.a = vo.a;
      }
    }

    return this;
  }

  toBlack(brn = 0) {
    this.r = this.g = this.b = brn;
    return this;
  }

  toWhite(brn = 1.0) {
    this.r = this.g = this.b = brn;
    return this;
  }

  gammaCorrect() {
    const f = 1.0 / 2.2;
    this.r = Math.pow(this.r, f);
    this.g = Math.pow(this.g, f);
    this.b = Math.pow(this.b, f);
    return this;
  }

  fromArray4(arr, offset = 0) {
    this.r = arr[offset];
    this.g = arr[offset + 1];
    this.b = arr[offset + 2];
    this.a = arr[offset + 3];
    return this;
  }

  toArray4(arr, offset = 0) {
    arr[offset] = this.r;
    arr[offset + 1] = this.g;
    arr[offset + 2] = this.b;
    arr[offset + 3] = this.a;
    return this;
  }

  getArray4() {
    let arr = new Array(4);
    this.toArray4(arr);
    return arr;
  }

  getArray3() {
    let arr = new Array(3);
    this.toArray3(arr);
    return arr;
  }

  fromArray3(arr, offset = 0) {
    this.r = arr[offset];
    this.g = arr[offset + 1];
    this.b = arr[offset + 2];
    return this;
  }

  toArray3(arr, offset = 0) {
    arr[offset] = this.r;
    arr[offset + 1] = this.g;
    arr[offset + 2] = this.b;
    return this;
  }

  fromBytesArray3(arr, offset = 0) {
    this.setRGB3Bytes(arr[offset], arr[offset + 1], arr[offset + 2]);
    return this;
  }

  toBytesArray3(arr, offset = 0) {
    arr[offset] = Math.round(this.r * 255);
    arr[offset + 1] = Math.round(this.g * 255);
    arr[offset + 2] = Math.round(this.b * 255);
    return this;
  }

  setRGB3f(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  }

  setRGB3Bytes(uint8R, uint8G, uint8B) {
    const k = 1.0 / 255.0;
    this.r = uint8R * k;
    this.g = uint8G * k;
    this.b = uint8B * k;
    return this; // return this.setRGB3Bytes(r,g,b);
  }

  setRGBUint24(rgbUint24) {
    const bit = 0xff;
    this.r = (rgbUint24 >> 16 & bit) / 255.0;
    this.g = (rgbUint24 >> 8 & bit) / 255.0;
    this.b = (rgbUint24 & bit) / 255.0;
    return this;
  }

  getRGBUint24() {
    return (Math.round(this.r * 255) << 16) + (Math.round(this.g * 255) << 8) + Math.round(this.b * 255);
  }

  clamp() {
    if (this.r > 1.0) this.r = 1.0;else if (this.r < 0.0) this.r = 0.0;
    if (this.g > 1.0) this.g = 1.0;else if (this.g < 0.0) this.g = 0.0;
    if (this.b > 1.0) this.b = 1.0;else if (this.b < 0.0) this.b = 0.0;
    return this;
  }

  ceil() {
    let s = Math.max(Math.max(this.r, this.g), this.b); // console.log("a0 s: ", s);

    s = 1.0 / (s + 0.000001); // console.log("a1 s: ", s);

    if (s < 1.0) {
      s = 1.0;
    } // console.log("b0 s: ", s);


    return this.scaleBy(s);
  }
  /**
   * @param argbUint32 example: 0xFFFF88cc
   */


  setARGBUint32(argbUint32) {
    const bit = 0xff;
    this.r = (argbUint32 >> 16 & bit) / 255.0;
    this.g = (argbUint32 >> 8 & bit) / 255.0;
    this.b = (argbUint32 & bit) / 255.0;
    this.a = (argbUint32 >> 24 & bit) / 255.0;
    return this;
  }

  getARGBUint32() {
    return (Math.round(this.a * 255) << 24) + (Math.round(this.r * 255) << 16) + (Math.round(this.g * 255) << 8) + Math.round(this.b * 255);
  }

  setRGBA4f(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    return this;
  }

  setAlpha(a) {
    this.a = a;
    return this;
  }
  /**
   *
   * @param contrast its value range is [-50.0, 100.0]
   */


  setContrast(contrast) {
    /*
        //限制参数p;
        if(p>0){p=p+1;}//当p>0时,函数图像无限趋近于垂直
        else{p=1/(1-p);}//当p<0时,函数图像无限趋近于水平
        //使函数图像绕(0.5,0.5)为中心旋转;
        x=p*(x-0.5)+0.5;
        //返回x限制在0-1之间的值;
        return clamp(x, 0.0, 1.0);
    */

    /*
        //限制参数p;
        if(p>0){p=p+1;}//当p>0时,函数图像无限趋近于垂直
        else{p=1/(1-p);}//当p<0时,函数图像无限趋近于水平
        //R通道运算;
        if(x.x>0.5){x.x=1-pow((2-x.x*2),p)/2;}
        else{x.x=pow((x.x*2),p)/2;}
        //G通道运算;
        if(x.y>0.5){x.y=1-pow((2-2*x.y),p)/2;}
        else{x.y=pow((2*x.y),p)/2;}
        //B通道运算;
        if(x.z>0.5){x.z=1-pow((2-2*x.z),p)/2;}
        else{x.z=pow((2*x.z),p)/2;}
        //返回值;
        return x;
        // thanks: https://zhuanlan.zhihu.com/p/415198746
    */
    const factor = 259.0 * (contrast + 255.0) / (255.0 * (259.0 - contrast));
    const pr = 255.0 * this.r;
    const pg = 255.0 * this.g;
    const pb = 255.0 * this.b;
    this.r = clamp(factor * (pr - 128.0) + 128.0, 0.0, 255.0) / 255.0;
    this.g = clamp(factor * (pg - 128.0) + 128.0, 0.0, 255.0) / 255.0;
    this.b = clamp(factor * (pb - 128.0) + 128.0, 0.0, 255.0) / 255.0;
    return this;
  }

  toGray() {
    this.r *= 0.2126;
    this.g *= 0.7152;
    this.b *= 0.0722;
    return this;
  }

  setHSL(h, s, l) {
    // h,s,l ranges are in 0.0 - 1.0
    h = euclideanModulo(h, 1);
    s = clamp(s, 0, 1);
    l = clamp(l, 0, 1);

    if (s === 0) {
      this.r = this.g = this.b = l;
    } else {
      const p = l <= 0.5 ? l * (1 + s) : l + s - l * s;
      const q = 2 * l - p;
      this.r = hue2rgb(q, p, h + 1 / 3);
      this.g = hue2rgb(q, p, h);
      this.b = hue2rgb(q, p, h - 1 / 3);
    }

    return this;
  }

  getHSL(target = null) {
    // h,s,l ranges are in 0.0 - 1.0
    if (!target) {
      target = new Color4();
    }

    const r = this.r,
          g = this.g,
          b = this.b;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let hue, saturation;
    const lightness = (min + max) / 2.0;

    if (min === max) {
      hue = 0;
      saturation = 0;
    } else {
      const delta = max - min;
      saturation = lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);

      switch (max) {
        case r:
          hue = (g - b) / delta + (g < b ? 6 : 0);
          break;

        case g:
          hue = (b - r) / delta + 2;
          break;

        case b:
          hue = (r - g) / delta + 4;
          break;
      }

      hue /= 6;
    }

    target.h = hue;
    target.s = saturation;
    target.l = lightness;
    return target;
  }

  lerp(color, factor) {
    this.r += (color.r - this.r) * factor;
    this.g += (color.g - this.g) * factor;
    this.b += (color.b - this.b) * factor;
    return this;
  }

  lerpColors(color1, color2, factor) {
    this.r = color1.r + (color2.r - color1.r) * factor;
    this.g = color1.g + (color2.g - color1.g) * factor;
    this.b = color1.b + (color2.b - color1.b) * factor;
    return this;
  }

  lerpHSL(color, factor) {
    const c0 = Color4.sC0;
    const c1 = Color4.aC1;
    this.getHSL(c0);
    color.getHSL(c1);
    const h = lerp(c0.h, c1.h, factor);
    const s = lerp(c0.s, c1.s, factor);
    const l = lerp(c0.l, c1.l, factor);
    this.setHSL(h, s, l);
    return this;
  }

  copyFrom(c) {
    this.r = c.r;
    this.g = c.g;
    this.b = c.b;
    this.a = c.a;
    return this;
  }

  copyFromRGB(c) {
    this.r = c.r;
    this.g = c.g;
    this.b = c.b;
    return this;
  }

  scaleBy(s) {
    this.r *= s;
    this.g *= s;
    this.b *= s;
    return this;
  }

  inverseRGB() {
    this.r = 1.0 - this.r;
    this.g = 1.0 - this.g;
    this.b = 1.0 - this.b;
    return this;
  }

  randomRGB(density = 1.0, bias = 0.0) {
    this.r = Math.random() * density + bias;
    this.g = Math.random() * density + bias;
    this.b = Math.random() * density + bias;
    return this;
  }

  rotate() {
    // let arr = [this.g, this.b, this.r];
    return this.setColor([this.g, this.b, this.r]);
  }

  normalizeRandom(density = 1.0, bias = 0.0) {
    this.r = Math.random();
    this.g = Math.random();
    this.b = Math.random();
    let d = Math.sqrt(this.r * this.r + this.g * this.g + this.b * this.b);

    if (d > __$mcv) {
      this.r = density * this.r / d;
      this.g = density * this.g / d;
      this.b = density * this.b / d;
    }

    this.r += bias;
    this.g += bias;
    this.b += bias;
    return this;
  }

  normalize(density) {
    if (density == undefined) density = 1.0;
    let d = Math.sqrt(this.r * this.r + this.g * this.g + this.b * this.b);

    if (d > __$mcv) {
      this.r = density * this.r / d;
      this.g = density * this.g / d;
      this.b = density * this.b / d;
    }

    return this;
  }

  rgbSizeTo(size) {
    let d = Math.sqrt(this.r * this.r + this.g * this.g + this.b * this.b);
    d = size / d;
    this.r *= d;
    this.g *= d;
    this.b *= d;
    return this;
  }

  copySRGBToLinear(color) {
    this.r = srgbToLinear(color.r);
    this.g = srgbToLinear(color.g);
    this.b = srgbToLinear(color.b);
    return this;
  }

  copyLinearToSRGB(color) {
    this.r = linearToSRGB(color.r);
    this.g = linearToSRGB(color.g);
    this.b = linearToSRGB(color.b);
    return this;
  }

  convertSRGBToLinear() {
    return this.copySRGBToLinear(this);
  }

  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this);
  }
  /**
   * @returns for example: rgba(255,255,255,1.0)
   */


  getCSSDecRGBAColor() {
    let pr = Math.floor(this.r * 255.0);
    let pg = Math.floor(this.g * 255.0);
    let pb = Math.floor(this.b * 255.0);
    let pa = this.a;
    return "rgba(" + pr + "," + pg + "," + pb + "," + pa + ")";
  }
  /**
   * @returns for example: #350b7e
   */


  getCSSHeXRGBColor(keyStr = "#") {
    let str = keyStr;
    str += getHexStr(this.r);
    str += getHexStr(this.g);
    str += getHexStr(this.b);
    return str;
  }

}

Color4.sC0 = new Color4();
Color4.aC1 = new Color4();
exports.default = Color4;

/***/ }),

/***/ "2d6d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const BitConst_1 = __importDefault(__webpack_require__("626c"));

const WGRBufferView_1 = __webpack_require__("dfa8");

const WGRBufferValueParam_1 = __webpack_require__("b512");

exports.WGRBufferData = WGRBufferValueParam_1.WGRBufferData;
exports.WGRBufferValueParam = WGRBufferValueParam_1.WGRBufferValueParam;

const WGRBufferVisibility_1 = __webpack_require__("dc4d");

class WGRBufferValue extends WGRBufferView_1.WGRBufferView {
  constructor(param) {
    console.log("WGRBufferValue::constructor() ...");
    super();
    WGRBufferValueParam_1.applyParamToBufferData(this, param);
    this.upate();
  }

  toShared() {
    this.shared = true;
    return this;
  }

  toVisibleAll() {
    this.visibility.toVisibleAll();
    return this;
  }

  toVisibleVertComp() {
    this.visibility.toVisibleVertComp();
    return this;
  }

  toVisibleComp() {
    this.visibility.toVisibleComp();
    return this;
  }

  toBufferForStorage() {
    this.visibility.toBufferForStorage();
    return this;
  }

  toBufferForReadOnlyStorage() {
    this.visibility.toBufferForReadOnlyStorage();
    return this;
  }

  toUniform() {
    this.usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
    return this;
  }

  toStorage() {
    this.usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST;
  }

  toVertex() {
    this.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
  }

  isUniform() {
    return BitConst_1.default.containsBit(this.usage, GPUBufferUsage.UNIFORM);
  }

  isStorage() {
    return BitConst_1.default.containsBit(this.usage, GPUBufferUsage.STORAGE);
  }

  isVertex() {
    return BitConst_1.default.containsBit(this.usage, GPUBufferUsage.VERTEX);
  }

  upate() {
    this.version++;
  }

  clone(data) {
    const u = new WGRBufferValue({
      data: data
    });
    u.name = this.name;
    u.byteOffset = this.byteOffset;
    u.arrayStride = this.arrayStride;
    u.usage = this.usage;
    return u;
  }

  destroy() {
    this.data = null;
    this.bufData = null;
    this.shared = null;
    this.visibility = null;

    if (this.buffer) {
      this.buffer = null;
    }
  }

}

exports.WGRBufferValue = WGRBufferValue;

let __$ubv; // = new WGRBufferValue({data: new Float32Array(4)});


function getVisibility(str, value) {
  switch (str) {
    case 'vert':
    case 'vertex':
      // console.log("getVisibility() XXXX Vert");
      return value | GPUShaderStage.VERTEX;
      break;

    case 'frag':
    case 'fragment':
      // console.log("getVisibility() XXXX Frag");
      return value | GPUShaderStage.FRAGMENT;
      break;

    case 'comp':
    case 'compute':
      console.log("getVisibility() XXXX Comp");
      return value | GPUShaderStage.COMPUTE;
      break;

    default:
      break;
  }

  return value;
}

function applyLayout(layout, vi, type) {
  let visi = layout.visibility !== undefined ? layout.visibility : 'vert_frag';
  let vs = visi.split('_');
  let v = 0;

  if (!__$ubv) {
    __$ubv = new WGRBufferValue({
      data: new Float32Array(4)
    });
  }

  let bv = __$ubv.visibility;

  for (let i = 0; i < vs.length; ++i) {
    if (vs[i] === 'all') {
      bv.toVisibleAll();
      v = bv.visibility;
      break;
    }

    v = v | getVisibility(vs[i], v);
  }

  if (vs.length < 1) {
    bv.toVisibleVertFrag();
    v = bv.visibility;
  }

  if (v < 1) {
    throw 'Illegal operation !!!';
  }

  vi.visibility = v;
  let acc = layout.access !== undefined ? layout.access : '';

  switch (type) {
    case 'uniform':
      vi.toBufferForUniform();
      break;

    case 'storage':
      if (acc === 'read_write') {
        vi.toBufferForStorage();
      } else {
        vi.toBufferForReadOnlyStorage();
      }

      break;

    default:
      break;
  }
}

function bufferDataFilter(d) {
  if (!d) {
    return d;
  }

  if (!__$ubv) {
    __$ubv = new WGRBufferValue({
      data: new Float32Array(4)
    });
  }

  const v = __$ubv;
  let rd = d;
  let vi = rd.visibility;
  let layout = rd.layout;

  if (d.storage) {
    rd = d.storage;
    v.toStorage();
    rd.usage = v.usage;
    let flag = !rd.visibility;

    if (flag) {
      rd.visibility = new WGRBufferVisibility_1.WGRBufferVisibility();
    }

    vi = rd.visibility;
    if (!layout) layout = rd.layout;

    if (flag && layout !== undefined) {
      applyLayout(layout, vi, 'storage');
    } else {
      let b = vi.buffer; // console.log("dfdfdfd AAA b: ", b, (!b));

      if (!b || b.type.indexOf('storage') < 0) {
        vi.toBufferForReadOnlyStorage();
        b = vi.buffer;
      }
    } // console.log("dfdfdfd BBB b: ", b, (!b));

  }

  if (d.vertex) {
    rd = d.vertex;
    v.toVertex();
    rd.usage = v.usage;
  }

  if (rd.usage === undefined || d.uniform) {
    if (d.uniform) {
      rd = d.uniform;
    }

    v.toUniform();
    rd.usage = v.usage;
    let flag = !rd.visibility;

    if (flag) {
      rd.visibility = new WGRBufferVisibility_1.WGRBufferVisibility();
    }

    vi = rd.visibility;
    if (!layout) layout = rd.layout;

    if (flag && layout !== undefined) {
      applyLayout(layout, vi, 'uniform');
    } else {
      let b = vi.buffer;

      if (!b || b.type.indexOf('uniform') < 1) {
        vi.toBufferForUniform();
        b = vi.buffer;
      }
    } // console.log("dfdfdfd AAA111 b: ", b, (!b), ", vi: ", vi);

  }

  if (rd.byteOffset === undefined) rd.byteOffset = 0;
  if (rd.version === undefined) rd.version = -1;
  return rd;
}

function checkBufferData(bufData) {
  let isBV = bufData instanceof WGRBufferValue; // console.log("checkBufferData(), isBV: ", isBV);

  if (!isBV) {
    // console.log("checkBufferData(), building data ...");
    bufData = bufferDataFilter(bufData);
    bufData.shared = bufData.shared === true ? true : false;
    WGRBufferValueParam_1.applyParamToBufferData(bufData, bufData);
    bufData.byteLength = bufData.data.byteLength; // console.log("checkBufferData(), XXXXXXXX bufDatd: ", bufData);
  }

  return bufData;
}

exports.checkBufferData = checkBufferData;

/***/ }),

/***/ "3341":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * See: https://gpuweb.github.io/gpuweb/#enumdef-gputextureformat
 */

var GPUTextureFormat;

(function (GPUTextureFormat) {
  // 8-bit formats
  GPUTextureFormat[GPUTextureFormat["r8unorm"] = 0] = "r8unorm";
  GPUTextureFormat[GPUTextureFormat["r8snorm"] = 1] = "r8snorm";
  GPUTextureFormat[GPUTextureFormat["r8uint"] = 2] = "r8uint";
  GPUTextureFormat[GPUTextureFormat["r8sint"] = 3] = "r8sint"; // 16-bit formats

  GPUTextureFormat[GPUTextureFormat["r16uint"] = 4] = "r16uint";
  GPUTextureFormat[GPUTextureFormat["r16sint"] = 5] = "r16sint";
  GPUTextureFormat[GPUTextureFormat["r16float"] = 6] = "r16float";
  GPUTextureFormat[GPUTextureFormat["rg8unorm"] = 7] = "rg8unorm";
  GPUTextureFormat[GPUTextureFormat["rg8snorm"] = 8] = "rg8snorm";
  GPUTextureFormat[GPUTextureFormat["rg8uint"] = 9] = "rg8uint";
  GPUTextureFormat[GPUTextureFormat["rg8sint"] = 10] = "rg8sint"; // 32-bit formats

  GPUTextureFormat[GPUTextureFormat["r32uint"] = 11] = "r32uint";
  GPUTextureFormat[GPUTextureFormat["r32sint"] = 12] = "r32sint";
  GPUTextureFormat[GPUTextureFormat["r32float"] = 13] = "r32float";
  GPUTextureFormat[GPUTextureFormat["rg16uint"] = 14] = "rg16uint";
  GPUTextureFormat[GPUTextureFormat["rg16sint"] = 15] = "rg16sint";
  GPUTextureFormat[GPUTextureFormat["rg16float"] = 16] = "rg16float";
  GPUTextureFormat[GPUTextureFormat["rgba8unorm"] = 17] = "rgba8unorm";
  GPUTextureFormat[GPUTextureFormat["rgba8unorm-srgb"] = 18] = "rgba8unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["rgba8snorm"] = 19] = "rgba8snorm";
  GPUTextureFormat[GPUTextureFormat["rgba8uint"] = 20] = "rgba8uint";
  GPUTextureFormat[GPUTextureFormat["rgba8sint"] = 21] = "rgba8sint";
  GPUTextureFormat[GPUTextureFormat["bgra8unorm"] = 22] = "bgra8unorm";
  GPUTextureFormat[GPUTextureFormat["bgra8unorm-srgb"] = 23] = "bgra8unorm-srgb"; // Packed 32-bit formats

  GPUTextureFormat[GPUTextureFormat["rgb9e5ufloat"] = 24] = "rgb9e5ufloat";
  GPUTextureFormat[GPUTextureFormat["rgb10a2uint"] = 25] = "rgb10a2uint";
  GPUTextureFormat[GPUTextureFormat["rgb10a2unorm"] = 26] = "rgb10a2unorm";
  GPUTextureFormat[GPUTextureFormat["rg11b10ufloat"] = 27] = "rg11b10ufloat"; // 64-bit formats

  GPUTextureFormat[GPUTextureFormat["rg32uint"] = 28] = "rg32uint";
  GPUTextureFormat[GPUTextureFormat["rg32sint"] = 29] = "rg32sint";
  GPUTextureFormat[GPUTextureFormat["rg32float"] = 30] = "rg32float";
  GPUTextureFormat[GPUTextureFormat["rgba16uint"] = 31] = "rgba16uint";
  GPUTextureFormat[GPUTextureFormat["rgba16sint"] = 32] = "rgba16sint";
  GPUTextureFormat[GPUTextureFormat["rgba16float"] = 33] = "rgba16float"; // 128-bit formats

  GPUTextureFormat[GPUTextureFormat["rgba32uint"] = 34] = "rgba32uint";
  GPUTextureFormat[GPUTextureFormat["rgba32sint"] = 35] = "rgba32sint";
  GPUTextureFormat[GPUTextureFormat["rgba32float"] = 36] = "rgba32float"; // Depth/stencil formats

  GPUTextureFormat[GPUTextureFormat["stencil8"] = 37] = "stencil8";
  GPUTextureFormat[GPUTextureFormat["depth16unorm"] = 38] = "depth16unorm";
  GPUTextureFormat[GPUTextureFormat["depth24plus"] = 39] = "depth24plus";
  GPUTextureFormat[GPUTextureFormat["depth24plus-stencil8"] = 40] = "depth24plus-stencil8";
  GPUTextureFormat[GPUTextureFormat["depth32float"] = 41] = "depth32float"; // "depth32float-stencil8" feature

  GPUTextureFormat[GPUTextureFormat["depth32float-stencil8"] = 42] = "depth32float-stencil8"; // BC compressed formats usable if "texture-compression-bc" is both
  // supported by the device/user agent and enabled in requestDevice.

  GPUTextureFormat[GPUTextureFormat["bc1-rgba-unorm"] = 43] = "bc1-rgba-unorm";
  GPUTextureFormat[GPUTextureFormat["bc1-rgba-unorm-srgb"] = 44] = "bc1-rgba-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["bc2-rgba-unorm"] = 45] = "bc2-rgba-unorm";
  GPUTextureFormat[GPUTextureFormat["bc2-rgba-unorm-srgb"] = 46] = "bc2-rgba-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["bc3-rgba-unorm"] = 47] = "bc3-rgba-unorm";
  GPUTextureFormat[GPUTextureFormat["bc3-rgba-unorm-srgb"] = 48] = "bc3-rgba-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["bc4-r-unorm"] = 49] = "bc4-r-unorm";
  GPUTextureFormat[GPUTextureFormat["bc4-r-snorm"] = 50] = "bc4-r-snorm";
  GPUTextureFormat[GPUTextureFormat["bc5-rg-unorm"] = 51] = "bc5-rg-unorm";
  GPUTextureFormat[GPUTextureFormat["bc5-rg-snorm"] = 52] = "bc5-rg-snorm";
  GPUTextureFormat[GPUTextureFormat["bc6h-rgb-ufloat"] = 53] = "bc6h-rgb-ufloat";
  GPUTextureFormat[GPUTextureFormat["bc6h-rgb-float"] = 54] = "bc6h-rgb-float";
  GPUTextureFormat[GPUTextureFormat["bc7-rgba-unorm"] = 55] = "bc7-rgba-unorm";
  GPUTextureFormat[GPUTextureFormat["bc7-rgba-unorm-srgb"] = 56] = "bc7-rgba-unorm-srgb"; // ETC2 compressed formats usable if "texture-compression-etc2" is both
  // supported by the device/user agent and enabled in requestDevice.

  GPUTextureFormat[GPUTextureFormat["etc2-rgb8unorm"] = 57] = "etc2-rgb8unorm";
  GPUTextureFormat[GPUTextureFormat["etc2-rgb8unorm-srgb"] = 58] = "etc2-rgb8unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["etc2-rgb8a1unorm"] = 59] = "etc2-rgb8a1unorm";
  GPUTextureFormat[GPUTextureFormat["etc2-rgb8a1unorm-srgb"] = 60] = "etc2-rgb8a1unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["etc2-rgba8unorm"] = 61] = "etc2-rgba8unorm";
  GPUTextureFormat[GPUTextureFormat["etc2-rgba8unorm-srgb"] = 62] = "etc2-rgba8unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["eac-r11unorm"] = 63] = "eac-r11unorm";
  GPUTextureFormat[GPUTextureFormat["eac-r11snorm"] = 64] = "eac-r11snorm";
  GPUTextureFormat[GPUTextureFormat["eac-rg11unorm"] = 65] = "eac-rg11unorm";
  GPUTextureFormat[GPUTextureFormat["eac-rg11snorm"] = 66] = "eac-rg11snorm"; // ASTC compressed formats usable if "texture-compression-astc" is both
  // supported by the device/user agent and enabled in requestDevice.

  GPUTextureFormat[GPUTextureFormat["astc-4x4-unorm"] = 67] = "astc-4x4-unorm";
  GPUTextureFormat[GPUTextureFormat["astc-4x4-unorm-srgb"] = 68] = "astc-4x4-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["astc-5x4-unorm"] = 69] = "astc-5x4-unorm";
  GPUTextureFormat[GPUTextureFormat["astc-5x4-unorm-srgb"] = 70] = "astc-5x4-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["astc-5x5-unorm"] = 71] = "astc-5x5-unorm";
  GPUTextureFormat[GPUTextureFormat["astc-5x5-unorm-srgb"] = 72] = "astc-5x5-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["astc-6x5-unorm"] = 73] = "astc-6x5-unorm";
  GPUTextureFormat[GPUTextureFormat["astc-6x5-unorm-srgb"] = 74] = "astc-6x5-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["astc-6x6-unorm"] = 75] = "astc-6x6-unorm";
  GPUTextureFormat[GPUTextureFormat["astc-6x6-unorm-srgb"] = 76] = "astc-6x6-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["astc-8x5-unorm"] = 77] = "astc-8x5-unorm";
  GPUTextureFormat[GPUTextureFormat["astc-8x5-unorm-srgb"] = 78] = "astc-8x5-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["astc-8x6-unorm"] = 79] = "astc-8x6-unorm";
  GPUTextureFormat[GPUTextureFormat["astc-8x6-unorm-srgb"] = 80] = "astc-8x6-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["astc-8x8-unorm"] = 81] = "astc-8x8-unorm";
  GPUTextureFormat[GPUTextureFormat["astc-8x8-unorm-srgb"] = 82] = "astc-8x8-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["astc-10x5-unorm"] = 83] = "astc-10x5-unorm";
  GPUTextureFormat[GPUTextureFormat["astc-10x5-unorm-srgb"] = 84] = "astc-10x5-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["astc-10x6-unorm"] = 85] = "astc-10x6-unorm";
  GPUTextureFormat[GPUTextureFormat["astc-10x6-unorm-srgb"] = 86] = "astc-10x6-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["astc-10x8-unorm"] = 87] = "astc-10x8-unorm";
  GPUTextureFormat[GPUTextureFormat["astc-10x8-unorm-srgb"] = 88] = "astc-10x8-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["astc-10x10-unorm"] = 89] = "astc-10x10-unorm";
  GPUTextureFormat[GPUTextureFormat["astc-10x10-unorm-srgb"] = 90] = "astc-10x10-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["astc-12x10-unorm"] = 91] = "astc-12x10-unorm";
  GPUTextureFormat[GPUTextureFormat["astc-12x10-unorm-srgb"] = 92] = "astc-12x10-unorm-srgb";
  GPUTextureFormat[GPUTextureFormat["astc-12x12-unorm"] = 93] = "astc-12x12-unorm";
  GPUTextureFormat[GPUTextureFormat["astc-12x12-unorm-srgb"] = 94] = "astc-12x12-unorm-srgb";
})(GPUTextureFormat || (GPUTextureFormat = {}));

exports.GPUTextureFormat = GPUTextureFormat;
;
const __$WGTFMap = GPUTextureFormat;

function checkGPUTextureFormat(format, error = true) {
  const flag = __$WGTFMap.hasOwnProperty(format);

  if (!flag && error) {
    console.error(`Error: invalid gpu texture format "${format}"`);
  }

  return flag;
}

exports.checkGPUTextureFormat = checkGPUTextureFormat;

/***/ }),

/***/ "3590":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGRUniform_1 = __webpack_require__("005f");

const WGRPipelineContextImpl_1 = __webpack_require__("374c");

exports.BufDataParamType = WGRPipelineContextImpl_1.BufDataParamType;

const IWGRUniformContext_1 = __webpack_require__("9069");

exports.WGRUniformParam = IWGRUniformContext_1.WGRUniformParam;

const WGHBufferStore_1 = __webpack_require__("5151");

const WGRBufferVisibility_1 = __webpack_require__("dc4d");

const WGRBufferView_1 = __webpack_require__("dfa8");

class SharedUniformObj {
  constructor() {
    this.map = new Map();
  }

}

exports.SharedUniformObj = SharedUniformObj;

class WGRUniformCtxInstance {
  constructor() {
    this.mUid = WGRUniformCtxInstance.sUid++;
    this.mList = [];
    this.mBuildTotal = 0;
    this.mBufObj = new IWGRUniformContext_1.WGRUniformBufObj();
    this.mFreeIds = [];
    this.ready = false;
    this.layoutAuto = true;
  }

  getFreeIndex() {
    if (this.mFreeIds.length > 0) return this.mFreeIds.pop();
    return -1;
  }

  getWGCtx() {
    return this.mBindGCtx.getWGCtx();
  }

  initialize(bindGCtx) {
    this.mBindGCtx = bindGCtx;
  }

  isEnabled() {
    return this.mBuildTotal > 0;
  }

  getBindGroupLayout(multisampled) {
    const ls = this.mList;
    const wp = ls[0];
    const ets = [];

    if (wp.bufDataParams) {
      const dps = wp.bufDataParams;

      for (let i = 0; i < dps.length; ++i) {
        const p = dps[i];
        p.visibility.binding = ets.length;

        if (!p.visibility.buffer) {
          p.visibility.toBufferForUniform();
        }

        ets.push(p.visibility);
      }
    }

    if (wp.texParams) {
      const tps = wp.texParams;

      for (let i = 0; i < tps.length; ++i) {
        const p = tps[i];
        let v = new WGRBufferVisibility_1.WGRBufferVisibility().toSamplerFiltering();
        v.binding = ets.length;
        ets.push(v);
        v = new WGRBufferVisibility_1.WGRBufferVisibility().toTextureFloat(p.texView.dimension);
        v.texture.multisampled = multisampled === true ? true : false;
        v.binding = ets.length;
        ets.push(v);
      }
    }

    if (ets.length < 1) {
      return undefined;
    } // console.log("WGRUniformCtxInstance:: getBindGroupLayout(), CCCCCCC ets: ", ets);


    const desc = {
      label: "(BindGroupLayout)WGRUniformCtxInstance" + this.mUid,
      entries: ets
    };
    this.mBindGroupLayout = this.mBindGCtx.createBindGroupLayout(desc);
    return this.mBindGroupLayout;
  }

  runBegin() {
    const ls = this.mList;

    if (this.ready && this.mBuildTotal < ls.length) {
      this.mBuildTotal = ls.length; // console.log("WGRUniformCtxInstance::runBegin(), XXX XXX XXX runBegin(), this.mList.length: ", this.mList.length);

      if (ls.length > 0) {
        this.mBindGroupDesc = null;
        this.mBufDataDescs = null;
        const wp = ls[0];

        if (!wp.uniformAppend && !wp.bufObj) {
          wp.bufObj = new IWGRUniformContext_1.WGRUniformBufObj();
        }

        const bo = wp.uniformAppend ? this.mBufObj : wp.bufObj;
        wp.bufObj = bo;
        const bufs = bo.oldBufs;

        if (bufs) {
          for (let i = 0; i < bufs.length; ++i) {
            bufs[i].destroy(); // console.log("0 destroy a private separate gpu buffer...");
          }
        }

        bo.buffers = [];
        bo.oldBufs = []; // console.log("WGRUniformCtxInstance::runBegin(), XXX wp.uniformAppend: ", wp.uniformAppend);
        // console.log("WGRUniformCtxInstance::runBegin(), XXX wp.bufObj: ", wp.bufObj);

        if (wp.uniformAppend) {
          for (let i = 1; i < ls.length; ++i) {
            ls[i].bufObj = wp.bufObj;
          }

          this.buildBufs(wp);
        } else {
          this.buildBufs(wp);

          for (let i = 1; i < ls.length; ++i) {
            let tbo = ls[i].bufObj;

            if (tbo) {
              const bufs = tbo.oldBufs;

              if (bufs) {
                for (let j = 0; j < bufs.length; ++j) {
                  bufs[j].destroy(); // console.log("1 destroy a private separate gpu buffer...");
                }
              }
            } else {
              tbo = ls[i].bufObj = new IWGRUniformContext_1.WGRUniformBufObj();
            }

            tbo.buffers = [];
            tbo.oldBufs = [];
            this.buildBufs(ls[i]);
          }
        } // console.log("XXX XXX bo.buffers: ", bo.buffers);


        for (let i = 0; i < ls.length; ++i) {
          this.createUniformWithWP(ls[i], i, true);
        }
      }
    }
  }

  buildBufs(wp) {
    if (wp.bufDataParams) {
      const bo = wp.bufObj;
      const ls = this.mList;
      const wgctx = this.mBindGCtx.getWGCtx();
      const store = WGHBufferStore_1.WGHBufferStore.getStore(wgctx);
      const append = wp.uniformAppend;
      const dps = wp.bufDataParams;

      for (let i = 0; i < dps.length; ++i) {
        const dp = dps[i];
        dp.visibility.binding = i;
        const sizes = new Array(dp.shared || !append ? 1 : ls.length);
        const uniformParam = {
          sizes,
          usage: dp.usage,
          arrayStride: dp.arrayStride
        };
        const ufv = dp.ufvalue;
        let buf = ufv.buffer;
        const bufData = ufv.bufData;

        if (!buf && bufData) {
          buf = bufData.buffer;
        }

        if (!buf) {
          let bufDataShared = bufData !== undefined && bufData.shared === true; // console.log("VVVVVVVVVVVV bufDataShared: ", bufDataShared, ", dp.shared: ", dp.shared);

          if (ufv.shared || bufDataShared) {
            let bufuid = bufDataShared && bufData.uid !== undefined ? bufData.uid : -1;
            let vuid = ufv.shared ? ufv.uid : bufuid; // console.log("VVVVVVVVVVVV shared: ", dp.shared,", vuid: ", vuid, ", bufuid: ", bufuid, ", byteLength: ", ufv.byteLength);

            if (store.hasWithUid(vuid)) {
              buf = store.getBufWithUid(vuid); // console.log("apply old shared uniform gpu buffer..., bufDataShared: ", bufDataShared, buf);
            } else {
              if (store.hasWithUid(bufuid)) {
                buf = store.getBufWithUid(bufuid);
              } else {
                // console.log("create new shared uniform gpu buffer...");
                uniformParam.sizes[0] = ls[0].bufDataParams[i].size;
                buf = this.mBindGCtx.createUniformsBuffer(uniformParam);
              }

              if (vuid < 0 || bufDataShared && !store.hasWithUid(bufuid)) {
                // console.log("bufData.uuid: ", bufData.uuid, ", create a new shared uniform gpu buffer and buf a view object...");
                const bufView = new WGRBufferView_1.WGRBufferView().setParam(bufData);
                bufView.buffer = buf;
                ufv.bufData = bufView;
                bufData.uid = bufView.uid;
                store.addWithUid(bufView.uid, bufView);
              }

              if (ufv.shared) {
                ufv.buffer = buf;

                if (bufData && bufData.uid === undefined) {
                  bufData.uid = ufv.uid;
                }

                store.addWithUid(ufv.uid, ufv);
              }
            }

            buf.shared = true;
          } else {
            if (append) {
              for (let j = 0; j < ls.length; ++j) {
                uniformParam.sizes[j] = ls[j].bufDataParams[i].size;
              }

              buf = this.mBindGCtx.createUniformsBuffer(uniformParam);
            } else {
              uniformParam.sizes[0] = ls[i].bufDataParams[i].size;
              buf = this.mBindGCtx.createUniformsBuffer(uniformParam);
            }
          }
        }

        if (!dp.shared && (!bufData || !(bufData.shared === true))) {
          bo.oldBufs.push(buf);
        }

        if (bufData && !bufData.buffer) {
          // console.log("XXXXX A-3 buf: ", buf);
          bufData.buffer = buf;
        }

        bo.buffers.push(buf); // console.log("PPP PPP PPP ,i: ",i," buf.size: ", buf.size);
      }
    }
  }

  createVers(wp) {
    const dps = wp.bufDataParams;
    const map = this.shdUniform.map;
    let versions = new Array(dps.length);

    for (let i = 0; i < dps.length; ++i) {
      const ufv = dps[i].ufvalue;

      if (ufv.shared === true) {
        const vid = ufv.uid;

        if (!map.has(vid)) {
          map.set(vid, {
            vid: ufv.uid,
            ver: -9,
            shared: true,
            shdVarName: ufv.shdVarName
          });
        }

        versions[i] = map.get(vid);
      } else {
        versions[i] = {
          vid: ufv.uid,
          ver: -9,
          shared: false,
          shdVarName: ufv.shdVarName
        };
      }
    }

    return versions;
  }

  createUvfs(wp) {
    const dps = wp.bufDataParams;
    let uvfs = new Array(dps.length);

    for (let i = 0; i < dps.length; ++i) {
      uvfs[i] = dps[i].ufvalue;
    }

    return uvfs;
  }

  createUniformWithWP(wp, index, force = false) {
    // console.log("createUniformWithWP(), wp.groupIndex: ", wp.groupIndex);
    const uf = wp.uniform;

    if (uf && (!uf.bindGroup || force)) {
      uf.buffers = wp.bufObj.buffers.slice(0);
      uf.versions = this.createVers(wp);
      uf.uvfs = this.createUvfs(wp); // console.log("uf.versions: ", uf.versions);

      let ivs = new Array(uf.uvfs.length);

      for (let i = 0; i < ivs.length; ++i) {
        ivs[i] = uf.uvfs[i].shared || !wp.uniformAppend ? 0 : uf.index;
      }

      uf.ivs = ivs;
      const dps = wp.bufDataParams;

      if (dps) {
        let desc = this.mBindGroupDesc;
        let ps = this.mBufDataDescs;

        if (!desc || !wp.uniformAppend) {
          if (!ps || !wp.uniformAppend) {
            ps = new Array(dps.length);

            for (let j = 0; j < dps.length; ++j) {
              const dp = dps[j];
              ps[j] = {
                index: index,
                buffer: uf.buffers[j],
                bufferSize: dp.size,
                shared: dp.shared
              };
            }

            this.mBufDataDescs = ps;
          }

          if (wp.uniformAppend) {
            for (let j = 0; j < ps.length; ++j) {
              ps[j].index = index;
            }
          }

          const layout = this.layoutAuto ? null : this.mBindGroupLayout;
          desc = this.mBindGCtx.createBindGroupDesc(wp.groupIndex, ps, wp.texParams, 0, layout);
          this.mBindGroupDesc = desc;
        }

        this.mBindGCtx.bindGroupDescUpdate(desc, ps, wp.texParams, index, wp.uniformAppend);
        uf.bindGroup = this.mBindGCtx.createBindGroupWithDesc(desc);
      } else {
        uf.bindGroup = this.mBindGCtx.createBindGroup(wp.groupIndex, null, wp.texParams);
      } // console.log("XXX XXX createUniformWithWP(), create a bindGroup: ", uf.bindGroup);


      uf.__$$updateSubUniforms();
    }
  }

  runEnd() {}

  createUniform(layoutName, groupIndex, bufDataParams, texParams, uniformAppend) {
    if (!(bufDataParams && bufDataParams.length || texParams && texParams.length)) {
      throw Error("Illegal operation !!!");
    }

    const index = this.getFreeIndex(); // console.log("WGRUniformCtxInstance::createUniform(), index: ", index, ", mUid: ", this.mUid);

    const u = new WGRUniform_1.WGRUniform(this);
    u.layoutName = layoutName;
    u.groupIndex = groupIndex;
    let wp;

    if (index >= 0) {
      wp = this.mList[index];
      u.index = index;
    } else {
      wp = new IWGRUniformContext_1.WGRUniformWrapper();
      u.index = this.mList.length;
      this.mList.push(wp);
    }

    wp.uniformAppend = uniformAppend === false ? false : true;
    wp.texParams = texParams;
    wp.bufDataParams = bufDataParams;
    wp.uniform = u;
    wp.enabled = true;

    if (index >= 0) {
      if (wp.uniformAppend) {
        const bo = wp.uniformAppend ? this.mBufObj : wp.bufObj;
        wp.bufObj = bo;
        this.createUniformWithWP(wp, index);
      } else {
        this.mBuildTotal = 0;
      }
    } // console.log("WGRUniformCtxInstance::createUniform(), this.mList.length: ", this.mList.length);


    return u;
  }

  updateUniformTextureView(u, texParams) {
    if (u && u.index >= 0 && this.mList[u.index]) {
      const wp = this.mList[u.index];
      const uf = wp.uniform;

      if (uf) {
        uf.bindGroup = this.mBindGCtx.createBindGroup(wp.groupIndex, wp.bufDataDescs, texParams);
      }
    }
  }

  removeUniform(u) {
    if (u && u.index >= 0 && this.mList[u.index]) {
      const wp = this.mList[u.index];

      if (wp.enabled) {
        // 注: remove 不一定是destroy，目前暂且这么处理，后续资源管理机制梳理的时候再调整。
        this.mFreeIds.push(u.index);
        wp.uniform = null;
        wp.bufObj = null;
        wp.texParams = null;
        wp.enabled = false;

        u.__$$destroy();

        console.log("WGRUniformCtxInstance::removeUniform(), clear an uniform wp instance.");
      }
    }
  }

  destroy() {
    if (this.mBindGCtx) {
      this.shdUniform = null;

      if (this.mBufObj) {
        this.mBufObj.destroy();
        this.mBufObj = null;
      }

      this.mBindGCtx = null;
      let ls = this.mList;

      for (let i = 0; i < ls.length; ++i) {
        if (this.mList[i]) {
          this.removeUniform(this.mList[i].uniform);
        }
      }
    }
  }

}

WGRUniformCtxInstance.sUid = 0;
exports.WGRUniformCtxInstance = WGRUniformCtxInstance;

/***/ }),

/***/ "36ce":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const GPURenderPipelineEmpty_1 = __webpack_require__("c812");

const WGRPipelineContextImpl_1 = __webpack_require__("374c");

exports.BufDataParamType = WGRPipelineContextImpl_1.BufDataParamType;
exports.VtxPipelinDescParam = WGRPipelineContextImpl_1.VtxPipelinDescParam;

const WGRPipelineShader_1 = __webpack_require__("70bd");

const WGRUniformContext_1 = __webpack_require__("b2fd");

exports.WGRUniformParam = WGRUniformContext_1.WGRUniformParam;

const WGRBindGroupContext_1 = __webpack_require__("8a88");

const Define_1 = __webpack_require__("af1b");
/**
 * one type shading shader, one WGRPipelineContext instance
 */


class WGRPipelineContext {
  constructor(wgCtx) {
    this.mUid = WGRPipelineContext.sUid++;
    this.mInit = true;
    this.mShader = new WGRPipelineShader_1.WGRPipelineShader();
    this.bindGroupCtx = new WGRBindGroupContext_1.WGRBindGroupContext();
    this.type = "render";
    this.pipeline = new GPURenderPipelineEmpty_1.GPURenderPipelineEmpty();
    this.shadinguuid = "";
    this.name = "PipelineContext";
    this.uniformCtx = new WGRUniformContext_1.WGRUniformContext(false);
    console.log("WGRPipelineContext::constructor() ...");

    if (wgCtx) {
      this.initialize(wgCtx);
    }
  }

  init() {
    if (this.mInit) {
      this.mInit = false;
      const ctx = this.mWGCtx;
      const p = this.mPipelineParams;

      if (p) {
        this.mShader.build(p, this.rpass); // console.log("WGRPipelineContext::init(), param:\n", p);

        let pipeGLayout;

        if (!this.uniformCtx.isLayoutAuto()) {
          const bindGLayout = this.uniformCtx.getBindGroupLayout(p.multisampleEnabled);
          const bindGroupLayouts = bindGLayout ? [bindGLayout] : [];
          pipeGLayout = ctx.device.createPipelineLayout({
            label: p.label,
            bindGroupLayouts
          }); // console.log("CCCCCCCCCC 01 bindGLayout: ", bindGLayout);
          // console.log("CCCCCCCCCC 02 pipeGLayout: ", pipeGLayout);
          // console.log("CCCCCCCCCC 03 pipeline use spec layout !!!");
        } else {
          pipeGLayout = ctx.device.createPipelineLayout({
            label: p.label,
            bindGroupLayouts: []
          });
        }

        this.bindGroupCtx.rpass = this.rpass;

        if (p.compShaderSrc) {
          const desc = {
            label: this.shadinguuid + "-comp-pl-" + this.mUid,
            layout: pipeGLayout,
            compute: p.compute
          }; // console.log("GPUShaderStage.COMPUTE: ", GPUShaderStage.COMPUTE);

          console.log("WGRPipelineContext::init(), create compute pieline desc: ", desc);
          this.comppipeline = ctx.device.createComputePipeline(desc);
          this.type = "compute";
          this.bindGroupCtx.comppipeline = this.comppipeline;
        } else {
          p.layout = pipeGLayout;
          p.label = this.shadinguuid + "-pl-" + this.mUid;
          console.log("WGRPipelineContext::init(), create rendering pieline desc: ", p);
          this.pipeline = ctx.device.createRenderPipeline(p);
          this.bindGroupCtx.pipeline = this.pipeline;
        }
      }
    }
  }

  destroy() {
    if (this.mWGCtx) {
      this.mWGCtx = null;
    }
  }

  runBegin() {
    this.init();
    this.uniformCtx.runBegin();
  }

  runEnd() {
    this.uniformCtx.runEnd();
  }

  initialize(wgCtx) {
    if (wgCtx && !this.mWGCtx) {
      this.mWGCtx = wgCtx;
      this.queue = wgCtx.queue;
      this.bindGroupCtx.initialize(wgCtx);
      this.uniformCtx.initialize(this.bindGroupCtx);
      this.mShader.initialize(wgCtx);
    }
  }

  getWGCtx() {
    return this.mWGCtx;
  }

  createRenderingPipeline(pipelineParams, descParams, vtxDesc) {
    const ctx = this.mWGCtx;

    if (descParams) {
      // if(!pipelineParams.compShaderSrc) {
      let location = 0;

      for (let k = 0; k < descParams.length; ++k) {
        const vtx = descParams[k].vertex;
        pipelineParams.addVertexBufferLayout({
          arrayStride: vtx.arrayStride,
          attributes: [],
          stepMode: "vertex"
        });
        const params = vtx.params;

        for (let i = 0; i < params.length; ++i) {
          const p = params[i];
          pipelineParams.addVertexBufferAttribute({
            shaderLocation: location++,
            offset: p.offset,
            format: p.format
          }, k);
        }
      }

      if (vtxDesc) {
        const primitive = pipelineParams.primitive;

        if (primitive && vtxDesc.vertex) {
          // console.log("vtxDesc.vertex.drawMode: ", vtxDesc.vertex.drawMode);
          switch (vtxDesc.vertex.drawMode) {
            case Define_1.WGRDrawMode.LINES:
              primitive.topology = "line-list";
              break;

            default:
              break;
          }
        }
      } // }

    }

    return this.createRenderPipeline(pipelineParams);
    /*
    if (pipelineParams.buildDeferred) {
        this.mPipelineParams = pipelineParams;
    } else {
        this.mShader.build(pipelineParams, this.rpass);
    }
    // console.log("createRenderPipeline(), pipelineParams:\n", pipelineParams);
    if (!this.mPipelineParams) {
        this.pipeline = ctx.device.createRenderPipeline(pipelineParams);
    }
    return this.pipeline;
    //*/
  }

  createRenderPipeline(pipelineParams) {
    const ctx = this.mWGCtx;

    if (pipelineParams.buildDeferred) {
      this.mPipelineParams = pipelineParams;
    } else {
      this.mShader.build(pipelineParams, this.rpass);
    } // console.log("createRenderPipeline(), pipelineParams:\n", pipelineParams);


    if (!this.mPipelineParams) {
      this.pipeline = ctx.device.createRenderPipeline(pipelineParams);
    }

    return this.pipeline;
  }

  createRenderPipelineWithBuf(pipelineParams, vtxDesc) {
    if (pipelineParams.compShaderSrc) {
      return this.createRenderPipeline(pipelineParams);
    } else {
      if (vtxDesc) {
        const vtx = vtxDesc.vertex;
        const vtxDescParams = vtx ? this.createRenderPipelineVtxParams(vtx.buffers, vtx.attributeIndicesArray) : [{}]; // console.log("vtxDescParams: ", vtxDescParams);

        return this.createRenderingPipeline(pipelineParams, vtxDescParams, vtxDesc);
      } else {
        return this.createRenderingPipeline(pipelineParams, [{}]);
      }
    }
  }

  createRenderPipelineVtxParam(vtxBuf, attributeIndices) {
    const p = {
      vertex: {
        arrayStride: vtxBuf.arrayStride,
        params: []
      }
    };
    const params = p.vertex.params;
    const ls = attributeIndices;

    for (let i = 0; i < attributeIndices.length; ++i) {
      params.push({
        offset: vtxBuf.vectorOffsets[ls[i]],
        format: vtxBuf.vectorFormats[ls[i]]
      });
    }

    return p;
  }

  createRenderPipelineVtxParams(vtxBufs, attributeIndicesArray) {
    const ls = new Array(attributeIndicesArray.length);

    for (let i = 0; i < attributeIndicesArray.length; ++i) {
      ls[i] = this.createRenderPipelineVtxParam(vtxBufs[i], attributeIndicesArray[i]);
    }

    return ls;
  }

}

WGRPipelineContext.sUid = 0;
exports.WGRPipelineContext = WGRPipelineContext;

/***/ }),

/***/ "374c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
;

/***/ }),

/***/ "37b8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function texDescriptorFilter(d) {
  if (!d) {
    return d;
  }

  let rd = d;

  if (d.diffuse) {
    rd = d.diffuse;
    rd.shdVarName = "diffuse";
  }

  if (d.color) {
    rd = d.color;
    rd.shdVarName = "color";
  }

  if (d.albedo) {
    rd = d.albedo;
    rd.shdVarName = "albedo";
  }

  if (d.normal) {
    rd = d.normal;
    rd.shdVarName = "normal";
  }

  if (d.ao) {
    rd = d.ao;
    rd.shdVarName = "ao";
  }

  if (d.metallic) {
    rd = d.metallic;
    rd.shdVarName = "metallic";
  }

  if (d.roughness) {
    rd = d.roughness;
    rd.shdVarName = "roughness";
  }

  if (d.specularEnv) {
    rd = d.specularEnv;
    rd.shdVarName = "specularEnv";
  }

  if (d.arm) {
    rd = d.arm;
    rd.shdVarName = "arm";
  }

  if (d.parallax) {
    rd = d.parallax;
    rd.shdVarName = "parallax";
  } // if (d.height) {
  // 	rd = d.height;
  // 	rd.shdVarName = "height";
  // }


  if (d.displacement) {
    rd = d.displacement;
    rd.shdVarName = "displacement";
  }

  if (d.specular) {
    rd = d.specular;
    rd.shdVarName = "specular";
  }

  return rd;
}

exports.texDescriptorFilter = texDescriptorFilter;

/***/ }),

/***/ "37f2":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const util_1 = __webpack_require__("660c");

const math_1 = __webpack_require__("89ff"); // thanks: https://github.com/vilyLei/cts/blob/main/src/webgpu/util/conversion.ts

/**
 * Encodes three JS `number` values into RGB9E5, returned as an integer-valued JS `number`.
 *
 * RGB9E5 represents three partial-precision floating-point numbers encoded into a single 32-bit
 * value all sharing the same 5-bit exponent.
 * There is no sign bit, and there is a shared 5-bit biased (15) exponent and a 9-bit
 * mantissa for each channel. The mantissa does NOT have an implicit leading "1.",
 * and instead has an implicit leading "0.".
 *
 * @see https://registry.khronos.org/OpenGL/extensions/EXT/EXT_texture_shared_exponent.txt
 */


function packRGB9E5UFloat(r, g, b) {
  const N = 9; // number of mantissa bits

  const Emax = 31; // max exponent

  const B = 15; // exponent bias

  const sharedexp_max = ((1 << N) - 1) / (1 << N) * 2 ** (Emax - B);
  const red_c = math_1.clamp(r, {
    min: 0,
    max: sharedexp_max
  });
  const green_c = math_1.clamp(g, {
    min: 0,
    max: sharedexp_max
  });
  const blue_c = math_1.clamp(b, {
    min: 0,
    max: sharedexp_max
  });
  const max_c = Math.max(red_c, green_c, blue_c);
  const exp_shared_p = Math.max(-B - 1, Math.floor(Math.log2(max_c))) + 1 + B;
  const max_s = Math.floor(max_c / 2 ** (exp_shared_p - B - N) + 0.5);
  const exp_shared = max_s === 1 << N ? exp_shared_p + 1 : exp_shared_p;
  const scalar = 1 / 2 ** (exp_shared - B - N);
  const red_s = Math.floor(red_c * scalar + 0.5);
  const green_s = Math.floor(green_c * scalar + 0.5);
  const blue_s = Math.floor(blue_c * scalar + 0.5);
  util_1.assert(red_s >= 0 && red_s <= 0b111111111);
  util_1.assert(green_s >= 0 && green_s <= 0b111111111);
  util_1.assert(blue_s >= 0 && blue_s <= 0b111111111);
  util_1.assert(exp_shared >= 0 && exp_shared <= 0b11111);
  return (exp_shared << 27 | blue_s << 18 | green_s << 9 | red_s) >>> 0;
}

exports.packRGB9E5UFloat = packRGB9E5UFloat;

/***/ }),

/***/ "3850":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function checkMaterialRPasses(ms, rpasses) {
  // const rpasses = param.rpasses;
  if (rpasses) {
    const ms = this.materials; // 这里的实现需要优化, 因为一个material实际上可以加入到多个rpass中去

    let len = Math.min(rpasses.length, ms.length);

    for (let i = 0; i < len; ++i) {
      const rpass = ms[i].rpass;

      if (!rpass || !rpass.rpass.node) {
        ms[i].rpass = rpasses[i];
      }
    }
  }
}

exports.checkMaterialRPasses = checkMaterialRPasses;

/***/ }),

/***/ "3e2f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "3e40":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2023 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const MathConst_1 = __importDefault(__webpack_require__("ec7b"));

const Vector3_1 = __importDefault(__webpack_require__("af80"));

class AABB {
  constructor() {
    this.m_long = 100.0;
    this.m_width = 100.0;
    this.m_height = 100.0;
    this.m_halfLong = 50.0;
    this.m_halfWidth = 50.0;
    this.m_halfHeight = 50.0;
    this.m_tempV = new Vector3_1.default();
    this.version = -1;
    this.radius = 50;
    this.radius2 = 2500;
    this.min = new Vector3_1.default();
    this.max = new Vector3_1.default();
    this.center = new Vector3_1.default();
    this.reset();
  }

  getLong() {
    return this.m_long;
  }

  getWidth() {
    return this.m_width;
  }

  getHeight() {
    return this.m_height;
  }

  reset() {
    const v0 = this.min;
    const v1 = this.max;
    v0.x = v0.y = v0.z = MathConst_1.default.MATH_MAX_POSITIVE;
    v1.x = v1.y = v1.z = MathConst_1.default.MATH_MIN_NEGATIVE;
  }

  equals(ab) {
    return this.min.equalsXYZ(ab.min) && this.max.equalsXYZ(ab.max);
  }

  setVolume(width, height, long) {
    this.m_width = width;
    this.m_height = height;
    this.m_long = long;
    this.m_halfLong = 0.5 * this.m_long;
    this.m_halfWidth = 0.5 * this.m_width;
    this.m_halfHeight = 0.5 * this.m_height;
    this.max.x = this.center.x + this.m_halfWidth;
    this.max.y = this.center.y + this.m_halfHeight;
    this.max.z = this.center.z + this.m_halfLong;
    this.min.x = this.center.x - this.m_halfWidth;
    this.min.y = this.center.y - this.m_halfHeight;
    this.min.z = this.center.z - this.m_halfLong;
    this.radius2 = this.m_halfWidth * this.m_halfWidth + this.m_halfHeight * this.m_halfHeight + this.m_halfLong * this.m_halfLong;
    this.radius = Math.sqrt(this.radius2);
  }

  union(ab) {
    this.addPosition(ab.min);
    this.addPosition(ab.max);
    return this;
  }

  addPosition(pv) {
    this.addXYZ(pv.x, pv.y, pv.z);
    return this;
  }

  addXYZ(pvx, pvy, pvz) {
    const min = this.min;
    const max = this.max;
    if (min.x > pvx) min.x = pvx;
    if (max.x < pvx) max.x = pvx;
    if (min.y > pvy) min.y = pvy;
    if (max.y < pvy) max.y = pvy;
    if (min.z > pvz) min.z = pvz;
    if (max.z < pvz) max.z = pvz;
  }

  addFloat32Arr(vs, step = 3) {
    let len = vs.length;

    if (step >= 3) {
      for (let i = 0; i < len;) {
        this.addXYZ(vs[i], vs[i + 1], vs[i + 2]);
        i += step;
      }
    }

    if (step == 2) {
      for (let i = 0; i < len;) {
        this.addXYZ(vs[i], vs[i + 1], 0.0);
        i += step;
      }
    }
  }

  addFloat32AndIndices(vs, indices, step = 3) {
    let len = indices.length;
    let i;

    if (step >= 3) {
      for (let k = 0; k < len; k++) {
        i = indices[k] * step;
        this.addXYZ(vs[i++], vs[i++], vs[i]);
      }
    } else if (step == 2) {
      for (let k = 0; k < len; k++) {
        i = indices[k] * step;
        this.addXYZ(vs[i++], vs[i], 0.0);
      }
    }
  }

  getClosePosition(in_pos, out_pos, bias = 0.0) {
    const min = this.min;
    const max = this.max;
    out_pos.copyFrom(in_pos);

    if (out_pos.x < min.x) {
      out_pos.x = min.x + bias;
    } else if (out_pos.x > max.x) {
      out_pos.x = max.x - bias;
    }

    if (out_pos.y < min.y) {
      out_pos.y = min.y + bias;
    } else if (out_pos.y > max.y) {
      out_pos.y = max.y - bias;
    }

    if (out_pos.z < min.z) {
      out_pos.z = min.z + bias;
    } else if (out_pos.z > max.z) {
      out_pos.z = max.z - bias;
    }
  } // @param	v	Vector3 instance


  containsV(v) {
    if (v.x < this.min.x || v.x > this.max.x) return false;
    if (v.y < this.min.y || v.y > this.max.y) return false;
    if (v.z < this.min.z || v.z > this.max.z) return false;
    return true;
  } // 是否包含某一点(同一坐标空间的点)


  containsXY(vx, vy) {
    if (vx < this.min.x || vx > this.max.x) return false;
    if (vy < this.min.y || vy > this.max.y) return false;
    return true;
  } // 是否包含某一点(同一坐标空间的点)


  containsXZ(vx, vz) {
    if (vx < this.min.x || vx > this.max.x) return false;
    if (vz < this.min.z || vz > this.max.z) return false;
    return true;
  } // 是否包含某一点(同一坐标空间的点)


  containsYZ(vy, vz) {
    if (vy < this.min.y || vy > this.max.y) return false;
    if (vz < this.min.z || vz > this.max.z) return false;
    return true;
  }

  copyFrom(ab) {
    //this.setRadius(ab.getRadius());
    this.radius = ab.radius;
    this.radius2 = ab.radius2; //this.setRadiusSquared(ab.getRadiusSquared());

    this.min.copyFrom(ab.min);
    this.max.copyFrom(ab.max); //this.getOCenter().copyFrom(ab.getOCenter());

    this.center.copyFrom(ab.center);
    this.updateVolume();
    this.version = ab.version;
    return this;
  }

  expand(bias) {
    this.min.subtractBy(bias);
    this.max.addBy(bias);
    return this;
  }

  updateVolume() {
    this.m_width = this.max.x - this.min.x;
    this.m_height = this.max.y - this.min.y;
    this.m_long = this.max.z - this.min.z;
    this.m_halfLong = 0.5 * this.m_long;
    this.m_halfWidth = 0.5 * this.m_width;
    this.m_halfHeight = 0.5 * this.m_height;
    ++this.version;
    return this;
  }

  updateThis() {
    this.center.x = 0.5 * this.m_width;
    this.center.y = 0.5 * this.m_height;
    this.center.z = 0.5 * this.m_long;
    this.m_halfLong = this.center.z;
    this.m_halfWidth = this.center.x;
    this.m_halfHeight = this.center.y;
    this.radius2 = this.m_halfWidth * this.m_halfWidth + this.m_halfHeight * this.m_halfHeight + this.m_halfLong * this.m_halfLong;
    this.radius = Math.sqrt(this.radius2);
    this.center.addBy(this.min);
    ++this.version;
  }

  update() {
    // x
    this.m_width = this.max.x;

    if (this.min.x > this.max.x) {
      this.max.x = this.min.x;
      this.min.x = this.m_width;
    }

    this.m_width = this.max.x - this.min.x; // y

    this.m_height = this.max.y;

    if (this.min.y > this.max.y) {
      this.max.y = this.min.y;
      this.min.y = this.m_height;
    }

    this.m_height = this.max.y - this.min.y; // z

    this.m_long = this.max.z;

    if (this.min.z > this.max.z) {
      this.max.z = this.min.z;
      this.min.z = this.m_long;
    }

    this.m_long = this.max.z - this.min.z;
    this.updateThis();
  }

  updateFast() {
    this.m_width = this.max.x - this.min.x;
    this.m_height = this.max.y - this.min.y;
    this.m_long = this.max.z - this.min.z;
    this.updateThis();
  }

  toString() {
    return "[AABB(min->" + this.min + ",size(" + this.m_width + "," + this.m_height + "," + this.m_long + "))]";
  } // max vecs sphere range intersect calc


  sphereIntersect(centerV, radius) {
    this.m_tempV.x = this.center.x - centerV.x;
    this.m_tempV.y = this.center.y - centerV.y;
    this.m_tempV.z = this.center.z - centerV.z;
    let dis = this.m_tempV.getLengthSquared();

    if (dis < this.radius2) {
      return true;
    }

    radius += this.radius;
    radius *= radius;
    return radius >= dis;
  }

}

exports.default = AABB;

/***/ }),

/***/ "406a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const IdentityMat4Data = new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
exports.IdentityMat4Data = IdentityMat4Data;

/***/ }),

/***/ "4145":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGRUnitState_1 = __webpack_require__("222c");

class WGREntityNode {
  constructor() {
    this.blockid = -1;
    this.entityid = -1;
    this.rstate = new WGRUnitState_1.WGRUnitState();
  }

}

exports.WGREntityNode = WGREntityNode;

/***/ }),

/***/ "4942":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const AABB_1 = __importDefault(__webpack_require__("3e40"));

const Plane_1 = __importDefault(__webpack_require__("7a70"));

const MathConst_1 = __importDefault(__webpack_require__("ec7b"));

const Vector3_1 = __importDefault(__webpack_require__("af80"));

const minv = MathConst_1.default.MATH_MIN_POSITIVE;
const maxv = MathConst_1.default.MATH_MAX_NEGATIVE;

class Frustum {
  constructor() {
    this.mTempV = new Vector3_1.default();
    this.mTempV1 = new Vector3_1.default();
    this.mFpns = [new Vector3_1.default(), new Vector3_1.default(), new Vector3_1.default(), new Vector3_1.default(), new Vector3_1.default(), new Vector3_1.default()];
    this.mFpds = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    this.near = 0.1;
    this.far = 5000;
    this.aspect = 1;
    /**
     * fov radian value
     */

    this.fov = Math.PI * 0.25;
    this.perspective = true;
    this.viewWidth = 800;
    this.viewHeight = 600;
    this.viewHalfWidth = 400;
    this.viewHalfHeight = 300;
    this.bounds = new AABB_1.default();
    this.nearHalfWidth = 0.5;
    this.nearHalfHeight = 0.5;
    this.nearWidth = 1;
    this.nearHeight = 1;
    this.worldDirec = new Vector3_1.default();
    this.nearWorldCenter = new Vector3_1.default();
    this.farWorldCenter = new Vector3_1.default();
    /**
     * eight vertices: 4 far points, 4 near points
     */

    this.vertices = [new Vector3_1.default(), new Vector3_1.default(), new Vector3_1.default(), new Vector3_1.default(), new Vector3_1.default(), new Vector3_1.default(), new Vector3_1.default(), new Vector3_1.default()]; // world space front,back ->(view space -z,z), world space left,right ->(view space -x,x),world space top,bottm ->(view space y,-y)

    this.planes = [new Plane_1.default(), new Plane_1.default(), new Plane_1.default(), new Plane_1.default(), new Plane_1.default(), new Plane_1.default()];
  }

  setParam(fov, near, far, aspect) {
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.aspect = aspect;
  }

  setViewSize(pw, ph) {
    this.viewWidth = pw;
    this.viewHeight = ph;
    this.viewHalfWidth = pw * 0.5;
    this.viewHalfHeight = ph * 0.5;
  }

  update(invViewMat) {
    this.calcParam(invViewMat);
  }
  /**
   * @param w_cv 世界坐标位置
   * @param radius 球体半径
   * @returns 0表示完全不会再近平面内, 1表示完全在近平面内, 2表示和近平面相交
   */


  visiTestNearPlaneWithSphere(w_cv, radius) {
    const ps = this.mFpns;
    const v = ps[1].dot(w_cv) - this.mFpds[1];

    if (v - radius > minv) {
      // 表示完全在近平面之外，也就是前面
      return 0;
    } else if (v + radius < maxv) {
      // 表示完全在近平面内, 也就是后面
      return 1;
    } // 表示和近平面相交


    return 2;
  }

  visiTestSphere2(w_cv, radius) {
    const ps = this.mFpns;
    let boo = ps[0].dot(w_cv) - this.mFpds[0] - radius > minv;
    if (boo) return false;
    boo = ps[1].dot(w_cv) - this.mFpds[1] - radius > minv;
    if (boo) return false;
    boo = ps[2].dot(w_cv) - this.mFpds[2] - radius > minv;
    if (boo) return false;
    boo = ps[3].dot(w_cv) - this.mFpds[3] - radius > minv;
    if (boo) return false;
    boo = ps[4].dot(w_cv) - this.mFpds[4] - radius > minv;
    if (boo) return false;
    boo = ps[5].dot(w_cv) - this.mFpds[5] - radius > minv;
    if (boo) return false;
    return true;
  }

  visiTestSphere3(w_cv, radius, farROffset) {
    const ps = this.mFpns;
    let boo = ps[0].dot(w_cv) - this.mFpds[0] + farROffset - radius > minv;
    if (boo) return false;
    boo = ps[1].dot(w_cv) - this.mFpds[1] - radius > minv;
    if (boo) return false;
    boo = ps[2].dot(w_cv) - this.mFpds[2] - radius > minv;
    if (boo) return false;
    boo = ps[3].dot(w_cv) - this.mFpds[3] - radius > minv;
    if (boo) return false;
    boo = ps[4].dot(w_cv) - this.mFpds[4] - radius > minv;
    if (boo) return false;
    boo = ps[5].dot(w_cv) - this.mFpds[5] - radius > minv;
    if (boo) return false;
    return true;
  }

  visiTestPosition(pv) {
    const ps = this.mFpns;
    let boo = ps[0].dot(pv) - this.mFpds[0] > minv;
    if (boo) return false;
    boo = ps[1].dot(pv) - this.mFpds[1] > minv;
    if (boo) return false;
    boo = ps[2].dot(pv) - this.mFpds[2] > minv;
    if (boo) return false;
    boo = ps[3].dot(pv) - this.mFpds[3] > minv;
    if (boo) return false;
    boo = ps[4].dot(pv) - this.mFpds[4] > minv;
    if (boo) return false;
    boo = ps[5].dot(pv) - this.mFpds[5] > minv;
    if (boo) return false;
    return true;
  }

  visiTestPlane(nv, distance) {
    const ls = this.planes;
    let f0 = nv.dot(ls[0].position) - distance;
    let f1 = f0 * (nv.dot(ls[1].position) - distance);
    if (f1 < minv) return true;
    f1 = f0 * (nv.dot(ls[2].position) - distance);
    if (f1 < minv) return true;
    f1 = f0 * (nv.dot(ls[3].position) - distance);
    if (f1 < minv) return true;
    f1 = f0 * (nv.dot(ls[4].position) - distance);
    if (f1 < minv) return true;
    f1 = f0 * (nv.dot(ls[5].position) - distance);
    if (f1 < minv) return true;
    return false;
  } // frustum intersect sphere in wrod space


  visiTestSphere(w_cv, radius) {
    const ls = this.planes;
    let boo = this.bounds.sphereIntersect(w_cv, radius);

    if (boo) {
      let pf0 = ls[0].intersectSphere(w_cv, radius);
      let pf1 = ls[1].intersectSphere(w_cv, radius);

      if (pf0 * pf1 >= 0) {
        if (ls[0].intersectBoo || ls[1].intersectBoo) {} else {
          return false;
        }
      }

      pf0 = ls[2].intersectSphere(w_cv, radius);
      pf1 = ls[3].intersectSphere(w_cv, radius);

      if (pf0 * pf1 >= 0) {
        if (ls[2].intersectBoo || ls[3].intersectBoo) {} else {
          return false;
        }
      }

      pf0 = ls[4].intersectSphere(w_cv, radius);
      pf1 = ls[5].intersectSphere(w_cv, radius);

      if (pf0 * pf1 >= 0) {
        if (ls[4].intersectBoo || ls[5].intersectBoo) {} else {
          return false;
        }
      }

      return true;
    }

    return false;
  } // visibility test
  // 可见性检测这边可以做的更精细，例如上一帧检测过的对象如果摄像机没有移动而且它自身也没有位置等变化，就可以不用检测
  // 例如精细检测可以分类: 圆球，圆柱体，长方体 等不同的检测模型计算方式会有区别


  visiTestAABB(ab) {
    let w_cv = ab.center;
    let radius = ab.radius;
    let boo = this.bounds.sphereIntersect(w_cv, radius);
    const ls = this.planes;

    if (boo) {
      let pf0 = ls[0].intersectSphere(w_cv, radius);
      let pf1 = ls[1].intersectSphere(w_cv, radius);

      if (pf0 * pf1 >= 0) {
        if (ls[0].intersectBoo || ls[1].intersectBoo) {} else {
          return false;
        }
      }

      pf0 = ls[2].intersectSphere(w_cv, radius);
      pf1 = ls[3].intersectSphere(w_cv, radius);

      if (pf0 * pf1 >= 0) {
        if (ls[2].intersectBoo || ls[3].intersectBoo) {} else {
          return false;
        }
      }

      pf0 = ls[4].intersectSphere(w_cv, radius);
      pf1 = ls[5].intersectSphere(w_cv, radius);

      if (pf0 * pf1 >= 0) {
        if (ls[4].intersectBoo || ls[5].intersectBoo) {} else {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  calcParam(invViewMat) {
    let plane;
    let halfMinH = this.viewHalfHeight;
    let halfMinW = this.viewHalfWidth;
    let halfMaxH = halfMinH;
    let halfMaxW = halfMinW;

    if (this.perspective) {
      const tanv = Math.tan(this.fov * 0.5);
      halfMinH = this.near * tanv;
      halfMinW = halfMinH * this.aspect;
      halfMaxH = this.far * tanv;
      halfMaxW = halfMaxH * this.aspect;
    }

    const frustumPositions = this.vertices;
    const frustumPlanes = this.planes;
    this.nearHalfWidth = halfMinW;
    this.nearHalfHeight = halfMinH;
    this.nearWidth = 2.0 * halfMinW;
    this.nearHeight = 2.0 * halfMinH; // inner view space

    this.nearWorldCenter.setXYZ(0, 0, -this.near);
    this.farWorldCenter.setXYZ(0, 0, -this.far);
    invViewMat.transformVectorSelf(this.nearWorldCenter);
    invViewMat.transformVectorSelf(this.farWorldCenter);
    const direc = this.worldDirec.subVecsTo(this.farWorldCenter, this.nearWorldCenter);
    direc.normalize(); // front face, far plane

    plane = frustumPlanes[0];
    plane.nv.copyFrom(direc);
    plane.distance = plane.nv.dot(this.farWorldCenter);
    plane.position.copyFrom(this.farWorldCenter); // back face, near face

    plane = frustumPlanes[1];
    plane.nv.copyFrom(frustumPlanes[0].nv);
    plane.distance = plane.nv.dot(this.nearWorldCenter);
    plane.position.copyFrom(this.nearWorldCenter); // far face

    frustumPositions[0].setXYZ(-halfMaxW, -halfMaxH, -this.far);
    frustumPositions[1].setXYZ(halfMaxW, -halfMaxH, -this.far);
    frustumPositions[2].setXYZ(halfMaxW, halfMaxH, -this.far);
    frustumPositions[3].setXYZ(-halfMaxW, halfMaxH, -this.far); // near face

    frustumPositions[4].setXYZ(-halfMinW, -halfMinH, -this.near);
    frustumPositions[5].setXYZ(halfMinW, -halfMinH, -this.near);
    frustumPositions[6].setXYZ(halfMinW, halfMinH, -this.near);
    frustumPositions[7].setXYZ(-halfMinW, halfMinH, -this.near);
    const invM = invViewMat;
    invM.transformVectorSelf(frustumPositions[0]);
    invM.transformVectorSelf(frustumPositions[1]);
    invM.transformVectorSelf(frustumPositions[2]);
    invM.transformVectorSelf(frustumPositions[3]);
    invM.transformVectorSelf(frustumPositions[4]);
    invM.transformVectorSelf(frustumPositions[5]);
    invM.transformVectorSelf(frustumPositions[6]);
    invM.transformVectorSelf(frustumPositions[7]);
    this.bounds.reset();

    for (let i = 0; i < 8; ++i) {
      this.bounds.addPosition(frustumPositions[i]);
    }

    this.bounds.updateFast();
    const cross = Vector3_1.default.Cross; // bottom

    this.mTempV.subVecsTo(frustumPositions[0], frustumPositions[4]);
    let v0 = frustumPositions[1];
    this.mTempV1.subVecsTo(frustumPositions[1], frustumPositions[5]);
    plane = frustumPlanes[3];
    cross(this.mTempV1, this.mTempV, plane.nv);
    plane.nv.normalize();
    plane.distance = plane.nv.dot(v0);
    plane.position.copyFrom(v0); // top

    this.mTempV.subVecsTo(frustumPositions[3], frustumPositions[7]);
    v0 = frustumPositions[2];
    this.mTempV1.subVecsTo(frustumPositions[2], frustumPositions[6]);
    plane = frustumPlanes[2];
    cross(this.mTempV1, this.mTempV, plane.nv);
    plane.nv.normalize();
    plane.distance = plane.nv.dot(v0);
    plane.position.copyFrom(v0); // left

    this.mTempV.subVecsTo(frustumPositions[0], frustumPositions[4]);
    v0 = frustumPositions[3];
    this.mTempV1.subVecsTo(frustumPositions[3], frustumPositions[7]);
    plane = frustumPlanes[4];
    cross(this.mTempV, this.mTempV1, plane.nv);
    plane.nv.normalize();
    plane.distance = plane.nv.dot(v0);
    plane.position.copyFrom(v0); // right

    this.mTempV.subVecsTo(frustumPositions[1], frustumPositions[5]);
    v0 = frustumPositions[2];
    this.mTempV1.subVecsTo(frustumPositions[2], frustumPositions[6]);
    plane = frustumPlanes[5];
    cross(this.mTempV, this.mTempV1, plane.nv);
    plane.nv.normalize();
    plane.distance = plane.nv.dot(v0);
    plane.position.copyFrom(v0);
    const fpna = this.mFpns;
    fpna[0].copyFrom(frustumPlanes[0].nv);
    fpna[1].copyFrom(frustumPlanes[1].nv);
    fpna[1].scaleBy(-1.0);
    fpna[2].copyFrom(frustumPlanes[2].nv);
    fpna[3].copyFrom(frustumPlanes[3].nv);
    fpna[3].scaleBy(-1.0);
    fpna[4].copyFrom(frustumPlanes[4].nv);
    fpna[4].scaleBy(-1.0);
    fpna[5].copyFrom(frustumPlanes[5].nv);
    const fpda = this.mFpds;
    fpda[0] = frustumPlanes[0].distance;
    fpda[1] = -frustumPlanes[1].distance;
    fpda[2] = frustumPlanes[2].distance;
    fpda[3] = -frustumPlanes[3].distance;
    fpda[4] = -frustumPlanes[4].distance;
    fpda[5] = frustumPlanes[5].distance;
  }

}

exports.Frustum = Frustum;

/***/ }),

/***/ "4e74":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2023 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const Matrix4_1 = __importDefault(__webpack_require__("c6d1"));

class Matrix4Pool {
  static GetMatTotal() {
    return Matrix4Pool.s_mtotal;
  }

  static GetFS32Arr() {
    return Matrix4Pool.s_mfs32Arr;
  }

  static SetFS32Arr(fs32) {
    Matrix4Pool.s_mfs32Arr = fs32;
    let total = Matrix4Pool.s_mtotal;
    let list = Matrix4Pool.s_matList;

    for (let i = 0; i < total; ++i) {
      list[i].setF32Arr(fs32);
    }
  }

  static GetFreeId() {
    if (Matrix4Pool.m_freeIdList.length > 0) {
      return Matrix4Pool.m_freeIdList.pop();
    }

    return -1;
  }

  static Allocate(total) {
    if (total < 1024) {
      total = 1024;
    }

    if (Matrix4Pool.s_mtotal < 1) {
      console.log("Matrix4Pool::Allocate(), Matrix total: " + total);
      Matrix4Pool.s_mtotal = total;
      Matrix4Pool.s_mfs32Arr = new Float32Array(total * 16);
      let i = 0;
      let mat = new Matrix4_1.default(Matrix4Pool.s_mfs32Arr, i * 16);
      let uid = mat.getUid();
      Matrix4Pool.s_baseUid = uid;
      Matrix4Pool.s_maxUid = uid + total;

      for (; i < uid; ++i) {
        Matrix4Pool.s_matList.push(null);
        Matrix4Pool.s_matFlagList.push(Matrix4Pool.s_FLAG_FREE);
      }

      Matrix4Pool.s_matList.push(mat);
      Matrix4Pool.s_matFlagList.push(Matrix4Pool.s_FLAG_FREE);
      Matrix4Pool.m_freeIdList.push(mat.getUid());

      for (i = 1; i < total; ++i) {
        mat = new Matrix4_1.default(Matrix4Pool.s_mfs32Arr, i * 16);
        Matrix4Pool.s_matList.push(mat);
        Matrix4Pool.s_matFlagList.push(Matrix4Pool.s_FLAG_FREE);
        Matrix4Pool.m_freeIdList.push(mat.getUid());
      }
    }
  }

  static GetMatrix() {
    let mat = null;
    let index = Matrix4Pool.GetFreeId() - Matrix4Pool.s_baseUid;

    if (index >= 0) {
      mat = Matrix4Pool.s_matList[index];
      mat.identity();
      Matrix4Pool.s_matFlagList[index] = Matrix4Pool.s_FLAG_BUSY; //console.log("Get a free Matrix !!!");
    } else {
      //console.error("Matrix4Pool::GetMatrix(), Error Matrix4Pool is empty !!!");
      mat = new Matrix4_1.default();
    }

    return mat;
  }

  static RetrieveMatrix(mat) {
    if (mat != null) {
      let uid = mat.getUid();

      if (uid >= Matrix4Pool.s_baseUid && uid < Matrix4Pool.s_maxUid) {
        if (Matrix4Pool.s_matFlagList[uid - Matrix4Pool.s_baseUid] == Matrix4Pool.s_FLAG_BUSY) {
          Matrix4Pool.m_freeIdList.push(uid);
          Matrix4Pool.s_matFlagList[uid - Matrix4Pool.s_baseUid] = Matrix4Pool.s_FLAG_FREE;
        }
      }
    }
  }

}

Matrix4Pool.s_FLAG_BUSY = 1;
Matrix4Pool.s_FLAG_FREE = 0;
Matrix4Pool.s_matList = [];
Matrix4Pool.s_matFlagList = [];
Matrix4Pool.m_freeIdList = [];
Matrix4Pool.s_mfs32Arr = null;
Matrix4Pool.s_baseUid = 0;
Matrix4Pool.s_maxUid = 0;
Matrix4Pool.s_mtotal = 0;
exports.default = Matrix4Pool;

/***/ }),

/***/ "5151":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 用于统一的gpu端buf资源管理
 * WGH(Web GPU Hardware)
 */

class WGHBufferStoreIns {
  constructor() {
    this.mBufMap = new Map();
  }

  addWithUid(uid, buf) {
    if (buf) {
      const map = this.mBufMap;

      if (!map.has(uid)) {
        map.set(uid, buf);
      }
    }
  }

  removeWithUid(uid) {
    const map = this.mBufMap;

    if (map.has(uid)) {
      map.delete(uid);
    }
  }

  getWithUid(uid) {
    return this.mBufMap.get(uid);
  }

  getBufWithUid(uid) {
    if (this.mBufMap.has(uid)) {
      return this.mBufMap.get(uid).buffer;
    }

    return null;
  }

  hasWithUid(uid) {
    const map = this.mBufMap;
    return map.has(uid);
  }

}

class WGHBufferStore {
  static getStore(ctx) {
    const i = ctx.uid;
    const sts = WGHBufferStore.sStores;

    if (!sts[i]) {
      sts[i] = new WGHBufferStoreIns();
    }

    return sts[i];
  }

}

WGHBufferStore.sStores = new Array(1024);
exports.WGHBufferStore = WGHBufferStore;

/***/ }),

/***/ "551f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const RSEntityFlag_1 = __importDefault(__webpack_require__("9711"));

const ROTransform_1 = __importDefault(__webpack_require__("c433"));

const AABB_1 = __importDefault(__webpack_require__("3e40"));

const WGRUnitState_1 = __webpack_require__("222c");

const Vector3_1 = __importDefault(__webpack_require__("af80"));

const Entity3DParam_1 = __webpack_require__("793b");

exports.TransformParam = Entity3DParam_1.TransformParam;
exports.getUniformValueFromParam = Entity3DParam_1.getUniformValueFromParam;
exports.Entity3DParam = Entity3DParam_1.Entity3DParam;

class Entity3D {
  constructor(param) {
    this.mUid = Entity3D.sUid++;
    this.mTransVer = -1;
    /**
     * renderer scene entity flag, be used by the renderer system
     * 第0位到第19位总共20位存放自身在space中的 index id(最小值为1, 最大值为1048575,默认值是0, 也就是最多只能展示1048575个entitys),
     * 第20位开始到26位为总共7位止存放在renderer中的状态数据(renderer unique id and others)
     * 第27位存放是否在container里面
     * 第28位开始到29位总共二位存放renderer 载入状态 的相关信息
     * 第30位位存放是否渲染运行时排序
     */

    this.__$rseFlag = RSEntityFlag_1.default.DEFAULT;
    this.__$bids = [];
    this.cameraViewing = true;
    this.rstate = new WGRUnitState_1.WGRUnitState();
    /**
     * mouse interaction enabled
     */

    this.mouseEnabled = false;
    if (!param) param = {};

    if (!(param.building === false)) {
      this.init(param);
    }

    this.mDescParam = param;
  }

  init(param) {
    this.cameraViewing = param.cameraViewing === false ? false : true;
    let transformEnabled = !param || param.transformEnabled === undefined || param.transformEnabled === true;
    let transform;

    if (param) {
      transform = param.transform;
      transformEnabled = transformEnabled || this.transform !== undefined;
    }

    if (transformEnabled) {
      if (transform) {
        const fs32 = transform;

        if (fs32.byteLength !== undefined) {
          this.transform = ROTransform_1.default.Create({
            fs32
          });
        }

        if (!this.transform) {
          const matrix = transform;

          if (matrix.identity !== undefined) {
            this.transform = ROTransform_1.default.Create({
              matrix
            });
          }
        }

        if (!this.transform) {
          const trans = transform;

          if (trans.getMatrixFS32 !== undefined) {
            this.transform = trans;
          }
        }

        if (!this.transform) {
          const trans = transform;

          if (!trans.scale || !trans.rotation || !trans.position || !trans.matrix) {
            this.transform = ROTransform_1.default.Create({
              transform: trans
            });
          }
        }
      } else {
        this.transform = ROTransform_1.default.Create();
      }
    }

    this.initBounds(transformEnabled);

    if (param) {
      if (param.transufvShared === true) {
        this.transform.uniformv.shared = true;
      } // this.materials = param.materials;


      if (param.materials !== undefined) this.materials = param.materials;
      if (param.geometry !== undefined) this.geometry = param.geometry;
      this.update();
    }
  }

  initBounds(transformEnabled) {
    this.mGBs = new AABB_1.default();
    this.mLBs = new AABB_1.default();
    this.mLBs.version = -137;
  }

  __$testSpaceEnabled() {
    //return this.__$spaceId < 0 && this.__$contId < 1;
    return RSEntityFlag_1.default.TestSpaceEnabled2(this.__$rseFlag);
  }

  __$testContainerEnabled() {
    //return this.__$wuid < 0 && this.__$contId < 1;
    return RSEntityFlag_1.default.TestContainerEnabled(this.__$rseFlag);
  }

  __$testRendererEnabled() {
    //return this.__$wuid < 0 && this.__$weid < 0 && this.__$contId < 1;
    return RSEntityFlag_1.default.TestRendererEnabled(this.__$rseFlag);
  }

  getRendererUid() {
    return RSEntityFlag_1.default.GetRendererUid(this.__$rseFlag);
  }

  get uid() {
    return this.mUid;
  }

  isREnabled() {
    const ms = this.materials;

    if (ms) {
      for (let i = 0; i < ms.length; ++i) {
        if (!ms[i].isREnabled()) {
          return false;
        }
      }
    } else {
      return false;
    }

    let g = this.geometry;

    if (!g || !g.isREnabled()) {
      console.log("aaa g.isREnabled(), !g: ", !g, ', ', this.geometry);
      return false;
    }

    return true;
  } // updateBounds(): void {
  // 	if (this.mGBs) {
  // 	}
  // }


  updateBounds() {
    const trans = this.transform;
    const lb = this.mLBs;

    if (trans && lb) {
      // this.m_transStatus = ROTransform.UPDATE_TRANSFORM;
      const g = this.geometry;

      if (g) {
        const slb = g.bounds;

        if (lb.version != slb.version) {
          lb.reset();
          const gd = g.geometryData;
          let ivs = gd.getIVS();
          const ivsIndex = 0;
          const vtCount = gd.vtCount;
          lb.addFloat32AndIndices(gd.getVS(), ivs.subarray(ivsIndex, ivsIndex + vtCount), gd.getVSStride());
          lb.update();
          this.update();
        }
      }
    }
  }

  updateLocalBoundsVS(bounds) {
    let min = bounds.min;
    let max = bounds.max;

    if (!this.mLBoundsVS) {
      this.mLBoundsVS = new Float32Array(24);
    }

    const pvs = this.mLBoundsVS;
    pvs[0] = min.x;
    pvs[1] = min.y;
    pvs[2] = min.z;
    pvs[3] = max.x;
    pvs[4] = min.y;
    pvs[5] = min.z;
    pvs[6] = min.x;
    pvs[7] = min.y;
    pvs[8] = max.z;
    pvs[9] = max.x;
    pvs[10] = min.y;
    pvs[11] = max.z;
    pvs[12] = min.x;
    pvs[13] = max.y;
    pvs[14] = min.z;
    pvs[15] = max.x;
    pvs[16] = max.y;
    pvs[17] = min.z;
    pvs[18] = min.x;
    pvs[19] = max.y;
    pvs[20] = max.z;
    pvs[21] = max.x;
    pvs[22] = max.y;
    pvs[23] = max.z;
  }

  updateGlobalBounds() {
    // 这里的逻辑也有问题,需要再处理，为了支持摄像机等的拾取以及支持遮挡计算等空间管理计算
    const trans = this.transform;
    const slb = this.geometry.bounds;
    const lb = this.mLBs;

    if (trans && lb && slb) {
      const gb = this.mGBs;
      const DE = Entity3D;

      if (trans.isDirty() || this.mTransVer != trans.version || lb.version != slb.version) {
        this.mTransVer = trans.version;
        lb.version = slb.version;
        trans.update();
        const mat = trans.getMatrix();

        if (lb.version != slb.version || !this.mLBoundsVS) {
          this.updateLocalBoundsVS(lb);
        }

        let invs = this.mLBoundsVS;
        let outvs = DE.sBoundsOutVS;
        mat.transformVectors(invs, 24, outvs);
        gb.reset();
        gb.addFloat32Arr(outvs);
        gb.update();
      } else {
        DE.sPrePos.setXYZ(0, 0, 0);
        DE.sPos.setXYZ(0, 0, 0);
        let matrix = trans.getMatrix(false);
        matrix.transformVector3Self(DE.sPrePos);
        trans.update();
        matrix = trans.getMatrix(false);
        matrix.transformVector3Self(DE.sPos);
        DE.sPos.subtractBy(DE.sPrePos);
        gb.min.addBy(DE.sPos);
        gb.max.addBy(DE.sPos);
        gb.center.addBy(DE.sPos);
        ++gb.version;
      }
    }
  }

  update() {
    const g = this.geometry;

    if (g) {
      const lb = this.mLBs;

      if (lb && g.bounds && lb.version != g.bounds.version) {
        lb.copyFrom(g.bounds);
      }

      this.updateGlobalBounds();
    }

    if (this.transform) {
      this.transform.update();
    }

    return this;
  }

  destroy() {
    if (this.mDescParam) {
      this.mDescParam = null;
    }
  }
  /**
   * 表示没有加入任何渲染场景或者渲染器
   */


  isRenderFree() {
    return !this.rstate.__$inRenderer;
  }
  /**
   * @returns 是否已经加入渲染器中(但是可能还没有进入真正的渲染运行时)
   */


  isInRenderer() {
    return this.rstate.__$inRenderer;
  }
  /**
   * @returns 是否在渲染器实际的渲染工作流中, 返回true并不表示当前帧一定会绘制
   */


  isRendering() {
    return this.rstate.__$rendering;
  }

  get globalBounds() {
    return this.mGBs;
  }

  get localBounds() {
    return this.mLBs;
  }

  get globalBoundsVer() {
    if (this.mGBs) {
      return this.mGBs.version;
    }

    return -1;
  }

  localToGlobal(pv) {
    return this;
  }

  globalToLocal(pv) {
    return null;
  }
  /**
   * @returns value < 12 , the instance is a renderable entity instance, otherwise it is a DisplayEntityContainer instance
   */


  getREType() {
    return 11;
  }

  isContainer() {
    return false;
  }
  /**
   * @returns 自身是否未必任何渲染器相关的系统使用
   */


  isFree() {
    return this.__$rseFlag == RSEntityFlag_1.default.DEFAULT;
  }

  set visible(v) {
    this.rstate.visible = v;
  }

  get visible() {
    return this.rstate.visible;
  }

  setVisible(v) {
    this.rstate.visible = v;
    return this;
  }

  isVisible() {
    return this.rstate.visible;
  }

  getTransform() {
    return this.transform;
  }

  getInvMatrix() {
    return this.transform.getInvMatrix();
  }

  getMatrix() {
    return this.transform.getMatrix();
  }

  hasParent() {
    return this.mParent ? true : false;
  }

  __$getParent() {
    return this.mParent;
  }

  __$setParent(parent) {
    this.mParent = parent;
  }
  /**
   * @boundsHit       表示是否包围盒体已经和射线相交了
   * @rlpv            表示物体坐标空间的射线起点
   * @rltv            表示物体坐标空间的射线朝向
   * @outV            如果检测相交存放物体坐标空间的交点
   * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
   */


  testRay(rlpv, rltv, outV, boundsHit) {
    return -1;
  }
  /**
   * @return 返回true表示包含有geometry对象,反之则没有
   */


  hasGeometry() {
    return this.geometry ? true : false;
  }
  /**
   * @return 返回true表示基于三角面的可渲染多面体, 返回false则是一个数学方程描述的几何体(例如球体)，不能直接用于渲染
   */


  isPolyhedral() {
    return true;
  }

}

Entity3D.sUid = 0;
Entity3D.sBoundsOutVS = new Float32Array(24);
Entity3D.sPos = new Vector3_1.default();
Entity3D.sPrePos = new Vector3_1.default();
exports.Entity3D = Entity3D;

/***/ }),

/***/ "5648":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGRUnitState_1 = __webpack_require__("222c");

class WGRCompUnitRunSt {}

const __$urst = new WGRCompUnitRunSt();

const __$rcompeust = new WGRUnitState_1.WGRUnitState();

const __$workcounts = new Uint16Array([1, 1, 0, 0]);

class WGRCompUnit {
  constructor() {
    this.rf = true;
    this.pst = __$rcompeust;
    this.st = __$rcompeust;
    this.__$rever = 0;
    this.enabled = true;
    this.workcounts = __$workcounts;
  }

  getRF() {
    return this.enabled && this.st.isDrawable();
  }

  runBegin() {
    const rc = this.rp.compPassEncoder;
    const mt = this.material;
    let rf = this.enabled && this.rp.enabled && this.st.isDrawable();
    rf = rf && mt.visible;

    if (rf) {
      const pipeline = this.pipelinectx.comppipeline;

      if (pipeline) {
        // 这里面的诸多判断逻辑不应该出现，加入渲染器内部渲染流程之前必须处理好， 后续优化
        const st = __$urst;

        if (st.rc != rc) {
          st.pipeline = null;
          st.rc = rc;
          st.unfsuuid = "";
        }

        if (st.pipeline != pipeline) {
          st.pipeline = pipeline; // console.log("ruint setPipeline(), this.pipeline: ", this.pipeline);

          rc.setPipeline(pipeline);
        }

        const ufs = this.uniforms;

        if (ufs) {
          for (let i = 0, ln = ufs.length; i < ln; i++) {
            const uf = ufs[i];

            if (uf.isEnabled()) {
              // console.log("compruint setBindGroup(), bindGroup: ", uf.bindGroup);
              // console.log("ruint setBindGroup(), uf.groupIndex: ", uf.groupIndex,",", uf.bindGroup);
              rc.setBindGroup(uf.groupIndex, uf.bindGroup);

              for (let j = 0, ln = uf.uvfs.length; j < ln; j++) {
                uf.setValue(uf.uvfs[j], j);
              }
            } else {
              rf = false;
            }
          }
        }
      } else {
        rf = false;
      }
    }

    this.rf = rf;
  }

  run() {
    if (this.rf) {
      const rc = this.rp.compPassEncoder;
      const works = this.workcounts; // console.log("dispatchWorkgroups(), works: ", works);

      if (works[1] > 0 && works[2] > 0) {
        rc.dispatchWorkgroups(works[0], works[1], works[2]);
      } else if (works[1] > 0) {
        // console.log("dispatchWorkgroups(x: " + works[0] + ", y: " + works[1] + ")");
        rc.dispatchWorkgroups(works[0], works[1]);
      } else {
        rc.dispatchWorkgroups(works[0]);
      }
    }
  }

  destroy() {
    if (this.pipelinectx) {
      const ufctx = this.pipelinectx.uniformCtx;
      ufctx.removeUniforms(this.uniforms);
      this.pipelinectx = null;
      this.material = null;
      this.rp = null;
      this.pst = null;
      this.st = null;
      this.workcounts = null;
    }
  }

}

exports.WGRCompUnit = WGRCompUnit;

/***/ }),

/***/ "58c4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGTextureDataDescriptor_1 = __webpack_require__("37b8");

exports.texDescriptorFilter = WGTextureDataDescriptor_1.texDescriptorFilter;
exports.WGTextureDataDescriptor = WGTextureDataDescriptor_1.WGTextureDataDescriptor;

class WGTextureData {
  constructor() {
    this.generateMipmaps = true;
    this.flipY = false;
    this.format = "rgba8unorm";
    this.dimension = "2d";
    this.viewDimension = "2d";
  }

  setDescripter(descriptor) {
    if (descriptor.generateMipmaps) this.generateMipmaps = descriptor.generateMipmaps;
    if (descriptor.flipY) this.flipY = descriptor.flipY;
    if (descriptor.format) this.format = descriptor.format;
    if (descriptor.dimension) this.dimension = descriptor.dimension;
    if (descriptor.viewDimension) this.viewDimension = descriptor.viewDimension;
    this.mDesc = descriptor;
    return this;
  }

  build(ctx) {
    return this.mTex;
  }

  destroy() {}

}

exports.WGTextureData = WGTextureData;

class WGImageTextureData extends WGTextureData {
  constructor() {
    super();
  }

  build(ctx) {
    if (this.mImgs && !this.mTex) {
      console.log("WGImageTextureData::build(), this.mImgs: ", this.mImgs, this.viewDimension);

      switch (this.viewDimension) {
        case "cube":
          this.mTex = ctx.texture.createTexCubeByImages(this.mImgs, this.generateMipmaps, this.flipY, this.format, this.mUrl);
          this.uid = this.mTex.uid;
          if (this.mDesc) this.mDesc.uid = this.mTex.uid;
          break;

        case "2d":
          this.mTex = ctx.texture.createTex2DByImage(this.mImgs[0], this.generateMipmaps, this.flipY, this.format, this.mUrl);
          this.uid = this.mTex.uid;
          if (this.mDesc) this.mDesc.uid = this.mTex.uid;
          break;

        default:
          console.error("Illegal operation !!!");
          break;
      }

      this.mTex.url = this.mUrl;
    }

    return this.mTex;
  }

}

exports.WGImageTextureData = WGImageTextureData;

class WGRTTTextureData extends WGTextureData {
  constructor() {
    super();
  }

  setDescripter(descriptor) {
    super.setDescripter(descriptor);
    this.mTexData = descriptor.rttTexture;
    return this;
  }

  build(ctx) {
    const td = this.mTexData;

    if (td && !this.mTex) {
      if (td.texture) {
        console.log("apply a rtt texture into a WGRTTTextureData instance.");
        this.mTex = td.texture;
        this.uid = this.mTex.uid;
        if (this.mDesc) this.mDesc.uid = this.mTex.uid;
      }
    }

    return this.mTex;
  }

}

exports.WGRTTTextureData = WGRTTTextureData;

class WGDataTextureData extends WGTextureData {
  constructor() {
    super();
  }

  setDescripter(descriptor) {
    super.setDescripter(descriptor);
    this.mTexData = descriptor.dataTexture;
    return this;
  }

  build(ctx) {
    const desc = this.mDesc;
    const td = this.mTexData;

    if (td && desc) {
      if (!this.mTex) {
        if (td.texture) {
          console.log("apply a texture in the WGDataTextureData instance: ", this);
          this.mTex = td.texture;
          this.uid = this.mTex.uid;
          if (this.mDesc) this.mDesc.uid = this.mTex.uid;
        } else if (td.data) {
          console.log("create a texture in the WGDataTextureData instance: ", this);
          this.mTex = ctx.texture.createDataTexture([td.data], td.width, td.height, {
            format: desc.format
          }, desc.generateMipmaps);
          this.uid = this.mTex.uid;
          if (this.mDesc) this.mDesc.uid = this.mTex.uid;
        } else if (td.datas && td.datas.length > 0) {
          console.log("create a custom mipmap texture in the WGDataTextureData instance: ", this);
          this.mTex = ctx.texture.createDataTexture(td.datas, td.width, td.height, {
            format: desc.format,
            viewDimension: this.viewDimension
          }, desc.generateMipmaps);
          this.uid = this.mTex.uid;
          if (this.mDesc) this.mDesc.uid = this.mTex.uid;
        }
      }
    }

    return this.mTex;
  }

}

class WGImage2DTextureData extends WGImageTextureData {
  constructor(url) {
    super();

    if (url && url !== "") {
      this.initByURL(url);
    }
  }

  setImage(image) {
    this.mImgs = [image];
    return this;
  }

  setDescripter(descriptor) {
    super.setDescripter(descriptor);

    if (this.dimension !== "2d") {
      throw Error("Illegal Operation !!!");
    }

    if (descriptor.url) {
      this.initByURL(descriptor.url);
    } else if (descriptor.urls) {
      this.initByURL(descriptor.urls[0]);
    }

    if (descriptor.images) {
      this.setImage(descriptor.images[0]);
    } else if (descriptor.image) {
      this.setImage(descriptor.image);
    }

    return this;
  }

  initByURL(url) {
    this.mUrl = url;
    fetch(url).then(response => {
      try {
        response.blob().then(blob => {
          createImageBitmap(blob).then(bmp => {
            this.mImgs = [bmp];
          });
        });
      } catch (e) {
        console.error("WGImageTextureData::initByURL(), error url: ", url);
        return null;
      }
    });
    return this;
  }

}

exports.WGImage2DTextureData = WGImage2DTextureData;

class WGImageCubeTextureData extends WGImageTextureData {
  constructor(urls) {
    super();

    if (urls && urls.length >= 6 && urls[0] !== "") {
      this.initCubeMapURLs(urls);
    }
  }

  setImages(images) {
    this.mImgs = images;
    return this;
  }

  setDescripter(descriptor) {
    super.setDescripter(descriptor);

    if (this.viewDimension !== "cube") {
      throw Error("Illegal Operation !!!");
    }

    if (descriptor.urls) {
      this.initCubeMapURLs(descriptor.urls);
    }

    if (descriptor.images) {
      this.setImages(descriptor.images);
    }

    return this;
  }

  async createCubeMapImgsByUrls(urls) {
    const promises = urls.map(async src => {
      const response = await fetch(src);
      return createImageBitmap(await response.blob());
    });
    const images = await Promise.all(promises);
    return images;
  }

  initCubeMapURLs(urls) {
    this.viewDimension = "cube";
    this.mUrl = urls[0];
    this.createCubeMapImgsByUrls(urls).then(imgs => {
      this.mImgs = imgs;
    });
    return this;
  }

}

exports.WGImageCubeTextureData = WGImageCubeTextureData;

class WGTexture {
  constructor() {
    this.name = "WGTexture";
    this.shdVarName = "";
    this.generateMipmaps = true;
    this.flipY = true;
    this.dimension = "2d";
    this.viewDimension = '2d';
  }

}

exports.WGTexture = WGTexture;

class WGTexSampler {
  constructor() {
    this.name = "WGTexture";
    this.shdVarName = "";
  }

}

class WGTextureWrapper {
  constructor(param) {
    this.bindGroupIndex = 0;
    const tp = param.texture;
    this.texture = new WGTexture();
    const tex = this.texture;

    for (var k in tp) {
      tex[k] = tp[k];
    }

    if (this.texture.data) {
      let td = this.texture.data;
      if (td.generateMipmaps) tex.generateMipmaps = td.generateMipmaps;
      if (td.flipY) tex.flipY = td.flipY;
      if (td.dimension) tex.dimension = td.dimension;
      if (td.viewDimension) tex.viewDimension = td.viewDimension;
      if (td.format) tex.format = td.format;
    }

    const sp = param.sampler;

    if (sp) {
      this.sampler = new WGTexSampler();
      const s = this.sampler;

      for (var k in sp) {
        s[k] = sp[k];
      }
    }
  }

  destroy() {}

}

exports.WGTextureWrapper = WGTextureWrapper;

const __$texDataMap = new Map();

function createDataWithDescriptor(descriptor) {
  // let dimension = descriptor.dimension ? descriptor.dimension : "2d";
  let td;
  const dpt = WGTextureDataDescriptor_1.texDescriptorFilter(descriptor);
  let viewDimension = dpt.viewDimension ? dpt.viewDimension : "2d";
  const map = __$texDataMap;
  let key = "";

  if (dpt.url !== undefined) {
    key = dpt.url;
  } else if (dpt.urls !== undefined) {
    key = dpt.urls[0];
  }

  if (key === "") {
    if (dpt.uuid !== undefined) {
      key = dpt.uuid;
    }
  }

  if (key !== "") {
    if (map.has(key)) {
      return map.get(key);
    }
  }

  switch (viewDimension) {
    case "2d":
      console.log("create a 2d texture instance ...");

      if (dpt.rttTexture) {
        td = new WGRTTTextureData().setDescripter(dpt);
      } else if (dpt.dataTexture) {
        td = new WGDataTextureData().setDescripter(dpt);
      } else {
        td = new WGImage2DTextureData().setDescripter(dpt);
      }

      break;

    case "cube":
      console.log("create a cube texture instance ...");

      if (dpt.dataTexture) {
        td = new WGDataTextureData().setDescripter(dpt);
      } else {
        td = new WGImageCubeTextureData().setDescripter(dpt);
      }

      break;

    default:
      throw Error("Illegal Operation !!!");
      break;
  }

  if (td) {
    if (key !== "") {
      map.set(key, td);
    }
  }

  return td;
}

exports.createDataWithDescriptor = createDataWithDescriptor;

/***/ }),

/***/ "601e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGMaterial_1 = __webpack_require__("943f");

const WGGeometry_1 = __webpack_require__("746a");

const FixScreenEntity_1 = __webpack_require__("f22d");

const WGRenderer_1 = __webpack_require__("cae9"); // import vertWGSL from "./shaders/colorTriangle.vert.wgsl";
// import fragWGSL from "./shaders/colorTriangle.frag.wgsl";


const vertWGSL = `
struct VSOut {
    @builtin(position) Position: vec4f,
    @location(0) color: vec3f,
};

@vertex
fn main(@location(0) inPos: vec3f,
        @location(1) inColor: vec3f) -> VSOut {
    var vsOut: VSOut;
    vsOut.Position = vec4(inPos, 1.0);
    vsOut.color = inColor;
    return vsOut;
}
`;
const fragWGSL = `
@fragment
fn main(@location(0) inColor: vec3f) -> @location(0) vec4f {
    return vec4f(inColor, 1.0);
}
`;
const position = new Float32Array([-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0]);
const color = new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]);

class VertColorTriangle {
  constructor() {
    this.renderer = new WGRenderer_1.WGRenderer();
  }

  initialize() {
    console.log('VertColorTriangle::initialize() ...');
    const renderer = this.renderer;
    renderer.initialize({
      camera: {
        enabled: false
      }
    });
    const shdSrc = {
      vert: {
        code: vertWGSL
      },
      frag: {
        code: fragWGSL
      }
    };
    const materials = [new WGMaterial_1.WGMaterial({
      shadinguuid: "shapeMaterial",
      shaderSrc: shdSrc
    })];
    const geometry = new WGGeometry_1.WGGeometry().addAttributes([{
      position
    }, {
      color
    }]);
    renderer.addEntity(new FixScreenEntity_1.FixScreenEntity({
      geometry,
      materials
    }));
  }

  run() {
    this.renderer.run();
  }

}

exports.VertColorTriangle = VertColorTriangle;

/***/ }),

/***/ "6130":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGEntityNode_1 = __webpack_require__("0884");

exports.WGWaitEntityNode = WGEntityNode_1.WGWaitEntityNode;

class WGEntityNodeMana {
  constructor() {
    this.mNodes = [];
    this.mEnabled = false;
  }

  receiveNode(wnode) {
    wnode.block.addEntityToBlock(wnode.entity, wnode.node);
    wnode.entity = null;
    wnode.node = null;
    wnode.builder = null;
    wnode.block = null;
  }

  addEntity(node) {
    this.mNodes.push(node); // console.log("WGEntityNodeMana::addEntity(), this.mNodes.length: ", this.mNodes.length);
  }

  update() {
    // console.log("WGEntityNodeMana::update(), this.mNodes.length: ", this.mNodes.length, this.mEnabled);
    if (this.mEnabled) {
      const ls = this.mNodes;

      for (let i = 0; i < ls.length; ++i) {
        const node = ls[i];
        const entity = node.entity;

        if (node.rever == node.node.rstate.__$rever) {
          // console.log('A entity.isREnabled(): ', entity.isREnabled());
          if (!entity.isREnabled()) {
            const ms = entity.materials;

            if (ms) {
              // console.log("ppp b 03");
              for (let j = 0; j < ms.length; ++j) {
                this.updateMaterial(ms[j]);
              }
            } // 保证顺序


            if (!(node.syncSort === false)) {
              break;
            }
          } // console.log('B entity.isREnabled(): ', entity.isREnabled());


          if (entity.isREnabled()) {
            console.log("WGEntityNodeMana::update(), a entity is rendering enabled.");
            ls.splice(i, 1);
            --i;
            this.receiveNode(node);
          }
        } else {
          ls.splice(i, 1);
          --i;
          console.log("WGEntityNodeMana::update(), remove a waiting entity.");
        }
      }
    }
  }

  updateMaterial(m) {
    if (!m.isREnabled()) {
      const ctx = this.wgctx;
      const texs = m.textures;

      for (let i = 0; i < texs.length; ++i) {
        const tex = texs[i];

        if (tex.texture && tex.texture.data && !tex.texture.texture) {
          tex.texture.texture = tex.texture.data.build(ctx);
        }
      }
    }
  }

  updateToTarget() {
    this.mEnabled = true;
  }

}

exports.WGEntityNodeMana = WGEntityNodeMana;

/***/ }),

/***/ "626c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2023 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

Object.defineProperty(exports, "__esModule", {
  value: true
});

class BitConst {
  static pushThreeBitValueToInt(target, value) {
    return (target << 3) + value;
  }

  static popThreeBitValueFromInt(target) {
    BitConst.value = 7 & target;
    return target >> 3;
  }

  static containsBit(target, bit) {
    return (bit & target) > 0;
  }

  static removeBit(target, bit) {
    return ~bit & target;
  }

  static addBit(target, bit) {
    return bit | target;
  }

  static assembleFromIntArray(intArray) {
    let bit = 0x0;
    let len = intArray.length;

    for (let i = 0; i < len; ++i) {
      if (intArray[i] > 0) {
        bit |= 1 << i;
      }
    }

    return bit;
  }

}

BitConst.ZERO = 0;
BitConst.ONE_0 = 1; // 0b1

BitConst.ONE_1 = 1 << 1; // 0b10

BitConst.ONE_2 = 1 << 2; // 0b100

BitConst.ONE_3 = 1 << 3; // 0b1000

BitConst.ONE_4 = 1 << 4; // 0b10000

BitConst.ONE_5 = 1 << 5; // 0b100000

BitConst.ONE_6 = 1 << 6; // 0b1000000

BitConst.ONE_7 = 1 << 7; // 0b10000000

BitConst.ONE_8 = 1 << 8; // 0b100000000

BitConst.ONE_9 = 1 << 9; // 0b1000000000

BitConst.ONE_10 = 1 << 10; // 0b10000000000

BitConst.ONE_11 = 1 << 11; // 0b100000000000

BitConst.value = 0;
exports.default = BitConst;

/***/ }),

/***/ "63d8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGRPrimitive_1 = __webpack_require__("b720");

const WGRUnit_1 = __webpack_require__("842f");

const WGRCompUnit_1 = __webpack_require__("5648");

const WGRPipelineCtxParams_1 = __webpack_require__("bf93");

const Define_1 = __webpack_require__("af1b");

class WGRObjBuilder {
  constructor() {}

  createPrimitive(geomParam) {
    // console.log('XXXXXX createPrimitive() ...');
    const g = new WGRPrimitive_1.WGRPrimitive();
    g.ibuf = geomParam.indexBuffer;
    g.vbufs = geomParam.vertexBuffers;

    if (geomParam.indexCount !== undefined) {
      g.indexCount = geomParam.indexCount;
    }

    if (geomParam.vertexCount !== undefined) {
      g.vertexCount = geomParam.vertexCount;
    }

    if (geomParam.drawMode !== undefined) {
      g.drawMode = geomParam.drawMode;
    }

    return g;
  }

  testShaderSrc(shdSrc) {
    if (shdSrc) {
      if (shdSrc.code !== undefined && !shdSrc.shaderSrc) {
        const obj = {
          code: shdSrc.code,
          uuid: shdSrc.uuid
        };

        if (WGRPipelineCtxParams_1.findShaderEntryPoint('@compute', shdSrc.code) != '') {
          // console.log(">>>>>>>>>>> find comp shader >>>>>>>>>>>>>>>>>>>>>");
          shdSrc.compShaderSrc = shdSrc.compShaderSrc ? shdSrc.compShaderSrc : obj;
        } else {
          // console.log(">>>>>>>>>>> find curr shader >>>>>>>>>>>>>>>>>>>>>");
          shdSrc.shaderSrc = shdSrc.shaderSrc ? shdSrc.shaderSrc : obj;
        }
      }

      if (shdSrc.vert) {
        shdSrc.vertShaderSrc = shdSrc.vert;
      }

      if (shdSrc.frag) {
        shdSrc.fragShaderSrc = shdSrc.frag;
      }

      if (shdSrc.comp) {
        shdSrc.compShaderSrc = shdSrc.comp;
      }
    }
  }

  checkMaterial(material, primitive) {
    if (!material.shaderSrc.compShaderSrc) {
      const vtxParam = material.pipelineVtxParam;

      if (primitive && vtxParam) {
        const vert = vtxParam.vertex;
        vert.buffers = primitive.vbufs;
        vert.drawMode = primitive.drawMode;
      }

      const pipeDef = material.pipelineDefParam;

      if (material.doubleFace !== undefined) {
        pipeDef.faceCullMode = material.doubleFace === true ? 'none' : pipeDef.faceCullMode;
      }
    }
  }

  createRPass(entity, builder, geometry, materialIndex = 0, blockUid = 0) {
    const material = entity.materials[materialIndex]; // console.log("XXXXXXX material: ", material);

    let primitive;
    let pctx = material.getRCtx();

    if (geometry) {
      const wgctx = builder.getWGCtx();
      const dict = geometry.primitive;
      const vertexBuffers = geometry.gpuvbufs;
      const vertexCount = vertexBuffers[0].vectorCount;
      const gibuf = geometry.indexBuffer;

      if (material.wireframe === true) {
        primitive = dict.wireframe;

        if (!primitive) {
          gibuf.toWirframe();
          const indexBuffer = gibuf ? gibuf.gpuwibuf ? gibuf.gpuwibuf : wgctx.buffer.createIndexBuffer(gibuf.wireframeData) : null;
          if (indexBuffer) gibuf.gpuwibuf = indexBuffer;
          const indexCount = indexBuffer ? indexBuffer.elementCount : 0;
          primitive = this.createPrimitive({
            vertexBuffers,
            indexBuffer,
            indexCount,
            vertexCount,
            drawMode: Define_1.WGRDrawMode.LINES
          });
          dict.wireframe = primitive; // console.log("wireframe primitive.drawMode: ", primitive.drawMode, primitive);
        }
      } else {
        primitive = dict.default;

        if (!primitive) {
          const indexBuffer = gibuf ? gibuf.gpuibuf ? gibuf.gpuibuf : wgctx.buffer.createIndexBuffer(gibuf.data) : null;
          if (indexBuffer) gibuf.gpuibuf = indexBuffer;
          const indexCount = indexBuffer ? indexBuffer.elementCount : 0;
          primitive = this.createPrimitive({
            vertexBuffers,
            indexBuffer,
            indexCount,
            vertexCount,
            drawMode: geometry.drawMode
          });
          dict.default = primitive; // console.log("default primitive.drawMode: ", primitive.drawMode, primitive);
        }
      }
    }

    if (!builder.hasMaterial(material)) {
      if (!pctx) {
        this.testShaderSrc(material.shaderSrc);

        if (!material.pipelineVtxParam) {
          if (primitive) {
            material.pipelineVtxParam = {
              vertex: {
                attributeIndicesArray: []
              }
            };
            const ls = [];

            for (let i = 0; i < primitive.vbufs.length; ++i) {
              ls.push([0]);
            }

            material.pipelineVtxParam.vertex.attributeIndicesArray = ls;
          }
        }
      }

      this.checkMaterial(material, primitive);
      const node = builder.getPassNodeWithMaterial(material); // console.log('WGRObjBuilder::createRPass(), node.uid: ', node.uid, ", node: ", node);

      pctx = node.createRenderPipelineCtxWithMaterial(material);
      material.initialize(pctx);
    } // console.log("createRUnit(), utexes: ", utexes);


    const isComputing = material.shaderSrc.compShaderSrc;
    let ru;

    if (isComputing) {
      let et = entity;
      let rcompunit = new WGRCompUnit_1.WGRCompUnit();
      let compMat = material;

      if (et.workcounts) {
        rcompunit.workcounts = et.workcounts;
      }

      if (compMat && compMat.workcounts) {
        rcompunit.workcounts = compMat.workcounts;
      }

      if (!rcompunit.workcounts) {
        rcompunit.workcounts = new Uint16Array([1, 1, 0, 0]);
      }

      rcompunit.rp = pctx.rpass;
      ru = rcompunit;
    } else {
      let runit = new WGRUnit_1.WGRUnit();
      runit.geometry = primitive;
      runit.rp = pctx.rpass;
      ru = runit;
    }

    ru.pipelinectx = pctx;
    const uniformCtx = pctx.uniformCtx;
    let uvalues = [];
    const cam = builder.camera;

    if (!isComputing) {
      if (entity.transform) {
        uvalues.push(entity.transform.uniformv);
      }

      if (entity.cameraViewing) {
        uvalues.push(cam.viewUniformV);
        uvalues.push(cam.projUniformV);
      }
    }

    if (material.uniformValues) {
      uvalues = uvalues.concat(material.uniformValues);
    } // transform 与 其他材质uniform数据构造和使用应该分开,
    // 哪些uniform是依据material变化的，哪些是共享的，哪些是transform等变换的数据


    let groupIndex = 0;
    let texList = material.textures;
    let utexes; // console.log("createRUnit(), texList: ", texList);

    if (!isComputing) {
      if (texList && texList.length > 0) {
        utexes = new Array(texList.length);

        for (let i = 0; i < texList.length; i++) {
          const tex = texList[i].texture;
          let dimension = texList[i].texture.viewDimension;

          if (!tex.view) {
            tex.view = tex.texture.createView({
              dimension
            });
          }

          tex.view.dimension = dimension;
          utexes[i] = {
            texView: tex.view
          };
        }
      }
    }

    if (uvalues && uvalues.length > 0 || utexes && utexes.length > 0) {
      ru.uniforms = uniformCtx.createUniformsWithValues([{
        layoutName: material.shadinguuid,
        groupIndex: groupIndex,
        values: uvalues,
        texParams: utexes
      }], material.uniformAppend);
    }

    ru.material = material;
    ru.etuuid = entity.uuid + '-[block(' + blockUid + '), material(' + material.shadinguuid + ')]';
    return ru;
  }

  createRUnit(entity, builder, node, blockUid = 0) {
    const wgctx = builder.getWGCtx();
    const geometry = entity.geometry;
    let primitiveDict;

    if (entity.geometry) {
      primitiveDict = geometry.primitive; // console.log('>>> primitiveDict: ', primitiveDict);

      if (!primitiveDict) {
        const gts = geometry.attributes;
        const gvbufs = geometry.gpuvbufs;
        const vertexBuffers = gvbufs ? gvbufs : new Array(gts.length);

        if (!gvbufs) {
          for (let i = 0; i < gts.length; ++i) {
            const gt = gts[i];
            vertexBuffers[i] = wgctx.buffer.createVertexBuffer(gt.data, gt.bufferOffset, gt.strides);
          }

          geometry.gpuvbufs = vertexBuffers;
        }

        primitiveDict = {};
        geometry.primitive = primitiveDict;
      }
    }

    let ru;
    const mts = entity.materials;

    if (mts.length > 1) {
      const passes = new Array(mts.length);

      for (let i = 0; i < mts.length; ++i) {
        passes[i] = this.createRPass(entity, builder, geometry, i, blockUid); // passes[i].etuuid = entity.uuid + '-[block(' + blockUid+')]';
      }

      ru = new WGRUnit_1.WGRUnit(); // console.log("xxxxxxxxx passes: ", passes);

      ru.passes = passes;
    } else {
      ru = this.createRPass(entity, builder, geometry);
    }

    ru.bounds = entity.globalBounds;
    ru.st = entity.rstate;
    ru.st.__$rendering = true;
    ru.pst = node.rstate;
    ru.__$rever = ru.pst.__$rever; // ru.etuuid = entity.uuid;

    return ru;
  }

}

exports.WGRObjBuilder = WGRObjBuilder;

/***/ }),

/***/ "660c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Asserts `condition` is true. Otherwise, throws an `Error` with the provided message.
 */

function assert(condition, msg) {
  if (!condition) {
    throw new Error(msg && (typeof msg === "string" ? msg : msg()));
  }
}

exports.assert = assert;

/***/ }),

/***/ "68f4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2023 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const MathConst_1 = __importDefault(__webpack_require__("ec7b"));

const Vector3_1 = __importDefault(__webpack_require__("af80"));

const Matrix4_1 = __importDefault(__webpack_require__("c6d1"));

const WGRUniformValue_1 = __webpack_require__("7650");

const CameraUtils_1 = __webpack_require__("24fe");

const Frustum_1 = __webpack_require__("4942"); // const pmin = MathConst.MATH_MIN_POSITIVE;


class Camera {
  constructor(param) {
    this.mTempV = new Vector3_1.default();
    this.mTempV1 = new Vector3_1.default();
    this.mInitRV = new Vector3_1.default();
    this.mInitUp = new Vector3_1.default();
    this.mMatrix = new Matrix4_1.default();
    this.mViewMat = new Matrix4_1.default();
    this.mViewInvMat = new Matrix4_1.default();
    this.mVPMat = new Matrix4_1.default();
    this.mTempMat = new Matrix4_1.default();
    this.mProjMat = new Matrix4_1.default();
    this.mCamPos = new Vector3_1.default();
    this.mLookAtPos = new Vector3_1.default();
    this.mUp = new Vector3_1.default();
    this.mLookDirectNV = new Vector3_1.default();
    this.mLookAtDirec = new Vector3_1.default();
    this.mLookRHand = true;
    this.mNearPlaneW = 1.0;
    this.mNearPlaneH = 1.0;
    this.mViewX = 0;
    this.mViewY = 0;
    this.mViewW = 800;
    this.mViewH = 600;
    this.mViewHalfW = 400;
    this.mViewHalfH = 300;
    this.mFovRadian = 0.0;
    this.mAspect = 1.0;
    this.mZNear = 0.1;
    this.mZFar = 1000.0;
    this.mB = 0.0;
    this.mT = 0.0;
    this.mL = 0.0;
    this.mR = 0.0;
    this.mPerspective = false;
    this.mProject2Enabled = false;
    this.mRightHandEnabled = true;
    this.mRotV = new Vector3_1.default();
    this.mViewFieldZoom = 1.0;
    this.mChanged = true;
    this.mUnlock = true;
    this.version = 0;
    this.name = "Camera";
    this.frustum = new Frustum_1.Frustum();
    this.inversePerspectiveZ = false;
    this.m_tempNV = new Vector3_1.default();
    this.m_tempUPV = new Vector3_1.default();
    this.m_tempRV = new Vector3_1.default();
    this.m_tempCamPos = new Vector3_1.default();
    this.m_tempLookAtPos = new Vector3_1.default();
    this.m_rotDegree = 0.0;
    this.m_rotAxis = new Vector3_1.default();
    this.m_rotPivotPoint = null;
    this.m_axisRotEnabled = false; // getWordFrustumWAABB(): AABB { return this.mFrustumAABB; }
    // getWordFrustumWAABBCenter(): Vector3 { return this.mFrustumAABB.center; }
    // getWordFrustumVtxArr(): Vector3[] { return this.mWFrustumVS; }
    // getWordFrustumPlaneArr(): Plane[] { return this.mWFruPlanes; }

    /**
     * @param w_cv 世界坐标位置
     * @param radius 球体半径
     * @returns 0表示完全不会再近平面内, 1表示完全在近平面内, 2表示和近平面相交
     */
    // visiTestNearPlaneWithSphere(w_cv: Vector3, radius: number): number {
    //     const v = this.mFpns[1].dot(w_cv) - this.mFpds[1];// - radius;
    //     if((v - radius) > pmin) {
    //         // 表示完全在近平面之外，也就是前面
    //         return 0;
    //     }else if((v + radius) < MathConst.MATH_MAX_NEGATIVE){
    //         // 表示完全在近平面内, 也就是后面
    //         return 1;
    //     }
    //     // 表示和近平面相交
    //     return 2;
    // }
    // visiTestSphere2(w_cv: Vector3, radius: number): boolean {
    //     let boo = (this.mFpns[0].dot(w_cv) - this.mFpds[0] - radius) > pmin;
    //     if (boo) return false;
    //     boo = (this.mFpns[1].dot(w_cv) - this.mFpds[1] - radius) > pmin;
    //     if (boo) return false;
    //     boo = (this.mFpns[2].dot(w_cv) - this.mFpds[2] - radius) > pmin;
    //     if (boo) return false;
    //     boo = (this.mFpns[3].dot(w_cv) - this.mFpds[3] - radius) > pmin;
    //     if (boo) return false;
    //     boo = (this.mFpns[4].dot(w_cv) - this.mFpds[4] - radius) > pmin;
    //     if (boo) return false;
    //     boo = (this.mFpns[5].dot(w_cv) - this.mFpds[5] - radius) > pmin;
    //     if (boo) return false;
    //     return true;
    // }
    // visiTestSphere3(w_cv: Vector3, radius: number, farROffset: number): boolean {
    //     let boo = (this.mFpns[0].dot(w_cv) - this.mFpds[0] + farROffset - radius) > pmin;
    //     if (boo) return false;
    //     boo = (this.mFpns[1].dot(w_cv) - this.mFpds[1] - radius) > pmin;
    //     if (boo) return false;
    //     boo = (this.mFpns[2].dot(w_cv) - this.mFpds[2] - radius) > pmin;
    //     if (boo) return false;
    //     boo = (this.mFpns[3].dot(w_cv) - this.mFpds[3] - radius) > pmin;
    //     if (boo) return false;
    //     boo = (this.mFpns[4].dot(w_cv) - this.mFpds[4] - radius) > pmin;
    //     if (boo) return false;
    //     boo = (this.mFpns[5].dot(w_cv) - this.mFpds[5] - radius) > pmin;
    //     if (boo) return false;
    //     return true;
    // }
    // visiTestPosition(pv: Vector3): boolean {
    //     let boo = (this.mFpns[0].dot(pv) - this.mFpds[0]) > pmin;
    //     if (boo) return false;
    //     boo = (this.mFpns[1].dot(pv) - this.mFpds[1]) > pmin;
    //     if (boo) return false;
    //     boo = (this.mFpns[2].dot(pv) - this.mFpds[2]) > pmin;
    //     if (boo) return false;
    //     boo = (this.mFpns[3].dot(pv) - this.mFpds[3]) > pmin;
    //     if (boo) return false;
    //     boo = (this.mFpns[4].dot(pv) - this.mFpds[4]) > pmin;
    //     if (boo) return false;
    //     boo = (this.mFpns[5].dot(pv) - this.mFpds[5]) > pmin;
    //     if (boo) return false;
    //     return true;
    // }
    // visiTestPlane(nv: Vector3, distance: number): boolean {
    // 	const ls = this.mWFruPlanes;
    //     let f0 = (nv.dot(ls[0].position) - distance);
    //     let f1 = f0 * (nv.dot(ls[1].position) - distance);
    //     if (f1 < pmin) return true;
    //     f1 = f0 * (nv.dot(ls[2].position) - distance);
    //     if (f1 < pmin) return true;
    //     f1 = f0 * (nv.dot(ls[3].position) - distance);
    //     if (f1 < pmin) return true;
    //     f1 = f0 * (nv.dot(ls[4].position) - distance);
    //     if (f1 < pmin) return true;
    //     f1 = f0 * (nv.dot(ls[5].position) - distance);
    //     if (f1 < pmin) return true;
    //     return false;
    // }
    // frustum intersect sphere in wrod space
    // visiTestSphere(w_cv: Vector3, radius: number): boolean {
    // 	const ls = this.mWFruPlanes;
    //     let boo = this.mFrustumAABB.sphereIntersect(w_cv, radius);
    //     if (boo) {
    //         let pf0 = ls[0].intersectSphere(w_cv, radius);
    //         let pf1 = ls[1].intersectSphere(w_cv, radius);
    //         if (pf0 * pf1 >= 0) {
    //             if (ls[0].intersectBoo || ls[1].intersectBoo) {
    //             } else {
    //                 return false;
    //             }
    //         }
    //         pf0 = ls[2].intersectSphere(w_cv, radius);
    //         pf1 = ls[3].intersectSphere(w_cv, radius);
    //         if (pf0 * pf1 >= 0) {
    //             if (ls[2].intersectBoo || ls[3].intersectBoo) {
    //             }
    //             else {
    //                 return false;
    //             }
    //         }
    //         pf0 = ls[4].intersectSphere(w_cv, radius);
    //         pf1 = ls[5].intersectSphere(w_cv, radius);
    //         if (pf0 * pf1 >= 0) {
    //             if (ls[4].intersectBoo || ls[5].intersectBoo) {
    //             }
    //             else {
    //                 return false;
    //             }
    //         }
    //         return true;
    //     }
    //     return false;
    // }
    // visibility test
    // 可见性检测这边可以做的更精细，例如上一帧检测过的对象如果摄像机没有移动而且它自身也没有位置等变化，就可以不用检测
    // 例如精细检测可以分类: 圆球，圆柱体，长方体 等不同的检测模型计算方式会有区别
    // visiTestAABB(ab: AABB): boolean {
    //     //trace("ro.bounds.getCenter(): "+ro.bounds.getCenter()+","+ro.bounds.getRadius());
    //     //return mFrustumAABB.sphereIntersectFast(ro.bounds.getCenter(),ro.bounds.getRadius());
    //     let w_cv = ab.center;
    //     let radius = ab.radius;
    //     let boo = this.mFrustumAABB.sphereIntersect(w_cv, radius);
    // 	const ls = this.mWFruPlanes;
    //     if (boo) {
    //         let pf0 = ls[0].intersectSphere(w_cv, radius);
    //         let pf1 = ls[1].intersectSphere(w_cv, radius);
    //         if (pf0 * pf1 >= 0) {
    //             if (ls[0].intersectBoo || ls[1].intersectBoo) {
    //             }
    //             else {
    //                 return false;
    //             }
    //         }
    //         pf0 = ls[2].intersectSphere(w_cv, radius);
    //         pf1 = ls[3].intersectSphere(w_cv, radius);
    //         if (pf0 * pf1 >= 0) {
    //             if (ls[2].intersectBoo || ls[3].intersectBoo) {
    //             } else {
    //                 return false;
    //             }
    //         }
    //         pf0 = ls[4].intersectSphere(w_cv, radius);
    //         pf1 = ls[5].intersectSphere(w_cv, radius);
    //         if (pf0 * pf1 >= 0) {
    //             if (ls[4].intersectBoo || ls[5].intersectBoo) {
    //             } else {
    //                 return false;
    //             }
    //         }
    //         return true;
    //     }
    //     return false;
    // }

    this.mViewMatrix = null;
    this.viewUniformV = new WGRUniformValue_1.WGRUniformValue({
      data: this.mViewMat.getLocalFS32(),
      shared: true,
      shdVarName: "viewMat"
    });
    this.projUniformV = new WGRUniformValue_1.WGRUniformValue({
      data: this.mProjMat.getLocalFS32(),
      shared: true,
      shdVarName: "projMat"
    });

    if (param) {
      this.initialize(param);
    }
  }

  initialize(param) {
    CameraUtils_1.initializeCamera(param, this);
  } // 不允许外界修改camera数据


  lock() {
    this.mUnlock = false;
  } // 允许外界修改camera数据


  unlock() {
    this.mUnlock = true;
  }

  lookAtLH(camPos, lookAtPos, up) {
    if (this.mUnlock) {
      this.mCamPos.copyFrom(camPos);
      this.mLookAtPos.copyFrom(lookAtPos);
      this.mUp.copyFrom(up);
      this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
      this.mLookRHand = false;
      this.mLookDirectNV.copyFrom(this.mLookAtDirec);
      this.mLookDirectNV.normalize();
      this.mInitUp.copyFrom(up);
      this.mInitUp.normalize();
      Vector3_1.default.Cross(this.mLookAtDirec, this.mUp, this.mInitRV);
      this.mInitRV.normalize();
      this.mChanged = true;
    }
  }

  lookAtRH(camPos, lookAtPos, up) {
    if (this.mUnlock) {
      this.mCamPos.copyFrom(camPos);
      this.mLookAtPos.copyFrom(lookAtPos);
      this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
      this.mLookRHand = true;
      this.mLookDirectNV.copyFrom(this.mLookAtDirec);
      this.mLookDirectNV.normalize();
      Vector3_1.default.Cross(this.mLookAtDirec, up, this.mInitRV);
      Vector3_1.default.Cross(this.mInitRV, this.mLookAtDirec, this.mInitUp);
      this.mInitUp.normalize();
      this.mInitRV.normalize();
      this.mUp.copyFrom(this.mInitUp);
      this.mChanged = true;
    }
  }

  getLookAtLHToCamera(camera) {
    camera.lookAtLH(this.mCamPos, this.mLookAtPos, this.mUp);
  }

  getLookAtRHToCamera(camera) {
    camera.lookAtRH(this.mCamPos, this.mLookAtPos, this.mUp);
  }
  /**
   * left-hand axis perspective projection
   * @param fovRadian radian value
   * @param aspect the value is the view port width / height
   * @param zNear the camera near plane distance
   * @param zFar the camera far plane distance
   */


  perspectiveLH(fovRadian, aspect, zNear, zFar) {
    if (this.mUnlock) {
      this.mProject2Enabled = false;
      this.mAspect = aspect;
      this.mFovRadian = fovRadian;
      this.mZNear = zNear;
      this.mZFar = zFar;
      this.mProjMat.perspectiveLH(fovRadian, aspect, zNear, zFar);
      this.mViewFieldZoom = Math.tan(fovRadian * 0.5);
      this.mPerspective = true;
      this.mRightHandEnabled = false;
      this.mChanged = true;
    }
  }
  /**
   * right-hand axis perspective projection
   * @param fovRadian radian value
   * @param aspect the value is the view port width / height
   * @param zNear the camera near plane distance
   * @param zFar the camera far plane distance
   */


  perspectiveRH(fovRadian, aspect, zNear, zFar) {
    if (this.mUnlock) {
      this.mAspect = aspect;
      this.mFovRadian = fovRadian;
      this.mZNear = zNear;
      this.mZFar = zFar;
      this.mProjMat.perspectiveRH(fovRadian, aspect, zNear, zFar);
      this.mViewFieldZoom = Math.tan(fovRadian * 0.5);
      this.mProject2Enabled = false;
      this.mPerspective = true;
      this.mRightHandEnabled = true;
      this.mChanged = true;
    }
  }

  perspectiveRH2(fovRadian, pw, ph, zNear, zFar) {
    if (this.mUnlock) {
      this.mAspect = pw / ph;
      this.mFovRadian = fovRadian;
      this.mZNear = zNear;
      this.mZFar = zFar;
      this.mProjMat.perspectiveRH2(fovRadian, pw, ph, zNear, zFar);
      this.mViewFieldZoom = Math.tan(fovRadian * 0.5);
      this.mPerspective = true;
      this.mProject2Enabled = true;
      this.mRightHandEnabled = true;
      this.mChanged = true;
    }
  }

  get aspect() {
    return this.mAspect;
  }

  get viewFieldZoom() {
    return this.mViewFieldZoom;
  }

  orthoRH(zNear, zFar, b, t, l, r) {
    if (this.mUnlock) {
      this.mZNear = zNear;
      this.mZFar = zFar;
      this.mB = b;
      this.mT = t;
      this.mL = l;
      this.mR = r;
      this.mProjMat.orthoRH(b, t, l, r, zNear, zFar, this.inversePerspectiveZ ? -1 : 1);
      this.mPerspective = false;
      this.mRightHandEnabled = true;
      this.mChanged = true;
    }
  }

  orthoLH(zNear, zFar, b, t, l, r) {
    if (this.mUnlock) {
      this.mZNear = zNear;
      this.mZFar = zFar;
      this.mB = b;
      this.mT = t;
      this.mL = l;
      this.mR = r;
      this.mProjMat.orthoLH(b, t, l, r, zNear, zFar, this.inversePerspectiveZ ? -1 : 1);
      this.mPerspective = false;
      this.mRightHandEnabled = false;
      this.mChanged = true;
    }
  }

  setViewXY(px, py) {
    if (this.mUnlock) {
      this.mViewX = px;
      this.mViewY = py;
    }
  }

  setViewSize(pw, ph) {
    if (this.mUnlock) {
      if (pw != this.mViewW || ph != this.mViewH) {
        this.mViewW = pw;
        this.mViewH = ph;
        this.mViewHalfW = pw * 0.5;
        this.mViewHalfH = ph * 0.5;
        this.frustum.setViewSize(pw, ph);

        if (this.mPerspective) {
          if (this.mProject2Enabled) {
            if (this.mRightHandEnabled) this.perspectiveRH2(this.mFovRadian, pw, ph, this.mZNear, this.mZFar);
          } else {
            if (this.mRightHandEnabled) this.perspectiveRH(this.mFovRadian, pw / ph, this.mZNear, this.mZFar);else this.perspectiveLH(this.mFovRadian, pw / ph, this.mZNear, this.mZFar);
          }
        } else {
          this.orthoRH(this.mZNear, this.mZFar, -0.5 * ph, 0.5 * ph, -0.5 * pw, 0.5 * pw);
        }
      }
    }
  }

  get rightHand() {
    return this.mRightHandEnabled;
  }

  get viewX() {
    return this.mViewX;
  }

  get viewY() {
    return this.mViewY;
  }

  get viewWidth() {
    return this.mViewW;
  }

  get viewHeight() {
    return this.mViewH;
  }

  translation(v3) {
    if (this.mUnlock) {
      this.mCamPos.copyFrom(v3); // this.mLookAtPos.x = v3.x + this.mLookAtDirec.x;
      // this.mLookAtPos.y = v3.y + this.mLookAtDirec.y;
      // this.mLookAtPos.z = v3.z + this.mLookAtDirec.z;

      this.mLookAtPos.addVecsTo(v3, this.mLookAtDirec);
      this.mChanged = true;
    }
  }

  translationXYZ(px, py, pz) {
    this.mTempV.setXYZ(px, py, pz);

    if (this.mUnlock && Vector3_1.default.DistanceSquared(this.mCamPos, this.mTempV) > 0.00001) {
      this.mCamPos.setXYZ(px, py, pz);
      this.mLookAtPos.x = px + this.mLookAtDirec.x;
      this.mLookAtPos.y = py + this.mLookAtDirec.y;
      this.mLookAtPos.z = pz + this.mLookAtDirec.z;
      this.mChanged = true;
    }
  }

  forward(dis) {
    if (this.mUnlock) {
      this.mCamPos.x += this.mLookDirectNV.x * dis;
      this.mCamPos.y += this.mLookDirectNV.y * dis;
      this.mCamPos.z += this.mLookDirectNV.z * dis;
      this.mLookAtPos.addVecsTo(this.mCamPos, this.mLookAtDirec);
      this.mChanged = true;
    }
  }
  /**
   * 在平行于远平面的平面上滑动， 垂直于此平面的方向上不变
   * @param dx 摄像机 view 空间内 x方向偏移量
   * @param dy 摄像机 view 空间内 y方向偏移量
   */


  slideViewOffsetXY(dx, dy) {
    if (this.mUnlock) {
      this.mTempV.setXYZ(dx, dy, 0);
      this.mInvViewMat.transformVectorSelf(this.mTempV);
      dx = this.mTempV.x - this.mCamPos.x;
      dy = this.mTempV.y - this.mCamPos.y;
      let dz = this.mTempV.z - this.mCamPos.z;
      this.mCamPos.x += dx;
      this.mCamPos.y += dy;
      this.mCamPos.z += dz;
      this.mLookAtPos.x += dx;
      this.mLookAtPos.y += dy;
      this.mLookAtPos.z += dz;
      this.mChanged = true;
    }
  }

  forwardFixPos(dis, pos) {
    if (this.mUnlock) {
      this.mCamPos.copyFrom(this.mLookDirectNV).scaleBy(dis).addBy(pos);
      this.mLookAtPos.addVecsTo(this.mCamPos, this.mLookAtDirec);
      this.mChanged = true;
    }
  }

  swingHorizontalWithAxis(rad, axis) {
    if (this.mUnlock) {
      this.mTempMat.identity();

      if (axis != null) {
        this.mTempMat.appendRotation(rad * MathConst_1.default.MATH_PI_OVER_180, axis);
      } else {
        this.mTempMat.appendRotation(rad * MathConst_1.default.MATH_PI_OVER_180, Vector3_1.default.Y_AXIS);
      }

      this.mLookAtDirec.subVecsTo(this.mCamPos, this.mLookAtPos);
      this.mTempMat.transformVectorSelf(this.mLookAtDirec);
      this.mCamPos.addVecsTo(this.mLookAtDirec, this.mLookAtPos);
      this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
      this.mLookRHand = true;
      this.mLookDirectNV.copyFrom(this.mLookAtDirec);
      this.mLookDirectNV.normalize(); //

      this.mTempMat.transformVectorSelf(this.mInitRV);
      this.mInitRV.normalize(); //Vector3.Cross(this.mLookAtDirec, this.mUp, this.mInitRV);

      Vector3_1.default.Cross(this.mInitRV, this.mLookAtDirec, this.mUp);
      this.mUp.normalize();
      this.mChanged = true;
    }
  }

  swingHorizontal(degree) {
    if (this.mUnlock) {
      this.mTempMat.identity();
      this.mTempMat.appendRotation(degree * MathConst_1.default.MATH_PI_OVER_180, this.mUp); // this.mLookAtDirec.x = this.mCamPos.x - this.mLookAtPos.x;
      // this.mLookAtDirec.y = this.mCamPos.y - this.mLookAtPos.y;
      // this.mLookAtDirec.z = this.mCamPos.z - this.mLookAtPos.z;

      this.mLookAtDirec.subVecsTo(this.mCamPos, this.mLookAtPos);
      this.mTempMat.transformVectorSelf(this.mLookAtDirec); // this.mCamPos.x = this.mLookAtDirec.x + this.mLookAtPos.x;
      // this.mCamPos.y = this.mLookAtDirec.y + this.mLookAtPos.y;
      // this.mCamPos.z = this.mLookAtDirec.z + this.mLookAtPos.z;

      this.mCamPos.addVecsTo(this.mLookAtDirec, this.mLookAtPos); // this.mLookAtDirec.x = this.mLookAtPos.x - this.mCamPos.x;
      // this.mLookAtDirec.y = this.mLookAtPos.y - this.mCamPos.y;
      // this.mLookAtDirec.z = this.mLookAtPos.z - this.mCamPos.z;

      this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
      this.mLookRHand = true;
      this.mLookDirectNV.copyFrom(this.mLookAtDirec);
      this.mLookDirectNV.normalize();
      Vector3_1.default.Cross(this.mLookAtDirec, this.mUp, this.mInitRV);
      this.mInitRV.normalize();
      this.mChanged = true;
    }
  }

  swingVertical(degree) {
    if (this.mUnlock) {
      this.mTempMat.identity();
      this.mTempMat.appendRotation(MathConst_1.default.ToRadian(degree), this.mInitRV);
      this.mLookAtDirec.subVecsTo(this.mCamPos, this.mLookAtPos);
      this.mTempMat.transformVectorSelf(this.mLookAtDirec);
      this.mCamPos.addVecsTo(this.mLookAtDirec, this.mLookAtPos);
      this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
      this.mLookRHand = true;
      this.mLookDirectNV.copyFrom(this.mLookAtDirec);
      this.mLookDirectNV.normalize();
      Vector3_1.default.Cross(this.mInitRV, this.mLookAtDirec, this.mUp);
      this.mUp.normalize();
      this.mInitUp.copyFrom(this.mUp);
      this.mChanged = true;
    }
  }

  get position() {
    this.m_tempCamPos.copyFrom(this.mCamPos);
    return this.m_tempCamPos;
  }

  set position(v3) {
    if (this.mUnlock) {
      Vector3_1.default.Cross(this.mLookAtDirec, this.mUp, this.mTempV);
      let dot = this.mTempV.dot(this.mInitUp);
      this.mTempV1.copyFrom(this.mInitUp);
      this.mTempV1.scaleBy(dot);
      this.mTempV.subtractBy(this.mTempV1);
      this.mCamPos.copyFrom(v3);
      this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
      this.mLookDirectNV.copyFrom(this.mLookAtDirec);
      this.mLookDirectNV.normalize();
      Vector3_1.default.Cross(this.mTempV, this.mLookAtDirec, this.mUp);
      this.mUp.normalize();
      this.mChanged = true;
    }
  }

  setPositionXYZ(px, py, pz) {
    if (this.mUnlock) {
      Vector3_1.default.Cross(this.mLookAtDirec, this.mUp, this.mTempV);
      var dot = this.mTempV.dot(this.mInitUp);
      this.mTempV1.copyFrom(this.mInitUp);
      this.mTempV1.scaleBy(dot);
      this.mTempV.subtractBy(this.mTempV1);
      this.mCamPos.setXYZ(px, py, pz);
      this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
      this.mLookDirectNV.copyFrom(this.mLookAtDirec);
      this.mLookDirectNV.normalize();
      Vector3_1.default.Cross(this.mTempV, this.mLookAtDirec, this.mUp);
      this.mUp.normalize();
      this.mChanged = true;
    }
  }

  setLookPosXYZFixUp(px, py, pz) {
    if (this.mUnlock) {
      this.mLookAtPos.setXYZ(px, py, pz);
      this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
      this.mLookRHand = true;
      this.mLookDirectNV.copyFrom(this.mLookAtDirec);
      this.mLookDirectNV.normalize();
      Vector3_1.default.Cross(this.mLookAtDirec, this.mUp, this.mInitRV);
      this.mInitRV.normalize();
      this.mChanged = true;
    }
  }

  setPositionXYZFixUp(px, py, pz) {
    if (this.mUnlock) {
      this.mCamPos.setXYZ(px, py, pz);
      this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
      this.mLookRHand = true;
      this.mLookDirectNV.copyFrom(this.mLookAtDirec);
      this.mLookDirectNV.normalize();
      Vector3_1.default.Cross(this.mLookAtDirec, this.mUp, this.mInitRV);
      this.mInitRV.normalize();
      this.mChanged = true;
    }
  }

  setPositionFixUp(v3) {
    if (this.mUnlock) {
      this.mCamPos.copyFrom(v3);
      this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
      this.mLookRHand = true;
      this.mLookDirectNV.copyFrom(this.mLookAtDirec);
      this.mLookDirectNV.normalize();
      Vector3_1.default.Cross(this.mLookAtDirec, this.mUp, this.mInitRV);
      this.mInitRV.normalize();
      this.mChanged = true;
    }
  }

  copyFrom(tarCam) {
    let pv = tarCam.position;
    this.mCamPos.copyFrom(pv);
    pv = tarCam.lookPosition;
    this.mLookAtPos.copyFrom(pv);
    this.near = tarCam.near;
    this.far = tarCam.far;
    this.nearPlaneWidth = tarCam.nearPlaneWidth;
    this.nearPlaneHeight = tarCam.nearPlaneHeight;
    this.perspective = tarCam.perspective;
    this.mViewInvMat.copyFrom(tarCam.viewInvertMatrix);
  }
  /**
   * @returns view space z-axis vector3 value in the world space
   */


  get nv() {
    this.m_tempNV.copyFrom(this.mLookDirectNV);
    return this.m_tempNV;
  }
  /**
   * @returns view space y-axis vector3 value in the world space
   */


  get uv() {
    this.m_tempUPV.copyFrom(this.mUp);
    return this.m_tempUPV;
  }
  /**
   * @returns view space x-axis vector3 value in the world space
   */


  get rv() {
    this.m_tempRV.copyFrom(this.mInitRV);
    return this.m_tempRV;
  }

  get lookPosition() {
    this.m_tempLookAtPos.copyFrom(this.mLookAtPos);
    return this.m_tempLookAtPos;
  }

  setLookAtPosition(pv) {
    if (this.mUnlock) {
      this.mLookAtPos.copyFrom(pv);
      this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
      this.mLookDirectNV.copyFrom(this.mLookAtDirec);
      this.mLookDirectNV.normalize();
      this.mChanged = true;
    }
  }

  setLookAtXYZ(px, py, pz) {
    if (this.mUnlock) {
      this.mLookAtPos.setXYZ(px, py, pz);
      this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
      this.mLookDirectNV.copyFrom(this.mLookAtDirec);
      this.mLookDirectNV.normalize();
      this.mChanged = true;
    }
  }

  get perspective() {
    return this.mPerspective;
  }

  set perspective(boo) {
    this.mPerspective = boo;
  }

  appendRotationByAxis(degree, axis, pivotPoint = null) {
    if (this.mUnlock) {
      this.m_rotDegree = degree;
      this.mChanged = true;
      this.m_rotAxis.copyFrom(axis);
      this.m_rotPivotPoint = pivotPoint;
      this.m_axisRotEnabled = true;
    }
  }

  setRotationX(degree) {
    this.mRotV.x = degree;
    this.mChanged = true;
    this.m_axisRotEnabled = false;
  }

  getRotationX() {
    return this.mRotV.x;
  }

  setRotationY(degree) {
    this.mRotV.y = degree;
    this.mChanged = true;
    this.m_axisRotEnabled = false;
  }

  getRotationY() {
    return this.mRotV.y;
  }

  setRotationZ(degree) {
    this.mRotV.z = degree;
    this.mChanged = true;
    this.m_axisRotEnabled = false;
  }

  getRotationZ() {
    return this.mRotV.z;
  }

  setRotationXYZ(rx, ry, rz) {
    if (this.mUnlock) {
      this.mRotV.setXYZ(rx, ry, rz);
      this.mChanged = true;
      this.m_axisRotEnabled = false;
    }
  }

  screenXYToViewXYZ(px, py, outV) {
    px -= this.mViewX;
    py -= this.mViewY;

    if (this.mPerspective) {
      px = this.mNearPlaneW * (px - this.mViewHalfW) / this.mViewHalfW;
      py = this.mNearPlaneH * (this.mViewHalfH - py) / this.mViewHalfH;
    }

    outV.setXYZ(px, py, -this.mZNear); //
  }

  screenXYToWorldXYZ(px, py, outV) {
    px -= this.mViewX;
    py -= this.mViewY;

    if (this.mPerspective) {
      px = 0.5 * this.mNearPlaneW * (px - this.mViewHalfW) / this.mViewHalfW;
      py = 0.5 * this.mNearPlaneH * (this.mViewHalfH - py) / this.mViewHalfH;
    }

    outV.setXYZ(px, py, -this.mZNear);
    outV.w = 1.0;
    this.mViewInvMat.transformVectorSelf(outV);
  }

  getWorldPickingRayByScreenXY(screenX, screenY, ray_pos, ray_tv) {
    //console.log("screenX,screenY: ",screenX,screenY,this.mViewHalfW,this.mViewHalfH);
    screenX -= this.mViewX;
    screenY -= this.mViewY;

    if (this.mPerspective) {
      screenX = 0.5 * this.mNearPlaneW * (screenX - this.mViewHalfW) / this.mViewHalfW;
      screenY = 0.5 * this.mNearPlaneH * (screenY - this.mViewHalfH) / this.mViewHalfH;
      ray_pos.setXYZ(screenX, screenY, -this.mZNear);
      ray_pos.w = 1.0;
      this.mViewInvMat.transformVectorSelf(ray_pos);
      ray_tv.copyFrom(ray_pos);
      ray_tv.subtractBy(this.mCamPos);
      ray_tv.normalize();
    } else {
      screenX -= this.mViewHalfW;
      screenY -= this.mViewHalfH;
      ray_pos.setXYZ(screenX, screenY, -this.mZNear);
      ray_pos.w = 1.0;
      this.mViewInvMat.transformVectorSelf(ray_pos);
      ray_tv.copyFrom(this.mLookDirectNV);
    }
  }

  calcScreenNormalizeXYByWorldPos(pv3, scPV3) {
    scPV3.copyFrom(pv3);
    this.mVPMat.transformVectorSelf(scPV3);
    scPV3.x /= scPV3.w;
    scPV3.y /= scPV3.w;
  }

  worldPosToScreen(pv) {
    this.mViewMat.transformVector3Self(pv);
    this.mProjMat.transformVectorSelf(pv);
    pv.x /= pv.w;
    pv.y /= pv.w;
    pv.x *= this.mViewHalfW;
    pv.y *= this.mViewHalfH;
    pv.x += this.mViewX;
    pv.y += this.mViewY;
  } // 计算3D空间的球体在屏幕空间的最小包围矩形, outV的x,y表示矩形的x和y;outV的z和w表示宽和高,取值为像素数


  calcViewRectByWorldSphere(pv, radius, outV) {
    this.mViewMat.transformVector3Self(pv);
    radius *= 1.15;
    outV.x = pv.x - radius;
    outV.y = pv.y - radius;
    outV.z = pv.z;
    pv.x += radius;
    pv.y += radius;
    this.mProjMat.transformPerspV4Self(outV);
    this.mProjMat.transformPerspV4Self(pv);
    pv.z = 1.0 / pv.w;
    outV.z = pv.x * pv.z;
    outV.w = pv.y * pv.z;
    outV.z *= this.mViewHalfW;
    outV.w *= this.mViewHalfH;
    outV.x *= pv.z;
    outV.y *= pv.z;
    outV.x *= this.mViewHalfW;
    outV.y *= this.mViewHalfH;
    outV.z = outV.z - outV.x;
    outV.w = outV.w - outV.y;
    outV.x += this.mViewX;
    outV.y += this.mViewY;
  } // 计算3D空间的球体在屏幕空间的最小包围矩形, outV的x,y表示矩形的x和y;outV的z和w表示宽和高,取值0.0 - 1.0之间


  calcScreenRectByWorldSphere(pv, radius, outV) {
    this.mViewMat.transformVector3Self(pv);
    radius *= 1.15;
    outV.x = pv.x - radius;
    outV.y = pv.y - radius;
    pv.x += radius;
    pv.y += radius;
    this.mProjMat.transformPerspV4Self(outV);
    this.mProjMat.transformPerspV4Self(pv);
    pv.z = 1.0 / pv.w;
    outV.z = pv.x * pv.z;
    outV.w = pv.y * pv.z;
    outV.x *= pv.z;
    outV.y *= pv.z;
    outV.z = outV.z - outV.x;
    outV.w = outV.w - outV.y;
  }
  /*
  private mFrustumAABB = new AABB();
  private mNearPlaneHalfW = 0.5;
  private mNearPlaneHalfH = 0.5;
  private mNearWCV = new Vector3();
  private mFarWCV = new Vector3();
  private mWNV = new Vector3();
  // 4 far point, 4 near point
  private mWFrustumVS: Vector3[] = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), null, null, null];
  // world space front,back ->(view space -z,z), world space left,right ->(view space -x,x),world space top,bottm ->(view space y,-y)
  private mWFruPlanes: Plane[] = [new Plane(), new Plane(), new Plane(), new Plane(), new Plane(), new Plane()];
  private mFpns: Vector3[] = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()];
  private mFpds: number[] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
  //*/
  // getFrustumWorldPlantAt(i: number): Plane {
  //     return this.mWFruPlanes[i];
  // }


  getInvertViewMatrix() {
    return this.mInvViewMat;
  }

  get near() {
    return this.mZNear;
  }

  set near(value) {
    this.mZNear = value;
  }

  get far() {
    return this.mZFar;
  }

  set far(value) {
    this.mZFar = value;
  }

  get nearPlaneWidth() {
    return this.mNearPlaneW;
  }

  set nearPlaneWidth(value) {
    this.mNearPlaneW = value;
  }

  get nearPlaneHeight() {
    return this.mNearPlaneH;
  }

  set nearPlaneHeight(value) {
    this.mNearPlaneH = value;
  }
  /**
   * fov radian value
   */


  get fov() {
    return this.mFovRadian;
  }

  calcParam() {
    if (!this.mInvViewMat) this.mInvViewMat = new Matrix4_1.default();
    this.mInvViewMat.copyFrom(this.mViewMat);
    this.mInvViewMat.invert();
    const frustrum = this.frustum;
    frustrum.perspective = this.mPerspective;
    frustrum.setParam(this.mFovRadian, this.mZNear, this.mZFar, this.mAspect);
    frustrum.update(this.mInvViewMat);
    /*
    let plane: Plane = null;
    let halfMinH = this.mViewHalfH;
    let halfMinW = this.mViewHalfW;
    let halfMaxH = this.mViewHalfH;
    let halfMaxW = this.mViewHalfW;
    if(this.mPerspective) {
        const tanv =  Math.tan(this.mFovRadian * 0.5);
        halfMinH = this.mZNear * tanv;
        halfMinW = halfMinH * this.mAspect;
        halfMaxH = this.mZFar * tanv;
        halfMaxW = halfMaxH * this.mAspect;
    }
      const frustumPositions = this.mWFrustumVS;
    const frustumPlanes = this.mWFruPlanes;
    //console.log("Camera::calcParam(), (halfMinW, halfMinH): "+halfMinW+", "+halfMinH);
    this.mNearPlaneHalfW = halfMinW;
    this.mNearPlaneHalfH = halfMinH;
    // inner view space
    this.mNearWCV.setXYZ(0, 0, -this.mZNear);
    this.mFarWCV.setXYZ(0, 0, -this.mZFar);
    this.mInvViewMat.transformVectorSelf(this.mNearWCV);
    this.mInvViewMat.transformVectorSelf(this.mFarWCV);
    this.mWNV.subVecsTo(this.mFarWCV, this.mNearWCV);
    this.mWNV.normalize();
      // front face, far plane
    plane = frustumPlanes[0];
    plane.nv.copyFrom(this.mWNV);
    plane.distance = plane.nv.dot(this.mFarWCV);
    plane.position.copyFrom(this.mFarWCV);
    // back face, near face
    plane = frustumPlanes[1];
    plane.nv.copyFrom(frustumPlanes[0].nv);
    plane.distance = plane.nv.dot(this.mNearWCV);
    plane.position.copyFrom(this.mNearWCV);
      // frustumPositions[8] = this.mNearWCV;
    // frustumPositions[9] = this.mFarWCV;
    // frustumPositions[11] = this.mWNV;
    // far face
    frustumPositions[0].setXYZ(-halfMaxW,  -halfMaxH, -this.mZFar);
    frustumPositions[1].setXYZ( halfMaxW,  -halfMaxH, -this.mZFar);
    frustumPositions[2].setXYZ( halfMaxW,  halfMaxH,  -this.mZFar);
    frustumPositions[3].setXYZ(-halfMaxW,  halfMaxH,  -this.mZFar);
    // near face
    frustumPositions[4].setXYZ(-halfMinW, -halfMinH, -this.mZNear);
    frustumPositions[5].setXYZ( halfMinW, -halfMinH, -this.mZNear);
    frustumPositions[6].setXYZ( halfMinW,  halfMinH, -this.mZNear);
    frustumPositions[7].setXYZ(-halfMinW,  halfMinH, -this.mZNear);
      const invM = this.mInvViewMat;
    invM.transformVectorSelf(frustumPositions[0]);
    invM.transformVectorSelf(frustumPositions[1]);
    invM.transformVectorSelf(frustumPositions[2]);
    invM.transformVectorSelf(frustumPositions[3]);
    invM.transformVectorSelf(frustumPositions[4]);
    invM.transformVectorSelf(frustumPositions[5]);
    invM.transformVectorSelf(frustumPositions[6]);
    invM.transformVectorSelf(frustumPositions[7]);
      this.mFrustumAABB.reset();
    for (let i = 0; i < 8; ++i) {
        this.mFrustumAABB.addPosition(frustumPositions[i]);
    }
    this.mFrustumAABB.updateFast();
      // bottom
    this.mTempV.subVecsTo(frustumPositions[0], frustumPositions[4]);
    let v0 = frustumPositions[1];
    this.mTempV1.subVecsTo(frustumPositions[1], frustumPositions[5]);
    plane = frustumPlanes[3];
    Vector3.Cross(this.mTempV1, this.mTempV, plane.nv);
    plane.nv.normalize();
    plane.distance = plane.nv.dot(v0);
    plane.position.copyFrom(v0);
    // top
    this.mTempV.subVecsTo(frustumPositions[3], frustumPositions[7]);
    v0 = frustumPositions[2];
    this.mTempV1.subVecsTo(frustumPositions[2], frustumPositions[6]);
    plane = frustumPlanes[2];
    Vector3.Cross(this.mTempV1, this.mTempV, plane.nv);
    plane.nv.normalize();
    plane.distance = plane.nv.dot(v0);
    plane.position.copyFrom(v0);
    // left
    this.mTempV.subVecsTo(frustumPositions[0], frustumPositions[4]);
    v0 = frustumPositions[3];
    this.mTempV1.subVecsTo(frustumPositions[3], frustumPositions[7]);
    plane = frustumPlanes[4];
    Vector3.Cross(this.mTempV, this.mTempV1, plane.nv);
    plane.nv.normalize();
    plane.distance = plane.nv.dot(v0);
    plane.position.copyFrom(v0);
    // right
    this.mTempV.subVecsTo(frustumPositions[1], frustumPositions[5]);
    v0 = frustumPositions[2];
    this.mTempV1.subVecsTo(frustumPositions[2], frustumPositions[6]);
    plane = frustumPlanes[5];
    Vector3.Cross(this.mTempV, this.mTempV1, plane.nv);
    plane.nv.normalize();
    plane.distance = plane.nv.dot(v0);
    plane.position.copyFrom(v0);
    const fpna = this.mFpns;
    fpna[0].copyFrom(frustumPlanes[0].nv);
    fpna[1].copyFrom(frustumPlanes[1].nv);
    fpna[1].scaleBy(-1.0);
    fpna[2].copyFrom(frustumPlanes[2].nv);
    fpna[3].copyFrom(frustumPlanes[3].nv);
    fpna[3].scaleBy(-1.0);
    fpna[4].copyFrom(frustumPlanes[4].nv);
    fpna[4].scaleBy(-1.0);
    fpna[5].copyFrom(frustumPlanes[5].nv);
      const fpda = this.mFpds;
    fpda[0] = frustumPlanes[0].distance;
    fpda[1] = -frustumPlanes[1].distance;
    fpda[2] = frustumPlanes[2].distance;
    fpda[3] = -frustumPlanes[3].distance;
    fpda[4] = -frustumPlanes[4].distance;
    fpda[5] = frustumPlanes[5].distance;
    //*/
  }

  setViewMatrix(viewMatrix) {
    this.mViewMatrix = viewMatrix;
    this.mChanged = true;
  }

  update() {
    if (this.mChanged) {
      this.version++;
      this.mChanged = false;

      if (!this.mViewMatrix) {
        if (this.m_axisRotEnabled) {
          this.mMatrix.appendRotationPivot(this.m_rotDegree * MathConst_1.default.MATH_PI_OVER_180, this.m_rotAxis, this.m_rotPivotPoint);
        } else {
          this.mMatrix.identity();
          this.mMatrix.appendRotationEulerAngle(this.mRotV.x * MathConst_1.default.MATH_PI_OVER_180, this.mRotV.y * MathConst_1.default.MATH_PI_OVER_180, this.mRotV.z * MathConst_1.default.MATH_PI_OVER_180);
        }

        if (this.mLookRHand) {
          this.mViewMat.lookAtRH(this.mCamPos, this.mLookAtPos, this.mUp);
        } else {
          this.mViewMat.lookAtLH(this.mCamPos, this.mLookAtPos, this.mUp);
        }

        this.mViewMat.append(this.mMatrix);
      } else {
        this.mViewMat.copyFrom(this.mViewMatrix);
      }

      if (this.mProject2Enabled) {
        this.mNearPlaneW = this.mZNear * Math.tan(this.mFovRadian * 0.5) * 2.0;
        this.mNearPlaneH = this.mNearPlaneW / this.mAspect;
      } else {
        this.mNearPlaneH = this.mZNear * Math.tan(this.mFovRadian * 0.5) * 2.0;
        this.mNearPlaneW = this.mAspect * this.mNearPlaneH;
      }

      this.mViewInvMat.copyFrom(this.mViewMat);
      this.mViewInvMat.invert();
      this.mVPMat.identity();
      this.mVPMat.copyFrom(this.mViewMat);
      this.mVPMat.append(this.mProjMat);
      this.calcParam(); // very very important !!!

      this.updateUniformData();
    }
  }

  updateUniformData() {
    this.viewUniformV.upate();
    this.projUniformV.upate();
  }

  destroy() {}

  get lookRightHand() {
    return this.mLookRHand;
  }

  get lookLeftHand() {
    return !this.mLookRHand;
  }

  get viewProjMatrix() {
    return this.mVPMat;
  }

  get viewMatrix() {
    return this.mViewMat;
  }

  get viewInvertMatrix() {
    return this.mViewInvMat;
  }

  get projectMatrix() {
    return this.mProjMat;
  }

}

exports.default = Camera;

/***/ }),

/***/ "6b10":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const GPUTextureFormat_1 = __webpack_require__("3341");

const GPUMipmapGenerator_1 = __webpack_require__("b3f5");

exports.calculateMipLevels = GPUMipmapGenerator_1.calculateMipLevels;

const WebGPUTextureContext_1 = __webpack_require__("2b0e");

const WebGPUBufferContext_1 = __webpack_require__("bc85");

class WebGPUContext {
  constructor() {
    this.mUid = WebGPUContext.sUid++;
    this.presentationFormat = 'bgra8unorm';
    this.enabled = false;
    this.mipmapGenerator = new GPUMipmapGenerator_1.GPUMipmapGenerator();
    this.texture = new WebGPUTextureContext_1.WebGPUTextureContext();
    this.buffer = new WebGPUBufferContext_1.WebGPUBufferContext();
  }
  /**
   * @param format GPU texture format string.
   * @param error The default value is true.
   * @returns GPU texture format is correct or wrong.
   */


  checkGPUTextureFormat(format, error = true) {
    return GPUTextureFormat_1.checkGPUTextureFormat(format, error);
  }

  get uid() {
    return this.mUid;
  }

  get canvasWidth() {
    return this.canvas.width;
  }

  get canvasHeight() {
    return this.canvas.height;
  }

  async initialize(canvas, wgConfig, deviceDescriptor) {
    const selfT = this;
    selfT.canvas = canvas;
    const gpu = navigator.gpu;

    if (gpu) {
      console.log("WebGPU is supported on this browser.");
      selfT.gpu = gpu;
      if (!deviceDescriptor) deviceDescriptor = {};
      const adapter = await gpu.requestAdapter();

      if (adapter) {
        selfT.gpuAdapter = adapter;
        console.log("Appropriate GPUAdapter found, adapter: ", adapter);

        if (deviceDescriptor.requiredFeatures === undefined) {
          deviceDescriptor.requiredFeatures = [// 'texture-compression-bc',
            // 'texture-compression-etc2',
            // 'texture-compression-astc'
          ];
        }

        const device = await adapter.requestDevice(deviceDescriptor);

        if (device) {
          this.mipmapGenerator.initialize(device);
          selfT.device = device;
          selfT.queue = device.queue;
          console.log("Appropriate GPUDevice found.");
          let canvasFormat = gpu.getPreferredCanvasFormat();
          selfT.canvasFormat = canvasFormat;
          selfT.context = canvas.getContext("webgpu");
          const context = this.context;
          const format = canvasFormat;

          if (GPUTextureFormat_1.checkGPUTextureFormat(format)) {
            console.log("Given canvasFormat('" + format + "') is a valid gpu texture format.");
          } else {
            console.error("Given canvasFormat('" + format + "') is an invalid gpu texture format.");
            canvasFormat = "bgra8unorm";
          }

          if (wgConfig) {
            wgConfig.device = device;

            if (wgConfig.format) {
              canvasFormat = wgConfig.format;
            } else {
              wgConfig.format = canvasFormat;
            }
          }

          selfT.presentationFormat = wgConfig.format;
          context.configure(wgConfig ? wgConfig : {
            device: device,
            format: canvasFormat,
            // usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
            alphaMode: "premultiplied"
          });
          selfT.texture.initialize(this);
          selfT.buffer.initialize(this);
          selfT.enabled = true;
          console.log("WebGPUContext instance initialization success ...");
        } else {
          throw new Error("No appropriate GPUDevice found.");
        }
      } else {
        throw new Error("No appropriate GPUAdapter found.");
      }
    } else {
      throw new Error("WebGPU is not supported on this browser.");
    }
  }

  getPreferredCanvasFormat() {
    return this.gpu.getPreferredCanvasFormat();
  }

  createCurrentView() {
    return this.context.getCurrentTexture().createView();
  }

}

WebGPUContext.sUid = 0;
exports.WebGPUContext = WebGPUContext;

/***/ }),

/***/ "70bd":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGRShaderParams_1 = __webpack_require__("e2cf");

class WGRPipelineShader {
  constructor(wgCtx) {
    this.mShdModuleMap = new Map();

    if (wgCtx) {
      this.initialize(wgCtx);
    }
  }

  initialize(wgCtx) {
    if (wgCtx && !this.mWGCtx) {
      this.mWGCtx = wgCtx;
    }
  }

  createShaderModule(type, param) {
    if (param) {
      const device = this.mWGCtx.device;

      if (param.uuid && param.uuid !== "") {
        const ns = param.uuid + "-" + type;
        const map = this.mShdModuleMap;

        if (map.has(ns)) {
          console.log("WGRPipelineShader::createShaderModule(), use old shader module ...");
          return map.get(ns);
        }

        const module = device.createShaderModule({
          label: ns,
          code: param.code
        });
        map.set(ns, module);
        return module;
      }

      const module = device.createShaderModule({
        code: param.code
      });
      return module;
    }

    return null;
  }

  build(params, rpass) {
    let shdModule = params.shaderSrc ? this.createShaderModule("Shader", params.shaderSrc) : null;
    let vertShdModule = params.vertShaderSrc ? this.createShaderModule("VertShader", params.vertShaderSrc) : shdModule;
    let fragShdModule = params.fragShaderSrc ? this.createShaderModule("FragShader", params.fragShaderSrc) : shdModule;
    let compShdModule = params.compShaderSrc ? this.createShaderModule("CompShader", params.compShaderSrc) : shdModule;
    let entryPoint = "";
    const vert = params.vertex;
    let shdSrc = params.shaderSrc ? params.shaderSrc : params.vertShaderSrc;

    if (shdSrc) {
      entryPoint = shdSrc.vertEntryPoint !== undefined ? shdSrc.vertEntryPoint : WGRShaderParams_1.findShaderEntryPoint('@vertex', shdSrc.code);

      if (entryPoint !== '') {
        vert.module = vertShdModule;
        vert.entryPoint = entryPoint;
      }
    } else {
      params.vertex = null;
    }

    let frag = params.fragment;
    shdSrc = params.shaderSrc ? params.shaderSrc : params.fragShaderSrc;

    if (shdSrc) {
      entryPoint = shdSrc.fragEntryPoint !== undefined ? shdSrc.fragEntryPoint : WGRShaderParams_1.findShaderEntryPoint('@fragment', shdSrc.code);

      if (entryPoint !== '') {
        if (!frag) {
          frag = params.fragment = WGRShaderParams_1.createFragmentState();
        }

        frag.module = fragShdModule;
        frag.entryPoint = entryPoint;
      }

      this.checkFrag(frag, rpass);
    } else {
      params.fragment = null;
    }

    shdSrc = params.compShaderSrc;

    if (shdSrc && compShdModule) {
      shdSrc = params.compShaderSrc;
      params.compute = WGRShaderParams_1.createComputeState(compShdModule);

      if (shdSrc.compEntryPoint !== undefined) {
        params.compute.entryPoint = shdSrc.compEntryPoint;
      } else {
        shdSrc.compEntryPoint = params.compute.entryPoint = WGRShaderParams_1.findShaderEntryPoint('@compute', shdSrc.code);
      }
    } else if (compShdModule) {
      shdSrc = params.shaderSrc;
      entryPoint = WGRShaderParams_1.findShaderEntryPoint('@compute', shdSrc.code);

      if (entryPoint != '') {
        params.compute = WGRShaderParams_1.createComputeState(compShdModule);
        params.compute.entryPoint = entryPoint;
      }
    }
  }

  checkFrag(frag, rpass) {
    if (frag) {
      let cs = rpass.passColors;
      let ts = frag.targets;

      for (let i = 0; i < cs.length; ++i) {
        // console.log('checkFrag(), textureFormat: ', cs[i].textureFormat);
        // console.log('checkFrag(), AAA, textureFormat: ', cs[i].textureFormat, ', target format: ', ts[i].format);
        if (ts.length > i) {
          ts[i].format = cs[i].textureFormat;
        } else {
          ts.push({
            format: cs[i].textureFormat
          });
        } // console.log('checkFrag(), textureFormat: ', cs[i].textureFormat, ', target format: ', ts[i].format);

      }
    }
  }

}

exports.WGRPipelineShader = WGRPipelineShader;

/***/ }),

/***/ "746a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const Define_1 = __webpack_require__("af1b");

const CommonUtils_1 = __webpack_require__("fe0b");

class WGGeomAttributeBlock {
  constructor() {
    this.shdVarName = "";
    this.bindIndex = 0;
    this.strides = [3];
    /**
     * buffer bytes offset
     */

    this.bufferOffset = 0;
  }

}

exports.WGGeomAttributeBlock = WGGeomAttributeBlock;

class WGGeomIndexBuffer {
  constructor(param) {
    this.name = "";
    this.name = param.name;
    this.data = param.data;
  }

  createWireframeIvs(ivs) {
    if (ivs) {
      const len = ivs.length * 2;
      const wivs = CommonUtils_1.createIndexArrayWithSize(len);
      let a;
      let b;
      let c;
      let k = 0;

      for (let i = 0, l = ivs.length; i < l; i += 3) {
        a = ivs[i + 0];
        b = ivs[i + 1];
        c = ivs[i + 2];
        wivs[k] = a;
        wivs[k + 1] = b;
        wivs[k + 2] = b;
        wivs[k + 3] = c;
        wivs[k + 4] = c;
        wivs[k + 5] = a;
        k += 6;
      } // console.log("createWireframeIvs(), wivs.length:", wivs.length);


      return wivs;
    }

    return ivs;
  }

  toWirframe() {
    if (!this.wireframeData) {
      this.wireframeData = this.createWireframeIvs(this.data);
    }
  }

}

exports.WGGeomIndexBuffer = WGGeomIndexBuffer;

class WGGeometry {
  constructor() {
    this.name = "WGGeometry";
    this.descParam = {
      vertex: {
        buffers: [],
        attributeIndicesArray: []
      }
    };
    this.drawMode = Define_1.WGRDrawMode.TRIANGLES;
  }

  setIndexBuffer(param) {
    this.indexBuffer = new WGGeomIndexBuffer(param);
    return this;
  }

  setIndices(indicesData) {
    this.indexBuffer = new WGGeomIndexBuffer({
      data: indicesData
    });
    return this;
  }

  filterParam(param, key, strides) {
    if (param[key]) {
      param.data = param[key];

      if (!param.shdVarName) {
        param.shdVarName = key;
      }

      if (!param.strides) {
        param.strides = strides;
      }

      param[key] = undefined;
    }
  }
  /**
   * 每次添加，实际上是添加一个 attribute 组合
   */


  addAttribute(param) {
    if (param) {
      this.filterParam(param, 'position', [3]);
      this.filterParam(param, 'uv', [2]);
      this.filterParam(param, 'uv2', [2]);
      this.filterParam(param, 'normal', [3]);
      this.filterParam(param, 'color', [3]);
      const p = new WGGeomAttributeBlock();
      const ab = p;

      for (var k in param) {
        ab[k] = param[k];
      }

      if (this.attributes) {
        this.attributes.push(p);
      } else {
        this.attributes = [p];
      }
    }

    return this;
  }

  addAttributes(params) {
    if (params) {
      for (let i = 0; i < params.length; ++i) {
        this.addAttribute(params[i]);
      }
    }

    return this;
  }

  isREnabled() {
    let flag = true;
    const ats = this.attributes;

    if (ats) {
      for (let i = 0; i < ats.length; ++i) {
        if (!ats[i].data) {
          flag = false;
          break;
        }
      }
    }

    return flag;
  }

  destroy() {}

}

exports.WGGeometry = WGGeometry;

/***/ }),

/***/ "7650":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGRBufferValue_1 = __webpack_require__("2d6d");

const WGRBufferVisibility_1 = __webpack_require__("dc4d");

class WGRUniformValue extends WGRBufferValue_1.WGRBufferValue {
  constructor(param) {
    super(param);

    if (!this.visibility) {
      this.visibility = new WGRBufferVisibility_1.WGRBufferVisibility();
    }

    this.toUniform();
  }

}

exports.WGRUniformValue = WGRUniformValue;

/***/ }),

/***/ "7751":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGRendererPass_1 = __webpack_require__("0142");

const WGRPipelineCtxParams_1 = __webpack_require__("bf93");

const WGRPipelineContext_1 = __webpack_require__("36ce");

const Color4_1 = __importDefault(__webpack_require__("2c77"));

const WGRenderUnitBlock_1 = __webpack_require__("d5c3");

class WGRenderPassNode {
  constructor(bp, drawing = true) {
    this.mUid = WGRenderPassNode.sUid++;
    this.mDrawing = true;
    this.mPassBuilded = false;
    this.clearColor = new Color4_1.default(0.0, 0.0, 0.0, 1.0);
    this.name = "";
    this.pipelineCtxs = [];
    this.pctxMap = new Map();
    this.enabled = true;
    this.mode = 0;
    this.separate = false;
    this.mRBParam = bp;
    this.camera = bp.camera;
    this.mDrawing = drawing;
    this.rpass = new WGRendererPass_1.WGRendererPass(null, drawing);
    this.rpass.clearColor = this.clearColor;
  }

  setColorAttachmentClearEnabledAt(enabled, index = 0) {
    if (this.mPassBuilded) {
      const ca = this.rpass.passColors[index];

      if (ca) {
        ca.loadOp = enabled ? "clear" : "load";
      }
    }
  }

  isDrawing() {
    return this.mDrawing;
  }

  get uid() {
    return this.mUid;
  }

  getWGCtx() {
    return this.mWGCtx;
  }

  destroy() {
    if (this.rpass) {
      this.mRBParam = null;
      this.prevNode = null;
    }
  }

  getPassNodeWithMaterial(material) {
    const b = this.builder;

    if (b) {
      return b.getPassNodeWithMaterial(material);
    }

    return this;
  }

  initialize(wgCtx, param) {
    this.param = param ? param : this.param;
    if (!this.param) this.param = {};

    if (!this.mWGCtx && wgCtx && wgCtx.enabled) {
      this.mWGCtx = wgCtx;

      if (this.prevNode) {
        this.rpass.prevPass = this.prevNode.rpass;
      }

      this.rpass.initialize(wgCtx);
      this.checkRPassParam(this.param);
      this.rpass.build(this.param);
      this.mPassBuilded = true;
      this.colorAttachments = this.rpass.passColors;
    }
  }

  hasMaterial(material) {
    if (this.unitBlock) {
      return this.unitBlock.hasMaterial(material);
    }

    return false;
  }

  addEntity(entity) {
    if (entity) {
      if (!this.unitBlock) {
        this.unitBlock = WGRenderUnitBlock_1.WGRenderUnitBlock.createBlock();
      }

      const ub = this.unitBlock;
      ub.rbParam = this.mRBParam;
      ub.builder = this;
      console.log("WGRenderPassNode::addEntity(), ub.builder: ", ub.builder);
      this.unitBlock.addEntity(entity);
    }
  }

  checkRPassParam(param) {
    if (param.sampleCount !== undefined && param.sampleCount > 1) {
      param.multisampleEnabled = true;
    } else if (param.multisampleEnabled === true) {
      param.sampleCount = 4;
    } else {
      param.multisampleEnabled = false;
    }

    if (param.depthFormat == undefined) {
      param.depthFormat = "depth24plus";
    }
  }

  createRenderPipelineCtxWithMaterial(material) {
    const flag = material.shadinguuid && material.shadinguuid !== "";
    const map = this.pctxMap;

    if (flag) {
      if (map.has(material.shadinguuid)) {
        console.log("WGRenderPassBlock::createRenderPipelineCtxWithMaterial(), apply old ctx.");
        return map.get(material.shadinguuid);
      }
    }

    const ctx = this.createRenderPipelineCtx(material.shaderSrc, material.pipelineVtxParam, material.pipelineDefParam);

    if (flag) {
      ctx.shadinguuid = material.shadinguuid;
      map.set(material.shadinguuid, ctx);
    }

    console.log("WGRenderPassBlock::createRenderPipelineCtxWithMaterial(), apply new ctx.");
    return ctx;
  } // pipelineParam value likes {blendMode: "transparent", depthWriteEnabled: false, faceCullMode: "back"}


  createRenderPipelineCtx(shdSrc, pipelineVtxParam, pipelineParam) {
    const plp = pipelineParam;
    let depthStencilEnabled = plp ? plp.depthStencilEnabled === false ? false : true : true;
    const pipeParams = new WGRPipelineCtxParams_1.WGRPipelineCtxParams({
      shaderSrc: shdSrc.shaderSrc,
      vertShaderSrc: shdSrc.vertShaderSrc,
      fragShaderSrc: shdSrc.fragShaderSrc,
      compShaderSrc: shdSrc.compShaderSrc,
      depthStencilEnabled
    });

    if (plp) {
      if (plp.blendModes) {
        pipeParams.setBlendModes(plp.blendModes);
      }

      if (plp.depthStencil) {
        pipeParams.setDepthStencil(plp.depthStencil);
      } else {
        pipeParams.setDepthWriteEnabled(plp.depthWriteEnabled === true);
      }

      pipeParams.setPrimitiveState(plp.primitiveState ? plp.primitiveState : {
        cullMode: plp.faceCullMode
      });
    }

    return this.createRenderPipeline(pipeParams, pipelineVtxParam);
  }

  createRenderPipeline(pipelineParams, vtxDesc) {
    const pipelineCtx = new WGRPipelineContext_1.WGRPipelineContext(this.mWGCtx);
    this.pipelineCtxs.push(pipelineCtx);

    if (this.mDrawing) {
      if (this.rpass.depthTexture) {
        pipelineParams.setDepthStencilFormat(this.rpass.depthTexture.format);
      } else {
        pipelineParams.depthStencilEnabled = false;
        pipelineParams.depthStencil = undefined;
      }

      const passParam = this.rpass.getPassParams();

      if (passParam.multisampleEnabled) {
        if (pipelineParams.multisample) {
          pipelineParams.multisample.count = passParam.sampleCount;
        } else {
          pipelineParams.multisample = {
            count: passParam.sampleCount
          };
        }

        pipelineParams.sampleCount = passParam.sampleCount;
      }
    }

    pipelineCtx.createRenderPipelineWithBuf(pipelineParams, vtxDesc);
    pipelineCtx.rpass = this.rpass;
    return pipelineCtx;
  }

  runBegin() {
    this.colorAttachments = this.rpass.passColors;
    this.rpass.enabled = this.enabled;
    this.rcommands = [];
    this.rpass.runBegin();

    if (this.enabled) {
      for (let i = 0; i < this.pipelineCtxs.length;) {
        this.pipelineCtxs[i++].runBegin();
      }
    }
  }

  runEnd() {
    if (this.enabled) {
      for (let i = 0; i < this.pipelineCtxs.length;) {
        this.pipelineCtxs[i++].runEnd();
      }
    }

    let cmd = this.rpass.runEnd();

    if (cmd) {
      this.rcommands = [cmd];
    }
  }

  run() {
    if (this.enabled) {
      const b = this.unitBlock;

      if (b) {
        // console.log("node b: ", b);
        b.run();
      }
    }
  }

  render() {
    if (this.enabled) {
      this.runBegin();
      this.run();
      this.runEnd();
    }
  }

}

WGRenderPassNode.sUid = 0;
exports.WGRenderPassNode = WGRenderPassNode;

/***/ }),

/***/ "793b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const TransformParam_1 = __webpack_require__("e594");

exports.TransformParam = TransformParam_1.TransformParam;

function getUniformValueFromParam(key, param, defaultV) {
  const ufvs = param.uniformValues;

  if (param.uniformValues) {
    for (let i = 0; i < ufvs.length; ++i) {
      if (ufvs[i].shdVarName == key) {
        return ufvs[i];
      }
    }
  }

  return defaultV;
}

exports.getUniformValueFromParam = getUniformValueFromParam;

/***/ }),

/***/ "7a70":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2023 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const MathConst_1 = __importDefault(__webpack_require__("ec7b"));

const Vector3_1 = __importDefault(__webpack_require__("af80"));

const AbsGeomBase_1 = __importDefault(__webpack_require__("9e08"));

class Plane extends AbsGeomBase_1.default {
  constructor() {
    super(...arguments);
    this.nv = new Vector3_1.default(0.0, 1.0, 0.0);
    this.distance = 0.0;
    this.intersectBoo = false;
  }

  intersectStraightLinePos(straightL, outV) {
    // intersection or parallel
    let td = this.nv.dot(straightL.tv);

    if (td > MathConst_1.default.MATH_MIN_POSITIVE || td < MathConst_1.default.MATH_MAX_NEGATIVE) {
      // intersection
      let dis = this.nv.dot(straightL.position) - this.distance;
      outV.x = straightL.tv.x * 100000.0 + straightL.position.x;
      outV.y = straightL.tv.y * 100000.0 + straightL.position.y;
      outV.z = straightL.tv.z * 100000.0 + straightL.position.z; //

      td = this.nv.dot(outV) - this.distance;
      td = dis / (dis - td);
      outV.subtractBy(straightL.position);
      outV.scaleBy(td);
      outV.addBy(straightL.position);
      return 1;
    }

    td = this.nv.dot(straightL.position) - this.distance;

    if (td <= MathConst_1.default.MATH_MIN_POSITIVE || td >= MathConst_1.default.MATH_MAX_NEGATIVE) {
      // plane contains line
      outV.copyFrom(straightL.position);
      return 2;
    }

    return 0;
  }

  intersectStraightLinePos2(sl_pos, sl_tv, outV) {
    // intersection or parallel
    let td = this.nv.dot(sl_tv);

    if (td > MathConst_1.default.MATH_MIN_POSITIVE || td < MathConst_1.default.MATH_MAX_NEGATIVE) {
      // intersection
      let dis = this.nv.dot(sl_pos) - this.distance;
      outV.x = sl_tv.x * 100000.0 + sl_pos.x;
      outV.y = sl_tv.y * 100000.0 + sl_pos.y;
      outV.z = sl_tv.z * 100000.0 + sl_pos.z; //

      td = this.nv.dot(outV) - this.distance;
      td = dis / (dis - td);
      outV.subtractBy(sl_pos);
      outV.scaleBy(td);
      outV.addBy(sl_pos);
      return 1;
    }

    td = this.nv.dot(sl_pos) - this.distance;

    if (td <= MathConst_1.default.MATH_MIN_POSITIVE || td >= MathConst_1.default.MATH_MAX_NEGATIVE) {
      // plane contains line
      outV.copyFrom(sl_pos);
      return 2;
    }

    return 0;
  }

  intersectRadialLinePos(radL, outV) {
    let dis = this.nv.dot(radL.position) - this.distance;

    if (dis > MathConst_1.default.MATH_MIN_POSITIVE) {
      // radL position in plane positive space
      let td = this.nv.dot(radL.tv);

      if (td < 0.0) {
        // calc intersection position
        return this.intersectStraightLinePos2(radL.position, radL.tv, outV);
      }
    } else if (dis < MathConst_1.default.MATH_MAX_NEGATIVE) {
      // radL position in plane negative space
      let td2 = this.nv.dot(radL.tv);

      if (td2 > 0.0) {
        // calc intersection position
        return this.intersectStraightLinePos2(radL.position, radL.tv, outV);
      }
    } else {
      let td3 = this.nv.dot(radL.tv);

      if (td3 > MathConst_1.default.MATH_MIN_POSITIVE || td3 < MathConst_1.default.MATH_MAX_NEGATIVE) {
        outV.copyFrom(radL.position);
        return 1;
      }

      outV.copyFrom(radL.position);
      return 2;
    }

    return -1;
  }

  intersectRadialLinePos2(rl_pos, rl_tv, outV) {
    let dis = this.nv.dot(rl_pos) - this.distance;

    if (dis > MathConst_1.default.MATH_MIN_POSITIVE) {
      // radL position in plane positive space
      let td = this.nv.dot(rl_tv);

      if (td < 0.0) {
        // calc intersection position
        return this.intersectStraightLinePos2(rl_pos, rl_tv, outV);
      }
    } else if (dis < MathConst_1.default.MATH_MAX_NEGATIVE) {
      // radL position in plane negative space
      let td = this.nv.dot(rl_tv);

      if (td > 0.0) {
        // calc intersection position
        return this.intersectStraightLinePos2(rl_pos, rl_tv, outV);
      }
    } else {
      let td3 = this.nv.dot(rl_tv);

      if (td3 > MathConst_1.default.MATH_MIN_POSITIVE || td3 < MathConst_1.default.MATH_MAX_NEGATIVE) {
        outV.copyFrom(rl_pos);
        return 1;
      }

      outV.copyFrom(rl_pos);
      return 2;
    }

    return -1;
  }

  containsPoint(pos) {
    let f = this.nv.dot(pos) - this.distance;

    if (f > MathConst_1.default.MATH_MIN_POSITIVE) {
      return 1;
    } else if (f < MathConst_1.default.MATH_MAX_NEGATIVE) {
      return -1;
    }

    return 0;
  }

  intersectSphere(cv, radius) {
    this.intersectBoo = false;
    let f = this.nv.dot(cv) - this.distance;

    if (f > MathConst_1.default.MATH_MIN_POSITIVE) {
      this.intersectBoo = f <= radius;
      return 1;
    } else if (f < MathConst_1.default.MATH_MAX_NEGATIVE) {
      this.intersectBoo = -f <= radius;
      return -1;
    }

    return 0;
  }

  intersectAABB(minV, maxV) {
    this.intersectBoo = false;
    let pv = AbsGeomBase_1.default.__tV0;
    pv.setXYZ(maxV.x, minV.y, maxV.z);
    let flag = this.containsPoint(pv);
    pv.setXYZ(maxV.x, minV.y, minV.z);
    flag += this.containsPoint(pv);
    pv.setXYZ(minV.x, minV.y, minV.z);
    flag += this.containsPoint(pv);
    pv.setXYZ(minV.x, minV.y, maxV.z);
    flag += this.containsPoint(pv);
    pv.setXYZ(maxV.x, maxV.y, maxV.z);
    flag += this.containsPoint(pv);
    pv.setXYZ(maxV.x, maxV.y, minV.z);
    flag += this.containsPoint(pv);
    pv.setXYZ(minV.x, maxV.y, minV.z);
    flag += this.containsPoint(pv);
    pv.setXYZ(minV.x, maxV.y, maxV.z);
    flag += this.containsPoint(pv);
    this.intersectBoo = flag < 8;
    if (flag < -7) return -1;
    if (flag > 7) return 1;
    return 0;
  } // 判断一个球体是否和一个平面的负空间相交


  intersectSphNegSpace(cv, radius) {
    //this.intersectBoo = (this.nv.dot(cv) - this.distance - radius) < MathConst.MATH_MIN_POSITIVE;
    //this.intersectBoo = (this.nv.dot(cv) - this.distance) < radius;
    this.intersectBoo = Math.abs(this.nv.dot(cv) - this.distance) < radius;
  }

  update() {
    this.nv.normalize();
  }

  updateFast() {
    this.nv.normalize();
  }

  static PlaneIntersectSphere(pnv, pdis, cv, radius) {
    Plane.IntersectBoo = false;
    Plane.IntersectSatus = 0;
    pdis = pnv.dot(cv) - pdis;

    if (pdis > MathConst_1.default.MATH_MIN_POSITIVE) {
      Plane.IntersectBoo = pdis <= radius;
      Plane.IntersectSatus = 1;
    } else if (pdis < MathConst_1.default.MATH_MAX_NEGATIVE) {
      Plane.IntersectBoo = -pdis <= radius;
      Plane.IntersectSatus = -1;
    }
  }

  static CalcPVCloseV(plane, posV, outV) {
    let value = plane.distance - posV.dot(plane.nv);
    outV.setXYZ(value * plane.nv.x, value * plane.nv.y, value * plane.nv.z);
    outV.addBy(posV);
  }

  static CalcPVCloseV2(pnv, pd, posV, outV) {
    let value = pd - posV.dot(pnv);
    outV.setXYZ(value * pnv.x, value * pnv.y, value * pnv.z); //outV.scaleBy(value);

    outV.addBy(posV);
  }

  static IntersectionSLV2(planeNV, planeDis, sl_pos, sl_tv, outV) {
    // intersection or parallel
    let td = planeNV.dot(sl_tv);

    if (td > MathConst_1.default.MATH_MIN_POSITIVE || td < MathConst_1.default.MATH_MAX_NEGATIVE) {
      // intersection
      let dis = planeNV.dot(sl_pos) - planeDis;
      outV.x = sl_tv.x * 100000.0 + sl_pos.x;
      outV.y = sl_tv.y * 100000.0 + sl_pos.y;
      outV.z = sl_tv.z * 100000.0 + sl_pos.z; //

      td = planeNV.dot(outV) - planeDis;
      td = dis / (dis - td);
      outV.subtractBy(sl_pos);
      outV.scaleBy(td);
      outV.addBy(sl_pos);
      return 1;
    }

    td = planeNV.dot(sl_pos) - planeDis;

    if (td <= MathConst_1.default.MATH_MIN_POSITIVE || td >= MathConst_1.default.MATH_MAX_NEGATIVE) {
      // plane contains line
      outV.copyFrom(sl_pos);
      return 2;
    }

    return 0;
  }

  toString() {
    return "Plane(position=" + this.position.toString() + ", nv=" + this.nv.toString() + ")";
  }

}

Plane.IntersectBoo = false;
Plane.IntersectSatus = 0;
exports.default = Plane;

/***/ }),

/***/ "842f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGRUnitState_1 = __webpack_require__("222c");

class WGRUnitRunSt {}

const __$urst = new WGRUnitRunSt();

const __$reust = new WGRUnitState_1.WGRUnitState();

class WGRUnit {
  constructor() {
    this.rf = true;
    this.pst = __$reust;
    this.st = __$reust;
    this.__$rever = 0;
    this.enabled = true;
  }

  getRF() {
    // console.log("this.st.isDrawable(): ", this.st.isDrawable());
    return this.enabled && this.st.isDrawable();
  }

  runBegin() {
    const rc = this.rp.passEncoder;
    const mt = this.material;
    let rf = this.enabled && this.rp.enabled && this.st.isDrawable();
    rf = rf && mt.visible && mt.instanceCount > 0; // console.log("rnit::runBegin(), rf: ", rf);

    if (rf) {
      const gt = this.geometry;
      const pipeline = this.pipelinectx.pipeline;

      if (gt && pipeline) {
        // 这里面的诸多判断逻辑不应该出现，加入渲染器内部渲染流程之前必须处理好， 后续优化
        const st = __$urst;

        if (st.rc != rc) {
          st.pipeline = null;
          st.ibuf = null;
          st.gt = null;
          st.rc = rc;
          st.unfsuuid = "";
        }

        if (st.gt != gt) {
          st.gt = gt;
          gt.run(rc);
        }

        if (st.pipeline != pipeline) {
          st.pipeline = pipeline; // console.log("ruint setPipeline(), this.pipeline: ", this.pipeline);

          rc.setPipeline(pipeline);
        }

        gt.instanceCount = mt.instanceCount; // console.log("mt.instanceCount: ", mt.instanceCount);

        const ufs = this.uniforms;

        if (ufs) {
          for (let i = 0, ln = ufs.length; i < ln; i++) {
            const uf = ufs[i];

            if (uf.isEnabled()) {
              // console.log("ruint setBindGroup(), bindGroup: ", uf.bindGroup);
              // console.log("ruint setBindGroup(), bindGroup: ", uf.bindGroup, ", uf.getUid(): ", uf.getUid());
              // console.log("ruint setBindGroup(), uf.groupIndex: ", uf.groupIndex,",", uf.bindGroup);
              rc.setBindGroup(uf.groupIndex, uf.bindGroup);

              for (let j = 0, ln = uf.uvfs.length; j < ln; j++) {
                // console.log("ruint uf(",i,") setValue(), j: ", j);
                uf.setValue(uf.uvfs[j], j);
              }
            } else {
              rf = false;
            }
          }
        }
      } else {
        rf = false;
      }
    }

    this.rf = rf;
  }

  run() {
    // console.log("rnit::run(), rf: ", this.rf);
    if (this.rf) {
      const rc = this.rp.passEncoder;
      const gt = this.geometry;

      if (gt.ibuf) {
        const st = __$urst;

        if (st.ibuf != gt.ibuf) {
          st.ibuf = gt.ibuf;
          rc.setIndexBuffer(gt.ibuf, gt.ibuf.dataFormat);
        } // console.log("runit drawIndexed this.etuuid: ", this.etuuid,',', ', indexCount: ',gt.indexCount);
        // console.log("runit drawIndexed this.etuuid: ", this.etuuid,',', gt.indexCount,',', gt.instanceCount,',', this.material);
        // console.log("runit drawIndexed indexCount: ", gt.indexCount, ", gt.instanceCount: ", gt.instanceCount);


        rc.drawIndexed(gt.indexCount, gt.instanceCount);
      } else {
        // console.log("runit draw(), vertexCount: ", gt.vertexCount,", instanceCount: ", gt.instanceCount);
        rc.draw(gt.vertexCount, gt.instanceCount);
      }
    }
  }

  destroy() {
    if (this.pipelinectx) {
      const ufctx = this.pipelinectx.uniformCtx;
      ufctx.removeUniforms(this.uniforms);
      this.pipelinectx = null;
      this.material = null;
      this.rp = null;
      this.pst = null;
      this.st = null;
    }
  }

}

exports.WGRUnit = WGRUnit;

/***/ }),

/***/ "87f6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "8875":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
      return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ }),

/***/ "89ff":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const util_1 = __webpack_require__("660c");
/** Clamp a number to the provided range. */


function clamp(n, {
  min,
  max
}) {
  util_1.assert(max >= min);
  return Math.min(Math.max(n, min), max);
}

exports.clamp = clamp;

/***/ }),

/***/ "8a88":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const GPURenderPipelineEmpty_1 = __webpack_require__("c812");

const WGRPipelineContextImpl_1 = __webpack_require__("374c");

exports.BufDataParamType = WGRPipelineContextImpl_1.BufDataParamType;
exports.VtxPipelinDescParam = WGRPipelineContextImpl_1.VtxPipelinDescParam;

const WGRUniformContext_1 = __webpack_require__("b2fd");

exports.WGRUniformParam = WGRUniformContext_1.WGRUniformParam;
/**
 * one type shading shader, one WGRBindGroupContext instance
 */

class WGRBindGroupContext {
  constructor(wgCtx) {
    this.mUid = WGRBindGroupContext.sUid++;
    this.mBGLayouts = new Array(8);
    this.pipeline = new GPURenderPipelineEmpty_1.GPURenderPipelineEmpty();
    this.type = "render"; // console.log("XXX XXX create a WGRBindGroupContext instance.");

    if (wgCtx) {
      this.initialize(wgCtx);
    }
  }

  getUid() {
    return this.mUid;
  }

  destroy() {
    if (this.mWGCtx) {
      this.mWGCtx = null;
    }
  }

  initialize(wgCtx) {
    if (wgCtx && !this.mWGCtx) {
      this.mWGCtx = wgCtx;
      this.queue = wgCtx.queue;
    }
  }

  getWGCtx() {
    return this.mWGCtx;
  }

  createUniformBufferWithParam(bufSize, usage, mappedAtCreation = false) {
    const desc = {
      size: bufSize,
      usage: usage,
      mappedAtCreation
    };
    const buf = this.mWGCtx.device.createBuffer(desc);
    return buf;
  }
  /**
   * @param params UniformBufferParam instance.
   * @param initSize The defaut value is 0.
   * @param force256 The defaut value is true.
   * @param mappedAtCreation The defaut value is false.
   */


  createUniformsBuffer(params, initSize = 0, force256 = true, mappedAtCreation = false) {
    if (params && params.sizes.length > 0) {
      let total = params.sizes.length;
      let size = initSize;
      let bufSize = size;
      let segs = new Array(total);

      if (force256) {
        for (let i = 0; i < total; ++i) {
          size = size <= 256 ? size : size % 256;
          size = size > 0 ? 256 - size : 0;
          bufSize += size;
          size = params.sizes[i];
          segs[i] = {
            index: bufSize,
            size: size
          };
          bufSize += size;
        }
      } else {
        for (let i = 0; i < total; ++i) {
          size = params.sizes[i];
          segs[i] = {
            index: bufSize,
            size: size
          };
          bufSize += size;
        }
      }

      const desc = {
        size: bufSize,
        usage: params.usage,
        arrayStride: params.arrayStride
      }; // const buf = this.mWGCtx.device.createBuffer(desc);

      const buf = this.mWGCtx.buffer.createBuffer(desc);
      buf.segs = segs;
      buf.arrayStride = params.arrayStride; // console.log("createUniformsBuffer(), segs: ", segs);
      // console.log("createUniformsBuffer(), bufSize: ", bufSize, ", usage: ", params.usage);

      return buf;
    }

    return null;
  } // updateUniformBufferAt(buffer: GPUBuffer, td: NumberArrayDataType, index: number, offset = 0): void {
  // 	// console.log("updateUniformBufferAt() index: ", index,",segs: ", buffer.segs);
  // 	// console.log("updateUniformBufferAt() buffer.size: ", buffer.size);
  // 	// console.log("updateUniformBufferAt() buffer.segs[index].index + offset: ", buffer.segs[index].index + offset);
  // 	// console.log("updateUniformBufferAt() td: ", td);
  // 	this.queue.writeBuffer(buffer, buffer.segs[index].index + offset, td.buffer, td.byteOffset, td.byteLength);
  // }


  createBindGroupLayout(descriptor) {
    const device = this.mWGCtx.device;
    return device.createBindGroupLayout(descriptor);
  }

  bindGroupDescUpdate(desc, dataParams, texParams, index = 0, uniformAppend) {
    let ei = 0;
    let es = desc.entries;
    let flag = uniformAppend === false ? true : false;

    if (dataParams) {
      const dps = dataParams;

      for (let i = 0; i < dps.length; ++i) {
        const dp = dps[i];

        if (dp.buffer && dp.bufferSize > 0) {
          const res = es[i].resource;

          if (res.offset !== undefined) {
            // the minimum BufferBindingType::ReadOnlyStorage alignment (256)
            res.offset = res.shared || flag ? 0 : index * 256;
            res.buffer = dp.buffer;
            res.size = dp.bufferSize;
          }

          ei++;
        } else {
          throw Error("Illegal operaiton !!!");
        }
      }
    }

    if (texParams && texParams.length > 0) {
      for (let i = 0; i < texParams.length; ++i) {
        const t = texParams[i];

        if (t.texView) {
          let et = es[ei++];

          if (t.sampler && et.resource !== t.sampler) {
            et.resource = t.sampler;
          }

          et = es[ei++];

          if (et.resource !== t.texView) {
            et.resource = t.texView;
          }
        }
      }
    }
  }

  createBindGroupDesc(groupIndex, dataParams, texParams, bindIndex = 0, layout) {
    const device = this.mWGCtx.device;

    if (!layout && !this.mBGLayouts[groupIndex]) {
      if (this.pipeline) {
        this.mBGLayouts[groupIndex] = this.pipeline.getBindGroupLayout(groupIndex);
      } else {
        this.mBGLayouts[groupIndex] = this.comppipeline.getBindGroupLayout(groupIndex);
      }
    }

    let desc = {
      layout: layout ? layout : this.mBGLayouts[groupIndex],
      entries: []
    };
    let bindI = 0;

    if (dataParams) {
      const dps = dataParams;

      for (let i = 0; i < dps.length; ++i) {
        const dp = dps[i];

        if (dp.buffer && dp.bufferSize > 0) {
          const offset = dp.shared ? 0 : 256 * dp.index; // console.log("ooooooooo bindI: ", bindI, ", i: ", i);
          // console.log("		offset: ", offset);
          // console.log("		dp.shared: ", dp.shared, ", bufferSize: ",dp.bufferSize);
          // console.log("		", dp.buffer);

          const ed = {
            binding: bindIndex + bindI++,
            resource: {
              offset,
              buffer: dp.buffer,
              size: dp.bufferSize,
              shared: dp.shared
            }
          };
          desc.entries.push(ed);
        }
      }
    } // console.log("createUniformBindGroup(), texParams: ", texParams);


    if (texParams && texParams.length > 0) {
      const sampler = device.createSampler({
        magFilter: "linear",
        minFilter: "linear",
        mipmapFilter: "linear"
      }); // const sampler = device.createSampler({
      // 	magFilter: 'nearest',
      // 	minFilter: 'nearest',
      // 	mipmapFilter: 'nearest'
      // });

      for (let i = 0; i < texParams.length; ++i) {
        const t = texParams[i];

        if (t.texView) {
          const es = {
            binding: bindIndex + bindI++,
            resource: t.sampler ? t.sampler : sampler
          };
          const et = {
            binding: bindIndex + bindI++,
            resource: t.texView
          };
          console.log('es, et: ', es, et);
          desc.entries.push(es, et);
        }
      }
    } // console.log("createUniformBindGroup(), desc: ", desc);


    if (desc.entries.length < 1) {
      throw Error("Illegal operation !!!");
    }

    return desc;
  }

  createBindGroupObj(desc) {
    const device = this.mWGCtx.device;

    if (desc.entries.length < 1) {
      throw Error("Illegal operation !!!");
    } // console.log("createBindGroupObj(), desc: ", desc);


    const p = device.createBindGroup(desc);
    p.uid = WGRBindGroupContext.sBindGroupUid++;
    return p;
  }

  createBindGroupWithDesc(desc) {
    return this.createBindGroupObj(desc);
  }

  createBindGroup(groupIndex, dataParams, texParams, bindIndex = 0, layout) {
    const desc = this.createBindGroupDesc(groupIndex, dataParams, texParams, bindIndex, layout);
    return this.createBindGroupObj(desc);
  }

}

WGRBindGroupContext.sUid = 0;
WGRBindGroupContext.sBindGroupUid = 0;
exports.WGRBindGroupContext = WGRBindGroupContext;

/***/ }),

/***/ "8e9d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const Color4_1 = __importDefault(__webpack_require__("2c77"));

const CommonUtils_1 = __webpack_require__("fe0b");

class WGRPColorAttachment {
  constructor() {
    this.clearValue = new Color4_1.default();
    /**
     * Possible values are: "clear", "load"
     */

    this.loadOp = "clear";
    /**
     * Possible values are: "discard", "store"
     */

    this.storeOp = "store";
    this.textureFormat = 'bgra8unorm';
  } // gpuTexture: GPUTexture;


  set clearEnabled(enabled) {
    this.loadOp = enabled ? "clear" : "load"; // console.log("xxx this.loadOp: ", this.loadOp, ', uid: ',this.mUid);
  }

  get clearEnabled() {
    return this.loadOp === "clear";
  }

  setParam(param) {
    if (param) {
      this.param = param;
      let c = this.clearValue;
      CommonUtils_1.copyFromObjectValueWithKey(param, this);
      c.setColor(this.clearValue);
      this.clearValue = c;
      this.texture = param.texture;
      console.log("xxx setParam(), this.loadOp: ", this.loadOp, ', clearValue: ', this.clearValue);
    }

    return this;
  }

  linkToPrev(prev, multisampleEnabled) {
    if (multisampleEnabled) {
      this.view = prev.view;
      this.resolveTarget = prev.resolveTarget;
    } else {
      this.view = prev.view;
    }
  }

}

exports.WGRPColorAttachment = WGRPColorAttachment;

/***/ }),

/***/ "9069":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGRPipelineContextImpl_1 = __webpack_require__("374c");

exports.BufDataParamType = WGRPipelineContextImpl_1.BufDataParamType;

class WGRUniformWrapper {
  constructor() {
    this.usage = 0;
    this.groupIndex = 0;
    this.enabled = true;
    this.uniformAppend = true;
  }

}

exports.WGRUniformWrapper = WGRUniformWrapper;

class WGRUniformBufObj {
  constructor() {
    this.uniformAppend = true;
  }

  destroy() {
    if (this.oldBufs) {
      for (let i = 0; i < this.oldBufs.length; ++i) {
        this.oldBufs[i].destroy();
        this.oldBufs[i] = null;
      }
    }

    this.oldBufs = null;
    this.buffers = null;
  }

}

exports.WGRUniformBufObj = WGRUniformBufObj;

/***/ }),

/***/ "943f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGTextureWrapper_1 = __webpack_require__("58c4");

exports.WGTextureDataDescriptor = WGTextureWrapper_1.WGTextureDataDescriptor;

const WGRPipelineCtxParams_1 = __webpack_require__("bf93");

exports.WGRShderSrcType = WGRPipelineCtxParams_1.WGRShderSrcType;

const IWGMaterial_1 = __webpack_require__("3850");

exports.checkMaterialRPasses = IWGMaterial_1.checkMaterialRPasses;

class WGMaterial {
  constructor(descriptor) {
    this.mUid = WGMaterial.sUid++;
    this.mREnabled = false;
    /**
     * unique shading process uuid
     */

    this.shadinguuid = "default-material";
    this.rpass = {
      rpass: {
        index: 0
      }
    };
    this.instanceCount = 1;
    this.visible = true;
    this.setDescriptor(descriptor);
  }

  get uid() {
    return this.mUid;
  }

  addTextureWithDatas(datas, shdVarNames) {
    if (datas) {
      if (shdVarNames) {
        for (let i = 0; i < datas.length; ++i) {
          this.addTextureWithData(datas[i], shdVarNames[i]);
        }
      } else {
        for (let i = 0; i < datas.length; ++i) {
          this.addTextureWithData(datas[i]);
        }
      }
    }

    return this;
  }

  addTextureWithData(data, shdVarName = "") {
    if (shdVarName === "") {
      shdVarName = "texture" + (this.textures ? this.textures.length : 0);
    }

    this.addTextureWithParam({
      texture: {
        data: data,
        shdVarName
      }
    });
  }

  addTextureWithParam(param) {
    if (this.textures) {
      this.textures.push(new WGTextureWrapper_1.WGTextureWrapper(param));
    } else {
      this.textures = [new WGTextureWrapper_1.WGTextureWrapper(param)];
    }
  }

  addTextureWithParams(params) {
    for (let i = 0; i < params.length; ++i) {
      this.addTextureWithParam(params[i]);
    }
  }

  addTexture(descriptor) {
    const td = WGTextureWrapper_1.createDataWithDescriptor(descriptor);
    this.addTextureWithData(td, descriptor.shdVarName);
    return this;
  }

  addTextures(descriptors) {
    if (descriptors) {
      for (let i = 0; i < descriptors.length; ++i) {
        this.addTexture(descriptors[i]);
      }
    }

    return this;
  }

  isREnabled() {
    if (this.mREnabled) {
      return this.mREnabled;
    }

    const texs = this.textures;

    if (texs) {
      for (let i = 0; i < texs.length; ++i) {
        const tex = texs[i];

        if (!tex.texture || !tex.texture.texture) {
          return false;
        }
      }
    }

    this.mREnabled = true;
    return this.mREnabled;
  }

  getRCtx() {
    return this.mRCtx;
  }

  setDescriptor(descriptor) {
    const d = descriptor;

    if (d) {
      if (d.shadinguuid) this.shadinguuid = d.shadinguuid;
      if (d.shaderSrc) this.shaderSrc = d.shaderSrc;
      if (d.pipelineVtxParam) this.pipelineVtxParam = d.pipelineVtxParam;
      if (d.pipelineDefParam) this.pipelineDefParam = d.pipelineDefParam;
      if (d.rpass) this.rpass = d.rpass;
      if (d.uniformAppend !== undefined) this.uniformAppend = d.uniformAppend;
      if (d.uniformValues) this.uniformValues = d.uniformValues;
      if (d.instanceCount !== undefined) this.instanceCount = d.instanceCount;
    }
  }

  initialize(pipelineCtx) {
    if (!this.mRCtx) {
      if (!pipelineCtx) {
        throw Error("pipelineCtx is undefined.");
      }

      this.mRCtx = pipelineCtx;
    }
  }

  copyfrom(src) {
    return this;
  }

  destroy() {
    if (this.mRCtx) {
      this.mRCtx = null;
    }
  }

}

WGMaterial.sUid = 0;
exports.WGMaterial = WGMaterial;

/***/ }),

/***/ "9711":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2023 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

class RSEntityFlag {
  static AddContainerFlag(flag) {
    //return flag | RSEntityFlag.CONTAINER_FLAG;
    return flag | 0x80000000;
  }

  static RemoveContainerFlag(flag) {
    //return flag & RSEntityFlag.CONTAINER_NOT_FLAG;
    return flag & -0x80000001;
  }

  static AddSpaceUid(flag, rawUid) {
    return flag & -0x100000 | rawUid;
  }

  static RemoveSpaceUid(flag) {
    //return flag & RSEntityFlag.SPACE_NOT_FLAG;
    return flag & -0x100000;
  }

  static GetSpaceUid(flag) {
    //return flag & RSEntityFlag.SPACE_FLAG;
    return flag & 0xFFFFF;
  }

  static AddRendererUid(flag, rawUid) {
    return flag & -0x7f00001 | rawUid << 20;
  }

  static RemoveRendererUid(flag) {
    //return flag | RSEntityFlag.RENDERER_UID_FLAG;
    return flag | 0x7F00000;
  }

  static GetRendererUid(flag) {
    //return (flag & RSEntityFlag.RENDERER_UID_FLAG)>>20;
    flag = (flag & 0x7F00000) >> 20;
    return flag < 127 ? flag : -1;
  }

  static TestRendererUid(flag) {
    //return (flag & RSEntityFlag.RENDERER_UID_FLAG)>>20;
    flag = (flag & 0x7F00000) >> 20;
    return flag < 127;
  }

  static AddSortEnabled(flag) {
    //return flag | RSEntityFlag.SORT_FLAG;
    return flag | 0x40000000;
  }

  static RemoveSortEnabled(flag) {
    //return flag & RSEntityFlag.SORT_NOT_FLAG;
    return flag & -0x40000001;
  }

  static TestSortEnabled(flag) {
    //return (flag & RSEntityFlag.SORT_FLAG) == RSEntityFlag.SORT_FLAG;
    return (flag & 0x40000000) == 0x40000000;
  }

  static AddRendererLoad(flag) {
    //return flag | RSEntityFlag.RENDERER_LOAD_FLAG;
    return flag | 0x30000000;
  }

  static RemoveRendererLoad(flag) {
    //return flag & RSEntityFlag.RENDERER_LOAD_NOT_FLAG;
    return flag & -0x30000001;
  }

  static TestSpaceContains(flag) {
    return (0xFFFFF & flag) > 0;
  }

  static TestSpaceEnabled(flag) {
    return (0xFFFFF & flag) < 1;
  }

  static TestSpaceEnabled2(flag) {
    // console.log("   TestSpaceEnabled2(), 0xFFFFF & flag: ", (0xFFFFF & flag));
    // console.log("                       (0x80000000 & flag) != 0x80000000: ", ((0x80000000 & flag) != 0x80000000));
    return (0xFFFFF & flag) < 1 && (0x80000000 & flag) != 0x80000000;
  }

  static TestContainerEnabled(flag) {
    //return (RSEntityFlag.RENDERER_UID_FLAG & flag) == RSEntityFlag.RENDERER_UID_FLAG && (RSEntityFlag.CONTAINER_FLAG & flag) != RSEntityFlag.CONTAINER_FLAG;
    return (0x7F00000 & flag) == 0x7F00000 && (0x80000000 & flag) != 0x80000000;
  }

  static TestRendererEnabled(flag) {
    //return (RSEntityFlag.RENDERER_ADN_LOAD_FLAG & flag) == RSEntityFlag.RENDERER_UID_FLAG && (RSEntityFlag.CONTAINER_FLAG & flag) != RSEntityFlag.CONTAINER_FLAG;
    return (0x37F00000 & flag) == 0x7F00000 && (0x80000000 & flag) != 0x80000000;
  }

}

RSEntityFlag.DEFAULT = 0x7f00000; // 第27位存放是否在container里面
// 在 container 内

RSEntityFlag.CONTAINER_FLAG = 0x80000000; // (1<<27)
// 没在 container 内

RSEntityFlag.CONTAINER_NOT_FLAG = -0x80000001; //~(0x80000000), ~(1<<27)
// 第0位到第19位总共20位存放自身在space中的 index id(1 到 1048575(0xFFFFF), 但是不会包含0xFFFFF)

RSEntityFlag.SPACE_FLAG = 0xFFFFF;
RSEntityFlag.SPACE_NOT_FLAG = -0x100000; // ~0xFFFFF;
// 第20位开始到26位为总共7位止存放在renderer中的状态数据(renderer unique id and others),
// 最多可以支持同时构建64个renderer instance

RSEntityFlag.RENDERER_UID_FLAG = 0x7F00000; // (1<<20 | 1<<21 | 1<<22 | 1<<23 | 1<<24 | 1<<25 | 1<<26);

RSEntityFlag.RENDERER_UID_NOT_FLAG = -0x7f00001; // ~0x7F00000;

RSEntityFlag.RENDERER_UID_INVALID = 127; // ~0x7F00000;
//0x40000000
// 第30位存放 是否渲染运行时排序(rendering sort enabled) 的相关信息

RSEntityFlag.SORT_FLAG = 0x40000000; // (1<<30);

RSEntityFlag.SORT_NOT_FLAG = -0x40000001; // ~0x40000000;
// 第28位开始到29位总共2位存放renderer 载入状态 的相关信息

RSEntityFlag.RENDERER_LOAD_FLAG = 0x30000000; // (1<<28 | 1<<29);

RSEntityFlag.RENDERER_LOAD_NOT_FLAG = -0x30000001; // ~0x30000000;

RSEntityFlag.RENDERER_ADN_LOAD_FLAG = 0x37F00000; // 0x7f00000 | 0x30000000;

exports.default = RSEntityFlag;

/***/ }),

/***/ "9e08":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2023 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const Vector3_1 = __importDefault(__webpack_require__("af80"));

class AbsGeomBase {
  constructor() {
    // unique id
    this.id = -1;
    this.position = new Vector3_1.default();
  }

  update() {}

  updateFast() {}

}

AbsGeomBase.__tV0 = new Vector3_1.default();
AbsGeomBase.__tV1 = new Vector3_1.default();
AbsGeomBase.__tV2 = new Vector3_1.default();
exports.AbsGeomBase = AbsGeomBase;
exports.default = AbsGeomBase;

/***/ }),

/***/ "af1b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // for some defined objs

Object.defineProperty(exports, "__esModule", {
  value: true
});
var WGRDrawMode;

(function (WGRDrawMode) {
  WGRDrawMode[WGRDrawMode["DISABLE"] = 0] = "DISABLE";
  WGRDrawMode[WGRDrawMode["TRIANGLES"] = 1] = "TRIANGLES";
  WGRDrawMode[WGRDrawMode["LINE_STRIP"] = 2] = "LINE_STRIP";
  WGRDrawMode[WGRDrawMode["POINTS"] = 3] = "POINTS";
  WGRDrawMode[WGRDrawMode["LINES"] = 4] = "LINES";
})(WGRDrawMode || (WGRDrawMode = {}));

exports.WGRDrawMode = WGRDrawMode;
var WGRNormalType;

(function (WGRNormalType) {
  WGRNormalType[WGRNormalType["FLAT"] = 0] = "FLAT";
  WGRNormalType[WGRNormalType["GOURAND"] = 1] = "GOURAND";
})(WGRNormalType || (WGRNormalType = {}));

exports.WGRNormalType = WGRNormalType;

/***/ }),

/***/ "af80":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const v_m_180pk = 180.0 / Math.PI;
const v_m_minp = 1e-7;

class Vector3 {
  constructor(px = 0.0, py = 0.0, pz = 0.0, pw = 1.0) {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    this.w = 0.0;
    this.x = px;
    this.y = py;
    this.z = pz;
    this.w = pw;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z, this.w);
  }

  toZero() {
    return this.setXYZW(0, 0, 0, 0);
  }

  toOne() {
    return this.setXYZW(1, 1, 1, 1);
  }

  setVector3(vector3) {
    let v = vector3;

    if (v) {
      const t = this;
      const vs = v;

      if (vs.length !== undefined) {
        const len = vs.length;
        if (len > 0) t.x = vs[0];
        if (len > 1) t.y = vs[1];
        if (len > 2) t.z = vs[2];
        if (len > 3) t.w = vs[3];
      } else {
        const tv = v;
        if (tv.x !== undefined) t.x = tv.x;
        if (tv.y !== undefined) t.y = tv.y;
        if (tv.z !== undefined) t.z = tv.z;
        if (tv.w !== undefined) t.w = tv.w;
      }
    }

    return this;
  }

  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);
    return this;
  }

  setXYZW(px, py, pz, pw) {
    this.x = px;
    this.y = py;
    this.z = pz;
    this.w = pw;
    return this;
  }

  setXYZ(px, py, pz) {
    this.x = px;
    this.y = py;
    this.z = pz;
    return this;
  }
  /**
   * example: [0],[1],[2],[3] => x,y,z,w
   */


  fromArray3(arr, offset = 0) {
    this.x = arr[offset];
    this.y = arr[offset + 1];
    this.z = arr[offset + 2];
    return this;
  }
  /**
   * example: x,y,z => [0],[1],[2]
   */


  toArray3(arr, offset = 0) {
    arr[offset] = this.x;
    arr[offset + 1] = this.y;
    arr[offset + 2] = this.z;
    return this;
  }

  fromArray4(arr, offset = 0) {
    this.x = arr[offset];
    this.y = arr[offset + 1];
    this.z = arr[offset + 2];
    this.w = arr[offset + 3];
    return this;
  }

  toArray4(arr, offset = 0) {
    arr[offset] = this.x;
    arr[offset + 1] = this.y;
    arr[offset + 2] = this.z;
    arr[offset + 3] = this.w;
    return this;
  }

  copyFrom(v3) {
    this.x = v3.x;
    this.y = v3.y;
    this.z = v3.z;
    return this;
  }

  dot(a) {
    return this.x * a.x + this.y * a.y + this.z * a.z;
  }

  multBy(a) {
    this.x *= a.x;
    this.y *= a.y;
    this.z *= a.z;
    return this;
  }

  normalize() {
    let d = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

    if (d > v_m_minp) {
      this.x /= d;
      this.y /= d;
      this.z /= d;
    }

    return this;
  }

  normalizeTo(a) {
    let d = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

    if (d > v_m_minp) {
      a.x = this.x / d;
      a.y = this.y / d;
      a.z = this.z / d;
    } else {
      a.x = this.x;
      a.y = this.y;
      a.z = this.z;
    }
  }

  scaleVector(s) {
    this.x *= s.x;
    this.y *= s.y;
    this.z *= s.z;
    return this;
  }

  scaleBy(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  equalsXYZ(a) {
    return Math.abs(this.x - a.x) < v_m_minp && Math.abs(this.y - a.y) < v_m_minp && Math.abs(this.z - a.z) < v_m_minp;
  }

  equalsAll(a) {
    return Math.abs(this.x - a.x) < v_m_minp && Math.abs(this.y - a.y) < v_m_minp && Math.abs(this.z - a.z) < v_m_minp && Math.abs(this.w - a.w) < v_m_minp;
  }

  project() {
    let t = 1.0 / this.w;
    this.x *= t;
    this.y *= t;
    this.z *= t;
  }

  getLength() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  getLengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  addBy(a) {
    this.x += a.x;
    this.y += a.y;
    this.z += a.z;
    return this;
  }

  subtractBy(a) {
    this.x -= a.x;
    this.y -= a.y;
    this.z -= a.z;
    return this;
  }

  subtract(a) {
    return new Vector3(this.x - a.x, this.y - a.y, this.z - a.z);
  }

  add(a) {
    return new Vector3(this.x + a.x, this.y + a.y, this.z + a.z);
  }

  crossProduct(a) {
    return new Vector3(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x);
  }

  crossBy(a) {
    let px = this.y * a.z - this.z * a.y;
    let py = this.z * a.x - this.x * a.z;
    let pz = this.x * a.y - this.y * a.x;
    this.x = px;
    this.y = py;
    this.z = pz;
    return this;
  }

  reflectBy(nv) {
    let idotn2 = (this.x * nv.x + this.y * nv.y + this.z * nv.z) * 2.0;
    this.x = this.x - idotn2 * nv.x;
    this.y = this.y - idotn2 * nv.y;
    this.z = this.z - idotn2 * nv.z;
    return this;
  }

  scaleVecTo(va, scale) {
    this.x = va.x * scale;
    this.y = va.y * scale;
    this.z = va.z * scale;
    return this;
  }

  subVecsTo(va, vb) {
    this.x = va.x - vb.x;
    this.y = va.y - vb.y;
    this.z = va.z - vb.z;
    return this;
  }

  addVecsTo(va, vb) {
    this.x = va.x + vb.x;
    this.y = va.y + vb.y;
    this.z = va.z + vb.z;
    return this;
  }

  crossVecsTo(va, vb) {
    this.x = va.y * vb.z - va.z * vb.y;
    this.y = va.z * vb.x - va.x * vb.z;
    this.z = va.x * vb.y - va.y * vb.x;
    return this;
  }

  toString() {
    return "Vector3(" + this.x + "" + this.y + "" + this.z + ")";
  }
  /**
   * 右手法则(为正)
   */


  static Cross(a, b, result) {
    result.x = a.y * b.z - a.z * b.y;
    result.y = a.z * b.x - a.x * b.z;
    result.z = a.x * b.y - a.y * b.x;
  } // (va1 - va0) 叉乘 (vb1 - vb0), 右手法则(为正)


  static CrossSubtract(va0, va1, vb0, vb1, result) {
    v_m_v0.x = va1.x - va0.x;
    v_m_v0.y = va1.y - va0.y;
    v_m_v0.z = va1.z - va0.z;
    v_m_v1.x = vb1.x - vb0.x;
    v_m_v1.y = vb1.y - vb0.y;
    v_m_v1.z = vb1.z - vb0.z;
    va0 = v_m_v0;
    vb0 = v_m_v1;
    result.x = va0.y * vb0.z - va0.z * vb0.y;
    result.y = va0.z * vb0.x - va0.x * vb0.z;
    result.z = va0.x * vb0.y - va0.y * vb0.x;
  }

  static Subtract(a, b, result) {
    result.x = a.x - b.x;
    result.y = a.y - b.y;
    result.z = a.z - b.z;
  }

  static DistanceSquared(a, b) {
    v_m_v0.x = a.x - b.x;
    v_m_v0.y = a.y - b.y;
    v_m_v0.z = a.z - b.z;
    return v_m_v0.getLengthSquared();
  }

  static DistanceXYZ(x0, y0, z0, x1, y1, z1) {
    v_m_v0.x = x0 - x1;
    v_m_v0.y = y0 - y1;
    v_m_v0.z = z0 - z1;
    return v_m_v0.getLength();
  }

  static Distance(v0, v1) {
    v_m_v0.x = v0.x - v1.x;
    v_m_v0.y = v0.y - v1.y;
    v_m_v0.z = v0.z - v1.z;
    return v_m_v0.getLength();
  }
  /**
   * get angle degree between two Vector3 objects
   * @param v0 src Vector3 object
   * @param v1 dst Vector3 object
   * @returns angle degree
   */


  static AngleBetween(v0, v1) {
    v0.normalizeTo(v_m_v0);
    v1.normalizeTo(v_m_v1);
    return Math.acos(v_m_v0.dot(v_m_v1)) * v_m_180pk;
  }
  /**
   * get angle radian between two Vector3 objects
   * @param v0 src Vector3 object
   * @param v1 dst Vector3 object
   * @returns angle radian
   */


  static RadianBetween(v0, v1) {
    v0.normalizeTo(v_m_v0);
    v1.normalizeTo(v_m_v1);
    return Math.acos(v_m_v0.dot(v_m_v1));
  }

  static RadianBetween2(v0, v1) {
    //  // c^2 = a^2 + b^2 - 2*a*b * cos(x)
    //  // cos(x) = (a^2 + b^2 - c^2) / 2*a*b
    let pa = v0.getLengthSquared();
    let pb = v1.getLengthSquared();
    v_m_v0.subVecsTo(v0, v1);
    return Math.acos((pa + pb - v_m_v0.getLengthSquared()) / (2.0 * Math.sqrt(pa) * Math.sqrt(pb)));
  }

  static Reflect(iv, nv, rv) {
    let idotn2 = (iv.x * nv.x + iv.y * nv.y + iv.z * nv.z) * 2.0;
    rv.x = iv.x - idotn2 * nv.x;
    rv.y = iv.y - idotn2 * nv.y;
    rv.z = iv.z - idotn2 * nv.z;
  }
  /**
   * 逆时针转到垂直
   */


  static VerticalCCWOnXOY(v) {
    const x = v.x;
    v.x = -v.y;
    v.y = x;
  }
  /**
   * 顺时针转到垂直
   */


  static VerticalCWOnXOY(v) {
    const y = v.y;
    v.y = -v.x;
    v.x = y;
  }

}

Vector3.X_AXIS = new Vector3(1, 0, 0);
Vector3.Y_AXIS = new Vector3(0, 1, 0);
Vector3.Z_AXIS = new Vector3(0, 0, 1);
Vector3.ZERO = new Vector3(0, 0, 0);
Vector3.ONE = new Vector3(1, 1, 1);
exports.default = Vector3;
const v_m_v0 = new Vector3();
const v_m_v1 = new Vector3();

/***/ }),

/***/ "b2fd":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGRPipelineContextImpl_1 = __webpack_require__("374c");

exports.BufDataParamType = WGRPipelineContextImpl_1.BufDataParamType;

const IWGRUniformContext_1 = __webpack_require__("9069");

exports.WGRUniformParam = IWGRUniformContext_1.WGRUniformParam;

const WGRUniformCtxInstance_1 = __webpack_require__("3590");

const WGRBufferValue_1 = __webpack_require__("2d6d");

const WGRBufferView_1 = __webpack_require__("dfa8");

class WGRUniformContext {
  constructor(layoutAuto) {
    this.mMap = new Map();
    this.mInsList = [];
    this.mLayoutAuto = true;
    this.mLayoutAuto = layoutAuto;
    console.log("WGRUniformContext::constructor() ...");
  }

  isLayoutAuto() {
    return this.mLayoutAuto;
  }

  getWGCtx() {
    return this.mBindGCtx.getWGCtx();
  }

  getUCtx(layoutName, creation = true) {
    let uctx = null;
    const m = this.mMap;

    if (m.has(layoutName)) {
      uctx = m.get(layoutName);
    } else {
      if (creation) {
        uctx = new WGRUniformCtxInstance_1.WGRUniformCtxInstance();
        uctx.layoutAuto = this.mLayoutAuto;
        uctx.shdUniform = WGRUniformContext.shdUniform;
        uctx.initialize(this.mBindGCtx);
        m.set(layoutName, uctx);
        this.mUCtxIns = uctx;
      }
    }

    return uctx;
  }

  initialize(bindGCtx) {
    if (!this.mBindGCtx && bindGCtx) {
      this.mBindGCtx = bindGCtx;
    }
  }

  getBindGroupLayout(multisampled) {
    if (this.mUCtxIns) {
      return this.mUCtxIns.getBindGroupLayout(multisampled);
    }

    return null;
  }

  runBegin() {
    const ls = this.mInsList; // console.log("WGRUniformContext::runBegin(), ls.length: ", ls.length);

    for (let i = 0; i < ls.length;) {
      ls[i].runBegin();

      if (ls[i].isEnabled()) {
        ls[i].ready = false;
        ls.splice(i, 1);
        console.log("finish and remove a old ready uniform ctx ins.");
      } else {
        i++;
      }
    }
  }

  runEnd() {}

  createUniformsWithValues(params, uniformAppend) {
    // console.log("WGRUniformContext::createUniformsWithValues(), params: ", params);
    let uniforms = [];

    for (let i = 0; i < params.length; ++i) {
      const p = params[i];
      uniforms.push(this.createUniformWithValues(p.layoutName, p.groupIndex, p.values, p.texParams, uniformAppend));
    }

    return uniforms;
  }

  createUniformWithValues(layoutName, groupIndex, values, texParams, uniformAppend) {
    if (this.mBindGCtx) {
      const uctx = this.getUCtx(layoutName);

      if (!uctx.ready) {
        this.mInsList.push(uctx);
        uctx.ready = true;
        console.log("add a new ready uniform ctx ins.");
      }

      const bufDataParams = [];

      for (let i = 0; i < values.length; ++i) {
        // console.log(values[i], ", A0-KKK v instanceof WGRBufferValue: ", values[i] instanceof WGRBufferValue);
        let v = values[i];
        v = WGRBufferValue_1.checkBufferData(v);

        if (v.uid == undefined || v.uid < 0) {
          v.uid = WGRBufferView_1.createNewWRGBufferViewUid();
        }

        const vuid = v.uid;
        const arrayStride = v.arrayStride;
        const visibility = v.visibility.clone(); // console.log(v, ", B1 v instanceof WGRBufferValue: ", v instanceof WGRBufferValue);

        let param = {
          arrayStride,
          size: v.byteLength,
          usage: v.usage,
          shared: v.shared,
          vuid,
          visibility,
          ufvalue: v
        }; // console.log("XXX XXX param: ", param);

        bufDataParams.push(param);
      }

      return uctx.createUniform(layoutName, groupIndex, bufDataParams, texParams, uniformAppend);
    }

    throw Error("Illegal operation !!!");
    return null;
  }

  createUniform(layoutName, groupIndex, bufDataParams, texParams, uniformAppend) {
    if (this.mBindGCtx) {
      const uctx = this.getUCtx(layoutName);
      this.mInsList.push(uctx);
      return uctx.createUniform(layoutName, groupIndex, bufDataParams, texParams, uniformAppend);
    }

    return null;
  }

  removeUniforms(ufs) {
    if (ufs && this.mBindGCtx) {
      // console.log("WGRUniformContext::removeUniforms(), ufs.length: ", ufs.length);
      for (let i = 0; i < ufs.length; ++i) {
        this.removeUniform(ufs[i]);
      }
    }
  }

  removeUniform(u) {
    if (this.mBindGCtx) {
      // console.log("WGRUniformContext::removeUniform(), u: ", u);
      if (u.layoutName !== undefined) {
        const m = this.mMap;

        if (m.has(u.layoutName)) {
          const uctx = m.get(u.layoutName);
          uctx.removeUniform(u);
        }
      }
    }
  }

  destroy() {
    if (this.mBindGCtx) {
      for (var [k, v] of this.mMap) {
        v.destroy();
      }

      this.mBindGCtx = null;
    }
  }

}

WGRUniformContext.shdUniform = new WGRUniformCtxInstance_1.SharedUniformObj();
exports.WGRUniformContext = WGRUniformContext;

/***/ }),

/***/ "b3f5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CommonUtils_1 = __webpack_require__("fe0b");

exports.calculateMipLevels = CommonUtils_1.calculateMipLevels;
/**
 * thanks: https://github.com/toji/web-texture-tool/blob/main/src/webgpu-mipmap-generator.js
 */

class GPUMipmapGenerator {
  constructor(device) {
    this.pipelines = {};
    this.initialize(device);
  }

  initialize(device) {
    if (device && !this.device) {
      this.device = device;
      this.sampler = device.createSampler({
        minFilter: "linear"
      });
    }
  }
  /**
   * @param {string} format - format of the texture
   * @returns {GPURenderPipeline} pipeline - a GPURenderPipeline instance
   */


  getMipmapPipeline(format) {
    let pipeline = this.pipelines[format];

    if (!pipeline) {
      // Shader modules is shared between all pipelines, so only create once.
      if (!this.mipmapShaderModule) {
        this.mipmapShaderModule = this.device.createShaderModule({
          label: "Mipmap Generator",
          code: `
            var<private> pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
              vec2<f32>(-1.0, -1.0), vec2<f32>(-1.0, 3.0), vec2<f32>(3.0, -1.0));

            struct VertexOutput {
              @builtin(position) position : vec4<f32>,
              @location(0) texCoord : vec2<f32>,
            };

            @vertex
            fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
              var output : VertexOutput;
              output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);
              output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
              return output;
            }

            @group(0) @binding(0) var imgSampler : sampler;
            @group(0) @binding(1) var img : texture_2d<f32>;

            @fragment
            fn fragmentMain(@location(0) texCoord : vec2<f32>) -> @location(0) vec4<f32> {
              return textureSample(img, imgSampler, texCoord);
            }
          `
        });
        this.bindGroupLayout = this.device.createBindGroupLayout({
          label: "Mipmap Generator",
          entries: [{
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {}
          }, {
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {}
          }]
        });
        this.pipelineLayout = this.device.createPipelineLayout({
          label: "Mipmap Generator",
          bindGroupLayouts: [this.bindGroupLayout]
        });
      }

      pipeline = this.device.createRenderPipeline({
        layout: this.pipelineLayout,
        vertex: {
          module: this.mipmapShaderModule,
          entryPoint: "vertexMain"
        },
        fragment: {
          module: this.mipmapShaderModule,
          entryPoint: "fragmentMain",
          targets: [{
            format
          }]
        }
      });
      this.pipelines[format] = pipeline;
    }

    return pipeline;
  }
  /**
   * Generates mipmaps for the given GPUTexture from the data in level 0.
   *
   * @param {GPUTexture} texture - Texture to generate mipmaps for.
   * @param {object} textureDescriptor - GPUTextureDescriptor the texture was created with.
   * @returns {module:External.GPUTexture} - The originally passed texture
   */


  generateMipmap(texture, textureDescriptor) {
    // TODO: Does this need to handle sRGB formats differently?
    const pipeline = this.getMipmapPipeline(textureDescriptor.format);

    if (textureDescriptor.dimension == "3d" || textureDescriptor.dimension == "1d") {
      throw new Error("Generating mipmaps for non-2d textures is currently unsupported!");
    }

    let texSizeDesc = textureDescriptor.size;
    const sizeArr = textureDescriptor.size;

    if (sizeArr.length !== undefined) {
      const len = sizeArr.length;
      texSizeDesc = {
        depthOrArrayLayers: 1
      };

      if (len >= 0) {
        texSizeDesc.width = sizeArr[0];

        if (len >= 1) {
          texSizeDesc.height = sizeArr[1];

          if (len >= 2) {
            texSizeDesc.depthOrArrayLayers = sizeArr[2];
          }
        }
      }
    }

    let mipTexture = texture;
    const arrayLayerCount = texSizeDesc.depthOrArrayLayers || 1; // Only valid for 2D textures.
    // If the texture was created with RENDER_ATTACHMENT usage we can render directly between mip levels.

    const renderToSource = textureDescriptor.usage & GPUTextureUsage.RENDER_ATTACHMENT; // console.log('GPUMipmapGenerator::generateMipmap(), AAA, !renderToSource: ', !renderToSource);

    if (!renderToSource) {
      // Otherwise we have to use a separate texture to render into. It can be one mip level smaller than the source
      // texture, since we already have the top level.
      const mipTextureDescriptor = {
        size: {
          width: Math.max(1, texSizeDesc.width >>> 1),
          height: Math.max(1, texSizeDesc.height >>> 1),
          depthOrArrayLayers: arrayLayerCount
        },
        format: textureDescriptor.format,
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
        mipLevelCount: textureDescriptor.mipLevelCount - 1
      };
      mipTexture = this.device.createTexture(mipTextureDescriptor);
    }

    const commandEncoder = this.device.createCommandEncoder({});

    for (let arrayLayer = 0; arrayLayer < arrayLayerCount; ++arrayLayer) {
      let srcView = texture.createView({
        baseMipLevel: 0,
        mipLevelCount: 1,
        dimension: "2d",
        baseArrayLayer: arrayLayer,
        arrayLayerCount: 1
      });
      let dstMipLevel = renderToSource ? 1 : 0;

      for (let i = 1; i < textureDescriptor.mipLevelCount; ++i) {
        const dstView = mipTexture.createView({
          baseMipLevel: dstMipLevel++,
          mipLevelCount: 1,
          dimension: "2d",
          baseArrayLayer: arrayLayer,
          arrayLayerCount: 1
        });
        const passEncoder = commandEncoder.beginRenderPass({
          colorAttachments: [{
            view: dstView,
            loadOp: "clear",
            storeOp: "store"
          }]
        });
        const bindGroup = this.device.createBindGroup({
          layout: this.bindGroupLayout,
          entries: [{
            binding: 0,
            resource: this.sampler
          }, {
            binding: 1,
            resource: srcView
          }]
        });
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(3, 1, 0, 0);
        passEncoder.end();
        srcView = dstView;
      }
    } // If we didn't render to the source texture, finish by copying the mip results from the temporary mipmap texture
    // to the source.
    // console.log('GPUMipmapGenerator::generateMipmap(), BBB, !renderToSource: ', !renderToSource);


    if (!renderToSource) {
      const mipLevelSize = {
        width: Math.max(1, texSizeDesc.width >>> 1),
        height: Math.max(1, texSizeDesc.height >>> 1),
        depthOrArrayLayers: arrayLayerCount
      };

      for (let i = 1; i < textureDescriptor.mipLevelCount; ++i) {
        commandEncoder.copyTextureToTexture({
          texture: mipTexture,
          mipLevel: i - 1
        }, {
          texture: texture,
          mipLevel: i
        }, mipLevelSize);
        mipLevelSize.width = Math.max(1, mipLevelSize.width >>> 1);
        mipLevelSize.height = Math.max(1, mipLevelSize.height >>> 1);
      }
    }

    this.device.queue.submit([commandEncoder.finish()]);

    if (!renderToSource) {
      mipTexture.destroy();
    }

    return texture;
  }

}

exports.GPUMipmapGenerator = GPUMipmapGenerator;

/***/ }),

/***/ "b512":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGRBufferData_1 = __webpack_require__("87f6");

exports.WGRBufferLayout = WGRBufferData_1.WGRBufferLayout;
exports.WGRBufferData = WGRBufferData_1.WGRBufferData;

const WGRBufferVisibility_1 = __webpack_require__("dc4d");

function applyParamToBufferData(bufData, param) {
  if (param.uuid !== undefined) bufData.uuid = param.uuid;
  let d = param.data;
  bufData.data = d;

  if (param.bufData) {
    const bd = param.bufData;
    bufData.bufData = bd;
    d = bd.data;
    bufData.data = d;
  }

  if (bufData.shared === undefined) bufData.shared = false;

  if (bufData !== param) {
    if (param.usage !== undefined) bufData.usage = param.usage;
    if (param.shared !== undefined) bufData.shared = param.shared;
    if (param.stride !== undefined) bufData.stride = param.stride;
    if (param.shdVarName !== undefined) bufData.shdVarName = param.shdVarName;
    if (param.arrayStride !== undefined) bufData.arrayStride = param.arrayStride;
  }

  if (bufData.arrayStride === undefined) bufData.arrayStride = 1;

  if (bufData.arrayStride < 2) {
    const bpe = d.BYTES_PER_ELEMENT;

    if (bufData.stride !== undefined && bpe !== undefined) {
      bufData.arrayStride = bpe * bufData.stride;
    } else if (d) {
      if (d.byteLength <= 64) bufData.arrayStride = d.byteLength;
    }
  }

  if (!bufData.visibility) {
    bufData.visibility = new WGRBufferVisibility_1.WGRBufferVisibility();
  }
}

exports.applyParamToBufferData = applyParamToBufferData;

/***/ }),

/***/ "b720":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const Define_1 = __webpack_require__("af1b"); // dynamic or static for materials?
// shared or private for materials?


class WGRPrimitive {
  constructor() {
    this.indexCount = 0;
    this.layoutUid = 0;
    this.instanceCount = 1;
    this.vertexCount = 0;
    this.drawMode = Define_1.WGRDrawMode.TRIANGLES;
  }

  run(rc) {
    const vs = this.vbufs;

    if (vs) {
      for (let j = 0, ln = vs.length; j < ln; ++j) {
        rc.setVertexBuffer(j, vs[j]);
      }
    }
  }

  update() {
    if (this.ibuf) {
      this.indexCount = this.indexCount > 0 ? this.indexCount : this.ibuf.elementCount;
    } else {
      this.vertexCount = this.vertexCount > 0 ? this.vertexCount : this.vbufs[0].vectorCount;
    }
  }

  clone() {
    const g = new WGRPrimitive();
    g.layoutUid = this.layoutUid;
    g.vbufs = this.vbufs;
    g.ibuf = this.ibuf;
    g.indexCount = this.indexCount;
    g.instanceCount = this.instanceCount;
    g.vertexCount = this.vertexCount;
    return g;
  }

}

exports.WGRPrimitive = WGRPrimitive;

/***/ }),

/***/ "bc85":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class WebGPUBufferContext {
  constructor(wgCtx) {
    if (wgCtx) {
      this.initialize(wgCtx);
    }
  }

  initialize(wgCtx) {
    if (!this.mWGCtx && wgCtx) {
      this.mWGCtx = wgCtx;
      this.queue = wgCtx.queue;
    }
  }

  createIndices(dataArray) {
    if (dataArray.length <= 65536) {
      return new Uint16Array(dataArray);
    }

    return new Uint32Array(dataArray);
  }

  createIndicesWithSize(size) {
    if (size <= 65536) {
      return new Uint16Array(size);
    }

    return new Uint32Array(size);
  }

  createIndexBuffer(data, offset = 0, mappedAtCreation = true) {
    return this.createVtxBuffer(data, offset, GPUBufferUsage.INDEX, mappedAtCreation);
  }

  createVertexBuffer(data, offset = 0, vectorLengths, mappedAtCreation = true) {
    return this.createVtxBuffer(data, offset, GPUBufferUsage.VERTEX, mappedAtCreation, vectorLengths);
  }

  createVtxBuffer(data, offset = 0, usage = GPUBufferUsage.VERTEX, mappedAtCreation = true, vectorLengths) {
    let size = data.byteLength % 4; // 如果不是4的倍数会报错

    size = data.byteLength + (size > 0 ? 4 - size : 0);
    const buf = this.createBuffer({
      size: size,
      usage: usage,
      mappedAtCreation
    });
    let eleBytes = 1;

    if (data instanceof Float32Array) {
      buf.dataFormat = "float32";
      eleBytes = 4;
    } else if (data instanceof Uint32Array) {
      buf.dataFormat = "uint32";
      eleBytes = 4;
    } else if (data instanceof Uint16Array) {
      buf.dataFormat = "uint16";
      eleBytes = 2;
    } else if (data instanceof Int32Array) {
      buf.dataFormat = "int32";
      eleBytes = 4;
    } else if (data instanceof Int16Array) {
      buf.dataFormat = "int16";
      eleBytes = 2;
    } else if (data instanceof Int8Array) {
      buf.dataFormat = "int8";
    } else if (data instanceof Uint8Array) {
      buf.dataFormat = "uint8";
    } else {
      throw Error("Illegal data type, need: Float32Array | Uint32Array | Uint16Array  | Int32Array | Int16Array | Uint8Array | Int8Array");
    }

    if (mappedAtCreation) {
      const b = buf.getMappedRange();

      if (data instanceof Float32Array) {
        new Float32Array(b).set(data, offset);
      } else if (data instanceof Uint32Array) {
        new Uint32Array(b).set(data, offset);
      } else if (data instanceof Uint16Array) {
        new Uint16Array(b).set(data, offset);
      } else if (data instanceof Int32Array) {
        new Int32Array(b).set(data, offset);
      } else if (data instanceof Int16Array) {
        new Int16Array(b).set(data, offset);
      } else if (data instanceof Int8Array) {
        new Int8Array(b).set(data, offset);
      } else if (data instanceof Uint8Array) {
        new Uint8Array(b).set(data, offset);
      }

      buf.unmap();
    }

    buf.elementCount = data.length;

    if (vectorLengths && vectorLengths.length > 0) {
      let arrayStride = 0;
      const offsets = new Array(vectorLengths.length);
      const formats = new Array(vectorLengths.length);

      for (let i = 0; i < formats.length; ++i) {
        offsets[i] = arrayStride;
        arrayStride += vectorLengths[i] * eleBytes;
        formats[i] = buf.dataFormat + "x" + vectorLengths[i];
      }

      buf.vectorOffsets = offsets;
      buf.vectorFormats = formats;
      buf.arrayStride = arrayStride;
      buf.vectorLengths = vectorLengths.slice();
      buf.vectorCount = buf.elementCount / vectorLengths[0];
    }

    buf.enabled = true;
    buf.shared = false;
    buf.uid = WebGPUBufferContext.sVtxUid++;
    return buf;
  }

  createBuffer(desc) {
    const buf = this.mWGCtx.device.createBuffer(desc);
    buf.uid = WebGPUBufferContext.sVtxUid++;
    return buf;
  }

  updateUniformBuffer(buffer, td, index, offset = 0) {
    // console.log("WebGPUBufferContext::updateUniformBuffer() index: ", index,",segs: ", buffer.segs);
    // console.log("WebGPUBufferContext::updateUniformBuffer() buffer.size: ", buffer.size);
    // console.log("WebGPUBufferContext::updateUniformBuffer() buffer.segs[index].index + offset: ", buffer.segs[index].index + offset);
    // console.log("WebGPUBufferContext::updateUniformBuffer() td: ", td);
    this.queue.writeBuffer(buffer, buffer.segs[index].index + offset, td.buffer, td.byteOffset, td.byteLength);
  }

}

WebGPUBufferContext.sVtxUid = 0;
exports.WebGPUBufferContext = WebGPUBufferContext;

/***/ }),

/***/ "bd91":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var EulerOrder;

(function (EulerOrder) {
  EulerOrder[EulerOrder["XYZ"] = 0] = "XYZ";
  EulerOrder[EulerOrder["YZX"] = 1] = "YZX";
  EulerOrder[EulerOrder["ZXY"] = 2] = "ZXY";
  EulerOrder[EulerOrder["XZY"] = 3] = "XZY";
  EulerOrder[EulerOrder["YXZ"] = 4] = "YXZ";
  EulerOrder[EulerOrder["ZYX"] = 5] = "ZYX";
})(EulerOrder || (EulerOrder = {}));

exports.EulerOrder = EulerOrder;

/***/ }),

/***/ "bf93":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGRShaderParams_1 = __webpack_require__("e2cf");

exports.findShaderEntryPoint = WGRShaderParams_1.findShaderEntryPoint;
exports.WGRShadeSrcParam = WGRShaderParams_1.WGRShadeSrcParam;
exports.WGRShderSrcType = WGRShaderParams_1.WGRShderSrcType;

class WGRPipelineCtxParams {
  constructor(param) {
    this.buildDeferred = true;
    this.sampleCount = 1;
    this.multisampleEnabled = false;
    this.depthStencilEnabled = false;
    this.fragmentEnabled = true;
    this.layout = "auto";
    this.vertex = {
      module: null,
      entryPoint: "main",
      buffers: []
    };

    if (param) {
      const selfT = this;

      for (var k in param) {
        selfT[k] = param[k];
      }

      this.depthStencilEnabled = this.depthStencil ? true : this.depthStencilEnabled;

      if (this.depthStencilEnabled && !this.depthStencil) {
        this.depthStencil = {
          depthWriteEnabled: true,
          depthCompare: "less",
          format: "depth24plus" // format: "depth32float"
          // format: "depth24plus"

        };
      }

      if (this.fragmentEnabled) {
        this.fragment = WGRShaderParams_1.createFragmentState();
      }

      this.primitive = {
        frontFace: "ccw",
        topology: "triangle-list",
        cullMode: "back"
      };

      if (this.multisampleEnabled) {
        this.multisample = {
          count: this.sampleCount
        };
      }
    }
  }

  setDepthStencilParam(state) {
    if (this.depthStencilEnabled) {
      this.depthStencil = state;
    }
  }

  setDepthStencil(state) {
    if (state) {
      if (!this.depthStencil) {
        this.depthStencil = state;
      }

      const src = state;
      const dst = this.depthStencil;

      for (var k in src) {
        dst[k] = src[k];
      }
    }
  }

  setDepthWriteEnabled(enabled) {
    this.depthStencilEnabled = enabled;

    if (this.depthStencil) {
      this.depthStencil.depthWriteEnabled = enabled;
    }

    if (enabled) {
      if (!this.depthStencil) {
        this.depthStencil = {
          depthWriteEnabled: true,
          depthCompare: "less",
          format: "depth24plus"
        };
      }
    }
  }

  setDepthStencilFormat(format) {
    if (this.depthStencil) {
      this.depthStencil.format = format;
    }
  }
  /**
   *
   * @param primitiveState cullMode, Possible values are: "back", "front", "none", the default value is "none".
   * 						 frontFace, Possible values are: "cw", "ccw", the default value is "ccw".
   * 						 topology, Possible values are: "triangle-strip", "triangle-list", "point-list", "line-list", "line-strip",
   * 						 the default value is "triangle-list"
   */


  setPrimitiveState(state) {
    if (state) {
      if (!this.primitive) {
        this.primitive = state;
      }

      switch (state.cullMode) {
        case "back":
        case "front":
        case "none":
          this.primitive.cullMode = state.cullMode;
          break;
      }

      switch (state.frontFace) {
        case "cw":
        case "ccw":
          this.primitive.frontFace = state.frontFace;
          break;
      }

      switch (state.topology) {
        case "triangle-strip":
        case "triangle-list":
        case "point-list":
        case "line-list":
        case "line-strip":
          this.primitive.topology = state.topology;
          break;
      }
    }
  }

  setBlendModes(modes) {
    for (let i = 0; i < modes.length; ++i) {
      this.setBlendMode(modes[i], i);
    }
  }

  setBlendMode(mode, targetIndex = 0) {
    let color = {
      srcFactor: "one",
      dstFactor: "zero"
    };
    let alpha = {
      srcFactor: "one",
      dstFactor: "zero"
    };

    switch (mode) {
      case "transparent":
        color = {
          srcFactor: "src-alpha",
          dstFactor: "one-minus-src-alpha"
        };
        alpha = {
          srcFactor: "zero",
          dstFactor: "one"
        };
        break;

      case "add":
        color = {
          srcFactor: "src-alpha",
          dstFactor: "one"
        };
        alpha = {
          srcFactor: "zero",
          dstFactor: "one"
        };
        break;

      case "alpha_add":
        color = {
          srcFactor: "one",
          dstFactor: "one-minus-src-alpha"
        };
        alpha = {
          srcFactor: "one",
          dstFactor: "one-minus-src-alpha"
        };
        break;
      // the default mode value is "solid":

      default:
        break;
    }

    this.setBlendParam(color, alpha, targetIndex);
  }

  setBlendParam(color, alpha, targetIndex = 0) {
    if (this.fragmentEnabled) {
      const frag = this.fragment;
      const target = frag.targets[targetIndex];

      if (target.blend) {
        if (color) {
          target.blend.color = color;
        }

        if (alpha) {
          target.blend.alpha = alpha;
        }
      } else {
        target.blend = {
          color,
          alpha
        };
      }
    }
  }

  addFragmentColorTarget(colorState) {
    if (this.fragmentEnabled && colorState) {
      const frag = this.fragment;
      frag.targets.push(colorState);
    }
  }

  setFragmentColorTarget(colorState, targetIndex = 0) {
    if (this.fragmentEnabled && colorState) {
      const frag = this.fragment;
      frag.targets[targetIndex] = colorState;
    }
  }

  setVertexBufferArrayStrideAt(arrayStride, bufferIndex = 0) {
    const vert = this.vertex;

    if (vert.buffers.length < 1) {
      this.addVertexBufferLayout({
        arrayStride: 0,
        attributes: [],
        stepMode: "vertex"
      });
    }

    vert.buffers[bufferIndex].arrayStride = arrayStride;
  }
  /**
   * @param attribute for example: { shaderLocation: 0, offset: 0, format: "float32x4" }
   * @param bufferIndex an index of vertex.buffers
   */


  addVertexBufferAttribute(attribute, bufferIndex = 0) {
    const vert = this.vertex; // console.log("vert.buffers: ", vert.buffers);

    if (vert.buffers.length < 1) {
      this.addVertexBufferLayout({
        arrayStride: 0,
        attributes: [],
        stepMode: "vertex"
      });
    }

    let attributes = vert.buffers[bufferIndex].attributes;
    attributes.push(attribute);
  }
  /**
   * @param vtxBufLayout for example: {arrayStride: 0, attributes: [], stepMode: "vertex"}
   */


  addVertexBufferLayout(vtxBufLayout) {
    const vert = this.vertex;
    vert.buffers.push(vtxBufLayout);
  }

}

exports.WGRPipelineCtxParams = WGRPipelineCtxParams;

/***/ }),

/***/ "c433":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2023 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const MathConst_1 = __importDefault(__webpack_require__("ec7b"));

const Matrix4Pool_1 = __importDefault(__webpack_require__("4e74"));

const WGRUniformValue_1 = __webpack_require__("7650");

const MatrixUtils_1 = __webpack_require__("406a");

const Vector3_1 = __importDefault(__webpack_require__("af80"));

const v3 = new Vector3_1.default();

class ROTransform {
  constructor(fs32) {
    this.mUid = ROTransform.sUid++;
    this.mFS32 = null; // It is a flag that need inverted mat yes or no

    this.mInvMat = false;
    this.mRot = false;
    this.mDt = 0;
    this.version = -1;
    /**
     * the default value is 0
     */

    this.__$transUpdate = 0;
    this.updatedStatus = ROTransform.POSITION;
    this.updateStatus = ROTransform.TRANSFORM;
    this.mToParentMatFlag = true;
    this.mDt = fs32 ? 1 : 0;
    this.mFS32 = fs32 ? fs32 : new Float32Array(16);
  }

  set transform(t) {
    if (t) {
      this.setScale(t.scale);
      this.setRotation(t.rotation);
      this.setPosition(t.position);

      if (t.matrix && t.matrix.length == 16) {
        this.mFS32.set(t.matrix);
      }
    }
  }

  get transform() {
    return {
      scale: this.getScale(),
      rotation: this.getRotation(),
      position: this.getPosition()
    };
  }

  get uid() {
    return this.mUid;
  }

  get fs32Data() {
    return this.mFS32;
  }
  /**
   * 防止因为共享 fs32 数据带来的逻辑错误
   */


  rebuildFS32Data() {
    if (this.mDt > 0) {
      this.mDt = 0;
      this.mFS32 = new Float32Array(16);
    }
  }

  getRotationFlag() {
    return this.mRot;
  }

  getX() {
    return this.mFS32[12];
  }

  getY() {
    return this.mFS32[13];
  }

  getZ() {
    return this.mFS32[14];
  }

  setX(p) {
    this.updateStatus |= 1;
    this.updatedStatus |= 1;
    this.mFS32[12] = p;
    this.updateTo();
    return this;
  }

  setY(p) {
    this.updateStatus |= 1;
    this.updatedStatus |= 1;
    this.mFS32[13] = p;
    this.updateTo();
    return this;
  }

  setZ(p) {
    this.updateStatus |= 1;
    this.updatedStatus |= 1;
    this.mFS32[14] = p;
    this.updateTo();
    return this;
  }

  setXYZ(px, py, pz) {
    this.mFS32[12] = px;
    this.mFS32[13] = py;
    this.mFS32[14] = pz;
    this.updateStatus |= 1;
    this.updatedStatus |= 1;
    this.updateTo();
    return this;
  }

  offsetPosition(pv) {
    v3.setXYZ(0, 0, 0).setVector3(pv);
    this.mFS32[12] += v3.x;
    this.mFS32[13] += v3.y;
    this.mFS32[14] += v3.z;
    this.updateStatus |= 1;
    this.updatedStatus |= 1;
    this.updateTo();
    return this;
  }

  setPosition(pv) {
    v3.setXYZ(0, 0, 0).setVector3(pv);
    this.mFS32[12] = v3.x;
    this.mFS32[13] = v3.y;
    this.mFS32[14] = v3.z;
    this.updateStatus |= 1;
    this.updatedStatus |= 1;
    this.updateTo();
    return this;
  }

  getPosition(pv) {
    if (!pv) pv = new Vector3_1.default();
    pv.x = this.mFS32[12];
    pv.y = this.mFS32[13];
    pv.z = this.mFS32[14];
    return pv;
  }

  copyPositionFrom(t) {
    if (t) {
      this.mFS32[12] = t.mFS32[12];
      this.mFS32[13] = t.mFS32[13];
      this.mFS32[14] = t.mFS32[14];
      this.updateStatus |= ROTransform.POSITION;
      this.updatedStatus |= ROTransform.POSITION;
      this.updateTo();
    }

    return this;
  }

  getRotationX() {
    return this.mFS32[1];
  }

  getRotationY() {
    return this.mFS32[6];
  }

  getRotationZ() {
    return this.mFS32[9];
  }

  setRotationX(degrees) {
    this.mFS32[1] = degrees;
    this.mRot = true;
    this.updateStatus |= ROTransform.ROTATION;
    this.updatedStatus |= ROTransform.ROTATION;
    this.updateTo();
    return this;
  }

  setRotationY(degrees) {
    this.mFS32[6] = degrees;
    this.mRot = true;
    this.updateStatus |= ROTransform.ROTATION;
    this.updatedStatus |= ROTransform.ROTATION;
    this.updateTo();
    return this;
  }

  setRotationZ(degrees) {
    this.mFS32[9] = degrees;
    this.mRot = true;
    this.updateStatus |= ROTransform.ROTATION;
    this.updatedStatus |= ROTransform.ROTATION;
    this.updateTo();
    return this;
  }

  setRotationXYZ(rx, ry, rz) {
    this.mFS32[1] = rx;
    this.mFS32[6] = ry;
    this.mFS32[9] = rz;
    this.updateStatus |= ROTransform.ROTATION;
    this.updatedStatus |= ROTransform.ROTATION;
    this.mRot = true;
    this.updateTo();
    return this;
  }

  setRotation(pv) {
    v3.setXYZ(0, 0, 0).setVector3(pv);
    this.setRotationXYZ(v3.x, v3.y, v3.z);
    return this;
  }

  getRotation(pv) {
    if (!pv) pv = new Vector3_1.default();
    pv.x = this.mFS32[1];
    pv.y = this.mFS32[6];
    pv.z = this.mFS32[9];
    return pv;
  }

  getScaleX() {
    return this.mFS32[0];
  }

  getScaleY() {
    return this.mFS32[5];
  }

  getScaleZ() {
    return this.mFS32[10];
  }

  setScaleX(p) {
    this.mFS32[0] = p;
    this.updateStatus |= ROTransform.SCALE;
    this.updatedStatus |= ROTransform.SCALE;
    return this;
  }

  setScaleY(p) {
    this.mFS32[5] = p;
    this.updateStatus |= ROTransform.SCALE;
    this.updatedStatus |= ROTransform.SCALE;
    return this;
  }

  setScaleZ(p) {
    this.mFS32[10] = p;
    this.updateStatus |= ROTransform.SCALE;
    this.updatedStatus |= ROTransform.SCALE;
    return this;
  }

  setScaleXYZ(sx, sy, sz) {
    this.mFS32[0] = sx;
    this.mFS32[5] = sy;
    this.mFS32[10] = sz;
    this.updateStatus |= ROTransform.SCALE;
    this.updatedStatus |= ROTransform.SCALE;
    this.updateTo();
    return this;
  }

  setScale(pv) {
    v3.setXYZ(1, 1, 1).setVector3(pv);
    this.setScaleXYZ(v3.x, v3.y, v3.z);
    return this;
  }

  getScale(pv) {
    if (!pv) pv = new Vector3_1.default();
    pv.x = this.mFS32[0];
    pv.y = this.mFS32[5];
    pv.z = this.mFS32[10];
    return pv;
  }

  setScaleAll(s) {
    this.mFS32[0] = s;
    this.mFS32[5] = s;
    this.mFS32[10] = s;
    this.updateStatus |= ROTransform.SCALE;
    this.updatedStatus |= ROTransform.SCALE;
    this.updateTo();
    return this;
  }

  localToGlobal(pv) {
    this.getMatrix().transformVectorSelf(pv);
  }

  globalToLocal(pv) {
    this.getInvMatrix().transformVectorSelf(pv);
  } // maybe need call update function


  getInvMatrix() {
    if (this.mInvOmat) {
      if (this.mInvMat) {
        this.mInvOmat.copyFrom(this.mOMat);
        this.mInvOmat.invert();
      }
    } else {
      this.mInvOmat = Matrix4Pool_1.default.GetMatrix();
      this.mInvOmat.copyFrom(this.mOMat);
      this.mInvOmat.invert();
    }

    this.mInvMat = false;
    return this.mInvOmat;
  }

  getLocalMatrix() {
    if (this.updateStatus > 0) {
      this.update();
    }

    return this.mLocalMat;
  } // get local to world matrix, maybe need call update function


  getMatrix(flag = true) {
    if (this.updateStatus > 0 && flag) {
      this.update();
    }

    return this.mOMat;
  } // get local to parent space matrix, maybe need call update function


  getToParentMatrix() {
    if (this.mToParentMat) {
      //  if(this.mToParentMatFlag)
      //  {
      //      console.log("....");
      //      this.mToParentMat.invert();
      //  }
      return this.mToParentMat;
    }

    return this.mOMat;
  } // local to world matrix, 使用的时候注意数据安全->防止多个显示对象拥有而出现多次修改的问题,因此此函数尽量不要用


  setParentMatrix(matrix) {
    //  console.log("sTOTransform::etParentMatrix(), this.mParentMat != matrix: ",(this.mParentMat != matrix),this.mUid);
    this.mParentMat = matrix;
    this.mInvMat = true;

    if (this.mParentMat) {
      if (this.mLocalMat == this.mOMat) {
        this.updateStatus = ROTransform.TRANSFORM;
        this.updatedStatus = this.updateStatus;
        this.mLocalMat = Matrix4Pool_1.default.GetMatrix();
      } else {
        this.updateStatus |= ROTransform.PARENT_MAT;
        this.updatedStatus = this.updateStatus;
      }

      this.updateTo();
    }

    return this;
  }

  getParentMatrix() {
    return this.mParentMat;
  }

  updateMatrixData(matrix) {
    if (matrix) {
      this.updateStatus = ROTransform.NONE;
      this.mInvMat = true;
      this.mOMat.copyFrom(matrix);
      this.updateTo();
    }

    return this;
  }

  __$setMatrix(matrix) {
    if (matrix != null) {
      this.updateStatus = ROTransform.NONE;
      this.mInvMat = true;

      if (this.mLocalMat == this.mOMat) {
        this.mLocalMat = matrix;
      }

      if (this.mOMat) {
        Matrix4Pool_1.default.RetrieveMatrix(this.mOMat);
      }

      this.mOMat = matrix;
      this.updateTo();
    }
  }

  destroy() {
    // 当自身被完全移出RenderWorld之后才能执行自身的destroy
    if (this.mInvOmat) Matrix4Pool_1.default.RetrieveMatrix(this.mInvOmat);

    if (this.mLocalMat) {
      Matrix4Pool_1.default.RetrieveMatrix(this.mLocalMat);
    }

    if (this.mOMat && this.mOMat != this.mLocalMat) {
      Matrix4Pool_1.default.RetrieveMatrix(this.mOMat);
    }

    this.mInvOmat = null;
    this.mLocalMat = null;
    this.mOMat = null;
    this.mParentMat = null;
    this.updateStatus = ROTransform.TRANSFORM;
    this.mFS32 = null; // this.wrapper = null;
  }

  copyFrom(src) {
    this.mFS32.set(src.mFS32, 0);
    this.updatedStatus |= 1;
    this.updateStatus |= ROTransform.TRANSFORM;
    this.mRot = src.mRot;
    this.updateTo();
    return;
  }

  forceUpdate() {
    this.updateStatus |= ROTransform.TRANSFORM;
    this.update();
    return;
  }

  updateTo() {// if (this.wrapper) this.wrapper.updateTo();
  } // setUpdater(updater: ITransUpdater): void {
  // 	// if (this.wrapper) this.wrapper.setUpdater(updater);
  // }


  isDirty() {
    return this.updateStatus != ROTransform.NONE;
  }

  update() {
    let st = this.updateStatus;

    if (st > 0) {
      this.mInvMat = true;
      st = st | this.updatedStatus;

      if ((st & ROTransform.TRANSFORM) > 0) {
        const factor = MathConst_1.default.MATH_PI_OVER_180;
        this.mLocalMat.getLocalFS32().set(this.mFS32, 0);

        if (this.mRot) {
          this.mLocalMat.setRotationEulerAngle(this.mFS32[1] * factor, this.mFS32[6] * factor, this.mFS32[9] * factor);
        }

        if (this.mParentMat) {
          st = st | ROTransform.PARENT_MAT;
        }
      }

      if (this.mOMat != this.mLocalMat) {
        this.mOMat.copyFrom(this.mLocalMat);
      }

      if ((st & ROTransform.PARENT_MAT) == ROTransform.PARENT_MAT) {
        if (this.mToParentMat) {
          this.mToParentMat.copyFrom(this.mOMat);
        } else {
          this.mToParentMat = Matrix4Pool_1.default.GetMatrix();
          this.mToParentMat.copyFrom(this.mOMat);
        }

        this.mToParentMatFlag = true;
        this.mOMat.append(this.mParentMat);
      }

      st = ROTransform.NONE;
      this.version++;
      this.uniformv.upate();
    }

    this.updateStatus = st;
    this.__$transUpdate = 0;
  }

  getMatrixFS32() {
    return this.getMatrix().getLocalFS32();
  }

  static GetFreeId() {
    if (ROTransform.sFreeIds.length > 0) {
      return ROTransform.sFreeIds.pop();
    }

    return -1;
  }

  static Create(param) {
    param = param ? param : {};
    let unit;
    const index = param.fs32 ? -1 : ROTransform.GetFreeId();

    if (index >= 0) {
      unit = ROTransform.sUList[index];
      ROTransform.sFlags[index] = ROTransform.sFBUSY;
      unit.rebuildFS32Data();
    } else {
      unit = new ROTransform(param.fs32);
      ROTransform.sUList.push(unit);
      ROTransform.sFlags.push(ROTransform.sFBUSY);
    }

    if (param.matrix) {
      unit.mOMat = param.matrix;
    } else {
      unit.mOMat = Matrix4Pool_1.default.GetMatrix();
    }

    unit.mLocalMat = unit.mOMat;

    if (!param.fs32) {
      const ida = MatrixUtils_1.IdentityMat4Data;

      if (unit.mFS32) {
        unit.mFS32.set(ida, 0);
      } else {
        unit.mFS32 = ida.slice(0);
      }
    }

    unit.uniformv = new WGRUniformValue_1.WGRUniformValue({
      data: unit.mOMat.getLocalFS32(),
      shdVarName: "objMat"
    });

    if (param.transform) {
      unit.transform = param.transform;
    }

    return unit;
  }

  static Restore(pt) {
    if (pt && ROTransform.sFlags[pt.uid] == ROTransform.sFBUSY) {
      const uid = pt.uid;
      ROTransform.sFreeIds.push(uid);
      ROTransform.sFlags[uid] = ROTransform.sFFREE;
      pt.destroy();
    }
  }

}

ROTransform.sUid = 0;
ROTransform.NONE = 0;
ROTransform.POSITION = 1;
ROTransform.ROTATION = 2;
ROTransform.SCALE = 4;
ROTransform.TRANSFORM = 7;
ROTransform.PARENT_MAT = 8;
ROTransform.sFBUSY = 1;
ROTransform.sFFREE = 0;
ROTransform.sFlags = [];
ROTransform.sUList = [];
ROTransform.sFreeIds = [];
exports.default = ROTransform;

/***/ }),

/***/ "c6d1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2023 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const MathConst_1 = __importDefault(__webpack_require__("ec7b"));

const Vector3_1 = __importDefault(__webpack_require__("af80"));

const EulerOrder_1 = __webpack_require__("bd91");

const OrientationType_1 = __importDefault(__webpack_require__("cbb4"));

const MatrixUtils_1 = __webpack_require__("406a");

class Matrix4 {
  constructor(pfs32, index = 0) {
    this.mUid = -1;
    this.mIndex = 0;
    this.mIndex = index;

    if (pfs32) {
      this.mUid = Matrix4.sUid++;
      this.mFS32 = pfs32;
      this.mLocalFS32 = this.mFS32.subarray(index, index + 16);
    } else {
      this.mUid = Matrix4.sIsolatedUid++;
      this.mFS32 = new Float32Array(16);
      this.mFS32.set(MatrixUtils_1.IdentityMat4Data, 0);
      this.mLocalFS32 = this.mFS32;
    }
  }

  fromArray(array, offset = 0) {
    const fs = this.mLocalFS32;

    for (let i = 0; i < 16; i++) {
      fs[i] = array[i + offset];
    }

    return this;
  }

  setData(array16) {
    if (array16.length == 16) {
      this.mLocalFS32.set(array16);
    }

    return this;
  }

  getCapacity() {
    return 16;
  }

  GetMaxUid() {
    return Matrix4.sUid;
  }

  getUid() {
    return this.mUid;
  }

  getLocalFS32() {
    return this.mLocalFS32;
  }

  getFS32() {
    return this.mFS32;
  }

  getFSIndex() {
    return this.mIndex;
  }

  identity() {
    this.mLocalFS32.set(MatrixUtils_1.IdentityMat4Data, 0);
  }

  determinant() {
    let lfs = this.mLocalFS32;
    return (lfs[0] * lfs[5] - lfs[4] * lfs[1]) * (lfs[10] * lfs[15] - lfs[14] * lfs[11]) - (lfs[0] * lfs[9] - lfs[8] * lfs[1]) * (lfs[6] * lfs[15] - lfs[14] * lfs[7]) + (lfs[0] * lfs[13] - lfs[12] * lfs[1]) * (lfs[6] * lfs[11] - lfs[10] * lfs[7]) + (lfs[4] * lfs[9] - lfs[8] * lfs[5]) * (lfs[2] * lfs[15] - lfs[14] * lfs[3]) - (lfs[4] * lfs[13] - lfs[12] * lfs[5]) * (lfs[2] * lfs[11] - lfs[10] * lfs[3]) + (lfs[8] * lfs[13] - lfs[12] * lfs[9]) * (lfs[2] * lfs[7] - lfs[6] * lfs[3]);
  }

  multiplyMatrices(a, b) {
    const ae = a.getLocalFS32();
    const be = b.getLocalFS32();
    const fs = this.getLocalFS32();
    const a11 = ae[0],
          a12 = ae[4],
          a13 = ae[8],
          a14 = ae[12];
    const a21 = ae[1],
          a22 = ae[5],
          a23 = ae[9],
          a24 = ae[13];
    const a31 = ae[2],
          a32 = ae[6],
          a33 = ae[10],
          a34 = ae[14];
    const a41 = ae[3],
          a42 = ae[7],
          a43 = ae[11],
          a44 = ae[15];
    const b11 = be[0],
          b12 = be[4],
          b13 = be[8],
          b14 = be[12];
    const b21 = be[1],
          b22 = be[5],
          b23 = be[9],
          b24 = be[13];
    const b31 = be[2],
          b32 = be[6],
          b33 = be[10],
          b34 = be[14];
    const b41 = be[3],
          b42 = be[7],
          b43 = be[11],
          b44 = be[15];
    fs[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    fs[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    fs[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    fs[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    fs[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    fs[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    fs[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    fs[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    fs[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    fs[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    fs[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    fs[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    fs[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    fs[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    fs[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    fs[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    return this;
  }

  multiply(ma, mb = null) {
    if (ma != null && mb != null) {
      return this.multiplyMatrices(ma, mb);
    } else if (ma != null) {
      return this.multiplyMatrices(this, ma);
    }

    return this;
  }

  premultiply(m) {
    if (m != this && m != null) {
      return this.multiplyMatrices(m, this);
    }

    return this;
  }

  append(lhs) {
    let lfs32 = lhs.getLocalFS32();
    let fs = this.mLocalFS32;
    let m111 = fs[0];
    let m121 = fs[4];
    let m131 = fs[8];
    let m141 = fs[12];
    let m112 = fs[1];
    let m122 = fs[5];
    let m132 = fs[9];
    let m142 = fs[13];
    let m113 = fs[2];
    let m123 = fs[6];
    let m133 = fs[10];
    let m143 = fs[14];
    let m114 = fs[3];
    let m124 = fs[7];
    let m134 = fs[11];
    let m144 = fs[15];
    let m211 = lfs32[0];
    let m221 = lfs32[4];
    let m231 = lfs32[8];
    let m241 = lfs32[12];
    let m212 = lfs32[1];
    let m222 = lfs32[5];
    let m232 = lfs32[9];
    let m242 = lfs32[13];
    let m213 = lfs32[2];
    let m223 = lfs32[6];
    let m233 = lfs32[10];
    let m243 = lfs32[14];
    let m214 = lfs32[3];
    let m224 = lfs32[7];
    let m234 = lfs32[11];
    let m244 = lfs32[15];
    fs[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
    fs[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
    fs[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
    fs[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
    fs[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
    fs[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
    fs[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
    fs[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
    fs[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
    fs[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
    fs[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
    fs[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
    fs[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
    fs[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
    fs[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
    fs[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
  }

  append3x3(lhs) {
    let lfs32 = lhs.getLocalFS32();
    let fs = this.mLocalFS32;
    let m111 = fs[0];
    let m121 = fs[4];
    let m131 = fs[8];
    let m112 = fs[1];
    let m122 = fs[5];
    let m132 = fs[9];
    let m113 = fs[2];
    let m123 = fs[6];
    let m133 = fs[10];
    let m211 = lfs32[0];
    let m221 = lfs32[4];
    let m231 = lfs32[8];
    let m212 = lfs32[1];
    let m222 = lfs32[5];
    let m232 = lfs32[9];
    let m213 = lfs32[2];
    let m223 = lfs32[6];
    let m233 = lfs32[10];
    fs[0] = m111 * m211 + m112 * m221 + m113 * m231;
    fs[1] = m111 * m212 + m112 * m222 + m113 * m232;
    fs[2] = m111 * m213 + m112 * m223 + m113 * m233;
    fs[4] = m121 * m211 + m122 * m221 + m123 * m231;
    fs[5] = m121 * m212 + m122 * m222 + m123 * m232;
    fs[6] = m121 * m213 + m122 * m223 + m123 * m233;
    fs[8] = m131 * m211 + m132 * m221 + m133 * m231;
    fs[9] = m131 * m212 + m132 * m222 + m133 * m232;
    fs[10] = m131 * m213 + m132 * m223 + m133 * m233;
  }

  appendRotationPivot(radian, axis, pivotPoint = null) {
    if (pivotPoint == null) {
      pivotPoint = Vector3_1.default.Z_AXIS;
    }

    Matrix4.sTMat4.identity();
    Matrix4.sTMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
    Matrix4.sTMat4.appendTranslationXYZ(pivotPoint.x, pivotPoint.y, pivotPoint.z);
    this.append(Matrix4.sTMat4);
  }

  appendRotation(radian, axis) {
    Matrix4.sTMat4.identity();
    Matrix4.sTMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
    this.append(Matrix4.sTMat4);
  }

  appendRotationX(radian) {
    Matrix4.sTMat4.rotationX(radian);
    this.append3x3(Matrix4.sTMat4);
  }

  appendRotationY(radian) {
    Matrix4.sTMat4.rotationY(radian);
    this.append3x3(Matrix4.sTMat4);
  }

  appendRotationZ(radian) {
    Matrix4.sTMat4.rotationZ(radian);
    this.append3x3(Matrix4.sTMat4);
  } // 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)


  appendRotationEulerAngle(radianX, radianY, radianZ) {
    Matrix4.sTMat4.rotationY(radianY);
    this.append3x3(Matrix4.sTMat4);
    Matrix4.sTMat4.rotationX(radianX);
    this.append3x3(Matrix4.sTMat4);
    Matrix4.sTMat4.rotationZ(radianZ);
    this.append3x3(Matrix4.sTMat4);
  }

  setScale(v3) {
    let fs = this.mLocalFS32;
    fs[0] = v3.x;
    fs[5] = v3.y;
    fs[10] = v3.z;
    return this;
  }

  setScaleXYZ(xScale, yScale, zScale) {
    let fs = this.mLocalFS32;
    fs[0] = xScale;
    fs[5] = yScale;
    fs[10] = zScale;
  }

  getScale(outV3) {
    let fs = this.mLocalFS32;
    outV3.x = fs[0];
    outV3.y = fs[5];
    outV3.z = fs[10];
  }

  setRotationEulerAngle(radianX, radianY, radianZ) {
    let fs = this.mLocalFS32; //let sx:number = fs[0];
    //let sy:number = fs[5];
    //let sz:number = fs[10];

    let cosX = Math.cos(radianX);
    let sinX = Math.sin(radianX);
    let cosY = Math.cos(radianY);
    let sinY = Math.sin(radianY);
    let cosZ = Math.cos(radianZ);
    let sinZ = Math.sin(radianZ);
    let cosZsinY = cosZ * sinY;
    let sinZsinY = sinZ * sinY;
    let cosYscaleX = cosY * fs[0];
    let sinXscaleY = sinX * fs[5];
    let cosXscaleY = cosX * fs[5];
    let cosXscaleZ = cosX * fs[10];
    let sinXscaleZ = sinX * fs[10];
    fs[1] = sinZ * cosYscaleX;
    fs[2] = -sinY * fs[0];
    fs[0] = cosZ * cosYscaleX;
    fs[4] = cosZsinY * sinXscaleY - sinZ * cosXscaleY;
    fs[8] = cosZsinY * cosXscaleZ + sinZ * sinXscaleZ;
    fs[5] = sinZsinY * sinXscaleY + cosZ * cosXscaleY;
    fs[9] = sinZsinY * cosXscaleZ - cosZ * sinXscaleZ;
    fs[6] = cosY * sinXscaleY;
    fs[10] = cosY * cosXscaleZ;
  }

  setRotationEulerAngle2(cosX, sinX, cosY, sinY, cosZ, sinZ) {
    let fs = this.mLocalFS32; //let sx:number = fs[0];
    //let sy:number = fs[5];
    //let sz:number = fs[10];
    //	let cosX: number = Math.cos(radianX);
    //	let sinX:number = Math.sin(radianX);
    //	let cosY:number = Math.cos(radianY);
    //	let sinY:number = Math.sin(radianY);
    //	let cosZ:number = Math.cos(radianZ);
    //	let sinZ:number = Math.sin(radianZ);

    let cosZsinY = cosZ * sinY;
    let sinZsinY = sinZ * sinY;
    let cosYscaleX = cosY * fs[0];
    let sinXscaleY = sinX * fs[5];
    let cosXscaleY = cosX * fs[5];
    let cosXscaleZ = cosX * fs[10];
    let sinXscaleZ = sinX * fs[10];
    fs[1] = sinZ * cosYscaleX;
    fs[2] = -sinY * fs[0];
    fs[0] = cosZ * cosYscaleX;
    fs[4] = cosZsinY * sinXscaleY - sinZ * cosXscaleY;
    fs[8] = cosZsinY * cosXscaleZ + sinZ * sinXscaleZ;
    fs[5] = sinZsinY * sinXscaleY + cosZ * cosXscaleY;
    fs[9] = sinZsinY * cosXscaleZ - cosZ * sinXscaleZ;
    fs[6] = cosY * sinXscaleY;
    fs[10] = cosY * cosXscaleZ;
  }

  compose(position, quaternion, scale) {
    const fs = this.mLocalFS32;
    const x = quaternion.x,
          y = quaternion.y,
          z = quaternion.z,
          w = quaternion.w;
    const x2 = x + x,
          y2 = y + y,
          z2 = z + z;
    const xx = x * x2,
          xy = x * y2,
          xz = x * z2;
    const yy = y * y2,
          yz = y * z2,
          zz = z * z2;
    const wx = w * x2,
          wy = w * y2,
          wz = w * z2;
    const sx = scale.x,
          sy = scale.y,
          sz = scale.z;
    fs[0] = (1 - (yy + zz)) * sx;
    fs[1] = (xy + wz) * sx;
    fs[2] = (xz - wy) * sx;
    fs[3] = 0;
    fs[4] = (xy - wz) * sy;
    fs[5] = (1 - (xx + zz)) * sy;
    fs[6] = (yz + wx) * sy;
    fs[7] = 0;
    fs[8] = (xz + wy) * sz;
    fs[9] = (yz - wx) * sz;
    fs[10] = (1 - (xx + yy)) * sz;
    fs[11] = 0;
    fs[12] = position.x;
    fs[13] = position.y;
    fs[14] = position.z;
    fs[15] = 1;
    return this;
  }

  makeRotationFromQuaternion(q) {
    return this.compose(Vector3_1.default.ZERO, q, Vector3_1.default.ONE);
  }

  makeRotationFromEuler(euler) {
    if (euler == null) {
      console.error('Matrix4::makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.');
    }

    const fs = this.mLocalFS32;
    const x = euler.x,
          y = euler.y,
          z = euler.z;
    const a = Math.cos(x),
          b = Math.sin(x);
    const c = Math.cos(y),
          d = Math.sin(y);
    const e = Math.cos(z),
          f = Math.sin(z);

    if (euler.order === EulerOrder_1.EulerOrder.XYZ) {
      const ae = a * e,
            af = a * f,
            be = b * e,
            bf = b * f;
      fs[0] = c * e;
      fs[4] = -c * f;
      fs[8] = d;
      fs[1] = af + be * d;
      fs[5] = ae - bf * d;
      fs[9] = -b * c;
      fs[2] = bf - ae * d;
      fs[6] = be + af * d;
      fs[10] = a * c;
    } else if (euler.order === EulerOrder_1.EulerOrder.YXZ) {
      const ce = c * e,
            cf = c * f,
            de = d * e,
            df = d * f;
      fs[0] = ce + df * b;
      fs[4] = de * b - cf;
      fs[8] = a * d;
      fs[1] = a * f;
      fs[5] = a * e;
      fs[9] = -b;
      fs[2] = cf * b - de;
      fs[6] = df + ce * b;
      fs[10] = a * c;
    } else if (euler.order === EulerOrder_1.EulerOrder.ZXY) {
      const ce = c * e,
            cf = c * f,
            de = d * e,
            df = d * f;
      fs[0] = ce - df * b;
      fs[4] = -a * f;
      fs[8] = de + cf * b;
      fs[1] = cf + de * b;
      fs[5] = a * e;
      fs[9] = df - ce * b;
      fs[2] = -a * d;
      fs[6] = b;
      fs[10] = a * c;
    } else if (euler.order === EulerOrder_1.EulerOrder.ZYX) {
      const ae = a * e,
            af = a * f,
            be = b * e,
            bf = b * f;
      fs[0] = c * e;
      fs[4] = be * d - af;
      fs[8] = ae * d + bf;
      fs[1] = c * f;
      fs[5] = bf * d + ae;
      fs[9] = af * d - be;
      fs[2] = -d;
      fs[6] = b * c;
      fs[10] = a * c;
    } else if (euler.order === EulerOrder_1.EulerOrder.YZX) {
      const ac = a * c,
            ad = a * d,
            bc = b * c,
            bd = b * d;
      fs[0] = c * e;
      fs[4] = bd - ac * f;
      fs[8] = bc * f + ad;
      fs[1] = f;
      fs[5] = a * e;
      fs[9] = -b * e;
      fs[2] = -d * e;
      fs[6] = ad * f + bc;
      fs[10] = ac - bd * f;
    } else if (euler.order === EulerOrder_1.EulerOrder.XZY) {
      const ac = a * c,
            ad = a * d,
            bc = b * c,
            bd = b * d;
      fs[0] = c * e;
      fs[4] = -f;
      fs[8] = d * e;
      fs[1] = ac * f + bd;
      fs[5] = a * e;
      fs[9] = ad * f - bc;
      fs[2] = bc * f - ad;
      fs[6] = b * e;
      fs[10] = bd * f + ac;
    } // reset bottom row


    fs[3] = 0;
    fs[7] = 0;
    fs[11] = 0; // reset last column

    fs[12] = 0;
    fs[13] = 0;
    fs[14] = 0;
    fs[15] = 1;
    return this;
  }

  extractRotation(m) {
    // this method does not support reflection matrices
    const fs = this.mLocalFS32;
    const me = m.getLocalFS32();
    const v3 = Matrix4.sV3;
    m.copyColumnTo(0, v3);
    const scaleX = 1.0 / v3.getLength();
    m.copyColumnTo(1, v3);
    const scaleY = 1.0 / v3.getLength();
    m.copyColumnTo(2, v3);
    const scaleZ = 1.0 / v3.getLength();
    fs[0] = me[0] * scaleX;
    fs[1] = me[1] * scaleX;
    fs[2] = me[2] * scaleX;
    fs[3] = 0;
    fs[4] = me[4] * scaleY;
    fs[5] = me[5] * scaleY;
    fs[6] = me[6] * scaleY;
    fs[7] = 0;
    fs[8] = me[8] * scaleZ;
    fs[9] = me[9] * scaleZ;
    fs[10] = me[10] * scaleZ;
    fs[11] = 0;
    fs[12] = 0;
    fs[13] = 0;
    fs[14] = 0;
    fs[15] = 1;
    return this;
  }

  copyTranslation(m) {
    const fs = this.mLocalFS32,
          me = m.getLocalFS32();
    fs[12] = me[12];
    fs[13] = me[13];
    fs[14] = me[14];
    return this;
  }

  setTranslationXYZ(px, py, pz) {
    this.mLocalFS32[12] = px;
    this.mLocalFS32[13] = py;
    this.mLocalFS32[14] = pz;
  }

  setTranslation(v3) {
    this.mLocalFS32[12] = v3.x;
    this.mLocalFS32[13] = v3.y;
    this.mLocalFS32[14] = v3.z;
  }

  appendScaleXYZ(xScale, yScale, zScale) {
    const fs = this.mLocalFS32;
    fs[0] *= xScale;
    fs[1] *= xScale;
    fs[2] *= xScale;
    fs[3] *= xScale;
    fs[4] *= yScale;
    fs[5] *= yScale;
    fs[6] *= yScale;
    fs[7] *= yScale;
    fs[8] *= zScale;
    fs[9] *= zScale;
    fs[10] *= zScale;
    fs[11] *= zScale;
  }

  appendScaleXY(xScale, yScale) {
    const fs = this.mLocalFS32;
    fs[0] *= xScale;
    fs[1] *= xScale;
    fs[2] *= xScale;
    fs[3] *= xScale;
    fs[4] *= yScale;
    fs[5] *= yScale;
    fs[6] *= yScale;
    fs[7] *= yScale;
  }

  appendTranslationXYZ(px, py, pz) {
    this.mLocalFS32[12] += px;
    this.mLocalFS32[13] += py;
    this.mLocalFS32[14] += pz;
  }

  appendTranslation(v3) {
    this.mLocalFS32[12] += v3.x;
    this.mLocalFS32[13] += v3.y;
    this.mLocalFS32[14] += v3.z;
  }

  copyColumnFrom(column_index, v3) {
    const fs = this.mLocalFS32;

    switch (column_index) {
      case 0:
        {
          fs[0] = v3.x;
          fs[1] = v3.y;
          fs[2] = v3.z;
          fs[3] = v3.w;
        }
        break;

      case 1:
        {
          fs[4] = v3.x;
          fs[5] = v3.y;
          fs[6] = v3.z;
          fs[7] = v3.w;
        }
        break;

      case 2:
        {
          fs[8] = v3.x;
          fs[9] = v3.y;
          fs[10] = v3.z;
          fs[11] = v3.w;
        }
        break;

      case 3:
        {
          fs[12] = v3.x;
          fs[13] = v3.y;
          fs[14] = v3.z;
          fs[15] = v3.w;
        }
        break;

      default:
        break;
    }
  }

  copyColumnTo(column_index, outV3) {
    const fs = this.mLocalFS32;
    column_index <<= 2;
    outV3.x = fs[column_index];
    outV3.y = fs[1 + column_index];
    outV3.z = fs[2 + column_index];
    outV3.w = fs[3 + column_index];
  }

  setF32ArrAndIndex(fs32Arr, index = 0) {
    if (fs32Arr != null && index >= 0) {
      this.mFS32 = fs32Arr;
      this.mIndex = index;
      this.mLocalFS32 = this.mFS32.subarray(index, index + 16);
    }
  }

  setF32ArrIndex(index = 0) {
    if (index >= 0) {
      this.mIndex = index;
      this.mLocalFS32 = this.mFS32.subarray(index, index + 16);
    }
  }

  setF32Arr(fs32Arr) {
    if (fs32Arr != null) {
      this.mFS32 = fs32Arr;
    }
  }

  copyFromF32Arr(fs32Arr, index = 0) {
    //let subArr:Float32Array = fs32Arr.subarray(index, index + 16);
    //this.mLocalFS32.set(fs32Arr.subarray(index, index + 16), 0);
    let i = 0;

    for (let end = index + 16; index < end; index++) {
      this.mLocalFS32[i] = fs32Arr[index];
      ++i;
    }
  }

  copyToF32Arr(fs32Arr, index = 0) {
    fs32Arr.set(this.mLocalFS32, index);
  }

  copy(smat) {
    this.mLocalFS32.set(smat.getLocalFS32(), 0);
    return this;
  }

  copyFrom(smat) {
    this.mLocalFS32.set(smat.getLocalFS32(), 0);
  }

  copyTo(dmat) {
    //dmat.copyFrom(this);
    dmat.getLocalFS32().set(this.getLocalFS32(), 0);
  }

  copyRawDataFrom(float_rawDataArr, rawDataLength = 16, index = 0, bool_tp = false) {
    if (bool_tp) this.transpose();
    rawDataLength = rawDataLength - index;
    let c = 0;

    while (c < rawDataLength) {
      this.mFS32[this.mIndex + c] = float_rawDataArr[c + index];
      ++c;
    }

    if (bool_tp) this.transpose();
  }

  copyRawDataTo(float_rawDataArr, rawDataLength = 16, index = 0, bool_tp = false) {
    if (bool_tp) this.transpose();
    let c = 0;

    while (c < rawDataLength) {
      float_rawDataArr[c + index] = this.mFS32[this.mIndex + c];
      ++c;
    }

    if (bool_tp) this.transpose();
  }

  copyRowFrom(row_index, v3) {
    const fs = this.mLocalFS32;

    switch (row_index) {
      case 0:
        {
          fs[0] = v3.x;
          fs[4] = v3.y;
          fs[8] = v3.z;
          fs[12] = v3.w;
        }
        break;

      case 1:
        {
          fs[1] = v3.x;
          fs[5] = v3.y;
          fs[9] = v3.z;
          fs[13] = v3.w;
        }
        break;

      case 2:
        {
          fs[2] = v3.x;
          fs[6] = v3.y;
          fs[10] = v3.z;
          fs[14] = v3.w;
        }
        break;

      case 3:
        {
          fs[3] = v3.x;
          fs[7] = v3.y;
          fs[11] = v3.z;
          fs[15] = v3.w;
        }
        break;

      default:
        break;
    }
  }

  copyRowTo(row_index, v3) {
    const fs = this.mLocalFS32;
    v3.x = fs[row_index];
    v3.y = fs[4 + row_index];
    v3.z = fs[8 + row_index];
    v3.w = fs[12 + row_index];
  }
  /**
   * @param orientationStyle the value example: OrientationType.EULER_ANGLES
   * @returns [position, rotation, scale]
   */


  decompose(orientationStyle = OrientationType_1.default.EULER_ANGLES) {
    // TODO: optimize after 4 lines
    let vec = [];
    let mr = Matrix4.sTMat4;
    let rfs = mr.getLocalFS32(); //let mrfsI = mr.getFSIndex();
    //std::memcpy(&mr, m_rawData, m_rawDataSize);

    mr.copyFrom(this); ///*

    let pos = new Vector3_1.default(rfs[12], rfs[13], rfs[14]);
    let scale = new Vector3_1.default();
    scale.x = Math.sqrt(rfs[0] * rfs[0] + rfs[1] * rfs[1] + rfs[2] * rfs[2]);
    scale.y = Math.sqrt(rfs[4] * rfs[4] + rfs[5] * rfs[5] + rfs[6] * rfs[6]);
    scale.z = Math.sqrt(rfs[8] * rfs[8] + rfs[9] * rfs[9] + rfs[10] * rfs[10]);
    if (rfs[0] * (rfs[5] * rfs[10] - rfs[6] * rfs[9]) - rfs[1] * (rfs[4] * rfs[10] - rfs[6] * rfs[8]) + rfs[2] * (rfs[4] * rfs[9] - rfs[5] * rfs[8]) < 0) scale.z = -scale.z;
    rfs[0] /= scale.x;
    rfs[1] /= scale.x;
    rfs[2] /= scale.x;
    rfs[4] /= scale.y;
    rfs[5] /= scale.y;
    rfs[6] /= scale.y;
    rfs[8] /= scale.z;
    rfs[9] /= scale.z;
    rfs[10] /= scale.z;
    let rot = new Vector3_1.default();

    switch (orientationStyle) {
      case OrientationType_1.default.AXIS_ANGLE:
        {
          rot.w = MathConst_1.default.SafeACos((rfs[0] + rfs[5] + rfs[10] - 1) / 2);
          let len = Math.sqrt((rfs[6] - rfs[9]) * (rfs[6] - rfs[9]) + (rfs[8] - rfs[2]) * (rfs[8] - rfs[2]) + (rfs[1] - rfs[4]) * (rfs[1] - rfs[4]));

          if (len > MathConst_1.default.MATH_MIN_POSITIVE) {
            rot.x = (rfs[6] - rfs[9]) / len;
            rot.y = (rfs[8] - rfs[2]) / len;
            rot.z = (rfs[1] - rfs[4]) / len;
          } else rot.x = rot.y = rot.z = 0;
        }
        break;

      case OrientationType_1.default.QUATERNION:
        {
          let tr = rfs[0] + rfs[5] + rfs[10];

          if (tr > 0) {
            rot.w = Math.sqrt(1 + tr) / 2;
            rot.x = (rfs[6] - rfs[9]) / (4 * rot.w);
            rot.y = (rfs[8] - rfs[2]) / (4 * rot.w);
            rot.z = (rfs[1] - rfs[4]) / (4 * rot.w);
          } else if (rfs[0] > rfs[5] && rfs[0] > rfs[10]) {
            rot.x = Math.sqrt(1 + rfs[0] - rfs[5] - rfs[10]) / 2;
            rot.w = (rfs[6] - rfs[9]) / (4 * rot.x);
            rot.y = (rfs[1] + rfs[4]) / (4 * rot.x);
            rot.z = (rfs[8] + rfs[2]) / (4 * rot.x);
          } else if (rfs[5] > rfs[10]) {
            rot.y = Math.sqrt(1 + rfs[5] - rfs[0] - rfs[10]) / 2;
            rot.x = (rfs[1] + rfs[4]) / (4 * rot.y);
            rot.w = (rfs[8] - rfs[2]) / (4 * rot.y);
            rot.z = (rfs[6] + rfs[9]) / (4 * rot.y);
          } else {
            rot.z = Math.sqrt(1 + rfs[10] - rfs[0] - rfs[5]) / 2;
            rot.x = (rfs[8] + rfs[2]) / (4 * rot.z);
            rot.y = (rfs[6] + rfs[9]) / (4 * rot.z);
            rot.w = (rfs[1] - rfs[4]) / (4 * rot.z);
          }
        }
        break;

      case OrientationType_1.default.EULER_ANGLES:
        {
          rot.y = Math.asin(-rfs[2]);

          if (rfs[2] != 1 && rfs[2] != -1) {
            rot.x = Math.atan2(rfs[6], rfs[10]);
            rot.z = Math.atan2(rfs[1], rfs[0]);
          } else {
            rot.z = 0;
            rot.x = Math.atan2(rfs[4], rfs[5]);
          }
        }
        break;

      default:
        break;
    }

    ;
    vec.push(pos);
    vec.push(rot);
    vec.push(scale);
    mr = null;
    return vec;
  }

  invert() {
    let d = this.determinant();
    let invertable = Math.abs(d) > MathConst_1.default.MATH_MIN_POSITIVE;

    if (invertable) {
      let fs = this.mLocalFS32;
      d = 1.0 / d;
      let m11 = fs[0];
      let m21 = fs[4];
      let m31 = fs[8];
      let m41 = fs[12];
      let m12 = fs[1];
      let m22 = fs[5];
      let m32 = fs[9];
      let m42 = fs[13];
      let m13 = fs[2];
      let m23 = fs[6];
      let m33 = fs[10];
      let m43 = fs[14];
      let m14 = fs[3];
      let m24 = fs[7];
      let m34 = fs[11];
      let m44 = fs[15];
      fs[0] = d * (m22 * (m33 * m44 - m43 * m34) - m32 * (m23 * m44 - m43 * m24) + m42 * (m23 * m34 - m33 * m24));
      fs[1] = -d * (m12 * (m33 * m44 - m43 * m34) - m32 * (m13 * m44 - m43 * m14) + m42 * (m13 * m34 - m33 * m14));
      fs[2] = d * (m12 * (m23 * m44 - m43 * m24) - m22 * (m13 * m44 - m43 * m14) + m42 * (m13 * m24 - m23 * m14));
      fs[3] = -d * (m12 * (m23 * m34 - m33 * m24) - m22 * (m13 * m34 - m33 * m14) + m32 * (m13 * m24 - m23 * m14));
      fs[4] = -d * (m21 * (m33 * m44 - m43 * m34) - m31 * (m23 * m44 - m43 * m24) + m41 * (m23 * m34 - m33 * m24));
      fs[5] = d * (m11 * (m33 * m44 - m43 * m34) - m31 * (m13 * m44 - m43 * m14) + m41 * (m13 * m34 - m33 * m14));
      fs[6] = -d * (m11 * (m23 * m44 - m43 * m24) - m21 * (m13 * m44 - m43 * m14) + m41 * (m13 * m24 - m23 * m14));
      fs[7] = d * (m11 * (m23 * m34 - m33 * m24) - m21 * (m13 * m34 - m33 * m14) + m31 * (m13 * m24 - m23 * m14));
      fs[8] = d * (m21 * (m32 * m44 - m42 * m34) - m31 * (m22 * m44 - m42 * m24) + m41 * (m22 * m34 - m32 * m24));
      fs[9] = -d * (m11 * (m32 * m44 - m42 * m34) - m31 * (m12 * m44 - m42 * m14) + m41 * (m12 * m34 - m32 * m14));
      fs[10] = d * (m11 * (m22 * m44 - m42 * m24) - m21 * (m12 * m44 - m42 * m14) + m41 * (m12 * m24 - m22 * m14));
      fs[11] = -d * (m11 * (m22 * m34 - m32 * m24) - m21 * (m12 * m34 - m32 * m14) + m31 * (m12 * m24 - m22 * m14));
      fs[12] = -d * (m21 * (m32 * m43 - m42 * m33) - m31 * (m22 * m43 - m42 * m23) + m41 * (m22 * m33 - m32 * m23));
      fs[13] = d * (m11 * (m32 * m43 - m42 * m33) - m31 * (m12 * m43 - m42 * m13) + m41 * (m12 * m33 - m32 * m13));
      fs[14] = -d * (m11 * (m22 * m43 - m42 * m23) - m21 * (m12 * m43 - m42 * m13) + m41 * (m12 * m23 - m22 * m13));
      fs[15] = d * (m11 * (m22 * m33 - m32 * m23) - m21 * (m12 * m33 - m32 * m13) + m31 * (m12 * m23 - m22 * m13));
    }

    ;
    return invertable;
  }

  invertThis() {
    this.invert();
    return this;
  }

  pointAt(pos, at, up) {
    //TODO: need optimize
    if (at == null) at = new Vector3_1.default(0.0, 0.0, -1.0);
    if (up == null) up = new Vector3_1.default(0.0, -1.0, 0.0);
    let dir = at.subtract(pos);
    let vup = up.clone(); //Vector3 right;

    dir.normalize();
    vup.normalize();
    let dir2 = dir.clone().scaleBy(vup.dot(dir));
    vup.subtractBy(dir2);
    if (vup.getLength() > MathConst_1.default.MATH_MIN_POSITIVE) vup.normalize();else if (dir.x != 0) vup.setXYZ(-dir.y, dir.x, 0);else vup.setXYZ(1, 0, 0);
    let right = vup.crossProduct(dir);
    right.normalize();
    let fs = this.mLocalFS32;
    fs[0] = right.x;
    fs[4] = right.y;
    fs[8] = right.z;
    fs[12] = 0.0;
    fs[1] = vup.x;
    fs[5] = vup.y;
    fs[9] = vup.z;
    fs[13] = 0.0;
    fs[2] = dir.x;
    fs[6] = dir.y;
    fs[10] = dir.z;
    fs[14] = 0.0;
    fs[3] = pos.x;
    fs[7] = pos.y;
    fs[11] = pos.z;
    fs[15] = 1.0;
  }

  prepend(rhs) {
    let rfs32 = rhs.getLocalFS32();
    let fs = this.mLocalFS32;
    let m111 = rfs32[0];
    let m121 = rfs32[4];
    let m131 = rfs32[8];
    let m141 = rfs32[12];
    let m112 = rfs32[1];
    let m122 = rfs32[5];
    let m132 = rfs32[9];
    let m142 = rfs32[13];
    let m113 = rfs32[2];
    let m123 = rfs32[6];
    let m133 = rfs32[10];
    let m143 = rfs32[14];
    let m114 = rfs32[3];
    let m124 = rfs32[7];
    let m134 = rfs32[11];
    let m144 = rfs32[15];
    let m211 = fs[0];
    let m221 = fs[4];
    let m231 = fs[8];
    let m241 = fs[12];
    let m212 = fs[1];
    let m222 = fs[5];
    let m232 = fs[9];
    let m242 = fs[13];
    let m213 = fs[2];
    let m223 = fs[6];
    let m233 = fs[10];
    let m243 = fs[14];
    let m214 = fs[3];
    let m224 = fs[7];
    let m234 = fs[11];
    let m244 = fs[15];
    fs[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
    fs[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
    fs[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
    fs[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
    fs[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
    fs[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
    fs[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
    fs[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
    fs[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
    fs[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
    fs[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
    fs[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
    fs[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
    fs[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
    fs[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
    fs[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
  }

  prepend3x3(rhs) {
    let rfs32 = rhs.getLocalFS32();
    let fs = this.mLocalFS32;
    let m111 = rfs32[0];
    let m121 = rfs32[4];
    let m131 = rfs32[8];
    let m112 = rfs32[1];
    let m122 = rfs32[5];
    let m132 = rfs32[9];
    let m113 = rfs32[2];
    let m123 = rfs32[6];
    let m133 = rfs32[10];
    let m211 = fs[0];
    let m221 = fs[4];
    let m231 = fs[8];
    let m212 = fs[1];
    let m222 = fs[5];
    let m232 = fs[9];
    let m213 = fs[2];
    let m223 = fs[6];
    let m233 = fs[10];
    fs[0] = m111 * m211 + m112 * m221 + m113 * m231;
    fs[1] = m111 * m212 + m112 * m222 + m113 * m232;
    fs[2] = m111 * m213 + m112 * m223 + m113 * m233;
    fs[4] = m121 * m211 + m122 * m221 + m123 * m231;
    fs[5] = m121 * m212 + m122 * m222 + m123 * m232;
    fs[6] = m121 * m213 + m122 * m223 + m123 * m233;
    fs[8] = m131 * m211 + m132 * m221 + m133 * m231;
    fs[9] = m131 * m212 + m132 * m222 + m133 * m232;
    fs[10] = m131 * m213 + m132 * m223 + m133 * m233;
  }

  prependRotationPivot(radian, axis, pivotPoint) {
    Matrix4.sTMat4.identity();
    Matrix4.sTMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
    Matrix4.sTMat4.appendTranslationXYZ(pivotPoint.x, pivotPoint.y, pivotPoint.z);
    this.prepend(Matrix4.sTMat4);
  }

  prependRotation(radian, axis) {
    Matrix4.sTMat4.identity();
    Matrix4.sTMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
    this.prepend(Matrix4.sTMat4);
  }

  prependRotationX(radian) {
    //s_tempMat.identity();
    Matrix4.sTMat4.rotationX(radian);
    this.prepend3x3(Matrix4.sTMat4);
  }

  prependRotationY(radian) {
    //s_tempMat.identity();
    Matrix4.sTMat4.rotationY(radian);
    this.prepend3x3(Matrix4.sTMat4);
  }

  prependRotationZ(radian) {
    //s_tempMat.identity();
    Matrix4.sTMat4.rotationZ(radian);
    this.prepend3x3(Matrix4.sTMat4);
  } // 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)


  prependRotationEulerAngle(radianX, radianY, radianZ) {
    //s_tempMat.identity();
    Matrix4.sTMat4.rotationY(radianY);
    this.prepend3x3(Matrix4.sTMat4); //s_tempMat.identity();

    Matrix4.sTMat4.rotationX(radianX);
    this.prepend3x3(Matrix4.sTMat4); //s_tempMat.identity();

    Matrix4.sTMat4.rotationZ(radianZ);
    this.prepend3x3(Matrix4.sTMat4);
  }

  prependScale(xScale, yScale, zScale) {
    const fs = this.mLocalFS32;
    fs[0] *= xScale;
    fs[1] *= yScale;
    fs[2] *= zScale;
    fs[4] *= xScale;
    fs[5] *= yScale;
    fs[6] *= zScale;
    fs[8] *= xScale;
    fs[9] *= yScale;
    fs[10] *= zScale;
    fs[12] *= xScale;
    fs[13] *= yScale;
    fs[14] *= zScale;
  }

  prependScaleXY(xScale, yScale) {
    const fs = this.mLocalFS32;
    fs[0] *= xScale;
    fs[1] *= yScale;
    fs[4] *= xScale;
    fs[5] *= yScale;
    fs[8] *= xScale;
    fs[9] *= yScale;
    fs[12] *= xScale;
    fs[13] *= yScale;
  }

  prependTranslationXYZ(px, py, pz) {
    Matrix4.sTMat4.identity(); //Matrix4.sTMat4.setPositionXYZ(px, py, pz);

    this.prepend(Matrix4.sTMat4);
  }

  prependTranslation(v3) {
    Matrix4.sTMat4.identity(); //Matrix4.sTMat4.setPositionXYZ(v3.x, v3.y, v3.z);

    this.prepend(Matrix4.sTMat4);
  }

  recompose(components, orientationStyle) {
    if (components.length < 3 || components[2].x == 0 || components[2].y == 0 || components[2].z == 0) return false;
    this.identity();
    let scale = Matrix4.sTMat4.getFS32();
    scale[0] = scale[1] = scale[2] = components[2].x;
    scale[4] = scale[5] = scale[6] = components[2].y;
    scale[8] = scale[9] = scale[10] = components[2].z;
    let fs = this.mLocalFS32;

    switch (orientationStyle) {
      case OrientationType_1.default.EULER_ANGLES:
        {
          let cx = Math.cos(components[1].x);
          let cy = Math.cos(components[1].y);
          let cz = Math.cos(components[1].z);
          let sx = Math.sin(components[1].x);
          let sy = Math.sin(components[1].y);
          let sz = Math.sin(components[1].z);
          fs[0] = cy * cz * scale[0];
          fs[1] = cy * sz * scale[1];
          fs[2] = -sy * scale[2];
          fs[3] = 0;
          fs[4] = (sx * sy * cz - cx * sz) * scale[4];
          fs[5] = (sx * sy * sz + cx * cz) * scale[5];
          fs[6] = sx * cy * scale[6];
          fs[7] = 0;
          fs[8] = (cx * sy * cz + sx * sz) * scale[8];
          fs[9] = (cx * sy * sz - sx * cz) * scale[9];
          fs[10] = cx * cy * scale[10];
          fs[11] = 0;
          fs[12] = components[0].x;
          fs[13] = components[0].y;
          fs[14] = components[0].z;
          fs[15] = 1;
        }
        break;

      default:
        {
          let x = components[1].x;
          let y = components[1].y;
          let z = components[1].z;
          let w = components[1].w;

          if (orientationStyle == OrientationType_1.default.AXIS_ANGLE) {
            let halfW = 0.5 * w;
            x *= Math.sin(halfW);
            y *= Math.sin(halfW);
            z *= Math.sin(halfW);
            w = Math.cos(halfW);
          }

          ;
          fs[0] = (1 - 2 * y * y - 2 * z * z) * scale[0];
          fs[1] = (2 * x * y + 2 * w * z) * scale[1];
          fs[2] = (2 * x * z - 2 * w * y) * scale[2];
          fs[3] = 0;
          fs[4] = (2 * x * y - 2 * w * z) * scale[4];
          fs[5] = (1 - 2 * x * x - 2 * z * z) * scale[5];
          fs[6] = (2 * y * z + 2 * w * x) * scale[6];
          fs[7] = 0;
          fs[8] = (2 * x * z + 2 * w * y) * scale[8];
          fs[9] = (2 * y * z - 2 * w * x) * scale[9];
          fs[10] = (1 - 2 * x * x - 2 * y * y) * scale[10];
          fs[11] = 0;
          fs[12] = components[0].x;
          fs[13] = components[0].y;
          fs[14] = components[0].z;
          fs[15] = 1;
        }
        break;
    }

    ; //TODO: need thinking

    if (components[2].x == 0) this.mLocalFS32[0] = 0; // 1e-15;

    if (components[2].y == 0) this.mLocalFS32[5] = 0; // 1e-15;

    if (components[2].z == 0) this.mLocalFS32[10] = 0; // 1e-15;

    scale = null;
    return true;
  }

  setThreeAxes(x_axis, y_axis, z_axis) {
    let vs = this.mLocalFS32;
    vs[0] = x_axis.x;
    vs[1] = x_axis.y;
    vs[2] = x_axis.z;
    vs[4] = y_axis.x;
    vs[5] = y_axis.y;
    vs[6] = y_axis.z;
    vs[8] = z_axis.x;
    vs[9] = z_axis.y;
    vs[10] = z_axis.z;
  }

  deltaTransformVector(v3) {
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    return new Vector3_1.default(x * this.mLocalFS32[0] + y * this.mLocalFS32[4] + z * this.mLocalFS32[8], x * this.mLocalFS32[1] + y * this.mLocalFS32[5] + z * this.mLocalFS32[9], x * this.mLocalFS32[2] + y * this.mLocalFS32[6] + z * this.mLocalFS32[10], 0.0);
  }

  deltaTransformVectorSelf(v3) {
    let fs = this.mLocalFS32;
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    v3.x = x * fs[0] + y * fs[4] + z * fs[8];
    v3.y = x * fs[1] + y * fs[5] + z * fs[9];
    v3.z = x * fs[2] + y * fs[6] + z * fs[10];
  }

  deltaTransformOutVector(v3, out_v3) {
    let fs = this.mLocalFS32;
    out_v3.x = v3.x * fs[0] + v3.y * fs[4] + v3.z * fs[8];
    out_v3.y = v3.x * fs[1] + v3.y * fs[5] + v3.z * fs[9];
    out_v3.z = v3.x * fs[2] + v3.y * fs[6] + v3.z * fs[10];
  }

  transformVector(v3) {
    let fs = this.mLocalFS32;
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    return new Vector3_1.default(x * fs[0] + y * fs[4] + z * fs[8] + fs[12], x * fs[1] + y * fs[5] + z * fs[9] + fs[13], x * fs[2] + y * fs[6] + z * fs[10] + fs[14], x * fs[3] + y * fs[7] + z * fs[11] + fs[15]);
  }

  transformOutVector(v3, out_v3) {
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    let fs = this.mLocalFS32;
    out_v3.setXYZW(x * fs[0] + y * fs[4] + z * fs[8] + fs[12], x * fs[1] + y * fs[5] + z * fs[9] + fs[13], x * fs[2] + y * fs[6] + z * fs[10] + fs[14], x * fs[3] + y * fs[7] + z * fs[11] + fs[15]);
  }

  transformOutVector3(v3, out_v3) {
    let fs = this.mLocalFS32;
    out_v3.x = v3.x * fs[0] + v3.y * fs[4] + v3.z * fs[8] + fs[12];
    out_v3.y = v3.x * fs[1] + v3.y * fs[5] + v3.z * fs[9] + fs[13];
    out_v3.z = v3.x * fs[2] + v3.y * fs[6] + v3.z * fs[10] + fs[14];
  }

  transformVector3Self(v3) {
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    let fs = this.mLocalFS32;
    v3.x = x * fs[0] + y * fs[4] + z * fs[8] + fs[12];
    v3.y = x * fs[1] + y * fs[5] + z * fs[9] + fs[13];
    v3.z = x * fs[2] + y * fs[6] + z * fs[10] + fs[14];
  }

  transformVectorSelf(v3) {
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    let fs = this.mLocalFS32;
    v3.setXYZW(x * fs[0] + y * fs[4] + z * fs[8] + fs[12], x * fs[1] + y * fs[5] + z * fs[9] + fs[13], x * fs[2] + y * fs[6] + z * fs[10] + fs[14], x * fs[3] + y * fs[7] + z * fs[11] + fs[15]);
  }

  transformVectors(float_vinArr, vinLength, float_voutArr) {
    let i = 0;
    let x, y, z;
    let pfs = this.mLocalFS32;
    vinLength -= 3;

    while (i <= vinLength) {
      x = float_vinArr[i];
      y = float_vinArr[i + 1];
      z = float_vinArr[i + 2];
      float_voutArr[i] = x * pfs[0] + y * pfs[4] + z * pfs[8] + pfs[12];
      float_voutArr[i + 1] = x * pfs[1] + y * pfs[5] + z * pfs[9] + pfs[13];
      float_voutArr[i + 2] = x * pfs[2] + y * pfs[6] + z * pfs[10] + pfs[14];
      i += 3;
    }
  }

  transformVectorsSelf(float_vinArr, vinLength) {
    let i = 0;
    let x, y, z;
    let pfs = this.mLocalFS32;
    vinLength -= 3;

    while (i <= vinLength) {
      x = float_vinArr[i];
      y = float_vinArr[i + 1];
      z = float_vinArr[i + 2];
      float_vinArr[i] = x * pfs[0] + y * pfs[4] + z * pfs[8] + pfs[12];
      float_vinArr[i + 1] = x * pfs[1] + y * pfs[5] + z * pfs[9] + pfs[13];
      float_vinArr[i + 2] = x * pfs[2] + y * pfs[6] + z * pfs[10] + pfs[14];
      i += 3;
    }
  }

  transformVectorsRangeSelf(float_vinArr, begin, end) {
    let i = begin;
    let x, y, z;
    let pfs = this.mLocalFS32;
    end -= 3;

    while (i <= end) {
      x = float_vinArr[i];
      y = float_vinArr[i + 1];
      z = float_vinArr[i + 2];
      float_vinArr[i] = x * pfs[0] + y * pfs[4] + z * pfs[8] + pfs[12];
      float_vinArr[i + 1] = x * pfs[1] + y * pfs[5] + z * pfs[9] + pfs[13];
      float_vinArr[i + 2] = x * pfs[2] + y * pfs[6] + z * pfs[10] + pfs[14];
      i += 3;
    }
  }

  transpose() {
    Matrix4.sTMat4.copyFrom(this);
    let fs32 = Matrix4.sTMat4.getFS32();
    let fs = this.mLocalFS32;
    fs[1] = fs32[4];
    fs[2] = fs32[8];
    fs[3] = fs32[12];
    fs[4] = fs32[1];
    fs[6] = fs32[9];
    fs[7] = fs32[13];
    fs[8] = fs32[2];
    fs[9] = fs32[6];
    fs[11] = fs32[14];
    fs[12] = fs32[3];
    fs[13] = fs32[7];
    fs[14] = fs32[11];
  }

  interpolateTo(toMat, float_percent) {
    let fs32 = toMat.getFS32();
    let fsI = toMat.getFSIndex();
    let _g = 0;
    let i = this.mIndex;

    while (_g < 16) {
      this.mFS32[i] += (fs32[fsI + _g] - this.mFS32[i]) * float_percent;
      ++i;
      ++_g;
    }
  }

  getAxisRotation(x, y, z, radian) {
    radian = -radian;
    let fs = this.mLocalFS32;
    let s = Math.sin(radian),
        c = Math.cos(radian);
    let t = 1.0 - c;
    fs[0] = c + x * x * t;
    fs[5] = c + y * y * t;
    fs[10] = c + z * z * t;
    let tmp1 = x * y * t;
    let tmp2 = z * s;
    fs[4] = tmp1 + tmp2;
    fs[1] = tmp1 - tmp2;
    tmp1 = x * z * t;
    tmp2 = y * s;
    fs[8] = tmp1 - tmp2;
    fs[2] = tmp1 + tmp2;
    tmp1 = y * z * t;
    tmp2 = x * s;
    fs[9] = tmp1 + tmp2;
    fs[6] = tmp1 - tmp2;
  }

  rotationX(radian) {
    let s = Math.sin(radian),
        c = Math.cos(radian);
    this.mLocalFS32[0] = 1.0;
    this.mLocalFS32[1] = 0.0;
    this.mLocalFS32[2] = 0.0;
    this.mLocalFS32[4] = 0.0;
    this.mLocalFS32[5] = c;
    this.mLocalFS32[6] = s;
    this.mLocalFS32[8] = 0.0;
    this.mLocalFS32[9] = -s;
    this.mLocalFS32[10] = c;
  }

  rotationY(radian) {
    let s = Math.sin(radian),
        c = Math.cos(radian);
    this.mLocalFS32[0] = c;
    this.mLocalFS32[1] = 0.0;
    this.mLocalFS32[2] = -s;
    this.mLocalFS32[4] = 0.0;
    this.mLocalFS32[5] = 1.0;
    this.mLocalFS32[6] = 0.0;
    this.mLocalFS32[8] = s;
    this.mLocalFS32[9] = 0.0;
    this.mLocalFS32[10] = c;
  }

  rotationZ(radian) {
    let s = Math.sin(radian),
        c = Math.cos(radian);
    this.mLocalFS32[0] = c;
    this.mLocalFS32[1] = s;
    this.mLocalFS32[2] = 0.0;
    this.mLocalFS32[4] = -s;
    this.mLocalFS32[5] = c;
    this.mLocalFS32[6] = 0.0;
    this.mLocalFS32[8] = 0.0;
    this.mLocalFS32[9] = 0.0;
    this.mLocalFS32[10] = 1.0;
  } /////////////////////////////////////////////////////////////


  toString() {
    let str = "\n" + this.mLocalFS32[0] + "," + this.mLocalFS32[1] + "," + this.mLocalFS32[2] + "," + this.mLocalFS32[3] + "\n";
    str += this.mLocalFS32[4] + "," + this.mLocalFS32[5] + "," + this.mLocalFS32[6] + "," + this.mLocalFS32[7] + "\n";
    str += this.mLocalFS32[8] + "," + this.mLocalFS32[9] + "," + this.mLocalFS32[10] + "," + this.mLocalFS32[11] + "\n";
    str += this.mLocalFS32[12] + "," + this.mLocalFS32[13] + "," + this.mLocalFS32[14] + "," + this.mLocalFS32[15] + "\n";
    return str;
  }

  transformPerspV4Self(v4) {
    const fs = this.mLocalFS32;
    v4.w = v4.z;
    v4.x *= fs[0];
    v4.y *= fs[5];
    v4.z *= fs[10];
    v4.z += fs[14];
    v4.w *= fs[11];
    v4.w += fs[15];
  }

  clone() {
    let m = new Matrix4();
    m.copyFrom(this);
    return m;
  } ///////
  // view etc..
  ///////////////////////////////////////////


  perspectiveRH(fovy, aspect, zNear, zFar, zfactor = 1.0) {
    //assert(abs(aspect - std::numeric_limits<float>::epsilon()) > minFloatValue)
    const fs = this.mLocalFS32;
    let tanHalfFovy = Math.tan(fovy * 0.5);
    this.identity();
    fs[0] = 1.0 / (aspect * tanHalfFovy);
    fs[5] = 1.0 / tanHalfFovy;
    fs[10] = -zfactor * (zFar + zNear) / (zFar - zNear);
    fs[11] = -1.0;
    fs[14] = -zfactor * (2.0 * zFar * zNear) / (zFar - zNear);
  }

  perspectiveRH2(fovy, pw, ph, zNear, zFar) {
    let focalLength = pw / Math.tan(fovy * 0.5);
    let m0 = focalLength / pw;
    let m5 = focalLength / ph;
    let m10 = -zFar / (zFar - zNear);
    let m14 = -zNear * m10;
    this.identity();
    const fs = this.mLocalFS32;
    fs[0] = m0;
    fs[5] = m5;
    fs[10] = m10;
    fs[11] = -1.0;
    fs[14] = m14;
  }

  orthoRH(b, t, l, r, zNear, zFar, zfactor = 1.0) {
    this.identity();
    const fs = this.mLocalFS32;
    fs[0] = 2.0 / (r - l);
    fs[5] = 2.0 / (t - b);
    fs[10] = -zfactor * 2.0 / (zFar - zNear);
    fs[12] = -(r + l) / (r - l);
    fs[13] = -(t + b) / (t - b);
    fs[14] = -zfactor * (zFar + zNear) / (zFar - zNear);
    fs[15] = 1.0;
  }

  perspectiveLH(fovy, aspect, zNear, zFar, zfactor = 1.0) {
    //assert(abs(aspect - std::numeric_limits<float>::epsilon()) > minFloatValue)
    let tanHalfFovy = Math.tan(fovy * 0.5);
    this.identity();
    const fs = this.mLocalFS32;
    fs[0] = 1.0 / (aspect * tanHalfFovy);
    fs[5] = 1.0 / tanHalfFovy;
    fs[10] = zfactor * (zFar + zNear) / (zFar - zNear);
    fs[11] = 1.0;
    fs[14] = zfactor * (2.0 * zFar * zNear) / (zFar - zNear);
  }

  orthoLH(b, t, l, r, zNear, zFar, zfactor = 1.0) {
    this.identity();
    const fs = this.mLocalFS32;
    fs[0] = 2.0 / (r - l); // / (aspect * tanHalfFovy);

    fs[5] = 2.0 / (t - b); // / tanHalfFovy;

    fs[10] = zfactor * 2.0 / (zFar - zNear);
    fs[12] = -(r + l) / (r - l);
    fs[13] = -(t + b) / (t - b);
    fs[14] = -zfactor * (zFar + zNear) / (zFar - zNear);
    fs[15] = 1.0;
  }

  lookAtRH(eyePos, atPos, up) {
    this.identity();
    let f = atPos.subtract(eyePos);
    f.normalize();
    let s = f.crossProduct(up);
    s.normalize();
    let u = s.crossProduct(f);
    s.w = -s.dot(eyePos);
    u.w = -u.dot(eyePos);
    f.w = f.dot(eyePos);
    f.negate();
    this.copyRowFrom(0, s);
    this.copyRowFrom(1, u);
    this.copyRowFrom(2, f);
  }

  lookAtLH(eyePos, atPos, up) {
    this.identity();
    let f = atPos.subtract(eyePos);
    f.normalize();
    let s = f.crossProduct(up);
    s.normalize();
    let u = s.crossProduct(f);
    s.w = -s.dot(eyePos);
    u.w = -u.dot(eyePos);
    f.w = -f.dot(eyePos);
    this.copyRowFrom(0, s);
    this.copyRowFrom(1, u);
    this.copyRowFrom(2, f);
  }

  destroy() {
    this.mLocalFS32 = null;
    this.mFS32 = null;
    this.mIndex = -1;
  }

}

Matrix4.sV3 = new Vector3_1.default();
Matrix4.sUid = 0;
Matrix4.sIsolatedUid = 0x4ffff;
Matrix4.sTMat4 = new Matrix4();
exports.default = Matrix4;

/***/ }),

/***/ "c812":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class GPURenderPipelineEmpty {
  getBindGroupLayout(index) {
    throw Error("illegal operations !!!");
    return {};
  }

}

exports.GPURenderPipelineEmpty = GPURenderPipelineEmpty;

/***/ }),

/***/ "cae9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const Camera_1 = __importDefault(__webpack_require__("68f4"));

const WebGPUContext_1 = __webpack_require__("6b10");

const WGRObjBuilder_1 = __webpack_require__("63d8");

const WGRenderPassBlock_1 = __webpack_require__("ddc9");

exports.WGRPipelineContextDefParam = WGRenderPassBlock_1.WGRPipelineContextDefParam;

const WGEntityNodeMana_1 = __webpack_require__("6130");

const WGRendererParam_1 = __webpack_require__("f5fb");

exports.WGRendererConfig = WGRendererParam_1.WGRendererConfig;

const WGRenderUnitBlock_1 = __webpack_require__("d5c3");

class WGRenderer {
  constructor(config) {
    this.___$$$$$$$Author = "VilyLei(vily313@126.com)";
    this.mUid = WGRenderer.sUid++;
    this.mInit = true;
    this.mRPBlocks = [];
    this.mROBuilder = new WGRObjBuilder_1.WGRObjBuilder();
    this.mEntityMana = new WGEntityNodeMana_1.WGEntityNodeMana();
    this.enabled = true;

    if (config) {
      this.initialize(config);
    }
  }

  initCamera(width, height) {
    let p = this.mConfig.camera;
    if (!p) p = {};

    if (!(p.enabled === false)) {
      let selfT = this;
      selfT.camera = new Camera_1.default();
      p.viewWidth = width;
      p.viewHeight = height;
      this.camera.initialize(p);
    }
  }

  get uid() {
    return 0;
  }

  getWGCtx() {
    return this.mWGCtx;
  }

  getStage3D() {
    return this.stage;
  }

  getCamera() {
    return this.camera;
  }

  getDiv() {
    return this.mDiv;
  }

  getCanvas() {
    return this.mWGCtx.canvas;
  }

  initialize(config) {
    if (this.mInit && !this.mWGCtx) {
      this.mInit = false;
      let wgctx = config ? config.ctx : null;

      if (wgctx) {
        // console.log("WGRenderer::initialize(), a 01");
        this.mDiv = config.div;
        this.mWGCtx = wgctx;
        const canvas = wgctx.canvas;
        this.mROBuilder.wgctx = wgctx;
        this.initCamera(canvas.width, canvas.height);
      } else {
        config = WGRendererParam_1.checkConfig(config);
        this.mDiv = config.div;
        wgctx = new WebGPUContext_1.WebGPUContext();
        wgctx.initialize(config.canvas, config.gpuCanvasCfg).then(() => {
          this.init();

          if (config && config.callback) {
            config.callback("renderer-init");
          }

          this.mROBuilder.wgctx = wgctx;
          const mana = this.mEntityMana;
          mana.wgctx = wgctx;
          mana.roBuilder = this.mROBuilder; // mana.callback = this.receiveNode;

          this.mEntityMana.updateToTarget();
        });
        this.mWGCtx = wgctx;
      }

      this.mConfig = config;
    }
  }

  intDefaultBlock() {
    if (this.mRPBlocks.length < 1) {
      let param = this.mConfig.rpassparam;

      if (!param) {
        param = {
          sampleCount: 4,
          multisampleEnabled: true,
          depthFormat: "depth24plus"
        };
      }

      this.createRenderBlock(param);
    }
  }

  init() {
    const ctx = this.mWGCtx;
    const canvas = this.mWGCtx.canvas;
    this.initCamera(canvas.width, canvas.height);
    const bs = this.mRPBlocks;

    for (let i = 0; i < bs.length; ++i) {
      bs[i].initialize(ctx);
    }
  }

  addEntity(entity, blockIndex = 0) {
    // console.log("Renderer::addEntity(), entity.isInRenderer(): ", entity.isInRenderer());
    const bs = this.mRPBlocks;

    if (bs.length < 1) {
      this.initialize();
      this.intDefaultBlock();
    }

    if (blockIndex < 0 || blockIndex >= bs.length) {
      throw Error("Illegal operation !!!");
    }

    const rb = bs[blockIndex];
    rb.addEntity(entity);
  }

  removeEntity(entity) {
    if (entity) {
      if (entity.isInRenderer()) {
        // const et = node.entity;
        const ls = entity.__$bids;

        if (ls) {
          // let bs = WGRenderUnitBlock.getBlockAt();
          let bs = new Array(ls.length);

          for (let i = 0; i < ls.length; ++i) {
            bs[i] = WGRenderUnitBlock_1.WGRenderUnitBlock.getBlockAt(ls[i]);
          }

          entity.__$bids = [];

          for (let i = 0; i < ls.length; ++i) {
            bs[i].removeEntity(entity);
          }
        }

        const st = entity.rstate;
        st.__$rever++;
        st.__$inRenderer = false;
        st.__$rendering = false;
        console.log("Renderer::removeEntity(), entity.isInRenderer(): ", entity.isInRenderer());
      }
    }
  }

  setPassNodeGraph(graph, blockIndex = 0) {
    this.intDefaultBlock();
    const len = this.mRPBlocks.length;

    if (blockIndex >= 0 && blockIndex < len) {
      this.mRPBlocks[blockIndex].setPassNodeGraph(graph);
    } else {
      throw Error("Illegal operations !!!");
    }
  }

  appendRenderPass(param, blockIndex = 0) {
    this.initialize();
    this.intDefaultBlock();
    const len = this.mRPBlocks.length;

    if (blockIndex >= 0 && blockIndex < len) {
      return this.mRPBlocks[blockIndex].appendRendererPass(param);
    }

    throw Error("Illegal operations !!!");
    return {
      index: -1
    };
  }

  createRenderPass(param, blockIndex = 0) {
    return this.appendRenderPass(param, blockIndex);
  }

  getRPBlockAt(i) {
    this.initialize();
    this.intDefaultBlock();
    return this.mRPBlocks[i];
  }

  createRenderBlock(param) {
    let bp = {
      entityMana: this.mEntityMana,
      roBuilder: this.mROBuilder,
      camera: this.camera
    };
    const rb = new WGRenderPassBlock_1.WGRenderPassBlock(this.mUid, bp, this.mWGCtx, param);
    rb.unitBlock = WGRenderUnitBlock_1.WGRenderUnitBlock.createBlock();
    this.mRPBlocks.push(rb);
    return rb;
  }

  isEnabled() {
    return this.enabled && this.mWGCtx && this.mWGCtx.enabled;
  }

  run(rendering = true) {
    if (this.enabled) {
      const ctx = this.mWGCtx;

      if (ctx && ctx.enabled) {
        this.mEntityMana.update();

        if (rendering) {
          const rbs = this.mRPBlocks;

          if (rbs.length > 0) {
            const rb = rbs[0];
            rb.runBegin();
            rb.run();
            rb.runEnd();
            const cmds = rb.rcommands;
            ctx.queue.submit(cmds);
          }
        }
      }
    }
  }

  destroy() {
    const ctx = this.mWGCtx;

    if (ctx && ctx.enabled) {}
  }

}

WGRenderer.sUid = 0;
exports.WGRenderer = WGRenderer;

/***/ }),

/***/ "cbb4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2023 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

Object.defineProperty(exports, "__esModule", {
  value: true
});

class OrientationType {}

OrientationType.AXIS_ANGLE = 0;
OrientationType.QUATERNION = 1;
OrientationType.EULER_ANGLES = 2;
exports.default = OrientationType;

/***/ }),

/***/ "cd49":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 //////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////           WebGPU               /////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

Object.defineProperty(exports, "__esModule", {
  value: true
});

const VertColorTriangle_1 = __webpack_require__("601e"); // import { VertColorCube as Demo } from "./voxgpu/sample/VertColorCube";
// import { VertEntityTest as Demo } from "./voxgpu/sample/VertEntityTest";
// import { DefaultEntityTest as Demo } from "./voxgpu/sample/DefaultEntityTest";
// import { ImgTexturedCube as Demo } from "./voxgpu/sample/ImgTexturedCube";
// import { ImgCubeMap as Demo } from "./voxgpu/sample/ImgCubeMap";
// import { MultiTexturedCube as Demo } from "./voxgpu/sample/MultiTexturedCube";
// import { BlendTest as Demo } from "./voxgpu/sample/BlendTest";
// import { MultiMaterialPass as Demo } from "./voxgpu/sample/MultiMaterialPass";
// import { MultiUniformTest as Demo } from "./voxgpu/sample/MultiUniformTest";
// import { UniformTest as Demo } from "./voxgpu/sample/UniformTest";
// import { StorageTest as Demo } from "./voxgpu/sample/StorageTest";
// import { RSceneTest as Demo } from "./voxgpu/sample/RSceneTest";
// import { SimpleLightTest as Demo } from "./voxgpu/sample/SimpleLightTest";
// import { REntity3DContainerTest as Demo } from "./voxgpu/sample/REntity3DContainerTest";
// import { Entity3DVisibilityTest as Demo } from "./voxgpu/sample/Entity3DVisibilityTest";
// import { RSceneEntityManagement as Demo } from "./voxgpu/sample/RSceneEntityManagement";
// import { SimplePBRTest as Demo } from "./voxgpu/sample/SimplePBRTest";
// import { FixScreenPlaneTest as Demo } from "./voxgpu/sample/FixScreenPlaneTest";
// import { PrimitiveEntityTest as Demo } from "./voxgpu/sample/PrimitiveEntityTest";
// import { ScreenPostEffect as Demo } from "./voxgpu/sample/ScreenPostEffect";
// import { ModelLoadTest as Demo } from "./voxgpu/sample/ModelLoadTest";
// import { DrawInstanceTest as Demo } from "./voxgpu/sample/DrawInstanceTest";
// import { ComputeEntityTest as Demo } from "./voxgpu/sample/ComputeEntityTest";
// import { GameOfLifeTest as Demo } from "./voxgpu/sample/GameOfLifeTest";
// import { ComputeMaterialTest as Demo } from "./voxgpu/sample/ComputeMaterialTest";
// import { GameOfLifeMultiMaterialPass as Demo } from "./voxgpu/sample/GameOfLifeMultiMaterialPass";
// import { GameOfLifePretty as Demo } from "./voxgpu/sample/GameOfLifePretty";
// import { GameOfLifeSphere as Demo } from "./voxgpu/sample/GameOfLifeSphere";
// import { GameOfLifeSpherePBR as Demo } from "./voxgpu/sample/GameOfLifeSpherePBR";
// import { GameOfLife3DPBR as Demo } from "./voxgpu/sample/GameOfLife3DPBR";
// import { MultiGPUPassTest as Demo } from "./voxgpu/sample/MultiGPUPassTest";
// import { RTTFixScreenTest as Demo } from "./voxgpu/sample/RTTFixScreenTest";
// import { RTTTest as Demo } from "./voxgpu/sample/RTTTest";
// import { AddEntityIntoMultiRPasses as Demo } from "./voxgpu/sample/AddEntityIntoMultiRPasses";
// import { PassNodeGraphTest as Demo } from "./voxgpu/sample/PassNodeGraphTest";
// import { ColorAttachmentReplace as Demo } from "./voxgpu/sample/ColorAttachmentReplace";
// import { PingpongBlur as Demo } from "./voxgpu/sample/PingpongBlur";
// import { FloatRTT as Demo } from "./voxgpu/sample/FloatRTT";
// import { MRT as Demo } from "./voxgpu/sample/MRT";
// import { DepthBlur as Demo } from "./voxgpu/sample/DepthBlur";
// import { LineEntityTest as Demo } from "./voxgpu/sample/LineEntityTest";
// import { LineObjectTest as Demo } from "./voxgpu/sample/LineObjectTest";
// import { WireframeEntityTest as Demo } from "./voxgpu/sample/WireframeEntityTest";
// import { EntityCloneTest as Demo } from "./voxgpu/sample/EntityCloneTest";
// import { ModelEntityTest as Demo } from "./voxgpu/sample/ModelEntityTest";
// import { DataDrivenTest as Demo } from "./voxgpu/sample/DataDrivenTest";
// import { DataTextureTest as Demo } from "./voxgpu/sample/DataTextureTest";
// import { FloatTextureTest as Demo } from "./voxgpu/sample/FloatTextureTest";
// import { Set32BitsTexMipmapData as Demo } from "./voxgpu/sample/Set32BitsTexMipmapData";
//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////           unit test               ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////


let demoIns = new VertColorTriangle_1.VertColorTriangle();

function main() {
  console.log("------ demo --- init ------");
  demoIns.initialize();

  function mainLoop(now) {
    demoIns.run();
    window.requestAnimationFrame(mainLoop);
  }

  window.requestAnimationFrame(mainLoop);
  console.log("------ demo --- running ------");
}

main();

/***/ }),

/***/ "d5c3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGREntityNode_1 = __webpack_require__("4145");

const __$RUB = {
  uid: 0,
  blocks: []
};

class WGRenderUnitBlock {
  constructor() {
    this.mUid = __$RUB.uid++;
    this.mUnits = [];
    this.mENodeMap = new Map();
    this.mMaterialMap = new Map();
  }

  static createBlock() {
    const b = new WGRenderUnitBlock();

    __$RUB.blocks.push(b);

    return b;
  }

  static getBlockAt(i) {
    return __$RUB.blocks[i];
  }

  get uid() {
    return this.mUid;
  }

  hasMaterial(material) {
    if (material.uid !== undefined) {
      const map = this.mMaterialMap;

      if (map.has(material.uid)) {
        return true;
      }

      map.set(material.uid, material);
    }

    return false;
  }

  addEntityToBlock(entity, node) {
    entity.update();
    node.rstate.__$rever++;
    const runit = this.rbParam.roBuilder.createRUnit(entity, this.builder, node, this.uid);
    runit.etuuid = entity.uuid + '-[block(' + this.uid + ')]';
    this.addRUnit(runit);
  }

  addEntity(entity) {
    // console.log("Renderer::addEntity(), entity.isInRenderer(): ", entity.isInRenderer());
    if (entity) {
      const map = this.mENodeMap;
      const euid = entity.uid;

      if (!map.has(euid)) {
        let node = new WGREntityNode_1.WGREntityNode();
        node.entity = entity;
        node.entityid = euid;
        node.blockid = this.uid;

        entity.__$bids.push(node.blockid);

        map.set(euid, node);
        entity.rstate.__$inRenderer = true;
        entity.update(); // console.log("and a new entity into the unit bolck, entity: ", entity);
        // console.log("and a new entity into the unit bolck, entity.isInRenderer(): ", entity.isInRenderer());
        // console.log("and a new entity into the unit bolck, this.builder: ", this.builder);

        const wgctx = this.rbParam.roBuilder.wgctx;
        let flag = true;

        if (wgctx && wgctx.enabled) {
          if (entity.isREnabled()) {
            flag = false;
            this.addEntityToBlock(entity, node);
          }
        }

        if (flag) {
          this.rbParam.entityMana.addEntity({
            entity: entity,
            rever: node.rstate.__$rever,
            builder: this.builder,
            node,
            block: this
          });
        }
      } else {
        console.log("has exist the entity in the unit bolck...");
      }
    }
  }

  removeEntity(entity) {
    console.log("WGRenderUnitBlock::removeEntity(), entity.isInRenderer(): ", entity.isInRenderer());

    if (entity) {
      const map = this.mENodeMap;
      const euid = entity.uid;
      console.log("WGRenderUnitBlock::removeEntity(), map.has(euid): ", map.has(euid), ", euid: ", euid);

      if (map.has(euid)) {
        const node = map.get(euid);
        node.rstate.__$rever++;
        map.delete(euid);
        const et = node.entity;
        const ls = et.__$bids;

        if (ls) {
          const bid = this.uid;

          for (let i = 0; i < ls.length; ++i) {
            if (ls[i] == bid) {
              ls.splice(i, 1);
              break;
            }
          }
        }

        node.entity = null;
      }
    }
  }

  addRUnit(unit) {
    /**
     * 正式加入渲染器之前，对shader等的分析已经做好了
     */
    if (unit) {
      this.mUnits.push(unit);
    }
  }

  run() {
    const uts = this.mUnits;
    let utsLen = uts.length;

    for (let i = 0; i < utsLen;) {
      const ru = uts[i];

      if (ru.__$rever == ru.pst.__$rever) {
        if (ru.getRF()) {
          if (ru.passes) {
            const ls = ru.passes; // console.log("apply multi passes total", ls.length);

            for (let i = 0, ln = ls.length; i < ln; ++i) {
              ls[i].runBegin();
              ls[i].run();
            }
          } else {
            // console.log("apply single passes ...");
            ru.runBegin();
            ru.run();
          }
        }

        i++;
      } else {
        ru.destroy();
        uts.splice(i, 1);
        utsLen--;
        console.log("WGRenderUnitBlock::run(), remove a rendering runit.");
      }
    }
  }

  destroy() {
    const uts = this.mUnits;

    if (uts) {
      let utsLen = uts.length;

      for (let i = 0; i < utsLen; ++i) {
        const ru = uts[i];
        ru.destroy();
      }
    }
  }

}

exports.WGRenderUnitBlock = WGRenderUnitBlock;

/***/ }),

/***/ "dc4d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CommonUtils_1 = __webpack_require__("fe0b");

class WGRBufferVisibility {
  constructor() {
    /**
     * A unique identifier for a resource binding within the GPUBindGroupLayout, corresponding to a GPUBindGroupEntry.
     * binding and a @binding attribute in the GPUShaderModule.
     */
    this.binding = 0;
    /**
     * A bitset of the members of GPUShaderStage.
     * Each set bit indicates that a GPUBindGroupLayoutEntry's resource will be accessible from the associated shader stage.
     * GPUShaderStage(GPUShaderStageFlags) values.
     * See: https://gpuweb.github.io/gpuweb/#typedefdef-gpushaderstageflags
     */

    this.visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX;
  }

  toVisibleAll() {
    this.visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE;
    return this;
  }

  toVisibleVertFrag() {
    this.visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX;
    return this;
  }

  toVisibleVert() {
    this.visibility = GPUShaderStage.VERTEX;
    return this;
  }

  toVisibleVertComp() {
    this.visibility = GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE;
    return this;
  }

  toVisibleFragComp() {
    this.visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE;
    return this;
  }

  toVisibleFrag() {
    this.visibility = GPUShaderStage.FRAGMENT;
    return this;
  }

  toVisibleComp() {
    this.visibility = GPUShaderStage.COMPUTE;
    return this;
  }

  toBufferForUniform() {
    this.buffer = {
      type: 'uniform',
      hasDynamicOffset: false,
      minBindingSize: 0
    };
    return this;
  }

  toBufferForStorage() {
    this.buffer = {
      type: 'storage'
    };
    return this;
  }

  toBufferForReadOnlyStorage() {
    this.buffer = {
      type: 'read-only-storage'
    };
    return this;
  }

  toSamplerFiltering() {
    this.sampler = {
      type: 'filtering'
    };
    return this;
  }

  toTextureFloat(viewDimension) {
    viewDimension = viewDimension ? viewDimension : '2d';
    this.texture = {
      sampleType: 'float',
      viewDimension
    };
    return this;
  }

  clone() {
    const v = new WGRBufferVisibility();
    v.label = this.label;
    v.visibility = this.visibility;

    if (this.buffer) {
      v.buffer = {};
      CommonUtils_1.copyFromObjectValueWithKey(this.buffer, v.buffer);
    }

    if (this.sampler) {
      v.sampler = {};
      CommonUtils_1.copyFromObjectValueWithKey(this.sampler, v.sampler);
    }

    if (this.texture) {
      v.texture = {};
      CommonUtils_1.copyFromObjectValueWithKey(this.texture, v.texture);
    }

    return v;
  }

}

exports.WGRBufferVisibility = WGRBufferVisibility;

/***/ }),

/***/ "ddc9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGRendererPass_1 = __webpack_require__("0142");

exports.WGRPassParam = WGRendererPass_1.WGRPassParam;

const WGRPipelineCtxParams_1 = __webpack_require__("bf93");

exports.WGRPipelineContextDefParam = WGRPipelineCtxParams_1.WGRPipelineContextDefParam;

const WGRPassWrapper_1 = __webpack_require__("2258");

const WGRenderPassNode_1 = __webpack_require__("7751");

const WGRenderUnitBlock_1 = __webpack_require__("d5c3");

class WGRenderPassBlock {
  constructor(rendererUid, bp, wgCtx, param) {
    this.mRendererUid = 0;
    this.mCompPassNodes = [];
    this.mRPassNodes = [];
    this.mRSeparatePassNodes = [];
    this.mPassNodes = [];
    this.mPNodeFlags = [];
    this.enabled = true;
    this.mRendererUid = rendererUid;
    this.mRBParam = bp;
    this.camera = bp.camera;
    this.mrPassParam = param;
    this.initialize(wgCtx, param);
  }

  getWGCtx() {
    return this.mWGCtx;
  }

  initialize(wgCtx, param) {
    this.mrPassParam = param ? param : this.mrPassParam;

    if (wgCtx) {
      param = this.mrPassParam;

      if (!this.mWGCtx && wgCtx && wgCtx.enabled) {
        this.mWGCtx = wgCtx;

        for (let i = 0; i < this.mPassNodes.length; ++i) {
          this.mPassNodes[i].initialize(wgCtx);
        }
      }

      if (this.mPassNodes.length == 0 && param) {
        const passNode = new WGRenderPassNode_1.WGRenderPassNode(this.mRBParam);
        passNode.builder = this;
        passNode.initialize(wgCtx, param);
        this.mPassNodes.push(passNode);
        this.mPNodeFlags.push(1);
        this.mRPassNodes.push(passNode);
      }
    }
  }

  hasMaterial(material) {
    if (this.unitBlock) {
      return this.unitBlock.hasMaterial(material);
    }

    return false;
  }

  addEntity(entity) {
    // console.log("Renderer::addEntity(), entity.isInRenderer(): ", entity.isInRenderer());
    if (entity) {
      if (!this.unitBlock) {
        this.unitBlock = WGRenderUnitBlock_1.WGRenderUnitBlock.createBlock();
      }

      const ub = this.unitBlock;
      ub.rbParam = this.mRBParam;
      ub.builder = this;
      ub.addEntity(entity);
    }
  }

  getRenderPassAt(index) {
    const ls = this.mRPassNodes;
    const ln = ls.length;
    if (index < 0) index = 0;else if (index >= ln) index = ln;
    return {
      index,
      node: ls[index]
    };
  }

  getComptePassAt(index) {
    const ls = this.mCompPassNodes;
    const ln = ls.length;
    if (index < 0) index = 0;else if (index >= ln) index = ln;
    return {
      index,
      node: ls[index]
    };
  }

  appendRendererPass(param) {
    if (!param) param = {};
    const computing = param && param.computeEnabled === true;
    let index = -1;
    const passNode = new WGRenderPassNode_1.WGRenderPassNode(this.mRBParam, !computing);
    passNode.camera = this.camera;
    console.log("appendRendererPass(), create a new render pass, param: ", param);

    if (computing) {
      passNode.builder = this;
      passNode.name = "newcomppassnode-" + this.mPassNodes.length;
      passNode.initialize(this.mWGCtx, param);
      this.mCompPassNodes.push(passNode);
      index = this.mCompPassNodes.length - 1;
    } else {
      passNode.name = "newpassnode-" + this.mPassNodes.length;
      let prevNode;
      let prevPass = param.prevPass;
      let prevNodeParam;

      if (prevPass && prevPass.node !== undefined) {
        prevNode = prevPass.node;
        prevNodeParam = prevNode.param;
        param.multisampleEnabled = prevNodeParam.multisampleEnabled;
        param.depthFormat = prevNodeParam.depthFormat;
        passNode.builder = this;
        passNode.prevNode = prevNode;
        passNode.initialize(this.mWGCtx, param ? param : prevNode.param);
        const rpass = passNode.rpass;
        rpass.name = "newpass_type01";
        rpass.passColors[0].loadOp = "load";
        rpass.passDepthStencil.depthLoadOp = "load";
        this.mRPassNodes.push(passNode);
        index = this.mRPassNodes.length - 1;
      } else if (!(param.separate === true)) {
        prevNode = this.mRPassNodes[this.mRPassNodes.length - 1];
        prevNodeParam = prevNode.param;
        param.multisampleEnabled = prevNodeParam.multisampleEnabled;
        param.depthFormat = prevNodeParam.depthFormat;
        passNode.prevNode = prevNode;
        passNode.initialize(this.mWGCtx, param ? param : prevNode.param);
        const rpass = passNode.rpass;
        rpass.name = "newpass_type02";
        this.mRPassNodes.push(passNode);
        index = this.mRPassNodes.length - 1;
      } else {
        console.log("create a separate render pass.");
        const rpass = passNode.rpass;
        rpass.name = "newpass_type03(separate)";
        passNode.separate = rpass.separate = true;
        passNode.initialize(this.mWGCtx, param ? param : prevNode.param);
        this.mRSeparatePassNodes.push(passNode);
        index = -1;
      }
    }

    this.mPassNodes.push(passNode);
    this.mPNodeFlags.push(1);
    const ref = new WGRPassWrapper_1.WGRPassWrapper();
    ref.index = index;
    ref.node = passNode;
    return ref;
  }

  getPassNode(ref) {
    const nodes = this.mRPassNodes;
    let node = nodes[nodes.length - 1];

    if (ref) {
      if (ref.node) {
        return node;
      }

      if (ref.index !== undefined) {
        if (ref.index >= 0 && ref.index < nodes.length) {
          node = nodes[ref.index];
        }
      }
    }

    return node;
  }

  getPassNodeWithMaterial(material) {
    let node = this.getPassNode(material.rpass ? material.rpass.rpass : null);

    if (material.shaderSrc.compShaderSrc) {
      if (this.mCompPassNodes.length < 1) {
        this.appendRendererPass({
          computeEnabled: true
        });
      }

      node = this.mCompPassNodes[this.mCompPassNodes.length - 1];
    }

    return node;
  }

  createRenderPipelineCtxWithMaterial(material) {
    throw Error('Illegal operation !!!');
    return null;
  } // pipelineParam value likes {blendMode: "transparent", depthWriteEnabled: false, faceCullMode: "back"}


  createRenderPipelineCtx(shdSrc, pipelineVtxParam, pipelineParam, renderPassConfig) {
    const node = this.getPassNode(renderPassConfig);
    return node.createRenderPipelineCtx(shdSrc, pipelineVtxParam, pipelineParam);
  }

  createRenderPipeline(pipelineParams, vtxDesc, renderPassConfig) {
    const node = this.getPassNode(renderPassConfig);
    return node.createRenderPipeline(pipelineParams, vtxDesc);
  }

  setPassNodeGraph(graph) {
    this.mGraph = graph;

    if (graph) {
      let ps = graph.passes;

      for (let i = 0; i < ps.length; ++i) {
        const node = ps[i].node;
        node.mode = 1;
      }
    }
  }

  runBegin() {
    this.rcommands = [];

    if (this.enabled) {
      const graph = this.mGraph;

      if (graph) {
        // let ps = graph.passes;
        // for (let i = 0; i < ps.length; ++i) {
        // 	const node = ps[i].node;
        // 	node.rcommands = [];
        // }
        graph.runBegin();
      }

      const nodes = this.mPassNodes;

      for (let i = 0; i < nodes.length; ++i) {
        if (nodes[i].mode < 1) {
          nodes[i].runBegin();
        }
      }
    }
  }

  runEnd() {
    if (this.enabled) {
      const graph = this.mGraph;

      if (graph) {
        this.rcommands = this.rcommands.concat(graph.cmdWrapper.rcommands);
      }

      const nodes = this.mPassNodes; // console.log("this.mPassNodes: ", this.mPassNodes);

      for (let i = 0; i < nodes.length; ++i) {
        const node = nodes[i];

        if (node.mode < 1) {
          node.runEnd();
          this.rcommands = this.rcommands.concat(node.rcommands);
        }
      } // console.log("this.rcommands: ", this.rcommands);

    }
  }

  run() {
    if (this.enabled) {
      const graph = this.mGraph;

      if (graph) {
        graph.run();
      }

      const nodes = this.mPassNodes;

      for (let i = 0; i < nodes.length; ++i) {
        if (nodes[i].mode < 1) {
          nodes[i].run();
        }
      }

      if (this.unitBlock) {
        this.unitBlock.run();
      }
    }
  }

  destroy() {
    if (this.mWGCtx) {
      this.mWGCtx = null;
      this.mRPassNodes = [];
      this.mCompPassNodes = [];
      this.mPassNodes = [];
      this.mRBParam = null;
    }
  }

}

exports.WGRenderPassBlock = WGRenderPassBlock;

/***/ }),

/***/ "dfa8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const __$RID = {
  uid: 0
};

function createNewWRGBufferViewUid() {
  return __$RID.uid++;
}

exports.createNewWRGBufferViewUid = createNewWRGBufferViewUid;

class WGRBufferView {
  constructor() {
    this.mUid = createNewWRGBufferViewUid();
    this.arrayStride = 1;
    this.usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
    this.byteOffset = 0;
    this.version = -1;
  }

  get byteLength() {
    return this.data.byteLength;
  }

  get uid() {
    return this.mUid;
  }

  setParam(param) {
    if (param) {
      if (param.data) this.data = param.data;
      if (param.buffer) this.buffer = param.buffer;
      if (param.mappedAtCreation !== undefined) this.mappedAtCreation = param.mappedAtCreation;
      if (param.shared !== undefined) this.shared = param.shared;
    }

    return this;
  }

}

exports.WGRBufferView = WGRBufferView;

/***/ }),

/***/ "e2cf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function findShaderEntryPoint(keyStr, src) {
  let i = src.indexOf(keyStr);

  if (i < 0) {
    // throw Error("Illegal Operation !!!");
    return "";
  }

  i = src.indexOf('fn', i + keyStr.length) + 2;
  let j = src.indexOf('(', i);
  return src.slice(i, j).trim();
}

exports.findShaderEntryPoint = findShaderEntryPoint;

function createFragmentState(shaderModule, targetStates) {
  const st = {
    module: shaderModule,
    entryPoint: "main",
    targets: [{
      format: "bgra8unorm"
    }]
  };

  if (targetStates !== undefined && targetStates.length > 0) {
    st.targets = targetStates;
  }

  return st;
}

exports.createFragmentState = createFragmentState;

function createComputeState(shaderModule) {
  const st = {
    module: shaderModule,
    entryPoint: "main"
  };
  return st;
}

exports.createComputeState = createComputeState;

/***/ }),

/***/ "e594":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "ec7b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2023 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

Object.defineProperty(exports, "__esModule", {
  value: true
});

class MathConst {
  // compute euclidean modulo of m % n
  // https://en.wikipedia.org/wiki/Modulo_operation
  static EuclideanModulo(n, m) {
    return (n % m + m) % m;
  }

  static Clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
  }

  static IsPowerOf2(value) {
    return (value & value - 1) == 0;
  }

  static CalcCeilPowerOfTwo(value) {
    return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
  }

  static CalcNearestCeilPow2(int_n) {
    return Math.pow(2, Math.round(Math.log(int_n) / Math.LN2));
  }

  static CalcFloorCeilPow2(int_n) {
    return Math.pow(2, Math.floor(Math.log(int_n) / Math.LN2));
  }

  static DegreeToRadian(degree) {
    return MathConst.MATH_PI_OVER_180 * degree;
  }

  static Log2(f) {
    return Math.log(f) / Math.LN2;
  }

  static GetMaxMipMapLevel(width, height) {
    return Math.round(MathConst.Log2(Math.max(width, height)) + 1);
  }

  static ToDegree(radian) {
    return radian * MathConst.MATH_180_OVER_PI;
  }

  static ToRadian(degree) {
    return degree * MathConst.MATH_PI_OVER_180;
  }

  static SafeACos(x) {
    if (x <= -1.0) {
      return MathConst.MATH_PI;
    }

    if (x >= 1.0) {
      return 0.0;
    }

    return Math.acos(x);
  }

  static GetNearestCeilPow2(int_n) {
    let x = 1;

    while (x < int_n) {
      x <<= 1;
    }

    return x;
  } // ccw is positive


  static GetMinRadian(a1, a0) {
    a0 %= MathConst.MATH_2PI;
    a1 %= MathConst.MATH_2PI;

    if (a0 < a1) {
      a0 = MathConst.MATH_2PI - a1 + a0;
      if (a0 > MathConst.MATH_PI) return a0 - MathConst.MATH_2PI;
      return a0;
    } else if (a0 > a1) {
      a1 = MathConst.MATH_2PI - a0 + a1;
      if (a1 > MathConst.MATH_PI) return MathConst.MATH_2PI - a1;
      return -a1;
    }

    return 0.0;
  }
  /**
   * get the directional angle offset degree value: dst_angle_degree = src_angle_degree + directional_angle_offset_degree_value
   * @param a0 src angle degree
   * @param a1 dst angle degree
   * @returns directional angle offset degree value
   */


  static GetMinDegree(a0, a1) {
    let angle = 0;

    if (a1 >= 270 && a0 < 90) {
      angle = (a1 - (a0 + 360)) % 180;
    } else if (a1 <= 90 && a0 >= 270) {
      angle = (a1 + 360 - a0) % 180;
    } else {
      angle = a1 - a0; //  if (Math.abs(angle) > 180) {
      //      angle -= 360;
      //  }

      if (angle > 180) {
        angle -= 360;
        angle %= 360;
      } else if (angle < -180) {
        angle += 360;
        angle %= 360;
      }
    }

    return angle;
  }

  static GetDegreeByXY(dx, dy) {
    if (Math.abs(dx) < 0.00001) {
      if (dy >= 0) return 270;else return 90;
    }

    let angle = Math.atan(dy / dx) * 180 / Math.PI;

    if (dx >= 0) {
      return angle;
    } else {
      return 180 + angle;
    } //  if (dy > 0 && dx > 0) {
    //      return angle
    //  } else if (dy < 0 && dx >= 0) {
    //      return 360 + angle;
    //  } else {
    //      return dx > 0 ? angle : 180 + angle;
    //  }

  }

  static GetRadianByXY(dx, dy) {
    if (Math.abs(dx) < MathConst.MATH_MIN_POSITIVE) {
      if (dy >= 0) return MathConst.MATH_1PER2PI;else return MathConst.MATH_3PER2PI;
    }

    let rad = Math.atan(dy / dx);

    if (dx >= 0) {
      return rad;
    } else {
      return MathConst.MATH_PI + rad;
    }
  }

  static GetRadianByCos(cosv, dx, dy) {
    var rad = Math.acos(cosv); //Math.atan(dy/dx);

    if (dx >= 0) {
      return rad;
    } else {
      return MathConst.MATH_PI + rad;
    }
  }

}

MathConst.MATH_MIN_POSITIVE = 1e-5;
MathConst.MATH_MAX_NEGATIVE = -1e-5;
MathConst.MATH_MAX_POSITIVE = 0xffffffe;
MathConst.MATH_MIN_NEGATIVE = -0xffffffe;
MathConst.MATH_1_OVER_255 = 1.0 / 255.0;
MathConst.MATH_PI = Math.PI;
MathConst.MATH_2PI = MathConst.MATH_PI * 2.0;
MathConst.MATH_3PER2PI = MathConst.MATH_PI * 1.5;
MathConst.MATH_1PER2PI = MathConst.MATH_PI * 0.5;
MathConst.MATH_1_OVER_PI = 1.0 / MathConst.MATH_PI;
MathConst.MATH_1_OVER_360 = 1.0 / 360.0;
MathConst.MATH_1_OVER_180 = 1.0 / 180.0;
MathConst.MATH_180_OVER_PI = 180.0 / MathConst.MATH_PI;
MathConst.MATH_PI_OVER_180 = MathConst.MATH_PI / 180.0;
MathConst.MATH_LN2 = 0.6931471805599453;
exports.default = MathConst;

/***/ }),

/***/ "f22d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const Entity3D_1 = __webpack_require__("551f");

exports.Entity3DParam = Entity3D_1.Entity3DParam;
exports.getUniformValueFromParam = Entity3D_1.getUniformValueFromParam;

class FixScreenEntity extends Entity3D_1.Entity3D {
  constructor(param) {
    param = param ? param : {
      transformEnabled: false
    };
    param.transformEnabled = false;
    super(param);
    this.cameraViewing = false;
  }

  update() {
    return this;
  }

}

exports.FixScreenEntity = FixScreenEntity;

/***/ }),

/***/ "f5fb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const WGRenderPassBlock_1 = __webpack_require__("ddc9");

exports.WGRPipelineContextDefParam = WGRenderPassBlock_1.WGRPipelineContextDefParam;

class RPassInfoParam {
  constructor() {
    this.blockIndex = 0;
  }

}

exports.RPassInfoParam = RPassInfoParam;

function checkConfig(config) {
  let canvasCFG = {
    alphaMode: "premultiplied"
  };
  let canvas;
  let div;

  if (config) {
    canvas = config.canvas;
    div = config.div;

    if (config.gpuCanvasCfg) {
      canvasCFG = config.gpuCanvasCfg;
    }
  } else {
    config = {
      canvas: null
    };
  }

  let width = 512;
  let height = 512;

  if (!div) {
    div = document.createElement("div");
    document.body.appendChild(div);
    const style = div.style;
    style.display = "bolck";
    style.position = "absolute";

    if (style.left == "") {
      style.left = "0px";
      style.top = "0px";
    }

    div.style.width = width + "px";
    div.style.height = height + "px";
  }

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    div.appendChild(canvas);
  }

  config.canvas = canvas;
  config.div = div;
  config.gpuCanvasCfg = canvasCFG;
  return config;
}

exports.checkConfig = checkConfig;

/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("cd49");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ }),

/***/ "fe0b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function copyFromObjectValueWithKey(src, dst) {
  for (var k in src) {
    if (src[k] != undefined) {
      dst[k] = src[k];
    }
  }
}

exports.copyFromObjectValueWithKey = copyFromObjectValueWithKey;

function createIndexArrayWithSize(size) {
  return size > 65536 ? new Uint32Array(size) : new Uint16Array(size);
}

exports.createIndexArrayWithSize = createIndexArrayWithSize;

function createIndexArray(array) {
  return array.length > 65536 ? new Uint32Array(array) : new Uint16Array(array);
}

exports.createIndexArray = createIndexArray;
/**
 * Determines the number of mip levels needed for a full mip chain given the width and height of texture level 0.
 *
 * @param {number} width of texture level 0.
 * @param {number} height of texture level 0.
 * @returns {number} Ideal number of mip levels.
 */

function calculateMipLevels(width, height) {
  return Math.floor(Math.log2(Math.max(width, height))) + 1;
}

exports.calculateMipLevels = calculateMipLevels; // thanks: http://stackoverflow.com/questions/32633585/how-do-you-convert-to-half-floats-in-javascript
// thanks: https://esdiscuss.org/topic/float16array

const toFloat16 = function () {
  const floatView = new Float32Array(1);
  const int32View = new Int32Array(floatView.buffer);
  /* This method is faster than the OpenEXR implementation (very often
   * used, eg. in Ogre), with the additional benefit of rounding, inspired
   * by James Tursa?s half-precision code. */

  return function toHalf(val) {
    floatView[0] = val;
    let x = int32View[0];
    let bits = x >> 16 & 0x8000;
    /* Get the sign */

    let m = x >> 12 & 0x07ff;
    /* Keep one extra bit for rounding */

    let e = x >> 23 & 0xff;
    /* Using int is faster here */

    /* If zero, or denormal, or exponent underflows too much for a denormal
     * half, return signed zero. */

    if (e < 103) {
      return bits;
    }
    /* If NaN, return NaN. If Inf or exponent overflow, return Inf. */


    if (e > 142) {
      bits |= 0x7c00;
      /* If exponent was 0xff and one mantissa bit was set, it means NaN,
       * not Inf, so make sure we set one mantissa bit too. */

      bits |= (e == 255 ? 0 : 1) && x & 0x007fffff;
      return bits;
    }
    /* If exponent underflows but not too much, return a denormal */


    if (e < 113) {
      m |= 0x0800;
      /* Extra rounding may overflow and set mantissa to 0 and exponent
       * to 1, which is OK. */

      bits |= (m >> 114 - e) + (m >> 113 - e & 1);
      return bits;
    }

    bits |= e - 112 << 10 | m >> 1;
    /* Extra rounding. An overflow will set mantissa to 0 and increment
     * the exponent, which is OK. */

    bits += m & 1;
    return bits;
  };
}();

exports.toFloat16 = toFloat16; // webgpu hdr usage: https://stackoverflow.com/questions/77032862/load-hdr-10-bit-avif-image-into-a-rgba16float-texture-in-webgpu

function createSolidColorTexture(r, g, b, a) {
  let rc;
  let wgctx = rc.getWGCtx();
  const data = new Uint8Array([r * 255, g * 255, b * 255, a * 255]);
  const texture = wgctx.device.createTexture({
    size: {
      width: 1,
      height: 1
    },
    format: "rgba8unorm",
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
  });
  wgctx.device.queue.writeTexture({
    texture
  }, data, {}, {
    width: 1,
    height: 1
  });
  return texture;
}

function createFloatColorTexture(width, height) {
  let rc;
  let wgctx = rc.getWGCtx();
  let data = new Uint16Array(width * height * 4);
  let scale = 10.0;
  let k = 0;

  for (let i = 0; i < height; ++i) {
    for (let j = 0; j < width; ++j) {
      k = (width * i + j) * 4;
      data[k] = toFloat16(scale * (j / width));
      data[k + 1] = toFloat16(scale * (0.5 + 0.5 * Math.sin(10.0 * (1.0 - j / width))));
      data[k + 2] = toFloat16(scale * (1.0 - i * j / (width * height)));
      data[k + 3] = toFloat16(scale * 1.0);
    }
  }

  const texture = wgctx.device.createTexture({
    size: {
      width,
      height
    },
    format: "rgba16float",
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
  });
  wgctx.device.queue.writeTexture({
    texture
  }, data, {
    bytesPerRow: width * 8,
    rowsPerImage: height
  }, {
    width,
    height
  });
  return texture;
}

/***/ })

/******/ });
});