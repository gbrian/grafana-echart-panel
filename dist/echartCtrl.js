'use strict';

System.register(['app/plugins/sdk', 'lodash', 'app/core/utils/kbn', 'app/core/time_series', './rendering', './optionsTab', './jsonPreviewCtrl'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, _, kbn, TimeSeries, EChartRendering, OptionsTabCtrl, JSONPreviewCtrl, _createClass, EChartCtrl;

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
    setters: [function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_appCoreTime_series) {
      TimeSeries = _appCoreTime_series.default;
    }, function (_rendering) {
      EChartRendering = _rendering.default;
    }, function (_optionsTab) {
      OptionsTabCtrl = _optionsTab.default;
    }, function (_jsonPreviewCtrl) {
      JSONPreviewCtrl = _jsonPreviewCtrl.default;
    }],
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

      _export('EChartCtrl', EChartCtrl = function (_MetricsPanelCtrl) {
        _inherits(EChartCtrl, _MetricsPanelCtrl);

        function EChartCtrl($scope, $injector, $rootScope, templateSrv) {
          _classCallCheck(this, EChartCtrl);

          var _this = _possibleConstructorReturn(this, (EChartCtrl.__proto__ || Object.getPrototypeOf(EChartCtrl)).call(this, $scope, $injector));

          _this.$rootScope = $rootScope;
          _this.hiddenSeries = {};
          _this.templateSrv = templateSrv;

          var panelDefaults = {
            pieType: 'pie',
            legend: {
              show: true, // disable/enable legend
              values: true
            },
            links: [],
            datasource: null,
            maxDataPoints: 3,
            interval: null,
            targets: [{}],
            cacheTimeout: null,
            nullPointMode: 'connected',
            legendType: 'Under graph',
            breakPoint: '50%',
            aliasColors: {},
            format: 'short',
            valueName: 'current',
            strokeWidth: 1,
            fontSize: '80%',
            combine: {
              threshold: 0.0,
              label: 'Others'
            }
          };

          _.defaults(_this.panel, panelDefaults);
          _.defaults(_this.panel.legend, panelDefaults.legend);

          _this.events.on('render', _this.onRender.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));

          _this.setLegendWidthForLegacyBrowser();
          return _this;
        }

        _createClass(EChartCtrl, [{
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            var _this2 = this;

            this.addEditorTab('Data preview', JSONPreviewCtrl.buildDirective(function () {
              return _this2.data;
            }), 2);
            this.addEditorTab('Chart', OptionsTabCtrl.buildDirective(), 3);
            this.addEditorTab('Options preview', JSONPreviewCtrl.buildDirective(function () {
              return _this2.getChartOptions();
            }), 4);
            this.addEditorTab('Examples', 'public/plugins/grafana-echart-panel/examples.html');
            this.unitFormats = kbn.getUnitFormats();
          }
        }, {
          key: 'setUnitFormat',
          value: function setUnitFormat(subItem) {
            this.panel.format = subItem.value;
            this.render();
          }
        }, {
          key: 'onDataError',
          value: function onDataError() {
            this.onDataReceived([]);
            this.render();
          }
        }, {
          key: 'changeSeriesColor',
          value: function changeSeriesColor(series, color) {
            series.color = color;
            this.panel.aliasColors[series.alias] = series.color;
            this.render();
          }
        }, {
          key: 'onRender',
          value: function onRender() {
            // this.data = this.parseSeries(this.series);
          }
        }, {
          key: 'getChartOptions',
          value: function getChartOptions() {
            var fnc = new Function('data', 'return ' + this.panel.eoptions + ';');
            return fnc(this.data);
          }
        }, {
          key: 'parseSeries',
          value: function parseSeries(series) {
            var _this3 = this;

            return _.map(series, function (serie, i) {
              return {
                label: serie.alias,
                data: serie.stats[_this3.panel.valueName],
                color: _this3.panel.aliasColors[serie.alias] || _this3.$rootScope.colors[i],
                legendData: serie.stats[_this3.panel.valueName]
              };
            });
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            var series = dataList.map(this.seriesHandler.bind(this));
            var parsed = this.parseSeries(series);
            this.data = {
              raw: dataList,
              series: series,
              parsed: parsed
            };
            this.jsdata = JSON.stringify(this.data, null, 2);
            this.render(this.data);
          }
        }, {
          key: 'seriesHandler',
          value: function seriesHandler(seriesData) {
            var series = new TimeSeries({
              datapoints: seriesData.datapoints,
              alias: seriesData.target
            });

            series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
            return series;
          }
        }, {
          key: 'getDecimalsForValue',
          value: function getDecimalsForValue(value) {
            if (_.isNumber(this.panel.decimals)) {
              return { decimals: this.panel.decimals, scaledDecimals: null };
            }

            var delta = value / 2;
            var dec = -Math.floor(Math.log(delta) / Math.LN10);

            var magn = Math.pow(10, -dec);
            var norm = delta / magn; // norm is between 1.0 and 10.0
            var size;

            if (norm < 1.5) {
              size = 1;
            } else if (norm < 3) {
              size = 2;
              // special case for 2.5, requires an extra decimal
              if (norm > 2.25) {
                size = 2.5;
                ++dec;
              }
            } else if (norm < 7.5) {
              size = 5;
            } else {
              size = 10;
            }

            size *= magn;

            // reduce starting decimals if not needed
            if (Math.floor(value) === value) {
              dec = 0;
            }

            var result = {};
            result.decimals = Math.max(0, dec);
            result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

            return result;
          }
        }, {
          key: 'formatValue',
          value: function formatValue(value) {
            var decimalInfo = this.getDecimalsForValue(value);
            var formatFunc = kbn.valueFormats[this.panel.format];
            if (formatFunc) {
              return formatFunc(value, decimalInfo.decimals, decimalInfo.scaledDecimals);
            }
            return value;
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            ctrl.elem = elem;
            this.rendering = new EChartRendering(scope, elem, attrs, ctrl);
          }
        }, {
          key: 'toggleSeries',
          value: function toggleSeries(serie) {
            if (this.hiddenSeries[serie.label]) {
              delete this.hiddenSeries[serie.label];
            } else {
              this.hiddenSeries[serie.label] = true;
            }
            this.render();
          }
        }, {
          key: 'onLegendTypeChanged',
          value: function onLegendTypeChanged() {
            this.setLegendWidthForLegacyBrowser();
            this.render();
          }
        }, {
          key: 'setLegendWidthForLegacyBrowser',
          value: function setLegendWidthForLegacyBrowser() {
            var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
            if (isIE11 && this.panel.legendType === 'Right side' && !this.panel.legend.sideWidth) {
              this.panel.legend.sideWidth = 150;
            }
          }
        }]);

        return EChartCtrl;
      }(MetricsPanelCtrl));

      _export('EChartCtrl', EChartCtrl);

      EChartCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=echartCtrl.js.map
