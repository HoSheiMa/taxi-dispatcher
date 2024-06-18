import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rcilzvbuajzdynxssyny.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjaWx6dmJ1YWp6ZHlueHNzeW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4NTUyNTQsImV4cCI6MjAzMjQzMTI1NH0.doMaTqYcB08sVnhlNPBNhcQw9Awhb30sTqS5LCiT-Zc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
