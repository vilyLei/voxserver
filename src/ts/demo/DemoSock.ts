export class DemoSock {
	private m_init = true;

	constructor() {}

	initialize(): void {
		console.log("DemoSock::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			// document.oncontextmenu = function (e) {
			// 	e.preventDefault();
			// };
			// this.initSock();
			document.onclick = (evt: any): void => {
				this.initSock();
			}
		}
	}
	private m_initSock = true;
	private m_sock: WebSocket = null;
	private initSock(): void {
		if(this.m_initSock) {
			this.m_initSock = false;
			console.log("DemoSock::initSock()......");
			// Create WebSocket connection.
			// const socket = new WebSocket("ws://localhost:8080");
			// const socket = new WebSocket("wss://localhost:8080");
			const socket = new WebSocket("ws://localhost:8080/ws");
			socket.addEventListener("error", (evt: any):void => {

				console.error("sock socket.readyState: ", socket.readyState);
				console.error("sock error: ", evt);
			});
			// Connection opened
			socket.addEventListener("open", event => {
				console.log("sock open event done, socket.readyState: ", socket.readyState);
				console.log("sock connection building success !!!");
				this.m_sock = socket;
				this.m_sock.send("Hello Server!");
			});

			// Listen for messages
			socket.addEventListener("message", event => {
				// console.log("sock message event done, socket.readyState: ", socket.readyState);
				// console.log("Message from server ", event.data);
				this.receiveData(event.data);
			});
		}else {
			this.sendData("");
		}
	}
	private sendData(data: string): void{
		if(this.m_sock) {
			this.m_sock.send("Hi, my dear!");
		}
	}
	private receiveData(sockData: any): void {
		console.log("receiveData(), data: ", sockData);
	}
	run(): void {}
}
export default DemoSock;
