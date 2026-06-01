(function(){
(function($, elementor) {
  "use strict";
  var JLTMA_Tabs = function($scope, $2) {
    try {
      var $tabsWrapper = $scope.find("[data-tabs]"), $tabEffect = $tabsWrapper.data("tab-effect");
      $tabsWrapper.each(function() {
        var tab = $2(this);
        var isTabActive = false;
        var isContentActive = false;
        tab.find("[data-tab]").each(function() {
          if ($2(this).hasClass("active")) {
            isTabActive = true;
          }
        });
        tab.find(".jltma--advance-tab-content").each(function() {
          if ($2(this).hasClass("active")) {
            isContentActive = true;
          }
        });
        if (!isContentActive) {
          tab.find(".jltma--advance-tab-content").eq(0).addClass("active");
        }
        if ($tabEffect == "hover") {
          tab.find("[data-tab]").hover(function() {
            var $data_tab_id = $2(this).data("tab-id");
            $2(this).siblings().removeClass("active");
            $2(this).addClass("active");
            $2(this).closest("[data-tabs]").find(".jltma--advance-tab-content").removeClass("active");
            $2("#" + $data_tab_id).addClass("active");
          });
        } else {
          tab.find("[data-tab]").click(function() {
            var $data_tab_id = $2(this).data("tab-id");
            $2(this).siblings().removeClass("active");
            $2(this).addClass("active");
            $2(this).closest("[data-tabs]").find(".jltma--advance-tab-content").removeClass("active");
            $2("#" + $data_tab_id).addClass("active");
          });
        }
      });
    } catch (e) {
    }
  };
  $(window).on("elementor/frontend/init", function() {
    elementorFrontend.hooks.addAction("frontend/element_ready/ma-tabs.default", JLTMA_Tabs);
  });
})(jQuery, window.elementorFrontend);
})();
