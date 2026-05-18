import { env } from "../app/env.js";

export function initHotjar() {
    if (!env.isProd) return;

    const hotjarId = "YOUR_HOTJAR_ID";
    if (!hotjarId || hotjarId === "YOUR_HOTJAR_ID") return;

    (function (h, o, t, j, a, r) {
        h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments); };
        h._hjSettings = { hjid: hotjarId, hjsv: 6 };
        a = o.getElementsByTagName("head")[0];
        r = o.createElement("script");
        r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
    })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
}
