'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryOptionsCtrl = exports.ConfigCtrl = exports.QueryCtrl = exports.Datasource = undefined;

var _datasource = require('./datasource');

var _query_ctrl = require('./query_ctrl');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PredixTimeSeriesConfigCtrl = function PredixTimeSeriesConfigCtrl() {
  _classCallCheck(this, PredixTimeSeriesConfigCtrl);
};

PredixTimeSeriesConfigCtrl.templateUrl = 'partials/config.html';

var PredixTimeSeriesQueryOptionsCtrl = function PredixTimeSeriesQueryOptionsCtrl() {
  _classCallCheck(this, PredixTimeSeriesQueryOptionsCtrl);
};

PredixTimeSeriesQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

exports.Datasource = _datasource.PredixTimeSeriesDatasource;
exports.QueryCtrl = _query_ctrl.PredixTimeSeriesDatasourceQueryCtrl;
exports.ConfigCtrl = PredixTimeSeriesConfigCtrl;
exports.QueryOptionsCtrl = PredixTimeSeriesQueryOptionsCtrl;
//# sourceMappingURL=module.js.map
