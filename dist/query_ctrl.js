"use strict";

System.register(["angular", "lodash", "app/plugins/sdk", "./css/query-editor.css!"], function (_export, _context) {
  "use strict";

  var angular, _, QueryCtrl, _createClass, PredixTimeSeriesDatasourceQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_angular) {
      angular = _angular.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_appPluginsSdk) {
      QueryCtrl = _appPluginsSdk.QueryCtrl;
    }, function (_cssQueryEditorCss) {}],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export("PredixTimeSeriesDatasourceQueryCtrl", PredixTimeSeriesDatasourceQueryCtrl = function (_QueryCtrl) {
        _inherits(PredixTimeSeriesDatasourceQueryCtrl, _QueryCtrl);

        function PredixTimeSeriesDatasourceQueryCtrl($scope, $injector, templateSrv, uiSegmentSrv) {
          _classCallCheck(this, PredixTimeSeriesDatasourceQueryCtrl);

          var _this2 = _possibleConstructorReturn(this, (PredixTimeSeriesDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(PredixTimeSeriesDatasourceQueryCtrl)).call(this, $scope, $injector));

          _this2.uiSegmentSrv = uiSegmentSrv;
          _this2.templateSrv = templateSrv;
          _this2.target.attributes = [];
          _this2.target.filters = [];
          _this2.target.aggregations = [];
          _this2.target.groups = [];
          _this2.aggregator_types = [{
            name: "avg",
            description: "Returns the average of the values."
          }, {
            name: "count",
            description: "Counts the number of data points."
          }, {
            name: "dev",
            description: "Returns the standard deviation of the time series."
          }, {
            name: "diff",
            description: "Calculates the difference between successive data points."
          }, {
            name: "div",
            description: "Returns each data point divided by the specified value of the divisor property."
          }, {
            name: "gaps",
            description: "Marks gaps in data with a null data point, according to the sampling rate."
          }, {
            name: "interpolate",
            description: "Does linear interpolation for the chosen window."
          }, {
            name: "least_squares",
            description: "Returns two points that represent the best fit line through the set of data points for the range."
          }, {
            name: "max",
            description: "Inherits from the range aggregator. Returns the most recent largest value."
          }, {
            name: "min",
            description: "Returns the most recent smallest value."
          }, {
            name: "percentile",
            description: "Calculates a probability distribution, and returns the specified percentile for the distribution. The “percentile” value is defined as 0 < percentile <= 1 where .5 is 50% and 1 is 100%."
          }, {
            name: "rate",
            description: "Returns the rate of change between a pair of data points."
          }, {
            name: "sampler",
            description: "Calculates the sampling rate of change for the data points."
          }, {
            name: "scale",
            description: "Scales each data point by a factor."
          }, {
            name: "sum",
            description: "Returns the sum of all values."
          }, {
            name: "trendmode",
            description: "Returns the min and max values within each interval."
          }];
          return _this2;
        }

        _createClass(PredixTimeSeriesDatasourceQueryCtrl, [{
          key: "getMetrics",
          value: function getMetrics() {
            return this.datasource.getMetrics().then(this.uiSegmentSrv.transformToSegments(true));
          }
        }, {
          key: "getAttributesForMetric",
          value: function getAttributesForMetric() {
            return this.datasource.getAttributesForMetric(this.target.metric).then(this.uiSegmentSrv.transformToSegments(true));
          }
        }, {
          key: "getAttributeValues",
          value: function getAttributeValues(name) {
            if (name) {
              return this.datasource.getAttributeValues(this.target.metric, name).then(this.uiSegmentSrv.transformToSegments(true));
            }
          }
        }, {
          key: "getAggregationTypes",
          value: function getAggregationTypes() {
            var _this = this;
            var x = new Promise(function (resolve, reject) {
              resolve(_this.mapToTextAndDescription(_this.aggregator_types));
            });
            return x.then(this.uiSegmentSrv.transformToSegments(true));
          }
        }, {
          key: "mapToTextAndDescription",
          value: function mapToTextAndDescription(result) {
            return _.map(result, function (d, i) {
              return { text: d.name, expandable: false, description: d.description };
            });
          }
        }, {
          key: "removeAttribute",
          value: function removeAttribute(name) {
            console.log("Removing attribute");
            if (this.target.attributes) {
              this.target.attributes.splice(this.target.attributes.indexOf(name), 1);
              this.panelCtrl.refresh();
            }
          }
        }, {
          key: "addAttribute",
          value: function addAttribute() {
            console.log("Add attribute...");
            this.target.attributes.push({
              name: null,
              value: null
            });
          }
        }, {
          key: "addFilter",
          value: function addFilter() {
            console.log("Add Filter...");
            this.target.filters.push({
              attributes: {},
              measurements: {},
              qualities: {}
            });
          }
        }, {
          key: "addGroup",
          value: function addGroup() {
            console.log("Add Group...");
            this.target.groups.push({
              name: null,
              attributes: []
            });
          }
        }, {
          key: "addAggregation",
          value: function addAggregation() {
            console.log("Add Aggregation...");
            this.target.aggregations.push({
              type: null
            });
            console.log("Add done..");
          }
        }, {
          key: "onChangeInternal",
          value: function onChangeInternal() {
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
          }
        }]);

        return PredixTimeSeriesDatasourceQueryCtrl;
      }(QueryCtrl));

      _export("PredixTimeSeriesDatasourceQueryCtrl", PredixTimeSeriesDatasourceQueryCtrl);

      PredixTimeSeriesDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
    }
  };
});
//# sourceMappingURL=query_ctrl.js.map
