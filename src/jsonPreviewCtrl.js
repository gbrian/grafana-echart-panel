
export default class JSONPreviewCtrl {
  constructor($scope, $injector, $rootScope, templateSrv) {
    this.panelCtrl = $scope.ctrl;
    $scope.ctrl = this;
    this.panel = this.panelCtrl.panel;
    this.elem = this.panelCtrl.elem;
    this.ctx = $scope.editorTab.directiveFn();
    this.render();
  }

  render(){
    var data = this.ctx.dataFnc();
    var jdisplay = this.elem.find('.json-display');
    jdisplay.length &&
        new JsonEditor(jdisplay, data, { defaultCollapsed: true });
  }

  static buildDirective(dataFnc) {
    return () => ({
      restrict: 'E',
      scope: true,
      dataFnc: dataFnc,
      templateUrl: 'public/plugins/grafana-echart-panel/jsonPreview.html',
      controller: JSONPreviewCtrl,
    });
  }
}
