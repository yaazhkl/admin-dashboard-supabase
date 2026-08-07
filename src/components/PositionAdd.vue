<template>
    <div class="">
        <Button variant="default" inner-text="Add Position" bg="bg-sky-400" hover="bg-sky-600" @click="openForm"></Button>
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
                    <h2 class="text-2xl font-bold text-slate-800">Add Position</h2>
                </div>

                <form @submit.prevent="" class="space-y-4">
                    <div>
                        <label class="block mb-1 text-sm font-medium">
                            Position Name
                        </label>
                        <input type="text" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="positionName">
                    </div>
                    <div>
                        <label class="block mb-1 text-sm font-medium">
                            Position Code
                        </label>
                        <input type="text" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="positionCode">
                    </div>
                    <div>
                    </div>
                    <div class="">
                    <!-- Position -->
                    <div>
                        <label class="block mb-1 text-sm font-medium">
                            Department
                        </label>
                        <select
                        class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="department"
                        >
                        <option v-for="depart in departmentList"         :key="depart.id"
                        :value="depart.id">{{ depart.name }}</option>
                        </select>
                    </div>
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
                        hover="bg-sky-600" @click="savedPosition()"
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
    import { useDepartmentStore  } from '../store/departmentStore.ts';
    import { storeToRefs } from 'pinia';
    import { addPosition } from '../service/positionService.ts';
    import { activityLogService } from '../service/activityLogService.ts';
    import { useAuthStore } from '../store/authStore.ts';
import { usePositionStore } from '../store/positionStore.ts';

    // state
    const isFormOpen = ref<boolean>(false);
    const positionName = ref<string>('');
    const positionCode = ref<string>('');
    const department = ref('');

    // for activity log use
    const useAuth = useAuthStore();
    const { currentUser } = storeToRefs(useAuth);

    const useDepart = useDepartmentStore();
    const {departmentList} = storeToRefs(useDepart);

    const usePosition = usePositionStore();

    const savedPosition = async()=>{
        const newPosition = {
            departmentId : department.value,
            name : positionName.value,
            code : positionCode.value
        }

        const saveAddLog = {
            user : currentUser.value.username,
            action : "POSITION ADD",
            module : "POSITIONS",
            description : `${currentUser.value.username} Added New Position ${newPosition.name}`
        }

        await activityLogService.saveLog(saveAddLog);

        await addPosition(newPosition);
        await usePosition.positionCall();
        isFormOpen.value = false;


    }

    const openForm = ()=>{
        isFormOpen.value = true;
    }
</script>        

