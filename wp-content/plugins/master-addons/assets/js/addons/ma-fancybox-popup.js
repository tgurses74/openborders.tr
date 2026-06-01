(function(){
(function($, elementor) {
  "use strict";
  var JLTMA_FancyboxPopup = function($scope, $2) {
    if ($2.isFunction($2.fn.fancybox)) {
      $2("[data-fancybox]").fancybox({});
    }
  };
  $(window).on("elementor/frontend/init", function() {
    elementorFrontend.hooks.addAction("frontend/element_ready/global", JLTMA_FancyboxPopup);
  });
})(jQuery, window.elementorFrontend);
})();
