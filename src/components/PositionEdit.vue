<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-lg">
            <!-- Header -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-slate-800">
                    Edit User
                </h2>
                <p>
                    Update the Department Information Below
                </p>
            </div>

            <!-- Form -->
            <form @submit.prevent="" class="space-y-4">
                <!-- Name -->
                <div class="">
                    <label class="block mb-1 text-sm font-medium">
                        Name
                    </label>
                    <input
                    type="text"
                    class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    v-model="positionNameEdit"/>
                </div>
                <div class="">
                    <label class="block mb-1 text-sm font-medium">
                        Code
                    </label>
                    <input
                    type="text"
                    class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    v-model="positionCodeEdit"/>
                </div>
                <div class="">
                    <label class="block mb-1 text-sm font-medium">
                        Department
                    </label>
                    <select v-model="department" class="w-full rounded-lg border px-3 py-2">
                        <option v-for="department in departmentList" :key="department.id" :value="department.id">{{ department.name }}</option>
                    </select>
                </div>
                <!-- Button -->
                <div class="flex justify-end gap-3">
                    <Button
                        variant="default"
                        inner-text="Cancel"
                        bg="bg-gray-300"
                        hover="bg-gray-500"
                        @click="closeModal"
                        />
                    <Button
                        variant="default"
                        inner-text="Confirm"
                        bg="bg-sky-400"
                        hover="bg-sky-600" @click="savedPosition"
                        />
                </div>
            </form>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { editPosition } from '../service/positionService';
    import type { Position } from '../types/user';
    import Button from './Button.vue';
    import { useDepartmentStore } from '../store/departmentStore.ts';
    import { useAuthStore } from '../store/authStore.ts';
    import { activityLogService } from '../service/activityLogService.ts';
    import { storeToRefs } from 'pinia';

    // state
    const positionNameEdit = ref<string>('');
    const positionCodeEdit = ref<string>('');
    const department = ref();
    const useDepartment = useDepartmentStore();
    const { departmentList } = storeToRefs(useDepartment);

    // for activity log use
    const useAuth = useAuthStore();
    const { currentUser } = storeToRefs(useAuth);
    
    const emit = defineEmits<{
        (e:'save'):void
        (e:'cancel'):void
    }>();

    const props = defineProps<{
        position : Position
    }>()


    // methods
    const closeModal = ()=>{
        emit('cancel');
    };

    const savedPosition = async()=>{
        const editPos = {
            departmentId : department.value,
            name : positionNameEdit.value,
            code : positionCodeEdit.value,
        }

        const saveEditLog = {
            user : currentUser.value.username,
            action : "POSITION EDIT",
            module : "POSITIONS",
            description : `${currentUser.value.username} Edited ${editPos.name} Position`
        }

        await editPosition(props.position.id, editPos);
        await activityLogService.saveLog(saveEditLog);
        emit("save");
    }

    watch(
    () => props.position,
    (pos) => {

        positionNameEdit.value = pos.name
        positionCodeEdit.value = pos.code
        department.value = pos.departmentId
        

    },
    {
        immediate:true
    }
    )
</script>