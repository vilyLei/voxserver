(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VoxWeb"] = factory();
	else
		root["VoxWeb"] = factory();
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

/***/ "1f99":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
}); // import {SimpleAward as Demo} from "./app/SimpleAward";
// import {DemoLoader as Demo} from "./app/DemoLoader";

const Home_1 = __webpack_require__("9c2c"); // import {ToolPage as Demo} from "./app/ToolPage";
// ancientApple
// import {AppLoader as Demo} from "./app/AppLoader";
// document.title = "Rendering & Art";


let loader = new Home_1.Home();
loader.initialize();

/***/ }),

/***/ "7aa4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class URLFilter {
  static getDomain(url) {
    var urlReg = /http:\/\/([^\/]+)/i;
    let domain = url.match(urlReg);
    return domain != null && domain.length > 0 ? domain[0] : "";
  }

  static getHostUrl(port) {
    let host = location.href;
    let domain = URLFilter.getDomain(host);
    let nsList = host.split(":");
    host = nsList[0] + ":" + nsList[1];
    return port ? host + ":" + port + "/" : domain + "/";
  }

  static isEnabled() {
    let hostUrl = window.location.href;
    return hostUrl.indexOf(".artvily.com") > 0;
  }

  static filterUrl(url) {
    if (url.indexOf("blob:") < 0) {
      let hostUrl = window.location.href;

      if (hostUrl.indexOf(".artvily.") > 0) {
        hostUrl = "http://www.artvily.com:9090/";
        url = hostUrl + url;
      }
    }

    return url;
  }

  static getFileName(url, lowerCase = false) {
    if (url.indexOf("blob:") < 0) {
      let i = url.lastIndexOf("/");

      if (i < 0) {
        return "";
      }

      let j = url.indexOf(".", i);

      if (j < 0) {
        return "";
      }

      if (i + 2 < j) {
        let str = url.slice(i + 1, j);

        if (lowerCase) {
          return str.toLocaleLowerCase();
        }

        return str;
      }
    }

    return "";
  }

  static getFileNameAndSuffixName(url, lowerCase = false) {
    if (url.indexOf("blob:") < 0) {
      let i = url.lastIndexOf("/");
      let j = url.indexOf(".", i);

      if (j < 0) {
        return "";
      }

      let str = url.slice(i + 1);

      if (lowerCase) {
        return str.toLocaleLowerCase();
      }

      return str;
    }

    return "";
  }

  static getFileSuffixName(url, lowerCase = false) {
    if (url.indexOf("blob:") < 0) {
      let i = url.lastIndexOf("/");
      let j = url.indexOf(".", i);

      if (j < 0) {
        return "";
      }

      let str = url.slice(j + 1);

      if (lowerCase) {
        return str.toLocaleLowerCase();
      }

      return str;
    }

    return "";
  }

}

exports.default = URLFilter;

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

/***/ "9c2c":
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

const URLFilter_1 = __importDefault(__webpack_require__("7aa4"));

class Home {
  constructor() {
    this.m_htmlText = "";
    this.m_host = "";
    this.m_domin = "";
    this.m_demoBodyDiv = null;
    this.m_infoDiv = null;
  }

  initialize() {
    console.log("Home::initialize()......"); // let url = location.href + "";
    // if(url.indexOf("artvily.") > 0) {
    //     this.m_host = "http://www.artvily.com:9090/";
    // }

    this.m_domin = URLFilter_1.default.getDomain(location.href);
    this.m_host = URLFilter_1.default.getHostUrl("9090"); // for test
    // this.m_host = URLFilter.getHostUrl();
    // url = this.parseUrl(url);
    // console.log("url: ", url);

    this.m_demoBodyDiv = document.getElementById("demos");

    if (this.m_demoBodyDiv == null) {
      this.initUI();
    }

    this.loadData(this.m_host + "static/voxweb3d/demos/demos.json?ver=" + Math.random() + Date.now());
    this.initHeadApp();
  }

  initHeadApp() {
    let appUrl = this.m_host + "static/voxweb3d/demos/camRoaming.js";
    let codeLoader = new XMLHttpRequest();
    codeLoader.open("GET", appUrl, true);

    codeLoader.onerror = function (err) {
      console.error("load error: ", err);
    };

    codeLoader.onload = evt => {
      console.log("module js file loaded.");
      let scriptEle = document.createElement("script");

      scriptEle.onerror = evt => {
        console.error("module script onerror, e: ", evt);
      };

      scriptEle.type = "text/javascript";
      scriptEle.innerHTML = codeLoader.response;
      document.head.appendChild(scriptEle);
    };

    codeLoader.send(null);
  }

  parseData(data) {
    console.log("data: ", data);
    let htmlText = "";
    htmlText += "<center/>";
    htmlText += '<hr style="height:3px;border:1px solid #444444;"/>';
    htmlText += "<br/>";
    htmlText += "ENGINE DEMOS";
    this.m_htmlText = htmlText;
    let po;
    let list = data.demos;

    for (let i = 0; i < list.length; ++i) {
      po = list[i];
      this.addLinkHtmlLine(po.name, po.info, po.url);
    }

    this.m_demoBodyDiv.innerHTML = this.m_htmlText;
    let divBody = document.getElementById("divBody");

    if (divBody != null) {
      let body = document.body,
          html = document.documentElement;
      let height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
      divBody.style.height = height + 50 + "px";
    }
  }

  addLinkHtmlLine(demoName, info, url) {
    this.m_htmlText += "<br/>";

    if (url !== undefined && url != "") {} else {
      url = this.m_domin + `/renderCase?sample=demoLoader&demo=${demoName}`;
    }

    console.log("addLinkHtmlLine(), url: ", url);
    this.m_htmlText += `<a id="link_demo" href="${url}" target="_blank">${info}</a>`;
  }

  loadData(purl) {
    let codeLoader = new XMLHttpRequest();
    codeLoader.open("GET", purl, true);

    codeLoader.onerror = function (err) {
      console.error("load error: ", err);
    };

    codeLoader.onprogress = e => {};

    codeLoader.onload = () => {
      let info = codeLoader.response;
      let data = JSON.parse(info);
      this.parseData(data);
    };

    codeLoader.send(null);
  } // private load(purl: string): void {
  //     let codeLoader: XMLHttpRequest = new XMLHttpRequest();
  //     codeLoader.open("GET", purl, true);
  //     //xhr.responseType = "arraybuffer";
  //     codeLoader.onerror = function (err) {
  //         console.error("load error: ", err);
  //     }
  //     codeLoader.onprogress = (e) => {
  //         this.showLoadInfo(e);
  //     };
  //     codeLoader.onload = () => {
  //         let scriptEle: HTMLScriptElement = document.createElement("script");
  //         scriptEle.onerror = (e) => {
  //             console.error("module script onerror, e: ", e);
  //         }
  //         scriptEle.innerHTML = codeLoader.response;
  //         document.head.appendChild(scriptEle);
  //         this.loadFinish();
  //     }
  //     codeLoader.send(null);
  // }


  showLoadInfo(e) {
    this.showLoadProgressInfo(e);
  }

  parseUrl(url) {
    console.log("url: ", url); //http://192.168.0.102:9000/renderCase?sample=demoLoader&demo=cameraFollow2

    let params = url.split("?");

    if (params.length < 2 || params[0].indexOf("renderCase") < 1) {
      return "";
    }

    let moduleName = params[1];
    params = moduleName.split("&");

    if (params.length < 2 || params[0].indexOf("sample") < 0) {
      return "";
    }

    moduleName = params[1];
    params = moduleName.split("=");

    if (params.length < 2 || params[0] != "demo") {
      return "";
    }

    return "static/voxweb3d/demos/" + params[1] + ".js";
  }

  initUI() {
    document.body.style.background = "#ffffff";
    this.m_demoBodyDiv = document.createElement('div');
    this.m_demoBodyDiv.style.width = "100vw";
    this.m_demoBodyDiv.style.height = "100vh"; //this.elementCenter(this.m_demoBodyDiv);

    document.body.appendChild(this.m_demoBodyDiv);
    document.body.style.margin = '0';
    this.showInfo("init...");
  }

  showInfo(str) {
    if (this.m_infoDiv == null) {
      this.m_infoDiv = document.createElement('div');
      this.m_infoDiv.style.backgroundColor = "rgba(255,255,255,0.1)";
      this.m_infoDiv.style.color = "#00ee00";
      this.elementCenter(this.m_infoDiv);
      this.m_demoBodyDiv.appendChild(this.m_infoDiv);
    }

    this.m_infoDiv.innerHTML = str;
  }

  showLoadProgressInfo(e) {
    let str = "loading " + Math.round(100.0 * e.loaded / e.total) + "% ";
    this.showInfo(str);
  }

  showLoadStart() {
    this.showInfo("loading 0%");
  }

  showLoaded() {
    this.showInfo("100%");
  }

  loadFinish() {
    if (this.m_demoBodyDiv != null) {
      this.m_demoBodyDiv.parentElement.removeChild(this.m_demoBodyDiv);
      this.m_demoBodyDiv = null;
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

}

exports.Home = Home;
exports.default = Home;

/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("1f99");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ })

/******/ });
});