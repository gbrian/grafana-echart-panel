'use strict';

System.register(['lodash', 'jquery', 'jquery.flot', 'jquery.flot.pie', './lib/jquery.json-editor.min', 'app/core/core', 'd3'], function (_export, _context) {
  "use strict";

  var _, $, appEvents, contextSrv, d3, _createClass, echart_panel__chart_class, EChartRendering;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_jqueryFlot) {}, function (_jqueryFlotPie) {}, function (_libJqueryJsonEditorMin) {}, function (_appCoreCore) {
      appEvents = _appCoreCore.appEvents;
      contextSrv = _appCoreCore.contextSrv;
    }, function (_d) {
      d3 = _d;
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

      echart_panel__chart_class = '.echart-panel__chart';

      EChartRendering = function () {
        function EChartRendering(scope, elem, attrs, ctrl) {
          _classCallCheck(this, EChartRendering);

          this.panel = ctrl.panel;
          this.elem = elem;
          this.ctrl = ctrl;
          this.scope = scope;
          this.init();
        }

        _createClass(EChartRendering, [{
          key: 'init',
          value: function init() {
            this.ctrl.events.on('render', this.onRender.bind(this));
            try {
              this.loadPlugins();
              // Shared crosshair and tooltip
              appEvents.on('graph-hover', this.onGraphHover.bind(this), this.scope);
              appEvents.on('graph-hover-clear', this.onGraphHoverClear.bind(this), this.scope);
            } catch (e) {
              console.error(e);
            }
          }
        }, {
          key: 'onGraphHoverClear',
          value: function onGraphHoverClear() {
            this.clearCrosshair();
          }
        }, {
          key: 'clearCrosshair',
          value: function clearCrosshair() {
            this.echart.dispatchAction({
              type: 'hideTip'
            });
          }
        }, {
          key: 'sharesToolTip',
          value: function sharesToolTip() {
            return !!this.getTimeAxis();
          }
        }, {
          key: 'getTimeAxis',
          value: function getTimeAxis() {
            return this.echart.getOption().xAxis.filter(function (x) {
              return x.type === "time";
            })[0];
          }
        }, {
          key: 'onGraphHover',
          value: function onGraphHover(event) {
            // ignore other graph hover events if shared tooltip is disabled
            if (this.sharesToolTip() && !this.ctrl.dashboard.sharedTooltipModeEnabled()) {
              return;
            }

            // ignore if we are the emitter
            if (event.panel.id === this.panel.id || this.ctrl.otherPanelInFullscreenMode()) {
              return;
            }
            if (this.ctrl.dashboard.graphTooltip !== 0) {
              this.drawSharedCrosshair(event.pos);
            }
          }
        }, {
          key: 'drawSharedCrosshair',
          value: function drawSharedCrosshair(pos) {
            var posX = this.xScale(pos.x);
            var posY = this.elem.offset().top + this.elem.height() * pos.panelRelY;
            this.echart.dispatchAction({
              type: 'showTip',
              x: posX,
              y: posY
            });
          }
        }, {
          key: 'loadAsset',
          value: function loadAsset(id, src) {
            src.endsWith(".js") ? this.createScript(id, src) : this.createLink(id, src);
          }
        }, {
          key: 'createLink',
          value: function createLink(id, src) {
            $('head').append('<link rel="stylesheet" id="' + id + '" href="' + src + '">');
          }
        }, {
          key: 'createScript',
          value: function createScript(id, src) {
            $('head').append('<script type="text/javascript" id="' + id + '" src="' + src + '"></script>');
          }
        }, {
          key: 'loadPlugins',
          value: function loadPlugins() {
            var _this = this;

            // TODO: Fix dependencies plugins load
            var plugins = [{ id: 'echarts', src: '/public/plugins/grafana-echart-panel/lib/echarts/echarts.min.js' }, { id: 'liquidfill', src: '/public/plugins/grafana-echart-panel/lib/echarts/liquidfill.min.js' }, { id: 'zrender', src: '/public/plugins/grafana-echart-panel/lib/echarts/zrender.min.js' }, { id: 'claygl', src: '/public/plugins/grafana-echart-panel/lib/echarts/claygl.min.js' }, { id: 'echarts-gl', src: '/public/plugins/grafana-echart-panel/lib/echarts/echarts-gl.min.js' }, { id: 'moment', src: '/public/plugins/grafana-echart-panel/lib/moment.min.js' }];
            plugins.filter(function (p) {
              return $('#' + p.id).length === 0;
            }).map(function (p) {
              return _this.loadAsset(p.id, p.src);
            });
          }
        }, {
          key: 'noDataPoints',
          value: function noDataPoints() {
            var html = '<div class="datapoints-warning"><span class="small">No data points</span></div>';
            this.elem.append(html);
          }
        }, {
          key: 'clearWarning',
          value: function clearWarning() {
            this.elem.find('.datapoints-warning').remove();
          }
        }, {
          key: 'addechart',
          value: function addechart() {
            var _this2 = this;

            if (!this.initEchart()) return;
            this.ctrl.getChartOptions().then(function (options) {
              if (!options) return;
              _this2.echart.setOption(options, true);
              _this2.echart.resize();
              _this2.xScale = d3.scaleTime().domain([_this2.ctrl.range.from, _this2.ctrl.range.to]).range([0, _this2.echart.getWidth()]);
              _this2.notify('echart-changed', { data: _this2.ctrl.data, echart: _this2.echart, options: options });
              _this2.panel.echartError = "";
            }).catch(function (e) {
              console.error(e);
              _this2.panel.echartError = e.toString() + '\r' + e.stack;
            });
            this.elem.find('.echart-error').text(this.panel.echartError);
          }
        }, {
          key: 'initEchart',
          value: function initEchart() {
            var markupDom = this.markupDom();
            var jchart = markupDom.is(echart_panel__chart_class) ? markupDom : markupDom.find(echart_panel__chart_class);
            if (!jchart.length) {
              return null;
            }
            if (!this.echart || !$('[_echarts_instance_="' + this.echart.id + '"]').length) {
              this.echart = echarts.init(jchart[0], this.ctrl.getTheme(), {
                renderer: this.panel.renderer || 'canvas'
              });
            }
            return this.echart;
          }
        }, {
          key: 'onRender',
          value: function onRender() {
            this.render(false);
          }
        }, {
          key: 'initMarkup',
          value: function initMarkup() {
            var markup = this.ctrl.getChartMarkup();
            if (markup === this.lastMarkup) return;
            try {
              var jmarkup = $(markup);
              this.resetNotify('init-markup');
              this.resetNotify('data-changed');
              this.resetNotify('echart-changed');
              this.elem.find('.echart-panel__html').empty().html(jmarkup);
              this.notify('init-markup', { data: this.ctrl.data });
              this.lastMarkup = markup;
            } catch (e) {
              console.log(e);
            }
          }
        }, {
          key: 'markupDom',
          value: function markupDom() {
            return $('#' + this.ctrl.getPanelIdCSS());
          }
        }, {
          key: 'resetNotify',
          value: function resetNotify(type) {
            this.markupDom().off(type);
          }
        }, {
          key: 'notify',
          value: function notify(type, data) {
            this.markupDom().trigger(type, data);
          }
        }, {
          key: 'render',
          value: function render(incrementRenderCounter) {
            var _this3 = this;

            if (!this.ctrl.data || !this.ctrl.data.raw.length) {
              this.noDataPoints();
              return;
            }
            if (echarts === undefined || echarts.init === undefined) {
              setTimeout(function () {
                return _this3.render(incrementRenderCounter);
              }, 500);
              return;
            }

            this.clearWarning();
            this.initMarkup();
            this.notify('data-changed', { data: this.ctrl.data });
            this.addechart();

            if (incrementRenderCounter) {
              this.ctrl.renderingCompleted();
            }
          }
        }]);

        return EChartRendering;
      }();

      _export('default', EChartRendering);
    }
  };
});
//# sourceMappingURL=rendering.js.map
