import { h, ref, withModifiers, type DefineComponent, type Ref, type VNode } from 'vue';
import SlotHost from '../hosts/SlotHost.vue';
import BlockHost from '../hosts/BlockHost.vue';
import ComponentHost from '../hosts/ComponentHost.vue';

export declare interface SchemaItem {
	component : DefineComponent|null,
	flow : String,
	tag? : String,
	position? : number[]|null,
};

export declare interface Schema {
	[index : string]: SchemaItem
}

export default class {
	document : Ref<any[]|null> = ref(null);
	schema : Schema = {};
	selectedPosition : Ref<number[]|null> = ref(null);
	selectHandler : Function = () => [];
	updateHandler : Function = () => [];
	addHandler : Function = () => [];

	constructor(document : Ref<any[]|null>, schema :  Schema, selectedPosition : Ref<number[]|null>, selectHandler : Function, updateHandler : Function, addHandler : Function) {
		this.document.value = document.value;
		this.schema = schema;
		this.selectedPosition.value = selectedPosition.value;
		this.selectHandler = selectHandler;
		this.updateHandler = updateHandler;
		this.addHandler = addHandler;
	}

	render() : (VNode|string)[] {
		if(this.document.value === null) {
			return [ h('div', { style: 'color: #EF4444; font-weight: bold; text-align: center; margin: 5rem;' }, [ 'There was a problem interpreting the incoming document.' ]) ];
		}

		return this.renderNodes(this.document.value);
	}

	renderNodes(nodes : any[]) : (VNode|string)[] {
		return nodes.map(this.renderNode.bind(this));
	};


	renderNode(node : any[]|string) : (VNode|string) {
		if (!Array.isArray(node)) {
			return node;
		}

		const schemaItem : SchemaItem|null = this.schema[node[0].tag];
		if(schemaItem?.component) {
			return this.renderComponent(node, schemaItem?.component);
		}

		if(node[0].flow === 'block') {
			return this.renderBlock(node);
		}

		return this.renderInline(node);
	}

	renderComponent(node : any[], component : DefineComponent) : VNode {
		let componentAttributes = JSON.parse(JSON.stringify(node[1]));
		componentAttributes.onClick = withModifiers(this.selectHandler.bind(null, node[0].position), ['capture']);

		let hostAttributes = {
			class: componentAttributes.class,
			selected: (this.selectedPosition.value === node[0].position),
			tag: node[0].tag,
		 };

		componentAttributes.class = null;

		return h(ComponentHost, hostAttributes, () => h(component, componentAttributes, this.renderSlots(node[2], node[0].position)));
	};

	renderInline(node : any[]) : VNode {
		return h(node[0].tag, node[1], this.renderNodes(node[2]));
	}

	renderBlock(node : any[]) : VNode {
		return h(BlockHost, {
			onClick: withModifiers((event : Event) => event.stopPropagation(), ['capture']),
			onInput: (value : string) => this.updateHandler(node[0].position, value),
			onSelect: this.selectHandler.bind(null, node[0].position),
			selected: (this.selectedPosition.value === node[0].position),
			tag: node[0].tag,
		}, { default:() => h(node[0].tag, node[1], this.renderNodes(node[2])) });
	};

	renderSlots(slotNodes : any[], parentPosition : number[]) : VNode {
		const slots = slotNodes.reduce((collation, slotNode, index) => {
			if(!Array.isArray(slotNode)) {
				if(!collation['default']) collation['default'] = [];
				collation['default'].push(slotNode);
				return collation;
			}
			
			if(Object.keys(slotNode[1]).find(key => key.startsWith('v-slot'))) {
				let slotName : string|undefined = Object.keys(slotNode[1]).find((key : String) => key.startsWith('v-slot'))?.replace(/^v-slot:/, '').replace(/^v-slot$/, 'default');
				if(slotName === undefined) {
					return null;
				}
				if(!collation[slotName]) collation[slotName] = [];
				Array.prototype.push.apply(collation[slotName], slotNode[2]);
				return collation;
			}

			if(!collation['default']) collation['default'] = [];
			collation['default'].push(slotNode);

			return collation;
		}, { });


		let outputNodes : any[string] = {};
		Object.keys(slots).forEach((slotName) => {
				const slotHostAttrs = {
					selected: (this.selectedPosition.value === parentPosition),
					onAdd: this.addHandler.bind(null, parentPosition, slotName),
				}
				outputNodes[slotName] = () => h(SlotHost, slotHostAttrs, () => this.renderNodes(slots[slotName]));
		});
		return outputNodes;
	}
}
