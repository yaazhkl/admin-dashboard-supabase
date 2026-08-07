<template>
    <div class="min-h-screen bg-sky-50">
        <AppSidebar 
        :isOpen="isSidebarOpen"
        @logout="handleLogout"
        @close="isSidebarOpen = false"/>

        <div class="transition-all duration-300 ease-in-out min-h-screen"
            :class="isSidebarOpen ? 'md:pl-64' : 'md:pl-0'"
        >
      
        <AppNavbar :user-name="currentUser.name" @toggle-sidebar="handleTogglebar" :isOpen="isSidebarOpen"/>
        <main class="p-6 md:p-8">
            <DepartmentsList />
        </main>
    </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import AppSidebar from '../components/AppSidebar.vue';
import { ref } from 'vue';
import AppNavbar from '../components/AppNavbar.vue';
import DepartmentsList from '../components/DepartmentsList.vue';



const router = useRouter();
const authStore = useAuthStore();
const isSidebarOpen = ref(window.innerWidth >= 768);



// ✅ storeToRefs agar currentUser reaktif di template
const { currentUser } = storeToRefs(authStore);

const handleTogglebar = ()=>{
  isSidebarOpen.value = !isSidebarOpen.value;
}


const handleLogout = () => {
    authStore.logout();              // ✅ pakai fungsi dari store
    router.push({ name: 'Login' });
};

</script>