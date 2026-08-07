<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-lg">
            <div class="">
                <h2 class="font-bold text-xl text-center">{{ titleModal }}</h2>
            </div>
            <div class="py-8 text-center">
                <p>{{ paragraph }}</p>
            </div>
            <div class="flex items-center justify-between">
                <div class="">
                <Button @click="$emit('cancel')" variant="default" inner-text="Cancel" bg="bg-gray-300" hover="bg-gray-600"></Button>
                </div>
                <div class="">
                <Button @click="$emit('confirm')" variant="default" inner-text="Ok" bg="bg-gray-300" hover="bg-gray-600"></Button>
            </div>
            </div>
        </div>
    </div>

</template>
<script setup lang="ts">
    import Button from './Button.vue';
    defineProps<{
        titleModal:string,
        paragraph?: string,
        buttonOk?: any,
        buttonCancel?: any
    }>();

    const emit = defineEmits<{
        (e:'cancel'):void
        (e:'confirm'):void
    }>();


</script>