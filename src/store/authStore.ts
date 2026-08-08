import { defineStore } from "pinia";
import { ref } from "vue";
import { authService } from "../service/authService";
import { activityLogService } from "../service/activityLogService";

export const useAuthStore = defineStore('auth', ()=>{
    const savedUser = localStorage.getItem('currentUser');

    const currentUser = ref(
    savedUser ? JSON.parse(savedUser) : null
    );
    const login = async (username : string, password: string)=>{
        const users = await authService.login({
            username,
            password,
        });
        if(users.length ===0){
            return false;
        }
        currentUser.value = users[0];
        localStorage.setItem('currentUser', JSON.stringify(users[0]));

        const saveLogin = {
            user: currentUser.value.username,
            action: "LOGIN",
            module: "AUTH",
            description: `Login as ${currentUser.value.username}`
        }

        try {
            await activityLogService.saveLog(saveLogin);
        } catch (error) {
            console.error("Failed to save activity log:", error);
        }

        return true;
    }

    const logout = () => {
        currentUser.value = null;         // ✅ set via .value
        localStorage.removeItem('currentUser');
    };

    return{

        currentUser,
        login,
        logout,
    }
})