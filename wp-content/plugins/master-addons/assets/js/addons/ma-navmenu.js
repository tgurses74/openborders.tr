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
  var JLTMA_NavMenu = function($scope, $2) {
    var elementSettings = getElementSettings($scope);
    var $menuContainer = $scope.find(".jltma-nav-menu-element"), $menuID = $menuContainer.data("menu-id"), $menu_type = $menuContainer.data("menu-layout"), $menu_trigger = $menuContainer.data("menu-trigger"), $menu_offcanvas = $menuContainer.data("menu-offcanvas"), $menu_toggletype = $menuContainer.data("menu-toggletype"), $submenu_animation = $menuContainer.data("menu-animation"), $menu_container_id = $menuContainer.data("menu-container-id"), $sticky_type = $menuContainer.data("sticky-type"), navbar_height = $2("#" + $menu_container_id).outerHeight(), menu_container_selector = $2("#" + $menu_container_id);
    if ($menu_type == "onepage") {
      $2(document).on("click", ".jltma-navbar-nav li a", function(e) {
        if ($2(this).attr("href")) {
          var self = $2(this), el = self.get(0), href = el.href, hasHash = href.indexOf("#"), enable = self.parents(".jltma-navbar-nav-default").hasClass("jltma-one-page-enabled");
          if (hasHash !== -1 && href.length > 1 && enable && el.pathname == window.location.pathname) {
            e.preventDefault();
            self.parents(".jltma-menu-container").find(".jltma-close").trigger("click");
          }
        }
      });
      $2(document).on("click", function(e) {
        var click = $2(e.target), opened = $2(".navbar-collapse").hasClass("show");
        if (opened === true) {
          $2(".jltma-one-page-enabled").removeClass("show");
        }
      });
    } else {
      let jltmaOpen = function() {
        $widget.addClass("jltma-is-open");
        $toggle.attr("aria-expanded", "true");
        if (lockBody) {
          $dropdown.attr("aria-hidden", "false");
          $2("body").addClass("jltma-menu-locked");
        }
      }, jltmaClose = function() {
        $widget.removeClass("jltma-is-open");
        $toggle.attr("aria-expanded", "false");
        if (lockBody) {
          $dropdown.attr("aria-hidden", "true");
          $2("body").removeClass("jltma-menu-locked");
        }
      }, jltmaIsOpen = function() {
        return $widget.hasClass("jltma-is-open");
      };
      var submenu_animate_class = "animated " + $submenu_animation, submenu_selector = $2(".jltma-dropdown.jltma-sub-menu");
      $2("#" + $menuID + " .jltma-menu-has-children").hover(function() {
        if (submenu_selector.hasClass("fade-up")) {
          submenu_selector.removeClass("fade-up");
        }
        if (submenu_selector.hasClass("fade-down")) {
          submenu_selector.removeClass("fade-down");
        }
        $2(".jltma-dropdown.jltma-sub-menu").addClass($submenu_animation);
      });
      if ($sticky_type == "fixed-onscroll") {
        if ($2(window).width() > 768) {
          $2(function() {
            $2(window).scroll(function() {
              var scroll = $2(window).scrollTop();
              if (scroll >= 10) {
                menu_container_selector.removeClass("" + $menu_container_id).addClass("jltma-on-scroll-fixed");
              } else {
                menu_container_selector.removeClass("jltma-on-scroll-fixed").addClass("" + $menu_container_id);
              }
            });
          });
        }
      }
      if ($sticky_type == "sticky-top") {
        if ($2(window).width() > 768) {
          $2(function() {
            $2(window).scroll(function() {
              var scroll = $2(window).scrollTop();
              if (scroll >= 10) {
                menu_container_selector.removeClass("" + $menu_container_id).addClass("sticky-top");
              } else {
                menu_container_selector.removeClass("sticky-top").addClass("" + $menu_container_id);
              }
            });
          });
        }
      }
      if ($sticky_type == "smart-scroll") {
        $2("body").css("padding-top", navbar_height + "px");
        menu_container_selector.addClass("jltma-smart-scroll");
        if ($2(".jltma-smart-scroll").length > 0) {
          var last_scroll_top = 0;
          $2(window).on("scroll", function() {
            var scroll_top = $2(this).scrollTop();
            if (scroll_top < last_scroll_top) {
              $2(".jltma-smart-scroll").removeClass("scrolled-down").addClass("scrolled-up");
            } else {
              $2(".jltma-smart-scroll").removeClass("scrolled-up").addClass("scrolled-down");
            }
            last_scroll_top = scroll_top;
          });
        }
      }
      if ($sticky_type == "nav-fixed-top") {
        if ($2(window).width() > 768) {
          $2(function() {
            $2("body").css("padding-top", navbar_height + "px");
            menu_container_selector.addClass("jltma-fixed-top");
          });
        }
      }
      if ($menu_toggletype == "toggle") {
        $2("#" + $menuID + " .navbar-nav.toggle .jltma-menu-dropdown-toggle").click(function(e) {
          $2(this).parents(".dropdown").toggleClass("open");
          e.stopPropagation();
        });
      }
      var $widget = $scope;
      var $toggle = $scope.find(".jltma-nav-menu__toggle-container");
      var $dropdown = $scope.find(".jltma-nav-menu__dropdown");
      var $closeBtn = $scope.find(".jltma-nav-menu__dropdown-close");
      var $backdrop = $scope.find(".jltma-nav-menu__backdrop");
      var dropdownType = $dropdown.data("menu-type");
      var lockBody = dropdownType === "offcanvas" || dropdownType === "popup";
      var widgetId = $widget.attr("data-id") || "";
      var keyNs = "keydown.jltmaNav-" + widgetId;
      $toggle.off(".jltmaNav");
      $closeBtn.off(".jltmaNav");
      $backdrop.off(".jltmaNav");
      $dropdown.off(".jltmaNav");
      $2(document).off(keyNs);
      if ($toggle.length === 0) {
        return;
      }
      $toggle.on("click.jltmaNav", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (jltmaIsOpen()) {
          jltmaClose();
        } else {
          jltmaOpen();
        }
      });
      $toggle.on("keydown.jltmaNav", function(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (jltmaIsOpen()) {
            jltmaClose();
          } else {
            jltmaOpen();
          }
        }
      });
      $closeBtn.on("click.jltmaNav", function(e) {
        e.preventDefault();
        jltmaClose();
      });
      if (lockBody) {
        $backdrop.on("click.jltmaNav", jltmaClose);
        $2(document).on(keyNs, function(e) {
          if (e.key === "Escape" && jltmaIsOpen()) {
            jltmaClose();
          }
        });
        $dropdown.on("click.jltmaNav", 'a[href]:not([href="#"]):not([href=""])', function() {
          jltmaClose();
        });
      }
      if (dropdownType === "default" || dropdownType === "icon") {
        $dropdown.on("click.jltmaNav", "a", function(e) {
          var $link = $2(this);
          var $li = $link.parent("li.menu-item-has-children");
          if (!$li.length) {
            return;
          }
          var $submenu = $li.children("ul").first();
          if (!$submenu.length) {
            return;
          }
          if (!$li.hasClass("jltma-submenu-open")) {
            e.preventDefault();
            e.stopPropagation();
            $li.addClass("jltma-submenu-open");
          }
        });
      }
    }
  };
  $(window).on("elementor/frontend/init", function() {
    if (typeof elementorFrontend !== "undefined" && elementorFrontend.hooks) {
      elementorFrontend.hooks.addAction("frontend/element_ready/ma-navmenu.default", JLTMA_NavMenu);
    }
  });
  $(function() {
    $(".jltma-nav-menu__toggle-container").each(function() {
      var $scope = $(this).closest(".elementor-element, .elementor-widget, [data-widget_type]").first();
      if (!$scope.length) {
        $scope = $(this).parent();
      }
      JLTMA_NavMenu($scope, $);
    });
  });
})(jQuery, window.elementorFrontend);
})();
