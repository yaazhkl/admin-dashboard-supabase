<template>
    <div class="">

        <div class="flex items-center justify-between mb-6">
            <div class="">
                <h1 class="text-2xl font-bold">Department</h1>
                <p class="text-gray-500 text-sm">
                Manage semua department yang terdaftar</p>
            </div>
            <div class="">
                <DepartmentAdd/>
            </div>
        </div>

        <div class="">
            <DeparmentCard />
        </div>

        <div class="overflow-x-auto rounded-lg shadow mt-8">
            
            <table class="w-full text-left border-collapse">
                <thead class="bg-sky-50">
                    <tr>
                        <th class="p-4">Department</th>
                        <th class="p-4">Total Employes</th>
                        <th class="p-4">Total Position</th>
                        <th class="p-4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t bg-sky-50  hover:bg-gray-50" v-for="department in departmentFilter" :key="department.id">
                        <td class="p-4">{{ department.name }}</td>
                        <td class="p-4">{{ department.employeeCount }}</td>
                        <td class="p-4">{{ department.positionCount }}</td>
                        <td class="p-4 flex justify-center gap-2 text-center "><button class="bg-orange-500 hover:bg-red-700 text-white rounded px-3 py-1 cursor-pointer" @click="editingDepartment = department">Edit</button>

                        <button class="bg-red-500 hover:bg-red-700 text-white rounded px-3 py-1 cursor-pointer" @click="deletingDepartment = department">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
    <!-- Overlay Delete -->
        <Transition name="fade">
            <div class="fixed inset-0 bg-black/40 z-40" v-if="deletingDepartment">
            </div>
        </Transition>

        <!-- Overlay Edit -->
        <Transition name="fade">
            <div class="fixed inset-0 bg-black/40 z-40" v-if="editingDepartment">
            </div>
        </Transition>

        <!-- Delete Transition -->
        <Transition name="modal">
            <ModalPopup  v-if=deletingDepartment title-modal="Hapus Posisi Ini?" paragraph="Ini akan menghapus data selamanya!" @confirm="deleteDepart(deletingDepartment.id)" @cancel="deletingDepartment = null"/>
        </Transition>

        <!-- Edit Transition -->
        <Transition name="modal">
            <DepartmentEdit
            v-if="editingDepartment"
            :department="editingDepartment"
            @save="handleSave"
            @cancel="editingDepartment = null"
            />
        </Transition>
        </div>
    </div>

</template>
<script setup lang="ts">
    import DeparmentCard from './DeparmentCard.vue';
    import { useDepartmentStore } from '../store/departmentStore';
    import { storeToRefs } from 'pinia';
    import { computed, onMounted, ref } from 'vue';    
    import type { DepartmentTable } from '../types/user.ts';
    import { useUserStore } from '../store/userStore.ts';
    import { usePositionStore } from '../store/positionStore.ts';
    import DepartmentAdd from './DepartmentAdd.vue';
    import { deleteDepartment } from '../service/departmentService.ts';
    import ModalPopup from './ModalPopup.vue';
    import DepartmentEdit from './DepartmentEdit.vue';
    import { useAuthStore } from '../store/authStore.ts';
    import { activityLogService } from '../service/activityLogService.ts';

    // state
    const useDepartment = useDepartmentStore();
    const useUser = useUserStore()
    const usePosition = usePositionStore()
    const { departmentList } = storeToRefs(useDepartment);
    const {userList} = storeToRefs(useUser);
    const {positionList} = storeToRefs(usePosition);
    const deletingDepartment = ref<DepartmentTable | null>(null);
    const editingDepartment = ref<DepartmentTable | null>(null);
 
    // for activity log use
    const useAuth = useAuthStore();
    const { currentUser } = storeToRefs(useAuth);
    
    // action
    const departmentFilter = computed<DepartmentTable []>(()=>{
        return departmentList.value.map((depart)=>{
            const employeeCount = userList.value.filter(user => user.departmentId === depart.id).length
            const positionCount = positionList.value.filter(pos => pos.departmentId === depart.id).length

            return {
                ...depart,
                employeeCount,
                positionCount
            }
        })
    });

const deleteDepart = async (id: number) => {
    try {
        await deleteDepartment(id);

        const saveEditLog = {
            user: currentUser.value.username,
            action: "DEPARTMENT DELETE",
            module: "DEPARTMENTS",
            description: `${currentUser.value.username} Deleted ${deletingDepartment.value?.name} Department`
        };

        await activityLogService.saveLog(saveEditLog);
        await useDepartment.departmentCall();

    } catch (error) {
        console.error(error);
    } finally {
        deletingDepartment.value = null;
    }
}

    const handleSave = async()=>{
        await useDepartment.departmentCall();
        editingDepartment.value = null;
    }

    onMounted(async()=>{
        await useDepartment.departmentCall();
        await usePosition.positionCall()
        await useUser.userCall();
    })
</script>