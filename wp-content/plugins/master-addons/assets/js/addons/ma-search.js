(function(){
(function($, elementor) {
  "use strict";
  function initEvents($scope) {
    var mainSearchWrapper = $scope.find(".jltma-search-wrapper").eq(0), searchType = mainSearchWrapper.data("search-type"), mainContainer = $scope.find(".jltma-search-main-wrap"), openCtrl = $scope.find(".jltma-btn--search"), closeCtrl = $scope.find(".jltma-btn--search-close"), searchContainer = $scope.find(".jltma-search"), inputSearch = searchContainer.find(".jltma-search__input");
    if (searchType !== "icon") {
      return;
    }
    openCtrl.on("click", function(e) {
      e.preventDefault();
      mainContainer.addClass("main-wrap--move");
      searchContainer.addClass("search--open");
      setTimeout(function() {
        inputSearch.focus();
      }, 600);
    });
    closeCtrl.on("click", function(e) {
      e.preventDefault();
      closeSearch($scope);
    });
    $(document).on("keyup.jltmaSearch", function(ev) {
      if (ev.keyCode === 27 && searchContainer.hasClass("search--open")) {
        closeSearch($scope);
      }
    });
  }
  function closeSearch($scope) {
    var mainContainer = $scope.find(".jltma-search-main-wrap"), searchContainer = $scope.find(".jltma-search"), inputSearch = searchContainer.find(".jltma-search__input");
    mainContainer.removeClass("main-wrap--move");
    searchContainer.removeClass("search--open");
    inputSearch.blur();
    inputSearch.val("");
  }
  var JLTMA_HeaderSearch = function($scope, $2) {
    $2("body").addClass("js");
    initEvents($scope);
  };
  $(window).on("elementor/frontend/init", function() {
    elementorFrontend.hooks.addAction("frontend/element_ready/ma-search.default", JLTMA_HeaderSearch);
  });
})(jQuery, window.elementorFrontend);
})();
