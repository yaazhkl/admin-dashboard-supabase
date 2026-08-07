<template>
    <div class="w-full">
        <div class="text-center font-bold text-2xl">
            <p>Recent Account Activity</p>
        </div>
        <div class="px-4 flex items-center justify-center">
            <div class="" >
                <div class="w-full p-2 my-4 w-full rounded-xl" v-for="log in recentActivity">
                    <p class="text-center text-xl">{{formDate(log.created_at)}} - {{ log.action }} - {{  log.module }} - {{ log.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { useAuthStore } from '../store/authStore';
    import { storeToRefs } from 'pinia';
    import { onMounted, computed } from 'vue';
    import { useLogActivityStore } from '../store/activityLogStore';

    
    // state
    const useAuth = useAuthStore();
    const useLog = useLogActivityStore();
    const {currentUser} = storeToRefs(useAuth);
    const { activityLogList } = storeToRefs(useLog);

 
    const recentActivity = computed(() => {
        return activityLogList.value
            .filter(log => log.user === currentUser.value?.username)
            .sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .slice(0, 3);
    });

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
    
    onMounted(async()=>{
        await useLog.activityLogCall();
        console.log(recentActivity);
    })
</script>