import { EChartCtrl } from './echartCtrl';
import { loadPluginCss } from 'app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/grafana-echart-panel/css/echart.dark.css',
  light: 'plugins/grafana-echart-panel/css/echart.light.css',
});

export { EChartCtrl as PanelCtrl };
