
export default class OptionsTabCtrl {
  constructor($scope, $injector, $rootScope, templateSrv) {
    this.panelCtrl = $scope.ctrl;
    $scope.ctrl = this;
    this.panel = this.panelCtrl.panel;
    this.elem = this.panelCtrl.elem;
    this.renderChartOptions();
  }

  renderChartOptions() {
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
    var onChange = () => {
      tout = null;
      this.panel.eoptions = session.getValue();
      this.panelCtrl.render();
    };
    session.on('change', () =>{
      tout && window.clearTimeout(tout);
      tout = window.setTimeout(onChange, 2000);
    });
    editor.setTheme("ace/theme/ambience");
    editor.setValue(this.panel.eoptions);
  }

  static buildDirective() {
    return () => ({
      restrict: 'E',
      scope: true,
      templateUrl: 'public/plugins/grafana-echart-panel/optionsTab.html',
      controller: OptionsTabCtrl,
    });
  }
}
