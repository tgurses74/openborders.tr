(function(){
(function($, elementor) {
  "use strict";
  var JLTMA_DataTable = function($scope, $2) {
    var a = $scope.find(".jltma-data-table-container"), n = a.data("source"), r = a.data("sourcecsv");
    if (1 == a.data("buttons")) var l = "Bfrtip";
    else l = "frtip";
    if ("custom" == n) {
      var i = $scope.find("table thead tr th").length;
      $scope.find("table tbody tr").each(function() {
        if ($2(this).find("td").length < i) {
          var t = i - $2(this).find("td").length;
          $2(this).append(new Array(++t).join("<td></td>"));
        }
      }), $scope.find(".jltma-data-table").DataTable({
        dom: l,
        paging: a.data("paging"),
        pagingType: "numbers",
        pageLength: a.data("pagelength"),
        info: a.data("info"),
        scrollX: true,
        searching: a.data("searching"),
        ordering: a.data("ordering"),
        buttons: [{
          extend: "csvHtml5",
          text: JLTMA_DATA_TABLE.csvHtml5
        }, {
          extend: "excelHtml5",
          text: JLTMA_DATA_TABLE.excelHtml5
        }, {
          extend: "pdfHtml5",
          text: JLTMA_DATA_TABLE.pdfHtml5
        }, {
          extend: "print",
          text: JLTMA_DATA_TABLE.print
        }],
        language: {
          lengthMenu: JLTMA_DATA_TABLE.lengthMenu,
          zeroRecords: JLTMA_DATA_TABLE.zeroRecords,
          info: JLTMA_DATA_TABLE.info,
          infoEmpty: JLTMA_DATA_TABLE.infoEmpty,
          infoFiltered: JLTMA_DATA_TABLE.infoFiltered,
          search: "",
          searchPlaceholder: JLTMA_DATA_TABLE.searchPlaceholder,
          processing: JLTMA_DATA_TABLE.processing
        }
      });
    } else if ("csv" == n) {
      ({
        init: function(t) {
          var a2 = (t = t || {}).csv_path || "", n2 = $scope.element || $2("#table-container"), r2 = $scope.csv_options || {}, l2 = $scope.datatables_options || {}, i2 = $scope.custom_formatting || [], s = {};
          $2.each(i2, function(e, t2) {
            var a3 = t2[0], n3 = t2[1];
            s[a3] = n3;
          });
          var d = $2('<table class="jltma-data-table cell-border" style="width:100%;visibility:hidden;">');
          n2.empty().append(d), $2.when($2.get(a2)).then(function(t2) {
            for (var a3 = $2.csv.toArrays(t2, r2), n3 = $2("<thead></thead>"), i3 = a3[0], o = $2("<tr></tr>"), c = 0; c < i3.length; c++) o.append($2("<th></th>").text(i3[c]));
            n3.append(o), d.append(n3);
            for (var m = $2("<tbody></tbody>"), p = 1; p < a3.length; p++)
              for (var _ = $2("<tr></tr>"), g = 0; g < a3[p].length; g++) {
                var b = $2("<td></td>"), f = s[g];
                f ? b.html(f(a3[p][g])) : b.text(a3[p][g]), _.append(b), m.append(_);
              }
            d.append(m), d.DataTable(l2);
          });
        }
      }).init({
        csv_path: r,
        element: a,
        datatables_options: {
          dom: l,
          paging: a.data("paging"),
          pagingType: "numbers",
          pageLength: a.data("pagelength"),
          info: a.data("info"),
          scrollX: true,
          searching: a.data("searching"),
          ordering: a.data("ordering"),
          buttons: [{
            extend: "csvHtml5",
            text: JLTMA_DATA_TABLE.csvHtml5
          }, {
            extend: "excelHtml5",
            text: JLTMA_DATA_TABLE.excelHtml5
          }, {
            extend: "pdfHtml5",
            text: JLTMA_DATA_TABLE.pdfHtml5
          }, {
            extend: "print",
            text: JLTMA_DATA_TABLE.print
          }],
          language: {
            lengthMenu: JLTMA_DATA_TABLE.lengthMenu,
            zeroRecords: JLTMA_DATA_TABLE.zeroRecords,
            info: JLTMA_DATA_TABLE.info,
            infoEmpty: JLTMA_DATA_TABLE.infoEmpty,
            infoFiltered: JLTMA_DATA_TABLE.infoFiltered,
            search: "",
            searchPlaceholder: JLTMA_DATA_TABLE.searchPlaceholder,
            processing: JLTMA_DATA_TABLE.processing
          }
        }
      });
    }
    $scope.find(".jltma-data-table").css("visibility", "visible");
  };
  $(window).on("elementor/frontend/init", function() {
    elementorFrontend.hooks.addAction("frontend/element_ready/jltma-data-table.default", JLTMA_DataTable);
  });
})(jQuery, window.elementorFrontend);
})();
