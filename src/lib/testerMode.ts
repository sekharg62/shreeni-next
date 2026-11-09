"use client";

import { useSyncExternalStore } from "react";

const KEY = "shreeni-tester";

function readTesterFlag(): boolean {
  try {
    // Idempotent, so it's safe for React to call this on every render.
    const flag = new URLSearchParams(window.location.search).get("tester");
    if (flag === "1") localStorage.setItem(KEY, "1");
    if (flag === "0") localStorage.removeItem(KEY);
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

const subscribe = () => () => {};

/**
 * Lets the team place real test orders while the store is in preview.
 * Open any page with `?tester=1` to turn it on in this browser, `?tester=0` to turn it off.
 */
export function useTesterMode(): boolean {
  return useSyncExternalStore(subscribe, readTesterFlag, () => false);
}
