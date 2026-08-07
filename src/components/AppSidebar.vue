<template>
    <!-- Overlay (Mobile Only, shown when sidebar open) -->
     <div 
     v-if="isOpen" 
     class="fixed inset-0 bg-black/40 z-30 md:hidden" 
     @click="emit('close')"
     />
        <aside class="fixed top-0 left-0 h-screen w-64 bg-sky-900 text-slate-200 z-40 flex flex-col transition-transform duration-300 ease-in-out" :class="isOpen ? 'translate-x-0' : '-translate-x-full'">
            <div class="flex items-center gap-2 px-6 h-16 border-b border-sky-800 shrink-0">
                <div class="w-8 h-8 rounded-lg bg-sky-400 flex items-center justify-center font-bold text-sky-900">
                    HR
                </div>
                <span class="font-semibold text-white tracking-tight">HR Management</span>
            </div>
            <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                <RouterLink v-for="item in menuItems" :key="item.path" :to="item.path" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors" :class="route.path.startsWith(item.path) ? 'bg-sky-400 text-slate-900'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'" >
                    <component
                    :is="item.icon"
                    :size="20"
                    class="w-5 h-5 shrink-0"
                    />
                    {{ item.label }}
                </RouterLink>
            </nav>
            <div class="p-4 border-t border-sky-800 shrink-0 flex items-center justify-center">
                <Button variant="full" inner-text="Logout" bg="bg-sky-900" hover="hover:bg-sky-800" @click-button="logout"/>
            </div>
        </aside>
</template>
<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import Button from './Button.vue';
    import { useRoute } from 'vue-router';
    import type { Component } from 'vue'
    import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  ScrollText,
  User
    } from 'lucide-vue-next'


    interface MenuItem {
        label : string,
        path : string,
        icon : Component
    }

    const route = useRoute();


    defineProps<{
        isOpen: boolean
    }>();

    const emit = defineEmits<{
        (e: 'close'): void
        (e: 'logout'): void
        (e: 'click') : void
  
    }>();

const logout = () => {
    emit('logout');
};


    const menuItems : MenuItem[] = [
        {label : 'Dashboard',  path : '/Dashboard', icon : LayoutDashboard},
        { label: 'Users', path: '/users', icon: Users },
        { label: 'Departments', path: '/Departments', icon:Building2 },
        { label: 'Positions', path: '/Positions', icon: Briefcase },
        { label : 'Logs', path : '/Logs', icon : ScrollText},
        { label: 'Account', path: '/Account', icon: User },
    ];


</script>