import {MetricsPanelCtrl} from 'app/plugins/sdk';
import _ from 'lodash';
import kbn from 'app/core/utils/kbn';
import TimeSeries from 'app/core/time_series';
import config from 'app/core/config';
import EChartRendering from './rendering';
import OptionsTabCtrl from './optionsTab';
import JSONPreviewCtrl from './jsonPreviewCtrl';
import HTMLTabCtrl from './htmlTab';

export class EChartCtrl extends MetricsPanelCtrl {

  constructor($scope, $injector, $rootScope, templateSrv) {
    super($scope, $injector);
    this.$rootScope = $rootScope;
    this.hiddenSeries = {};
    this.templateSrv = templateSrv;

    var panelDefaults = {
      links: [],
      datasource: null,
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
      },
      html: ['<div id="$__panelId" class="echart-panel__chart"></div>',
              '<script> $("#$__panelId").one("init-markup", function(ev, data){}) </script>',
              '<script> $("#$__panelId").one("echart-changed", function(ev, data){}) </script>'
            ].join('\r\n'),
      echartError: ''
    };

    _.defaults(this.panel, panelDefaults);

    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));

    this.setLegendWidthForLegacyBrowser();
  }

  getTheme(){
    return config.bootData.user.lightTheme ? 'light': 'dark';
  }

  onInitEditMode() {
    this.addEditorTab('Data preview', JSONPreviewCtrl.buildDirective(() => this.data), 2);
    this.addEditorTab('HTML', HTMLTabCtrl.buildDirective(), 3);
    this.addEditorTab('Chart', OptionsTabCtrl.buildDirective(), 4);
    this.addEditorTab('Options preview', JSONPreviewCtrl.buildDirective(() => this.getChartOptions()), 5);
    this.addEditorTab('Examples', 'public/plugins/grafana-echart-panel/examples.html');
    this.unitFormats = kbn.getUnitFormats();
  }

  setUnitFormat(subItem) {
    this.panel.format = subItem.value;
    this.render();
  }

  onDataError() {
    this.onDataReceived([]);
    this.render();
  }

  changeSeriesColor(series, color) {
    series.color = color;
    this.panel.aliasColors[series.alias] = series.color;
    this.render();
  }

  onRender() {
    // this.data = this.parseSeries(this.series);
  }

  getChartMarkup(){
    return this.replaceVariables(this.panel.html);
  }

  asset(url){
    return `/public/plugins/grafana-echart-panel/lib/${url}`;
  }

  getChartOptions(){
    try{
      var eoptions = this.replaceVariables(this.panel.eoptions);
      var fnc = new Function('data', 'asset', `return ${eoptions};`);
      var res = fnc(this.data, this.asset.bind(this));
      return (res && res.then) ? res: Promise.resolve(res);
    }catch(e){
      return Promise.reject(e);
    }
  }

  parseSeries(series) {
    return _.map(series, (serie, i) => {
      return {
        label: serie.alias,
        data: serie.stats[this.panel.valueName],
        color: this.panel.aliasColors[serie.alias] || this.$rootScope.colors[i],
        legendData: serie.stats[this.panel.valueName],
      };
    });
  }

  onDataReceived(dataList) {
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

  seriesHandler(seriesData) {
    var series = new TimeSeries({
      datapoints: seriesData.datapoints,
      alias: seriesData.target
    });

    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
    return series;
  }

  getDecimalsForValue(value) {
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
    if (Math.floor(value) === value) { dec = 0; }

    var result = {};
    result.decimals = Math.max(0, dec);
    result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

    return result;
  }

  formatValue(value) {
    var decimalInfo = this.getDecimalsForValue(value);
    var formatFunc = kbn.valueFormats[this.panel.format];
    if (formatFunc) {
      return formatFunc(value, decimalInfo.decimals, decimalInfo.scaledDecimals);
    }
    return value;
  }

  link(scope, elem, attrs, ctrl) {
    ctrl.elem = elem;
    this.rendering = new EChartRendering(scope, elem, attrs, ctrl);
  }

  toggleSeries(serie) {
    if (this.hiddenSeries[serie.label]) {
      delete this.hiddenSeries[serie.label];
    } else {
      this.hiddenSeries[serie.label] = true;
    }
    this.render();
  }

  onLegendTypeChanged() {
    this.setLegendWidthForLegacyBrowser();
    this.render();
  }

  setLegendWidthForLegacyBrowser() {
    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    if (isIE11 && this.panel.legendType === 'Right side' && !this.panel.legend.sideWidth) {
      this.panel.legend.sideWidth = 150;
    }
  }
  getPanelIdCSS(){
    return `panel_markup_${this.panel.id}`;
  }
  internalReplace(text){
    return text.replace(/\$__[a-zA-Z0-9_]+/g, v =>{
      switch(v){
        case "$__panelId":
          return this.getPanelIdCSS();
      }
      return v;
    });
  }
  replaceVariables(text){
    if(text){
      text = this.internalReplace(text);
      text = this.templateSrv.replace(text, this.panel.scopedVars);
    }
    return text;
  }
}

EChartCtrl.templateUrl = 'module.html';
