'use strict';

System.register(['./datasource', './query_ctrl'], function (_export, _context) {
  "use strict";

  var PredixTimeSeriesDatasource, PredixTimeSeriesDatasourceQueryCtrl, PredixTimeSeriesConfigCtrl, PredixTimeSeriesQueryOptionsCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_datasource) {
      PredixTimeSeriesDatasource = _datasource.PredixTimeSeriesDatasource;
    }, function (_query_ctrl) {
      PredixTimeSeriesDatasourceQueryCtrl = _query_ctrl.PredixTimeSeriesDatasourceQueryCtrl;
    }],
    execute: function () {
      _export('ConfigCtrl', PredixTimeSeriesConfigCtrl = function PredixTimeSeriesConfigCtrl() {
        _classCallCheck(this, PredixTimeSeriesConfigCtrl);
      });

      PredixTimeSeriesConfigCtrl.templateUrl = 'partials/config.html';

      _export('QueryOptionsCtrl', PredixTimeSeriesQueryOptionsCtrl = function PredixTimeSeriesQueryOptionsCtrl() {
        _classCallCheck(this, PredixTimeSeriesQueryOptionsCtrl);
      });

      PredixTimeSeriesQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

      _export('Datasource', PredixTimeSeriesDatasource);

      _export('QueryCtrl', PredixTimeSeriesDatasourceQueryCtrl);

      _export('ConfigCtrl', PredixTimeSeriesConfigCtrl);

      _export('QueryOptionsCtrl', PredixTimeSeriesQueryOptionsCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
