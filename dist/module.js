'use strict';

System.register(['./echartCtrl', 'app/plugins/sdk'], function (_export, _context) {
  "use strict";

  var EChartCtrl, loadPluginCss;
  return {
    setters: [function (_echartCtrl) {
      EChartCtrl = _echartCtrl.EChartCtrl;
    }, function (_appPluginsSdk) {
      loadPluginCss = _appPluginsSdk.loadPluginCss;
    }],
    execute: function () {

      loadPluginCss({
        dark: 'plugins/grafana-echart-panel/css/echart.dark.css',
        light: 'plugins/grafana-echart-panel/css/echart.light.css'
      });

      _export('PanelCtrl', EChartCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
