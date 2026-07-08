import { Liveblocks } from "@liveblocks/node";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { serverEnv } from "@/lib/env";
import { colorFromString } from "@/lib/utils";

const ROOM_PREFIX = "workspace:";

/**
 * Liveblocks room authorization. Grants access only to members of the
 * workspace behind the room id, and read-only access to `viewer` roles.
 */
export async function POST(request: Request) {
  const secret = serverEnv().LIVEBLOCKS_SECRET_KEY;
  if (!secret) {
    return new Response("Liveblocks is not configured", { status: 501 });
  }

  const user = await getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { room } = await request.json();
  if (typeof room !== "string" || !room.startsWith(ROOM_PREFIX)) {
    return new Response("Bad request", { status: 400 });
  }
  const workspaceId = room.slice(ROOM_PREFIX.length);

  const supabase = await createClient();
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) return new Response("Forbidden", { status: 403 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const liveblocks = new Liveblocks({ secret });
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: profile?.display_name ?? user.email ?? "Anonymous",
      color: colorFromString(user.id),
      ...(profile?.avatar_url ? { avatar: profile.avatar_url } : {}),
    },
  });

  session.allow(
    room,
    membership.role === "viewer" ? session.READ_ACCESS : session.FULL_ACCESS,
  );

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
