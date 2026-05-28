/**
 * Two soft, floating background orbs — the only "decorative" element
 * in the system. Use on hero sections and PDP.
 */
export function AmbientOrbs() {
  return (
    <>
      <div aria-hidden className="swr-orb swr-orb-1 animate-float" />
      <div
        aria-hidden
        className="swr-orb swr-orb-2 animate-float"
        style={{ animationDelay: "2s" }}
      />
    </>
  );
}
