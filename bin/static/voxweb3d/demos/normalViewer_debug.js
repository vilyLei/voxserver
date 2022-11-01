(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CoSpace"] = factory();
	else
		root["CoSpace"] = factory();
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

/***/ "1389":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 光标移入的信息提示系统
 */

class TipsSystem {
  constructor() {
    this.m_tipEntity = null;
  }

  initialize(uiscene, rpi = 3) {
    if (this.m_tipEntity == null) {
      this.m_uiscene = uiscene;
      let tip = CoUI.createRectTextTip();
      tip.initialize(uiscene, rpi);
      this.m_tipEntity = tip;
    }
  }
  /**
   * get tip entity
   * @param type the default value is 0
   * @returns IRectTextTip instance
   */


  getTipEntity(type) {
    return this.m_tipEntity;
  }
  /**
   * @param entity IMouseEvtUIEntity instance
   * @param type the default value is 0
   */


  addTipsTarget(entity, type) {
    this.m_tipEntity.addEntity(entity);
  }
  /**
   * @param entity IMouseEvtUIEntity instance
   * @param type the default value is 0
   */


  removeTipsTarget(entity, type) {
    this.m_tipEntity.removeEntity(entity);
  }

  destroy() {}

}

exports.TipsSystem = TipsSystem;

/***/ }),

/***/ "1dd7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UIEntityBase_1 = __webpack_require__("b0fb");

class TextLabel extends UIEntityBase_1.UIEntityBase {
  constructor() {
    super();
    this.m_pw = 10;
    this.m_ph = 10;
    this.m_sx = 1.0;
    this.m_sy = 1.0; // private m_rpi = 0;

    this.m_material = null;
    this.m_tex = null;
    this.m_fontSize = 24;
    this.m_text = "";
  }

  initialize(text, uiScene, fontSize = 24) {
    if (text != "" && this.isIniting()) {
      if (fontSize < 12) fontSize = 12;
      this.init(); // this.transparent = true;
      // this.premultiplyAlpha = true;

      this.m_text = text;
      this.m_uiScene = uiScene;
      let entity = CoEntity.createDisplayEntity();
      this.m_fontColor = CoMaterial.createColor4();
      this.m_bgColor = CoMaterial.createColor4(1.0, 1.0, 1.0, 0.0);
      let img = this.m_uiScene.texAtlas.createCharsImage(this.m_text, this.m_fontSize, this.m_fontColor, this.m_bgColor);
      this.m_tex = uiScene.rscene.textureBlock.createImageTex2D(img.width, img.height);
      this.m_tex.setDataFromImage(img);
      this.m_tex.flipY = true;
      this.m_tex.premultiplyAlpha = true; //this.premultiplyAlpha;

      this.m_tex.minFilter = CoRScene.TextureConst.LINEAR;
      this.m_tex.magFilter = CoRScene.TextureConst.NEAREST;
      let material = this.createMaterial(this.m_tex);
      material.setColor(this.m_fontColor);
      CoMesh.plane.setBufSortFormat(material.getBufSortFormat());
      let mesh = CoMesh.plane.createXOY(0, 0, 1.0, 1.0);
      this.m_pw = img.width;
      this.m_ph = img.height;
      entity.setMaterial(material);
      entity.setMesh(mesh);
      this.m_entities.push(entity);
      this.applyRST(entity);
      super.setScaleXY(this.m_sx * this.m_pw, this.m_sy * this.m_ph);
      this.update();
    }
  }

  setScaleXY(sx, sy) {
    this.m_sx = sx;
    this.m_sy = sy;
    super.setScaleXY(sx * this.m_pw, sy * this.m_ph);
  }

  setScaleX(sx) {
    this.m_sx = sx;
    super.setScaleX(sx * this.m_pw);
  }

  setScaleY(sy) {
    this.m_sy = sy;
    super.setScaleX(sy * this.m_ph);
  }

  getScaleX() {
    return this.m_sx;
  }

  getScaleY() {
    return this.m_sy;
  }

  setText(text) {
    if (this.m_tex != null && text != "" && this.m_text != text) {
      this.m_text = text;
      let img = this.m_uiScene.texAtlas.createCharsImage(text, this.m_fontSize, this.m_fontColor, this.m_bgColor);
      this.m_tex.setDataFromImage(img, 0, 0, 0, true);
      this.m_tex.updateDataToGpu();
      this.m_pw = img.width;
      this.m_ph = img.height;
      super.setScaleXY(this.m_sx * this.m_pw, this.m_sy * this.m_ph);
      this.update();
    }
  }

  getText() {
    return this.m_text;
  }

  setColor(c) {
    this.m_fontColor.copyFrom(c);

    if (this.m_material != null) {
      this.m_material.setColor(c);
    }

    return this;
  }

  getColor() {
    return this.m_fontColor;
  }

  destroy() {
    super.destroy();
    this.m_material = null;
    this.m_uiScene = null;
    this.m_tex = null;
  }

}

exports.TextLabel = TextLabel;

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

/***/ "2564":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 将加载逻辑打包的loader
 */

class PackedLoader {
  /**
   * @param times 记录总共需要的完成操作的响应次数。这个次数可能是由load直接产生，也可能是由于别的地方驱动。
   * @param callback 完成所有响应的之后的回调
   */
  constructor(times, callback = null, urlChecker = null) {
    this.m_uid = PackedLoader.s_uid++;
    this.m_urlChecker = null;
    this.m_oneTimes = true;
    this.m_loaderMap = null;
    this.m_callback = callback;
    this.m_times = times;
    this.m_urlChecker = urlChecker;
  }

  setUrlChecker(urlChecker = null) {
    this.m_urlChecker = urlChecker;
  }

  getUrlChecker() {
    return this.m_urlChecker;
  }

  getUid() {
    return this.m_uid;
  }

  setCallback(callback) {
    this.m_callback = callback;
    return this;
  }

  addLoader(m) {
    if (m != null && m != this) {
      if (this.isFinished()) {
        m.use();
      } else {
        if (this.m_loaderMap == null) {
          this.m_loaderMap = new Map();
        }

        let map = this.m_loaderMap;

        if (!map.has(m.getUid())) {
          map.set(m.getUid(), m);
        }
      }
    }

    return this;
  }

  isFinished() {
    return this.m_times == 0;
  }

  useOnce() {
    if (this.m_oneTimes) {
      this.m_oneTimes = false;
      this.use();
    }
  }

  use() {
    if (this.m_times > 0) {
      this.m_times--;

      if (this.isFinished()) {
        if (this.m_callback != null) {
          this.m_callback();
          this.m_callback = null;

          if (this.m_loaderMap != null) {
            for (let [key, value] of this.m_loaderMap) {
              value.use();
            }

            this.m_loaderMap = null;
          }
        }
      }
    }
  }

  hasModuleByUrl(url) {
    return PackedLoader.loadedMap.has(url);
  }

  load(url) {
    if (url == "") {
      return this;
    }

    if (this.m_urlChecker != null) {
      url = this.m_urlChecker(url);
    }

    let loadedMap = PackedLoader.loadedMap;

    if (loadedMap.has(url)) {
      this.use();
      return;
    }

    let loadingMap = PackedLoader.loadingMap;

    if (loadingMap.has(url)) {
      let list = loadingMap.get(url);

      for (let i = 0; i < list.length; ++i) {
        if (list[i] == this) {
          return;
        }
      }

      list.push(this);
      return;
    }

    loadingMap.set(url, [this]);
    this.loadData(url);
    return this;
  }
  /**
   * subclass need override this function
   * @param url data url
   */


  loadData(url) {
    let codeLoader = new XMLHttpRequest();
    codeLoader.open("GET", url, true);

    codeLoader.onerror = function (err) {
      console.error("load error: ", err);
    }; // codeLoader.onprogress = e => { };


    codeLoader.onload = evt => {
      // this.loadedData(codeLoader.response, url);
      this.loadedUrl(url);
    };

    codeLoader.send(null);
  }
  /**
   * subclass need override this function
   * @param data loaded data
   * @param url data url
   */


  loadedData(data, url) {
    console.log("module js file loaded, url: ", url); // let scriptEle: HTMLScriptElement = document.createElement("script");
    // scriptEle.onerror = evt => {
    // 	console.error("module script onerror, e: ", evt);
    // };
    // scriptEle.type = "text/javascript";
    // scriptEle.innerHTML = data;
    // document.head.appendChild(scriptEle);
  }
  /**
   * does not override this function
   * @param url http req url
   */


  loadedUrl(url) {
    let loadedMap = PackedLoader.loadedMap;
    let loadingMap = PackedLoader.loadingMap;
    loadedMap.set(url, 1);
    let list = loadingMap.get(url);

    for (let i = 0; i < list.length; ++i) {
      list[i].use();
    }

    loadingMap.delete(url);
  }

  getDataByUrl(url) {
    return null;
  }

  clearAllData() {}

  destroy() {
    this.m_urlChecker = null;
  }

}

PackedLoader.s_uid = 0;
PackedLoader.loadedMap = new Map();
PackedLoader.loadingMap = new Map();
exports.PackedLoader = PackedLoader;

/***/ }),

/***/ "259d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class NVRectFrameQuery {
  constructor() {
    this.m_entities = null;
    this.m_rect = CoMath.createAABB2D();
  }

  query(entities, total) {
    this.m_entities = [];

    if (total > 0) {
      let list = this.m_entities;
      const rect = this.m_rect;
      let pv = CoMath.createVec3();
      let cam = this.m_rscene.getCamera();
      let st = this.m_rscene.getStage3D();

      for (let i = 0; i < total; ++i) {
        if (entities[i].mouseEnabled) {
          let bounds = entities[i].getGlobalBounds();
          pv.copyFrom(bounds.center);
          cam.worldPosToScreen(pv);
          pv.x += st.stageHalfWidth;
          pv.y += st.stageHalfHeight;

          if (rect.containsXY(pv.x, pv.y)) {
            list.push(entities[i]);
          }
        }
      }
    }
  }

  initialize(rscene) {
    if (this.m_rscene == null) {
      this.m_rscene = rscene;
    }
  }

  getEntities(min, max) {
    const rect = this.m_rect;
    rect.setTo(min.x, min.y, max.x - min.x, max.y - min.y);

    if (rect.width * rect.height > 0) {
      let rscene = this.m_rscene;
      rscene.getSpace().renderingEntitySet.query(this);
      return this.m_entities;
    }

    return null;
  }

}

exports.NVRectFrameQuery = NVRectFrameQuery;

/***/ }),

/***/ "268d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class UserEditEvent {}

UserEditEvent.EDIT_BEGIN = 20001;
UserEditEvent.EDIT_END = 20002;
exports.UserEditEvent = UserEditEvent;

/***/ }),

/***/ "2870":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ClipLabel_1 = __webpack_require__("3914");

const ClipColorLabel_1 = __webpack_require__("bb62");

const Button_1 = __webpack_require__("eb56");

class ButtonBuilder {
  static crateCurrTextBtn(pw, ph, idns, texAtlas, textParam, colors) {
    if (textParam.text !== null && textParam.text != "" && colors != null) {
      let colorClipLabel = new ClipColorLabel_1.ClipColorLabel();
      colorClipLabel.initializeWithoutTex(pw, ph, 4);
      colorClipLabel.setColors(colors);
      let iconLable = new ClipLabel_1.ClipLabel();
      iconLable.depthTest = true;
      iconLable.transparent = true;
      iconLable.premultiplyAlpha = true;
      iconLable.initialize(texAtlas, [textParam.text]);
      iconLable.setColor(textParam.textColor);
      let btn = new Button_1.Button();
      btn.uuid = idns;
      btn.addLabel(iconLable);
      btn.initializeWithLable(colorClipLabel);
      return btn;
    }

    return null;
  }

  static createTextButton(width, height, idns, texAtlas, textParam, colors) {
    let tp = textParam;
    let img = texAtlas.createCharsCanvasFixSize(width, height, tp.text, tp.fontSize, CoMaterial.createColor4(), CoMaterial.createColor4(1.0, 1.0, 1.0, 0.0));
    texAtlas.addImageToAtlas(tp.text, img);
    return ButtonBuilder.crateCurrTextBtn(width, height, idns, texAtlas, textParam, colors);
  }

}

exports.ButtonBuilder = ButtonBuilder;

/***/ }),

/***/ "2a2b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ModuleLoader_1 = __webpack_require__("75f5"); //CoModuleLoader


class CoModuleLoader extends ModuleLoader_1.ModuleLoader {
  /**
   * @param times 记录总共需要的加载完成操作的响应次数。这个次数可能是由load直接产生，也可能是由于别的地方驱动。
   * @param callback 完成所有响应的之后的回调
   */
  constructor(times, callback = null) {
    super(times, callback, null);

    let urlChecker = url => {
      if (url.indexOf(".artvily.") > 0) {
        return url;
      }

      let hostUrl = window.location.href;
      url = url.trim();

      if (hostUrl.indexOf(".artvily.") > 0) {
        let i = url.lastIndexOf("/");
        let j = url.indexOf(".", i); // hostUrl = "http://localhost:9000/test/";

        hostUrl = "http://www.artvily.com:9090/";
        let fileName = url.slice(i, j).toLocaleLowerCase();

        if (fileName == "") {
          console.error("err: ", url);
          console.error("i, j: ", i, j);
        }

        let purl = hostUrl + url.slice(0, i) + fileName + ".js";
        console.log("urlChecker(), fileName:-" + fileName + "-");
        console.log("urlChecker(), purl: ", purl);
        return purl;
      }

      return url;
    };

    this.setUrlChecker(urlChecker);
  }

}

exports.CoModuleLoader = CoModuleLoader;

/***/ }),

/***/ "3120":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * NVNavigationUI
 */

class NVNavigationUI {
  // tip: IRectTextTip = null;
  constructor() {
    this.m_rsc = null;
    this.m_editUIRenderer = null;
    this.m_uirsc = null;
    this.m_coUIScene = null;
    this.m_navBtns = [];
    this.m_bgLabel = null;
  }

  initialize(rsc, editUIRenderer, coUIScene) {
    if (this.m_coUIScene == null) {
      this.m_rsc = rsc;
      this.m_editUIRenderer = editUIRenderer;
      this.m_coUIScene = coUIScene;
      this.init();
    }
  }

  init() {
    let editsc = this.m_editUIRenderer;
    this.initUI();
  }

  initUI() {
    this.m_uirsc = this.m_coUIScene.rscene;
    this.initNavigationUI();
  }

  resize(evt) {
    let st = this.m_coUIScene.getStage();
    this.m_bgLabel.setScaleX(st.stageWidth / this.m_bgLabelW);
    this.m_bgLabel.setY(st.stageHeight - this.m_bgLabelH);
    this.m_bgLabel.update();
  }

  initNavigationUI() {
    let uiScene = this.m_coUIScene;
    let tta = uiScene.transparentTexAtlas;
    let px = 0;
    let py = 0;
    let pw = 90;
    let ph = 40;
    let st = this.m_coUIScene.getStage();
    this.m_bgLabelW = st.stageWidth;
    this.m_bgLabelH = ph;
    let bgLabel = CoUI.createColorLabel();
    bgLabel.initialize(this.m_bgLabelW, this.m_bgLabelH);
    bgLabel.setY(st.stageHeight - ph);
    bgLabel.setColor(bgLabel.getColor().setRGB3Bytes(40, 40, 40));
    uiScene.addEntity(bgLabel);
    this.m_bgLabel = bgLabel;
    let EB = CoRScene.EventBase;
    uiScene.getStage().addEventListener(EB.RESIZE, this, this.resize);
    let keys = ["file", "edit", "model", "normal", "texture", "material", "light", "animation", "particle", "rendering", "physics", "help"];
    let urls = ["文件", "编辑", "模型", "法线", "纹理", "材质", "灯光", "动画", "粒子", "渲染", "物理", "帮助"];
    let infos = ["File system operations.", "Editing operations.", "Geometry model operations.", "Normal data operations.", "Texture data operations.", "Material system operations.", "Light system operations.", "Animation system operations.", "Paiticle system operations.", "Rendering system operations.", "Physics system operations.", "Help infomation."];
    keys = keys.slice(0, 2);
    urls = urls.slice(0, 2);
    infos = infos.slice(0, 2);
    keys.push("help");
    urls.push("帮助");
    infos.push("Help infomation");
    let layouter = uiScene.layout.createLeftTopLayouter();
    let fontColor = CoMaterial.createColor4().setRGB3Bytes(170, 170, 170);
    let bgColor = CoMaterial.createColor4(1, 1, 1, 0);

    for (let i = 0; i < urls.length; ++i) {
      let img = tta.createCharsCanvasFixSize(pw, ph, urls[i], 30, fontColor, bgColor);
      tta.addImageToAtlas(urls[i], img);
    }

    px = 0;
    py = st.stageHeight - ph;

    for (let i = 0; i < urls.length; ++i) {
      let btn = this.crateBtn(urls, pw, ph, px + pw * i, py, i, keys[i], infos[i]);
      this.m_coUIScene.tips.addTipsTarget(btn);
      this.m_navBtns.push(btn);
      layouter.addUIEntity(btn);
    }

    this.m_coUIScene.prompt.setPromptListener(() => {
      console.log("prompt panel confirm...");
    }, () => {
      console.log("prompt panel cancel...");
    });
  }

  crateBtn(urls, pw, ph, px, py, labelIndex, idns, info) {
    let colorClipLabel = CoUI.createClipColorLabel();
    colorClipLabel.initializeWithoutTex(pw, ph, 4);
    colorClipLabel.getColorAt(0).setRGB3Bytes(40, 40, 40);
    colorClipLabel.getColorAt(1).setRGB3Bytes(50, 50, 50);
    colorClipLabel.getColorAt(2).setRGB3Bytes(40, 40, 60);
    let tta = this.m_coUIScene.transparentTexAtlas;
    let iconLable = CoUI.createClipLabel();
    iconLable.transparent = true;
    iconLable.premultiplyAlpha = true;
    iconLable.initialize(tta, [urls[labelIndex]]);
    let btn = CoUI.createButton();
    btn.uuid = idns;
    btn.info = CoUI.createTipInfo().alignBottom().setContent(info);
    btn.addLabel(iconLable);
    btn.initializeWithLable(colorClipLabel);
    btn.setXY(px, py);
    this.m_coUIScene.addEntity(btn, 1);
    btn.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.btnMouseUpListener);
    return btn;
  }

  btnMouseUpListener(evt) {
    // console.log("btnMouseUpListener(), evt.currentTarget: ", evt.currentTarget);
    let uuid = evt.uuid;
    console.log("XXX CO btnMouseUpListener(), uuid: ", uuid);

    switch (uuid) {
      case "file":
      case "edit":
      case "model":
      case "normal":
      case "texture":
      case "material":
      case "light":
      case "animation":
      case "particle":
        console.log("dfdfdffd");
        this.m_coUIScene.prompt.showPrompt("It can't be used now!");
        break;

      case "help":
        this.toHelp();
        break;

      default:
        break;
    }
  }

  toHelp() {
    let a = document.createElement('a');
    a.href = "https://blog.csdn.net/vily_lei/article/details/127544595?spm=1001.2014.3001.5501";
    a.target = "_blank";
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
  }

  run() {}

}

exports.NVNavigationUI = NVNavigationUI;

/***/ }),

/***/ "3347":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var CoModuleNS;

(function (CoModuleNS) {
  CoModuleNS["ctmParser"] = "ctmGeomParser";
  CoModuleNS["objParser"] = "objGeomParser";
  CoModuleNS["dracoParser"] = "dracoGeomParser";
  CoModuleNS["pngParser"] = "pngParser";
  CoModuleNS["fbxFastParser"] = "fbxFastParser";
  CoModuleNS["threadCore"] = "threadCore";
  CoModuleNS["coSpaceApp"] = "coSpaceApp";
})(CoModuleNS || (CoModuleNS = {}));

exports.CoModuleNS = CoModuleNS;
/**
 * 数据文件类型，例如 ctm, draco
 */

var CoDataFormat;

(function (CoDataFormat) {
  CoDataFormat["Undefined"] = "undefined-format";
  CoDataFormat["CTM"] = "ctm";
  CoDataFormat["Draco"] = "draco";
  CoDataFormat["OBJ"] = "obj";
  CoDataFormat["FBX"] = "fbx";
  CoDataFormat["GLB"] = "glb";
  CoDataFormat["Jpg"] = "jpg";
  CoDataFormat["Png"] = "png";
  CoDataFormat["Gif"] = "gif";
})(CoDataFormat || (CoDataFormat = {}));

exports.CoDataFormat = CoDataFormat;
var CoModuleFileType;

(function (CoModuleFileType) {
  CoModuleFileType["JS"] = "js-text";
  CoModuleFileType["Binasy"] = "binary";
})(CoModuleFileType || (CoModuleFileType = {}));

exports.CoModuleFileType = CoModuleFileType;

/***/ }),

/***/ "3914":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ClipLabelBase_1 = __webpack_require__("67d8");

class ClipLabel extends ClipLabelBase_1.ClipLabelBase {
  constructor() {
    super();
    this.m_material = null;
  }

  createMesh(atlas, idnsList) {
    let partVtxTotal = 4;
    let pivs = [0, 1, 2, 0, 2, 3];
    const n = this.m_total;
    let ivs = new Uint16Array(n * 6);
    let vs = new Float32Array(n * 12);
    let uvs = new Float32Array(n * 8);
    this.m_sizes = new Array(n * 2);
    let k = 0;

    for (let i = 0; i < n; ++i) {
      const obj = atlas.getTexObjFromAtlas(idnsList[i]);
      ivs.set(pivs, i * pivs.length);
      vs.set(this.createVS(0, 0, obj.getWidth(), obj.getHeight()), i * 12);
      uvs.set(obj.uvs, i * 8);

      for (let j = 0; j < pivs.length; ++j) {
        pivs[j] += partVtxTotal;
      }

      this.m_sizes[k++] = obj.getWidth();
      this.m_sizes[k++] = obj.getHeight();
    }

    let mesh = CoMesh.createRawMesh();
    mesh.reset();
    mesh.setIVS(ivs);
    mesh.addFloat32Data(vs, 3);
    mesh.addFloat32Data(uvs, 2);
    mesh.initialize();
    return mesh;
  }

  hasTexture() {
    return true;
  }

  initialize(atlas, idnsList) {
    if (this.isIniting() && atlas != null && idnsList != null && idnsList.length > 0) {
      this.init();
      this.m_pos = CoMath.createVec3();
      this.m_total = idnsList.length;
      let obj = atlas.getTexObjFromAtlas(idnsList[0]);
      let mesh = this.createMesh(atlas, idnsList);
      this.m_vtCount = mesh.vtCount;
      this.m_material = this.createMaterial(obj.texture);
      let et = CoEntity.createDisplayEntity();
      et.setMaterial(this.m_material);
      et.setMesh(mesh);
      et.setIvsParam(0, this.m_step);
      this.m_entities.push(et);
      this.applyRST(et);
      this.setClipIndex(0);
    }
  }

  initializeWithLable(srcLable) {
    if (this.isIniting() && srcLable != null && srcLable != this) {
      if (srcLable.getClipsTotal() < 1) {
        throw Error("Error: srcLable.getClipsTotal() < 1");
      }

      this.init();
      let ls = srcLable.getREntities();

      for (let i = 0; i < ls.length; ++i) {
        let entity = ls[i]; //srcLable.getREntity();

        let mesh = entity.getMesh();
        this.m_pos = CoMath.createVec3();
        let tex = entity.getMaterial().getTextureAt(0);
        let n = this.m_total = srcLable.getClipsTotal();
        this.m_sizes = new Array(n * 2);
        let k = 0;

        for (let i = 0; i < n; ++i) {
          this.m_sizes[k++] = srcLable.getClipWidthAt(i);
          this.m_sizes[k++] = srcLable.getClipHeightAt(i);
        }

        this.m_vtCount = mesh.vtCount;
        this.m_material = this.createMaterial(tex);
        let et = CoEntity.createDisplayEntity();
        et.setMaterial(this.m_material);
        et.setMesh(mesh);
        et.setIvsParam(0, this.m_step);
        this.m_entities.push(et);
        this.applyRST(et);
      }

      this.setClipIndex(0);
    }
  }

  displaceFromLable(srcLable) {
    if (srcLable != null && srcLable != this) {
      if (srcLable.getClipsTotal() < 1) {
        throw Error("Error: srcLable.getClipsTotal() < 1");
      } // if (this.m_entities == null) {
      // 	this.initializeWithLable(srcLable);
      // } else if (this.m_entities[0].isRFree()) {
      // }

    }
  }

  setColor(color) {
    if (this.m_material != null) {
      this.m_material.setColor(color);
    }
  }

  getColor(color) {
    if (this.m_material != null) {
      this.m_material.getColor(color);
    }
  }

  setClipIndex(i) {
    if (i >= 0 && i < this.m_total) {
      this.m_index = i;
      let ls = this.m_entities;

      for (let k = 0; k < ls.length; ++k) {
        ls[k].setIvsParam(i * this.m_step, this.m_step);
      }

      i = i << 1;
      this.m_width = this.m_sizes[i];
      this.m_height = this.m_sizes[i + 1];
    }
  }

}

exports.ClipLabel = ClipLabel;

/***/ }),

/***/ "3f49":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UIEntityBase_1 = __webpack_require__("b0fb");

class ColorLabel extends UIEntityBase_1.UIEntityBase {
  constructor() {
    super();
    this.m_color = null;
    this.m_material = null;
  }

  createMesh(material) {
    let ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
    let vs = new Float32Array(this.createVS(0, 0, this.m_width, this.m_height));
    let mesh = CoMesh.createRawMesh();
    mesh.reset();
    mesh.setBufSortFormat(material.getBufSortFormat());
    mesh.setIVS(ivs);
    mesh.addFloat32Data(vs, 3);
    mesh.initialize();
    return mesh;
  }

  initialize(width, height) {
    if (this.isIniting()) {
      this.init();
      this.m_width = width;
      this.m_height = height;
      let material = CoMaterial.createDefaultMaterial();
      material.initializeByCodeBuf(false);
      this.m_color = CoMaterial.createColor4();
      let mesh = this.createMesh(material);
      let et = CoEntity.createDisplayEntity();
      et.setMaterial(material);
      et.setMesh(mesh);
      this.applyRST(et);
      this.m_entities.push(et);
      this.m_material = material;
    }
  }

  setColor(c) {
    this.m_color.copyFrom(c);

    if (this.m_material != null) {
      this.m_material.setColor(c);
    }

    return c;
  }

  getColor() {
    return this.m_color;
  }

  destroy() {
    super.destroy();
    this.m_material = null;
  }

}

exports.ColorLabel = ColorLabel;

/***/ }),

/***/ "3f7d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const PromptPanel_1 = __webpack_require__("ccfe");

class PromptSystem {
  constructor() {
    this.m_promptPanel = null;
  }

  initialize(uiscene, rpi = 3) {
    if (this.m_promptPanel == null) {
      this.m_uiscene = uiscene;
      let pl = new PromptPanel_1.PromptPanel();
      pl.initialize(this.m_uiscene, rpi, 300, 200, 120, 50);
      pl.setZ(3.0);
      pl.setBGColor(CoMaterial.createColor4(0.2, 0.2, 0.2));
      this.m_promptPanel = pl; // pl.open();
      // pl.close();
    }
  }

  setPromptListener(confirmFunc, cancelFunc, type = 0) {
    if (this.m_promptPanel != null) {
      this.m_promptPanel.setListener(confirmFunc, cancelFunc);
    }
  }

  showPrompt(promptInfo, type = 0) {
    if (this.m_promptPanel != null) {
      this.m_promptPanel.setPrompt(promptInfo);
      this.m_promptPanel.open();
    }
  }

  setPromptTextColor(color, type = 0) {
    if (this.m_promptPanel != null) {
      this.m_promptPanel.setPromptTextColor(color);
    }
  }

  setPromptBGColor(color, type = 0) {
    if (this.m_promptPanel != null) {
      this.m_promptPanel.setBGColor(color);
    }
  }

  getPromptPanel(type = 0) {
    return this.m_promptPanel;
  }

}

exports.PromptSystem = PromptSystem;

/***/ }),

/***/ "43c4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const NormalEntityBuilder_1 = __webpack_require__("bb26");

class NormalEntityNode {
  constructor() {
    this.m_normalFlip = false;
    this.m_showDifference = false;
    this.m_normalScale = 1.0;
    this.m_normalScale0 = 1.0;
    this.m_uid = -1;
    this.groupUid = -1;
    this.entity = null;
    this.m_normalLine = null;
  }

  setLineVisible(v) {
    if (v) {
      this.createNormalLine();
    }

    if (this.m_normalLine != null) this.m_normalLine.setVisible(v);
  }

  getLineVisible() {
    return this.m_normalLine != null && this.m_normalLine.getVisible();
  }

  setVisible(v) {
    this.setLineVisible(v); // this.m_normalLine.setVisible(false);

    this.entity.setVisible(v);
  }

  getUid() {
    return this.m_uid;
  }

  showLocalNormal() {
    this.m_entityMaterial.applyLocalNormal();
    this.m_entityMaterial.applyNormalColor();
  }

  showGlobalNormal() {
    this.m_entityMaterial.applyGlobalNormal();
    this.m_entityMaterial.applyNormalColor();
  }

  showModelColor(boo) {
    if (boo) {
      this.m_entityMaterial.applyModelColor();
    } else {
      this.m_entityMaterial.applyNormalColor();
    }
  }

  showDifference(boo = true) {
    this.m_showDifference = boo;
    this.m_entityMaterial.applyDifference(boo);
  }

  isShowDifference() {
    return this.m_showDifference;
  }

  setEntityModel(model, nivs = null) {
    if (this.entity != null) {
      return this.entity;
    }

    let builder = NormalEntityNode.s_entityBuilder;
    let normalEntity = builder.createNormalEntity(model, nivs);
    this.m_entityMaterial = builder.getEntityMaterial();
    this.rsc.addEntity(normalEntity);
    this.readyCreateNormalLine(model);
    this.entity = normalEntity;
    this.m_uid = this.entity.getUid();
    this.applyEvt(this.entity);
    return this.entity;
  }

  select() {
    this.m_normalScale0 = this.m_normalScale;
  }

  applyNormalLineScale(s) {
    s *= this.m_normalScale0;
    this.m_normalScale = s;
    if (this.m_normalMaterial != null) this.m_normalMaterial.setLength(s);
  }

  flipNormal(boo) {
    this.m_normalFlip = boo;
    let s = boo ? -1.0 : 1.0;
    if (this.m_normalMaterial != null) this.m_normalMaterial.setScale(s);
    this.m_entityMaterial.setNormalScale(s);
  }

  isNormalFlipping() {
    return this.m_normalFlip;
  }

  setNormalLineColor(c) {
    if (this.m_normalMaterial != null) this.m_normalMaterial.setColor(c);
  }

  readyCreateNormalLine(model) {
    this.m_model = model;
  }

  createNormalLine(size = 5) {
    if (this.m_normalLine == null) {
      // console.log("XXXXXX create normal line");
      let m = this.m_model;
      let builder = NormalEntityNode.s_entityBuilder;
      this.m_normalLine = builder.createNormalLineEntity(this.entity, m.vertices, m.normals, size);
      this.m_normalMaterial = builder.getNormalLineMaterial();
      this.m_normalScale = builder.getNormalLineScale();

      if (this.m_normalLine.getMesh() != null) {
        this.rsc.addEntity(this.m_normalLine);
      }
    }
  }

  applyEvt(entity) {
    let ME = CoRScene.MouseEvent;
    entity.addEventListener(ME.MOUSE_OVER, this, this.mouseOverTargetListener);
    entity.addEventListener(ME.MOUSE_OUT, this, this.mouseOutTargetListener);
    entity.addEventListener(ME.MOUSE_DOWN, this, this.mouseDownTargetListener); // entity.addEventListener(ME.MOUSE_UP, this, this.mouseUpTargetListener);
  }

  mouseOverTargetListener(evt) {
    this.m_entityMaterial.setRGB3f(0.8, 0.8, 0.8);
  }

  mouseOutTargetListener(evt) {
    this.m_entityMaterial.setRGB3f(0.7, 0.7, 0.7);
  }

  mouseDownTargetListener(evt) {
    // console.log("mouseDownTargetListener()..., evt.target: ", evt.target);
    let entity = evt.target;
    this.transUI.selectEntities([entity]);
  } // private mouseUpTargetListener(evt: any): void {
  // 	console.log("mouseUpTargetListener() mouse up...");
  // }


  setPosition(pv) {
    if (this.entity != null) {
      this.entity.setPosition(pv);
    }
  }

  getPosition(pv) {
    if (this.entity != null) {
      return this.entity.getPosition(pv);
    }

    return pv;
  }

  update() {
    if (this.entity != null) {
      this.entity.update();
    }
  }

  destroy() {
    this.rsc = null;

    if (this.entity != null) {
      this.rsc.removeEntity(this.entity);
      this.rsc.removeEntity(this.m_normalLine);
      this.entity.destroy();
      this.m_normalLine.destroy();
      this.entity = null;
      this.m_normalLine = null;
    }
  }

}

NormalEntityNode.s_entityBuilder = new NormalEntityBuilder_1.NormalEntityBuilder();
exports.NormalEntityNode = NormalEntityNode;

/***/ }),

/***/ "4709":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class NVUIRectLine {
  constructor() {
    this.m_entity = null;
    this.m_pz = 0.0;
    this.m_flag = false;
    this.m_prePos = CoMath.createVec3();
    this.m_currPos = CoMath.createVec3();
    this.m_enabled = false;
    this.bounds = CoMath.createAABB();
  }

  initialize(rscene) {
    if (this.m_entity == null) {
      this.m_rscene = rscene;
      this.m_entity = CoEntity.createDisplayEntity();
      CoMesh.line.dynColorEnabled = true;
      let material = CoMaterial.createLineMaterial(CoMesh.line.dynColorEnabled);
      CoMesh.line.setBufSortFormat(material.getBufSortFormat());
      let mesh = CoMesh.line.createRectXOY(0, 0, 1, 1);
      this.m_entity.setMaterial(material);
      this.m_entity.setMesh(mesh);
      rscene.addEntity(this.m_entity);
      this.disable();
    }
  }

  enable() {
    this.m_enabled = true;
  }

  disable() {
    this.m_enabled = false;
    this.setVisible(false);
  }

  isEnabled() {
    return this.m_enabled;
  }

  isSelectEnabled() {
    return this.m_flag && this.m_enabled && CoMath.Vector3D.Distance(this.m_prePos, this.m_currPos) > 0.98;
  }

  setVisible(v) {
    if (this.m_entity != null) {
      this.m_entity.setVisible(v);
    }
  }

  isVisible() {
    if (this.m_entity != null) {
      return this.m_entity.getVisible();
    }

    return false;
  }

  setZ(pz) {
    this.m_pz = pz;
  }

  begin(px, py) {
    this.m_flag = true;

    if (this.m_enabled) {
      this.m_prePos.setXYZ(px, py, this.m_pz); // this.m_currPos.copyFrom( this.m_prePos );

      this.move(px, py);
    }
  }

  end(px, py) {
    if (this.m_enabled) {
      this.setVisible(false);
    }

    this.m_flag = false;
  }

  move(px, py) {
    const v = this.m_prePos;

    if (this.m_enabled && this.m_flag && CoMath.Vector3D.DistanceXYZ(v.x, v.y, 0, px, py, 0) > 1.0) {
      if (this.m_entity != null) {
        this.m_currPos.setXYZ(px, py, 0);
        this.setVisible(true);
        let b = this.bounds;
        b.reset();
        b.addPosition(this.m_prePos);
        b.addXYZ(px, py, 0);
        b.updateFast();
        let et = this.m_entity;
        et.setScaleXYZ(b.getWidth(), b.getHeight(), 1.0);
        et.setPosition(b.min);
        et.update();
      }
    }
  }

}

exports.NVUIRectLine = NVUIRectLine;

/***/ }),

/***/ "4cf3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class NormalEntityLayout {
  constructor() {
    this.m_scaleV = null;
    this.m_tempMat = null;
    this.m_currMat = null;
    this.m_aabb = null;
    this.m_sizeScale = 1.0;
    this.rotationEnabled = false;
  }

  initialize() {
    this.m_scaleV = CoRScene.createVec3();
    this.m_tempMat = CoRScene.createMat4();
    this.m_currMat = CoRScene.createMat4();
    this.m_aabb = CoRScene.createAABB();
    this.m_scaleV = CoRScene.createVec3();
  }

  getAABB() {
    return this.m_aabb;
  }

  calcAABB(entities, transforms) {
    let mat = this.m_tempMat;
    let transform;
    let currMat = this.m_currMat;
    let aabb = this.m_aabb;

    for (let k = 0; k < entities.length; ++k) {
      // transform = transforms[ k ];
      // if(transform != null) {
      // 	mat.identity();
      // 	mat.setRotationEulerAngle(0.5 * Math.PI, 0.0,0.0);
      // 	currMat.copyFrom(transform);
      // 	currMat.append(mat);				
      // 	entities[k].getTransform().setParentMatrix(currMat);
      // 	entities[k].update();
      // }
      entities[k].update();
      if (k > 0) aabb.union(entities[k].getGlobalBounds());else aabb.copyFrom(entities[k].getGlobalBounds());
    }

    aabb.update();
    return aabb;
  }

  fixToPosition(entities, transforms, fixV3, baseSize = 300.0) {
    let mat = this.m_tempMat;
    let transform;
    let currMat = this.m_currMat;
    let aabb = this.m_aabb;

    for (let k = 0; k < entities.length; ++k) {
      transform = transforms[k];
      mat.identity();

      if (this.rotationEnabled) {
        mat.setRotationEulerAngle(0.5 * Math.PI, 0.0, 0.0);
      }

      if (transform != null) {
        currMat.copyFrom(transform);
        currMat.append(mat);
        entities[k].getTransform().setParentMatrix(currMat);
      } else {
        currMat.copyFrom(mat);
        entities[k].getTransform().setParentMatrix(currMat);
      }

      entities[k].update();
      if (k > 0) aabb.union(entities[k].getGlobalBounds());else aabb.copyFrom(entities[k].getGlobalBounds());
    }

    aabb.update();
    let sx = baseSize / aabb.getWidth();
    let sy = baseSize / aabb.getHeight();
    let sz = baseSize / aabb.getLong();
    sx = Math.min(sx, sy, sz);
    this.m_sizeScale = sx;
    this.m_scaleV.setXYZ(sx, sx, sx);
    let cv = aabb.center;
    let offsetV = CoRScene.createVec3(fixV3.x - cv.x, fixV3.y - cv.y, fixV3.z - cv.z);
    offsetV.scaleBy(sx);

    for (let k = 0; k < entities.length; ++k) {
      transform = transforms[k];
      mat.identity();
      mat.setScale(this.m_scaleV);

      if (this.rotationEnabled) {
        mat.setRotationEulerAngle(0.5 * Math.PI, 0.0, 0.0);
      }

      mat.setTranslation(offsetV);

      if (transform != null) {
        currMat.copyFrom(transform);
        currMat.append(mat); // entities[k].getTransform().setParentMatrix(currMat);
      } else {
        currMat.copyFrom(mat); // entities[k].getTransform().setParentMatrix(currMat);
      }

      let params = currMat.decompose(CoMath.OrientationType.EULER_ANGLES);
      entities[k].setScale3(params[2]);
      entities[k].setRotation3(params[1]);
      entities[k].setPosition(params[0]);
      entities[k].getTransform().setParentMatrix(null);
      entities[k].update();
      if (k > 0) aabb.union(entities[k].getGlobalBounds());else aabb.copyFrom(entities[k].getGlobalBounds());
    }

    aabb.update();
  }

  getSizeScale() {
    return this.m_sizeScale;
  }

}

exports.NormalEntityLayout = NormalEntityLayout;

/***/ }),

/***/ "4f1c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const NormalEntityGroup_1 = __webpack_require__("9737");

const DropModelFileController_1 = __webpack_require__("d755");

const NormalEntityManager_1 = __webpack_require__("a23c");

const NormalExampleGroup_1 = __webpack_require__("8468");

class NormalEntityScene {
  constructor(uiscene, vcoapp) {
    this.m_uiscene = null;
    this.m_dropController = new DropModelFileController_1.DropModelFileController();
    this.m_groups = [];
    this.entityManager = new NormalEntityManager_1.NormalEntityManager();
    this.exampleGroup = new NormalExampleGroup_1.NormalExampleGroup();
    this.m_uiscene = uiscene;
    this.m_coapp = vcoapp;
  }

  getUIScene() {
    return this.m_uiscene;
  }

  initialize(rscene) {
    this.rscene = rscene;
    this.entityManager.ctrPanel = this.ctrPanel;
    this.entityManager.transUI = this.transUI;
    this.entityManager.rsc = rscene;
    this.entityManager.initialize();
    this.init();
    this.entityManager.rsc = rscene; // for test
    // this.initModel();

    this.exampleGroup.entityManager = this.entityManager;
    this.exampleGroup.initialize(rscene, this.transUI);
    let canvas = this.rscene.getCanvas();
    this.m_dropController.initialize(canvas, this);
  }

  resetScene() {}

  initModel() {
    let baseUrl = "static/private/";
    let url = baseUrl + "obj/base.obj";
    url = baseUrl + "obj/base4.obj";
    url = baseUrl + "fbx/base4.fbx"; // url = "static/private/fbx/base3.fbx";
    // url = "static/assets/obj/apple_01.obj";
    // url = "static/private/fbx/handbag_err.fbx";
    // url = "static/private/fbx/hat_hasNormal.fbx";
    // url = "static/private/fbx/hat_hasNotNormal.fbx";
    // url = "static/private/ctm/errorNormal.ctm";

    console.log("initModel() init...");
    this.loadModels([url]);
  }

  loadModels(urls, typeNS = "") {
    let group = new NormalEntityGroup_1.NormalEntityGroup(this.m_coapp);
    group.rsc = this.rscene;
    group.uiscene = this.m_uiscene;
    group.transUI = this.transUI;
    group.ctrPanel = this.ctrPanel;
    group.entityManager = this.entityManager;
    group.loadModels(urls, typeNS);
    this.m_groups.push(group);
    this.transUI.deselect();
    this.exampleGroup.setEnabled(false);
  }

  isDropEnabled() {
    return true;
  }

  initFileLoad(files) {
    console.log("initFileLoad(), files.length: ", files.length);
    let flag = 1;

    if (files.length > 0) {
      let name = "";
      let urls = [];

      for (let i = 0; i < files.length; i++) {
        if (i == 0) name = files[i].name;
        const urlObj = window.URL.createObjectURL(files[i]);
        urls.push(urlObj);
      }

      if (name != "") {
        name.toLocaleLowerCase();
        let typeNS = "";

        if (name.indexOf(".ctm") > 1) {
          typeNS = "ctm";
        } else if (name.indexOf(".fbx") > 1) {
          typeNS = "fbx";
        } else if (name.indexOf(".obj") > 1) {
          typeNS = "obj";
        } else if (name.indexOf(".drc") > 1) {
          typeNS = "drc";
        } else {
          flag = 31;
        }

        if (flag == 1) {
          let sc = this; // sc.resetScene();

          sc.loadModels(urls, typeNS);
        }
      } else {
        flag = 31;
      }
    } else {
      flag = 31;
    }

    this.m_dropController.alertShow(flag);
  }

  init() {}

  open() {}

  isOpen() {
    return true;
  }

  close() {}

  destroy() {
    this.entityManager.destroy();
  }

  update() {}

}

exports.NormalEntityScene = NormalEntityScene;

/***/ }),

/***/ "5627":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class NormalEntityMaterial {
  constructor() {
    this.m_data = new Float32Array([1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0]);
  }

  setNormalScale(s) {
    this.m_data[6] = s;
  }

  setRGB3f(pr, pg, pb) {
    this.m_data[0] = pr;
    this.m_data[1] = pg;
    this.m_data[2] = pb;
  }

  getRGB3f(color) {
    let ds = this.m_data;
    color.setRGB3f(ds[0], ds[1], ds[2]);
  }

  getRGBA4f(color) {
    color.fromArray(this.m_data);
  }

  setLength(length) {
    this.m_data[3] = length;
  }

  getLegnth() {
    return this.m_data[3];
  }

  setColor(color) {
    color.toArray3(this.m_data);
  }

  getColor(color) {
    color.fromArray3(this.m_data);
  }

  applyLocalNormal() {
    // console.log("apply local normal..., dif: ", this.m_data[5]);
    this.m_data[7] = 0.0;
  }

  applyGlobalNormal() {
    // console.log("apply global normal..., dif: ", this.m_data[5]);
    this.m_data[7] = 1.0;
  }

  applyModelColor() {
    this.m_data[4] = 1.0; // console.log("apply model color..., dif: ", this.m_data[5]);
  }

  applyNormalColor() {
    this.m_data[4] = 0.0; // console.log("apply normal color..., dif: ", this.m_data[5]);
  }

  applyDifference(boo = true) {
    this.m_data[5] = boo ? 1.0 : 0.0; // console.log("apply diff boo: ", boo);
  }
  /**
   * @param textureEnabled the default value is false
   */


  create() {
    if (this.material == null) {
      let textureEnabled = false;
      let material = CoRScene.createShaderMaterial("normal_entity_material");
      material.addUniformDataAt("u_params", this.m_data);
      material.setShaderBuilder(coderBuilder => {
        let coder = coderBuilder.getShaderCodeBuilder();
        coder.addVertLayout("vec3", "a_uvs");
        coder.addVertLayout("vec3", "a_nvs");
        coder.addVertUniform("vec4", "u_params", 2);
        coder.addFragUniform("vec4", "u_params", 2);
        coder.addVarying("vec4", "v_nv");
        coder.addVarying("vec3", "v_vnv");
        coder.addVarying("vec3", "v_dv");
        coder.addFragOutputHighp("vec4", "FragColor0");
        coder.addFragHeadCode(`
				const vec3 gama = vec3(1.0/2.2);
				const vec3 direc0 = normalize(vec3(-0.3,-0.6,0.9));
				const vec3 direc1 = normalize(vec3(0.3,0.6,0.9));
					`);
        coder.addFragMainCode(`
			bool facing = gl_FrontFacing;
    		vec2 dv = fract(gl_FragCoord.xy/vec2(5.0)) - vec2(0.5);
    		vec2 f2 = sign(dv);
    
    		vec3 nv = normalize(v_nv.xyz);
    		vec3 color = pow(nv, gama);

			float nDotL0 = max(dot(v_vnv.xyz, direc0), 0.1);
			float nDotL1 = max(dot(v_vnv.xyz, direc1), 0.1);
			nDotL0 = 0.7 * (nDotL0 + nDotL1);
			vec3 modelColor = u_params[0].xyz * vec3(nDotL0);
			vec4 param = u_params[1];

    		vec3 frontColor = param.x > 0.5 ? modelColor : color.xyz;
    		vec3 backColor = param.y > 0.5 ? vec3(sign(f2.x * f2.y), 1.0, 1.0) : frontColor;
    		vec3 dstColor = facing ? frontColor : backColor;
			
			frontColor = param.y > 0.5 ? dstColor : modelColor;
			dstColor = param.x > 0.5 ? frontColor : dstColor;
			
			float f = v_dv.x;
			f = f < 0.8 ? 1.0 : 0.0;
			// vec3 diffColor = vec3(1.0, 0.0, 0.0) * f + dstColor * (1.0 - f);
			float s = sign(f2.x * f2.y);
			vec3 diffColor = vec3(1.0, s, s) * f + dstColor * (1.0 - f);
			dstColor = param.y > 0.5 ? diffColor : dstColor;

    		FragColor0 = vec4(dstColor, 1.0);
    		// FragColor0 = vec4(u_params[0].xyz, 1.0);
					`);
        coder.addVertMainCode(`
			mat4 vmat = u_viewMat * u_objMat;
			viewPosition = vmat * vec4(a_vs,1.0);
			vec3 puvs = a_uvs;
			vec3 pnv = u_params[1].zzz * a_nvs;
			v_dv = vec3(dot(normalize(a_uvs), normalize( pnv )));
			vec4 pv = u_projMat * viewPosition;			
			gl_Position = pv;
			v_vnv = normalize(pnv * inverse(mat3(vmat)));
			pnv = u_params[1].w < 0.5 ? pnv : normalize(pnv * inverse(mat3(u_objMat)));
			v_nv = vec4(pnv, 1.0);
					`);
      });
      material.initializeByCodeBuf(textureEnabled);
      this.material = material;
    }

    return this.material;
  }

}

exports.NormalEntityMaterial = NormalEntityMaterial;

/***/ }),

/***/ "5dcb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UserEditEvent_1 = __webpack_require__("268d");

const NVUIRectLine_1 = __webpack_require__("4709");

const NVRectFrameQuery_1 = __webpack_require__("259d");
/**
 * NVTransUI
 */


class NVTransUI {
  // tip: IRectTextTip = null;
  constructor() {
    this.m_rsc = null;
    this.m_editUIRenderer = null;
    this.m_uirsc = null;
    this.m_coUIScene = null;
    this.m_outline = null;
    this.m_transCtr = null;
    this.m_selectFrame = null;
    this.m_transBtns = [];
    this.m_entityQuery = null;
    this.m_selectList = null;
    this.m_selectListeners = [];
  }

  setOutline(outline) {
    this.m_outline = outline;
  }

  initialize(rsc, editUIRenderer, coUIScene) {
    if (this.m_coUIScene == null) {
      this.m_rsc = rsc;
      this.m_editUIRenderer = editUIRenderer;
      this.m_coUIScene = coUIScene;
      this.init();
    }
  }

  init() {
    this.m_rsc.addEventListener(CoRScene.KeyboardEvent.KEY_DOWN, this, this.keyDown);
    this.m_rsc.addEventListener(CoRScene.MouseEvent.MOUSE_BG_CLICK, this, this.mouseClickListener);
    this.m_rsc.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.mouseUpListener, true, true);
    let editsc = this.m_editUIRenderer;
    this.m_transCtr = CoEdit.createTransformController();
    this.m_transCtr.initialize(editsc);
    this.m_transCtr.addEventListener(UserEditEvent_1.UserEditEvent.EDIT_BEGIN, this, this.editBegin);
    this.m_transCtr.addEventListener(UserEditEvent_1.UserEditEvent.EDIT_END, this, this.editEnd);
    this.m_prevPos = CoMath.createVec3();
    this.m_currPos = CoMath.createVec3();
    this.m_keyInterac = CoUIInteraction.createKeyboardInteraction();
    this.m_keyInterac.initialize(this.m_rsc);
    let Key = CoRScene.Keyboard;
    let type = this.m_keyInterac.createKeysEventType([Key.CTRL, Key.Y]);
    this.m_keyInterac.addKeysDownListener(type, this, this.keyCtrlYDown);
    type = this.m_keyInterac.createKeysEventType([Key.CTRL, Key.Z]);
    this.m_keyInterac.addKeysDownListener(type, this, this.keyCtrlZDown);
    this.m_recoder = CoEdit.createTransformRecorder();
    this.initUI();
  }

  keyCtrlZDown(evt) {
    this.m_recoder.undo();
    let list = this.m_recoder.getCurrList();
    this.selectEntities(list);
  }

  keyCtrlYDown(evt) {
    this.m_recoder.redo();
    let list = this.m_recoder.getCurrList();
    this.selectEntities(list);
  }

  getRecoder() {
    return this.m_recoder;
  }

  editBegin(evt) {
    let st = this.m_rsc.getStage3D();
    this.m_prevPos.setXYZ(st.mouseX, st.mouseY, 0);
  }

  editEnd(evt) {
    let st = this.m_rsc.getStage3D();
    this.m_currPos.setXYZ(st.mouseX, st.mouseY, 0);

    if (CoMath.Vector3D.Distance(this.m_prevPos, this.m_currPos) > 0.5) {
      let list = evt.currentTarget.getTargetEntities();
      this.m_recoder.save(list);
    }
  }

  initUI() {
    this.m_uirsc = this.m_coUIScene.rscene;
    this.m_entityQuery = new NVRectFrameQuery_1.NVRectFrameQuery();
    this.m_entityQuery.initialize(this.m_rsc);
    let rsc = this.m_uirsc;
    this.m_rsc.addEventListener(CoRScene.MouseEvent.MOUSE_BG_DOWN, this, this.uiMouseDownListener);
    rsc.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.uiMouseUpListener);
    rsc.addEventListener(CoRScene.MouseEvent.MOUSE_MOVE, this, this.uiMouseMoveListener);

    if (this.m_selectFrame == null) {
      this.m_selectFrame = new NVUIRectLine_1.NVUIRectLine();
      this.m_selectFrame.initialize(this.m_uirsc);
      this.m_selectFrame.setZ(-0.5);
      this.m_selectFrame.enable();
    }

    this.initTransUI();
  }

  initTransUI() {
    this.m_btnGroup = CoUI.createSelectButtonGroup();
    let uiScene = this.m_coUIScene;
    let tta = uiScene.transparentTexAtlas;
    let pw = 90;
    let ph = 70;
    let urls = ["框选", "移动", "旋转", "缩放"];
    let keys = ["select", "move", "rotate", "scale"];
    let infos = ["Select items using box selection.", "Move selected items(W).", "Rotate selected items(R).", "Scale(resize) selected items(E)."];
    let fontColor = CoMaterial.createColor4().setRGB3Bytes(170, 170, 170);
    ;
    let bgColor = CoMaterial.createColor4(1, 1, 1, 0);

    for (let i = 0; i < urls.length; ++i) {
      let img = tta.createCharsCanvasFixSize(pw, ph, urls[i], 30, fontColor, bgColor);
      tta.addImageToAtlas(urls[i], img);
    }

    let px = 5;
    let py = (5 + ph) * 4;
    ph = 5 + ph;

    for (let i = 0; i < urls.length; ++i) {
      let btn = this.crateBtn(urls, pw, ph, px, py - ph * i, i, keys[i], infos[i]);

      if (i > 0) {
        this.m_transBtns.push(btn);
        this.m_btnGroup.addButton(btn);
      }
    }

    this.m_btnGroup.setSelectedFunction(btn => {
      let label;
      label = btn.getLable();
      label.getColorAt(0).setRGB3Bytes(71, 114, 179);
      label.setClipIndex(0);
      this.selectTrans(btn.uuid);
    }, btn => {
      let label;
      label = btn.getLable();
      label.getColorAt(0).setRGB3Bytes(40, 40, 40);
      label.setClipIndex(0);
    });
    this.m_btnGroup.select(keys[1]);
  }

  uiMouseDownListener(evt) {
    this.m_selectFrame.begin(evt.mouseX, evt.mouseY); // console.log("NVTransUI::uiMouseDownListener(), evt: ", evt);
    // console.log("ui down (x, y): ", evt.mouseX, evt.mouseY);
  }

  uiMouseUpListener(evt) {
    // console.log("NVTransUI::uiMouseUpListener(), evt: ", evt);
    // console.log("ui up (x, y): ", evt.mouseX, evt.mouseY);
    if (this.m_selectFrame.isSelectEnabled()) {
      let b = this.m_selectFrame.bounds;
      let list = this.m_entityQuery.getEntities(b.min, b.max);
      this.selectEntities(list);
    }

    this.m_selectFrame.end(evt.mouseX, evt.mouseY);
  }

  uiMouseMoveListener(evt) {
    // console.log("NVTransUI::uiMouseMoveListener(), evt: ", evt);
    // console.log("ui move (x, y): ", evt.mouseX, evt.mouseY);
    this.m_selectFrame.move(evt.mouseX, evt.mouseY);
  }

  crateBtn(urls, pw, ph, px, py, labelIndex, idns, info) {
    let colorClipLabel = CoUI.createClipColorLabel();
    colorClipLabel.initializeWithoutTex(pw, ph, 4);
    colorClipLabel.getColorAt(0).setRGB3Bytes(40, 40, 40);
    colorClipLabel.getColorAt(1).setRGB3Bytes(50, 50, 50);
    colorClipLabel.getColorAt(2).setRGB3Bytes(40, 40, 60);
    let tta = this.m_coUIScene.transparentTexAtlas;
    let iconLable = CoUI.createClipLabel();
    iconLable.transparent = true;
    iconLable.premultiplyAlpha = true;
    iconLable.initialize(tta, [urls[labelIndex]]); // let tipInfo = new TipInfo().alignRight().setContent(info);
    // let tipInfo = CoUI.createTipInfo().alignRight().setContent(info);

    let btn = CoUI.createButton();
    btn.uuid = idns;
    btn.info = CoUI.createTipInfo().alignRight().setContent(info);
    btn.addLabel(iconLable);
    btn.initializeWithLable(colorClipLabel);
    btn.setXY(px, py);
    this.m_coUIScene.addEntity(btn, 1);
    this.m_coUIScene.tips.addTipsTarget(btn); // this.tip.addEntity( btn );
    // const ME = CoRScene.MouseEvent;
    // btn.addEventListener(ME.MOUSE_UP, this, this.btnMouseUpListener);
    // btn.addEventListener(ME.MOUSE_OUT, this.tip, this.tip.targetMouseOut);
    // btn.addEventListener(ME.MOUSE_OVER, this.tip, this.tip.targetMouseOver);
    // btn.addEventListener(ME.MOUSE_MOVE, this.tip, this.tip.targetMouseMove);

    return btn;
  }

  selectTrans(uuid) {
    switch (uuid) {
      case "move":
        this.m_transCtr.toTranslation();
        break;

      case "scale":
        this.m_transCtr.toScale();
        break;

      case "rotate":
        this.m_transCtr.toRotation();
        break;

      default:
        break;
    }

    if (this.m_selectList == null) {
      this.m_transCtr.disable();
    }
  }

  keyDown(evt) {
    console.log("NVTransUI::keyDown() ..., evt.keyCode: ", evt.keyCode);
    let KEY = CoRScene.Keyboard;

    switch (evt.keyCode) {
      case KEY.W:
        this.m_btnGroup.select(this.m_transBtns[0].uuid);
        break;

      case KEY.R:
        this.m_btnGroup.select(this.m_transBtns[1].uuid);
        break;

      case KEY.E:
        this.m_btnGroup.select(this.m_transBtns[2].uuid);
        break;

      default:
        break;
    }
  }

  addSelectListener(listener) {
    if (listener != null) {
      this.m_selectListeners.push(listener);
    }
  }

  sendSelectList(list) {
    let ls = this.m_selectListeners;
    let len = ls.length;

    for (let i = 0; i < len; ++i) {
      ls[i](list);
    }
  }

  selectEntities(list) {
    this.m_selectList = list;

    if (list != null && list.length > 0) {
      let transCtr = this.m_transCtr;
      let pos = CoMath.createVec3();
      let pv = CoMath.createVec3();

      for (let i = 0; i < list.length; ++i) {
        pos.addBy(pv.copyFrom(list[i].getGlobalBounds().center));
      }

      pos.scaleBy(1.0 / list.length);

      if (transCtr != null) {
        transCtr.select(list, pos);
        this.m_outline.select(list);
      }

      this.sendSelectList(list);
    } else {
      this.sendSelectList(null);
    }
  }

  mouseUpListener(evt) {
    // console.log("NVTransUI::mouseUpListener() ...");
    if (this.m_transCtr != null) {
      this.m_transCtr.decontrol();
    }
  }

  mouseClickListener(evt) {
    this.deselect();
  }

  deselect() {
    this.m_selectList = null;

    if (this.m_transCtr != null) {
      this.m_transCtr.disable();
    }

    this.m_outline.deselect();
    this.sendSelectList(null);
  }

  run() {
    if (this.m_transCtr != null) {
      this.m_transCtr.run();
    }
  }

}

exports.NVTransUI = NVTransUI;

/***/ }),

/***/ "5e13":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UIEntityBase_1 = __webpack_require__("b0fb");

class UIEntityContainer extends UIEntityBase_1.UIEntityBase {
  constructor() {
    super();
    this.m_uientities = [];
  }

  init() {
    if (this.isIniting()) {
      super.init();
      this.m_rcontainer = CoRScene.createDisplayEntityContainer();
    }
  }

  addedEntity(entity) {}

  removedEntity(entity) {}

  addEntity(entity) {
    if (entity != null) {
      let i = 0;

      for (; i < this.m_uientities.length; ++i) {
        if (this.m_uientities[i] == entity) break;
      }

      if (i >= this.m_uientities.length) {
        this.m_uientities.push(entity);
        entity.update();
        let container = entity.getRContainer();

        if (container != null) {
          this.m_rcontainer.addChild(container);
        }

        let ls = entity.getREntities();

        for (let k = 0; k < ls.length; ++k) {
          this.m_rcontainer.addEntity(ls[k]);
        }

        this.addedEntity(entity);
      }
    }
  }

  removeEntity(entity) {
    if (entity != null) {
      let i = 0;

      for (; i < this.m_uientities.length; ++i) {
        if (this.m_uientities[i] == entity) {
          this.m_uientities.splice(i, 1);
          let container = entity.getRContainer();

          if (container != null) {
            this.m_rcontainer.removeChild(container);
          }

          let ls = entity.getREntities();

          for (let k = 0; k < ls.length; ++k) {
            this.m_rcontainer.removeEntity(ls[k]);
          }

          this.removedEntity(entity);
          break;
        }
      }
    }
  }

  globalToLocal(pv) {
    this.m_rcontainer.globalToLocal(pv);
  }

  localToGlobal(pv) {
    this.m_rcontainer.localToGlobal(pv);
  }

  getEneitysTotal() {
    return this.m_uientities.length;
  }

}

exports.UIEntityContainer = UIEntityContainer;

/***/ }),

/***/ "67d8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UIEntityBase_1 = __webpack_require__("b0fb");

class ClipLabelBase extends UIEntityBase_1.UIEntityBase {
  constructor() {
    super();
    this.m_index = 0;
    this.m_total = 0;
    this.m_step = 6;
    this.m_vtCount = 0;
    this.m_sizes = null;
    this.uuid = "label";
  }

  createVS(startX, startY, pwidth, pheight) {
    let minX = startX;
    let minY = startY;
    let maxX = startX + pwidth;
    let maxY = startY + pheight;
    let pz = 0.0;
    return [minX, minY, pz, maxX, minY, pz, maxX, maxY, pz, minX, maxY, pz];
  }

  setClipIndex(i) {}

  setCircleClipIndex(i) {
    i %= this.m_total;
    i += this.m_total;
    i %= this.m_total;
    this.setClipIndex(i);
  }

  getClipIndex() {
    return this.m_index;
  }

  getClipsTotal() {
    return this.m_total;
  }

  getClipWidthAt(i) {
    if (this.m_sizes != null) {
      if (i >= 0 && i < this.m_total) {
        i = i << 1;
        return this.m_sizes[i];
      }
    } else {
      return this.m_width;
    }
  }

  getClipHeightAt(i) {
    if (this.m_sizes != null) {
      if (i >= 0 && i < this.m_total) {
        i = i << 1;
        return this.m_sizes[i + 1];
      }
    } else {
      return this.m_height;
    }
  }

  getClipWidth() {
    return this.m_width;
  }

  getClipHeight() {
    return this.m_height;
  }
  /*
  getWidth(): number {
      return this.m_width * this.m_sx;
  }
  getHeight(): number {
      return this.m_height * this.m_sy;
  }
    setPosition(pv: IVector3D): void {
      this.m_pos.copyFrom(pv);
      let ls = this.m_entities;
      for (let i = 0; i < ls.length; ++i) {
          ls[i].setPosition(pv);
      }
  }
  setX(x: number): void {
      this.m_pos.x = x;
      this.setPosition(this.m_pos);
  }
  setY(y: number): void {
      this.m_pos.y = y;
      this.setPosition(this.m_pos);
  }
  setZ(z: number): void {
      this.m_pos.z = z;
      this.setPosition(this.m_pos);
  }
  getX(): number {
      return this.m_pos.x;
  }
  getY(): number {
      return this.m_pos.y;
  }
  getZ(): number {
      return this.m_pos.z;
  }
  setXY(px: number, py: number): void {
      this.m_pos.x = px;
      this.m_pos.y = py;
      this.setPosition(this.m_pos);
  }
  getPosition(pv: IVector3D): void {
      pv.copyFrom(this.m_pos);
  }
  setRotation(r: number): void {
      this.m_rotation = r;
      let ls = this.m_entities;
      for (let i = 0; i < ls.length; ++i) {
          ls[i].setRotationXYZ(0, 0, r);
      }
  }
  getRotation(): number {
      return this.m_rotation;
  }
  setScaleXYZ(sx: number, sy: number, sz: number): void {
      let ls = this.m_entities;
      for (let i = 0; i < ls.length; ++i) {
          ls[i].setScaleXYZ(sx, sy, sz);
      }
  }
  setScaleXY(sx: number, sy: number): void {
      this.m_sx = sx;
      this.m_sy = sy;
      this.setScaleXYZ(sx, sy, 1.0);
  }
  setScaleX(sx: number): void {
      this.m_sx = sx;
      this.setScaleXYZ(this.m_sx, this.m_sy, 1.0);
  }
  setScaleY(sy: number): void {
      this.m_sy = sy;
      this.setScaleXYZ(this.m_sx, this.m_sy, 1.0);
  }
  getScaleX(): number {
      return this.m_sx;
  }
  getScaleY(): number {
      return this.m_sy;
  }
  
  copyTransformFrom(src: IUIEntity): void {
      if(src != null) {
          if(this.m_v0 == null) {
              this.m_v0 = CoMath.createVec3();
          }
          let sx = src.getScaleX();
          let sy = src.getScaleY();
          let r = src.getRotation();
          this.setScaleXY(sx, sy);
          this.setRotation(r);
          src.getPosition( this.m_v0 );
          this.setPosition( this.m_v0 );
      }
  }
  // /**
  //  * get renderable entities for renderer scene
  //  * @returns ITransformEntity instance list
  //  */
  // getREntities(): ITransformEntity[] {
  // 	return this.m_entities.slice(0);
  // }
  // getRContainer(): IDisplayEntityContainer {
  // 	return null;
  // }
  // update(): void {
  // 	let ls = this.m_entities;
  // 	for (let i = 0; i < ls.length; ++i) {
  // 		ls[i].update();
  // 	}
  // }
  // destroy(): void {
  // 	this.m_sizes = null;
  // 	this.m_total = 0;
  // 	let ls = this.m_entities;
  // 	if (ls != null) {
  // 		for (let i = 0; i < ls.length; ++i) {
  // 			ls[i].update();
  // 		}
  // 	}
  // }


  destroy() {
    this.m_sizes = null;
    this.m_total = 0;
    super.destroy();
  }

}

exports.ClipLabelBase = ClipLabelBase;

/***/ }),

/***/ "7435":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const NormalCtrlPanel_1 = __webpack_require__("ab2b");

const NormalEntityScene_1 = __webpack_require__("4f1c");

class NormalViewerScene {
  constructor() {
    this.m_uiscene = null;
    this.m_ctrPanel = null;
    this.m_transUI = null;
  }

  getUIScene() {
    return this.m_uiscene;
  }

  initialize(uiscene, coapp, transUI) {
    if (this.m_uiscene == null) {
      this.m_uiscene = uiscene;
      this.m_coapp = coapp;
      this.m_transUI = transUI;
      this.entityScene = new NormalEntityScene_1.NormalEntityScene(uiscene, coapp);
      this.m_entityManager = this.entityScene.entityManager;
      this.initUI();
      this.entityScene.transUI = transUI;
    }
  }

  initUI() {
    let panel = new NormalCtrlPanel_1.NormalCtrlPanel();
    panel.initialize(this.m_uiscene, 0, 310, 390, 50);
    panel.setBGColor(CoMaterial.createColor4(0.2, 0.2, 0.2));
    panel.addEventListener(CoRScene.SelectionEvent.SELECT, this, this.selectDisplay);
    panel.addEventListener(CoRScene.ProgressDataEvent.PROGRESS, this, this.normalScale);
    this.m_ctrPanel = panel;
    this.entityScene.ctrPanel = panel;
  }

  selectDisplay(evt) {
    console.log("NormalViewerScene::selectDisplay(), evt.uuid: ", evt.uuid);
    let mana = this.m_entityManager;
    let uuid = evt.uuid;

    switch (uuid) {
      case "normal":
      case "model":
      case "difference":
      case "normalFlip":
        // console.log("flag call");
        mana.applyCtrlFlag(uuid, evt.flag);
        break;

      case "local":
      case "global":
      case "modelColor":
        // console.log("select call");
        mana.applyFeatureColor(uuid);
        break;

      case "normalScaleBtnSelect":
        console.log("XXXX normalScaleBtnSelect");
        mana.normalScaleBtnSelect();
        break;

      case "normalLineColor":
        console.log("appaly normal color");
        break;

      case "normalTest":
        this.m_uiscene.prompt.showPrompt("It can't be used now!");
        console.log("appaly normal data feature test");
        break;

      default:
        break;
    }
  }

  normalScale(evt) {
    // console.log("NormalViewerScene::normalScale(), evt.uuid: ", evt.uuid, evt.progress);
    // console.log("NormalViewerScene::normalScale(), evt.progress: ", evt.progress);
    let mana = this.m_entityManager;
    mana.applyNormalScale(evt.progress);
  }

  destroy() {
    this.m_uiscene = null;

    if (this.m_ctrPanel != null) {
      this.m_ctrPanel.destroy();
      this.m_ctrPanel = null;
      this.entityScene.destroy();
      this.entityScene = null;
    }
  }

  open(scene = null) {
    if (this.m_ctrPanel != null) {
      this.m_ctrPanel.open();
    }
  }

  isOpen() {
    return true;
  }

  close() {
    if (this.m_ctrPanel != null) {
      this.m_ctrPanel.close();
    }
  }

  update() {}

}

exports.NormalViewerScene = NormalViewerScene;

/***/ }),

/***/ "75f5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const PackedLoader_1 = __webpack_require__("2564");

class ModuleLoader extends PackedLoader_1.PackedLoader {
  /**
   * @param times 记录总共需要的加载完成操作的响应次数。这个次数可能是由load直接产生，也可能是由于别的地方驱动。
   * @param callback 完成所有响应的之后的回调
   */
  constructor(times, callback = null, urlChecker = null) {
    super(times, callback, urlChecker);
  }

  loadData(url) {
    let req = new XMLHttpRequest();
    req.open("GET", url, true);

    req.onerror = function (err) {
      console.error("load error: ", err);
    }; // req.onprogress = e => { };


    req.onload = evt => {
      this.loadedData(req.response, url);
      this.loadedUrl(url);
    };

    req.send(null);
  }

  loadedData(data, url) {
    console.log("ModuleLoader::loadedData(), module js file loaded, url: ", url);
    let scriptEle = document.createElement("script");

    scriptEle.onerror = evt => {
      console.error("module script onerror, e: ", evt);
    };

    scriptEle.type = "text/javascript";

    try {
      console.log("ModuleLoader::loadedData(), module compile A, url: ", url);
      scriptEle.innerHTML = data;
      document.head.appendChild(scriptEle);
      console.log("ModuleLoader::loadedData(), module compile B, url: ", url);
    } catch (e) {
      console.error("ModuleLoader::loadedData() apply script ele error.");
      throw e;
    }
  }

}

exports.ModuleLoader = ModuleLoader;

/***/ }),

/***/ "7c62":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CoSpaceAppData_1 = __webpack_require__("3347");

const CoModuleLoader_1 = __webpack_require__("2a2b");

class CoDataModule {
  constructor() {
    this.m_sysIniting = true;
    this.m_initInsFlag = true;
    this.m_initCalls = [];
  }
  /**
   * 初始化
   * @param sysInitCallback the default value is null
   * @param urlChecker the default value is null
   * @param deferredInit the default value is false
   */


  initialize(sysInitCallback = null, deferredInit = false) {
    this.m_sysInitCallback = sysInitCallback; // this.m_urlChecker = urlChecker;

    this.m_deferredInit = deferredInit;
    let modules = [{
      url: "static/cospace/core/coapp/CoSpaceApp.umd.js",
      name: CoSpaceAppData_1.CoModuleNS.coSpaceApp,
      type: CoSpaceAppData_1.CoModuleFileType.JS
    }, {
      url: "static/cospace/core/code/ThreadCore.umd.js",
      name: CoSpaceAppData_1.CoModuleNS.threadCore,
      type: CoSpaceAppData_1.CoModuleFileType.JS
    }, {
      url: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js",
      name: CoSpaceAppData_1.CoModuleNS.ctmParser,
      type: CoSpaceAppData_1.CoModuleFileType.JS
    }, {
      url: "static/cospace/modules/obj/ModuleOBJGeomParser.umd.min.js",
      name: CoSpaceAppData_1.CoModuleNS.objParser,
      type: CoSpaceAppData_1.CoModuleFileType.JS
    }, {
      url: "static/cospace/modules/png/ModulePNGParser.umd.js",
      name: CoSpaceAppData_1.CoModuleNS.pngParser,
      type: CoSpaceAppData_1.CoModuleFileType.JS
    }, {
      url: "static/cospace/modules/fbxFast/ModuleFBXGeomFastParser.umd.js",
      name: CoSpaceAppData_1.CoModuleNS.fbxFastParser,
      type: CoSpaceAppData_1.CoModuleFileType.JS
    }];
    this.m_modules = modules; // 初始化数据协同中心

    let dependencyGraphObj = {
      nodes: [{
        uniqueName: "dracoGeomParser",
        path: "static/cospace/modules/draco/ModuleDracoGeomParser.umd.js"
      }, {
        uniqueName: "dracoWasmWrapper",
        path: "static/cospace/modules/dracoLib/w2.js"
      }, {
        uniqueName: "ctmGeomParser",
        path: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js"
      }],
      maps: [{
        uniqueName: "dracoGeomParser",
        includes: [1]
      } // 这里[1]表示 dracoGeomParser 依赖数组中的第一个元素也就是 dracoWasmWrapper 这个代码模块
      ]
    };
    this.m_dependencyGraphObj = dependencyGraphObj;
    let loader = new CoModuleLoader_1.CoModuleLoader(1);
    let urlChecker = loader.getUrlChecker();

    if (urlChecker != null) {
      for (let i = 0; i < modules.length; ++i) {
        modules[i].url = urlChecker(modules[i].url);
      }

      let nodes = dependencyGraphObj.nodes;

      for (let i = 0; i < nodes.length; ++i) {
        nodes[i].path = urlChecker(nodes[i].path);
      }
    }

    if (!deferredInit) {
      this.loadSys();
    }
  }

  loadSys() {
    if (this.m_sysIniting) {
      new CoModuleLoader_1.CoModuleLoader(1, () => {
        this.initCoSpaceSys();
      }).load(this.m_modules[0].url);
      this.m_sysIniting = false;
    }
  }
  /**
   * 注意: 不建议过多使用这个函数,因为回调函数不安全如果是lambda表达式则由性能问题。
   * 立即获得CPU侧的数据单元实例, 但是数据单元中的数据可能是空的, 因为数据获取的操作实际是异步的。
   * 需要通过 isCpuPhase() 或者 isGpuPhase() 等函数来判定具体数据情况
   * @param url 数据资源url
   * @param dataFormat 数据资源类型
   * @param callback 数据资源接收回调函数, 其值建议为lambda函数表达式
   * @param immediate 是否立即返回数据, 默认是false
   * @returns 数据单元实例，用户只能访问不能更改这个实例内部的数据状态，如果必要则可以申请复制一份
   */


  getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate) {
    if (this.coappIns != null) {
      let unit = this.coappIns.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);

      if (this.m_deferredInit) {
        if (this.m_initInsFlag) {
          this.m_initInsFlag = false;
          let modules = this.m_modules;
          this.coappIns.initialize(3, modules[1].url, true);
        }
      }

      return unit;
    }

    return null;
  }

  deferredInit(callback) {
    if (this.coappIns == null) {
      this.m_initCalls.push(callback);
      this.loadSys();
    } else if (callback != null) {
      callback();
    }
  }

  initCoSpaceSys() {
    if (this.coappIns == null && typeof CoSpaceApp !== "undefined") {
      let coappIns = CoSpaceApp.createInstance();
      let modules = this.m_modules;
      let jsonStr = JSON.stringify(this.m_dependencyGraphObj);
      coappIns.setThreadDependencyGraphJsonString(jsonStr);
      coappIns.setTaskModuleParams(modules);

      if (!this.m_deferredInit) {
        coappIns.initialize(3, modules[1].url, true);
      }

      let t = this;
      t.coappIns = coappIns;

      for (let i = 0; i < this.m_initCalls.length; ++i) {
        if (this.m_initCalls[i] != null) {
          this.m_initCalls[i]();
        }
      }

      this.m_initCalls = [];
    }

    if (this.m_sysInitCallback != null) {
      this.m_sysInitCallback();
    }

    this.m_sysInitCallback = null;
  }

}

exports.CoDataModule = CoDataModule;
exports.default = CoDataModule;

/***/ }),

/***/ "8468":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const NormalEntityNode_1 = __webpack_require__("43c4");

class NormalExampleGroup {
  constructor() {
    this.m_rscene = null;
    this.m_visible = true;
    this.m_nodes = [];
    this.m_nodeEntities = [];
    this.m_textEntities = [];
    this.m_pv = null;
    this.m_textHeight = 130.0;
    this.m_enabled = true;
    this.m_runFlag = -1;
  }

  initialize(rscene, transUI) {
    if (this.m_rscene == null) {
      this.m_rscene = rscene;
      this.m_transUI = transUI;
      this.createNodes();
      this.m_pv = CoRScene.createVec3();
      rscene.runnableQueue.addRunner(this);
    }
  }

  createNodes() {
    let mesh = this.m_rscene.entityBlock.unitBox.getMesh();
    let correct_model = {
      uvsList: [mesh.getUVS().slice(0)],
      vertices: mesh.getVS().slice(0),
      normals: mesh.getNVS().slice(0),
      indices: mesh.getIVS().slice(0)
    };
    let sm = correct_model;
    let vs = sm.vertices;

    for (let i = 0; i < vs.length; ++i) {
      vs[i] *= 75.0;
    }

    let normalHasNot_model = {
      uvsList: sm.uvsList,
      vertices: sm.vertices,
      normals: null,
      indices: sm.indices
    };
    let begin = 12 * 0;
    let end = 12 * 2;
    let nvs = sm.normals.slice(0);

    for (let i = begin; i < end; ++i) {
      nvs[i] = 1.0;
    }

    let inclinedNormal_model = {
      uvsList: sm.uvsList,
      vertices: sm.vertices,
      normals: nvs,
      indices: sm.indices
    };
    nvs = sm.normals.slice(0);
    let ivs = sm.indices.slice(0);
    this.flipTriWrap(0, ivs);
    this.flipTriWrap(1, ivs);
    this.flipTriWrap(2, ivs);
    this.flipTriWrap(3, ivs); // console.log("A: ", sm.indices);
    // console.log("B: ", ivs);

    let wrapErr_model = {
      uvsList: sm.uvsList,
      vertices: sm.vertices,
      normals: nvs,
      indices: ivs
    };
    let textHeight = this.m_textHeight;
    let h5Text = CoText.createH5Text(this.m_rscene, "text_cv_01", 22, 512, 512);
    let mana = this.entityManager;
    let pv = CoRScene.createVec3();
    let node = this.createEntityWithModel(correct_model, pv.setXYZ(-70.0, 0.0, 70.0));
    mana.addNode(node);
    pv.y += textHeight;
    this.createStaticText(pv, "法线正确", h5Text);
    node = this.createEntityWithModel(normalHasNot_model, pv.setXYZ(-200.0, 0.0, 200.0));
    mana.addNode(node);
    pv.y += textHeight;
    this.createStaticText(pv, "没有法线数据", h5Text);
    node = this.createEntityWithModel(inclinedNormal_model, pv.setXYZ(70.0, 0.0, -70.0));
    node.showDifference();
    node.showModelColor(true);
    mana.addNode(node);
    pv.y += textHeight;
    this.createStaticText(pv, "法线错误倾斜", h5Text);
    node = this.createEntityWithModel(wrapErr_model, pv.setXYZ(200.0, 0.0, -200.0), sm.indices);
    node.showDifference();
    node.showModelColor(true);
    mana.addNode(node);
    pv.y += textHeight;
    this.createStaticText(pv, "顶点绕序错误", h5Text);
    this.m_transUI.getRecoder().save(this.m_nodeEntities); // node.entity.setRenderState(CoRScene.RendererState.FRONT_CULLFACE_NORMAL_STATE);
  }

  flipTriWrap(triIndex, ivs) {
    let ia = triIndex * 3;
    let ib = ia + 2;
    let k = ivs[ia];
    ivs[ia] = ivs[ib];
    ivs[ib] = k; // ia = triIndex * 6 + 3;
    // ib = ia + 2;
    // k = ivs[ia];
    // ivs[ia] = ivs[ib];
    // ivs[ib] = k;
  }

  createEntityWithModel(model, pv, nivs = null) {
    let node = new NormalEntityNode_1.NormalEntityNode();
    node.rsc = this.m_rscene;
    node.transUI = this.m_transUI;
    node.setEntityModel(model, nivs); // node.entity.setRotationXYZ(45, 0.0, -45);

    node.setPosition(pv);
    node.update(); // node.createNormalLine(5);

    this.m_nodeEntities.push(node.entity);
    this.m_nodes.push(node);
    return node;
  }

  createStaticText(pv, text, h5Text) {
    let t = CoText.createStaticTextEntity(text, h5Text);
    t.setPosition(pv);
    t.update();
    let entity = t.getREntity();
    this.m_rscene.addEntity(entity, 1);
    this.m_textEntities.push(entity);
  }

  setEnabled(enabled) {
    if (this.m_enabled !== enabled) {
      let mana = this.entityManager;
      let ns = this.m_nodes;
      let ts = this.m_textEntities;

      if (enabled) {} else {
        for (let i = 0; i < ns.length; ++i) {
          mana.removeNode(ns[i]);
          ns[i].setVisible(false);
          this.m_rscene.removeEntity(ts[i]);
        }
      }

      this.m_enabled = enabled;
    }
  }

  setVisible(v) {
    this.m_visible = v;
  }

  isVisible() {
    return this.m_visible;
  }

  update() {}

  destroy() {
    this.entityManager = null;

    if (this.m_rscene != null) {
      let ls = this.m_nodes;
      let ts = this.m_textEntities;

      if (ls != null && ls.length > 0) {
        for (let i = 0; i < ls.length; ++i) {
          this.entityManager.removeNode(ls[i]);
          ls[i].destroy();
          this.m_rscene.removeEntity(ts[i]);
          ts[i].destroy();
        }
      }

      this.m_nodes = [];
      this.m_textEntities = [];
      this.entityManager = null;
      this.m_rscene = null;
      this.m_transUI = null;
    }
  }

  setRunFlag(flag) {
    this.m_runFlag = flag;
  }

  getRunFlag() {
    return this.m_runFlag;
  }

  isRunning() {
    return this.m_enabled;
  }

  isStopped() {
    return !this.m_enabled;
  }

  run() {
    let ns = this.m_nodes;
    let ts = this.m_textEntities;
    let pv = this.m_pv;

    for (let i = 0; i < ns.length; ++i) {
      let entity = ns[i].entity;
      let trans0 = entity.getTransform();
      let trans1 = ts[i].getTransform();

      if (trans1.version != trans0.version) {
        entity.getPosition(pv);
        pv.y += this.m_textHeight;
        trans1.version != trans0.version;
        ts[i].setPosition(pv);
        ts[i].update();
        trans1.version = trans0.version;
      }
    }
  }

}

exports.NormalExampleGroup = NormalExampleGroup;

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

/***/ "89c1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CoModuleLoader_1 = __webpack_require__("2a2b");

class CoPostOutline {
  constructor(rscene) {
    this.m_rscene = rscene;
    let url = "static/cospace/renderEffect/occPostOutline/OccPostOutlineModule.umd.js";
    new CoModuleLoader_1.CoModuleLoader(1, () => {
      this.m_postOutline = OccPostOutlineModule.create();
      this.initOutline();
      this.m_rscene.appendRenderNode(this);
    }).load(url);
  }

  initOutline() {
    this.m_postOutline.initialize(this.m_rscene, 0, [0]);
    this.m_postOutline.setFBOSizeScaleRatio(0.5);
    this.m_postOutline.setRGB3f(0.0, 1.0, 0.0);
    this.m_postOutline.setOutlineDensity(2.0);
    this.m_postOutline.setOcclusionDensity(0.2);
  }

  select(targets) {
    if (this.m_postOutline != null) {
      this.m_postOutline.setTargetList(targets);
    }
  }

  deselect() {
    if (this.m_postOutline != null) {
      this.m_postOutline.setTargetList(null);
    }

    console.log("post outline deselect() ...");
  }

  render() {
    if (this.m_postOutline != null) {
      // console.log("post outline getTargetList(): ",this.m_postOutline.getTargetList());
      this.m_postOutline.drawBegin();
      this.m_postOutline.draw();
      this.m_postOutline.drawEnd();
    }
  }

}

exports.CoPostOutline = CoPostOutline;

/***/ }),

/***/ "9737":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const NormalEntityNode_1 = __webpack_require__("43c4");

const CoSpaceAppData_1 = __webpack_require__("3347");

const NormalEntityLayout_1 = __webpack_require__("4cf3");

class NormalEntityGroup {
  constructor(coapp) {
    this.m_uid = NormalEntityGroup.s_uid++;
    this.m_loadTotal = 0;
    this.m_loadedTotal = 0;
    this.m_nodes = [];
    this.m_transforms = [];
    this.m_transes = [];
    this.m_layoutor = null;
    this.m_coapp = coapp;
  }

  getUid() {
    return this.m_uid;
  }

  initialize() {}

  loadModels(urls, typeNS = "") {
    if (urls != null && urls.length > 0) {
      // this.m_transforms = [];
      // this.m_transes = [];
      let purls = urls.slice(0);
      this.m_coapp.deferredInit(() => {
        console.log("XXXXXXXXXXXXXXXXXXX deferredInit() call...");

        for (let i = 0; i < purls.length; ++i) {
          this.loadModel(purls[i], typeNS);
        }
      });
    }
  }

  loadModel(url, typeNS = "") {
    console.log("loadModel, url: ", url);
    let ns = typeNS;

    if (typeNS == "") {
      let k0 = url.lastIndexOf(".") + 1;
      let k1 = url.lastIndexOf("?");
      ns = k1 < 0 ? url.slice(k0) : url.slice(k0, k1);
    }

    ns = ns.toLocaleLowerCase();
    let type = CoSpaceAppData_1.CoDataFormat.Undefined;

    switch (ns) {
      case "obj":
        type = CoSpaceAppData_1.CoDataFormat.OBJ;
        break;

      case "fbx":
        type = CoSpaceAppData_1.CoDataFormat.FBX;
        break;

      case "drc":
        type = CoSpaceAppData_1.CoDataFormat.Draco;
        break;

      case "ctm":
        type = CoSpaceAppData_1.CoDataFormat.CTM;
        break;

      default:
        break;
    }

    if (type != CoSpaceAppData_1.CoDataFormat.Undefined) {
      this.loadGeomModel(url, type);
    } else {
      console.error("Can't support this model data format, url: ", url);
    }
  }

  loadGeomModel(url, format) {
    // let ins = this.m_coapp.coappIns;
    let ins = this.m_coapp;

    if (ins != null) {
      this.uiscene.prompt.getPromptPanel().applyConfirmButton();
      this.uiscene.prompt.showPrompt("Model loading!");
      this.m_loadTotal++; // let unit = ins.getCPUDataByUrlAndCallback(
      // 	url,
      // 	format,
      // 	(unit: CoGeomDataUnit, status: number): void => {
      // 		if(format != CoDataFormat.FBX) {
      // 			this.createEntityFromModels(unit.data.models, unit.data.transforms);
      // 		}
      // 		this.createEntityFromUnit(unit, status);
      // 	},
      // 	true
      // );

      let unit = ins.getCPUDataByUrlAndCallback(url, format, (unit, status) => {
        if (format != CoSpaceAppData_1.CoDataFormat.FBX) {
          this.createEntityFromModels(unit.data.models, unit.data.transforms);
        }

        this.createEntityFromUnit(unit, status);
      }, true);

      if (format == CoSpaceAppData_1.CoDataFormat.FBX) {
        unit.data.modelReceiver = (models, transforms, index, total) => {
          console.log("XXX: ", index, ",", total);
          this.createEntityFromModels(models, transforms);
        };
      }
    }
  }

  createEntityFromModels(models, transforms) {
    let entities = [];
    let len = models.length;
    let nodes = [];

    for (let i = 0; i < len; ++i) {
      const node = this.addEntityWithModel(models[i], transforms != null ? transforms[i] : null);

      if (node != null) {
        this.entityManager.addNode(node);
        nodes.push(node);
        this.m_nodes.push(node);
        entities.push(node.entity);
      }
    }

    this.updateLayout(false);
    this.transUI.getRecoder().save(entities);
  }

  createEntityFromUnit(unit, status = 0) {
    console.log("XXXXXX createEntityFromUnit, unit: ", unit);
    /*
    let entities: ITransformEntity[] = [];
    let len = unit.data.models.length;
      let nodes: NormalEntityNode[] = [];
    for (let i = 0; i < len; ++i) {
        let dt = unit.data;
        const node = this.addEntityWithModel(dt.models[i], dt.transforms != null ? dt.transforms[i] : null);
        if (node != null) {
            this.entityManager.addNode(node);
            nodes.push(node);
            this.m_nodes.push(node);
            entities.push(node.entity);
        }
    }
    
    this.updateLayout(false);
    this.transUI.getRecoder().save(entities);
    
    // for (let i = 0; i < nodes.length; ++i) {
    // 	nodes[i].createNormalLine();
    // }
    //*/
    // let nodes = this.m_nodes;
    // for (let i = 0; i < nodes.length; ++i) {
    // 	nodes[i].createNormalLine();
    // }

    this.m_loadedTotal++;

    if (this.m_loadedTotal >= this.m_loadTotal) {
      this.uiscene.prompt.getPromptPanel().applyConfirmButton();
      this.uiscene.prompt.showPrompt("Model loaded finish!");
    }
  }

  addEntityWithModel(model, transform) {
    if (model != null) {
      // let map = this.m_map;
      let node = new NormalEntityNode_1.NormalEntityNode();
      node.rsc = this.rsc;
      node.transUI = this.transUI;
      let entity = node.setEntityModel(model); // map.set(node.getUid(), node);

      let mat4 = transform != null ? CoRScene.createMat4(transform) : null;
      this.m_transforms.push(mat4);
      this.m_transes.push(entity);
      return node;
    }

    return null;
  }

  updateLayout(rotationEnabled) {
    if (this.m_layoutor == null) {
      this.m_layoutor = new NormalEntityLayout_1.NormalEntityLayout();
      this.m_layoutor.initialize();
    }

    this.m_layoutor.rotationEnabled = rotationEnabled;

    for (let k = 0; k < this.m_transes.length; ++k) {
      let et = this.m_transes[k];
      et.setXYZ(0.0, 0.0, 0.0);
      et.setScaleXYZ(1.0, 1.0, 1.0);
      et.setRotationXYZ(0.0, 0.0, 0.0);
    }

    let pivot = CoRScene.createVec3();
    this.m_layoutor.fixToPosition(this.m_transes, this.m_transforms, pivot, 300.0); // this.m_transforms = null;
    // this.m_transes = null;
  }

  destroy() {
    let ls = this.m_nodes;

    if (ls != null && ls.length > 0) {
      for (let i = 0; i < ls.length; ++i) {
        this.entityManager.removeNode(ls[i]);
        ls[i].destroy();
      }
    }

    this.m_nodes = [];
    this.entityManager = null;
    this.uiscene = null;
    this.m_transforms = null;
    this.m_transes = null;
    this.m_layoutor = null;
    this.rsc = null;
  }

}

NormalEntityGroup.s_uid = 0;
exports.NormalEntityGroup = NormalEntityGroup;

/***/ }),

/***/ "a176":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // import {DemoThread as Demo} from "./cospace/modules/thread/example/DemoThread";
// import {DemoThread as Demo} from "./cospace/demo/DemoThread";
// import {DemoThreadLoadJS as Demo} from "./cospace/demo/DemoThreadLoadJS";
// import { DemoCTMLoadAndParser as Demo } from "./cospace/demo/DemoCTMLoadAndParser";
// import { DemoFBXFastParser as Demo } from "./cospace/demo/DemoFBXFastParser";
// import { DemoOBJParser as Demo } from "./cospace/demo/DemoOBJParser";

Object.defineProperty(exports, "__esModule", {
  value: true
}); // import { DemoCTMLoad as Demo } from "./cospace/demo/DemoCTMLoad";
// import { DemoCTMParser as Demo } from "./cospace/demo/DemoCTMParser";
// import { DemoDracoParser as Demo } from "./cospace/demo/DemoDracoParser";
// import { DemoShowCTMAndDraco as Demo } from "./cospace/demo/DemoShowCTMAndDraco";
// import { DemoCTMToDraco as Demo } from "./cospace/demo/DemoCTMToDraco";
// import { DemoDracoEncode as Demo } from "./cospace/demo/DemoDracoEncode";
// import { DemoDracoParser2 as Demo } from "./cospace/demo/DemoDracoParser2";
// import { DemoFBXParser as Demo } from "./cospace/demo/DemoFBXParser";
// import { DemoGLBParser as Demo } from "./cospace/demo/DemoGLBParser";
// import { DemoPNGParser as Demo } from "./cospace/demo/DemoPNGParser";
// import { DemoMixParser as Demo } from "./cospace/demo/DemoMixParser";
// import { DemoCospace as Demo } from "./cospace/demo/DemoCospace";
// import { DemoCospaceDeferredInit as Demo } from "./cospace/demo/DemoCospaceDeferredInit";
// import { DemoDependenceGraph as Demo } from "./cospace/demo/DemoDependenceGraph";
// import { DemoCTMViewer as Demo } from "./cospace/demo/DemoCTMViewer";
// import { DemoNormalViewer as Demo } from "./cospace/demo/DemoNormalViewer";
// import { RenderingVerifier as Demo } from "./cospace/demo/RenderingVerifier";
// import { DemoCoApp as Demo } from "./cospace/demo/DemoCoApp";
// import { DemoCoAppDeferredInit as Demo } from "./cospace/demo/DemoCoAppDeferredInit";
// import { DemoCoRenderer as Demo } from "./cospace/demo/DemoCoRenderer";
// import { DemoCoRendererScene as Demo } from "./cospace/demo/DemoCoRendererScene";
// import { DemoCoRendererSubScene as Demo } from "./cospace/demo/DemoCoRendererSubScene";
// import { DemoCoSimpleRendereScene as Demo } from "./cospace/demo/DemoCoSimpleRendereScene";
// import { DemoCoViewer as Demo } from "./cospace/demo/DemoCoViewer";

const DemoVox3DEditor_1 = __webpack_require__("e9fd"); // import { DemoOutline as Demo } from "./cospace/demo/DemoOutline";
// import { DemoPostOutline as Demo } from "./cospace/demo/DemoPostOutline";
// import { DemoCoParticle as Demo } from "./cospace/demo/DemoCoParticle";
// import { DemoCoParticleFlow as Demo } from "./cospace/demo/DemoCoParticleFlow";
// import { DemoCoParticleModule as Demo } from "./cospace/demo/DemoCoParticleModule";
// import { DemoCoEdit as Demo } from "./cospace/demo/DemoCoEdit";
// import { DemoInputText as Demo } from "./cospace/demo/DemoInputText";
// import { DemoCORS as Demo } from "./cospace/demo/DemoCORS";


let demoIns = new DemoVox3DEditor_1.DemoVox3DEditor();
let ins = demoIns;

function main() {
  console.log("------ demo --- init ------");
  ins.initialize();

  function mainLoop(now) {
    ins.run();
    window.requestAnimationFrame(mainLoop);
  }

  window.requestAnimationFrame(mainLoop);
  console.log("------ demo --- running ------");
}

main();

/***/ }),

/***/ "a23c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class NormalEntityManager {
  constructor() {
    this.m_map = new Map();
    this.m_selectEntities = null;
    this.m_scaleBase = 1.0;
    this.m_visible = false;
  }

  initialize() {
    this.transUI.addSelectListener(list => {
      this.setSelectedModelVisible(true);
      let entitys = list;
      this.m_selectEntities = entitys;
      this.ctrPanel.setModelVisiFlag(entitys != null && entitys.length > 0); // console.log("NormalEntityGroup get select entities action.");

      this.testSelect();
    });
  }

  setVisible(visible) {
    if (this.m_visible != visible) {
      this.m_visible = visible;

      for (let [k, v] of this.m_map.entries()) {
        v.setVisible(visible);
      }
    }
  }

  testSelect() {
    let ls = this.m_selectEntities;

    if (ls != null) {
      let map = this.m_map;
      let lineVisible = false;
      let dif = false;
      let flip = false;
      let cpl = this.ctrPanel;
      let scaleBase = cpl.getNormalScale();

      for (let i = 0; i < ls.length; ++i) {
        const node = map.get(ls[i].getUid());

        if (node != null) {
          if (node.getLineVisible()) {
            lineVisible = true;
          }

          if (node.isShowDifference()) {
            dif = true;
          }

          if (node.isNormalFlipping()) {
            flip = true;
          }

          node.select();
        }
      }

      this.m_scaleBase = scaleBase < 0.1 ? 0.1 : scaleBase;
      cpl.setNormalFlag(lineVisible);
      cpl.setNormalFlipFlag(flip);
      cpl.setDifferenceFlag(dif);
    }
  }

  setSelectedNormalLineVisible(v) {
    let ls = this.m_selectEntities;

    if (ls != null) {
      let map = this.m_map;

      for (let i = 0; i < ls.length; ++i) {
        const node = map.get(ls[i].getUid());

        if (node != null) {
          node.setLineVisible(v);
        }
      }
    }
  }

  setSelectedModelVisible(v) {
    let ls = this.m_selectEntities;

    if (ls != null) {
      let map = this.m_map;

      for (let i = 0; i < ls.length; ++i) {
        const node = map.get(ls[i].getUid());

        if (node != null) {
          node.entity.setVisible(v);
        }
      }
    }
  }

  setModelColor(v) {
    let ls = this.m_selectEntities;

    if (ls != null) {
      let map = this.m_map;

      for (let i = 0; i < ls.length; ++i) {
        const node = map.get(ls[i].getUid());

        if (node != null) {
          node.showModelColor(v);
        }
      }
    }
  }

  showNormalLocalColor() {
    let ls = this.m_selectEntities;

    if (ls != null) {
      let map = this.m_map;

      for (let i = 0; i < ls.length; ++i) {
        const node = map.get(ls[i].getUid());

        if (node != null) {
          node.showLocalNormal();
        }
      }
    }
  }

  showNormalGlobalColor() {
    let ls = this.m_selectEntities;

    if (ls != null) {
      let map = this.m_map;

      for (let i = 0; i < ls.length; ++i) {
        const node = map.get(ls[i].getUid());

        if (node != null) {
          node.showGlobalNormal();
        }
      }
    }
  }

  showDifferenceColor(boo = true) {
    let ls = this.m_selectEntities;

    if (ls != null) {
      let map = this.m_map;

      for (let i = 0; i < ls.length; ++i) {
        const node = map.get(ls[i].getUid());

        if (node != null) {
          node.showDifference(boo);
        }
      }
    }
  }

  flipNormalLine(boo) {
    let ls = this.m_selectEntities;

    if (ls != null) {
      let map = this.m_map;

      for (let i = 0; i < ls.length; ++i) {
        const node = map.get(ls[i].getUid());

        if (node != null) {
          node.flipNormal(boo);
        }
      }
    }
  }

  normalScaleBtnSelect() {
    let ls = this.m_selectEntities;

    if (ls != null) {
      let map = this.m_map;
      let cpl = this.ctrPanel;

      for (let i = 0; i < ls.length; ++i) {
        const node = map.get(ls[i].getUid());

        if (node != null) {
          node.select();
        }
      }
    }
  }

  applyFeatureColor(uuid) {
    console.log("applyFeatureColor: ", uuid);
    let ls = this.m_selectEntities;

    if (ls != null && ls.length > 0) {
      switch (uuid) {
        case "local":
          this.showNormalLocalColor();
          break;

        case "global":
          this.showNormalGlobalColor();
          break;

        case "modelColor":
          this.setModelColor(true);
          break;

        case "normalTest":
          // this.setModelColor(true);
          console.log("test");
          break;

        default:
          break;
      }
    }
  }

  applyCtrlFlag(uuid, flag) {
    console.log("applyCtrlFlag: ", uuid, flag);
    let ls = this.m_selectEntities;

    if (ls != null && ls.length > 0) {
      switch (uuid) {
        case "normal":
          this.setSelectedNormalLineVisible(flag);
          break;

        case "model":
          this.setSelectedModelVisible(flag);
          break;

        case "difference":
          this.showDifferenceColor(flag);
          break;

        case "normalFlip":
          this.flipNormalLine(flag);
          break;

        default:
          break;
      }
    }
  }

  applyNormalScale(f) {
    let ls = this.m_selectEntities;

    if (ls != null && ls.length > 0) {
      let ls = this.m_selectEntities;

      if (ls != null) {
        let map = this.m_map;

        for (let i = 0; i < ls.length; ++i) {
          const node = map.get(ls[i].getUid());

          if (node != null) {
            node.applyNormalLineScale(f);
          }
        }
      }
    }
  }

  addNode(node) {
    if (node != null) {
      let map = this.m_map;

      if (node.getUid() >= 0 && !map.has(node.getUid())) {
        map.set(node.getUid(), node);
      }
    }
  }

  removeNode(node) {
    if (node != null) {
      let map = this.m_map;

      if (node.getUid() >= 0 && map.has(node.getUid())) {
        map.delete(node.getUid());
      }
    }
  }

  destroy() {
    this.m_selectEntities = null;
    this.m_map.clear();
  }

}

exports.NormalEntityManager = NormalEntityManager;

/***/ }),

/***/ "ab08":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class AxisAlignCalc {
  constructor() {}

  calcRange(size, factor = 0.7, centerPercent = 0.5) {
    if (centerPercent < 0.0) centerPercent = 0.0;else if (centerPercent > 1.0) centerPercent = 1.0;
    if (factor < 0.0) factor = 0.0;else if (factor > 1.0) factor = 1.0;
    let content = size * (1.0 - factor);
    let p = centerPercent * size;
    let max = p + content * 0.5;
    if (max > size) max = size;
    let min = max - content;
    return [min, max];
  }

  avgLayout(sizes, min, max, minGap = -1) {
    if (sizes != null && sizes.length > 0) {
      let len = sizes.length;

      switch (len) {
        case 1:
          let px = 0.5 * (max - min) + min;
          return [px - 0.5 * sizes[0]];
          break;

        default:
          return this.calcAvgMulti(sizes, min, max, minGap);
          break;
      }
    }

    return null;
  }

  calcAvgLayout(itemSizes, bgSize, marginFactor = 0.7, centerPercent = 0.5) {
    let range = this.calcRange(bgSize, marginFactor, centerPercent);
    return this.avgLayout(itemSizes, range[0], range[1]);
  }

  calcAvgFixLayout(itemSizes, bgSize, minGap = 10.0, marginFactor = 0.7, centerPercent = 0.5) {
    let range = this.calcRange(bgSize, marginFactor, centerPercent);
    return this.avgLayout(itemSizes, range[0], range[1], minGap);
  }

  calcAvgMulti(sizes, min, max, minGap = -1) {
    let dis = max - min;
    let len = sizes.length;
    let size = 0.0;

    for (let i = 0; i < len; i++) {
      size += sizes[i];

      if (minGap > 0.0 && i > 0) {
        size += minGap;
      }
    }

    let list = new Array(len);
    list[0] = min;
    list[len - 1] = max - sizes[len - 1];

    if (len > 2) {
      if (size < dis) {
        let dl = (dis - size) / (len - 1);
        len--;

        for (let i = 1; i < len; i++) {
          list[i] = list[i - 1] + sizes[i - 1] + dl;
        }
      } else {
        if (minGap <= 0.0) {
          let p0 = list[0] + 0.5 * sizes[0];
          dis = list[len - 1] + 0.5 * sizes[len - 1] - p0;
          let dl = dis / (len - 1);
          p0 += dl;
          len--;

          for (let i = 1; i < len; i++) {
            list[i] = p0;
            p0 += dl;
          }
        }
      }
    }

    if (size >= dis) {
      if (minGap > 0.0) {
        let p0 = dis * 0.5 + min - (size + (len - 1) * minGap) * 0.5;

        for (let i = 0; i < len; i++) {
          list[i] = p0;
          p0 += sizes[i] + minGap;
        }
      }
    }

    return list;
  }

}

exports.AxisAlignCalc = AxisAlignCalc;

/***/ }),

/***/ "ab2b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class NormalCtrlPanel {
  constructor() {
    this.m_btnW = 90;
    this.m_btnH = 50;
    this.m_scene = null;
    this.m_panel = null;
    this.m_normalScale = 0.0;
    this.autoLayout = true;
    this.m_dragging = false;
    this.m_dragMinX = 0;
    this.m_dragMaxX = 0;
    this.m_progressLen = 0;
    this.m_proBaseLen = 100;
  }

  getScene() {
    return this.m_scene;
  }

  setBGColor(c) {
    if (this.m_panel == null) this.m_panel = CoUI.createUIPanel();
    this.m_panel.autoLayout = false;
    this.m_panel.setBGColor(c);
  }

  initialize(scene, rpi, panelW, panelH, btnH) {
    if (this.m_scene == null) {
      this.m_scene = scene;
      this.m_rpi = rpi;
      this.m_panelW = panelW;
      this.m_panelH = panelH;
      this.m_btnH = btnH;
      this.m_v0 = CoRScene.createVec3();
      if (this.m_panel == null) this.m_panel = CoUI.createUIPanel();
      this.m_panel.autoLayout = false;
      this.m_panel.setUIscene(scene);
      this.m_panel.setSize(panelW, panelH);
      this.buildPanel(panelW, panelH);
    }
  }

  destroy() {
    this.m_scene = null;

    if (this.m_selectDispatcher != null) {
      this.m_selectDispatcher.destroy();
      this.m_progressDispatcher.destroy();
      this.m_selectDispatcher = null;
      this.m_progressDispatcher = null;
    }

    this.m_progressEvt = null;
    this.m_modelVisiBtn = null;
    this.m_normalVisiBtn = null;
    this.m_diffBtn = null;
    this.m_normalFlipBtn = null;

    if (this.m_panel != null) {
      this.m_panel.destroy();
      this.m_panel = null;
    }
  }

  open(scene = null, rpi = -1) {
    this.m_panel.open(scene);

    if (this.autoLayout) {
      this.addLayoutEvt();
      this.layout();
    }
  }

  isOpen() {
    return this.m_panel.isOpen();
  }

  close() {
    this.removeLayoutEvt();
    this.m_panel.close();
  }

  addEventListener(type, listener, func, captureEnabled = true, bubbleEnabled = false) {
    if (type == CoRScene.SelectionEvent.SELECT) {
      this.m_selectDispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    } else if (type == CoRScene.ProgressDataEvent.PROGRESS) {
      this.m_progressDispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    }
  }

  removeEventListener(type, listener, func) {
    if (type == CoRScene.SelectionEvent.SELECT) {
      this.m_selectDispatcher.removeEventListener(type, listener, func);
    } else if (type == CoRScene.ProgressDataEvent.PROGRESS) {
      this.m_progressDispatcher.removeEventListener(type, listener, func);
    }
  }

  buildPanel(pw, ph) {
    this.m_selectDispatcher = CoRScene.createEventBaseDispatcher();
    this.m_progressDispatcher = CoRScene.createEventBaseDispatcher(); // this.m_flagEvt = CoRScene.createSelectionEvent();

    this.m_progressEvt = CoRScene.createProgressDataEvent();
    let sc = this.m_scene;
    let startX = 10;
    let startY = this.m_panelH - 10 - this.m_btnH;
    let disX = 5;
    let disY = 5;
    let px = startX;
    let py = 0;
    this.m_btnW = 90; // let localBtn = this.createBtn("Local", startX, startY, "local");

    let tta = sc.transparentTexAtlas;
    let ME = CoRScene.MouseEvent;
    let textParam = {
      text: "Local",
      textColor: CoMaterial.createColor4(),
      fontSize: 30,
      font: ""
    };
    let fc4 = CoMaterial.createColor4;
    let colors = [fc4().setRGB3Bytes(80, 80, 80), fc4().setRGB3Bytes(110, 110, 110), fc4().setRGB3Bytes(90, 90, 90), fc4().setRGB3Bytes(110, 110, 110)];
    let localBtn = CoUI.createTextButton(this.m_btnW, this.m_btnH, "local", tta, textParam, colors);
    localBtn.setXY(startX, startY);
    px = px + this.m_btnW + disX;
    this.m_btnW = 90;
    textParam.text = "Global"; // let globalBtn = this.createBtn("Global", px, startY, "global");

    let globalBtn = CoUI.createTextButton(this.m_btnW, this.m_btnH, "global", tta, textParam, colors);
    globalBtn.setXY(px, startY);
    px = px + this.m_btnW + disX;
    this.m_btnW = 100;
    textParam.text = "Color"; // let differenceBtn = this.createBtn("Difference", px, startY, "difference");

    let modelColorBtn = CoUI.createTextButton(this.m_btnW, this.m_btnH, "modelColor", tta, textParam, colors);
    modelColorBtn.setXY(px, startY);
    let pl = this.m_panel;
    pl.addEntity(localBtn);
    pl.addEntity(globalBtn);
    pl.addEntity(modelColorBtn);
    let btnSize = 28;
    py = startY - this.m_btnH - disY + 20;
    let textLabel = this.createText("Normal line visible", startX + btnSize + disX, py);
    px = startX;
    py = textLabel.getY();
    this.m_normalVisiBtn = this.createFlagBtn(btnSize, px, py, "normal");
    textLabel = this.createText("Model visible", startX + btnSize + disX, py - 10);
    py = textLabel.getY();
    this.m_modelVisiBtn = this.createFlagBtn(btnSize, px, py, "model");
    textLabel = this.createText("Normal difference", startX + btnSize + disX, py - 10);
    py = textLabel.getY();
    this.m_diffBtn = this.createFlagBtn(btnSize, px, py, "difference");
    textLabel = this.createText("Normal flip", startX + btnSize + disX, py - 10);
    py = textLabel.getY();
    this.m_normalFlipBtn = this.createFlagBtn(btnSize, px, py, "normalFlip");
    textLabel = this.createText("Normal line length:", startX, py - 15);
    px = startX;
    py = textLabel.getY();
    this.m_dragBar = this.createProgressBtn(px + 5, py - 25, 200);
    py = this.m_dragBar.getY();
    textLabel = this.createText("Normal line color:", startX, py - 10);
    px = startX;
    py = textLabel.getY();
    let colors1 = [fc4().setRGB3Bytes(210, 0, 210), fc4().setRGB3Bytes(240, 0, 240), fc4().setRGB3Bytes(220, 0, 220), fc4().setRGB3Bytes(240, 0, 240)];
    let normalLineColorBtn = this.createColorBtn(22, 22, "normalLineColor", colors1);
    normalLineColorBtn.setXY(startX + textLabel.getWidth() + disX, py);
    pl.addEntity(normalLineColorBtn);
    px = startX;
    py = textLabel.getY() - disY;
    this.m_btnW = 90;
    textParam.text = "Test"; // let differenceBtn = this.createBtn("Difference", px, startY, "difference");

    let normalTestBtn = CoUI.createTextButton(this.m_btnW, this.m_btnH, "normalTest", tta, textParam, colors);
    normalTestBtn.update();
    normalTestBtn.setXY(px, py - normalTestBtn.getHeight());
    pl.addEntity(normalTestBtn); //let ME = CoRScene.MouseEvent;

    localBtn.addEventListener(ME.MOUSE_UP, this, this.normalDisplaySelect);
    globalBtn.addEventListener(ME.MOUSE_UP, this, this.normalDisplaySelect);
    modelColorBtn.addEventListener(ME.MOUSE_UP, this, this.normalDisplaySelect);
    normalTestBtn.addEventListener(ME.MOUSE_UP, this, this.normalDisplaySelect);
    normalLineColorBtn.addEventListener(ME.MOUSE_UP, this, this.normalLineColorSelect);
    let group = this.m_btnGroup = CoUI.createSelectButtonGroup();
    group.addButton(localBtn);
    group.addButton(globalBtn);
    group.addButton(modelColorBtn);
    group.setSelectedFunction(btn => {
      let label;
      label = btn.getLable();
      label.getColorAt(0).setRGB3Bytes(71, 114, 179);
      label.setClipIndex(0);
    }, btn => {
      let label;
      label = btn.getLable();
      label.getColorAt(0).setRGB3Bytes(80, 80, 80);
      label.setClipIndex(0);
    });
    this.m_btnGroup.select(globalBtn.uuid);
  }

  normalDisplaySelect(evt) {
    this.sendSelectionEvt(evt.uuid, true);
  }

  normalLineColorSelect(evt) {
    console.log("color select...");
  }

  selectVisibleFunc(evt) {
    this.sendSelectionEvt(evt.uuid, evt.flag);
  }

  createFlagBtn(size, px, py, uuid = "model") {
    let sc = this.getScene(); // let flagBtn = new FlagButton();

    let flagBtn = CoUI.createFlagButton();
    flagBtn.uuid = uuid;
    flagBtn.initializeWithSize(sc.texAtlas, size, size);
    flagBtn.setXY(px, py);
    flagBtn.addEventListener(CoRScene.SelectionEvent.SELECT, this, this.selectVisibleFunc);
    this.m_panel.addEntity(flagBtn);
    return flagBtn;
  }

  getNormalScale() {
    return this.m_normalScale;
  }

  setNormalFlag(flag) {
    console.log("setNormalFlag, flag: ", flag);
    this.m_normalVisiBtn.setFlag(flag);
  }

  setModelVisiFlag(flag) {
    this.m_modelVisiBtn.setFlag(flag);
  }

  setDifferenceFlag(flag) {
    this.m_diffBtn.setFlag(flag);
  }

  setNormalFlipFlag(flag) {
    this.m_normalFlipBtn.setFlag(flag);
  }

  sendProgressEvt(uuid, v) {
    let e = this.m_progressEvt;
    e.target = this;
    e.status = 2;
    e.type = CoRScene.ProgressDataEvent.PROGRESS;
    e.minValue = 0.0;
    e.maxValue = 1.0;
    e.value = v;
    e.progress = v;
    e.phase = 1;
    e.uuid = uuid;
    this.m_progressDispatcher.dispatchEvt(e);
    e.target = null;
  }

  sendSelectionEvt(uuid, flag) {
    let e = CoRScene.createSelectionEvent(); // let e = this.m_flagEvt;

    e.uuid = uuid;
    e.target = this;
    e.type = CoRScene.SelectionEvent.SELECT;
    e.flag = flag;
    e.phase = 1;
    this.m_selectDispatcher.dispatchEvt(e);
    e.target = null;
  }

  createText(text, px, py) {
    let sc = this.getScene(); // let textLabel = new TextLabel();

    let textLabel = CoUI.createTextLabel();
    textLabel.depthTest = true;
    textLabel.transparent = true;
    textLabel.premultiplyAlpha = true;
    textLabel.initialize(text, sc);
    textLabel.setXY(px, py - textLabel.getHeight());
    textLabel.update();
    this.m_panel.addEntity(textLabel);
    return textLabel;
  }

  createProgressBtn(px, py, length) {
    let sc = this.getScene();
    let color = CoMaterial.createColor4(0.1, 0.1, 0.1); // let bgBar = new ColorLabel();
    // let bgBar = CoUI.createColorLabel();
    // bgBar.depthTest = true;
    // bgBar.initialize(length, 10);
    // bgBar.setZ(-0.05);
    // bgBar.setColor(color);
    // bgBar.setXY(px, py);
    // this.m_panel.addEntity(bgBar);

    let barBgLabel = CoUI.createClipColorLabel();
    barBgLabel.initializeWithoutTex(length, 10, 4);
    barBgLabel.getColorAt(0).setRGB3Bytes(70, 70, 70);
    barBgLabel.getColorAt(1).setRGB3f(0.3, 0.3, 0.3);
    barBgLabel.getColorAt(2).setRGB3Bytes(70, 70, 70);
    barBgLabel.getColorAt(3).setRGB3Bytes(70, 70, 70);
    let dragBgBar = CoUI.createButton();
    dragBgBar.initializeWithLable(barBgLabel);
    dragBgBar.setZ(-0.05);
    dragBgBar.setXY(px, py);
    this.m_panel.addEntity(dragBgBar);
    this.m_dragBgBar = dragBgBar;
    dragBgBar.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.progressBgMouseDown);
    this.m_progressLen = length - 16;
    this.m_proBaseLen = this.m_progressLen;
    this.m_dragMinX = px;
    this.m_dragMaxX = px + this.m_progressLen; // let barLabel = new ClipColorLabel();

    let barLabel = CoUI.createClipColorLabel();
    barLabel.initializeWithoutTex(16, 16, 4);
    barLabel.getColorAt(0).setRGB3Bytes(130, 130, 130);
    barLabel.getColorAt(1).setRGB3f(0.2, 1.0, 0.2);
    barLabel.getColorAt(2).setRGB3f(0.2, 1.0, 1.0); // let dragBar = new Button();

    let dragBar = CoUI.createButton();
    dragBar.initializeWithLable(barLabel);
    dragBar.setXY(px, py - 3);
    this.m_panel.addEntity(dragBar);
    dragBar.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.progressMouseDown); // dragBar.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.progressMouseUp);

    sc.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.progressMouseUp); // this.m_dragBar = dragBar;

    return dragBar;
  }

  progressMouseDown(evt) {
    this.m_dragging = true;
    let sc = this.getScene();
    this.sendSelectionEvt("normalScaleBtnSelect", true);
    sc.addEventListener(CoRScene.MouseEvent.MOUSE_MOVE, this, this.progressMouseMove);
  }

  progressMouseUp(evt) {
    this.m_dragging = false;
    let sc = this.getScene();
    sc.removeEventListener(CoRScene.MouseEvent.MOUSE_MOVE, this, this.progressMouseMove);
  }

  progressBgMouseDown(evt) {
    let px = evt.mouseX;
    let py = evt.mouseY;
    let pv = this.m_v0;
    pv.setXYZ(px, py, 0); // console.log("px,py: ", px,py);

    this.m_panel.globalToLocal(pv); // console.log("pv.x, pv.y: ", pv.x, pv.y);

    px = pv.x;

    if (px < this.m_dragMinX) {
      px = this.m_dragMinX;
    } else if (px > this.m_dragMaxX) {
      px = this.m_dragMaxX;
    }

    this.m_dragBar.setX(px);
    this.m_dragBar.update();
    this.m_proBaseLen = px - this.m_dragMinX;
  }

  progressMouseMove(evt) {
    let px = evt.mouseX;
    let py = evt.mouseY;
    let pv = this.m_v0;
    pv.setXYZ(px, py, 0); // console.log("px,py: ", px,py);

    this.m_panel.globalToLocal(pv); // console.log("pv.x, pv.y: ", pv.x, pv.y);

    px = pv.x;

    if (px < this.m_dragMinX) {
      px = this.m_dragMinX;
    } else if (px > this.m_dragMaxX) {
      px = this.m_dragMaxX;
    }

    this.m_dragBar.setX(px);
    this.m_dragBar.update(); // console.log("this.m_proBaseLen: ",this.m_proBaseLen, this.m_progressLen);
    // let f = (px - this.m_dragMinX) / this.m_progressLen;

    let f = (px - this.m_dragMinX) / this.m_proBaseLen; // console.log("f: ", f, px - this.m_dragMinX);
    // console.log("f: ",f, (0.1 + f * 2.0));
    // f = 0.1 + f * 3.0;

    this.m_normalScale = f;
    this.sendProgressEvt("normalScale", f);
  }

  createColorBtn(pw, ph, idns, colors) {
    let colorClipLabel = CoUI.createClipColorLabel();
    colorClipLabel.initializeWithoutTex(pw, ph, 4);
    colorClipLabel.setColors(colors);
    let btn = CoUI.createButton();
    btn.uuid = idns;
    btn.initializeWithLable(colorClipLabel);
    return btn;
  }

  addLayoutEvt() {
    if (this.autoLayout) {
      let sc = this.getScene();

      if (sc != null) {
        let EB = CoRScene.EventBase;
        sc.addEventListener(EB.RESIZE, this, this.resize);
      }
    }
  }

  removeLayoutEvt() {
    if (this.autoLayout) {
      let sc = this.getScene();

      if (sc != null) {
        let EB = CoRScene.EventBase;
        sc.removeEventListener(EB.RESIZE, this, this.resize);
      }
    }
  }

  resize(evt) {
    this.layout();
  }

  layout() {
    let sc = this.getScene();

    if (sc != null) {
      let width = this.getGlobalBounds().getWidth();
      let rect = sc.getRect(); // let bounds = this.getGlobalBounds();

      let px = rect.width - width;
      let py = rect.y + (rect.height - this.getHeight()) * 0.5;
      this.setXY(px, py);
      this.update();
    }
  }

  setZ(pz) {
    this.m_panel.setZ(pz);
  }

  setXY(px, py) {
    this.m_panel.setXY(px, py);
  }

  getGlobalBounds() {
    return this.m_panel.getGlobalBounds();
  }

  getWidth() {
    return this.m_panel.getWidth();
  }

  getHeight() {
    return this.m_panel.getHeight();
  }

  update() {
    this.m_panel.update();
  }

}

exports.NormalCtrlPanel = NormalCtrlPanel;

/***/ }),

/***/ "af66":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UIEntityContainer_1 = __webpack_require__("5e13");

const ColorLabel_1 = __webpack_require__("3f49");

class UIPanel extends UIEntityContainer_1.UIEntityContainer {
  constructor() {
    super();
    this.m_panelW = 100;
    this.m_panelH = 150;
    this.m_isOpen = false;
    this.autoLayout = true;
    this.m_openListener = null;
    this.m_closeListener = null;
    this.m_panelBuilding = true;
  }

  setSize(pw, ph) {
    this.m_panelW = pw;
    this.m_panelH = ph;
  }

  setBGColor(c) {
    if (this.m_bgColor == null) this.m_bgColor = CoMaterial.createColor4();
    this.m_bgColor.copyFrom(c);

    if (this.m_bgLabel != null) {
      this.m_bgLabel.setColor(c);
    }

    return this;
  } // initialize(scene: ICoUIScene, rpi: number, panelW: number, panelH: number): void {
  // 	if (this.isIniting()) {
  // 		this.init();
  // 		this.m_scene = scene;
  // 		this.m_rpi = rpi;
  // 		this.m_panelW = panelW;
  // 		this.m_panelH = panelH;
  // 		this.m_bgColor = CoMaterial.createColor4();
  // 	}
  // }


  init() {
    if (this.isIniting()) {
      if (this.m_bgColor == null) this.m_bgColor = CoMaterial.createColor4();
      super.init();
    }
  }

  setUIscene(scene, rpi = -1) {
    if (this.m_scene == null && scene != null) {
      this.m_scene = scene;
      if (rpi >= 0) this.m_rpi = rpi;
      this.init();
    }
  }

  openThis() {}

  closeThis() {}

  setOpenAndLoseListener(openListener, closeListener) {
    this.m_openListener = openListener;
    this.m_closeListener = closeListener;
  }

  open(uiscene = null, rpi = -1) {
    if (!this.m_isOpen) {
      if (this.isIniting()) {
        this.init();
      }

      if (uiscene != null) this.m_scene = uiscene;
      if (rpi >= 0) this.m_rpi = rpi;
      this.m_scene.addEntity(this, this.m_rpi);
      this.m_isOpen = true;
      this.setVisible(true);
      this.openThis();

      if (this.autoLayout) {
        this.addLayoutEvt();
        this.layout();
      }

      if (this.m_openListener != null) {
        this.m_openListener();
      }
    }
  }

  isOpen() {
    return this.m_isOpen;
  }

  close() {
    if (this.m_isOpen) {
      this.m_scene.removeEntity(this);
      this.m_isOpen = false;
      this.setVisible(false);
      this.removeLayoutEvt();
      this.closeThis();

      if (this.m_closeListener != null) {
        this.m_closeListener();
      }
    }
  }

  destroy() {
    super.destroy();
    this.m_panelBuilding = true;

    if (this.m_bgLabel != null) {
      this.m_bgLabel.destroy();
      this.m_bgLabel = null;
    }

    this.m_openListener = null;
    this.m_closeListener = null;
  }

  buildPanel(pw, ph) {}

  updateScene() {
    let sc = this.getScene();

    if (sc != null && this.m_panelBuilding && this.m_bgLabel == null) {
      this.m_panelBuilding = false;
      let pw = this.m_panelW;
      let ph = this.m_panelH;
      let bgLabel = this.createBG(pw, ph);
      this.buildPanel(pw, ph);
      this.addEntity(bgLabel);
      this.setVisible(this.m_isOpen);

      if (this.m_isOpen) {
        this.addLayoutEvt();
        this.layout();
      }
    }
  }

  addLayoutEvt() {
    if (this.autoLayout) {
      let sc = this.getScene();

      if (sc != null) {
        let EB = CoRScene.EventBase;
        sc.addEventListener(EB.RESIZE, this, this.resize);
      }
    }
  }

  removeLayoutEvt() {
    if (this.autoLayout) {
      let sc = this.getScene();

      if (sc != null) {
        let EB = CoRScene.EventBase;
        sc.removeEventListener(EB.RESIZE, this, this.resize);
      }
    }
  }

  createBG(pw, ph) {
    let bgLabel = new ColorLabel_1.ColorLabel();
    bgLabel.depthTest = true;
    bgLabel.initialize(pw, ph);
    bgLabel.setZ(-0.1);
    bgLabel.setColor(this.m_bgColor);
    this.m_bgLabel = bgLabel;
    this.initializeEvent(bgLabel.getREntities()[0]);
    return bgLabel;
  }

  initializeEvent(entity, uuid = "uiPlane") {
    const me = CoRScene.MouseEvent;
    let dpc = CoRScene.createMouseEvt3DDispatcher();
    dpc.currentTarget = this;
    dpc.uuid = uuid;
    dpc.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
    dpc.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
    entity.setEvtDispatcher(dpc);
    entity.mouseEnabled = true;
  }

  mouseOverListener(evt) {// console.log("mouseOverListener() ...");
  }

  mouseOutListener(evt) {// console.log("mouseOutListener() ...");
  }

  resize(evt) {
    this.layout();
  }

  layout() {
    let sc = this.getScene();

    if (sc != null) {
      this.update();
      let rect = sc.getRect();
      let px = rect.x + (rect.width - this.getWidth()) * 0.5;
      let py = rect.y + (rect.height - this.getHeight()) * 0.5;
      this.setXY(px, py);
      this.update();
    }
  }

}

exports.UIPanel = UIPanel;

/***/ }),

/***/ "b0fb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class UIEntityBase {
  constructor() {
    this.m_sc = null;
    this.m_parent = null;
    this.m_rotation = 0;
    this.m_visible = true;
    this.m_entities = [];
    this.m_width = 0;
    this.m_height = 0;
    this.m_v0 = null;
    this.m_bounds = null;
    this.m_rcontainer = null;
    this.premultiplyAlpha = false;
    this.transparent = false;
    this.info = null;
    this.depthTest = false;
  }

  init() {
    if (this.isIniting()) {
      this.m_pos = CoMath.createVec3();
      this.m_scaleV = CoMath.createVec3(1.0, 1.0, 1.0);
      this.m_v0 = CoMath.createVec3();
      this.m_bounds = CoMath.createAABB();
    }
  }

  isIniting() {
    return this.m_bounds == null;
  }

  createMaterial(tex = null) {
    let material = CoMaterial.createDefaultMaterial();
    material.premultiplyAlpha = this.premultiplyAlpha;

    if (tex != null) {
      material.setTextureList([tex]);
    }

    material.initializeByCodeBuf(tex != null);
    return material;
  }

  applyRST(entity) {
    const RST = CoRScene.RendererState;

    if (this.transparent) {
      if (this.premultiplyAlpha) {
        // entity.setRenderState(RST.BACK_ALPHA_ADD_BLENDSORT_STATE);
        entity.setRenderState(RST.BACK_ALPHA_ADD_ALWAYS_STATE);
      } else {
        if (this.depthTest) {
          entity.setRenderState(RST.BACK_TRANSPARENT_STATE);
        } else {
          entity.setRenderState(RST.BACK_TRANSPARENT_ALWAYS_STATE);
        }
      }
    } else {
      if (this.depthTest) {
        entity.setRenderState(RST.NORMAL_STATE);
      } else {
        entity.setRenderState(RST.BACK_NORMAL_ALWAYS_STATE);
      }
    }
  }

  createVS(startX, startY, pwidth, pheight) {
    let minX = startX;
    let minY = startY;
    let maxX = startX + pwidth;
    let maxY = startY + pheight;
    let pz = 0.0;
    return [minX, minY, pz, maxX, minY, pz, maxX, maxY, pz, minX, maxY, pz];
  }

  updateScene() {}

  updateParent() {}

  __$setScene(sc) {
    if (this.m_sc != sc) {
      this.m_sc = sc;
      this.updateScene();
    }
  }

  getScene() {
    return this.m_sc;
  }

  setParent(parent) {
    if (parent != this) {
      this.m_parent = parent;
      this.updateParent();
    }

    return this;
  }

  getParent() {
    return this.m_parent;
  }

  getGlobalBounds() {
    return this.m_bounds;
  }

  setVisible(v) {
    this.m_visible = v;
    let ls = this.m_entities;

    for (let i = 0; i < ls.length; ++i) {
      ls[i].setVisible(v);
    }

    if (this.m_rcontainer != null) {
      this.m_rcontainer.setVisible(v);
    }
  }

  isVisible() {
    return this.m_visible;
  }

  getWidth() {
    return this.m_bounds.getWidth();
  }

  getHeight() {
    return this.m_bounds.getHeight();
  }

  setPosition(pv) {
    this.m_pos.copyFrom(pv);
  }

  setX(x) {
    this.m_pos.x = x;
  }

  setY(y) {
    this.m_pos.y = y;
  }

  setZ(z) {
    this.m_pos.z = z;
  }

  getX() {
    return this.m_pos.x;
  }

  getY() {
    return this.m_pos.y;
  }

  getZ() {
    return this.m_pos.z;
  }

  setXY(px, py) {
    this.m_pos.x = px;
    this.m_pos.y = py;
  }

  getPosition(pv) {
    pv.copyFrom(this.m_pos);
  }

  setRotation(r) {
    this.m_rotation = r;
  }

  getRotation() {
    return this.m_rotation;
  }

  setScaleXYZ(sx, sy, sz) {
    this.m_scaleV.setXYZ(sx, sy, sz);
  }

  setScaleXY(sx, sy) {
    this.setScaleXYZ(sx, sy, 1.0);
  }

  setScaleX(sx) {
    this.m_scaleV.x = sx;
  }

  setScaleY(sy) {
    this.m_scaleV.y = sy;
  }

  getScaleX() {
    return this.m_scaleV.x;
  }

  getScaleY() {
    return this.m_scaleV.y;
  }

  copyTransformFrom(src) {
    if (src != null) {
      let sx = src.getScaleX();
      let sy = src.getScaleY();
      let r = src.getRotation();
      this.setScaleXY(sx, sy);
      this.setRotation(r);
      src.getPosition(this.m_v0);
      this.setPosition(this.m_v0);
    }
  }
  /**
   * get renderable entities for renderer scene
   * @returns ITransformEntity instance list
   */


  getREntities() {
    return this.m_entities.slice(0);
  }

  getRContainer() {
    return this.m_rcontainer;
  }

  updateEntity(e) {
    // console.log("XXXXX UIEntiyBase::this.m_pos: ", this.m_pos, e);
    e.setPosition(this.m_pos);
    e.setScale3(this.m_scaleV);
    e.setRotationXYZ(0.0, 0.0, this.m_rotation);
    e.update();
    this.m_bounds.union(e.getGlobalBounds());
  }

  update() {
    let ls = this.m_entities;
    let bs = this.m_bounds;
    this.m_bounds.reset();

    for (let i = 0; i < ls.length; ++i) {
      // let e = ls[i];
      // e.setPosition(this.m_pos);
      // e.setScale3(this.m_scaleV);
      // e.setRotationXYZ(0.0, 0.0, this.m_rotation);
      // e.update();
      // bs.union(e.getGlobalBounds());
      this.updateEntity(ls[i]);
    }

    if (this.m_rcontainer != null) {
      this.updateEntity(this.m_rcontainer);
    }

    bs.updateFast();
  }

  destroy() {
    let sc = this.m_sc;

    if (sc != null) {
      sc.removeEntity(this);
    }

    this.m_rcontainer = null;
    this.m_sc = null;
    this.m_parent = null;
    this.m_bounds = null;
    let ls = this.m_entities;

    for (let i = 0; i < ls.length; ++i) {
      ls[i].destroy();
    }

    ls = [];
  }

}

exports.UIEntityBase = UIEntityBase;

/***/ }),

/***/ "bb26":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const NormalLineMaterial_1 = __webpack_require__("d460");

const NormalEntityMaterial_1 = __webpack_require__("5627");

class NormalEntityBuilder {
  constructor() {
    this.m_normalLineScale = 1.0;
  }

  getEntityMaterial() {
    return this.m_entityMaterial;
  }

  getNormalLineMaterial() {
    return this.m_normalLineMaterial;
  }

  getNormalLineScale() {
    return this.m_normalLineScale;
  }

  createNormalEntity(model, nivs = null) {
    this.m_entityMaterial = new NormalEntityMaterial_1.NormalEntityMaterial();
    let material = this.m_entityMaterial.create();
    material.initializeByCodeBuf(false);
    this.m_entityMaterial.setRGB3f(0.7, 0.7, 0.7);
    let vs = model.vertices;
    let ivs = model.indices;
    let trisNumber = ivs.length / 3;
    let nvs2 = new Float32Array(vs.length);
    CoAGeom.SurfaceNormal.ClacTrisNormal(vs, vs.length, trisNumber, nivs != null ? nivs : ivs, nvs2); // nvs2.fill(1.0);

    let nvs = model.normals;

    if (nvs == null) {
      nvs = new Float32Array(vs.length);
    }

    let mesh = this.createEntityMesh(model.indices, model.vertices, nvs2, nvs, material);
    let entity = CoRScene.createMouseEventEntity();
    entity.setMaterial(material);
    entity.setMesh(mesh);
    entity.setRenderState(CoRScene.RendererState.NONE_CULLFACE_NORMAL_STATE);
    return entity;
  }

  createNormalLineEntity(srcEntity, srcvs, srcnvs, size = 5) {
    // let spv = CoRScene.createVec3(1.0);
    // srcEntity.localToGlobal(spv);
    // let scale = Math.abs(spv.x);
    let mat = srcEntity.getMatrix();
    let params = mat.decompose(CoMath.OrientationType.EULER_ANGLES);
    let scale = params[2].x;
    this.m_normalLineScale = size / scale; // console.log("line size: ", size, ", scale: ",scale, "lineScale: ", this.m_normalLineScale);

    let mb = new NormalLineMaterial_1.NormalLineMaterial();
    mb.setRGB3f(1.0, 0.0, 1.0);
    this.m_normalLineMaterial = mb;
    this.m_normalLineMaterial.setLength(this.m_normalLineScale);

    if (srcnvs == null) {
      let entity = CoRScene.createDisplayEntity(); // this.normalLine = entity;

      entity.setVisible(false);
      return entity;
    }

    let ml = CoMesh.line;
    ml.dynColorEnabled = true;
    let mesh;
    let vs = srcvs;
    let nvs = srcnvs;
    let tot = vs.length / 3;
    let j = 0;
    let k_vs = 0;
    let k_uvs = 0;
    let k_nvs = 0;
    let pvs = new Float32Array(tot * 6);
    let puvs = new Float32Array(tot * 4);
    let pnvs = new Float32Array(tot * 6);
    let v0 = CoRScene.createVec3();
    let v1 = CoRScene.createVec3();

    for (let i = 0; i < tot; ++i) {
      j = i * 3;
      v0.setXYZ(vs[j], vs[j + 1], vs[j + 2]);
      v1.setXYZ(nvs[j], nvs[j + 1], nvs[j + 2]);
      v0.toArray(pvs, k_vs);
      k_vs += 3;
      v0.toArray(pvs, k_vs);
      k_vs += 3;
      v1.toArray(pnvs, k_nvs);
      k_nvs += 3;
      v1.toArray(pnvs, k_nvs);
      k_nvs += 3;
      let k = k_uvs;
      puvs[k++] = 0.0;
      puvs[k++] = 0.0;
      puvs[k++] = 1.0;
      puvs[k++] = 1.0;
      k_uvs += 6;
    }

    let material = mb.create();
    let entity;
    entity = CoRScene.createDisplayEntity(srcEntity.getTransform());
    mesh = this.createLineMesh(pvs, puvs, pnvs, material);
    entity.setMesh(mesh);
    entity.setMaterial(material);
    entity.setVisible(false);
    return entity;
  }

  createLineMesh(vs, uvs, nvs, material) {
    let mesh = CoMesh.createRawMesh();
    mesh.ivsEnabled = false;
    mesh.aabbEnabled = true;
    mesh.reset();
    mesh.setBufSortFormat(material.getBufSortFormat());
    mesh.addFloat32Data(vs, 3);
    mesh.addFloat32Data(uvs, 2);
    mesh.addFloat32Data(nvs, 3);
    mesh.vbWholeDataEnabled = false;
    mesh.initialize();
    mesh.toArraysLines();
    mesh.vtCount = Math.floor(vs.length / 3);
    return mesh;
  }

  createEntityMesh(ivs, vs, uvs, nvs, matrial) {
    let mesh = CoMesh.createRawMesh(); // mesh.ivsEnabled = false;
    // mesh.aabbEnabled = true;

    mesh.reset();
    mesh.setBufSortFormat(matrial.getBufSortFormat());
    mesh.setIVS(ivs);
    mesh.addFloat32Data(vs, 3);
    mesh.addFloat32Data(uvs, 3);
    mesh.addFloat32Data(nvs, 3);
    mesh.vbWholeDataEnabled = false;
    mesh.initialize(); // mesh.toArraysLines();
    // mesh.vtCount = Math.floor(vs.length / 3);

    return mesh;
  }

  destroy() {
    this.m_entityMaterial = null;
    this.m_normalLineMaterial = null;
  }

}

exports.NormalEntityBuilder = NormalEntityBuilder;

/***/ }),

/***/ "bb62":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ClipLabelBase_1 = __webpack_require__("67d8");

class ClipColorLabel extends ClipLabelBase_1.ClipLabelBase {
  constructor() {
    super(...arguments);
    this.m_colors = null;
    this.m_material = null;
    this.m_fixSize = true;
    this.m_hasTex = false;
  }

  createMesh(atlas, idns) {
    let ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
    let vs = new Float32Array(this.createVS(0, 0, this.m_width, this.m_height));
    let mesh = CoMesh.createRawMesh();
    mesh.reset();
    mesh.setIVS(ivs);
    mesh.addFloat32Data(vs, 3);

    if (idns != "" && atlas != null) {
      let obj = atlas.getTexObjFromAtlas(idns);
      let uvs = new Float32Array(obj.uvs);
      mesh.addFloat32Data(uvs, 2);
    }

    mesh.initialize();
    return mesh;
  }

  hasTexture() {
    return this.m_hasTex;
  }

  initialize(atlas, idns, colorsTotal) {
    if (this.isIniting() && colorsTotal > 0) {
      this.init();
      this.m_hasTex = false;
      let tex = null;

      if (idns != "" && atlas != null) {
        let obj = atlas.getTexObjFromAtlas(idns);

        if (this.m_fixSize) {
          this.m_width = obj.getWidth();
          this.m_height = obj.getHeight();
        }

        this.m_hasTex = true;
        tex = obj.texture;
      }

      let material = this.createMaterial(tex);
      let mesh = this.createMesh(atlas, idns);
      let et = CoEntity.createDisplayEntity();
      et.setMaterial(material);
      et.setMesh(mesh);
      this.m_entities.push(et);
      this.m_material = material;
      let colors = new Array(colorsTotal);

      for (let i = 0; i < colorsTotal; ++i) {
        colors[i] = CoMaterial.createColor4();
      }

      this.m_colors = colors;
      this.m_total = colorsTotal;
      this.setClipIndex(0);
    }
  }

  initializeWithoutTex(width, height, colorsTotal) {
    this.m_width = width;
    this.m_height = height;
    this.m_fixSize = false;
    this.initialize(null, "", colorsTotal);
  }

  initializeWithSize(width, height, atlas, idns, colorsTotal) {
    if (width > 0 && height > 0) {
      this.m_width = width;
      this.m_height = height;
      this.m_fixSize = false;
      this.initialize(atlas, idns, colorsTotal);
    }
  }

  initializeWithLable(srcLable) {
    if (this.isIniting() && srcLable != null && srcLable != this) {
      if (srcLable.getClipsTotal() < 1) {
        throw Error("Error: srcLable.getClipsTotal() < 1");
      }

      let ls = srcLable.getREntities();

      for (let i = 0; i < ls.length; ++i) {
        let entity = ls[i];
        let mesh = entity.getMesh();
        let tex = entity.getMaterial().getTextureAt(0);
        let n = this.m_total = srcLable.getClipsTotal();
        let src = srcLable.getColors();
        let colors = new Array(n);

        for (let i = 0; i < n; ++i) {
          colors[i] = CoMaterial.createColor4();
          colors[i].copyFrom(src[i]);
        }

        this.m_colors = colors;
        this.m_width = srcLable.getWidth();
        this.m_height = srcLable.getHeight();
        let material = this.createMaterial(tex);
        let et = CoEntity.createDisplayEntity();
        et.setMaterial(material);
        et.setMesh(mesh);
        this.m_entities.push(et);
        if (this.m_material == null) this.m_material = material;
      }

      this.setClipIndex(0);
    }
  }

  displaceFromLable(srcLable) {
    if (srcLable != null && srcLable != this) {
      if (srcLable.getClipsTotal() < 1) {
        throw Error("Error: srcLable.getClipsTotal() < 1");
      } // if (this.m_entities == null) {
      // 	this.initializeWithLable(srcLable);
      // } else if (this.m_entities[0].isRFree()) {
      // }

    }
  }

  getColorAt(i) {
    if (i >= 0 && i < this.m_total) {
      return this.m_colors[i];
    }
  }

  setColorAt(i, color4) {
    if (i >= 0 && i < this.m_total && color4 != null) {
      this.m_colors[i].copyFrom(color4);
    }
  }

  setColors(colors) {
    if (colors != null) {
      let ls = this.m_colors;
      let len = colors.length;

      if (len > ls.length) {
        len = ls.length;
      }

      for (let i = 0; i < len; ++i) {
        ls[i].copyFrom(colors[i]);
      }
    }
  }

  setClipIndex(i) {
    if (i >= 0 && i < this.m_total) {
      this.m_index = i;
      this.m_material.setColor(this.m_colors[i]);
    }
  }

  getColors() {
    return this.m_colors;
  }

}

exports.ClipColorLabel = ClipColorLabel;

/***/ }),

/***/ "ccfe":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const TextLabel_1 = __webpack_require__("1dd7");

const UIPanel_1 = __webpack_require__("af66");

const ButtonBuilder_1 = __webpack_require__("2870");

const AxisAlignCalc_1 = __webpack_require__("ab08");

class PromptPanel extends UIPanel_1.UIPanel {
  constructor() {
    super();
    this.m_promptLabel = null;
    this.m_prompt = "Hi,Prompt Panel.";
    this.m_btnW = 90;
    this.m_btnH = 50;
    this.m_confirmFunc = null;
    this.m_cancelFunc = null;
    this.m_cancelBtnVis = true;
    this.marginWidth = 70;
    /**
     * x轴留白比例
     */

    this.marginXFactor = 0.5;
    /**
     * y轴留白比例
     */

    this.marginYFactor = 0.6;
    this.m_alignCalc = new AxisAlignCalc_1.AxisAlignCalc();
  }

  initialize(scene, rpi, panelW, panelH, btnW, btnH, confirmNS = "Confirm", cancelNS = "Cancel") {
    if (this.isIniting()) {
      this.init();
      this.m_scene = scene;
      this.m_rpi = rpi;
      this.m_panelW = panelW;
      this.m_panelH = panelH;
      this.m_btnW = btnW;
      this.m_btnH = btnH;
      this.m_confirmNS = confirmNS;
      this.m_cancelNS = cancelNS;
      this.m_bgColor = CoMaterial.createColor4();
    }
  }

  applyConfirmButton() {
    this.m_cancelBtnVis = false;
    let btn = this.m_cancelBtn;

    if (btn != null && !btn.isVisible()) {
      this.m_cancelBtn.setVisible(false);

      if (this.m_confirmBtn != null && this.isOpen()) {
        this.layoutItems();
        this.layout();
      }
    }
  }

  applyAllButtons() {
    this.m_cancelBtnVis = true;

    if (this.m_cancelBtn != null) {
      this.m_cancelBtn.setVisible(true);
    }
  }

  setPrompt(text) {
    if (text != "" && this.m_prompt != text) {
      this.m_prompt = text;
      let pl = this.m_promptLabel;

      if (pl != null) {
        pl.setText(text);
        let px = (this.m_panelW - pl.getWidth()) * 0.5;
        pl.setX(px);
        pl.update();

        if (this.m_confirmBtn != null && this.isOpen()) {
          this.layoutItems();
          this.layout();
        }
      }
    }
  }

  setPromptTextColor(color) {
    let pl = this.m_promptLabel;

    if (pl != null) {
      pl.setColor(color);
    }
  }

  setListener(confirmFunc, cancelFunc) {
    this.m_confirmFunc = confirmFunc;
    this.m_cancelFunc = cancelFunc;
  }

  destroy() {
    super.destroy();
    this.m_confirmFunc = null;
    this.m_cancelFunc = null;

    if (this.m_confirmBtn != null) {
      this.m_confirmBtn.destroy();
      this.m_cancelBtn.destroy();
      this.m_bgLabel.destroy();
      this.m_confirmBtn = null;
      this.m_cancelBtn = null;
      this.m_bgLabel = null;
    }
  }

  buildPanel(pw, ph) {
    this.buildItems();
  }

  buildItems() {
    if (this.m_confirmBtn != null) {
      return;
    }

    let sc = this.getScene();
    let textLabel = new TextLabel_1.TextLabel();
    textLabel.depthTest = true;
    textLabel.transparent = true;
    textLabel.premultiplyAlpha = true;
    textLabel.initialize(this.m_prompt, sc);
    this.m_promptLabel = textLabel; // console.log("textLabel.getHeight(): ", textLabel.getHeight());

    let tta = sc.transparentTexAtlas;
    let fc4 = CoMaterial.createColor4;
    let ME = CoRScene.MouseEvent;
    let textParam = {
      text: this.m_confirmNS,
      textColor: fc4(),
      fontSize: 30,
      font: ""
    };
    let colors = [fc4().setRGB3Bytes(80, 80, 80), fc4().setRGB3Bytes(110, 110, 110), fc4().setRGB3Bytes(90, 90, 90)];
    let builder = ButtonBuilder_1.ButtonBuilder;
    let confirmBtn = builder.createTextButton(this.m_btnW, this.m_btnH, "confirm", tta, textParam, colors);
    this.m_confirmBtn = confirmBtn;
    textParam.text = this.m_cancelNS;
    let cancelBtn = builder.createTextButton(this.m_btnW, this.m_btnH, "cancel", tta, textParam, colors); // cancelBtn.addEventListener(ME.MOUSE_UP, this, this.btnMouseUpListener);

    this.m_cancelBtn = cancelBtn;
    this.addEntity(cancelBtn);
    this.addEntity(confirmBtn);
    this.addEntity(textLabel);
  }

  updateBgSize() {
    let pw = this.m_panelW;
    let textLabel = this.m_promptLabel;
    textLabel.update();
    let confirmBtn = this.m_confirmBtn;
    confirmBtn.update();
    let cancelBtn = this.m_cancelBtn;
    cancelBtn.update();
    let bw = cancelBtn.isVisible() ? cancelBtn.getWidth() : 0;
    let btw2 = confirmBtn.getWidth() + bw;
    bw = btw2 + Math.round(0.2 * btw2) + this.marginWidth;
    let tw = textLabel.getWidth() + this.marginWidth;
    tw = bw > tw ? bw : tw;
    pw = this.m_panelW = tw;
    let bgLabel = this.m_bgLabel;

    if (Math.abs(bgLabel.getWidth() - pw) > 0.01) {
      bgLabel.setScaleX(1.0);
      bgLabel.update();
      tw = bgLabel.getWidth();
      bgLabel.setScaleX(pw / tw);
      bgLabel.update();
    }
  }

  layoutItems() {
    this.m_cancelBtn.setVisible(this.m_cancelBtnVis);
    this.updateBgSize();
    let pw = this.m_panelW;
    let textLabel = this.m_promptLabel;
    let sizes = [this.m_btnH, textLabel.getHeight()];
    let pyList = this.m_alignCalc.calcAvgFixLayout(sizes, this.m_panelH, 15, this.marginYFactor, 0.5);
    let px = (pw - textLabel.getWidth()) * 0.5;
    textLabel.setXY(px, pyList[1]);
    textLabel.update();

    if (this.m_cancelBtn.isVisible()) {
      this.layoutButtons(px, pyList[0]);
    } else {
      this.layoutOnlyConfirm(px, pyList[0]);
    }
  }

  layoutButtons(px, py) {
    let sizes = [this.m_btnW, this.m_btnW];
    let pxList = this.m_alignCalc.calcAvgFixLayout(sizes, this.m_panelW, 10, this.marginXFactor, 0.5);
    let confirmBtn = this.m_confirmBtn;
    let cancelBtn = this.m_cancelBtn;
    confirmBtn.setXY(pxList[0], py);
    confirmBtn.update();
    cancelBtn.setXY(pxList[1], py);
    cancelBtn.update();
  }

  layoutOnlyConfirm(px, py) {
    let sizes = [this.m_btnW];
    let pxList = this.m_alignCalc.calcAvgFixLayout(sizes, this.m_panelW, 10, this.marginXFactor, 0.5);
    let confirmBtn = this.m_confirmBtn;
    confirmBtn.setXY(pxList[0], py);
    confirmBtn.update();
  }

  openThis() {
    let ME = CoRScene.MouseEvent;

    if (this.m_scene != null) {
      this.m_scene.addEventListener(ME.MOUSE_DOWN, this, this.stMouseDownListener);
      this.m_confirmBtn.addEventListener(ME.MOUSE_UP, this, this.btnMouseUpListener);
      this.m_cancelBtn.addEventListener(ME.MOUSE_UP, this, this.btnMouseUpListener);
      this.layoutItems();
    }
  }

  closeThis() {
    this.m_cancelBtnVis = true;
    let ME = CoRScene.MouseEvent;

    if (this.m_scene != null) {
      this.m_scene.removeEventListener(ME.MOUSE_DOWN, this, this.stMouseDownListener);
      this.m_confirmBtn.removeEventListener(ME.MOUSE_UP, this, this.btnMouseUpListener);
      this.m_cancelBtn.removeEventListener(ME.MOUSE_UP, this, this.btnMouseUpListener);
    }
  }

  stMouseDownListener(evt) {
    console.log("Prompt stMouseDownListener...");
    let px = evt.mouseX;
    let py = evt.mouseY;
    let pv = this.m_v0;
    pv.setXYZ(px, py, 0);
    this.globalToLocal(pv);

    if (pv.x < 0 || pv.x > this.m_panelW || pv.y < 0 || pv.y > this.m_panelH) {
      this.close();
    }
  }

  btnMouseUpListener(evt) {
    console.log("PromptPanel::btnMouseUpListener(), evt.currentTarget: ", evt.currentTarget);
    let uuid = evt.uuid;

    switch (uuid) {
      case "confirm":
        this.close();

        if (this.m_confirmFunc != null) {
          this.m_confirmFunc();
        }

        break;

      case "cancel":
        this.close();

        if (this.m_cancelFunc != null) {
          this.m_cancelFunc();
        }

        break;

      default:
        break;
    }
  }

}

exports.PromptPanel = PromptPanel;

/***/ }),

/***/ "d460":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class NormalLineMaterial {
  constructor() {
    this.m_data = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    this.m_scale = 1.0;
  }

  setRGB3f(pr, pg, pb) {
    this.m_data[0] = pr;
    this.m_data[1] = pg;
    this.m_data[2] = pb;
  }

  getRGB3f(color) {
    let ds = this.m_data;
    color.setRGB3f(ds[0], ds[1], ds[2]);
  }

  getRGBA4f(color) {
    color.fromArray(this.m_data);
  }

  setScale(s) {
    this.m_scale = s;
  }

  setLength(length) {
    this.m_data[3] = this.m_scale * length;
  }

  getLegnth() {
    return this.m_data[3];
  }

  setColor(color) {
    color.toArray3(this.m_data);
  }

  getColor(color) {
    color.fromArray3(this.m_data);
  }
  /**
   * @param textureEnabled the default value is false
   */


  create() {
    if (this.material == null) {
      let textureEnabled = false;
      let material = CoRScene.createShaderMaterial("normal_dyn_line_material");
      material.addUniformDataAt("u_color", this.m_data);
      material.setShaderBuilder(coderBuilder => {
        let coder = coderBuilder.getShaderCodeBuilder();
        coder.addVertLayout("vec2", "a_uvs");
        coder.addVertLayout("vec3", "a_nvs");
        coder.addVertUniform("vec4", "u_color");
        coder.addFragUniform("vec4", "u_color");
        coder.addFragOutputHighp("vec4", "FragColor0");
        coder.addFragMainCode(`
			FragColor0 = vec4(u_color.xyz, 1.0);
					`);
        coder.addVertMainCode(`
			viewPosition = u_viewMat * u_objMat * vec4(a_vs + u_color.www * a_nvs * a_uvs.xxx,1.0);
			vec4 pv = u_projMat * viewPosition;
			
			gl_Position = pv;
					`);
      });
      material.initializeByCodeBuf(textureEnabled);
      this.material = material;
    }

    return this.material;
  }

}

exports.NormalLineMaterial = NormalLineMaterial;

/***/ }),

/***/ "d755":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class DropModelFileController {
  constructor() {
    this.m_canvas = null;
    this.m_listener = null;
  }

  initialize(canvas, listener) {
    if (this.m_canvas == null) {
      this.m_canvas = canvas;
      this.m_listener = listener;
      this.initDrop(this.m_canvas);
    }
  }

  initDrop(canvas) {
    // --------------------------------------------- 阻止必要的行为 begin
    canvas.addEventListener("dragenter", e => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
    canvas.addEventListener("dragover", e => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
    canvas.addEventListener("dragleave", e => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
    canvas.addEventListener("drop", e => {
      e.preventDefault();
      e.stopPropagation();
      console.log("canvas drop evt.", e);
      this.receiveDropFile(e);
    }, false);
  }

  receiveDropFile(e) {
    if (this.m_listener.isDropEnabled()) {
      let dt = e.dataTransfer; // 只能拽如一个文件或者一个文件夹里面的所有文件。如果文件夹里面有子文件夹则子文件夹中的文件不会载入

      let files = [];
      let filesTotal = 0;
      let filesCurrTotal = 0;

      if (dt.items !== undefined) {
        let items = dt.items; // Chrome有items属性，对Chrome的单独处理

        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          let entity = item.webkitGetAsEntry();

          if (entity != null) {
            if (entity.isFile) {
              let file = item.getAsFile(); // console.log("drop a file: ", file);

              files.push(file);
              this.m_listener.initFileLoad(files);
              filesTotal = 1;
            } else if (entity.isDirectory) {
              // let file = item.getAsFile();
              let dr = entity.createReader(); // console.log("drop a dir, dr: ", dr);

              dr.readEntries(entries => {
                filesTotal = entries.length;

                if (filesTotal > 0) {
                  // 循环目录内容
                  entries.forEach(entity => {
                    if (entity.isFile) {
                      entity.file(file => {
                        files.push(file);
                        filesCurrTotal++;

                        if (filesTotal == filesCurrTotal) {
                          this.m_listener.initFileLoad(files);
                        }
                      });
                    }
                  });
                } else {
                  this.alertShow(31);
                }
              });
              break;
            }
          }

          if (filesTotal > 0) {
            break;
          }
        }
      }
    }
  }

  alertShow(flag) {
    switch (flag) {
      case 31:
        alert("没有找到对应的模型文件");
        break;

      default:
        break;
    }
  }

}

exports.DropModelFileController = DropModelFileController;

/***/ }),

/***/ "d8b4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const NormalViewerScene_1 = __webpack_require__("7435");

const CoDataModule_1 = __webpack_require__("7c62");

class NormalViewer {
  constructor() {
    this.m_uiscene = null;
    this.m_codata = new CoDataModule_1.CoDataModule();
    this.normalScene = null;
  }

  getUIScene() {
    return this.m_uiscene;
  }

  initialize(uiscene, transUI) {
    if (this.m_uiscene == null) {
      this.m_codata.initialize(null, true);
      this.m_uiscene = uiscene;
      this.normalScene = new NormalViewerScene_1.NormalViewerScene();
      this.normalScene.initialize(uiscene, this.m_codata, transUI);
    }
  }

  destroy() {
    this.m_uiscene = null;

    if (this.normalScene != null) {
      this.normalScene.destroy();
      this.normalScene = null;
    }
  }

  open(scene = null) {
    this.normalScene.open();
  }

  isOpen() {
    return true;
  }

  close() {
    this.normalScene.close();
  }

  update() {
    this.normalScene.update();
  }

}

exports.NormalViewer = NormalViewer;

/***/ }),

/***/ "e9fd":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CoPostOutline_1 = __webpack_require__("89c1");

const NVTransUI_1 = __webpack_require__("5dcb");

const NVNavigationUI_1 = __webpack_require__("3120");

const NormalViewer_1 = __webpack_require__("d8b4");

const PromptSystem_1 = __webpack_require__("3f7d");

const CoModuleLoader_1 = __webpack_require__("2a2b");

const TipsSystem_1 = __webpack_require__("1389"); //*


class LoadingUI {
  constructor() {
    this.m_bodyDiv = null;
    this.m_infoDiv = null;
  }

  initUI() {
    document.body.style.background = "#000000";

    if (this.m_bodyDiv == null) {
      this.m_bodyDiv = document.createElement('div');
      this.m_bodyDiv.style.width = "100vw";
      this.m_bodyDiv.style.height = "100vh";
      this.m_bodyDiv.style.zIndex = "9999";
      this.elementCenter(this.m_bodyDiv);
      document.body.appendChild(this.m_bodyDiv);
      document.body.style.margin = '0';
    }
  }

  showInfo(str) {
    if (this.m_infoDiv == null) {
      this.m_infoDiv = document.createElement('div');
      this.m_infoDiv.style.backgroundColor = "rgba(255,255,255,0.1)";
      this.m_infoDiv.style.color = "#00ee00";
      this.m_infoDiv.style.zIndex = "10000";
      this.elementCenter(this.m_infoDiv);
      this.m_bodyDiv.appendChild(this.m_infoDiv);
    } // this.m_bodyDiv.parentElement.removeChild(this.m_bodyDiv);
    // this.m_bodyDiv.parentElement.removeChild(this.m_bodyDiv);
    // document.body.appendChild(this.m_bodyDiv);


    this.m_infoDiv.innerHTML = str;
  }

  showLoadProgressInfo(progress) {
    let str = "loading " + Math.round(100.0 * progress) + "% ";
    this.showInfo(str);
  }

  showLoadStart() {
    this.showInfo("loading 0%");
  }

  showLoaded() {
    this.showInfo("100%");
  }

  loadFinish(index = 0) {
    if (this.m_bodyDiv != null) {
      this.m_bodyDiv.parentElement.removeChild(this.m_bodyDiv);
      this.m_bodyDiv = null;
    }
  }

  elementCenter(ele, top = "50%", left = "50%", position = "absolute") {
    ele.style.textAlign = "center";
    ele.style.display = "flex";
    ele.style.flexDirection = "column";
    ele.style.justifyContent = "center";
    ele.style.alignItems = "center"; // ele.style.top = top;
    // ele.style.left = left;
    // ele.style.position = position;
    // ele.style.transform = "translate(-50%, -50%)";
  }

} //*/


class SceneAccessor {
  constructor() {}

  renderBegin(rendererScene) {
    let p = rendererScene.getRenderProxy();
    p.clearDepth(1.0);
  }

  renderEnd(rendererScene) {}

}
/**
 * cospace renderer
 */


class DemoVox3DEditor {
  constructor() {
    this.m_rsc = null;
    this.m_editUIRenderer = null;
    this.m_uirsc = null;
    this.m_coUIScene = null;
    this.m_interact = null;
    this.m_transUI = new NVTransUI_1.NVTransUI();
    this.m_nvaUI = new NVNavigationUI_1.NVNavigationUI();
    this.m_loadingUI = new LoadingUI();
    this.m_viewer = null;
    this.m_graph = null;
  }

  initialize() {
    document.oncontextmenu = function (e) {
      e.preventDefault();
    };

    console.log("DemoVox3DEditor::initialize() ...");
    this.initEngineModule();
    this.m_loadingUI.initUI();
    this.m_loadingUI.showInfo("initializing rendering engine...");
  }

  initEngineModule() {
    let url = "static/cospace/engine/uiInteract/CoUIInteraction.umd.js";
    let uiInteractML = new CoModuleLoader_1.CoModuleLoader(2, () => {
      this.initInteract();
    });
    let url0 = "static/cospace/engine/renderer/CoRenderer.umd.js";
    let url1 = "static/cospace/engine/rscene/CoRScene.umd.js";
    let url2 = "static/cospace/math/CoMath.umd.js";
    let url3 = "static/cospace/ageom/CoAGeom.umd.js";
    let url4 = "static/cospace/coedit/CoEdit.umd.js";
    let url5 = "static/cospace/comesh/CoMesh.umd.js";
    let url6 = "static/cospace/coentity/CoEntity.umd.js";
    let url7 = "static/cospace/particle/CoParticle.umd.js";
    let url8 = "static/cospace/coMaterial/CoMaterial.umd.js";
    let url9 = "static/cospace/cotexture/CoTexture.umd.js";
    let url10 = "static/cospace/coui/CoUI.umd.js";
    let url11 = "static/cospace/cotext/CoText.umd.js";
    new CoModuleLoader_1.CoModuleLoader(2, () => {
      if (this.isEngineEnabled()) {
        console.log("engine modules loaded ...");
        this.initRenderer();
        this.initScene();
        this.m_loadingUI.showInfo("initializing editor system...");
        new CoModuleLoader_1.CoModuleLoader(3, () => {
          console.log("math module loaded ...");
          new CoModuleLoader_1.CoModuleLoader(7, () => {
            console.log("ageom module loaded ...");
            this.initEditUI();
            this.m_loadingUI.loadFinish(0);
          }).load(url3).load(url4).load(url6).load(url7).load(url9).load(url10).load(url11);
        }).load(url2).load(url5).load(url8);
      }
    }).addLoader(uiInteractML).load(url0).load(url1);
    uiInteractML.load(url);
  }

  initEditUI() {
    this.m_coUIScene = CoUI.createUIScene();
    this.m_coUIScene.initialize(this.m_rsc, 512, 5);
    this.m_uirsc = this.m_coUIScene.rscene;
    this.m_graph.addScene(this.m_uirsc);
    let promptSys = new PromptSystem_1.PromptSystem();
    promptSys.initialize(this.m_coUIScene);
    this.m_coUIScene.prompt = promptSys;
    let tipsSys = new TipsSystem_1.TipsSystem();
    tipsSys.initialize(this.m_coUIScene);
    this.m_coUIScene.tips = tipsSys;
    this.m_transUI.setOutline(this.m_outline);
    this.m_transUI.initialize(this.m_rsc, this.m_editUIRenderer, this.m_coUIScene);
    this.m_nvaUI.initialize(this.m_rsc, this.m_editUIRenderer, this.m_coUIScene);
    let minV = CoMath.createVec3(-100, 0, -100);
    let maxV = minV.clone().scaleBy(-1);
    let scale = 10.0;
    let grid = CoEdit.createFloorLineGrid();
    grid.initialize(this.m_rsc, 0, minV.scaleBy(scale), maxV.scaleBy(scale), 30);
    let viewer = new NormalViewer_1.NormalViewer();
    viewer.initialize(this.m_coUIScene, this.m_transUI);
    viewer.open();
    this.m_viewer = viewer;
    let entitySC = viewer.normalScene.entityScene;
    entitySC.initialize(this.m_rsc);
  }

  initScene() {}

  isEngineEnabled() {
    return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
  }

  initInteract() {
    let r = this.m_rsc;

    if (r != null && this.m_interact == null && typeof CoUIInteraction !== "undefined") {
      this.m_interact = CoUIInteraction.createMouseInteraction();
      this.m_interact.initialize(this.m_rsc, 2, true);
      this.m_interact.setSyncLookAtEnabled(true);
    }
  }

  initRenderer() {
    if (this.m_rsc == null) {
      let RendererDevice = CoRScene.RendererDevice;
      RendererDevice.SHADERCODE_TRACE_ENABLED = false;
      RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
      RendererDevice.SetWebBodyColor("#606060");
      let rparam = CoRScene.createRendererSceneParam();
      rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
      rparam.setCamPosition(1000.0, 1000.0, 1000.0);
      rparam.setCamProject(45, 20.0, 9000.0);
      let rscene = CoRScene.createRendererScene(rparam, 3);
      rscene.setClearRGBColor3f(0.23, 0.23, 0.23); // console.log("60/255: ", 60/255);
      // rscene.setClearUint24Color((60 << 16) + (60 << 8) + 60);

      rscene.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.mouseDownListener); // rscene.addEventListener(CoRScene.KeyboardEvent.KEY_DOWN, this, this.keyDown);
      // rscene.addEventListener(CoRScene.MouseEvent.MOUSE_BG_CLICK, this, this.mouseClickListener);
      // rscene.addEventListener(CoRScene.MouseEvent.MOUSE_RIGHT_UP, this, this.mouseUpListener, true, true);

      this.m_rsc = rscene;
      let subScene = this.m_rsc.createSubScene(rparam, 3, false);
      subScene.enableMouseEvent(true);
      subScene.setAccessor(new SceneAccessor());
      this.m_editUIRenderer = subScene;
      this.m_graph = CoRScene.createRendererSceneGraph();
      this.m_graph.addScene(this.m_rsc);
      this.m_graph.addScene(this.m_editUIRenderer);
      this.m_outline = new CoPostOutline_1.CoPostOutline(rscene);
    }
  }

  mouseUpListener(evt) {
    console.log("mouse up action...");
  }

  mouseDownListener(evt) {
    console.log("DemoVox3DEditor::mouseDownListener() ...");
  }

  keyDown(evt) {
    console.log("DemoVox3DEditor::keyDown() ..., evt.keyCode: ", evt.keyCode);
    let KEY = CoRScene.Keyboard;

    switch (evt.keyCode) {
      case KEY.S:
        break;

      default:
        break;
    }
  }

  run() {
    if (this.m_graph != null) {
      if (this.m_interact != null) {
        this.m_interact.setLookAtPosition(null);
        this.m_interact.run();
      }

      if (this.m_transUI != null) {
        this.m_transUI.run();
      }

      this.m_graph.run();
    }
  }

}

exports.DemoVox3DEditor = DemoVox3DEditor;
exports.default = DemoVox3DEditor;

/***/ }),

/***/ "eb56":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ClipLabel_1 = __webpack_require__("3914");

const UIEntityBase_1 = __webpack_require__("b0fb");

class Button extends UIEntityBase_1.UIEntityBase {
  constructor() {
    super();
    this.m_enabled = true;
    this.m_lb = null;
    this.m_lbs = [];
    this.uuid = "btn";
  }

  addLabel(label) {
    this.m_lbs.push(label);
  }

  enable() {
    if (this.m_dp != null) {
      this.m_dp.enabled = true;
    }

    this.m_enabled = true;
    return this;
  }

  disable() {
    if (this.m_dp != null) {
      this.m_dp.enabled = false;
    }

    this.m_enabled = false;
    return this;
  }

  isEnabled() {
    return this.m_enabled;
  }

  setMouseEnabled(enabled) {
    if (this.m_entities != null) {
      this.m_entities[0].mouseEnabled = enabled;
    }
  }

  isMouseEnabled() {
    return this.m_entities != null && this.m_entities[0].mouseEnabled;
  }

  initialize(atlas, idnsList = null) {
    if (this.isIniting() && atlas != null && idnsList != null) {
      this.init();

      if (idnsList.length != 4) {
        throw Error("Error: idnsList.length != 4");
      }

      let lb = new ClipLabel_1.ClipLabel();
      lb.initialize(atlas, idnsList);
      this.m_lb = lb;
      this.initializeEvent();
      this.m_lb.setClipIndex(0);
    }

    return this;
  }

  initializeWithLable(lable) {
    if (this.isIniting()) {
      this.init();

      if (lable.getClipsTotal() < 1) {
        throw Error("Error: lable.getClipsTotal() < 1");
      }

      this.m_lb = lable;
      this.initializeEvent();
      this.m_lb.setClipIndex(0);
    }

    return this;
  }

  getLable() {
    return this.m_lb;
  }

  initializeEvent() {
    if (this.m_dp == null) {
      const me = CoRScene.MouseEvent;
      let dpc = CoRScene.createMouseEvt3DDispatcher();
      dpc.currentTarget = this;
      dpc.uuid = this.uuid;
      dpc.enabled = this.m_enabled;
      dpc.addEventListener(me.MOUSE_DOWN, this, this.mouseDownListener);
      dpc.addEventListener(me.MOUSE_UP, this, this.mouseUpListener);
      dpc.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
      dpc.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
      this.m_lb.getREntities()[0].setEvtDispatcher(dpc);
      this.m_dp = dpc;
    }

    this.m_entities = this.m_lb.getREntities().slice(0);
    this.m_entities[0].mouseEnabled = true;
  }

  setVisible(v) {
    super.setVisible(v);
    let ls = this.m_lbs;

    for (let i = 0; i < ls.length; ++i) {
      ls[i].setVisible(v);
    }
  }

  addEventListener(type, listener, func, captureEnabled = true, bubbleEnabled = false) {
    this.m_dp.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    return this;
  }

  removeEventListener(type, listener, func) {
    this.m_dp.removeEventListener(type, listener, func);
    return this;
  }

  mouseOverListener(evt) {
    // console.log("Button::mouseOverListener() ...");
    if (this.m_enabled) {
      this.m_lb.setClipIndex(1);
      let ls = this.m_lbs;

      if (ls.length > 0) {
        for (let i = 0; i < ls.length; ++i) {
          ls[i].setClipIndex(1);
        }
      }
    }
  }

  mouseOutListener(evt) {
    // console.log("Button::mouseOutListener() ...");
    if (this.m_enabled) {
      this.m_lb.setClipIndex(0);
      let ls = this.m_lbs;

      if (ls.length > 0) {
        for (let i = 0; i < ls.length; ++i) {
          ls[i].setClipIndex(0);
        }
      }
    }
  }

  mouseDownListener(evt) {
    // console.log("Button::mouseDownListener() ...");
    if (this.m_enabled) {
      this.m_lb.setClipIndex(2);
      let ls = this.m_lbs;

      if (ls.length > 0) {
        for (let i = 0; i < ls.length; ++i) {
          ls[i].setClipIndex(2);
        }
      }
    }
  }

  mouseUpListener(evt) {
    if (this.m_enabled) {
      this.m_lb.setClipIndex(3);
      let ls = this.m_lbs;

      if (ls.length > 0) {
        for (let i = 0; i < ls.length; ++i) {
          ls[i].setClipIndex(3);
        }
      }
    }
  }

  setClipIndex(i) {
    this.m_lb.setClipIndex(i);
    return this;
  }

  copyTransformFrom(src) {
    if (src != null) {
      let sx = src.getScaleX();
      let sy = src.getScaleY();
      let r = src.getRotation();
      this.setScaleXY(sx, sy);
      this.setRotation(r);
      src.getPosition(this.m_v0);
      this.setPosition(this.m_v0);
    }
  }
  /**
   * get renderable entity for renderer scene
   * @returns ITransformEntity instance
   */


  getREntities() {
    let es = this.m_lb.getREntities();
    let ls = this.m_lbs;

    if (ls.length > 0) {
      for (let i = 0; i < ls.length; ++i) {
        es = es.concat(ls[i].getREntities());
      }

      return es;
    }

    return es;
  }

  getRContainer() {
    return null;
  }

  update() {
    this.m_bounds.reset();
    let sv = this.m_scaleV;
    let b = this.m_lb;
    b.setRotation(this.m_rotation);
    b.setScaleXY(sv.x, sv.y);
    b.setPosition(this.m_pos);
    b.update();
    this.m_bounds.union(b.getGlobalBounds());
    let ls = this.m_lbs;

    if (ls.length > 0) {
      for (let i = 0; i < ls.length; ++i) {
        ls[i].copyTransformFrom(this.m_lb);
        ls[i].update();
        this.m_bounds.union(ls[i].getGlobalBounds());
      }
    }

    this.m_bounds.updateFast();
  }

  destroy() {
    let b = this.m_lb;

    if (b != null) {
      b.destroy();
      b = null;
    }

    let ls = this.m_lbs;

    if (ls.length > 0) {
      for (let i = 0; i < ls.length; ++i) {
        ls[i].destroy();
      }

      this.m_lbs = [];
    }

    if (this.m_dp != null) {
      this.m_dp.destroy();
      this.m_dp = null;
    }

    super.destroy();
  }

}

exports.Button = Button;

/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("a176");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ })

/******/ });
});