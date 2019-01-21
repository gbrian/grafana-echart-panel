import AceEditorCtrl from './aceEditorCtrl';

export default class AceEditorTabCtrl  extends AceEditorCtrl{
  constructor($scope, $injector, $rootScope, templateSrv){
    super($scope, $injector, $rootScope, templateSrv);
  }

  setValue(val){
    this.getDirective().dataFnc(val);
  }

  getValue(){
    return this.getDirective().dataFnc();
  }

  getMode(){
    return "ace/mode/" + this.getDirective().aceType;
  }

  static buildDirective(aceType, getset, init) {
    return () => ({
      aceType: aceType,
      restrict: 'E',
      scope: true,
      dataFnc: getset,
      templateUrl: 'public/plugins/grafana-echart-panel/tabs/AceEditorTab.html',
      controller: AceEditorTabCtrl,
      init: init
    });
  }
}
