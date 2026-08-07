import { supabase } from "../lib/supabase";

export const departmentService = {
    async getDepartment() {
        const { data, error } = await supabase
            .from("departments")
            .select("*")
            .order("id");

        if (error) {
            console.error(error);
            return [];
        }

        return data;
    }
}

export const addDepartment = async (data: any) => {
    const { error } = await supabase
        .from("departments")
        .insert(data);

    if (error) throw error;
}

export const deleteDepartment = async (id: number) => {
    const { error } = await supabase
        .from("departments")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

export const updateDepartment = async (id: number, data: any) => {
    const { error } = await supabase
        .from("departments")
        .update(data)
        .eq("id", id);

    if (error) throw error;
}