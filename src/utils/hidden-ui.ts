// A room can ask the client to leave out parts of the room UI, for rooms whose creator takes care of those parts
// itself (for example one that assigns avatars, or decides on its own who joins). The room says which parts in
// hub.user_data.hide_ui, an array of the names below. It is read from the hub every time, since a room's user_data
// can change while the page is open and the page can move to another room.

export type HideableUi = "invite" | "tips" | "profile" | "objects";

const HIDEABLE_UI: readonly HideableUi[] = ["invite", "tips", "profile", "objects"];

type HubWithUserData = { user_data?: any } | null | undefined;

export function hiddenUi(hub: HubWithUserData): ReadonlySet<HideableUi> {
  const value = hub?.user_data?.hide_ui;
  // Anything but an array of strings is treated as absent, so a malformed value never hides more than intended.
  if (!Array.isArray(value) || !value.every(item => typeof item === "string")) return new Set();
  return new Set(HIDEABLE_UI.filter(part => value.includes(part)));
}

export function isUiHidden(hub: HubWithUserData, part: HideableUi): boolean {
  return hiddenUi(hub).has(part);
}
