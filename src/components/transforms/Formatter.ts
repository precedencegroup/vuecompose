export default class {
	document: any[] = [];

	constructor(document : any[]) {
		this.document = document;
	}

	format() : String {
		return this.document.map(this.formatNode.bind(this)).join('') ?? '';
	}

	formatNode(node : any[]) : String {
		if (Array.isArray(node)) {
			const attributes = Object.keys(node[1])?.map((key : string) => key==='position'?null:node[1][key]===null?key:`${key}="${node[1][key]}"`) ?? null;
			const children = node[2]?.map(this.formatNode.bind(this));
			return `<${node[0].tag} ${attributes.join(' ')}>${children.join('')}</${node[0].tag}>`;
		} else {
			return node;
		}
	};
}
