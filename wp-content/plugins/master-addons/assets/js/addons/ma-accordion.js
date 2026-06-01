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
  var JLTMA_Accordion = function($scope, $2) {
    var elementSettings = getElementSettings($scope), $accordionHeader = $scope.find(".jltma-accordion-header"), $accordionType = elementSettings.accordion_type, $accordionSpeed = elementSettings.toggle_speed || 300;
    $accordionHeader.each(function() {
      if ($2(this).hasClass("active-default")) {
        $2(this).addClass("show active");
        $2(this).next().slideDown($accordionSpeed);
      }
    });
    $accordionHeader.unbind("click");
    $accordionHeader.click(function(e) {
      e.preventDefault();
      var $this = $2(this);
      if ($accordionType === "accordion") {
        if ($this.hasClass("show")) {
          $this.removeClass("show active");
          $this.next().slideUp($accordionSpeed);
        } else {
          $this.parent().parent().find(".jltma-accordion-header").removeClass("show active");
          $this.parent().parent().find(".jltma-accordion-tab-content").slideUp($accordionSpeed);
          $this.toggleClass("show active");
          $this.next().slideDown($accordionSpeed);
        }
      } else {
        if ($this.hasClass("show")) {
          $this.removeClass("show active");
          $this.next().slideUp($accordionSpeed);
        } else {
          $this.addClass("show active");
          $this.next().slideDown($accordionSpeed);
        }
      }
    });
  };
  $(window).on("elementor/frontend/init", function() {
    elementorFrontend.hooks.addAction("frontend/element_ready/ma-advanced-accordion.default", JLTMA_Accordion);
  });
})(jQuery, window.elementorFrontend);
})();
