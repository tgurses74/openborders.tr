(function(){
(function($, elementor) {
  "use strict";
  var JLTMA_ImageCarousel = function($scope, $2) {
    var $carousel = $scope.find(".jltma-image-carousel-slider");
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
    if ($2.isFunction($2.fn.fancybox)) {
      $scope.find("[data-fancybox]").fancybox({});
    }
  };
  $(window).on("elementor/frontend/init", function() {
    elementorFrontend.hooks.addAction("frontend/element_ready/ma-image-carousel.default", JLTMA_ImageCarousel);
  });
})(jQuery, window.elementorFrontend);
})();
