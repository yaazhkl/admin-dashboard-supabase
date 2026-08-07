import { supabase } from "../lib/supabase";
import type { CreateActivityLog } from "../types/user";

export const activityLogService = {
    async getActivityLogs() {
        const { data, error } = await supabase
            .from("activity_logs")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return [];
        }

        return data;
    },

    async saveLog(data: CreateActivityLog) {
        const { data: result, error } = await supabase
            .from("activity_logs")
            .insert({
                user: data.user,
                action: data.action,
                module: data.module,
                description: data.description,
                created_at: new Date().toISOString(),
            });

        if (error) {
            console.error(error);
            throw error;
        }

        return result;
    },

    async deleteLog(id: number) {
        const { error } = await supabase
            .from("activity_logs")
            .delete()
            .eq("id", id);

        if (error) {
            console.error(error);
            throw error;
        }
    },
};