<template>
    <!-- Add Button Section -->
    <div class="">
        <Button variant="default" inner-text="Add User" bg="bg-sky-400" hover="bg-sky-600" @click="isFormOpen = true"></Button>
    </div>
    <!-- Add Button Section End -->
    

    <!-- Overlay -->
    <Transition name="fade">
        <div
         v-if="isFormOpen"
            class="fixed inset-0 bg-black/40 z-40"
        ></div>
    </Transition>
    <!-- Modal -->
    <Transition name="modal">
    <div 
    v-if="isFormOpen"
    class="fixed inset-0 z-50 flex items-center justify-center">

        <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-lg">

            <!-- Header -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-slate-800">
                {{ mode === 'add' ? 'Add User' : 'Edit User' }}
                </h2>
                <p class="text-sm text-slate-500">
                        {{
                            mode === 'add'
                            ? 'Fill in the user information below.'
                            : 'Update the user information below.'
                        }}
                </p>
                </div>

                <!-- Form -->
                <form  class="space-y-4" @submit.prevent="savedUser">

                <!-- Name -->
                <div>
                    <label class="block mb-1 text-sm font-medium">
                    Name
                    </label>
                    <input
                    type="text"
                    class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="nameAdd"
                    />
                </div>

                <!-- Email -->

                <div>
                    <label class="block mb-1 text-sm font-medium">
                    Email
                    </label>
                    <input
                    type="email"
                    class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="emailAdd"
                    />
                </div>

                <!-- Department -->
                <div>
                    <label class="block mb-1 text-sm font-medium">
                    Department
                    </label>
                    <select
                    class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="departAdd"
                    >
                        <option v-for="department in departmentList" :key="department.id" :value="department.id">{{ department.name }}</option>
                    </select>
                </div>

                <!-- Position -->
                <div>
                    <label class="block mb-1 text-sm font-medium">
                    Position
                    </label>
                    <select
                    class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="posAdd"
                    >
                    <option>Select Position</option>
                    <option v-for="pos in filteredDepartment"         :key="pos.id"
                :value="pos.id">{{ pos.name }}</option>
                    </select>
                </div>

                <!-- Active -->
                <div>
                    <label class="block mb-1 text-sm font-medium">
                    Active
                    </label>
                    <select
                    class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="activeAdd"
                    >
                    <option :value="true">Aktif</option>
                    <option :value="false">Non-Aktif</option>
                    </select>
                </div>


                </form>

                <!-- Footer -->
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
                    hover="bg-sky-600"
                    @click="savedUser"
                    />
                </div>
        </div>
    </div>
    </Transition>
</template>
<script setup lang="ts">
    import Button from './Button.vue';
    import { ref, computed } from 'vue';
    import { useDepartmentStore } from '../store/departmentStore.ts';
    import { storeToRefs } from 'pinia';
    import { usePositionStore } from '../store/positionStore.ts';
    import { addUser, type Users } from '../service/userService.ts';
    import { useAuthStore } from '../store/authStore.ts';
    import { activityLogService } from '../service/activityLogService.ts';
import { useUserStore } from '../store/userStore.ts';
    // state

    // form state
    const isFormOpen = ref<boolean>(false);
    // form input state
    const nameAdd = ref('');
    const departAdd = ref<number | null>(null);
    const posAdd = ref<number | null>(null);
    const activeAdd = ref<boolean>();
    const emailAdd = ref<string>('');
    // activity log use
    const useAuth = useAuthStore();
    const { currentUser } = storeToRefs(useAuth);

    // Props
    const props = defineProps<{
        mode: 'add' | 'edit'
        User?: Users
    }>()

    // department state
    const departmentStore = useDepartmentStore();
    const { departmentList } = storeToRefs(departmentStore);
    const positionStore = usePositionStore();
    const { positionList } = storeToRefs(positionStore);
    const userStore = useUserStore();


    const filteredDepartment = computed(()=>{
        return positionList.value.filter(
            pos => pos.departmentId === departAdd.value
        );
    });

    const emit = defineEmits<{
        (e: "save", data:any): void;
    }>();

const savedUser = async () => {
    const newUser = {
        fullname: nameAdd.value,
        email: emailAdd.value,
        departmentId: departAdd.value,
        positionId: posAdd.value,
        active: activeAdd.value,
    };

    const saveAddLog = {
        user: currentUser.value.username,
        action: "USER ADD",
        module: "USERS",
        description: `${currentUser.value.username} Added New User ${newUser.fullname}`
    };

    await addUser(newUser);
    await userStore.userCall();
    await activityLogService.saveLog(saveAddLog);
    

    emit("save", newUser);      

    isFormOpen.value = false;
}



</script>