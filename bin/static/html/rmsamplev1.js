console.log("js sys init ...");
let rimgSizes = [512, 512]
let rtBGTransparent = false
let hostUrl = "http://localhost:9090/"
hostUrl = "/"
let taskReqSvrUrl = hostUrl + "renderingTask";

let curr3DViewerInfoDiv = null;

let ptupdateTimes = 2100
let timeoutId = -1;
let startTime = Date.now()

let taskJsonObj = {}
let taskStatus = 0
let rt_phase = ""
let rt_phase_times = 0
function reset() {
	taskJsonObj = {}
	taskStatus = 0
	rt_phase = ""
	rt_phase_times = 0
}
function updatePage() {
	location.reload();
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
function taskSuccess(filepath) {
	if (filepath === undefined || filepath == "") {
		filepath = "./static/rtUploadFiles/modelRTask2001/boomBox.glb"
	}
	let i = filepath.lastIndexOf("/")
	let imgDirUrl = hostUrl + filepath.slice(2, i + 1);
	imgUrl = imgDirUrl + "bld_rendering_mini.jpg?ver=" + Math.random() + "-" + Math.random(Date.now())
	console.log("imgUrl: ", imgUrl);

	var div = document.getElementById("imgDiv");
	clearDivAllEles(div)
	// let img = new Image()
	// img.src = imgUrl
	// div.appendChild(img);
	// var br = document.createElement("br");
	// div.appendChild(br);

	let big_imgUrl = imgDirUrl + "bld_rendering.jpg"
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
	span.innerHTML = '/\\';
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
	let codeLoader = new XMLHttpRequest();
	codeLoader.open("GET", purl, true);
	codeLoader.onerror = function (err) {
		console.error("load error: ", err);
	};
	codeLoader.onprogress = e => { };
	codeLoader.onload = evt => {
		console.log("sendCurrentGetReq(), codeLoader.response: ", codeLoader.response);
	};
	codeLoader.send(null);
}
function showSpecInfo(keyStr, times) {

	var div = document.getElementById("infoDiv");
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

function setBGTransRBtnSt(valueStr) {

	rtBGTransparent = valueStr == "true";
	btn = document.getElementById("bg_transparent_select_radio_btn")
	btn.checked = rtBGTransparent
	btn.value = valueStr
	document.getElementById("b-t-s-r").innerHTML = rtBGTransparent ? "是" : "否"
}
function rtBGTransparentHandleChange(btn) {

	if (btn.value === "true") {
		btn.value = "false"
	} else {
		btn.value = "true"
	}
	setBGTransRBtnSt(btn.value);

	let cname = "rtBGTransparent";
	let kvalue = btn.value;
	setCookieByName(cname, kvalue)
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
function initConfig() {

	let kvalue = rimgSizes[0] + "x" + rimgSizes[1];
	let cname = "rtTaskInfo";
	let cvalue = getCookieByName(cname)
	if (cvalue != "") {
		kvalue = cvalue
	} else {
		setCookieByName(cname, kvalue)
	}
	var checks = document.getElementsByName("size_select_radio");
	for (let i = 0; i < checks.length; ++i) {
		// console.log("checks[i].value: ", checks[i].value);
		if (checks[i].value == kvalue) {
			checks[i].checked = true;
			sizeHandleChange(checks[i])
		}
	}

	kvalue = rtBGTransparent ? "true" : "false";
	cname = "rtBGTransparent";
	cvalue = getCookieByName(cname)
	if (cvalue != "") {
		kvalue = cvalue
	} else {
		setCookieByName(cname, kvalue)
	}
	setBGTransRBtnSt(kvalue);
}
function sendAGetReq(purl) {
	if(taskStatus == 3) {
		return;
	}
	let codeLoader = new XMLHttpRequest();
	codeLoader.open("GET", purl, true);
	codeLoader.onerror = function (err) {
		console.error("load error: ", err);
		taskStatus = 3;
		alert("服务器无法正常访问 !!!");
		updatePage()
		return;
	};
	codeLoader.onprogress = e => { };
	codeLoader.onload = evt => {
		var sdo = JSON.parse(codeLoader.response);
		console.log("sendAGetReq(), sdo: ", sdo);
		let status = sdo.status

		var div = document.getElementById("infoDiv");
		// var div = curr3DViewerInfoDiv;
		let phase = sdo.phase;
		if (rt_phase != phase) {
			rt_phase = phase
			rt_phase_times = 0
		}
		let keyStr = ""
		let flag = 0
		switch (phase) {
			case "running":
				if (sdo.progress < 6) {
					showSpecInfo("正在解析模型数据", rt_phase_times)
				} else {
					div.innerHTML = `正在进行渲染: <b><font color="#008800">` + sdo.progress + `%</font></b>`
				}
				break;
			case "new":
				keyStr = `排队<b><font color="#880000">(` + sdo.teamIndex + "/" + sdo.teamLength + `)</font></b>等待可用的空闲渲染器`
				showSpecInfo(keyStr, rt_phase_times)
				break;
			case "task_rendering_enter":
				if (rt_phase_times > 2) {
					showSpecInfo("配置渲染任务", rt_phase_times)
				} else {
					showSpecInfo("启动渲染任务", rt_phase_times)
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
					taskStatus = 1
					let sizes = sdo.sizes;
					let time_ms = (Date.now() - startTime)
					let time_s = Math.round(time_ms / 1000.0)
					console.log("loss time: ", time_s + "s(" + time_ms + "ms)");
					div.innerHTML = `<b><font color="#008800">` + sizes[0] + "x" + sizes[1] + `</font></b>效果图渲染完成<br/><b>(总耗时` + time_s + `s)</b>`
					taskSuccess(taskJsonObj.filepath)
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
					ptupdateTimes = 2100
					timeoutId = -1;
					taskStatus = 0;
					startTime = Date.now();
					clearSTInfoDivEles();
					reqstUpdate();
				}
				break;
			default:
				break;
		}
		rt_phase_times++
	};
	codeLoader.send(null);
}
function notifyTaskInfoToSvr(phase, progress, taskId, taskName, otherInfo = "") {
	let url = taskReqSvrUrl + "?srcType=viewer&&phase=" + phase + "&progress=" + progress + otherInfo
	if (taskId > 0) {
		url += "&taskid=" + taskId + "&taskname=" + taskName
	}
	sendAGetReq(url)
}

function reqstUpdate() {

	if (timeoutId > -1) {
		clearTimeout(timeoutId);
	}
	// console.log("reqstUpdate() ... taskJsonObj: ", taskJsonObj)
	if (taskStatus < 1) {
		notifyTaskInfoToSvr("queryataskrst", 0, taskJsonObj.taskid, taskJsonObj.taskname, "")
		ptupdateTimes--;
		if (ptupdateTimes > 0) {
			timeoutId = setTimeout(reqstUpdate, 800);
		} else {

		}
	} else {
		console.log("task finish !!!!")
	}
}

var xhr;
var fileObj = null;
function readyUploadAFile() {
	fileObj = document.getElementById("file_select").files[0];
	console.log("A01 fileObj: ", fileObj);
}
function getRenderingParams() {
	let params ="&sizes=" + rimgSizes;
	params +=  getCameraDataParam();
	params += "&rtBGTransparent=" + (rtBGTransparent?"1":"0");
	return params
}
function uploadAndSendRendering() {
	if(fileObj == null) {
		return;
	}
	// let sizes = rimgSizes + ""
	var url = hostUrl + "uploadRTData?srcType=viewer&phase=newrtask" + getRenderingParams();
	// var url = hostUrl + "uploadRTData?srcType=viewer&&phase=newrtask&sizes=" + sizes;
	// url +=  getCameraDataParam();
	// url += "&rtBGTransparent=" + (rtBGTransparent?"1":"0");
	console.log("UpladFile() call ...url: ", url);
	// fileObj = document.getElementById("file_select").files[0];
	console.log("A02 fileObj: ", fileObj);
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
		taskJsonObj = data
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
	if(id !== "") {
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

	clearDivAllEles(div)

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
	let btn = sendRenderingBtn = createBtn("send_rendering", 440, "发起渲染", () => {
		console.log("发起渲染...");
		uploadAndSendRendering();
		sendRenderingBtn.style.display = 'none';
	});
	div.appendChild(btn);

	loadModule("RModelSCViewer.umd.js");
}
let rscViewer = null;
let loadedModel = false;
function getCameraDataParam(first = false) {
	if(loadedModel) {
		let key = first ? "" : "&";
		return key + "camdvs=[" + rscViewer.getCameraData(0.01, true)+"]";
	}
	return "";
}
function initRSCViewer() {
	rscViewer = new RModelSCViewer.RModelSCViewer();
	console.log("rscViewer: ", rscViewer);
	rscViewer.initialize( viewerDiv, () => {
		//fileObj
		rscViewer.initSceneByFiles([fileObj], (prog) => {
			console.log("model loading prog: ", prog);
			if(prog >= 1.0) {
				viewerInfoDiv.innerHTML = "";
				loadedModel = true;
			}
		}, 200);
	}, true);

	document.onmousedown = () => {
		console.log("mouse down.");
		// let cameraData = rscViewer.getCameraData(0.01);
		// console.log("cameraData: ", cameraData);
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
		// this.loadedData(req.response, url);

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
