<template>
    <div class="">
        <Button variant="default" inner-text="Add Department" bg="bg-sky-600" hover="bg-sky-600" @click="openForm"></Button>
    </div>

    <!-- Overlay -->
    <Transition name="fade">
        <div class="fixed inset-0 bg-black/40 z-40" v-if="isFormOpen">
        </div>
    </Transition>

    <!-- Modal -->
    <Transition name="modal" >
        <div v-if="isFormOpen" class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-lg">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-slate-800">Add Department</h2>
                </div>

                <form @submit.prevent="" class="space-y-4">
                    <div>
                        <label class="block mb-1 text-sm font-medium">
                            Department Name
                        </label>
                        <input type="text" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="departName">
                    </div>
                    <div>
                        <label class="block mb-1 text-sm font-medium">
                            Department Code
                        </label>
                        <input type="text" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="departCode">
                    </div>
                    <div>
                        <label class="block mb-1 text-sm font-medium">
                            Department Description
                        </label>
                        <input type="text" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" 
                        v-model="departDesc">
                    </div>
                    <div class="flex justify-end gap-3 pt-4">
                        <Button
                        variant="default"
                        inner-text="Cancel"
                        bg="bg-gray-300"
                        hover="bg-gray-500"
                        @click="isFormOpen = false"
                        />

                        <Button
                        variant="default"
                        inner-text="Confirm"
                        bg="bg-sky-400"
                        hover="bg-sky-600" @click="savedDepart()"
                        />
                    </div>
                </form>
            </div>
        </div>
    </Transition>
</template>
<script setup lang="ts">
    import Button from './Button.vue';
    import { ref } from 'vue';
    import { addDepartment } from '../service/departmentService.ts';
    import { useAuthStore } from '../store/authStore.ts';
    import { activityLogService } from '../service/activityLogService.ts';
    import { storeToRefs } from 'pinia';
import { useDepartmentStore } from '../store/departmentStore.ts';

    // state
    const isFormOpen = ref<boolean>(false);
    const departName = ref<string>('');
    const departCode = ref<string>('');
    const departDesc = ref<string>('');
    // for activity log use
    const useAuth = useAuthStore();
    const { currentUser } = storeToRefs(useAuth);
    const useDepart = useDepartmentStore();
    // actions
    const openForm = ()=>{
        isFormOpen.value = true;
    }

    const savedDepart = async()=>{
        const newDepart = {
            name : departName.value,
            code : departCode.value,
            description : departDesc.value
        }

        const saveAddLog = {
            user : currentUser.value.username,
            action : "DEPARTMENT ADD",
            module : "DEPARTMENTS",
            description : `${currentUser.value.username} Added New Department ${newDepart.name}`
        }

        await addDepartment(newDepart);
        await activityLogService.saveLog(saveAddLog);
        await useDepart.departmentCall();
        isFormOpen.value = false;
    }


    
</script>