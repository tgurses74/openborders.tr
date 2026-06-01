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
  var JLTMA_Blog = function($scope, $2) {
    var elementSettings = getElementSettings($scope), uniqueId = getUniqueLoopScopeId($scope), blogElement = $scope.find(".jltma-blog-wrapper"), carousel = blogElement.data("carousel");
    $scope.find(".jltma-blog-cats-container li a").click(function(e) {
      e.preventDefault();
      $scope.find(".jltma-blog-cats-container li .active").removeClass("active");
      $2(this).addClass("active");
      var selector = $2(this).attr("data-filter");
      blogElement.isotope({ filter: selector });
      return false;
    });
    var masonryBlog = blogElement.hasClass("jltma-blog-masonry");
    if (masonryBlog && !carousel) {
      blogElement.imagesLoaded(function() {
        blogElement.isotope({
          itemSelector: ".jltma-post-outer-container",
          percentPosition: true,
          animationOptions: {
            duration: 750,
            easing: "linear",
            queue: false
          }
        });
      });
    }
    var $carousel = $scope.find(".jltma-blog-carousel-slider");
    if (!$carousel.length) {
      return;
    }
    var $carouselContainer = $scope.find(".swiper"), $settings = $carousel.data("settings"), Swiper = elementorFrontend.utils.swiper;
    async function initSwiper() {
      var swiper = await new Swiper($carouselContainer[0], $settings);
      if ($settings.pauseOnHover) {
        $carouselContainer.hover(function() {
          this.swiper.autoplay.stop();
        }, function() {
          this.swiper.autoplay.start();
        });
      }
    }
    initSwiper();
  };
  $(window).on("elementor/frontend/init", function() {
    elementorFrontend.hooks.addAction("frontend/element_ready/ma-blog-post.default", JLTMA_Blog);
  });
})(jQuery, window.elementorFrontend);
})();
