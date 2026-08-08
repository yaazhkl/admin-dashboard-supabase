<template>
    <div class="min-h-screen bg-sky-50">
        <AppSidebar 
        :isOpen="isSidebarOpen"
        @logout="handleLogout"
        @close="isSidebarOpen = false"/>

        <div class="transition-all duration-300 ease-in-out min-h-screen"
            :class="isSidebarOpen ? 'md:pl-64' : 'md:pl-0'"
        >
      
        <AppNavbar :user-name="currentUser.name" @toggle-sidebar="handleTogglebar" @logout="handleLogout" :isOpen="isSidebarOpen"/>
      <main class="p-6 md:p-8">
        <h2 class="text-2xl font-bold text-slate-900">
          Selamat datang, {{ currentUser.name }} 👋
        </h2>
        <p class="text-slate-500 mt-1">Berikut Merupakan Ringkasan Data-Data Terkini.</p>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
          <div class="bg-sky-900 rounded-xl border border-slate-200 p-5 shadow-sm">
            <p class="text-sm text-white">Total Employee</p>
            <div class="flex items-center justify-between">
              <p class="text-3xl font-bold text-white mt-1">{{ totalUser }} Employees</p>
              <Users class="w-8 h-8 text-white mt-1" />
            </div>
          </div>
          <div class="bg-sky-900 rounded-xl border border-slate-200 p-5 shadow-sm">
            <p class="text-sm text-white">Total Department</p>
            <div class="flex items-center justify-between">
              <p class="text-3xl font-bold text-white mt-1">{{ totalDepart }} Departments</p>
              <Building2 class="w-8 h-8 text-white mt-1" />
            </div>
          </div>
          <div class="bg-sky-900 rounded-xl border border-slate-200 p-5 shadow-sm">
            <p class="text-sm text-white">Total Position</p>
            <div class="flex items-center justify-between">
              <p class="text-3xl font-bold text-white mt-1">{{ totalPos }} Positions</p>
              <Briefcase class="w-8 h-8 text-white mt-1" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <DashboardBarChart />
          <DashboardPieChart />
        </div>
      </main>
    </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import AppSidebar from '../components/AppSidebar.vue';
import { onMounted, ref, computed } from 'vue';
import AppNavbar from '../components/AppNavbar.vue';
import { Users } from 'lucide-vue-next';
import { Briefcase } from 'lucide-vue-next';
import { Building2 } from 'lucide-vue-next';

import { useUserStore } from '../store/userStore.ts';
import { useDepartmentStore } from '../store/departmentStore.ts';
import { usePositionStore } from '../store/positionStore.ts';
import DashboardBarChart from '../components/DashboardBarChart.vue';
import DashboardPieChart from '../components/DashboardPieChart.vue';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const departStore = useDepartmentStore();
const positionStore = usePositionStore();
const isSidebarOpen = ref(window.innerWidth >= 768);


// ✅ storeToRefs agar currentUser reaktif di template
const { currentUser } = storeToRefs(authStore);
const { userList } = storeToRefs(userStore);
const { departmentList } = storeToRefs(departStore);
const { positionList } = storeToRefs(positionStore);




const handleTogglebar = ()=>{
  isSidebarOpen.value = !isSidebarOpen.value;
}

const totalUser = computed(()=>{
  return  userList.value.map((user)=>
  user.id).length
});

const totalDepart = computed(()=>{
  return departmentList.value.map((depart)=>
  depart.id).length
});

const totalPos = computed(()=>{
  return positionList.value.map((pos)=>
  pos.id).length
})

const handleLogout = () => {
    authStore.logout();              
    router.push({ name: 'Login' });
};


onMounted(async()=>{
  await userStore.userCall();
  await departStore.departmentCall();
  await positionStore.positionCall();
})

</script>