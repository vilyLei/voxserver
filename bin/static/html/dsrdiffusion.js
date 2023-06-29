console.log("dsr-diffusion sys init ...");

let rimgSizes = [128, 128]
let rtBGTransparent = false;
let hostUrl = "http://localhost:9090/"
hostUrl = "/"
let taskReqSvrUrl = hostUrl + "renderingTask";
let taskInfoGettingUrl = hostUrl + "getRTInfo";

let curr3DViewerInfoDiv = null;

let ptupdateTimes = 2100
let timeoutId = -1;
let startTime = Date.now()

let taskJsonObj = { version: -1 }
let taskStatus = 0
let rt_phase = ""
let rt_phase_times = 0

function reset() {
	setTaskJsonData({ version: -1 });

	taskStatus = 0
	rt_phase = ""
	rt_phase_times = 0
}
function setTaskJsonData(data) {
	taskJsonObj = data;
	var div = document.getElementById("task_name_div");
	if (taskJsonObj.taskname !== undefined) {
		div.innerHTML = "渲染任务:&nbsp;" + taskJsonObj.taskname;
	} else {
		div.innerHTML = "..."
	}
}
function updatePage() {
	location.reload();
}

function getDomain(url) {
	var urlReg = /http:\/\/([^\/]+)/i;
	let domain = url.match(urlReg);
	return ((domain != null && domain.length > 0) ? domain[0] : "");
}
function getHostUrl(port) {
	let host = location.href;
	let domain = getDomain(host);
	let nsList = domain.split(":");
	host = nsList[0] + ":" + nsList[1];
	return port ? host + ":" + port + "/" : domain + "/";
}
function rerendering() {
	console.log("重新渲染当前模型");
	// let params = "&sizes=" + rimgSizes
	// params += getCameraDataParam();
	// params += "&rtBGTransparent=" + (rtBGTransparent?"1":"0");
	let params = getRenderingParams();
	notifyTaskInfoToSvr("query-re-rendering-task", 0, taskJsonObj.taskid, taskJsonObj.taskname, params);

}
function clearDivAllEles(div) {
	div.replaceChildren();
}
function clearSTInfoDivEles() {
	var div = document.getElementById("imgDiv");
	clearDivAllEles(div)
}
function taskSuccess(filepath, transparent) {
	if (filepath === undefined || filepath == "") {
		filepath = "./static/rtUploadFiles/modelRTask2001/boomBox.glb"
	}
	let suffix = transparent ? "png" : "jpg"
	let i = filepath.lastIndexOf("/")
	let imgDirUrl = hostUrl + filepath.slice(2, i + 1);
	imgUrl = imgDirUrl + "bld_rendering_mini." + suffix + "?ver=" + Math.random() + "-" + Math.random(Date.now())
	console.log("imgUrl: ", imgUrl);

	var div = document.getElementById("imgDiv");
	clearDivAllEles(div)
	// let img = new Image()
	// img.src = imgUrl
	// div.appendChild(img);
	// var br = document.createElement("br");
	// div.appendChild(br);

	let big_imgUrl = imgDirUrl + "bld_rendering." + suffix + "?ver=" + Math.random() + "-" + Math.random(Date.now())
	var link = document.createElement("a");
	link.setAttribute("href", big_imgUrl);
	link.setAttribute("target", "_blank");
	link.onmouseover = () => {
		display();
	};
	link.onmouseout = () => {
		disappear();
	}
	// link.innerHTML = "下载/查看渲染效果图";
	// <img class="s-problem" src="img/problem.png"/>
	link.innerHTML = `<img src="` + imgUrl + `"/>`;
	div.appendChild(link);

	var br = document.createElement("br");
	div.appendChild(br);
	const span = document.createElement('span');
	// span.innerHTML = '/\\';
	span.innerHTML = '点击上图查看大图';
	div.appendChild(span);
	br = document.createElement("br");
	div.appendChild(br);
	br = document.createElement("br");
	div.appendChild(br);

	link = document.createElement("a");
	link.innerHTML = "重新渲染当前模型";
	link.href = "#";
	link.addEventListener("click", rerendering);
	div.appendChild(link);

	br = document.createElement("br");
	div.appendChild(br);
	br = document.createElement("br");
	div.appendChild(br);

	link = document.createElement("a");
	link.innerHTML = "渲染其他模型";
	link.href = "#";
	link.addEventListener("click", updatePage);
	div.appendChild(link);
}
function taskFailure() {
	var div = document.getElementById("imgDiv");
	clearDivAllEles(div)
	var br = document.createElement("br");
	div.appendChild(br);
	let link = document.createElement("a");
	link.innerHTML = "渲染其他模型";
	link.href = "#";
	link.addEventListener("click", updatePage);
	div.appendChild(link);
}
function taskTimeout() {
	var div = document.getElementById("infoDiv");
	div.innerHTML = "渲染任务超时,请重新提交渲染"
	div = document.getElementById("imgDiv");
	var br = document.createElement("br");
	div.appendChild(br);
	let link = document.createElement("a");
	link.innerHTML = "渲染其他模型";
	link.href = "#";
	link.addEventListener("click", updatePage);
	div.appendChild(link);
}

function sendCurrentGetReq(purl) {
	let req = new XMLHttpRequest();
	req.open("GET", purl, true);
	req.onerror = function (err) {
		console.error("load error: ", err);
	};
	req.onprogress = e => { };
	req.onload = evt => {
		console.log("sendCurrentGetReq(), req.response: ", req.response);
	};
	req.send(null);
}
function showSpecInfo(keyStr, times, infoDiv = null) {

	var div = infoDiv ? infoDiv : document.getElementById("infoDiv");
	// var div = curr3DViewerInfoDiv;
	let flag = times % 3
	switch (flag) {
		case 0:
			div.innerHTML = keyStr + "&nbsp;.&nbsp;&nbsp;"
			break;
		case 1:
			div.innerHTML = keyStr + "&nbsp;..&nbsp;"
			break;
		default:
			div.innerHTML = keyStr + "&nbsp;..."
			break;
	}
}

function sizeHandleChange(btn) {
	let vs = btn.value.split("x");
	rimgSizes[0] = parseInt(vs[0]);
	rimgSizes[1] = parseInt(vs[1]);
	// console.log("btn.value: ", btn.value, ", rimgSizes: ", rimgSizes)
	// document.cookie = "rtTaskInfo=" + rimgSizes[0] + "x" + rimgSizes[1] + ";"
	let cname = "rtTaskInfo";
	let kvalue = rimgSizes[0] + "x" + rimgSizes[1];
	setCookieByName(cname, kvalue)
}

function setBGTransRBtnSt(kvalue, force = false) {

	// kvalue = rtBGTransparent ? "true" : "false";
	let cname = "rtBGTransparent";
	if (!force) {
		let cvalue = getCookieByName(cname)
		if (cvalue != "") {
			kvalue = cvalue
		}
	}

	rtBGTransparent = kvalue == "true";
	btn = document.getElementById("bg_transparent_select_radio_btn")
	btn.checked = rtBGTransparent
	btn.value = kvalue
	document.getElementById("b-t-s-r").innerHTML = rtBGTransparent ? "是" : "否";

	setCookieByName(cname, kvalue)
}
function rtBGTransparentHandleChange(btn) {

	if (btn.value === "true") {
		btn.value = "false"
	} else {
		btn.value = "true"
	}
	setBGTransRBtnSt(btn.value, true);

}
function getCookieByName(cname) {
	let ckInfo = document.cookie + ""
	let index0 = ckInfo.indexOf(cname + "=");
	if (index0 >= 0) {
		let index1 = ckInfo.indexOf(";", index0 + 1)
		if (index1 < 0) {
			index1 = ckInfo.length
		}
		kvalue = ckInfo.slice(index0, index1);
		kvalue = kvalue.split("=")[1]
		return kvalue;
	}
	return ""
}
function setCookieByName(cname, value) {
	document.cookie = cname + "=" + value + ";"
}
function setSizeBtnStatWithValue(kvalue, force = false) {

	let cname = "rtTaskInfo";
	if (!force) {
		let cvalue = getCookieByName(cname)
		if (cvalue != "") {
			kvalue = cvalue
		}
	}
	var checks = document.getElementsByName("size_select_radio");
	for (let i = 0; i < checks.length; ++i) {
		// console.log("checks[i].value: ", checks[i].value);
		if (checks[i].value == kvalue) {
			checks[i].checked = true;
			sizeHandleChange(checks[i])
		}
	}
	// setCookieByName(cname, kvalue)
}
function initConfig() {

	let kvalue = rimgSizes[0] + "x" + rimgSizes[1];
	setSizeBtnStatWithValue(kvalue)
	// let cname = "rtTaskInfo";
	// let cvalue = getCookieByName(cname)
	// if (cvalue != "") {
	// 	kvalue = cvalue
	// } else {
	// 	setCookieByName(cname, kvalue)
	// }
	// var checks = document.getElementsByName("size_select_radio");
	// for (let i = 0; i < checks.length; ++i) {
	// 	// console.log("checks[i].value: ", checks[i].value);
	// 	if (checks[i].value == kvalue) {
	// 		checks[i].checked = true;
	// 		sizeHandleChange(checks[i])
	// 	}
	// }

	kvalue = rtBGTransparent ? "true" : "false";
	// let cname = "rtBGTransparent";
	// let cvalue = getCookieByName(cname)
	// if (cvalue != "") {
	// 	kvalue = cvalue
	// } else {
	// 	setCookieByName(cname, kvalue)
	// }
	setBGTransRBtnSt(kvalue);
}
let drcModelLoading = true
function loadDrcModels(total) {
	// console.log("### ###### loadDrcModels, total: ", total);
	if (drcModelLoading) {
		if (total > 0) {
			console.log("### ######01 loadDrcModels(), ready load drc models, total: ", total);
			drcModelLoading = false;
			let params = ""
			let url = createReqUrlStr(taskInfoGettingUrl, "modelToDrc", 0, taskJsonObj.taskid, taskJsonObj.taskname, params);
			console.log("### ######02 loadDrcModels(), url: ", url);
			sendACommonGetReq(url, (purl, content) => {
				console.log("### ###### loadDrcModels() loaded, content: ", content);
				var infoObj = JSON.parse(content);
				console.log("loadDrcModels() loaded, infoObj: ", infoObj);
				let resBaseUrl = getHostUrl(9090) + infoObj.filepath.slice(2);
				let drcsTotal = infoObj.drcsTotal;
				let drcUrls = [];
				let types = [];
				for (let i = 0; i < drcsTotal; i++) {
					let drcUrl = resBaseUrl + "export_" + i + ".drc";
					drcUrls.push(drcUrl)
					types.push("drc");
				}
				// console.log("drcUrls: ", drcUrls);

				rscViewer.initSceneByUrls(drcUrls, types, (prog) => {
					console.log("3d viewer drc model loading prog: ", prog);
					if (prog >= 1.0) {
						viewerInfoDiv.innerHTML = "";
						loadedModel = true;
					}
				}, 200);
			})
		} else {
			// console.log("$$$ loading model resource, ", rt_phase_times);
			showSpecInfo("loading model resource", rt_phase_times, viewerInfoDiv);
			rt_phase_times++
		}
	}
}
function sendACommonGetReq(purl, onload) {

	let req = new XMLHttpRequest();
	req.open("GET", purl, true);
	req.onerror = function (err) {
		console.error("sendACommonGetReq(), load error: ", err);
	};
	// req.onprogress = e => { };
	req.onload = evt => {
		onload(purl, req.response)
	}
	req.send(null);
}
// let progressScale = 100.0 + Math.round(Math.random()) * 10 - 5;
function parseRenderingTaskInfo(sdo) {
	// var sdo = JSON.parse(req_response);
	console.log("parseRenderingTaskInfo(), sdo: ", sdo);
	let status = sdo.status

	var div = document.getElementById("infoDiv");
	let phase = sdo.phase;
	if (rt_phase != phase) {
		rt_phase = phase
		rt_phase_times = 0
	}
	let keyStr = "";
	let flag = false;
	switch (phase) {
		case "running":
			if (sdo.progress < 6) {
				showSpecInfo("正在解析模型数据", rt_phase_times);
			} else {
				// let pro = Math.round(100.0 * sdo.progress / progressScale);
				// if(pro < 1) {
				// 	pro = 1
				// } else if(pro > 99) {
				// 	pro = 99
				// }

				div.innerHTML = `正在进行渲染: <b><font color="#008800">` + sdo.progress + `%</font></b>`
			}
			flag = true;
			break;
		case "new":
			keyStr = `排队<b><font color="#880000">(` + sdo.teamIndex + "/" + sdo.teamLength + `)</font></b>等待可用的空闲渲染器`
			showSpecInfo(keyStr, rt_phase_times);
			break;
		case "task_rendering_enter":
			if (rt_phase_times > 2) {
				showSpecInfo("配置渲染任务", rt_phase_times);
			} else {
				showSpecInfo("启动渲染任务", rt_phase_times);
			}
			break;
		case "task_rendering_load_res":
			// showSpecInfo("同步模型资源", rt_phase_times)
			div.innerHTML = `同步模型资源: <b><font color="#008800">` + sdo.progress + `%</font></b>`
			break;
		case "task_rendering_begin":
			showSpecInfo("准备渲染数据", rt_phase_times)
			break;
		case "finish":
			if (taskStatus < 1) {
				taskJsonObj.version = sdo.version;
				taskStatus = 1
				let sizes = sdo.sizes;
				let time_ms = (Date.now() - startTime)
				let time_s = Math.round(time_ms / 1000.0)
				console.log("task finish, loss time: ", time_s + "s(" + time_ms + "ms), sdo.version: ", sdo.version);
				div.innerHTML = `<b><font color="#008800">` + sizes[0] + "x" + sizes[1] + `</font></b>效果图渲染完成<br/><b>(总耗时` + time_s + `s)</b>`
				taskSuccess(taskJsonObj.filepath, sdo.bgTransparent == 1)
			}
			break;
		case "rtaskerror":
			if (taskStatus < 2) {
				taskStatus = 2
				div.innerHTML = "渲染失败(模型数据不能正确解析)"
				taskFailure()
			}

		case "query-re-rendering-task":
			console.log("query-re-rendering-task, status: ", status);
			if (status == 22) {
				// ptupdateTimes = 2100
				// taskStatus = 0;
				// startTime = Date.now();
				// clearSTInfoDivEles();
				// reqstUpdate();
				restartReqstUpdate();
			}
			break;
		default:
			break;
	}
	loadDrcModels(sdo.drcsTotal);
	rt_phase_times++
}
function sendAGetReq(purl) {
	if (taskStatus == 3) {
		return;
	}
	let req = new XMLHttpRequest();
	req.open("GET", purl, true);
	req.onerror = function (err) {
		console.error("load error: ", err);
		taskStatus = 3;
		console.error("服务器无法正常访问 !!!");
		// alert("服务器无法正常访问 !!!");
		// updatePage()
		return;
	};
	req.onprogress = e => { };
	req.onload = evt => {
		// parseRenderingTaskInfo(req.response);
		var sdo = JSON.parse(req.response);
		parseRenderingTaskInfo(sdo);
	};
	req.send(null);
}
function createReqUrlStr(svrUrl, phase, progress, taskId, taskName, otherInfo = "") {
	let url = svrUrl + "?srcType=viewer&&phase=" + phase + "&progress=" + progress + otherInfo
	if (taskId > 0) {
		url += "&taskid=" + taskId + "&taskname=" + taskName
	}
	return url;
}
function notifyTaskInfoToSvr(phase, progress, taskId, taskName, otherInfo = "") {
	let url = createReqUrlStr(taskReqSvrUrl, phase, progress, taskId, taskName, otherInfo)
	sendAGetReq(url)
}


function restartReqstUpdate() {
	// progressScale = 100.0 + Math.round(Math.random()) * 18 - 9;
	ptupdateTimes = 2100
	taskStatus = 0;
	startTime = Date.now();
	clearSTInfoDivEles();
	reqstUpdate();
}
function reqstUpdate() {

	if (timeoutId > -1) {
		clearTimeout(timeoutId);
	}
	// console.log("reqstUpdate() ... taskJsonObj: ", taskJsonObj)
	var flag = false;
	if (taskStatus < 1) {
		notifyTaskInfoToSvr("queryataskrst", 0, taskJsonObj.taskid, taskJsonObj.taskname, "")
		ptupdateTimes--;
		if (ptupdateTimes > 0) {
			timeoutId = setTimeout(reqstUpdate, 800);
		} else {
			flag = true;
		}
	} else {
		console.log("task finish !!!!")
		flag = true;
	}
	if (flag) {
		if (drcModelLoading) {
			drcModelUpdate();
		}
	}
}
var drcModelTimeId = -1
function drcModelUpdate() {

	if (drcModelTimeId > -1) {
		clearTimeout(drcModelTimeId);
	}
	if (drcModelLoading) {
		let url = createReqUrlStr(taskReqSvrUrl, "queryataskrst", 0, taskJsonObj.taskid, taskJsonObj.taskname, "");
		sendACommonGetReq(url, (purl, content) => {
			console.log("### ###### drcModelUpdate() loaded, content: ", content);
			var infoObj = JSON.parse(content);
			loadDrcModels(infoObj.drcsTotal);
		})
		drcModelTimeId = setTimeout(reqstUpdate, 800);
	}
}

var syncTaskTimeId = -1
function syncTaskUpdate() {

	if (syncTaskTimeId > -1) {
		clearTimeout(syncTaskTimeId);
	}
	let flag = drcModelLoading || taskStatus < 1;
	if (!flag && taskJsonObj.taskid > 0) {
		console.log("syncTaskUpdate(), taskJsonObj.taskid: ", taskJsonObj.taskid);
		let url = createReqUrlStr(taskInfoGettingUrl, "syncAnAliveTask", 0, taskJsonObj.taskid, taskJsonObj.taskname, "");
		sendACommonGetReq(url, (purl, content) => {
			var infoObj = JSON.parse(content);
			console.log("### ###### syncTaskUpdate() loaded, infoObj: ", infoObj);
			// loadDrcModels(infoObj.drcsTotal);
			updateTaskJsonData(infoObj);
		})
	}
	syncTaskTimeId = setTimeout(syncTaskUpdate, 2500);
}
syncTaskUpdate();

var xhr;
var fileObj = null;
function readyUploadAFile() {
	fileObj = document.getElementById("file_select").files[0];
	console.log("A01 fileObj: ", fileObj);
}
function getRenderingParams(otherParams = "") {
	let params = "&sizes=" + rimgSizes;
	params += getCameraDataParam();
	params += "&rtBGTransparent=" + (rtBGTransparent ? "1" : "0");
	if (otherParams != "") {
		params += otherParams;
	}
	return params;
}
function uploadAndSendRendering() {
	if (fileObj == null) {
		return;
	}
	let camdvs = [0.7071067690849304, -0.40824827551841736, 0.5773502588272095, 2.390000104904175, 0.7071067690849304, 0.40824827551841736, -0.5773502588272095, -2.390000104904175, 0, 0.8164965510368347, 0.5773502588272095, 2.390000104904175, 0, 0, 0, 1];
	let camParam = "&camdvs=[" + camdvs + "]";
	console.log("camParam: ", camParam);
	var url = hostUrl + "uploadRTData?srcType=viewer&phase=newrtask" + getRenderingParams(camParam);
	if (!fileObj) {
		alert("the file dosen't exist !!!");
		updatePage()
		return;
	}
	let fileSize = Math.floor(fileObj.size / (1024 * 1024))
	if (fileSize > 30) {
		alert("模型文件超过30M, 带宽太小暂时不支持 !!!");
		updatePage()
		return;
	}
	var form = new FormData();
	form.append("file", fileObj);

	xhr = new XMLHttpRequest();
	xhr.open("post", url, true);
	xhr.onload = uploadComplete;
	xhr.onerror = uploadFailed;

	xhr.upload.onprogress = progressFunction;
	xhr.upload.onloadstart = function () {
		ot = new Date().getTime();
		oloaded = 0;
	};

	xhr.send(form);
	fileObj = null;
}

function uploadComplete(evt) {

	let str = evt.target.responseText + "";
	console.log("evt.target.responseText: ", str);
	var data = JSON.parse(str);
	console.log("josn obj data: ", data);
	if (data.success) {
		setTaskJsonData(data);
		console.log("上传成功！");
		// alert("上传成功！");
		reqstUpdate();
	} else {
		alert("上传失败！");
	}
}
function uploadFailed(evt) {
	alert("上传失败！");
}
function cancleUploadFile() {
	xhr.abort();
}

function progressFunction(evt) {
	var progressBar = document.getElementById("progressBar");
	var percentageDiv = document.getElementById("percentage");

	if (evt.lengthComputable) {
		progressBar.max = evt.total;
		progressBar.value = evt.loaded;
		percentageDiv.innerHTML = Math.round(evt.loaded / evt.total * 100) + "%";
	}
	var time = document.getElementById("time");
	var nt = new Date().getTime();
	var pertime = (nt - ot) / 1000;
	ot = new Date().getTime();
	var perload = evt.loaded - oloaded;
	oloaded = evt.loaded;

	var speed = perload / pertime;
	var bspeed = speed;
	var units = 'B/s';
	if (speed / 1024 > 1) {
		speed = speed / 1024;
		units = 'K/s';
	}
	if (speed / 1024 > 1) {
		speed = speed / 1024;
		units = 'M/s';
	}
	speed = speed.toFixed(1);
	var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
	time.innerHTML = '上传速度：' + speed + units + '，剩余时间：' + resttime + 's';
	if (bspeed == 0) time.innerHTML = '上传已取消';
}
function display() {
	document.getElementById("box").style.display = "block";
}
function disappear() {
	document.getElementById("box").style.display = "none";
}

function createCanvas(pw, ph) {

	let canvas = document.createElement('canvas');
	canvas.style.display = 'bolck';
	canvas.style.position = 'relative';
	// canvas.style.backgroundColor = 'transparent';
	canvas.style.pointerEvents = 'none';
	canvas.style.left = 0 + "px";
	canvas.style.top = 0 + "px";
	canvas.height = ph;
	canvas.width = pw;
	let ctx2D = canvas.getContext("2d");
	ctx2D.fillStyle = "green";
	ctx2D.fillRect(0, 0, pw, ph);
	// ctx2D.clearRect(0, 0, pw, ph);
	return canvas;
}

function create3DViewerDiv(px, py, pw, ph) {
	const div = document.createElement("div");
	div.style.width = pw + "px";
	div.style.height = ph + "px";
	div.style.display = "bolck";
	div.style.margin = "0 auto";
	// div.style.backgroundColor = "#222222";
	// 添加样式 二
	div.style.position = "absolute";
	div.style.left = "calc(50% - 256px / 2)";

	return div;
}

function create3DViewerInfoDiv(px, py, pw, ph) {
	const div = document.createElement("div");
	div.style.width = pw + "px";
	div.style.height = ph + "px";
	div.style.display = "flex";
	div.style.margin = "0 auto";
	div.style.zIndex = "9";
	div.style.color = "#55aaaa";
	// div.style.backgroundColor = "#333322";
	// 添加样式 三
	div.style.position = "absolute";
	div.style.left = "calc(50% - 256px / 2)";
	// div.style.zIndex = 200;

	// div.style.textAlign = "center";
	div.style.alignItems = "center";
	div.style.justifyContent = "center";
	div.style.pointerEvents = 'none';
	// div.style.left = px + "px";
	// div.style.top = py + "px";
	// div.style.position = "absolute";
	return div;
}

function createBtn(id, top, btnValue, callback) {
	let btn = document.createElement("input");
	btn.type = "button"
	btn.value = btnValue;
	if (id !== "") {
		btn.id = id;
	}
	btn.style.zIndex = "19";
	btn.style.position = "absolute";
	btn.style.top = top + "px";
	btn.style.left = "calc(50% - 70px / 2)";
	btn.style.margin = "0 auto";
	btn.addEventListener("click", callback);
	console.log("create a btn ...")
	return btn;
}

let sendRenderingBtn = null;
let viewerDiv = null;
let viewerInfoDiv = null;

function initModelViewer(div) {

	clearDivAllEles(div);

	console.log("init mnodel view, div.parentNode: ", div.parentNode)
	viewerDiv = create3DViewerDiv(0, 0, 256, 256);
	div.appendChild(viewerDiv);
	console.log("viewerDiv: ", viewerDiv)
	// let viewerCanvas = createCanvas(256, 256);
	// viewerDiv.appendChild( viewerCanvas );
	viewerInfoDiv = create3DViewerInfoDiv(0, 0, 256, 256);
	div.appendChild(viewerInfoDiv);
	viewerInfoDiv.innerHTML = "loading model resource...";
	// curr3DViewerInfoDiv = infoDiv;
	let btn = sendRenderingBtn = createBtn("send_rendering", 490, "发起渲染", () => {
		console.log("发起渲染...");
		uploadAndSendRendering();
		sendRenderingBtn.style.display = 'none';
	});
	div.appendChild(btn);

	loadModule("static/html/RModelSCViewer.umd.min.js");
}
let rscViewer = null;
let loadedModel = false;
function getCameraDataParam(first = false) {
	if (loadedModel) {
		let key = first ? "" : "&";
		return key + "camdvs=[" + rscViewer.getCameraData(0.01, true) + "]";
	}
	return "";
}
function initRSCViewer() {
	rscViewer = new RModelSCViewer.RModelSCViewer();
	console.log("rscViewer: ", rscViewer);
	rscViewer.initialize(viewerDiv, () => {
		//fileObj
		// rscViewer.initSceneByFiles([fileObj], (prog) => {
		// 	console.log("model loading prog: ", prog);
		// 	if(prog >= 1.0) {
		// 		viewerInfoDiv.innerHTML = "";
		// 		loadedModel = true;
		// 	}
		// }, 200);
	}, true);
	// 增加三角面数量的信息显示
	rscViewer.setForceRotate90(true);
	rscViewer.setMouseDownListener((evt) => {
		console.log("viewer evt: ", evt);
		// viewerInfoDiv.innerHTML = "";
	});

	document.onmousedown = () => {
		console.log("mouse down.");
		// let cameraData = rscViewer.getCameraData(0.01);
		// console.log("cameraData: ", cameraData);
	}
	if (isApplyAliveTask()) {
		initAliveTaskAt(aliveTaskIndex);
	}
}
function loadModule(url) {

	let req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.onerror = function (err) {
		console.error("load error: ", err);
	}
	// req.onprogress = e => { };
	req.onload = evt => {

		let scriptEle = document.createElement("script");
		scriptEle.onerror = evt => {
			console.error("module script onerror, e: ", evt);
		};
		scriptEle.type = "text/javascript";
		try {
			scriptEle.innerHTML = req.response;
			document.head.appendChild(scriptEle);
			initRSCViewer();
		} catch (e) {
			console.error("ModuleLoader::loadedData() apply script ele error.");
			throw e;
		}
	}
	req.send(null);
}
let aliveTasks = null;
let aliveTaskIndex = -1
function isApplyAliveTask() {
	return aliveTaskIndex >= 0;
}
function updateTaskJsonData(taskInfo) {
	if (taskJsonObj.version != taskInfo.version) {
		console.log("### ###### updateTaskJsonData() need update task json data obj. XXXXXXXXXXXXXXX .");
		setTaskJsonData(taskInfo);

		setBGTransRBtnSt(taskInfo.bgTransparent === 1 ? "true" : "false", true);
		// console.log("taskInfo.camdvs: ", taskInfo.camdvs);
		rscViewer.updateCameraWithF32Arr16(taskInfo.camdvs);
		rimgSizes = taskInfo.sizes;
		let kvalue = rimgSizes[0] + "x" + rimgSizes[1];
		setSizeBtnStatWithValue(kvalue, true);
		parseRenderingTaskInfo(taskInfo);
		let tphase = taskInfo.phase
		if (tphase != "finish" && tphase != "error") {
			// ptupdateTimes = 2100
			// taskStatus = 0;
			// startTime = Date.now();
			// clearSTInfoDivEles();
			// reqstUpdate()
			restartReqstUpdate();
		}
	}
}
function initAliveTaskAt(index) {

	sendRenderingBtn.style.display = 'none';
	let taskInfo = aliveTasks[index];
	updateTaskJsonData(taskInfo);
}
function gotoAliveTaskAt(index) {
	console.log("gotoAliveTaskAt(), index: ", index);
	aliveTaskIndex = index;
	let div = document.getElementById("select_file_div");
	initModelViewer(div);

}
function gotoTasksListPage() {
	let div = document.getElementById("select_file_div");
	clearDivAllEles(div);
	for (let i = 0; i < aliveTasks.length; ++i) {
		let br = document.createElement("br");
		div.appendChild(br);

		let link = document.createElement("a");
		link.innerHTML = "选择第<" + (i + 1) + ">个渲染任务: " + aliveTasks[i].taskname;
		link.href = "#";
		link.addEventListener("click", () => {
			gotoAliveTaskAt(i)
		});
		div.appendChild(link);
		br = document.createElement("br");
		div.appendChild(br);
	}
	let br = document.createElement("br");
	div.appendChild(br);
	br = document.createElement("br");
	div.appendChild(br);
}
function syncAliveTasks(btn) {
	console.log("syncAliveTasks(), btn: ", btn);
	let url = createReqUrlStr(taskInfoGettingUrl, "syncAliveTasks", 0, 0, "none");
	console.log("### ###### 01 syncAliveTasks(), url: ", url);
	sendACommonGetReq(url, (purl, content) => {
		var infoObj = JSON.parse(content);
		aliveTasks = infoObj.tasks;
		if (aliveTasks.length > 0) {
			gotoTasksListPage();
		} else {
			alert("没有可以操作的其他渲染任务")
		}
		console.log("### ###### 02 syncAliveTasks(), infoObj: ", infoObj);
	}
	);
}
