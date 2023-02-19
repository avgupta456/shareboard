import { SupabaseClient } from "@supabase/supabase-js";

export const insertGeneralLink = async (
  supabase: SupabaseClient,
  link: string,
  user_id: string,
  conn_str: string,
  name: string
) => {
  const { error } = await supabase.from("general_links").insert([
    {
      link,
      user_id,
      conn_str,
      name,
    },
  ]);

  if (error) {
    console.log(error);
  }
};
