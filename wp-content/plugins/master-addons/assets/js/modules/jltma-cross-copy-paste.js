(function(){
window.XdUtils = window.XdUtils || {
  extend: function(e, t) {
    var n, i = t || {};
    for (n in e) e.hasOwnProperty(n) && (i[n] = e[n]);
    return i;
  }
}, window.jltmaXdLocalStorage = window.jltmaXdLocalStorage || /* @__PURE__ */ (function() {
  var e = "cross-domain-local-message", t = {
    iframeId: "cross-domain-iframe-id",
    iframeUrl: void 0,
    initCallback: function() {
    }
  }, n = -1, i = null, o = {}, a = false, s = true;
  function r(n2) {
    var i2;
    try {
      i2 = JSON.parse(n2.data);
    } catch (a2) {
    }
    i2 && i2.namespace === e && ("iframe-ready" === i2.id ? (s = true, t.initCallback()) : (function(e2) {
      o[e2.id] && (o[e2.id](e2), delete o[e2.id]);
    })(i2));
  }
  function l(t2, a2, s2, r2) {
    n++, o[n] = r2;
    var l2 = {
      namespace: e,
      id: n,
      action: t2,
      key: a2,
      value: s2
    };
    null !== i && i.contentWindow.postMessage(JSON.stringify(l2), "*");
  }
  function c(e2) {
    t = XdUtils.extend(e2, t);
    var n2 = document.createElement("div");
    window.addEventListener ? window.addEventListener("message", r, false) : window.attachEvent("onmessage", r), n2.innerHTML = '<iframe id="' + t.iframeId + '" src="' + t.iframeUrl + '" style="display: none;"></iframe>', document.body.appendChild(n2), i = document.getElementById(t.iframeId);
  }
  function d() {
    return !!a && !!s;
  }
  function m() {
    return "complete" === document.readyState;
  }
  return {
    init: function(e2) {
      if (!e2.iframeUrl) throw "You must specify iframeUrl [CP]";
      a || (a = true, m() ? c(e2) : document.addEventListener ? document.addEventListener("readystatechange", function() {
        m() && c(e2);
      }) : document.attachEvent("readystatechange", function() {
        m() && c(e2);
      }));
    },
    setItem: function(e2, t2, n2) {
      d() && l("set", e2, t2, n2);
    },
    getItem: function(e2, t2) {
      d() && l("get", e2, null, t2);
    },
    removeItem: function(e2, t2) {
      d() && l("remove", e2, null, t2);
    },
    key: function(e2, t2) {
      d() && l("key", e2, null, t2);
    },
    getSize: function(e2) {
      d() && l("size", null, null, e2);
    },
    getLength: function(e2) {
      d() && l("length", null, null, e2);
    },
    clear: function(e2) {
      d() && l("clear", null, null, e2);
    },
    wasInit: function() {
      return a;
    }
  };
})(), (function(e) {
  jltmaXdLocalStorage.init({
    iframeId: "jltma-xd-iframe",
    iframeUrl: "https://jeweltheme.github.io/master-addons-magic-copy-api/",
    initCallback: function() {
    }
  });
  var t = {
    elementTypes: ["widget", "column", "section", "container"],
    storageKey: jltma_cp_xd.storage_key,
    lastCopiedJson: "",
    lastPastedModel: {},
    sameServer: false,
    widget: null,
    container: null,
    option: {},
    msg: jltma_cp_xd.message
  };
  function n() {
    elementor.notifications.showToast({
      message: elementor.translate(t.msg.paste)
    });
  }
  t.elementTypes.forEach(function(i, o) {
    let a = t.elementTypes[o];
    elementor.hooks.addFilter(
      "elements/" + a + "/contextMenuGroups",
      function(i2, o2) {
        return i2.push({
          name: "jltma_" + a,
          actions: [
            {
              name: "jltma_copy",
              title: "MA Copy",
              callback: function() {
                var e2 = {};
                e2.elementType = "widget" === a ? o2.model.get("widgetType") : null, e2.elementCode = o2.model.toJSON(), jltmaXdLocalStorage.setItem(
                  t.storageKey,
                  JSON.stringify(e2),
                  function() {
                    elementor.notifications.showToast({
                      message: elementor.translate(t.msg.copy)
                    });
                  }
                );
              }
            },
            {
              name: "jltma_paste",
              title: "MA Paste",
              callback: function() {
                jltmaXdLocalStorage.getItem(t.storageKey, function(i3) {
                  !(function(i4, o3) {
                    if (null === i4 || "" === i4 || Array.isArray(i4) && 0 === i4.length)
                      return elementor.notifications.showToast({
                        message: elementor.translate(t.msg.empty_copy)
                      }), false;
                    let a2 = o3.model.get("elType"), s = i4.elementCode.elType, r = i4.elementCode;
                    if (t.widget = {
                      elType: s,
                      settings: r.settings
                    }, "section" === s || "container" === s)
                      t.widget.elements = r.elements, t.container = elementor.getPreviewContainer();
                    else if ("column" === s)
                      switch (t.widget.elements = r.elements, a2) {
                        case "widget":
                          t.container = o3.getContainer().parent.parent;
                          break;
                        case "column":
                          t.container = o3.getContainer().parent;
                          break;
                        case "section":
                          t.container = o3.getContainer();
                      }
                    else if ("widget" === s)
                      switch (t.widget.widgetType = i4.elementType, a2) {
                        case "widget":
                          t.container = o3.getContainer().parent, t.option.at = o3.getOption("_index") + 1;
                          break;
                        case "column":
                          t.container = o3.getContainer();
                          break;
                        case "section":
                          t.container = o3.children.findByIndex(0).getContainer();
                      }
                    !(function(i5) {
                      var o4 = JSON.stringify(i5), a3 = /\.(gif|jpg|jpeg|svg|png|tiff|bmp|pdf)/gi.test(
                        o4
                      );
                      if (e.isEmptyObject(t.lastPastedModel) || o4 !== t.lastCopiedJson)
                        if (a3 && !t.sameServer) {
                          let e2 = elementor.notifications.getToast(), i6 = e2.getSettings();
                          "hide" in i6 && (i6 = Object.assign(i6.hide, {
                            auto: false
                          }), e2.setSettings(i6)), elementor.notifications.showToast({
                            message: elementor.translate(
                              t.msg.import_wait
                            )
                          }), elementorCommon.ajax.addRequest(
                            "jltma_copy_paste",
                            {
                              data: {
                                type: "single",
                                template: o4
                              },
                              success: function(a4) {
                                var s2 = a4;
                                s2.hasOwnProperty("data") && (s2 = s2.data), "hide" in i6 ? (i6 = Object.assign(i6.hide, {
                                  auto: true
                                }), e2.setSettings(i6)) : "auto" in i6 && (i6.auto = true, e2.setSettings(i6)), t.widget.elType = s2.elType, t.widget.settings = s2.settings, "widget" === s2.elType ? t.widget.widgetType = s2.widgetType : t.widget.elements = s2.elements, $e.run("document/elements/create", {
                                  model: t.widget,
                                  container: t.container,
                                  options: t.option
                                }), n(), t.lastPastedModel = t.widget, t.lastCopiedJson = o4;
                              },
                              error: function(e3) {
                                elementor.notifications.showToast({
                                  message: elementor.translate(
                                    t.msg.error
                                  )
                                });
                              }
                            }
                          );
                        } else
                          $e.run("document/elements/create", {
                            model: t.widget,
                            container: t.container,
                            options: t.option
                          }), n();
                      else
                        t.option.clone = true, $e.run("document/elements/create", {
                          model: t.lastPastedModel,
                          container: t.container,
                          options: t.option
                        }), n();
                    })(r);
                  })(JSON.parse(i3.value), o2);
                });
              }
            }
          ]
        }), i2;
      }
    );
  });
})(jQuery);
})();
