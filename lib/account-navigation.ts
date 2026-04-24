type MinimalRouter = {
  back: () => void;
  push: (href: string) => void;
};

/** Prefer browser back; if there is no prior entry, go to the account hub. */
export function accountBackOrHub(router: MinimalRouter): void {
  if (typeof window !== "undefined" && window.history.length > 1) {
    router.back();
    return;
  }
  router.push("/account");
}
