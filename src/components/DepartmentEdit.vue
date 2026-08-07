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
                        v-model="departNameEdit"/>
                    </div>
                    <div class="">
                        <label class="block mb-1 text-sm font-medium">
                            Code
                        </label>
                        <input
                        type="text"
                        class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        v-model="departCodeEdit"/>
                    </div>
                    <div class="">
                        <label class="block mb-1 text-sm font-medium">
                            Desc
                        </label>
                        <input
                        type="text"
                        class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        v-model="departDescEdit"/>
                    </div>
                    <!-- Button -->
                    <div class="flex justify-end gap-3">
                        <Button
                        variant="default" inner-text="Cancel" bg="bg-gray-300" hover="bg-gray-500" @click="closeModal"/>
                        <Button
                        variant="default" inner-text="Save" bg="bg-sky-300" hover="bg-sky-500" @click="savedDepartment"/>
                    </div>
                </form>
            </div>
        </div>
</template>
<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { updateDepartment } from '../service/departmentService';
    import type { Department } from '../types/user';
    import Button from './Button.vue';
    import { useAuthStore } from '../store/authStore.ts';
    import { activityLogService } from '../service/activityLogService.ts';
    import { storeToRefs } from 'pinia';

    // State
    const departNameEdit = ref<string>();
    const departCodeEdit = ref<string>();
    const departDescEdit = ref<string>();
    const isFormOpen = ref<boolean>(false);

    // for activity log use
    const useAuth = useAuthStore();
    const { currentUser } = storeToRefs(useAuth);

    // getter
    const emit = defineEmits<{
        (e:'save'):void
        (e:'cancel'):void
    }>();

    const closeModal = ()=>{
        emit('cancel');
    };

    const props = defineProps<{
        department : Department
    }>();

    const savedDepartment = async()=>{
        const editDepartment = {
            name : departNameEdit.value,
            code : departCodeEdit.value,
            description : departDescEdit.value
        }
        
        const saveEditLog = {
            user : currentUser.value.username,
            action : "DEPARTMENT EDIT",
            module : "DEPARTMENTS",
            description : `${currentUser.value.username} Edited ${editDepartment.name} Department`
        }

        await updateDepartment(props.department.id, editDepartment);
        await activityLogService.saveLog(saveEditLog);
        console.log("savelog berhasil");
        emit("save");
        isFormOpen.value = false;
    }

   watch(
    () => props.department,
    (depart) => {

        departNameEdit.value = depart.name
        departCodeEdit.value = depart.code
        departDescEdit.value = depart.description
    },
    {
        immediate:true
    }
    )

</script>