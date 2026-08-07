import { defineStore } from "pinia";
import { ref } from "vue";
import type { ActivityLog } from "../types/user";
import { activityLogService } from "../service/activityLogService";

export const useLogActivityStore = defineStore('logActivity', ()=>{
    const activityLogList = ref<ActivityLog []>([]);

    const activityLogCall = async()=>{
        try{
            const response = await activityLogService.getActivityLogs();
            activityLogList.value = response;
            console.table(activityLogList.value);
        }catch(err){
            console.error(err);
        }
    }

    return {
        activityLogList,
        activityLogCall
    }
})