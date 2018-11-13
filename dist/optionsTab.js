'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var _createClass, OptionsTabCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
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

      OptionsTabCtrl = function () {
        function OptionsTabCtrl($scope, $injector, $rootScope, templateSrv) {
          _classCallCheck(this, OptionsTabCtrl);

          this.panelCtrl = $scope.ctrl;
          $scope.ctrl = this;
          this.panel = this.panelCtrl.panel;
          this.elem = this.panelCtrl.elem;
          this.renderChartOptions();
        }

        _createClass(OptionsTabCtrl, [{
          key: 'renderChartOptions',
          value: function renderChartOptions() {
            var _this = this;

            var jdata = this.elem.find('.json-ace-editor');
            if (jdata.length === 0 || jdata.children().length !== 0) {
              return;
            }
            var editor = ace.edit(jdata[0]);
            var session = editor.getSession();
            session.setMode("ace/mode/json");
            session.setTabSize(2);
            session.setUseWrapMode(true);
            var tout = null;
            var onChange = function onChange() {
              tout = null;
              _this.panel.eoptions = session.getValue();
              _this.panelCtrl.render();
            };
            session.on('change', function () {
              tout && window.clearTimeout(tout);
              tout = window.setTimeout(onChange, 2000);
            });
            editor.setTheme("ace/theme/ambience");
            editor.setValue(this.panel.eoptions);
          }
        }], [{
          key: 'buildDirective',
          value: function buildDirective() {
            return function () {
              return {
                restrict: 'E',
                scope: true,
                templateUrl: 'public/plugins/grafana-echart-panel/optionsTab.html',
                controller: OptionsTabCtrl
              };
            };
          }
        }]);

        return OptionsTabCtrl;
      }();

      _export('default', OptionsTabCtrl);
    }
  };
});
//# sourceMappingURL=optionsTab.js.map
