
export class DemoBase {
	private m_init = true;

	constructor() { }

	initialize(): void {
		console.log("DemoBase::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function (e) {
				e.preventDefault();
			};


		}
	}
	run(): void {
	}
}
export default DemoBase;
