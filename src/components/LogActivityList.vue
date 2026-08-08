<template>
    <div class="">
    </div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div class="">
            <h1 class="text-2xl font-bold">Activity Log</h1>
            <p class="text-gray-500 text-sm">Semua Aktivitas Tercatat Di sini</p>
        </div>
        <div class="">
        </div>
    </div>

    <!-- Search & Filter -->
    <div class="flex flex-col md:flex-row gap-4 justify-between mb-5">
        <input
            type="text"
            placeholder="Search Position..."
            class="border rounded-lg px-4 h-10 w-full md:w-80 outline-none focus:ring-2 focus:ring-blue-500"        v-model="searchActivity"
        />

        <div class="w-full md:w-auto flex flex-col lg:flex-row gap-3">
            <select
                class="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" v-model="moduleFilter"
                >
                <option value="">All Module</option>\
                <option :value="log" v-for="log in moduleMap">{{ log }}</option>
            </select>

            <select
                class="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" v-model="actionFilter"
                >
                <option value="">All Action</option>\
                <option :value="log" v-for="log in actionMap">{{ log }}</option>
            </select>

            <select
                class="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" v-model="newestOldest"
                >
                <option value="">Newest</option>
                <option value="oldest">Oldest</option>
            </select>
        </div>
    </div>

    <!-- table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="w-full text-left border-collapse">
            <thead class="bg-sky-50">
                <tr>
                    <th class="p-4">Date Time</th>
                    <th class="p-4">User</th>
                    <th class="p-4">Action</th>
                    <th class="p-4">Modul</th>
                    <th class="p-4">description</th>
                    <th class="p-4">Action</th>
                </tr>
            </thead>

            <tbody>
                <tr class="border-t bg-sky-50 hover:bg-gray-50" v-for="log in paginatedLog" :key="log.id">
                    <td class="p-4">{{ formDate(log.created_at) }}</td>
                    <td class="p-4">{{ log.user }}</td>
                    <td class="p-4"> {{ log.action }}</td>
                    <td class="p-4">{{ log.module }}</td>
                    <td class="p-4"> {{ log.description }} </td>
                    <td>
                        <button class="bg-red-500 hover:bg-red-700 text-white rounded px-3 py-1 cursor-pointer" @click="deletingLog = log">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>

                <!-- Overlay Delete -->
        <Transition name="fade">
            <div class="fixed inset-0 bg-black/40 z-40" v-if="deletingLog">
            </div>
        </Transition>

                <!-- Delete Transition -->
        <Transition name="modal">
            <DeleteNotif  v-if=deletingLog title-modal="Hapus Log Ini?" paragraph="Ini akan menghapus data selamanya!" @confirm="deleteLog(deletingLog?.id)" @cancel="deletingLog = null"/>
        </Transition>
    </div>

    <div class="flex justify-end items-center mt-5">
    <div class="flex items-center">
        <div class="px-3">
          <button
          :class="'px-5  py-2 border-2 rounded bg-sky-600 hover:bg-sky-900 text-white hover:text-white cursor-pointer' "
          @click="currentPage--"
          :disabled="currentPage === 1">Prev</button>
        </div>
        <div class="px-3 flex items-center">
          <button
          :class="'px-5  py-2 border-2 rounded bg-sky-600 hover:bg-sky-900 text-white cursor-pointer' "
          @click="currentPage++"
          :disabled="currentPage === totalPages">Next</button>
        </div>
      </div>
    </div>

</template>
<script setup lang="ts">
    import { useLogActivityStore } from '../store/activityLogStore';
    import { storeToRefs } from 'pinia';
    import { onMounted, ref, computed  } from 'vue';
    import type { ActivityLog } from '../types/user';
    import DeleteNotif from './DeleteNotif.vue';
    import { activityLogService } from '../service/activityLogService.ts';
import { useDepartmentStore } from '../store/departmentStore.ts';
import { usePositionStore } from '../store/positionStore.ts';
import { useUserStore } from '../store/userStore.ts';

    // state
    const useLog = useLogActivityStore();
    const useDepart = useDepartmentStore()
    const usePosition = usePositionStore();
    const useUser = useUserStore();
    const { activityLogList } = storeToRefs(useLog);
    const deletingLog = ref<ActivityLog | null>(null);
    const searchActivity = ref<string>('');
    const moduleFilter = ref('');
    const actionFilter = ref('');
    const newestOldest = ref<string>('')

    // format date to WIB:
    const formDate = (dateString : string | Date)=>{
        if (!dateString) return '-';

        const date =  new Date(dateString);

        const formatter = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Jakarta'
        });

        return `${formatter.format(date)} WIB`;
    }

    const deleteLog = async(id : any)=>{
        await activityLogService.deleteLog(id);
        await useDepart.departmentCall();
        await usePosition.positionCall();
        await useUser.userCall();
        await useLog.activityLogCall();
        deletingLog.value = null;
    }

    

    // filtered log

    const filteredLog = computed(()=>{
        return activityLogList.value.filter((log)=>{
            const matchesSearch = searchActivity.value === '' || log.module.toLowerCase().includes(searchActivity.value?.toLowerCase()) || log.action.toLowerCase().includes(searchActivity.value.toLowerCase()) || log.description.toLowerCase().includes(searchActivity.value.toLowerCase());

            const matchesTime = activityLogList.value.sort((a, b)=>{
                const idA = Number(a.id);
                const idB = Number(b.id);

                if(newestOldest.value === 'oldest'){
                    return idA - idB;
                }else{
                    return idB - idA
                }
            });


            const matchesModule = !moduleFilter.value || log.module === moduleFilter.value;

            const matchesAction = !actionFilter.value || log.action === actionFilter.value;


            return matchesSearch && matchesTime && matchesModule && matchesAction
            
        });
    });


    // paginated 
    const currentPage = ref<number>(1);
    const itemsPerPage : number = 5;

    const paginatedLog = computed(()=>{
        const start = (currentPage.value - 1)* itemsPerPage;

        const end = start + itemsPerPage;
        
        return filteredLog.value.slice(start, end)
    });

    const moduleMap = computed(()=>{
        return [...new Set(activityLogList.value.map(log => log.module))];
    });

    const actionMap = computed(()=>{
        return [...new Set(activityLogList.value.map(log=>log.action))];
    })

    const totalPages = computed(()=>{
        return Math.ceil(filteredLog.value.length / itemsPerPage);
    })


    onMounted(async()=>{
        await useDepart.departmentCall();
        await usePosition.positionCall();
        await useUser.userCall();
        await useLog.activityLogCall();
    })
</script>