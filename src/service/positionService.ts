import { supabase } from "../lib/supabase";

export const positionService = {
    async getPosition() {
        const { data, error } = await supabase
            .from("positions")
            .select("*")
            .order("id");

        if (error) {
            console.error(error);
            return [];
        }

        return data;
    }
}

export const addPosition = async (data: any) => {
    const { error } = await supabase
        .from("positions")
        .insert(data);

    if (error) throw error;
}

export const deletePosition = async (id: number) => {
    const { error } = await supabase
        .from("positions")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

export const editPosition = async (id: number, data: any) => {
    const { error } = await supabase
        .from("positions")
        .update(data)
        .eq("id", id);

    if (error) throw error;
}