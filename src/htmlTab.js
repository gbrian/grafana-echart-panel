import AceEditorCtrl from './aceEditorCtrl';

export default class HTMLTabCtrl extends AceEditorCtrl{
  constructor($scope, $injector, $rootScope, templateSrv){
    super($scope, $injector, $rootScope, templateSrv);
  }

  setValue(val){
    this.panel.html = val;
  }

  getValue(){
    return this.panel.html;
  }

  static buildDirective(){
    return () => ({
      restrict: 'E',
      scope: true,
      templateUrl: 'public/plugins/grafana-echart-panel/htmlTab.html',
      controller: HTMLTabCtrl,
    });
  }
}
