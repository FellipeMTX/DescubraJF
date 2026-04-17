import { useEffect } from "react";

declare global {
  interface Window {
    VLibras?: { Widget: new (url: string) => unknown };
  }
  namespace React {
    interface HTMLAttributes<T> {
      vw?: string;
      "vw-access-button"?: string;
      "vw-plugin-wrapper"?: string;
    }
  }
}

const SCRIPT_SRC = "https://vlibras.gov.br/app/vlibras-plugin.js";

export function VLibrasWidget() {
  useEffect(() => {
    function init() {
      if (window.VLibras) new window.VLibras.Widget("https://vlibras.gov.br/app");
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      init();
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = init;
    document.body.appendChild(script);
  }, []);

  return (
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active" />
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
}
