import { useEffect } from "react";
export default function GlobalSpinner({ loading }: { loading: boolean }) {
  useEffect(() => {
    const el = document.getElementById("global-spinner");
    if (el) el.style.display = loading ? "flex" : "none";
  }, [loading]);
  return (
    <div id="global-spinner" className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" style={{ display: "none" }}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
    </div>
  );
}
