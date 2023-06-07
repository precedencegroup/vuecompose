<script setup lang="ts">

const props = defineProps({
    selected: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add']);

</script>

<template>
    <slot></slot>
    <div v-if="selected" :style="{ position: 'absolute', top: '100%', left: 0, right: 0, textAlign: 'center', display: 'block' }"><div @click.prevent="emit('add')" :style="{ marginTop: '-1rem', borderRadius: '9999px', backgroundColor: '#22C55E', paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '.25rem', paddingBottom: '.25rem', fontSize: '.75rem', lineHeight: '1rem', color: '#fff', width: 'fit-content', display: 'inline-block' }">add +</div></div>
</template>