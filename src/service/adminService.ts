import { supabase } from "../lib/supabase";

export const adminService = {
    async changeAdmin(id: number, data: any){
        const { data: updatedAdmin, error } = await supabase
            .from("admins")
            .update(data)
            .eq("id", id)
            .select()
            .single();

        if(error) throw error;

        return updatedAdmin;
    }
}