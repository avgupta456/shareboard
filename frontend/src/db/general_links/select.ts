import { SupabaseClient } from "@supabase/supabase-js";

import GeneralLink from "./type";

export const selectGeneralLink = async (
  supabase: SupabaseClient,
  link: string
): Promise<GeneralLink> => {
  const { data, error } = await supabase.from("general_links").select("*").eq("link", link);

  if (error) {
    console.log(error);
    return null;
  }

  if (data.length === 0) {
    return null;
  }

  return data[0];
};

export const selectGeneralLinks = async (
  supabase: SupabaseClient,
  user_id: string
): Promise<GeneralLink[]> => {
  const { data, error } = await supabase.from("general_links").select("*").eq("user_id", user_id);

  if (error) {
    console.log(error);
    return null;
  }

  return data;
};
