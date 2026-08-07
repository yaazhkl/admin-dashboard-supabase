import { supabase } from "../lib/supabase";

export interface LoginPayload {
    username: string;
    password: string;
}

export const authService = {
    async login(payload: LoginPayload) {

        const { data, error } = await supabase
            .from("admins")
            .select("*")
            .match({
                username: payload.username.trim(),
                password: payload.password.trim()
            });

        if (error) {
            console.error(error);
            return [];
        }

        console.log("Login Result:", data);

        return data ?? [];
    }
}