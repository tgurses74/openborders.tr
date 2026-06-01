(function(){
(function($) {
  "use strict";
  var JLTMA_Wrapper_Link = function($scope, $2) {
    $2("body").off("click.onWrapperLink", "[data-jltma-wrapper-link]");
    $2("body").on("click.onWrapperLink", "[data-jltma-wrapper-link]", function(e) {
      e.preventDefault();
      e.stopPropagation();
      var $wrapper = $2(this), data = $wrapper.data("jltma-wrapper-link"), id = $wrapper.data("id"), anchor = document.createElement("a"), anchorReal;
      anchor.id = "jltma-wrapper-link-" + id;
      anchor.href = data.url;
      anchor.target = data.is_external ? "_blank" : "_self";
      anchor.rel = data.nofollow ? "nofollow noreferer" : "";
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchorReal = document.getElementById(anchor.id);
      if (data && data.url) {
        if (data.is_external) {
          window.open(data.url, "_blank", data.nofollow ? "noopener,noreferrer" : "noopener");
        } else {
          window.location.href = data.url;
        }
      }
      if (anchorReal) {
        anchorReal.remove();
      }
    });
  };
  $(window).on("elementor/frontend/init", function() {
    elementorFrontend.hooks.addAction("frontend/element_ready/global", JLTMA_Wrapper_Link);
  });
})(jQuery);
})();
