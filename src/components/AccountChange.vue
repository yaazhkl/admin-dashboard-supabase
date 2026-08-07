<template>
    <div class="">
        <Button variant="default" inner-text="Change Username / Password" bg="bg-sky-900" hover="bg-sky-600" @click="openForm"></Button>
    </div>

        <!-- Overlay -->
    <Transition name="fade">
        <div class="fixed inset-0 bg-black/40 z-40" v-if="isFormOpen">
        </div>
    </Transition>

    <!-- Modal -->
    <Transition name="modal">
        <div v-if="isFormOpen" class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-lg">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-slate-800">Change Account</h2>
                </div>

                <form @submit.prevent="" class="space-y-4">
                    <div class="text-black">
                        <label class="block mb-1 text-sm font-medium">
                            Usename
                        </label>
                        <input type="text" class="w-full rounded-lg ring-black border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="username">
                    </div>
                    <div class="text-black">
                        <label class="block mb-1 text-sm font-medium">
                            Password
                        </label>
                        <input type="password" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="password">
                    </div>
                    <div class="text-black">
                        <label class="block mb-1 text-sm font-medium">
                            Name
                        </label>
                        <input type="string" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="name">
                    </div>
                    <div class="text-black">
                        <label class="block mb-1 text-sm font-medium">
                            email
                        </label>
                        <input type="email" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" v-model="email">
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
                        hover="bg-sky-600" @click="savedSecurity()"
                        />
                    </div>
                </form>
            </div>
        </div>
    
    </Transition>
</template>
<script setup lang="ts">
    import { ref, watch } from 'vue';
    import Button from './Button.vue';
    import { adminService } from '../service/adminService.ts';
    import { useAuthStore } from '../store/authStore.ts';
    import { storeToRefs } from 'pinia';
    import { activityLogService } from '../service/activityLogService.ts';
    import type { Admin } from '../types/user.ts';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const isFormOpen = ref<boolean>(false);
    const username = ref<string>();
    const password = ref<string>();
    const name = ref<string>();
    const email = ref<string>();
    const useAuth = useAuthStore();
    const { currentUser } = storeToRefs(useAuth);

    const openForm = ()=>{
        isFormOpen.value = true;
    }

    const savedSecurity = async()=>{
        const updatedAdmin = {
            username : username.value,
            password : password.value,
            name : name.value,
            email : email.value
        };

        const res = await adminService.changeAdmin(currentUser.value.id, updatedAdmin);

        if(res && res.data){
            currentUser.value = {...currentUser.value, ...res.data};
            localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
        }

        const saveAdmin = {
            user : currentUser.value.username,
            action : "ADMIN CHANGE",
            module : "ADMINS",
            description : `${currentUser.value.username} changed Username or Password`
        }

        await activityLogService.saveLog(saveAdmin);
        handleLogout();
        isFormOpen.value = false;
    }

    const props = defineProps<{
        admin : Admin
    }>();   


    watch(()=>props.admin, (admin)=>{
        username.value = admin.username
        password.value = admin.password
        name.value = admin.name
        email.value = admin.email
    },{
        immediate: true
    });

    const handleLogout = () => {
        useAuth.logout();              
        router.push({ name: 'Login' });
    };
</script>