<template>
    <div class="w-full py-5 px-3 my-4 items-center justify-center bg-sky-900 rounded-xl text-white text-center">
        <div class="flex items-center justify-center gap-4">
            <p class="font-bold text-2xl">Account</p>
            <CircleUserRound class="w-10 h-10 text-white"/>
        </div>
    </div>
    <div class="items-center justify-center  gap-8 flex flex-col md:flex-row">
        <!-- left side -->
        <div class="bg-white flex flex-col h-[600px] items-center w-full justify-center rounded-xl shadow-xl py-4 px-6">
            <div class="bg-sky-900 w-42 h-42 rounded-full items-center flex flex-col justify-center my-4">
                <div class="">
                    <p class="text-white text-[4rem]">{{ currentUser?.username?.charAt(0).toUpperCase() }}</p>
                </div>
            </div>
            <div class="flex items-center justify-center gap-2">
                <p class="text-2xl font-bold">{{ currentUser.name }}</p>
                
            </div>
            <div class="flex items-center justify-center p-3 gap-2">
                <div class="bg-green-500 w-4 h-4 rounded-full"></div>
                 <p>Active</p>
            </div>
            <div class="w-full">
                    <p class="text-2xl font-bold w-full py-4 text-center">Last Login</p>
                <div class="" v-for="(login, index) in lastLogin" :key="index">
                    <div class="border-4  shadow-2xl w-full p-2 my-2 w-full rounded-xl">
                        <p class="text-center text-xl">{{ formDate(login) }}</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- right side -->
        <div class="bg-white flex flex-col items-center w-full justify-center rounded-xl shadow-xl py-4 px-6 h-[600px]">
            <div class=" h-32">
                <div class="flex items-center justify-between gap-4">
                    <p class="text-2xl font-bold w-full py-4 text-center">Account Information</p>
                    <User class="w-12 h-12 font-black"/>
                </div>
            </div>
            <div class="w-full flex text-white flex-col items-center justify-center gap-8">
                <div class="bg-sky-900 w-full shadow-xl px-4 py-5 rounded-xl">
                    <div class="flex items-center justify-between">
                        <p class="text-xl font-bold">Name</p>
                        <User class="w-8 h-8 font-black"/>
                    </div>
                    <div class="">
                        <p>{{ currentUser.name}}</p>
                    </div>
                </div>
                <div class=" bg-sky-900 shadow-xl w-full px-4 py-5 rounded-xl">
                    <div class="flex items-center justify-between">
                        <p class="text-xl font-bold">Email</p>
                        <Mail class="w-8 h-8 font-black"/>
                    </div>
                    <div class="">
                        <p>{{ currentUser.email}}</p>
                    </div>
                </div>
                <div class="bg-sky-900 shadow-xl w-full px-4 py-5 rounded-xl">
                    <div class="flex items-center justify-between">
                        <p class="text-xl font-bold">Role</p>
                        <BriefcaseBusiness class="w-8 h-8 font-black "/>
                    </div>
                    <div class="">
                        <p>{{ currentUser.role}}</p>
                    </div>
                </div>
                <div class="">
                    <AccountChange v-if="currentUser" :admin="currentUser"/>
                </div>
            </div>
        </div>
    </div>
    <div class="bg-white flex flex-col items-center w-full justify-center rounded-xl shadow-xl my-4 py-4">
        <ActivityAccount/>
    </div>
</template>
<script setup lang="ts">
    import { useAuthStore } from '../store/authStore';
    import { storeToRefs } from 'pinia';
    import {  computed, onMounted } from 'vue';
    import { useLogActivityStore } from '../store/activityLogStore';
    import AccountChange from './AccountChange.vue';
    import ActivityAccount from './ActivityAccount.vue';
    import { User } from 'lucide-vue-next';
    import { Mail } from 'lucide-vue-next';
    import { BriefcaseBusiness } from 'lucide-vue-next';
    import { CircleUserRound } from 'lucide-vue-next';

    // state
    const useAuth = useAuthStore();
    const useLog = useLogActivityStore();
    const { currentUser } = storeToRefs(useAuth);
    const { activityLogList } = storeToRefs(useLog);


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
    

    const lastLogin = computed(() => {
        const userAdmin = currentUser.value?.username;

        if (!userAdmin) return [];

        return activityLogList.value
            .filter(log =>
                log.user === userAdmin &&
                log.action === "LOGIN"
            )
            .map(log => log.created_at)
            .slice()
            .reverse()
            .slice(0,3);
    });

    onMounted(async()=>{
        await useLog.activityLogCall();
    })
</script>