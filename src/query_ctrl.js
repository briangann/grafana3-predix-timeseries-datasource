import angular from "angular";
import _ from "lodash";
import {
    QueryCtrl
} from 'app/plugins/sdk';
import './css/query-editor.css!';

export class PredixTimeSeriesDatasourceQueryCtrl extends QueryCtrl {
    constructor($scope, $injector, templateSrv, uiSegmentSrv) {
        super($scope, $injector);
        this.uiSegmentSrv = uiSegmentSrv;
        this.templateSrv = templateSrv;
        this.target.attributes = [];
        this.target.filters = [];
        this.target.aggregations = [];
        this.target.groups = [];
        this.aggregator_types = [
          {
            name: "avg",
            description: "Returns the average of the values.",
          },
          {
            name: "count",
            description: "Counts the number of data points.",
          },
          {
            name: "dev",
            description: "Returns the standard deviation of the time series.",
          },
          {
            name: "diff",
            description: "Calculates the difference between successive data points.",
          },
          {
            name: "div",
            description: "Returns each data point divided by the specified value of the divisor property.",
          },
          {
            name: "gaps",
            description: "Marks gaps in data with a null data point, according to the sampling rate.",
          },
          {
            name: "interpolate",
            description: "Does linear interpolation for the chosen window.",
          },
          {
            name: "least_squares",
            description: "Returns two points that represent the best fit line through the set of data points for the range.",
          },
          {
            name: "max",
            description: "Inherits from the range aggregator. Returns the most recent largest value.",
          },
          {
            name: "min",
            description: "Returns the most recent smallest value.",
          },
          {
            name: "percentile",
            description: "Calculates a probability distribution, and returns the specified percentile for the distribution. The “percentile” value is defined as 0 < percentile <= 1 where .5 is 50% and 1 is 100%.",
          },
          {
            name: "rate",
            description: "Returns the rate of change between a pair of data points.",
          },
          {
            name: "sampler",
            description: "Calculates the sampling rate of change for the data points.",
          },
          {
            name: "scale",
            description: "Scales each data point by a factor.",
          },
          {
            name: "sum",
            description: "Returns the sum of all values.",
          },
          {
            name: "trendmode",
            description: "Returns the min and max values within each interval.",
          },

        ];
    }

    getMetrics() {
        return this.datasource.getMetrics()
            .then(this.uiSegmentSrv.transformToSegments(true));
    }

    getAttributesForMetric() {
      return this.datasource.getAttributesForMetric(this.target.metric)
          .then(this.uiSegmentSrv.transformToSegments(true));
    }

    getAttributeValues(name) {
      if (name) {
        return this.datasource.getAttributeValues(this.target.metric, name)
            .then(this.uiSegmentSrv.transformToSegments(true));
      }
    }

    getAggregationTypes() {
      var _this = this;
      var x = new Promise(function(resolve, reject) {
        resolve(_this.mapToTextAndDescription(_this.aggregator_types));
      });
      return x.then(this.uiSegmentSrv.transformToSegments(true));
    }

    mapToTextAndDescription(result) {
        return _.map(result, function(d,i) {
            return { text: d.name, expandable: false, description: d.description};
        });
    }

    removeAttribute(name) {
        console.log("Removing attribute");
        if (this.target.attributes) {
            this.target.attributes.splice(this.target.attributes.indexOf(name), 1);
            this.panelCtrl.refresh();
        }
    }

    addAttribute() {
        console.log("Add attribute...");
        this.target.attributes.push({
            name: null,
            value: null
        });
    }

    addFilter() {
        console.log("Add Filter...");
        this.target.filters.push({
            attributes: {},
            measurements: {},
            qualities: {},
        });
    }

    addGroup() {
        console.log("Add Group...");
        this.target.groups.push({
            name: null,
            attributes: [],
        });
    }

    addAggregation() {
        console.log("Add Aggregation...");
        this.target.aggregations.push({
            type: null
        });
        console.log("Add done..");
    }


    onChangeInternal() {
        this.panelCtrl.refresh(); // Asks the panel to refresh data.
    }
}

PredixTimeSeriesDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
