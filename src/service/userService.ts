import { supabase } from "../lib/supabase";

export interface Users {
    id: string;
    name: string;
    departmentId: number;
    positionId: number;
    createdBy: number;
    active: boolean;
}

export const userService = {
    async getUser() {

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .order("id");

        if (error) {
            console.error(error);
            return [];
        }

        return data;
    }
}

export const addUser = async (data: any) => {
    const { error } = await supabase
        .from("users")
        .insert(data);

    if (error) throw error;
}

export const updateUser = async (id: number, data: any) => {
    const { error } = await supabase
        .from("users")
        .update(data)
        .eq("id", id);

    if (error) throw error;
}

export const deleteUser = async (id: number) => {
    const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

    if (error) throw error;
}