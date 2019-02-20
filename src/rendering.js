import _ from 'lodash';
import $ from 'jquery';
import 'jquery.flot';
import 'jquery.flot.pie';
import './lib/jquery.json-editor.min';
import { appEvents, contextSrv } from 'app/core/core';
import * as d3 from 'd3';

const echart_panel__chart_class = '.echart-panel__chart';

export default class EChartRendering {
  constructor(scope, elem, attrs, ctrl) {
    this.panel = ctrl.panel;
    this.elem = elem;
    this.ctrl = ctrl;
    this.scope = scope;
    this.init();
  }

  init() {
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

  onGraphHoverClear() {
    this.clearCrosshair();
  }
  clearCrosshair() {
    this.echart.dispatchAction({
      type: 'hideTip'
    });
  }

  sharesToolTip() {
    return !!this.getTimeAxis();
  }

  getTimeAxis() {
    return this.echart.getOption()
      .xAxis
      .filter(x => x.type === "time")[0];
  }

  onGraphHover(event) {
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

  drawSharedCrosshair(pos) {
    var posX = this.xScale(pos.x);
    var posY = this.elem.offset().top + (this.elem.height() * pos.panelRelY);
    this.echart.dispatchAction({
      type: 'showTip',
      x: posX,
      y: posY
    })
  }

  loadAsset(id, src) {
    src.endsWith(".js") ?
      this.createScript(id, src) :
      this.createLink(id, src);
  }

  createLink(id, src) {
    $('head').append(`<link rel="stylesheet" id="${id}" href="${src}">`);
  }

  createScript(id, src) {
    $('head').append(`<script type="text/javascript" id="${id}" src="${src}"></script>`);
  }

  loadPlugins() {
    // TODO: Fix dependencies plugins load
    const plugins = [
      { id: 'echarts', src: '/public/plugins/grafana-echart-panel/lib/echarts/echarts.min.js' },
      { id: 'liquidfill', src: '/public/plugins/grafana-echart-panel/lib/echarts/liquidfill.min.js' },
      { id: 'zrender', src: '/public/plugins/grafana-echart-panel/lib/echarts/zrender.min.js' },
      { id: 'claygl', src: '/public/plugins/grafana-echart-panel/lib/echarts/claygl.min.js' },
      { id: 'echarts-gl', src: '/public/plugins/grafana-echart-panel/lib/echarts/echarts-gl.min.js' },
      { id: 'moment', src: '/public/plugins/grafana-echart-panel/lib/moment.min.js'}
    ];
    plugins.filter(p => $(`#${p.id}`).length === 0)
      .map(p => this.loadAsset(p.id, p.src));
  }

  noDataPoints() {
    var html = '<div class="datapoints-warning"><span class="small">No data points</span></div>';
    this.elem.append(html);
  }

  clearWarning() {
    this.elem.find('.datapoints-warning').remove();
  }

  addechart() {
    if (!this.initEchart()) return;
    this.ctrl.getChartOptions()
      .then(options => {
        if(!options) return;
        this.echart.setOption(options, true);
        this.echart.resize();
        this.xScale = d3
          .scaleTime()
          .domain([this.ctrl.range.from, this.ctrl.range.to])
          .range([0, this.echart.getWidth()]);
        this.notify('echart-changed',
          { data: this.ctrl.data, echart: this.echart, options: options });
        this.panel.echartError = "";
      })
      .catch(e => {
        console.error(e);
        this.panel.echartError = `${e.toString()}\r${e.stack}`;
      });
    this.elem.find('.echart-error').text(this.panel.echartError);
  }

  initEchart() {
    var markupDom = this.markupDom();
    var jchart = markupDom.is(echart_panel__chart_class) ?
      markupDom : markupDom.find(echart_panel__chart_class);
    if (!jchart.length) {
      return null;
    }
    if (!this.echart || !$(`[_echarts_instance_="${this.echart.id}"]`).length) {
      this.echart = echarts.init(jchart[0],
        this.ctrl.getTheme(), {
          renderer: this.panel.renderer || 'canvas'
        });
    }
    return this.echart;
  }

  onRender() {
    this.render(false);
  }

  initMarkup() {
    var markup = this.ctrl.getChartMarkup();
    if (markup === this.lastMarkup)
      return;
    try {
      var jmarkup = $(markup);
      this.resetNotify('init-markup');
      this.resetNotify('data-changed');
      this.resetNotify('echart-changed');
      this.elem.find('.echart-panel__html')
        .empty()
        .html(jmarkup);
      this.notify('init-markup', { data: this.ctrl.data });
      this.lastMarkup = markup;
    } catch (e) {
      console.log(e);
    }
  }

  markupDom() {
    return $(`#${this.ctrl.getPanelIdCSS()}`);
  }

  resetNotify(type) {
    this.markupDom().off(type);
  }
  notify(type, data) {
    this.markupDom().trigger(type, data);
  }

  render(incrementRenderCounter) {
    if (!this.ctrl.data || !this.ctrl.data.raw.length) {
      this.noDataPoints()
      return;
    }
    if (echarts === undefined ||
      echarts.init === undefined) {
      setTimeout(() => this.render(incrementRenderCounter), 500);
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
}
