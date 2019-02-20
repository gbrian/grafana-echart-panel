'use strict';

System.register(['./aceEditorCtrl'], function (_export, _context) {
  "use strict";

  var AceEditorCtrl, _createClass, AceEditorTabCtrl;

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
    setters: [function (_aceEditorCtrl) {
      AceEditorCtrl = _aceEditorCtrl.default;
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

      AceEditorTabCtrl = function (_AceEditorCtrl) {
        _inherits(AceEditorTabCtrl, _AceEditorCtrl);

        function AceEditorTabCtrl($scope, $injector, $rootScope, templateSrv) {
          _classCallCheck(this, AceEditorTabCtrl);

          return _possibleConstructorReturn(this, (AceEditorTabCtrl.__proto__ || Object.getPrototypeOf(AceEditorTabCtrl)).call(this, $scope, $injector, $rootScope, templateSrv));
        }

        _createClass(AceEditorTabCtrl, [{
          key: 'setValue',
          value: function setValue(val) {
            this.getDirective().dataFnc(val);
          }
        }, {
          key: 'getValue',
          value: function getValue() {
            return this.getDirective().dataFnc();
          }
        }, {
          key: 'getMode',
          value: function getMode() {
            return "ace/mode/" + this.getDirective().aceType;
          }
        }], [{
          key: 'buildDirective',
          value: function buildDirective(aceType, getset, init) {
            return function () {
              return {
                aceType: aceType,
                restrict: 'E',
                scope: true,
                dataFnc: getset,
                templateUrl: 'public/plugins/grafana-echart-panel/tabs/AceEditorTab.html',
                controller: AceEditorTabCtrl,
                init: init
              };
            };
          }
        }]);

        return AceEditorTabCtrl;
      }(AceEditorCtrl);

      _export('default', AceEditorTabCtrl);
    }
  };
});
//# sourceMappingURL=AceEditorTabCtrl.js.map
