import _ from 'lodash';
import $ from 'jquery';
import 'jquery.flot';
import 'jquery.flot.pie';
import './lib/jquery.json-editor.min';
//import echarts from './lib/echarts/echarts.min';
//import liquidfill from './lib/echarts/liquidfill.min';

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
    try{
      this.loadPlugins();
    }catch(e){
      console.error(e);
    }
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
      { id: 'liquidfill', src: '/public/plugins/grafana-echart-panel/lib/echarts/liquidfill.min.js' }
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
    if(!this.initEchart()) return;
    try{
      var options = this.ctrl.getChartOptions();
      this.echart.setOption(options, true);
      this.echart.resize();
      this.notify('echart-changed',
                        {data:this.ctrl.data, echart:this.echart, options: options});
    }catch(e){
      console.error(e);
    }
  }

  initEchart() {
    var jchart = this.elem.find('.echart-panel__chart');
    if(!jchart.length){
      return null;
    }
    if(!this.echart || !$(`[_echarts_instance_="${this.echart.id}"]`).length){
        this.echart = echarts.init(jchart[0],
          this.panel.theme, {
            renderer: this.panel.renderer || 'canvas'
          });
      }
    return this.echart;
  }

  onRender() {
    this.render(false);
  }

  initMarkup(){
    var markup = this.ctrl.getChartMarkup();
    if(markup === this.lastMarkup)
      return;
    try{
      var jmarkup = $(markup);
      this.resetNotify('init-markup');
      this.resetNotify('echart-changed');
      this.elem.find('.echart-panel__html')
        .empty()
        .html(jmarkup);
      this.notify('init-markup', {data:this.ctrl.data});
      this.lastMarkup = markup;
    }catch(e){
      console.log(e);
    }
  }

  resetNotify(type){
    this.elem.off(type);
  }
  notify(type, data){
    this.elem.trigger(type, data);
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
    this.addechart();

    if (incrementRenderCounter) {
      this.ctrl.renderingCompleted();
    }
  }
}
