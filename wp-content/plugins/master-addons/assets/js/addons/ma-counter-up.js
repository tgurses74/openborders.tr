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
const counterUp = (el, options = {}) => {
  const {
    action = "start",
    duration = 1e3,
    delay = 16
  } = options;
  if (action === "stop") {
    stopCountUp(el);
    return;
  }
  stopCountUp(el);
  if (!/[0-9]/.test(el.innerHTML)) {
    return;
  }
  const nums = divideNumbers(el.innerHTML, {
    duration: duration || el.getAttribute("data-duration"),
    delay: delay || el.getAttribute("data-delay")
  });
  el._countUpOrigInnerHTML = el.innerHTML;
  el.innerHTML = nums[0] || "&nbsp;";
  el.style.visibility = "visible";
  const output = function() {
    el.innerHTML = nums.shift() || "&nbsp;";
    if (nums.length) {
      clearTimeout(el.countUpTimeout);
      el.countUpTimeout = setTimeout(output, delay);
    } else {
      el._countUpOrigInnerHTML = void 0;
    }
  };
  el.countUpTimeout = setTimeout(output, delay);
};
const stopCountUp = (el) => {
  clearTimeout(el.countUpTimeout);
  if (el._countUpOrigInnerHTML) {
    el.innerHTML = el._countUpOrigInnerHTML;
    el._countUpOrigInnerHTML = void 0;
  }
  el.style.visibility = "";
};
const divideNumbers = (numToDivide, options = {}) => {
  const {
    duration = 1e3,
    delay = 16
  } = options;
  const divisions = duration / delay;
  const splitValues = numToDivide.toString().split(/(<[^>]+>|[0-9.][,.0-9]*[0-9]*)/);
  const nums = [];
  for (let k = 0; k < divisions; k++) {
    nums.push("");
  }
  for (let i = 0; i < splitValues.length; i++) {
    if (/([0-9.][,.0-9]*[0-9]*)/.test(splitValues[i]) && !/<[^>]+>/.test(splitValues[i])) {
      let num = splitValues[i];
      const symbols = [...num.matchAll(/[.,]/g)].map((m) => ({ char: m[0], i: num.length - m.index - 1 })).sort((a, b) => a.i - b.i);
      num = num.replace(/[.,]/g, "");
      let k = nums.length - 1;
      for (let val = divisions; val >= 1; val--) {
        let newNum = parseInt(num / divisions * val, 10);
        newNum = symbols.reduce((num2, { char, i: i2 }) => {
          return num2.length <= i2 ? num2 : num2.slice(0, -i2) + char + num2.slice(-i2);
        }, newNum.toString());
        nums[k--] += newNum;
      }
    } else {
      for (let k = 0; k < divisions; k++) {
        nums[k] += splitValues[i];
      }
    }
  }
  nums[nums.length] = numToDivide.toString();
  return nums;
};
(function($, elementor) {
  "use strict";
  var JLTMA_CounterUp = function($scope, $2) {
    var $counterup = $scope.find(".jltma-counter-up-number");
    $counterup.each(function(el) {
      if ($counterup[el]) {
        counterUp($counterup[el], {
          duration: 2e3,
          delay: 15
        });
      }
    });
  };
  $(window).on("elementor/frontend/init", function() {
    elementorFrontend.hooks.addAction("frontend/element_ready/jltma-counter-up.default", JLTMA_CounterUp);
  });
})(jQuery, window.elementorFrontend);
})();
