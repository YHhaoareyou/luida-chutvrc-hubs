import test from "ava";
import { hiddenUi, isUiHidden } from "../../../src/utils/hidden-ui";

const hubWith = hide_ui => ({ hub_id: "abc1234", user_data: { hide_ui } });

test("hides nothing for rooms without the switch", t => {
  t.is(hiddenUi(undefined).size, 0);
  t.is(hiddenUi(null).size, 0);
  t.is(hiddenUi({ hub_id: "abc1234" }).size, 0);
  t.is(hiddenUi({ hub_id: "abc1234", user_data: null }).size, 0);
  t.is(hiddenUi({ hub_id: "abc1234", user_data: { addons: {} } }).size, 0);
  t.false(isUiHidden(undefined, "invite"));
});

test("hides the parts the room lists", t => {
  const hub = hubWith(["invite", "profile"]);
  t.deepEqual([...hiddenUi(hub)].sort(), ["invite", "profile"]);
  t.true(isUiHidden(hub, "invite"));
  t.true(isUiHidden(hub, "profile"));
  t.false(isUiHidden(hub, "tips"));
  t.false(isUiHidden(hub, "objects"));
});

test("knows all four parts", t => {
  const hub = hubWith(["invite", "tips", "profile", "objects"]);
  t.deepEqual([...hiddenUi(hub)].sort(), ["invite", "objects", "profile", "tips"]);
});

test("ignores unknown names", t => {
  const hub = hubWith(["tips", "chat", "Invite", ""]);
  t.deepEqual([...hiddenUi(hub)], ["tips"]);
});

test("hides nothing when the value is not an array of strings", t => {
  for (const value of ["invite", { invite: true }, true, 1, null, ["invite", 1], ["profile", null], [["tips"]]]) {
    t.is(hiddenUi(hubWith(value)).size, 0, JSON.stringify(value));
  }
});

test("follows the hub it is given", t => {
  const hub = hubWith([]);
  t.false(isUiHidden(hub, "objects"));
  hub.user_data.hide_ui = ["objects"];
  t.true(isUiHidden(hub, "objects"));
  t.false(isUiHidden(hubWith(["invite"]), "objects"));
});
