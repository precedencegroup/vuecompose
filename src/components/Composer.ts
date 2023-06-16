import { defineComponent, computed, ref, type Ref } from 'vue';
import { Parser, Formatter, Renderer } from './transforms';

const defaultSchema = {
	'address': { component: null, flow: 'block' },
	'article': { component: null, flow: 'block' },
	'aside': { component: null, flow: 'block' },
	'blockquote': { component: null, flow: 'block' },
	'details': { component: null, flow: 'block' },
	'dialog': { component: null, flow: 'block' },
	'dd': { component: null, flow: 'block' },
	'div': { component: null, flow: 'block' },
	'dl': { component: null, flow: 'block' },
	'dt': { component: null, flow: 'block' },
	'fieldset': { component: null, flow: 'block' },
	'figcaption': { component: null, flow: 'block' },
	'figure': { component: null, flow: 'block' },
	'footer': { component: null, flow: 'block' },
	'form': { component: null, flow: 'block' },
	'h1': { component: null, flow: 'block' },
	'h2': { component: null, flow: 'block' },
	'h3': { component: null, flow: 'block' },
	'h4': { component: null, flow: 'block' },
	'h5': { component: null, flow: 'block' },
	'h6': { component: null, flow: 'block' },
	'header': { component: null, flow: 'block' },
	'hgroup': { component: null, flow: 'block' },
	'hr': { component: null, flow: 'block' },
	'li': { component: null, flow: 'block' },
	'main': { component: null, flow: 'block' },
	'nav': { component: null, flow: 'block' },
	'ol': { component: null, flow: 'block' },
	'p': { component: null, flow: 'block' },
	'pre': { component: null, flow: 'block' },
	'section': { component: null, flow: 'block' },
	'table': { component: null, flow: 'block' },
	'ul': { component: null, flow: 'block' },
};

export default defineComponent({
	props: {
		modelValue: {
			type: String,
			default: '',
		},
		schema: {
			type: Object,
			default: {},
		},
	},
	events: [ 'update:modelValue' ],
	setup(props, { emit }) {
		const fullSchema = computed(() => ({ ...defaultSchema, ...props.schema }));
		let doc = computed(() => (new Parser(props.modelValue, fullSchema.value)).parse());

		const selectedPosition : Ref<number[]|null> = ref(null);
		function selectComponent(position : any, event : Event) {
			selectedPosition.value = position;
			event.stopPropagation();
		};

		function updateContent(position: number[], value: string) {
			const newDoc = (new Parser(props.modelValue, fullSchema.value)).parse();

			if(newDoc === null) {
				return;
			}

			// Generate a reactive reference to the content at the position of this newDoc
			let updateableItem : any[]|null = newDoc;
			let positionToUpdate = 0;
			for (let i = 0; i < position.length; i++) {
				if(updateableItem === null) {
					return;
				}
				
				if (i === position.length - 1) {
					positionToUpdate = position[i];
					continue;
				}

				updateableItem = updateableItem[position[i]][2] ?? null;
			}

			if(updateableItem === null) {
				return;
			}

			updateableItem[positionToUpdate] = value;

			emit('update:modelValue', (new Formatter(newDoc)).format());
		};

		function removeContent(position : number[]) {
			const newDoc = (new Parser(props.modelValue, fullSchema.value)).parse();

			if(newDoc === null) {
				return;
			}

			// Find the updateableItem that represents the parent of the position to be removed
			let updateableItem : any[]|null = newDoc;
			let parentPosition : number[] = [];
			let childPosition : number = 0;
			for (let i = 0; i < position.length; i++) {
				if(updateableItem === null) {
					return;
				}

				if (i === position.length - 1) {
					childPosition = position[i];
					continue;
				}

				parentPosition.push(position[i]);
				updateableItem = updateableItem[position[i]][2] ?? null;
			}

			if(updateableItem === null) {
				return;
			}

			// Splice out the item at the child position inside the parent updateableItem
			updateableItem.splice(childPosition, 1);

			// Emit the updated modelValue
			emit('update:modelValue', (new Formatter(newDoc)).format());
		}

		function addContent(position : number[], slotName : string) {
			const newDoc = (new Parser(props.modelValue, fullSchema.value)).parse();

			if(newDoc === null) {
				return;
			}

			// Generate a reactive reference to the content at the position of this newDoc
			let updateableItem : any[]|null = newDoc;
			let positionToUpdate = 0;
			for (let i = 0; i < position.length; i++) {
				if(updateableItem === null) {
					return;
				}
				
				if (i === position.length - 1) {
					positionToUpdate = position[i];
					continue;
				}

				updateableItem = updateableItem[position[i]][2] ?? null;
			}

			if(updateableItem === null) {
				return;
			}

			// find the child node of the updateableItem that represents the slot
			const slotIndex = updateableItem[positionToUpdate][2].findIndex((item : any) => typeof(item[1]) === 'object' ? Object.keys(item[1]).findIndex((key) => key == `v-slot:${slotName}`) > -1 : false);
			if(slotIndex === -1 && slotName === 'default') {
				const newChildIndex = updateableItem[positionToUpdate][2].length;
				const newChildPosition = JSON.parse(JSON.stringify(position)).concat([ newChildIndex ]);
				const newChild = {
					tag: 'div',
					position: newChildPosition,
					flow: 'block',
				};
	
				updateableItem[positionToUpdate][2].push([newChild, {}, [ "Well Hello There!" ]]);
			} else if(slotIndex !== -1) {
				const newChildIndex = updateableItem[positionToUpdate][2][slotIndex][2].length;
				const newChildPosition = JSON.parse(JSON.stringify(position)).concat([ slotIndex, newChildIndex ]);
				const newChild = {
					tag: 'staff-card',
					position: newChildPosition,
					flow: 'block',
				};
	
				updateableItem[positionToUpdate][2][slotIndex][2].push([newChild, {}, [ "Well Hello There!" ]]);
			}

			emit('update:modelValue', (new Formatter(newDoc)).format());
		}

		return () => (new Renderer(doc, fullSchema.value, selectedPosition, selectComponent, updateContent, addContent, removeContent)).render();
	},
});
