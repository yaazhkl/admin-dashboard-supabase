import { ref } from "vue";
import { positionService } from "../service/positionService";
import { defineStore } from "pinia";
import type { Position } from "../types/user";

export const usePositionStore = defineStore("position", ()=>{
    const positionList = ref<Position []>([]);
    const positionCall = async()=>{
        try{
            const position = await positionService.getPosition();
            positionList.value = position;
        }catch(error){
            console.error(error);
        }
    }

    return{
        positionList,
        positionCall,
    }
})