<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from "vue";

const emit = defineEmits(['select','input']);

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
        <div v-if="selected" ref="titlebar" :style="{ position: 'absolute', top: '-1.25rem', left: 0, right: 0, borderTopLeftRadius: '9999px', borderTopRightRadius: '9999px', backgroundColor: '#3b82f6', color: '#fff', fontSize: '.75rem', paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '.25rem', lineHeight: '1rem' }">&lt;{{ tag }} /&gt;</div>
    </div>
</template>