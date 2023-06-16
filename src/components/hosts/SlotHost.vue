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
    <div v-if="selected"><div @click.prevent="emit('add')" :style="{ borderRadius: '0.25rem', borderColor: '#22C55E', borderWidth: '0.125rem', padding: '0.125rem', fontSize: '2rem', fontWeight: '700', borderStyle: 'dashed', color: '#22C55E', maxWidth: '100%', height: '100%', textAlign: 'center' }">+</div></div>
</template>