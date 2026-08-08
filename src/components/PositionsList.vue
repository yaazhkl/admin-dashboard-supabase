<template>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div class="">
            <h1 class="text-2xl font-bold">Position</h1>
            <p class="text-gray-500 text-sm">Manage semua posisi pekerjaan</p>
        </div>
        <div class="">
            <PositionAdd />
        </div>
    </div>

    <!-- Search & Filter -->
    <div class="flex flex-col md:flex-row gap-4 justify-between mb-5">

        <input
            type="text"
            placeholder="Search Position..."
            class="border rounded-lg px-4 py-2 w-full md:w-80 outline-none focus:ring-2 focus:ring-blue-500"        v-model="searchPosition"
        />

        <div class="w-full md:w-auto flex gap-3">
            <select
            class="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" v-model="departmentFilter"
            >
            <option value="">All Departments</option>
            <option :value="department.id" v-for="department in departmentList">{{ department.name }}</option>
        </select>
        </div>

    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="w-full text-left border-collapse">

            <thead class="bg-sky-50">
                <tr>
                    <th class="p-4">Position</th>
                    <th class="p-4">Position Code</th>
                    <th class="p-4">Department</th>
                    <th class="p-4 text-center">Employee Count</th>
                    <th class="p-4 flex items-center justify-center">Action</th>
                </tr>
            </thead>

            <tbody>
                <tr class="border-t bg-sky-50 hover:bg-gray-50" v-for="position in paginatedPosition" :key="position.id"> 
                    <td class="p-4">{{ position.name }}</td>
                    <td class="p-4">{{ position.code }}</td>
                    <td class="p-4">{{ position.departmentName }}</td>
                    <td class="p-4 text-center">{{ position.employeeCount }}</td>
                    <td class="p-4 flex items-center justify-center gap-4">
                        <button class="bg-orange-500 hover:bg-orange-700 text-white rounded px-3 py-1 cursor-pointer" @click="editingPosition = position">Edit</button>
                        <button class="bg-red-500 hover:bg-red-700 text-white rounded px-3 py-1 cursor-pointer" @click="deletingPosition = position">Delete</button>
                        <!-- Pop up modal -->
                    </td>
                </tr>
            </tbody>
        </table>
        
        <!-- Overlay Delete -->
        <Transition name="fade">
            <div class="fixed inset-0 bg-black/40 z-40" v-if="deletingPosition">
            </div>
        </Transition>

        <!-- Overlay Edit -->
        <Transition name="fade">
            <div class="fixed inset-0 bg-black/40 z-40" v-if="editingPosition">
            </div>
        </Transition>

        <!-- Delete Transition -->
        <Transition name="modal">
            <DeleteNotif  v-if=deletingPosition title-modal="Hapus Posisi Ini?" paragraph="Ini akan menghapus data selamanya!" @confirm="deletePos(deletingPosition.id)" @cancel="deletingPosition = null"/>
        </Transition>

        <!-- Edit Transition -->
        <Transition name="modal">
            <PositionEdit v-if="editingPosition" :position="editingPosition" @save="handleSave" @cancel="editingPosition=null"/>
        </Transition>
    </div>

    <div class="flex justify-end items-center mt-5">
        <div class=""></div>

        <div class="flex items-center">
        <div class="px-3">
          <button
          :class="'px-5  py-2 border-2 rounded bg-sky-600 hover:bg-sky-900 text-white hover:text-white cursor-pointer' "
          @click="prevPage"
          :disabled="currentPage === 1">Prev</button>
        </div>
        <div class="">
          <button v-for="page of totalPages"
          :class="[
          'px-3 py-1 rounded',
            currentPage === page ? 'bg-blue-900 text-white' : 'none'
          ]">{{ page }}</button>
        </div>
        <div class="px-3 flex items-center">
          <button
          :class="'px-5  py-2 border-2 rounded bg-sky-600 hover:bg-sky-900 text-white cursor-pointer' "
          @click="nextPage"
          :disabled="currentPage === totalPages">Next</button>
        </div>
      </div>
    </div>
</template>
<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { usePositionStore } from '../store/positionStore';
    import { storeToRefs } from 'pinia';
    import { useDepartmentStore } from '../store/departmentStore';
    import type { PositionTable } from '../types/user';
    import { useUserStore } from '../store/userStore';
    import PositionAdd from './PositionAdd.vue';
    import { deletePosition } from '../service/positionService.ts';
    import DeleteNotif from './DeleteNotif.vue';
    import PositionEdit from './PositionEdit.vue';
    import { useAuthStore } from '../store/authStore.ts';
    import { activityLogService } from '../service/activityLogService.ts';

    // state
    const usePosition = usePositionStore();
    const useDepartment = useDepartmentStore();
    const useUser = useUserStore();
    const {positionList} = storeToRefs(usePosition);
    const {departmentList} = storeToRefs(useDepartment);
    const {userList} = storeToRefs(useUser);
    const editingPosition = ref<PositionTable | null>(null);
    const deletingPosition = ref<PositionTable | null>(null);
    const searchPosition = ref<string>('');
    const departmentFilter = ref<any>('');

    // for activity log use
    const useAuth = useAuthStore();
    const { currentUser } = storeToRefs(useAuth);

    // actions
    const positionRelation = computed<PositionTable []>(()=>{
        return positionList.value.map((pos)=>{
            const matchedDepartment = departmentList.value.find((depart)=>
            depart.id === pos.departmentId);

            const employeeCount = userList.value.filter((user)=> user.positionId === pos.id).length;

            return{
                ...pos,
                departmentName : matchedDepartment?.name || 'Unassigned',
                employeeCount : employeeCount
            }
        })
    });

    // pagination
    const currentPage = ref<number>(1);
    const itemsPerPage : number = 5;

    const paginatedPosition = computed(()=>{
        const start = (currentPage.value - 1)* itemsPerPage;
        const end = start + itemsPerPage;

        return filtering.value.slice(start, end);
    });

    const totalPages = computed(()=>{
        return Math.ceil(positionRelation.value.length / itemsPerPage);
    });

        const nextPage = ()=>{
      if(currentPage.value < totalPages.value){
        currentPage.value ++
      }
    }

    const prevPage = ()=>{
      if(currentPage.value > 1){
        currentPage.value--
      }
    }

    const handleSave = async()=>{
        await usePosition.positionCall();
        editingPosition.value = null;
    }


    const deletePos = async(id : number)=>{
        const saveEditLog = {
            user : currentUser.value.username,
            action : "POSITION DELETE",
            module : "POSITIONS",
            description : `${currentUser.value.username} Deleted ${deletingPosition.value?.name} Position`
        }
        await activityLogService.saveLog(saveEditLog);
        await deletePosition(id);
        await usePosition.positionCall();
        deletingPosition.value = null;
    }

    onMounted(async()=>{
        await usePosition.positionCall();
        await useDepartment.departmentCall();
        await useUser.userCall();
    });

    const filtering = computed(()=>{
        return positionRelation.value.filter((pos)=>{
            const matchesSearch = searchPosition.value === '' || pos.name.toLowerCase().includes(searchPosition.value.toLowerCase()) || pos.code.toLowerCase().includes(searchPosition.value.toLowerCase());

            const matchesDepartment = !departmentFilter.value || pos.departmentId === departmentFilter.value;
            return matchesSearch && matchesDepartment;
        })
    })
</script>