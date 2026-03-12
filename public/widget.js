(function () {
  "use strict";

  function init() {
    try {
      var script =
        document.currentScript ||
        (function () {
          var scripts = document.getElementsByTagName("script");
          return scripts[scripts.length - 1];
        })();

      if (!script) return;

      var botId = script.getAttribute("data-bot-id") || "";
      var src = script.getAttribute("src") || "";
      if (!src) return;

      var origin = new URL(src, window.location.href).origin;
      var embedUrl = origin + "/widget/embed" + (botId ? "?botId=" + encodeURIComponent(botId) : "");

      var defaultConfig = {
        bubble_color: "#22C55E",
        bubble_icon: "\uD83D\uDCDC",
        bubble_icon_url: "",
        company_logo_url: ""
      };

      function buildLoadingBubble() {
        var bubble = document.createElement("button");
        bubble.setAttribute("type", "button");
        bubble.setAttribute("aria-label", "Loading chat");
        bubble.style.cssText =
          "width:48px;height:48px;border-radius:50%;border:none;cursor:wait;background:rgba(0,0,0,0.06);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(0,0,0,0.12);overflow:hidden;";
        var dot = document.createElement("span");
        dot.style.cssText =
          "width:6px;height:6px;border-radius:50%;background:rgba(0,0,0,0.25);animation:ai-widget-pulse 1s ease-in-out infinite;";
        bubble.appendChild(dot);
        if (!document.getElementById("ai-widget-pulse-style")) {
          var style = document.createElement("style");
          style.id = "ai-widget-pulse-style";
          style.textContent = "@keyframes ai-widget-pulse{0%,100%{opacity:0.4;transform:scale(0.9)}50%{opacity:1;transform:scale(1.1)}}";
          (document.head || document.documentElement).appendChild(style);
        }
        return bubble;
      }

      function buildBubble(config) {
        var c = config || defaultConfig;
        var bg = c.bubble_color || defaultConfig.bubble_color;
        var bubble = document.createElement("button");
        bubble.setAttribute("type", "button");
        bubble.setAttribute("aria-label", "Open chat");
        var logoUrl = c.company_logo_url || c.bubble_icon_url || "";
        var useLogoAsBubble = c.use_logo_as_bubble !== "false";
        if (logoUrl && useLogoAsBubble) {
          bubble.style.cssText =
            "width:48px;height:48px;border-radius:50%;border:2px solid rgba(255,255,255,0.9);cursor:pointer;background:transparent;padding:0;overflow:hidden;display:block;box-shadow:0 2px 12px rgba(0,0,0,0.2);transition:transform 0.2s ease, box-shadow 0.2s ease;";
          var img = document.createElement("img");
          img.src = logoUrl;
          img.alt = "Chat";
          img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
          img.onerror = function () {
            bubble.style.background = bg;
            bubble.style.border = "none";
            bubble.innerHTML = c.bubble_icon || defaultConfig.bubble_icon;
          };
          bubble.appendChild(img);
        } else {
          bubble.style.cssText =
            "width:44px;height:44px;border-radius:50%;border:none;cursor:pointer;background:" + bg + ";color:#fff;font-size:20px;line-height:1;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(0,0,0,0.15);transition:transform 0.2s ease, box-shadow 0.2s ease;overflow:hidden;";
          if (logoUrl) {
            var smallImg = document.createElement("img");
            smallImg.src = logoUrl;
            smallImg.alt = "Chat";
            smallImg.style.cssText = "width:24px;height:24px;object-fit:cover;border-radius:50%;";
            smallImg.onerror = function () {
              bubble.innerHTML = c.bubble_icon || defaultConfig.bubble_icon;
            };
            bubble.appendChild(smallImg);
          } else {
            bubble.innerHTML = c.bubble_icon || defaultConfig.bubble_icon;
          }
        }
        bubble.onmouseover = function () {
          bubble.style.transform = "scale(1.08)";
          bubble.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
        };
        bubble.onmouseout = function () {
          bubble.style.transform = "scale(1)";
          bubble.style.boxShadow = "0 2px 12px rgba(0,0,0,0.15)";
        };
        return bubble;
      }

      function run() {
        if (!document.body) {
          setTimeout(run, 10);
          return;
        }

        var container = document.createElement("div");
        container.id = "ai-support-widget-root";
        container.style.cssText =
          "position:fixed;bottom:20px;right:20px;z-index:2147483647;font-family:system-ui,sans-serif;";

        var wrapper = document.createElement("div");
        wrapper.style.cssText =
          "position:absolute;bottom:52px;right:0;width:360px;height:520px;transform-origin:bottom right;transform:scale(0);opacity:0;transition:transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.22s ease;pointer-events:none;";

        var iframe = document.createElement("iframe");
        iframe.title = "AI Support Chat";
        iframe.style.cssText =
          "width:100%;height:100%;border:none;border-radius:16px;box-shadow:0 20px 50px rgba(15,23,42,0.4);background:#fff;display:block;";

        var open = false;
        var loaded = false;

        function onClick() {
          open = !open;
          if (open) {
            if (!loaded) {
              iframe.src = embedUrl;
              loaded = true;
            }
            wrapper.style.pointerEvents = "auto";
            wrapper.style.transform = "scale(1)";
            wrapper.style.opacity = "1";
          } else {
            wrapper.style.transform = "scale(0)";
            wrapper.style.opacity = "0";
            wrapper.style.pointerEvents = "none";
          }
        }

        var bubble;
        if (botId) {
          bubble = buildLoadingBubble();
          bubble.onclick = function () { /* no-op until config loaded */ };
          wrapper.appendChild(iframe);
          container.appendChild(wrapper);
          container.appendChild(bubble);
          document.body.appendChild(container);

          var configUrl = origin + "/api/widget/public-config?botId=" + encodeURIComponent(botId);
          fetch(configUrl)
            .then(function (res) { return res.ok ? res.json() : null; })
            .then(function (data) {
              var nextBubble = buildBubble(data || defaultConfig);
              nextBubble.onclick = onClick;
              container.replaceChild(nextBubble, bubble);
            })
            .catch(function () {
              var nextBubble = buildBubble(defaultConfig);
              nextBubble.onclick = onClick;
              container.replaceChild(nextBubble, bubble);
            });
        } else {
          bubble = buildBubble(defaultConfig);
          bubble.onclick = onClick;
          wrapper.appendChild(iframe);
          container.appendChild(wrapper);
          container.appendChild(bubble);
          document.body.appendChild(container);
        }
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
      } else {
        run();
      }
    } catch (e) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("AI Support Widget init failed", e);
      }
    }
  }

  init();
})();
