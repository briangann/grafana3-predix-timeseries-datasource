import {PredixTimeSeriesDatasource} from './datasource';
import {PredixTimeSeriesDatasourceQueryCtrl} from './query_ctrl';

class PredixTimeSeriesConfigCtrl {}
PredixTimeSeriesConfigCtrl.templateUrl = 'partials/config.html';

class PredixTimeSeriesQueryOptionsCtrl {}
PredixTimeSeriesQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

export {
  PredixTimeSeriesDatasource as Datasource,
  PredixTimeSeriesDatasourceQueryCtrl as QueryCtrl,
  PredixTimeSeriesConfigCtrl as ConfigCtrl,
  PredixTimeSeriesQueryOptionsCtrl as QueryOptionsCtrl
};
