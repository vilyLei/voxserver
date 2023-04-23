var arguments = process.argv;
var params = [];
arguments.forEach((val, index) => {
	console.log(`${index}: ${val}`);
	params.push(val + "");
});

const fs = require('fs');
const crypto = require('crypto');
const path = require("path");


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

function getMD5(filePath,srcType, callback) {
	// console.log("filePath: ", filePath);
	fs.readFile(filePath, (err, data) => {
		if (err) throw err;

		//   data = "NTCTT4Q887=K2z4E^E7u$YKYutE_zwgptHppYGGFwF_FqbH6b3FUNTCTT7Q=88=$274K^^7p$YKtuYE_ztgYtbpYYYGGw__9qbHbb6FFD9";
		const hash = crypto.createHash('md5');
		hash.update(data);
		const md5 = hash.digest('hex');
		if(callback) {
			callback(srcType, md5);
		}
		// console.log(`The MD5 of ${filePath} is:\n ${md5}`);
	});
}

let srcMD5 = "";
let dstMD5 = "";
let srcCurrFilePath = "";
let dstCurrFilePath = "";

let file_srcDir = '../../../webdev/voxweb3d/dist/';
let file_dstDir = '../bin/static/voxweb3d/demos/';
let verInfoFile = file_dstDir + "info.json";
let filePath = file_dstDir;
function updateFileVer(path) {
	fs.readFile(verInfoFile, (err, data) => {
		if (err) throw err;

		let verInfo = JSON.parse(data);
		console.log("verInfo: ", verInfo);
		//   data = "NTCTT4Q887=K2z4E^E7u$YKYutE_zwgptHppYGGFwF_FqbH6b3FUNTCTT7Q=88=$274K^^7p$YKtuYE_ztgYtbpYYYGGw__9qbHbb6FFD9";
		// const hash = crypto.createHash('md5');
		// hash.update(data);
		// const md5 = hash.digest('hex');
		// if(callback) {
		// 	callback(srcType, md5);
		// }
		// console.log(`The MD5 of ${filePath} is:\n ${md5}`);
	});
}
function updateSpecFile() {
	if(dstMD5 != "" && srcMD5 != "" && dstMD5 != srcMD5) {
		console.log("需要更新文件以及对应的版本号");
		updateFileVer( dstCurrFilePath );
	}
}

if (params.length > 2) {

	let fileName = params[2];
	filePath += fileName;
	if (filePath.lastIndexOf(".js") < 0) {
		filePath += ".js";
	}

	walkSync(file_srcDir, file_dstDir, function (srcfilePath, dstDir, stat) {
		// let flag = filePath.indexOf("umd.min.js") > 0 ? 1 : 0;
		// flag += filePath.indexOf("\\dracoLib\\") > 0 ? 1 : 0;
		console.log("walkSync, srcfilePath: ", srcfilePath);
		if (srcfilePath.indexOf(".umd.min.js") > 0) {
			srcCurrFilePath = srcfilePath;
			dstCurrFilePath = filePath;
			getMD5(srcfilePath,"src", function (srcType, md5) {
				console.log("$$$ src md5: ",md5);
				srcMD5 = md5;
				updateSpecFile();
			})
			getMD5(filePath,"dst", function (srcType, md5) {
				console.log("$$$ dst md5: ",md5);
				dstMD5 = md5;
				updateSpecFile();
			})
		}
		// if (filePath.indexOf("umd.min.js") > 0) {
		// 	copyLibToServer(filePath, dstDir, true);
		// } else if (filePath.indexOf("\\dracoLib\\") > 0) {
		// 	copyLibToServer(filePath, dstDir, false);
		// }
	});
	// console.log("filePath: ", filePath);
	// fs.readFile(filePath, (err, data) => {
	// 	if (err) throw err;

	// 	//   data = "NTCTT4Q887=K2z4E^E7u$YKYutE_zwgptHppYGGFwF_FqbH6b3FUNTCTT7Q=88=$274K^^7p$YKtuYE_ztgYtbpYYYGGw__9qbHbb6FFD9";
	// 	const hash = crypto.createHash('md5');
	// 	hash.update(data);
	// 	const md5 = hash.digest('hex');

	// 	console.log(`The MD5 of ${filePath} is:\n ${md5}`);
	// });
} else {
	console.log("没有输入文件名 !!!");
}
