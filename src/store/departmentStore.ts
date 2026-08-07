import { ref } from "vue";
import { departmentService } from "../service/departmentService";
import { defineStore } from "pinia";
import type { Department } from "../types/user";
export const useDepartmentStore = defineStore('department', ()=>{
    const departmentList = ref<Department []>([]);
    const departmentCall = async()=>{
        try{
            const departments = await departmentService.getDepartment();
            departmentList.value = departments;
        }catch(error){
            console.error(error)
        }
    }
    return{
        departmentCall,
        departmentList
    }
})