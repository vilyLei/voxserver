
export class DemoPostHttpReq {
	private m_init = true;

	constructor() { }

	initialize(): void {
		console.log("DemoPostHttpReq::initialize()......");
		if (this.m_init) {
			this.m_init = false;


			document.onmousedown = (): void => {
				this.sendReq_createUser();
			}
		}
	}

	private sendReq_createUser(): void {
		console.log("sendReq() ...");
		let url = "http://localhost:9080/users";
		var http = new XMLHttpRequest();
		var params = '{"ID":5,"Name":"Vily","Email":"313@128.com"}';
		let jsonObj = JSON.parse(params);
		console.log("jsonObj: ", jsonObj);
		http.open('POST', url, true);

		// Send the proper header information along with the request
		http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		http.onreadystatechange = function() {
			//Call a function when the state changes.
			if(http.readyState == 4 && http.status == 200) {
				console.log("request success !!!");
			}else {
				console.log("send error");
			}
		}
		http.send(params);
	}
	run(): void {
	}
}
export default DemoPostHttpReq;
