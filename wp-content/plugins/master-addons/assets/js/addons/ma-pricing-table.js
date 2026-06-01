(function(){
(function($, elementor) {
  "use strict";
  var JLTMA_PricingTable = function($scope, $2) {
    var $jltma_pricing_table = $scope.find(".jltma-price-table-details ul");
    if (!$jltma_pricing_table.length) {
      return;
    }
    var $tooltip = $jltma_pricing_table.find("> .jltma-tooltip-item"), widgetID = $scope.data("id");
    $tooltip.each(function(index) {
      tippy(this, {
        allowHTML: false,
        theme: "jltma-pricing-table-tippy-" + widgetID,
        appendTo: document.body
      });
    });
  };
  $(window).on("elementor/frontend/init", function() {
    elementorFrontend.hooks.addAction("frontend/element_ready/ma-pricing-table.default", JLTMA_PricingTable);
  });
})(jQuery, window.elementorFrontend);
})();
