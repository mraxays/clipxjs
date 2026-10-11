/*! ClipX JS v1.3.0 | MIT | https://clipx.js.org */
(function (g, f) {
  var c = f();
  if (typeof module == "object" && module.exports) module.exports = c;
  if (typeof window != "undefined") window.clipx = window.ClipX = c;
})(this, function () {
  "use strict";
  var D = typeof document != "undefined" && document,
    nav = typeof navigator != "undefined" ? navigator : {},
    SEL = "[data-clipx-text],[data-clipx-target],[data-clipx-paste]",
    svg = (fill, d) =>
      '<svg class="clipx-js-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="' + fill +
      '" aria-hidden="true"><path fill-rule="evenodd" d="' + d + '"/></svg>',
    ICON = {
      ok: svg("#00d241", "M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14.4-4-4 1.4-1.4 2.6 2.6 5.6-5.6L18 9.4z"),
      err: svg("#e70000", "M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2zm0-4h-2V7h2z"),
    },
    CSS =
      ".clipx-toast{font:14px system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;position:fixed;left:50%;transform:translateX(-50%);background:#fff;color:#363636;padding:8px 10px;border-radius:8px;z-index:9999;box-shadow:0 3px 10px rgba(0,0,0,.1),0 3px 3px rgba(0,0,0,.05);opacity:0;transition:opacity .3s;max-width:90%;display:flex;align-items:center;gap:5px;pointer-events:none}" +
      ".clipx-show{opacity:1}.clipx-toast.top{top:20px}.clipx-toast.bottom{bottom:20px}.clipx-toast.error{background:#f8d7da;color:#721c24}" +
      "@media(prefers-reduced-motion:reduce){.clipx-toast{transition:none}}",
    rm = (n) => n && n.parentNode && n.parentNode.removeChild(n),
    isV = (e) => /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName),
    get = (e) => (isV(e) ? e.value : e.textContent),
    fire = (e, n, d) =>
      e.dispatchEvent(d ? new CustomEvent(n, { bubbles: true, detail: d }) : new Event(n, { bubbles: true })),
    set = (e, t) => {
      if (isV(e)) {
        e.value = t;
        fire(e, "input");
        fire(e, "change");
      } else e.textContent = t;
    },
    legacy = (t) =>
      new Promise((ok, no) => {
        var a = D.activeElement, x = D.createElement("textarea"), r = false;
        x.value = t;
        x.readOnly = true;
        x.style.cssText = "position:fixed;top:0;opacity:0";
        D.body.appendChild(x);
        x.select();
        try {
          x.setSelectionRange(0, t.length);
          r = D.execCommand("copy");
        } catch (e) {}
        rm(x);
        a && a.focus && a.focus();
        r ? ok() : no(Error("Copy failed"));
      }),
    FMT = {
      trim: (s) => s.trim(),
      uppercase: (s) => s.toUpperCase(),
      lowercase: (s) => s.toLowerCase(),
      capitalize: (s) => s.charAt(0).toUpperCase() + s.slice(1),
      titlecase: (s) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase()),
      collapse: (s) => s.replace(/\s+/g, " "),
      singleline: (s) => s.replace(/\s*[\r\n]+\s*/g, " "),
      striphtml: (s) => s.replace(/<[^>]*>/g, ""),
    };

  function clipx() {
    this.disable = { msg: false, toast: false };
    this.customStyles = {};
    this.formatters = Object.assign({}, FMT);
    this._sel = [];
    this._fn = null;
    this._t = {};
  }
  var P = clipx.prototype;
  clipx.version = "1.3.0";

  P.addFormatter = function (n, f) {
    if (typeof f != "function") throw new TypeError("Formatter must be a function");
    this.formatters[String(n).toLowerCase()] = f;
    return this;
  };
  P.format = function (t, spec) {
    t = t == null ? "" : String(t);
    (Array.isArray(spec) ? spec : String(spec || "").split(",")).forEach((n) => {
      n = String(n).trim().toLowerCase();
      var f = this.formatters[n];
      if (f) t = String(f(t));
      else if (n) console.warn("ClipX: unknown format '" + n + "'");
    });
    return t;
  };

  P.copyText = function (t) {
    t = t == null ? "" : String(t);
    return nav.clipboard && nav.clipboard.writeText
      ? nav.clipboard.writeText(t).catch(() => legacy(t))
      : legacy(t);
  };
  P.cutText = function (t, e) {
    return this.copyText(t).then(() => {
      e && set(e, "");
    });
  };
  P.copyFromElement = function (e, f) {
    var t = this.format(get(e), f);
    return t ? this.copyText(t) : Promise.reject(Error("Nothing to copy."));
  };
  P.cutFromElement = function (e, f) {
    var t = this.format(get(e), f);
    return t ? this.cutText(t, e) : Promise.reject(Error("Nothing to copy."));
  };
  P.pasteText = function () {
    return nav.clipboard && nav.clipboard.readText
      ? nav.clipboard.readText()
      : Promise.reject(Error("Paste is not supported here."));
  };
  P.pasteToElement = function (e, f) {
    return this.pasteText().then((t) => {
      t = this.format(t, f);
      set(e, t);
      return t;
    });
  };

  P.attach = function (s) {
    if (!D) return this;
    s = s || SEL;
    this._sel.indexOf(s) < 0 && this._sel.push(s);
    this._fn ||
      D.addEventListener(
        "click",
        (this._fn = (e) => {
          var n = e.target;
          n && n.nodeType != 1 && (n = n.parentElement);
          n = n && n.closest && n.closest(this._sel.join(","));
          n && this._run(n);
        })
      );
    return this;
  };
  P.detach = function () {
    this._fn && D.removeEventListener("click", this._fn);
    this._fn = null;
    this._sel = [];
    return this;
  };

  P._run = function (el) {
    if (el.__cx) return;
    var a = (n) => el.getAttribute("data-clipx-" + n),
      h = (n) => el.hasAttribute("data-clipx-" + n),
      fm = a("format"), cut = h("cut"), ty = "copy", p, s,
      d = parseInt(a("duration"), 10);
    try {
      if (a("paste")) {
        ty = "paste";
        if (!(s = D.querySelector(a("paste")))) throw Error("Paste target not found");
        p = this.pasteToElement(s, fm);
      } else if (a("target")) {
        if (!(s = D.querySelector(a("target")))) throw Error("Target not found");
        ty = cut ? "cut" : "copy";
        p = cut ? this.cutFromElement(s, fm) : this.copyFromElement(s, fm);
      } else if (h("text")) {
        if (!(s = this.format(a("text"), fm))) throw Error("Nothing to copy.");
        p = this.copyText(s);
      } else throw Error("Add data-clipx-target, -text or -paste");
    } catch (err) {
      return this.onError(el, err);
    }
    el.__cx = 1;
    p.then(
      () => this.onSuccess(el, a("msg"), h("toast"), h("disable-msg"), h("disable-toast"), a("toast-position") || "bottom", d > 0 ? d : 1500, ty),
      (err) => this.onError(el, err)
    ).then(() => {
      el.__cx = 0;
    });
  };

  P.onSuccess = function (el, msg, only, noMsg, noToast, pos, dur, ty) {
    msg = msg || (ty == "paste" ? "Pasted!" : "Copied!");
    if (!only && !noMsg && !this.disable.msg) {
      if (el.__o === undefined) el.__o = el.innerHTML;
      el.textContent = msg;
      clearTimeout(el.__t);
      el.__t = setTimeout(() => {
        el.innerHTML = el.__o;
        el.__o = undefined;
      }, dur);
    }
    noToast || this.disable.toast || this._toast(msg, "ok", pos, dur);
    fire(el, "clipx:success", { type: ty || "copy" });
  };
  P.onError = function (el, e) {
    console.error("ClipX:", e);
    this.disable.toast ||
      this._toast(e && e.message == "Nothing to copy." ? e.message : "Failed to copy!", "err", "bottom", 1500);
    fire(el, "clipx:error", { error: e });
  };

  P._toast = function (m, k, pos, dur) {
    if (!D.getElementById("clipx-js-styles")) {
      var s = D.createElement("style");
      s.id = "clipx-js-styles";
      s.textContent = CSS;
      (D.head || D.documentElement).appendChild(s);
    }
    pos = pos == "top" ? "top" : "bottom";
    rm(this._t[pos]);
    var t = D.createElement("div"), l = D.createElement("span");
    t.className = "clipx-toast " + pos + (k == "err" ? " error" : "");
    t.setAttribute("role", k == "err" ? "alert" : "status");
    t.innerHTML = ICON[k];
    l.textContent = m;
    t.appendChild(l);
    t.style.cssText = (this.customStyles.toast || "") + ";" + (k == "err" ? this.customStyles.error || "" : "");
    D.body.appendChild(t);
    this._t[pos] = t;
    setTimeout(() => t.classList.add("clipx-show"), 10);
    setTimeout(() => {
      t.classList.remove("clipx-show");
      setTimeout(() => {
        rm(t);
        if (this._t[pos] == t) this._t[pos] = null;
      }, 300);
    }, dur);
  };

  P.setCustomStyles = function (s) {
    this.customStyles = s || {};
    return this;
  };
  clipx.ClipX = clipx;
  return clipx;
});