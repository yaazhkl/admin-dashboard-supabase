<template>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Employee List</h1>
        <p class="text-gray-500 text-sm">
          Manage semua karyawan yang terdaftar.
        </p>
      </div>

      <div class="">
        <UserFormModal
        mode="add"
        @save="addUser" />
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="flex flex-col md:flex-row gap-4 justify-between mb-5">

      <input
        type="text"
        placeholder="Search user..."
        class="border rounded-lg px-4 py-2 w-full md:w-80 outline-none focus:ring-2 focus:ring-blue-500" v-model="searchUserInput"
      />

      <div class="w-full md:w-auto flex flex-col sm:flex-row gap-3">


        <select
          class="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" v-model="selectActiveInput"
        >
          <option value="All Status">All Status</option>
          <option :value="true">Active</option>
          <option :value="false">Inactive</option>
        </select>

        
        <select
          class="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" v-model="selectDepartInput"
        >
          <option>All Departments</option>
          <option :value="department.id" v-for="department in departmentList">{{ department.name }}</option>
        </select>
      </div>

    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">

      <table class="w-full text-left border-collapse">

        <thead class="bg-sky-50">
          <tr>
            <th class="p-4">Name</th>
            <th class="p-4">Email</th>
            <th class="p-4">Department</th>
            <th class="p-4">Position</th>
            <th class="p-4">Status</th>
            <th class="p-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>

          <tr class="border-t bg-sky-50 hover:bg-gray-50" v-for="user in paginatedUsers" :key="user.id">
            <td class="p-4">{{ user.fullname }}</td>
            <td class="p-4">{{ user.email }}</td>
            <td class="p-4">{{ user.departmentName}}</td>
            <td class="p-4">{{ user.positionName}}</td>
            <td class="p-4">
              <span class=" px-3 py-1 rounded-full text-sm" :class="user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ getUserStatus(user.active)}}
              </span>
            </td>
            <td class="p-4">
              <div class="flex justify-center gap-2">
                <button
                class="bg-orange-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-orange-700"
                @click="editingUser = user"
              >
                Edit
              </button>

                <button class="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-700"  @click="deletingUser = user">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Overlay delete  -->

      <Transition name="fade">
        <div class="fixed inset-0 bg-black/40 z-40" v-if="deletingUser">
        </div>
      </Transition>

      <!-- overlay edit -->
      <Transition name="fade">
        <div class="fixed inset-0 bg-black/40 z-40" v-if="editingUser">
        </div>
      </Transition>
                

      <!-- Popup Modal -->
      <Transition name="modal">
        <ModalPopup 
        v-if="deletingUser"
        title-modal="Delete User?"
        paragraph="Kamu Akan Menghapus User Ini Selamanya!" button-cancel="Remove" @confirm="removeUser(deletingUser.id)" @cancel="deletingUser = null"></ModalPopup>
      </Transition>

      <!-- Edit Transition -->
      <Transition name="modal">
        <UserEdit
        v-if="editingUser"
        :user="editingUser"
        @save="handleSave"
        @cancel="editingUser = null"
      />
      </Transition>

    </div>

    <!-- Pagination -->
    <div class="flex justify-end items-center mt-5">

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
    import { storeToRefs } from 'pinia';
    import { useUserStore } from '../store/userStore';
    import { onMounted } from 'vue';
    import { useDepartmentStore } from '../store/departmentStore';
    import { usePositionStore } from '../store/positionStore';
    import { ref, computed} from 'vue';
    import UserFormModal from './UserFormModal.vue';
    import { addUser, deleteUser} from '../service/userService.ts';
    import ModalPopup from './ModalPopup.vue';
    import UserEdit from './UserEdit.vue';
    import type { UserTable } from '../types/user.ts';
    import { useAuthStore } from '../store/authStore.ts';
    import { activityLogService } from '../service/activityLogService.ts';
    


    const userStore = useUserStore();
    const departmentStore = useDepartmentStore();
    const positionStore = usePositionStore();
    const  { userList } = storeToRefs(userStore);
    const { departmentList } = storeToRefs(departmentStore);
    const { positionList } = storeToRefs(positionStore);
  

    // for activity log use
    const useAuth = useAuthStore();
    const { currentUser } = storeToRefs(useAuth);

    // Filter Reactive
    const searchUserInput = ref('');
    const selectDepartInput = ref<any>('All Departments');
    const selectActiveInput = ref<any>('All Status');

    // boolean state
    const editingUser = ref<UserTable | null>(null)
    const deletingUser = ref<UserTable | null>(null)

    // Watch filter
    const filterUser = computed(()=>{
      return userRelation.value.filter(user => {
        const matchingSearch = searchUserInput.value === '' || user.fullname.toLowerCase().includes(searchUserInput.value.toLowerCase()) || user.departmentName.toLowerCase().includes(searchUserInput.value.toLowerCase()) || user.positionName.toLowerCase().includes(searchUserInput.value.toLowerCase())
        
        const matchingRole = selectDepartInput.value  === 'All Departments' || user.departmentId === selectDepartInput.value

        const matchingActive = selectActiveInput.value === 'All Status' || user.active === selectActiveInput.value

        return matchingSearch && matchingRole && matchingActive
      });
    });

    const removeUser = async(id: number | string)=>{
      const numericId = typeof id === 'string' ? Number(id) : id;
      try{
        await deleteUser(numericId);
        await userStore.userCall(); // refresh list
        const saveEditLog = {
            user : currentUser.value.username,
            action : "USER DELETE",
            module : "USERS",
            description : `${currentUser.value.username} Deleted User ${deletingUser.value?.fullname} `
        }
        await activityLogService.saveLog(saveEditLog);
      }catch(error){
         console.error('Gagal menghapus user:', error);
      }finally{
        deletingUser.value = null;
      }
    }

  
    const getUserStatus = (status: boolean)=>{
      return status ? 'Aktif' : 'Non-aktif'
    }

    const userRelation = computed<UserTable []>(()=>{
      return userList.value.map((user)=>{
        const matchedDepartment = departmentList.value.find(department =>
          department.id === user.departmentId
        );
        const matchedPosition = positionList.value.find(position =>
          position.id === user.positionId
        );

        return{
          ...user,
          departmentName : matchedDepartment ? matchedDepartment.name : 'Unknown Department',
          positionName : matchedPosition ? matchedPosition.name : 'Unknown Position',
        }
      })
    });

    // Paginated Section
    
    // Pagination State
    const currentPage = ref(1);
    const itemsPerPage = 5;

    // Pagination Action
    const paginatedUsers = computed(()=>{
      const start = (currentPage.value - 1)*itemsPerPage;
      const end = start + itemsPerPage;

      return filterUser.value.slice(start, end);
    });

    const totalPages = computed(()=>{
      return Math.ceil(userRelation.value.length / itemsPerPage);
    });



    // Pagination Page Action
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


    const handleSave = async () => {

    await userStore.userCall();

    editingUser.value = null

    }


 
    onMounted(async()=>{
        await userStore.userCall();
        console.log(userStore.userList);
        await departmentStore.departmentCall();
        console.log(departmentStore.departmentList);
        await positionStore.positionCall();
        
    })
</script>