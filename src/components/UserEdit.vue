<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-lg">

                <!-- Header -->
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-slate-800">
                        Edit User
                    </h2>
                    <p class="text-sm text-slate-500">
                        Update the user informatioin below.
                    </p>
                </div>

                <!-- Form -->
                <form @submit.prevent="" class="space-y-4">
                <!-- Name -->
                <div>
                    <label class="block mb-1 text-sm font-medium">
                    Name
                    </label>
                    <input
                    type="text"
                    class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="nameEdit"
                    />
                </div>

                <!-- Email -->
                <div>
                    <label class="block mb-1 text-sm font-medium">
                    Email
                    </label>
                    <input
                    type="text"
                    class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="emailEdit"
                    />
                </div>


                <!-- Department -->
                <div>
                    <label class="block mb-1 text-sm font-medium">
                    Department
                    </label>
                    <select
                    class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="departEdit"
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
                    class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="posEdit"
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
                    class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="activeEdit"
                    >
                    <option :value="true">Aktif</option>
                    <option :value="false">Non-Aktif</option>
                    </select>
                </div>
                <div class="flex justify-end gap-2 mt-5">

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
                        hover="bg-sky-600" @click="savedUser"
                    />
                </div>
                </form>
            </div>
        </div>
</template>
<script setup lang="ts">
    import Button from './Button.vue';
    import type {User} from '../types/user.ts';
    import { useDepartmentStore } from '../store/departmentStore.ts';
    import { storeToRefs } from 'pinia';
    import { usePositionStore } from '../store/positionStore.ts';
    import { ref, computed, watch,  } from 'vue';
    import { updateUser } from '../service/userService.ts';
    import { useAuthStore } from '../store/authStore.ts';
    import { activityLogService } from '../service/activityLogService.ts';
    // state
    const nameEdit = ref('');
    const departEdit = ref<number | null>(null);
    const posEdit = ref<number | null>(null);
    const activeEdit = ref<boolean>();
    const emailEdit = ref<string>('');

    // for activity log use
    const useAuth = useAuthStore();
    const { currentUser } = storeToRefs(useAuth);

    // department state
    const departmentStore = useDepartmentStore();
    const { departmentList } = storeToRefs(departmentStore);
    const positionStore = usePositionStore();
    const { positionList } = storeToRefs(positionStore);

    const filteredDepartment = computed(()=>{
        return positionList.value.filter( pos => pos.departmentId === departEdit.value);
    });

    const savedUser = async()=>{
        const editUser = {
            fullname: nameEdit.value,
            email : emailEdit.value,
            departmentId: departEdit.value,
            positionId : posEdit.value,
            active : activeEdit.value
        }
        console.log(editUser);
        const saveEditLog = {
            user : currentUser.value.username,
            action : "USER EDIT",
            module : "USERS",
            description : `${currentUser.value.username} Edited User ${editUser.fullname}`
        }
        await updateUser(props.user.id, editUser);
        await activityLogService.saveLog(saveEditLog);
        console.log("savelog berhasil");
        emit("save");
    }

    const props = defineProps<{
        user: User
    }>();

    const emit = defineEmits<{
        (e:'save'):void
        (e:'cancel'):void
    }>();

    const closeModal = () => {

        emit("cancel")
    }

    watch(
    () => props.user,
    (user) => {

        nameEdit.value = user.fullname
        emailEdit.value = user.email
        departEdit.value = user.departmentId
        posEdit.value = user.positionId
        activeEdit.value = user.active

    },
    {
        immediate:true
    }
    )


</script>