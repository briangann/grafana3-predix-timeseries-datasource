import angular from "angular";
import _ from "lodash";
import dateMath from "app/core/utils/datemath";
import kbn from "app/core/utils/kbn";

export class PredixTimeSeriesDatasource {

    constructor(instanceSettings, $q, backendSrv, $timeout, $http, templateSrv) {
        this.type = instanceSettings.type;
        this.url = instanceSettings.url;
        this.name = instanceSettings.name;
        this.q = $q;
        this.http = $http;
        this.backendSrv = backendSrv;
        this.templateSrv = templateSrv;
        // the uaa token is stored here in the model
        this.uaaTokenCache = [];
        // these attributes are pulled from the datasource definition ui
        this.tsURL = instanceSettings.jsonData.tsURL;
        this.predixZoneId = instanceSettings.jsonData.predixZoneId;
        this.uaacURL = instanceSettings.jsonData.uaacURL;
        this.clientData = instanceSettings.jsonData.clientData;
        this.uaacType = instanceSettings.jsonData.uaacType;
        this.uaacGrantType = instanceSettings.jsonData.uaacGrantType;
        this.uaac_origin = instanceSettings.jsonData.uaac_origin;
        this.expand = true;
        console.log("predix time series datasource constructor finished");
    }

    // Required for hints
    getMetrics() {
        var _this = this;
        return this.fetchToken(_this).then(function(_this) {
            return _this.backendSrv.datasourceRequest({
                url: _this.tsURL + '/v1/tags',
                data: '',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + _this.uaaTokenCache.uaacToken,
                    'Predix-Zone-Id': _this.predixZoneId,
                    'Access-Control-Allow-Origin': _this.uaac_origin
                }
            }).then(function(response) {
                return _this.mapToTextValue(response.data.results);
            });
        });
    }

    getAttributesForMetric(metricName) {
        var _this = this;
        return this.fetchToken(_this).then(function(_this) {
            var query = {
                "start": "365d-ago",
                "end": "1s-ago",
                "tags": [{
                    "limit": "1",
                    "name": [metricName]
                }]
            };
            return _this.backendSrv.datasourceRequest({
                url: _this.tsURL + '/v1/datapoints',
                data: JSON.stringify(query),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + _this.uaaTokenCache.uaacToken,
                    'Predix-Zone-Id': _this.predixZoneId,
                    'Access-Control-Allow-Origin': _this.uaac_origin
                }
            }).then(function(result) {
                return _this.mapToTextValue(Object.keys(result.data.tags[0].results[0].attributes));
            });
        });
    }

    getAttributeValues(metricName, attributeName) {
        var _this = this;
        return this.fetchToken(_this).then(function(_this) {
            var query = {
                "start": "365d-ago",
                "end": "1s-ago",
                "tags": [{
                    "limit": "1",
                    "name": [metricName]
                }]
            };
            return _this.backendSrv.datasourceRequest({
                url: _this.tsURL + '/v1/datapoints',
                data: JSON.stringify(query),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + _this.uaaTokenCache.uaacToken,
                    'Predix-Zone-Id': _this.predixZoneId,
                    'Access-Control-Allow-Origin': _this.uaac_origin
                }
            }).then(function(result) {
                return _this.mapToTextValue(result.data.tags[0].results[0].attributes[attributeName]);
            });
        });
    }

    getAggregations() {
        var _this = this;
        return this.fetchToken(_this).then(function(_this) {
            return _this.backendSrv.datasourceRequest({
                url: _this.tsURL + '/v1/aggregations',
                data: '',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + _this.uaaTokenCache.uaacToken,
                    'Predix-Zone-Id': _this.predixZoneId,
                    'Access-Control-Allow-Origin': _this.uaac_origin
                }
            }).then(function(response) {
                var data = [];
                _.each(response.data.results, function(elem) {
                    data.push({
                        name: elem.type,
                        type: elem.name
                    });
                });
                return _this.mapToTextAndType(data);
            });
        });
    }

    mapToTextValue(results) {
        return _.map(results, (d, i) => {
            return {
                text: d,
                expandable: true
            };
        });
    }

    mapToTextAndType(result) {
        return _.map(result, function(d, i) {
            return {
                text: d.name,
                expandable: false,
                type: d.type
            };
        });
    }

    buildQueryParameters(options) {
        //remove placeholder targets
        options.targets = _.filter(options.targets, function(target) {
            return target.target !== 'select metric';
        });
        return options;
    }

    // Since we are limited on the amount of data that can be returned,
    // each metric gets its own query for maximum results
    SinglePredixTimeSeriesQuery(aQuery) {
        var deferred = this.q.defer();
        var request = this.backendSrv.datasourceRequest({
                url: this.tsURL + '/v1/datapoints',
                data: JSON.stringify(aQuery.fullQuery),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.uaaTokenCache.uaacToken,
                    'Predix-Zone-Id': this.predixZoneId,
                    'Access-Control-Allow-Origin': this.uaac_origin
                }
            }).then(function(result) {
                // we always get one tag back
                var tag = result.data.tags[0];
                var tagName = tag.name;
                if ((typeof aQuery.targetAlias !== 'undefined') && (aQuery.targetAlias.length > 0)) {
                    tagName = aQuery.targetAlias;
                }
                // construct the response
                var a_metric = {
                    target: tagName,
                    datapoints: []
                };
                // add in the datapoints, picking the correct fields
                // predix has a "quality" field that is ignored
                _.each(tag.results[0].values, function(timeseries) {
                    var newseries = [timeseries[1], timeseries[0]];
                    a_metric.datapoints.push(newseries);
                });
                return a_metric;
            })
            .then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                console.error(error);
            });
        return deferred.promise;
    }


    getUAAToken(_this) {
        return new Promise(function(resolve, reject) {
            var now = new Date();
            var checkTime = new Date(now.getTime() + 1000 * 30);
            if (typeof _this.uaaTokenCache.uaacTokenType === 'undefined' ||
                (typeof _this.uaaTokenCache.expiresDTTM !== 'undefined' &&
                    _this.uaaTokenCache.expiresDTTM < checkTime)) {
                var clientID = _this.clientData.split(":")[0];
                var clientSecret = _this.clientData.split(":")[1];
                var payload = encodeURI("client_id=" + clientID +
                    "&client_secret=" + clientSecret +
                    "&response_type=token&grant_type=client_credentials");
                _this.backendSrv.datasourceRequest({
                    method: 'POST',
                    url: _this.uaacURL,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + btoa(_this.clientData),
                    },
                    data: payload
                }).then(
                    function(response) {
                        _this.uaaTokenCache = [];
                        _this.uaaTokenCache.uaacToken = response.data.access_token;
                        _this.uaaTokenCache.uaacTokenType = response.data.token_type;
                        _this.uaaTokenCache.uaacExpires = response.data.expires_in;
                        var timeObject = new Date();
                        //set the time and date that this token expires
                        timeObject = new Date(timeObject.getTime() + 1000 * response.data.expires_in);
                        _this.uaaTokenCache.expiresDTTM = timeObject;
                        // console.log("Got a new token!");
                        // console.log($scope.datasource.uaaTokenCache);
                        resolve(_this.uaaTokenCache);
                    },
                    function(error) {
                        console.log("Failed to get a token: " + error);
                        resolve("error");
                    });
            } else {
                // console.log("we have a good token...");
                resolve(_this.uaaTokenCache);
            }
        });
    }

    fetchToken(_this) {
        // TODO: check if we already have a token and the expiration time is good
        return new Promise(function(resolve, reject) {
            var aToken = _this.getUAAToken(_this);
            aToken.then(function(response) {
                resolve(_this);
            });
        });
    }

    MultiplePredixTimeSeriesQueries(pendingQueries) {
        var deferred = this.q.defer();
        var predixTSCalls = [];
        // have to reference "this" inside angular foreach
        var _this = this;
        angular.forEach(pendingQueries, function(aQuery) {
            predixTSCalls.push(_this.SinglePredixTimeSeriesQuery(aQuery));
        });
        this.q.all(predixTSCalls)
            .then(
                function(results) {
                    var response = {
                        data: []
                    };
                    angular.forEach(results, function(result) {
                        response.data.push(result);
                    });
                    deferred.resolve(response);
                },
                function(errors) {
                    deferred.reject(errors);
                },
                function(updates) {
                    deferred.update(updates);
                }
            );
        return deferred.promise;
    }

    // Called once per panel (graph)
    query(options) {
        // not needed since we are using suggest vs value?
        // it isn't used anyways..
        //var query = this.buildQueryParameters(options);

        var queries = [];
        if (options.targets.length <= 0) {
            return this.q.when({
                data: []
            });
        }
        if (typeof options.targets[0].metric === 'undefined') {
            return this.q.when({
                data: []
            });
        }
        // the rest of this function is a promise
        var deferred = this.q.defer();

        // Iterate over each target and build our query, store inside
        angular.forEach(options.targets, function(target) {
            // there's no "next" option in here, so test and skip
            if ((!target.hide) && (typeof target.metric !== 'undefined')) {
                // placeholder while query is built
                var aQuery = {
                    "start": "15s-ago",
                    "end": "1s-ago",
                    "tags": [{
                        "name": ["placeholder"]
                    }]
                };
                aQuery.tags[0].name[0] = target.metric;
                aQuery.tags[0].limit = options.maxDataPoints;
                aQuery.start = options.range.from.valueOf();
                aQuery.end = options.range.to.valueOf();
                // now the filters
                // TODO: implement filters
                if (typeof target.filters !== undefined) {
                    // there are filters defined, loop through them
                    var filter_list = [];
                    angular.forEach(target.filters, function(value, key) {
                        var filter_name = key;
                        var filter_value = value;
                        // if the value is empty, skip it
                        if (value.length > 0) {
                            var aHash = {};
                            aHash[filter_name] = filter_value;
                            filter_list.push(aHash);
                        }
                    });
                    if (filter_list.length > 0) {
                        // only add filters if some are defined
                        // aQuery.tags[0].filters = {};
                    }
                }
                // Add the query and the target alias
                // thhe alias will be used later for legend substitution if it is defined
                queries.push({
                    fullQuery: aQuery,
                    targetAlias: target.alias
                });
            } else {
                console.log("hidden or empty, not adding to query");
            }
        });
        // Iterate over each target and get the data from TimeSeries
        var _this = this;
        // Check if there are any metrics to query (they can all be hidden, or none at all)
        if (queries.length === 0) {
            // console.log("no tags visible or specified, no data to fetch");
            deferred.resolve({
                data: []
            });
            return deferred.promise;
        }
        this.fetchToken(this).then(function(_this) {
            var predixQueries = _this.q.all({
                first: _this.MultiplePredixTimeSeriesQueries(queries),
            });
            predixQueries.then(function(results) {
                // return results from predix query
                deferred.resolve(results.first);
            });
        });
        return deferred.promise;
    }

    testDatasource() {
        var _this = this;
        return this.fetchToken(_this).then(function(_this) {
            return _this.backendSrv.datasourceRequest({
                url: _this.tsURL + '/v1/tags',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': _this.uaaTokenCache.uaacToken,
                    'Predix-Zone-Id': _this.predixZoneId,
                    'Access-Control-Allow-Origin': _this.uaac_origin
                }
            }).then(function(response) {
                console.log(response);
                if (response.status === 200) {
                    return {
                        status: "success",
                        message: "Data source is working",
                        title: "Success"
                    };
                }
            });
        });
    }
}
