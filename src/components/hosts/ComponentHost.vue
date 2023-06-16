<script setup lang="ts">

const props = defineProps({
	selected: {
		type: Boolean,
		required: true,
	},
	tag: {
		type: String,
		default: '<unknown>',
	},
});

defineEmits(['remove']);

</script>
<template>
	<div class="cursor-pointer relative" :style="props.selected ? { outlineStyle: 'solid', outlineWidth: '2px', outlineColor: '#22C55E' } : {}">
		<slot></slot>
		<div ref="titlebar" v-if="selected" :style="{ display: 'flex', position: 'absolute', top: '-1.25rem', left: '-2px', right: '-2px', borderTopLeftRadius: '.5rem', borderTopRightRadius: '.5rem', backgroundColor: '#22C55E', color: '#fff', fontSize: '.75rem', paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '.25rem', lineHeight: '1rem' }">
			<div :style="{ flexGrow: '1' }">&lt;{{ tag }} /&gt;</div>
			<div :style="{ flexGrow: '0', flexShrink: '0' }" @click="$emit('remove')" class="cursor-pointer ml-auto">x</div>
		</div>
	</div>
</template>
