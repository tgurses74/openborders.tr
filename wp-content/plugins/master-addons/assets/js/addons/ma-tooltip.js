(function(){
function getElementSettings($element, setting) {
  var elementSettings = {}, modelCID = $element.data("model-cid");
  if (typeof elementorFrontend !== "undefined" && elementorFrontend.isEditMode() && modelCID) {
    var settings = elementorFrontend.config.elements.data[modelCID], type = settings.attributes.widgetType || settings.attributes.elType, settingsKeys = elementorFrontend.config.elements.keys[type];
    if (!settingsKeys) {
      settingsKeys = elementorFrontend.config.elements.keys[type] = [];
      jQuery.each(settings.controls, function(name, control) {
        if (control.frontend_available) {
          settingsKeys.push(name);
        }
      });
    }
    jQuery.each(settings.getActiveControls(), function(controlKey) {
      if (-1 !== settingsKeys.indexOf(controlKey)) {
        elementSettings[controlKey] = settings.attributes[controlKey];
      }
    });
  } else {
    elementSettings = $element.data("settings") || {};
  }
  return getItems(elementSettings, setting);
}
function getItems(items, itemKey) {
  if (itemKey) {
    var keyStack = itemKey.split("."), currentKey = keyStack.splice(0, 1);
    if (!keyStack.length) {
      return items[currentKey];
    }
    if (!items[currentKey]) {
      return;
    }
    return getItems(items[currentKey], keyStack.join("."));
  }
  return items;
}
function getUniqueLoopScopeId($scope) {
  if ($scope.data("jltma-template-widget-id")) {
    return $scope.data("jltma-template-widget-id");
  }
  return $scope.data("id");
}
function jltMAObserveTarget(target, callback, options = {}) {
  var observer = new IntersectionObserver(function(entries, observer2) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, options);
  observer.observe(target);
}
function sanitizeTooltipText(text) {
  const tempDiv = document.createElement("div");
  tempDiv.textContent = text;
  return tempDiv.innerHTML;
}
function stripTags(text) {
  return text.replace(/<\/?[^>]+(>|$)/g, "");
}
function isEditMode() {
  return typeof elementorFrontend !== "undefined" && elementorFrontend.isEditMode();
}
function decodeEntities(str) {
  if (!str) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}
function filterFancyBox(element) {
  jQuery(element).find(".jltma-fancybox").each(function() {
    const rawCaption = jQuery(this).data("caption");
    const caption = decodeEntities(rawCaption);
    const hasDangerousAttr = /\son\w+\s*=/i.test(caption);
    const hasScriptTag = /<\s*script/i.test(caption);
    const hasJsProto = /javascript:/i.test(caption);
    if (caption && (hasDangerousAttr || hasScriptTag || hasJsProto)) {
      jQuery(this).attr("data-caption", "");
      jQuery(this).closest(".elementor-element").remove();
    }
  });
}
(function($, elementor) {
  "use strict";
  var activeTooltipWidgets = {};
  var initTooltip = function($scope, editorSettings) {
    if (!$scope || !$scope.length) {
      return;
    }
    if (typeof tippy === "undefined") {
      var retryCount = ($scope.data("ma-tooltip-retry") || 0) + 1;
      if (retryCount <= 10) {
        $scope.data("ma-tooltip-retry", retryCount);
        setTimeout(function() {
          initTooltip($scope, editorSettings);
        }, 100);
      }
      return;
    }
    $scope.removeData("ma-tooltip-retry");
    var elementSettings = editorSettings || getElementSettings($scope), scopeId = $scope.data("id"), currentTooltipElement = null;
    if (!scopeId || typeof scopeId !== "string") {
      return;
    }
    try {
      currentTooltipElement = document.getElementById("jltma-tooltip-" + scopeId);
      if (!currentTooltipElement) {
        var $fallbackElement = $scope.find("#jltma-tooltip-" + scopeId);
        if ($fallbackElement && $fallbackElement.length > 0) {
          currentTooltipElement = $fallbackElement[0];
        }
      }
      if (!currentTooltipElement || currentTooltipElement.nodeType !== 1) {
        return;
      }
    } catch (error) {
      return;
    }
    var tooltipText = elementSettings.ma_el_tooltip_text;
    if (!tooltipText || typeof tooltipText !== "string") {
      return;
    }
    var $jltma_el_tooltip_text = stripTags(tooltipText), $jltma_el_tooltip_direction = elementSettings.ma_el_tooltip_direction || "top", $jltma_tooltip_animation = elementSettings.jltma_tooltip_animation || "shift-away", $jltma_tooltip_arrow = elementSettings.jltma_tooltip_arrow !== false, $jltma_tooltip_duration = parseInt(elementSettings.jltma_tooltip_duration) || 300, $jltma_tooltip_delay = parseInt(elementSettings.jltma_tooltip_delay) || 300, $jltma_tooltip_trigger = elementSettings.jltma_tooltip_trigger || "mouseenter", $animateFill = elementSettings.jltma_tooltip_animation === "fill";
    var $jltma_el_tooltip_text_width = 200;
    if (elementSettings.ma_el_tooltip_text_width && elementSettings.ma_el_tooltip_text_width.size) {
      $jltma_el_tooltip_text_width = parseInt(elementSettings.ma_el_tooltip_text_width.size) || 200;
    }
    if (currentTooltipElement._tippy) {
      currentTooltipElement._tippy.destroy();
    }
    var isEditMode = typeof elementorFrontend !== "undefined" && elementorFrontend.isEditMode();
    var appendToTarget = isEditMode ? document.body : currentTooltipElement.parentNode || document.body;
    var tooltipConfig = {
      content: $jltma_el_tooltip_text,
      animation: $jltma_tooltip_animation,
      arrow: $jltma_tooltip_arrow,
      duration: [$jltma_tooltip_duration, $jltma_tooltip_delay],
      trigger: $jltma_tooltip_trigger,
      animateFill: $animateFill,
      flipOnUpdate: true,
      maxWidth: Math.max(50, Math.min(1e3, $jltma_el_tooltip_text_width)),
      zIndex: 999,
      allowHTML: false,
      theme: "jltma-tooltip-tippy-" + scopeId,
      interactive: true,
      hideOnClick: true,
      placement: $jltma_el_tooltip_direction,
      appendTo: appendToTarget
    };
    if (elementSettings.jltma_tooltip_follow_cursor === "yes") {
      tooltipConfig.followCursor = true;
    }
    tippy(currentTooltipElement, tooltipConfig);
  };
  var JLTMA_Tooltip = function($scope, $2) {
    var scopeId = $scope.data("id");
    if (scopeId) {
      activeTooltipWidgets[scopeId] = $scope;
    }
    initTooltip($scope);
  };
  var editorHandlerRetries = 0;
  var setupEditorHandler = function() {
    if (typeof elementor === "undefined" || !elementor.channels || !elementor.channels.editor) {
      if (editorHandlerRetries < 10) {
        editorHandlerRetries++;
        setTimeout(setupEditorHandler, 500);
      }
      return;
    }
    elementor.channels.editor.on("change", function(view) {
      var model = view.model;
      var widgetType = model.get("widgetType");
      if (widgetType !== "ma-tooltip") {
        return;
      }
      var elementId = model.get("id");
      var $scope = activeTooltipWidgets[elementId];
      if ($scope && $scope.length) {
        var settings = model.get("settings");
        var liveSettings = settings ? settings.toJSON() : {};
        clearTimeout($scope.data("tooltip-update-timer"));
        $scope.data("tooltip-update-timer", setTimeout(function() {
          initTooltip($scope, liveSettings);
        }, 100));
      }
    });
  };
  $(window).on("elementor/frontend/init", function() {
    elementorFrontend.hooks.addAction("frontend/element_ready/ma-tooltip.default", JLTMA_Tooltip);
    if (typeof elementorFrontend !== "undefined" && elementorFrontend.isEditMode()) {
      setupEditorHandler();
    }
  });
})(jQuery, window.elementorFrontend);
})();
