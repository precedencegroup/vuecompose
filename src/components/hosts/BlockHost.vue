<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from "vue";

const emit = defineEmits(['select','input','remove']);

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

const blockEditElement : Ref<HTMLElement|null> = ref(null);

function saveContent(e: any) {
    emit('input', e.target.innerHTML);
};

function editContent(e :Event) {
    emit('select', e);
}

watch(() => props.selected, function(value) {
    nextTick(() => blockEditElement.value === null || blockEditElement.value.focus());
});

</script>

<template>
    <div class="relative" :style="selected ? { outlineStyle: 'solid', outlineWidth: '2px', outlineColor: '#22C55E' } : {}">
        <div :contenteditable="selected" @click.capture="editContent" @blur="saveContent" ref="blockEditElement">
            <slot></slot>
        </div>
        <div v-if="selected" ref="titlebar" :style="{ display: 'flex', position: 'absolute', top: '-1.25rem', left: '-2px', right: '-2px', borderTopLeftRadius: '.5rem', borderTopRightRadius: '.5rem', backgroundColor: '#3b82f6', color: '#fff', fontSize: '.75rem', paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '.25rem', lineHeight: '1rem' }">
            <div :style="{ flexGrow: '1' }">&lt;{{ tag }} /&gt;</div>
            <div :style="{ flexGrow: '0', flexShrink: '0' }" @click="$emit('remove')" class="cursor-pointer ml-auto">x</div>
        </div>
    </div>
</template>