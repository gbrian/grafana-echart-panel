'use strict';

System.register(['app/plugins/sdk', 'lodash', 'app/core/utils/kbn', 'app/core/time_series', 'app/core/config', './rendering', './tabs/AceEditorTabCtrl', './tabs/echarttpl', './tabs/htmltpl', './tabs/htmljstpl', './tabs/csstpl'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, _, kbn, TimeSeries, config, EChartRendering, AceEditorTabCtrl, EChartOptions, HtmlTemplate, HtmlJSTemplate, HtmlCSSTemplate, _createClass, EChartCtrl;

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
    }, function (_appCoreConfig) {
      config = _appCoreConfig.default;
    }, function (_rendering) {
      EChartRendering = _rendering.default;
    }, function (_tabsAceEditorTabCtrl) {
      AceEditorTabCtrl = _tabsAceEditorTabCtrl.default;
    }, function (_tabsEcharttpl) {
      EChartOptions = _tabsEcharttpl.default;
    }, function (_tabsHtmltpl) {
      HtmlTemplate = _tabsHtmltpl.default;
    }, function (_tabsHtmljstpl) {
      HtmlJSTemplate = _tabsHtmljstpl.default;
    }, function (_tabsCsstpl) {
      HtmlCSSTemplate = _tabsCsstpl.default;
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
            links: [],
            interval: null,
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
            },
            html: HtmlTemplate(),
            htmlJS: HtmlJSTemplate(),
            htmlCSS: HtmlCSSTemplate(),
            eoptions: EChartOptions(),
            echartError: ''
          };

          _.defaults(_this.panel, panelDefaults);

          _this.events.on('render', _this.onRender.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('init-panel-actions', _this.onInitPanelActions.bind(_this));

          _this.setLegendWidthForLegacyBrowser();
          return _this;
        }

        _createClass(EChartCtrl, [{
          key: 'getTheme',
          value: function getTheme() {
            return config.bootData.user.lightTheme ? 'light' : 'dark';
          }
        }, {
          key: 'onInitPanelActions',
          value: function onInitPanelActions(actions) {
            actions.push({ text: 'Export CSV', click: 'ctrl.exportCsv()' });
          }
        }, {
          key: 'exportCsv',
          value: function exportCsv() {
            var scope = this.$scope.$new(true);
            scope.seriesList = this.data.series;
            this.publishAppEvent('show-modal', {
              templateHtml: '<export-data-modal data="seriesList"></export-data-modal>',
              scope: scope,
              modalClass: 'modal--narrow'
            });
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            var _this2 = this;

            var initTab = 2;
            var tabs = [['Data', this.dataPreviewGetSet()], ['HTML', this.htmlPreviewGetSet()], ['JS', this.jsPreviewGetSet()], ['CSS', this.cssPreviewGetSet()], ['EChart options', this.optionsPreviewGetSet()]];
            _.map(tabs, function (kv, ix) {
              return _this2.addEditorTab(kv[0], kv[1], initTab + ix);
            });

            this.unitFormats = kbn.getUnitFormats();
          }
        }, {
          key: 'dataPreviewGetSet',
          value: function dataPreviewGetSet() {
            var _this3 = this;

            return AceEditorTabCtrl.buildDirective('json', function (val) {
              if (val !== undefined) _this3.data = JSON.parse(val);
              return JSON.stringify(_this3.data, null, 2);
            }, function (editor, session) {
              return session.foldAll(1);
            });
          }
        }, {
          key: 'htmlPreviewGetSet',
          value: function htmlPreviewGetSet() {
            var _this4 = this;

            return AceEditorTabCtrl.buildDirective('html', function (val) {
              if (val !== undefined) _this4.panel.html = val;
              return _this4.panel.html;
            });
          }
        }, {
          key: 'jsPreviewGetSet',
          value: function jsPreviewGetSet() {
            var _this5 = this;

            return AceEditorTabCtrl.buildDirective('javascript', function (val) {
              if (val !== undefined) _this5.panel.htmlJS = val;
              return _this5.panel.htmlJS;
            });
          }
        }, {
          key: 'cssPreviewGetSet',
          value: function cssPreviewGetSet() {
            var _this6 = this;

            return AceEditorTabCtrl.buildDirective('css', function (val) {
              if (val !== undefined) _this6.panel.htmlCSS = val;
              return _this6.panel.htmlCSS;
            });
          }
        }, {
          key: 'optionsPreviewGetSet',
          value: function optionsPreviewGetSet() {
            var _this7 = this;

            return AceEditorTabCtrl.buildDirective('javascript', function (val) {
              if (val !== undefined) _this7.panel.eoptions = val;
              return _this7.panel.eoptions;
            });
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
          key: 'getChartMarkup',
          value: function getChartMarkup() {
            var markup = this.panel.html + ('<script type="text/javascript">' + this.panel.htmlJS + '</script>') + ('<style>' + this.panel.htmlCSS + '</style>');
            return this.replaceVariables(markup);
          }
        }, {
          key: 'asset',
          value: function asset(url) {
            return '/public/plugins/grafana-echart-panel/lib/' + url;
          }
        }, {
          key: 'getChartOptions',
          value: function getChartOptions() {
            try {
              var eoptions = this.replaceVariables(this.panel.eoptions);
              var fnc = new Function("return " + eoptions)();
              var res = fnc.bind(this)(this.data, this.asset.bind(this));
              return res && res.then ? res : Promise.resolve(res);
            } catch (e) {
              return Promise.reject(e);
            }
          }
        }, {
          key: 'parseSeries',
          value: function parseSeries(series) {
            var _this8 = this;

            return _.map(series, function (serie, i) {
              return {
                label: serie.alias,
                data: serie.stats[_this8.panel.valueName],
                color: _this8.panel.aliasColors[serie.alias] || _this8.$rootScope.colors[i],
                legendData: serie.stats[_this8.panel.valueName]
              };
            });
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            var series = _.map(dataList, this.seriesHandler.bind(this)).filter(function (r) {
              return r;
            });
            var parsed = this.parseSeries(series);
            this.data = {
              raw: dataList,
              series: series,
              parsed: parsed,
              table: _.map(dataList, this.tableHandler.bind(this))
            };
            this.jsdata = JSON.stringify(this.data, null, 2);
            this.render(this.data);
          }
        }, {
          key: 'tableHandler',
          value: function tableHandler(seriesData) {
            if (!seriesData.columns) return [];
            var columns = _.map(seriesData.columns, function (c) {
              return c.text;
            });
            return _.map(seriesData.rows, function (r) {
              return columns.reduce(function (acc, v, ix) {
                return acc[v] = r[ix];
              }, {});
            });
          }
        }, {
          key: 'seriesHandler',
          value: function seriesHandler(seriesData) {
            if (!seriesData.datapoints) return null;

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
        }, {
          key: 'getPanelIdCSS',
          value: function getPanelIdCSS() {
            return 'panel_markup_' + this.panel.id;
          }
        }, {
          key: 'internalReplace',
          value: function internalReplace(text) {
            var _this9 = this;

            return text.replace(/\$__[a-zA-Z0-9_]+/g, function (v) {
              switch (v) {
                case "$__panelId":
                  return _this9.getPanelIdCSS();
              }
              return v;
            });
          }
        }, {
          key: 'replaceVariables',
          value: function replaceVariables(text) {
            if (text) {
              text = this.internalReplace(text);
              text = this.templateSrv.replace(text, this.panel.scopedVars);
            }
            return text;
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
