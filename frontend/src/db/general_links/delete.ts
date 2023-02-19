import { SupabaseClient } from "@supabase/supabase-js";

export const deleteGeneralLink = async (supabase: SupabaseClient, link: string) => {
  const { error } = await supabase.from("general_links").delete().match({ link });

  if (error) {
    console.log(error);
  }
};
