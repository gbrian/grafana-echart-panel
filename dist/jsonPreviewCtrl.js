'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var _createClass, JSONPreviewCtrl;

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

      JSONPreviewCtrl = function () {
        function JSONPreviewCtrl($scope, $injector, $rootScope, templateSrv) {
          _classCallCheck(this, JSONPreviewCtrl);

          this.panelCtrl = $scope.ctrl;
          $scope.ctrl = this;
          this.panel = this.panelCtrl.panel;
          this.elem = this.panelCtrl.elem;
          this.ctx = $scope.editorTab.directiveFn();
          this.render();
        }

        _createClass(JSONPreviewCtrl, [{
          key: 'render',
          value: function render() {
            var data = this.ctx.dataFnc();
            var jdisplay = this.elem.find('.json-display');
            jdisplay.length && new JsonEditor(jdisplay, data, { defaultCollapsed: true });
          }
        }], [{
          key: 'buildDirective',
          value: function buildDirective(dataFnc) {
            return function () {
              return {
                restrict: 'E',
                scope: true,
                dataFnc: dataFnc,
                templateUrl: 'public/plugins/grafana-echart-panel/jsonPreview.html',
                controller: JSONPreviewCtrl
              };
            };
          }
        }]);

        return JSONPreviewCtrl;
      }();

      _export('default', JSONPreviewCtrl);
    }
  };
});
//# sourceMappingURL=jsonPreviewCtrl.js.map
