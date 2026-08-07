<template>
    <button :class="['px-4 py-2 rounded-md text-white cursor-pointer', variant === 'full' ? 'w-full mx-3' : '', bg, hover]" @click="$emit('click-button')">
        {{ innerText }}
    </button>
</template>
<script setup lang="ts">


    
    interface Props {
        variant? : 'default' | 'full',
        innerText : string,
        bg : string,
        hover : string,
        
    }


    withDefaults(defineProps <Props>(), {
        variant: 'default',
        innerText : 'isi',
        bg : 'bg-sky-900',
        hover : 'hover:bg-sky-800'
    });

    defineEmits<{
        (e : 'click-button') : any
    }>()
</script>