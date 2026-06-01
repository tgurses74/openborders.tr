(function(){
(function($, elementor) {
  "use strict";
  var JLTMA_DropdownButton = function($scope, $2) {
    $scope.find(".jltma-dropdown").hover(
      function() {
        $scope.find(".jltma-dd-menu").addClass("jltma-dd-menu-opened");
      },
      function() {
        $scope.find(".jltma-dd-menu").removeClass("jltma-dd-menu-opened");
      }
    );
  };
  $(window).on("elementor/frontend/init", function() {
    elementorFrontend.hooks.addAction("frontend/element_ready/jltma-dropdown-button.default", JLTMA_DropdownButton);
  });
})(jQuery, window.elementorFrontend);
})();
