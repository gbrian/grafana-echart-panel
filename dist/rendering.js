'use strict';

System.register(['lodash', 'jquery', 'jquery.flot', 'jquery.flot.pie', './lib/jquery.json-editor.min'], function (_export, _context) {
  "use strict";

  var _, $, _createClass, EChartRendering;

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
    }, function (_jqueryFlot) {}, function (_jqueryFlotPie) {}, function (_libJqueryJsonEditorMin) {}],
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
            } catch (e) {
              console.error(e);
            }
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
            var plugins = [{ id: 'echarts', src: '/public/plugins/grafana-echart-panel/lib/echarts/echarts.min.js' }, { id: 'liquidfill', src: '/public/plugins/grafana-echart-panel/lib/echarts/liquidfill.min.js' }];
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
            if (!this.initEchart()) return;
            try {
              var options = this.ctrl.getChartOptions();
              this.echart.setOption(options, true);
              this.echart.resize();
              this.notify('echart-changed', { data: this.ctrl.data, echart: this.echart, options: options });
            } catch (e) {
              console.error(e);
            }
          }
        }, {
          key: 'initEchart',
          value: function initEchart() {
            var jchart = this.elem.find('.echart-panel__chart');
            if (!jchart.length) {
              return null;
            }
            if (!this.echart || !$('[_echarts_instance_="' + this.echart.id + '"]').length) {
              this.echart = echarts.init(jchart[0], this.panel.theme, {
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
              this.resetNotify('echart-changed');
              this.elem.find('.echart-panel__html').empty().html(jmarkup);
              this.notify('init-markup', { data: this.ctrl.data });
              this.lastMarkup = markup;
            } catch (e) {
              console.log(e);
            }
          }
        }, {
          key: 'resetNotify',
          value: function resetNotify(type) {
            this.elem.off(type);
          }
        }, {
          key: 'notify',
          value: function notify(type, data) {
            this.elem.trigger(type, data);
          }
        }, {
          key: 'render',
          value: function render(incrementRenderCounter) {
            var _this2 = this;

            if (!this.ctrl.data || !this.ctrl.data.raw.length) {
              this.noDataPoints();
              return;
            }
            if (echarts === undefined || echarts.init === undefined) {
              setTimeout(function () {
                return _this2.render(incrementRenderCounter);
              }, 500);
              return;
            }

            this.clearWarning();
            this.initMarkup();
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
