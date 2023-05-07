// 用法: node cospaceUpdate.js
// 用法: node cospaceUpdate.js voxwebui

const fs = require('fs');
const crypto = require('crypto');
const path = require("path");
var arguments = process.argv;
var params = [];
arguments.forEach((val, index) => {
	console.log(`${index}: ${val}`);
	params.push(val + "");
});

function fsExistsSync(path) {
	try {
		fs.accessSync(path, fs.F_OK);
	} catch (e) {
		return false;
	}
	return true;
}

function mkdirsSync(dirname) {
	if (fs.existsSync(dirname)) {
		return true;
	} else {
		if (mkdirsSync(path.dirname(dirname))) {
			fs.mkdirSync(dirname);
			return true;
		}
	}
}

function writeTxtFile(fUrl, txt) {
	const opt = {
		flag: 'w'//, // a：追加写入；w：覆盖写入
	}
	fs.writeFile(fUrl, txt, opt, (err) => {
		if (err) {
			console.error(err)
		}
	});
}
let srcLibPathDir = 'voxweb3d';
if (params.length > 2) {
	srcLibPathDir = params[2];
}

let srcLibPath = `../../${srcLibPathDir}/public/static/cospace/`;
console.log("srcLibPath: ", srcLibPath);

let verInfoFilePath = "../bin/static/cospace/info.json";
let versionInfo = {};
let versionInfoMap = new Map();
let needOperateFilesTotal = 0;
let operatedFilesTotal = 0;
let currOperateFilesTotal = 0;
let currOperateFiles = [];
function updateFileStatus() {
	needOperateFilesTotal++;
}
function updateOperatingStatus() {
	operatedFilesTotal++;
	if (operatedFilesTotal == needOperateFilesTotal) {
		console.log("\n### 所有文件信息处理完毕 ###");
		if (currOperateFilesTotal > 0) {
			// 更新版本信息文件
			let infoTxt = JSON.stringify(versionInfo);
			writeTxtFile(verInfoFilePath, infoTxt);
			console.log("\n### 版本描述信息 ","info.json"," 已经更新完毕 ###");
		} else {
			console.log("\n### 版本描述信息 ","info.json"," 不需要更新 ###");
		}
		console.log("\n### 本次更新操作总共更新了 ", currOperateFilesTotal, " 个文件 ###");
		if (currOperateFilesTotal > 0) {
			console.log("\n### 已经更新的文件信息如下: \n", currOperateFiles);
		}
	}
}

function walkSync(currentDirPath, dstDir, callback) {
	var fs = require('fs'),
		path = require('path');
	fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function (dirent) {
		var filePath = path.join(currentDirPath, dirent.name);
		if (dirent.isFile()) {
			callback(filePath, dstDir, dirent);
		} else if (dirent.isDirectory()) {
			walkSync(filePath, dstDir, callback);
		}
	});
}

function copyLibToServer(filePath, dstDir, rename) {
	let path = filePath + "";
	// console.log("$$$$$ find path: ", path);
	let keyStr = "\\static\\";
	let i = keyStr.length;
	i = filePath.indexOf(keyStr) + keyStr.length;
	let url = dstDir + path.slice(i);
	// console.log("$$$$$ find dst url: ", url);
	i = url.lastIndexOf("\\");
	let dir = url.slice(0, i + 1);
	let fileName = url.slice(i + 1);
	// console.log("find dstDir: ", dstDir);
	// console.log("find dst dir: ", dir, ", fileName: ", fileName);
	const isExisted = fsExistsSync(dir);
	// console.log("isExisted: ", isExisted);
	if (!isExisted) {
		mkdirsSync(dir);
	}
	if (rename) {
		fileName = fileName.slice(0, fileName.indexOf(".")) + ".js";
		fileName = fileName.toLowerCase();
	}
	url = dir + fileName;
	// console.log("copy finish src url: ", filePath);
	// console.log("copy finish dst url: ", url);
	// if (!fsExistsSync(url)) throw Error(url+"文件不存在");
	let isDracoLib = url.indexOf("dracoLib") > 0;

	let verItem = null;
	let keyName = fileName;
	if (isDracoLib) {
		if (versionInfoMap.has(fileName)) {
			verItem = versionInfoMap.get(fileName);
			// console.log("dracoLib has the ", fileName, " file.");
		}
	} else {
		let k = fileName.indexOf(".");
		let rawName = k > 0 ? fileName.slice(0, k) : fileName;
		// console.log("MMM rawName: ", rawName);
		if (versionInfoMap.has(rawName)) {
			verItem = versionInfoMap.get(rawName);
			// console.log("libs has the ", fileName, " file.");
		}
		keyName = rawName;
	}
	updateAExistedFile(filePath, url, verItem, keyName);
}

function getMD5(currPath, psrcType, pdstUrl, keyName, srcType, callback) {

	fs.readFile(currPath, (err, data) => {
		if (err) throw err;
		const hash = crypto.createHash('md5');
		hash.update(data);
		const md5 = hash.digest('hex');
		if (callback) {
			// console.log("getMD5(), currPath: ", currPath);
			callback(psrcType, pdstUrl, keyName, srcType, md5);
		}
		// console.log(`The MD5 of ${filePath} is:\n ${md5}`);
	});
}

function updateFileAndFileVer(srcUrl, dstUrl, keyName) {
	// let isDracoLib = srcUrl.indexOf("dracoLib") > 0;
	let verItem = versionInfoMap.get(keyName);
	if (verItem) {
		let ver = parseFloat(verItem.ver);
		ver += 0.01;
		verItem.ver = ver + "";
		console.log("		new ver: ", ver, ", keyName: ", keyName);
		fs.copyFileSync(srcUrl, dstUrl);
		currOperateFilesTotal++;
		currOperateFiles.push({ url: srcUrl, keyName: keyName });
	}
	updateOperatingStatus();
}
function updateSpecFile(srcUrl, dstUrl, keyName, md5A, md5B) {
	if (md5A != "" && md5B != "") {
		if (md5A != md5B) {
			// console.log("需要更新文件以及对应的版本号 ...keyName: ", keyName);
			updateFileAndFileVer(srcUrl, dstUrl, keyName);
		} else {
			// console.log("当前文件及其版本号都不需要更新 ...keyName: ", keyName);
			updateOperatingStatus();
		}
	}
}
function updateAExistedFile(srcUrl, dstUrl, verItem, keyName) {
	updateFileStatus();
	if (verItem) {

		// console.log(">>>> srcUrl: ", srcUrl);
		getMD5(srcUrl, srcUrl, dstUrl, keyName, "src", (psrcUrl, pdstUrl, pkeyName, psrcType, md5) => {
			// console.log(">>>> srcUrl: ", srcUrl);
			// console.log("$$$ src md5: ", md5);
			let md5A = md5;
			if (fsExistsSync(pdstUrl)) {
				getMD5(pdstUrl, psrcUrl, dstUrl, keyName, "src", (psrcUrl, pdstUrl, pkeyName, psrcType, md5) => {
					// console.log(">>>> dstUrl: ", dstUrl);
					// console.log("$$$ dst md5: ", md5);
					updateSpecFile(psrcUrl, pdstUrl, pkeyName, md5A, md5);
				});
			} else {
				console.log("***这是一个新文件, psrcUrl: ", psrcUrl, ", pkeyName: ", pkeyName);
				updateSpecFile(psrcUrl, pdstUrl, pkeyName, md5A, md5A + "New");
			}
		});
	} else {
		updateOperatingStatus();
		console.log("***找不到此文件的版本信息, url: ", srcUrl, ", keyName: ", keyName);
	}
}



function updateLibs() {
	walkSync(srcLibPath, "../bin/static/", function (filePath, dstDir, stat) {
		if (filePath.indexOf("umd.min.js") > 0) {
			copyLibToServer(filePath, dstDir, true);
		} else if (filePath.indexOf("\\dracoLib\\") > 0) {
			copyLibToServer(filePath, dstDir, false);
		}
	});

}

function readVerInfo() {
	console.log("\n### 开始处理文件信息 ###");
	fs.readFile(verInfoFilePath, (err, data) => {
		if (err) throw err;

		versionInfo = JSON.parse(data);
		// console.log("versionInfo: \n", versionInfo);
		let items = versionInfo.items;
		// console.log("A items.length: ", items.length);
		for (let i = 0; i < items.length; ++i) {
			const ia = items[i];
			versionInfoMap.set(ia.name, ia);
			if (ia.type) {
				if (ia.type == "dir") {
					let ls = ia.items;
					// console.log("B ls.length: ", ls.length);
					for (let i = 0; i < ls.length; ++i) {
						const ib = ls[i];
						versionInfoMap.set(ib.name, ib);
					}
				}
			}
		}
		// versionInfoMap
		// console.log("AAAAAAAAAAAAAAAAAAAAAA begin.");
		updateLibs();
		// console.log("BBBBBBBBBBBBBBBBBBBBBB end.");
	});
}
readVerInfo();
