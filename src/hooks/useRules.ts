import { supabase } from "@/integrations/supabase/client";
import { useSupabaseQuery } from "./useSupabaseQuery";

export interface Rule {
  id: string;
  title: string;
  description: string;
  area?: string[];
  discipline?: string;
  skill?: string;
  created_at?: string;
  updated_at?: string;
}

export function useRules() {
  return useSupabaseQuery<Rule>({
    queryFn: async () => {
      const result = await supabase
        .from("rules")
        .select("*")
        .order("created_at", { ascending: false });
      return result;
    },
  });
}
