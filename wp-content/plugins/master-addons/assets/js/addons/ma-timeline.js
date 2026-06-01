(function(){
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
function getUniqueLoopScopeId($scope) {
  if ($scope.data("jltma-template-widget-id")) {
    return $scope.data("jltma-template-widget-id");
  }
  return $scope.data("id");
}
;
(function($, window2, document2, undefined$1) {
  $.maTimeline = function(element, options) {
    var defaults = {
      scope: $(window2),
      points: ".timeline-item__point",
      lineLocation: 50
    };
    var plugin = this;
    plugin.opts = {};
    var $window = null, $viewport = $(window2), $element = $(element), dragging = false, scrolling = false, resizing = false, latestKnownScrollY = -1, latestKnownWindowHeight = -1, currentScrollY = 0, currentWindowHeight = 0, ticking = false, updateAF = null, $line = $element.find(".jltma-timeline__line"), $progress = $line.find(".jltma-timeline__line__inner"), $cards = $element.find(".jltma-timeline__item");
    plugin.init = function() {
      plugin.opts = $.extend({}, defaults, options);
      plugin._construct();
    };
    plugin._construct = function() {
      $window = plugin.opts.scope;
      currentScrollY = $window.scrollTop();
      currentWindowHeight = $(window2).height();
      plugin.events();
      plugin.requestTick();
      plugin.animateCards();
    };
    plugin.requestTick = function() {
      if (!ticking) {
        updateAF = requestAnimationFrame(plugin.refresh);
      }
      ticking = true;
    };
    plugin.animateCards = function() {
      $cards.each(function() {
        if ($(this).offset().top <= $window.scrollTop() + $viewport.outerHeight() * 0.95) {
          $(this).addClass("bounce-in");
        }
      });
    };
    plugin.events = function() {
      $window.on("scroll", plugin.onScroll);
      $(window2).on("resize", plugin.onResize);
    };
    plugin.onScroll = function() {
      currentScrollY = $window.scrollTop();
      plugin.requestTick();
      plugin.animateCards();
    };
    plugin.onResize = function() {
      currentScrollY = $window.scrollTop();
      currentWindowHeight = $window.height();
      plugin.requestTick();
    };
    plugin.setup = function() {
      $line.css({
        "top": $cards.first().find(plugin.opts.points).offset().top - $cards.first().offset().top,
        "bottom": $element.offset().top + $element.outerHeight() - $cards.last().find(plugin.opts.points).offset().top
      });
    };
    plugin.refresh = function() {
      ticking = false;
      if (latestKnownWindowHeight !== currentWindowHeight) {
        plugin.setup();
      }
      if (latestKnownScrollY !== currentScrollY || latestKnownWindowHeight !== currentWindowHeight) {
        latestKnownScrollY = currentScrollY;
        latestKnownWindowHeight = currentWindowHeight;
        plugin.progress();
      }
    };
    plugin.progress = function() {
      var _coeff = 100 / plugin.opts.lineLocation, _last_pos = $cards.last().find(plugin.opts.points).offset().top, _pos = $window.scrollTop() - $progress.offset().top + $viewport.outerHeight() / _coeff;
      if (_last_pos <= $window.scrollTop() + $viewport.outerHeight() / _coeff) {
        _pos = _last_pos - $progress.offset().top;
      }
      $progress.css({
        "height": _pos + "px"
      });
      $cards.each(function() {
        if ($(this).find(plugin.opts.points).offset().top < $window.scrollTop() + $viewport.outerHeight() / _coeff) {
          $(this).addClass("is--focused");
        } else {
          $(this).removeClass("is--focused");
        }
      });
    };
    plugin.destroy = function() {
      $element.removeData("maTimeline");
    };
    plugin.init();
  };
  $.fn.maTimeline = function(options) {
    return this.each(function() {
      $.fn.maTimeline.destroy = function() {
        if ("undefined" !== typeof plugin) {
          $(this).data("maTimeline").destroy();
          $(this).removeData("maTimeline");
        }
      };
      if (undefined$1 === $(this).data("maTimeline")) {
        var plugin = new $.maTimeline(this, options);
        $(this).data("maTimeline", plugin);
      }
    });
  };
})(jQuery, window, document);
(function($, elementor) {
  "use strict";
  var JLTMA_Timeline = function($scope, $2) {
    var elementSettings = getElementSettings($scope), $timeline = $scope.find(".jltma-timeline"), $swiperSlider = $scope.find(".jltma-timeline-slider"), $timeline_type = elementSettings.ma_el_timeline_type || "custom", $timeline_layout = elementSettings.ma_el_timeline_design_type || "vertical", timelineArgs = {}, $uniqueId = getUniqueLoopScopeId($scope);
    if ($timeline_layout === "horizontal") {
      var $carousel = $scope.find(".jltma-timeline-carousel-slider");
      if (!$carousel.length) {
        return;
      }
      var $carouselContainer = $scope.find(".swiper"), $settings = $carousel.data("settings"), Swiper = elementorFrontend.utils.swiper;
      async function initSwiper() {
        var swiper = await new Swiper($carouselContainer[0], $settings);
        if ($settings.pauseOnHover) {
          $2($carouselContainer).hover(function() {
            this.swiper.autoplay.stop();
          }, function() {
            this.swiper.autoplay.start();
          });
        }
      }
      initSwiper();
    }
    if ($timeline_layout === "vertical" || $timeline_type === "post") {
      let init = function() {
        if (typeof elementorFrontend !== "undefined" && elementorFrontend.isEditMode()) {
          timelineArgs.scope = window.elementor.$previewContents;
        }
        if ("undefined" !== typeof elementSettings.line_location && elementSettings.line_location.size) {
          timelineArgs.lineLocation = elementSettings.line_location.size;
        }
        $timeline.maTimeline(timelineArgs);
      };
      var timelineArgs = {};
      init();
    }
  };
  $(window).on("elementor/frontend/init", function() {
    elementorFrontend.hooks.addAction("frontend/element_ready/ma-timeline.default", JLTMA_Timeline);
  });
})(jQuery, window.elementorFrontend);
})();
