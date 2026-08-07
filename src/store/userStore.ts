import { defineStore } from "pinia";
import { ref } from "vue";
import { userService } from "../service/userService"
import type {User} from "../types/user.ts"


export const useUserStore = defineStore('user', ()=>{
    const userList = ref<User []>([]);
    const userCall = async ()=>{
        try {
            const users = await userService.getUser();
            userList.value = users; // Hapus 'await' yang double di sini
            
        } catch (error) {
            console.error("Gagal mengambil data user:", error);
        }
    }
    return{
        userCall,
        userList,
    }
})