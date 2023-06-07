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

</script>
<template>
	<div class="cursor-pointer relative" :style="props.selected ? { outlineStyle: 'solid', outlineWidth: '2px', outlineColor: '#22C55E' } : {}">
		<slot></slot>
		<div ref="titlebar" v-if="selected" :style="{ display: 'block', position: 'absolute', top: '-1.25rem', left: 0, right: 0, borderTopLeftRadius: '9999px', borderTopRightRadius: '9999px', backgroundColor: '#22C55E', color: '#fff', fontSize: '.75rem', paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '.25rem', lineHeight: '1rem' }">&lt;{{ tag }} /&gt;</div>
	</div>
</template>
