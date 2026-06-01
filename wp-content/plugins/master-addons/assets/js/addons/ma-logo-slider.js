(function(){
(function($, elementor) {
  "use strict";
  var JLTMA_LogoSlider = function($scope, $2) {
    var $carousel = $scope.find(".jltma-logo-carousel-slider");
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
    $scope.find(".jltma-logo-slider-item").each(function() {
      var $item = $2(this);
      $item.on("mouseenter", function() {
        $item.addClass("is-hovered");
      }).on("mouseleave", function() {
        $item.removeClass("is-hovered");
      });
    });
  };
  $(window).on("elementor/frontend/init", function() {
    elementorFrontend.hooks.addAction("frontend/element_ready/jltma-logo-slider.default", JLTMA_LogoSlider);
  });
})(jQuery, window.elementorFrontend);
})();
