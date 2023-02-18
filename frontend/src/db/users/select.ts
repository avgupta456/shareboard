import { Session, SupabaseClient } from "@supabase/supabase-js";

import User from "./type";

export const selectUser = async (
  supabase: SupabaseClient,
  session: Session,
  retry: boolean = false
): Promise<User> => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    console.log(error);
    return null;
  }

  if (data.length === 0) {
    const { error } = await supabase.from("users").insert([
      {
        user_id: session.user.id,
      },
    ]);

    if (error) {
      console.log(error);
      return null;
    }

    if (!retry) {
      return selectUser(supabase, session, true);
    } else {
      console.log("Something went wrong");
      return null;
    }
  }

  return data[0];
};
