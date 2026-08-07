<template>
    <div class=" min-h-screen bg-gradient-to-br from-sky-500 via-sky-700 to-slate-900 flex items-center justify-center">
        <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
            <form @submit.prevent="handleLogin" class="">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-slate-800">
                        Human Resource
                    </h1>
                    <p class="text-slate-500 mt-2">
                        Management System
                    </p>
                </div>
                <div class="">
                    <div class="">
                        <div class="flex justify-center mb-5">
                            <div class="bg-sky-100 p-4 rounded-full">
                                <Users class="w-10 h-10 text-sky-700"/>
                            </div>
                        </div>
                    <div class="relative">
                        <label for="">User Admin</label><br>
                        <User class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"/>
                        <input type="text" v-model="inputUsername" class="w-full pl-11 pr-4 mb-5 rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition">
                    </div>
                    </div>
                    <div class="relative">
                        <label for="">Password</label><br>
                        <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"/>
                        <input type="password" v-model="inputPassword" class="w-full pl-11 pr-4 mb-5 rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition">
                    </div>
                    <div class="py-4 text-center">
                        <button class="bg-sky-900 w-full font-semibold text-white rounded-xl transition-all
                        duration-300 py-3 cursor-pointer hover:bg-sky-500">Login</button>
                    </div>
                </div>
                <div class="">
                    <p class="text-center text-xs text-slate-900 mt-6">
                        Admin Dashboard
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '../store/authStore';
    import { Users, User, Lock } from "lucide-vue-next";
    
    // state
    const inputUsername = ref('');
    const inputPassword = ref('');

    const router = useRouter();
    const authStore = useAuthStore();

    const handleLogin = async()=>{
        console.log(inputUsername.value);
        console.log(inputPassword.value);
        const success = await authStore.login(
            inputUsername.value,
            inputPassword.value
        );

        if(success){
            router.replace({name : "Dashboard"});
        }else{
            alert("Wrong Username or Password");
        }
    }

</script>