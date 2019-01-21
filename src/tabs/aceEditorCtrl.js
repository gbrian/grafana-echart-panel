const DEFAULT_THEME_DARK = 'ace/theme/grafana-dark';
const DEFAULT_THEME_LIGHT = 'ace/theme/textmate';
import config from 'app/core/config';

export default class AceEditorCtrl {
  constructor($scope, $injector, $rootScope, templateSrv) {
    this.$scope = $scope;
    this.panelCtrl = $scope.ctrl;
    $scope.ctrl = this;
    this.panel = this.panelCtrl.panel;
    this.elem = this.panelCtrl.elem;
    this.editor = null;
    this.beautify = ace.acequire("ace/ext/beautify");
    this.renderChartOptions();
  }
  
  getDirective(){
    return this.$scope.editorTab.directiveFn();
  }

  init(editor, session){
    var _initf = this.getDirective().init;
    _initf && _initf(editor, session);
  }

  loadAutocomplete(){
    var lnTools = ace.acequire('ace/ext/language_tools');
    var keywords = {"grid": 108210,"series": 1161721,"pie": 173151,"legend": 278319,"right": 12224,"tooltip": 188049,"xAxis": 374619,"bar": 182040,"label": 163527,"emphasis": 50000,"formatter": 62138,"line": 306801,"data": 232156,"left": 24464,"top": 18094,"scatter": 48954,"type": 92134,"yAxis": 238764,"axisLabel": 73604,"legendHoverLink": 14243,"textStyle": 129159,"hoverAnimation": 9062,"dataZoom": 90999,"nameLocation": 15800,"nameTextStyle": 30596,"nameGap": 14640,"singleAxis": 15977,"splitLine": 30047,"nameRotate": 10483,"inverse": 12997,"boundaryGap": 18533,"clockwise": 4411,"lineStyle": 81857,"selectedOffset": 2984,"width": 17962,"slider": 28321,"dataBackground": 2287,"areaStyle": 19428,"color": 94439,"height": 7954,"orient": 17218,"align": 10373,"symbol": 35613,"xAxisIndex": 15405,"stack": 10602,"clipOverflow": 3229,"center": 9827,"padding": 12855,"itemStyle": 143518,"itemGap": 11914,"shadowBlur": 17233,"shadowColor": 13929,"normal": 211293,"borderColor": 20648,"shadowOffsetX": 11499,"shadowOffsetY": 9210,"opacity": 12301,"heatmap": 13825,"value": 21111,"fillerColor": 797,"borderWidth": 15576,"itemWidth": 7123,"effectScatter": 31179,"coordinateSystem": 15302,"axisLine": 53628,"axisTick": 38765,"selectedMode": 15177,"fontSize": 14906,"inactiveColor": 5720,"selected": 10921,"gauge": 55176,"markLine": 65539,"handleStyle": 1852,"borderType": 5717,"title": 158568,"show": 82000,"length": 4814,"zlevel": 22293,"labelPrecision": 746,"position": 48349,"labelFormatter": 727,"alignWithLabel": 3785,"interval": 28810,"showDetail": 694,"yAxisIndex": 10560,"showDataShadow": 591,"realtime": 2611,"onZero": 3690,"silent": 22883,"radar": 61070,"axisPointer": 23175,"trigger": 15344,"barCategoryGap": 3511,"splitNumber": 19992,"inside": 32482,"name": 61072,"showSymbol": 4778,"containLabel": 6413,"offset": 15619,"max": 12538,"backgroundColor": 32864,"visualMap": 95262,"fontStyle": 14443,"fontWeight": 11970,"fontFamily": 10141,"symbolSize": 21077,"blurSize": 360,"geo": 65283,"radius": 8533,"markArea": 19906,"map": 102385,"brush": 29508,"parallel": 20673,"parallelAxis": 13713,"gridIndex": 20650,"piecewise": 25231,"showContent": 6960,"zoom": 3997,"polar": 23175,"controller": 2892,"radiusAxis": 24146,"angleAxis": 18771,"toolbox": 101543,"timeline": 34619,"precision": 3306,"curveness": 1378,"x": 2753,"valueIndex": 2807,"itemHeight": 5180,"icon": 10336,"valueDim": 2013,"symbolOffset": 10017,"y": 1590,"transitionDuration": 3814,"radarIndex": 715,"extraCssText": 3640,"animation": 17864,"animationThreshold = 2000": 11727,"minInterval": 11278,"animationDelay": 7620,"layoutCenter": 2348,"animationDurationUpdate": 6972,"animationEasingUpdate": 6816,"animationDelayUpdate": 6642,"symbolRotate": 10221,"feature": 50238,"axis": 1794,"crossStyle": 1830,"funnel": 11042,"scaleLimit": 4792,"roam": 7112,"itemSize": 1966,"showTitle": 1851,"smooth": 5185,"saveAsImage": 9915,"showAllSymbol": 3417,"polarIndex": 5235,"graph": 76898,"layout": 2633,"excludeComponents": 447,"restore": 3693,"dataView": 10258,"magicType": 10505,"iconStyle": 9088,"nodeScaleRatio": 892,"hoverLayerThreshold": 6480,"textAlign": 9402,"splitArea": 16447,"nameMap": 4584,"text": 11691,"pixelRatio": 357,"readOnly": 491,"optionToContent": 936,"lang": 549,"textareaColor": 233,"textareaBorderColor": 177,"option": 2003,"seriesIndex": 4483,"back": 199,"rect": 323,"polygon": 254,"min": 16646,"scale": 14303,"logBase": 7456,"start": 2889,"z": 15867,"link": 5348,"textBaseline": 4210,"subtext": 5086,"sublink": 2618,"subtarget": 2373,"subtextStyle": 7732,"triggerEvent": 9175,"blendMode": 6359,"progressiveThreshold": 4699,"continuous": 42105,"lines": 31608,"markPoint": 81254,"roseType": 4221,"animationEasing": 8836,"animationDuration": 9562,"calculable": 3953,"progressive": 5761,"treemap": 16948,"links": 9573,"edgeSymbol": 1211,"bottom": 13969,"edges": 1122,"edgeLabel": 1685,"edgeSymbolSize": 769,"focusNodeAdjacency": 888,"draggable": 965,"force": 5601,"geoIndex": 2856,"circular": 1862,"avoidLabelOverlap": 3694,"target": 5476,"coord": 3995,"startValue": 2182,"triggerOn": 6741,"showDelay": 3535,"alwaysShowContent": 4928,"enterable": 3871,"hideDelay": 3018,"step": 3437,"detail": 5434,"startAngle": 5421,"handleIcon": 1051,"handleSize": 932,"zoomLock": 1979,"throttle": 1757,"boxplot": 6233,"candlestick": 14005,"sankey": 10101,"loop": 678,"rewind": 439,"controlStyle": 1269,"labelLine": 17838,"distance": 452,"rotate": 4666,"margin": 4342,"barWidth": 6641,"category": 1318,"barGap": 4832,"nodes": 2085,"pieces": 2683,"smoothMonotone": 2203,"itemSymbol": 882,"axisType": 902,"currentIndex": 583,"effectType": 1364,"areaColor": 2808,"showEffectOn": 1285,"rippleEffect": 3617,"minAngle": 2527,"barMaxWidth": 3073,"rotateLabel": 523,"dimension": 1922,"end": 1426,"inRange": 4604,"outOfRange": 2262,"checkpointStyle": 1036,"sampling": 2458,"regions": 6273,"large": 1055,"showLegendSymbol": 1600,"layoutSize": 1981,"mapValueCalculation": 1447,"categories": 4362,"indicator": 2995,"barBorderRadius": 1455,"range": 2009,"connectNulls": 3411,"pointer": 2665,"effect": 5446,"parallelAxisDefault": 927,"coords": 750,"shadowStyle": 1670,"largeThreshold": 754,"hoverLink": 1276,"repulsion": 865,"textGap": 1121,"breadcrumb": 828,"baseline": 1316,"endAngle": 895,"period": 1153,"brushType": 1421,"minOpacity": 216,"brushLink": 913,"brushMode": 465,"transformable": 418,"brushStyle": 507,"throttleType": 448,"throttleDelay": 369,"removeOnClick": 648,"inBrush": 500,"outOfBrush": 466,"offsetCenter": 981,"barMinHeight": 2279,"parallelIndex": 235,"nodeClick": 732,"source": 869,"color0": 210,"filterMode": 2252,"tiled": 352,"autoPlay": 496,"playInterval": 440,"sort": 484,"polyline": 929,"initLayout": 966,"controlPosition": 408,"children": 89,"contentToOption": 590,"maxOpacity": 215,"squareRatio": 281,"leafDepth": 347,"zoomToNodeRatio": 300,"childrenVisibleMin": 303,"shape": 1054,"length2": 891,"endValue": 1107,"gravity": 634,"edgeLength": 662,"layoutAnimation": 485,"colorAlpha": 389,"constantSpeed": 451,"trailLength": 530,"dim": 313,"areaSelectStyle": 253,"funnelAlign": 334,"buttonTextColor": 177,"buttonColor": 205,"levels": 2267,"textColor": 178,"lineX": 46,"lineY": 32,"showPlayBtn": 64,"showPrevBtn": 43,"showNextBtn": 43,"playIcon": 90,"stopIcon": 48,"prevIcon": 39,"nextIcon": 36,"ellipsis": 76,"clear": 114,"colorMappingBy": 424,"maxSize": 131,"minSize": 147,"gap": 175,"visibleMin": 315,"axisExpandable": 134,"layoutIterations": 226,"nodeGap": 158,"nodeWidth": 134,"axisExpandCenter": 79,"axisExpandCount": 56,"axisExpandWidth": 51,"boxWidth": 46,"gapWidth": 78,"borderColorSaturation": 56,"inactiveOpacity": 51,"keep": 41,"colorSaturation": 343,"visualDimension": 471,"id": 138,"borderColor0": 67,"emptyItemWidth": 60,"activeOpacity": 43,"radiusAxisIndex": 574,"angleAxisIndex": 478,"textPosition": 232,"minOpen": 194,"maxOpen": 125,"graphic": 5617,"elements": 3108,"image": 673,"group": 488,"$action": 82,"style": 431,"textVeticalAlign": 13,"fill": 55,"stroke": 47,"lineWidth": 34,"sector": 93,"bezier-curve": 6,"cpx2": 1,"cpy2": 1,"circle": 256,"arc": 61,"bezierCurve": 61,"onclick": 101,"onmouseover": 32,"font": 17,"bounding": 75,"cursor": 54,"themeRiver": 11,"confine": 580,"ring": 103,"ondragleave": 3,"ondragstart": 4,"ondragover": 4,"disabled": 221,"visualMin": 44,"visualMax": 18,"onmousemove": 14,"ondrag": 8,"ondragend": 2,"x2": 7,"x1": 4,"y1": 2,"y2": 3,"percent": 6,"ondrop": 9,"cx": 7,"smoothConstraint": 20,"cpx1": 2,"points": 16,"onmousewheel": 13,"onmouseout": 7,"barBorderWidth": 2,"ondragenter": 2,"onmouseup": 1,"cy": 1,"r": 2,"onmousedown": 1,"animationThreshold": 1};
    var fullKeywordsList = ["0","1","title","show","text","link","target","textStyle","color","fontStyle","fontWeight","fontFamily","fontSize","textAlign","textBaseline","subtext","sublink","subtarget","subtextStyle","padding","itemGap","zlevel","z","left","top","right","bottom","backgroundColor","borderColor","borderWidth","shadowBlur","shadowColor","shadowOffsetX","shadowOffsetY","legend","width","height","orient","align","itemWidth","itemHeight","formatter","selectedMode","inactiveColor","selected","tooltip","data","name","icon","grid","containLabel","trigger","axisPointer","type","axis","snap","label","precision","margin","lineStyle","opacity","shadowStyle","crossStyle","position","extraCssText","xAxis","gridIndex","offset","nameLocation","nameTextStyle","nameGap","nameRotate","inverse","boundaryGap","min","max","scale","splitNumber","minInterval","interval","logBase","silent","triggerEvent","axisLine","onZero","axisTick","alignWithLabel","inside","length","axisLabel","rotate","showMinLabel","showMaxLabel","baseline","splitLine","splitArea","areaStyle","value","tiggerTooltip","status","handle","size","throttle","yAxis","polar","center","radius","radiusAxis","polarIndex","angleAxis","startAngle","clockwise","radar","shape","indicator","dataZoom","disabled","xAxisIndex","yAxisIndex","radiusAxisIndex","angleAxisIndex","filterMode","start","end","startValue","endValue","minSpan","maxSpan","minValueSpan","maxValueSpan","zoomLock","dataBackground","fillerColor","handleIcon","handleSize","handleStyle","borderType","labelPrecision","labelFormatter","showDetail","showDataShadow","realtime","visualMap","range","calculable","textGap","dimension","seriesIndex","hoverLink","inRange","outOfRange","controller","pieces","categories","minOpen","maxOpen","showLabel","itemSymbol","showContent","alwaysShowContent","triggerOn","showDelay","hideDelay","enterable","confine","transitionDuration","toolbox","itemSize","showTitle","feature","saveAsImage","excludeComponents","iconStyle","normal","textPosition","emphasis","pixelRatio","restore","dataView","readOnly","optionToContent","contentToOption","lang","textareaColor","textareaBorderColor","textColor","buttonColor","buttonTextColor","zoom","back","magicType","line","bar","stack","tiled","option","brush","rect","polygon","lineX","lineY","keep","clear","brushLink","geoIndex","brushType","brushMode","transformable","brushStyle","throttleType","throttleDelay","removeOnClick","inBrush","outOfBrush","geo","map","roam","aspectScale","boundingCoords","scaleLimit","nameMap","itemStyle","layoutCenter","layoutSize","regions","areaColor","parallel","layout","axisExpandable","axisExpandCenter","axisExpandCount","axisExpandWidth","axisExpandTriggerOn","parallelAxisDefault","parallelAxis","dim","parallelIndex","areaSelectStyle","singleAxis","timeline","axisType","currentIndex","autoPlay","rewind","loop","playInterval","controlPosition","symbol","symbolSize","symbolRotate","symbolOffset","checkpointStyle","animation","animationDuration","animationEasing","controlStyle","showPlayBtn","showPrevBtn","showNextBtn","playIcon","stopIcon","prevIcon","nextIcon","graphic","elements","id","$action","bounding","invisible","cursor","draggable","progressive","children","onclick","onmouseover","onmouseout","onmousemove","onmousewheel","onmousedown","onmouseup","ondrag","ondragstart","ondragend","ondragenter","ondragleave","ondragover","ondrop","style","image","x","y","fill","stroke","lineWidth","font","textVeticalAlign","cx","cy","r","r0","endAngle","points","smooth","smoothConstraint","x1","y1","x2","y2","percent","cpx1","cpy1","cpx2","cpy2","calendar","cellSize","dayLabel","firstDay","monthLabel","yearLabel","series","coordinateSystem","showSymbol","showAllSymbol","hoverAnimation","legendHoverLink","connectNulls","clipOverflow","step","smoothMonotone","sampling","markPoint","valueIndex","valueDim","coord","animationThreshold","animationDelay","animationDurationUpdate","animationEasingUpdate","animationDelayUpdate","markLine","curveness","markArea","barBorderRadius","barWidth","barMaxWidth","barMinHeight","barGap","barCategoryGap","selectedOffset","minAngle","roseType","avoidLabelOverlap","stillShowZeroSum","labelLine","length2","animationType","large","largeThreshold","effectType","showEffectOn","rippleEffect","period","radarIndex","squareRatio","leafDepth","nodeClick","zoomToNodeRatio","levels","visualDimension","visualMin","visualMax","colorAlpha","colorSaturation","colorMappingBy","visibleMin","childrenVisibleMin","ellipsis","gapWidth","borderColorSaturation","breadcrumb","emptyItemWidth","boxWidth","barMinWidth","color0","borderColor0","blurSize","minOpacity","maxOpacity","mapValueCalculation","showLegendSymbol","inactiveOpacity","activeOpacity","polyline","effect","delay","constantSpeed","trailLength","coords","circular","rotateLabel","force","initLayout","repulsion","gravity","edgeLength","layoutAnimation","nodeScaleRatio","focusNodeAdjacency","edgeSymbol","edgeSymbolSize","edgeLabel","category","nodes","links","source","edges","nodeWidth","nodeGap","layoutIterations","minSize","maxSize","sort","gap","funnelAlign","distance","pointer","offsetCenter","detail","symbolPosition","symbolRepeat","symbolRepeatDirection","symbolMargin","symbolClip","symbolBoundingData","symbolPatternSize","singleAxisIndex","date","progressiveThreshold","blendMode","hoverLayerThreshold","useUTC"];

    for (var i = 0; i < fullKeywordsList.length; i++) {
        if (keywords[fullKeywordsList[i]] == null) {
            keywords[fullKeywordsList[i]] = 0;
        }
    }
    var completions = [];
    for (var key in keywords) {
        completions.push({
            caption: key,
            value: key,
            score: keywords[key],
            metal: 'local'
        });
    }
    lnTools.addCompleter({
        getCompletions: function (editor, session, pos, prefix, callback) {
            callback(null, completions);
        }
    });
  }

  getMode(){
    return "ace/mode/json";
  }

  formatCode(){
    this.beautify(this.editor.session);
  }

  renderChartOptions() {
    this.loadAutocomplete();
    var jdata = this.elem.find('.ace-editor');
    if (jdata.length === 0 || jdata.children().length !== 0) {
      return;
    }
    var editor = this.editor = ace.edit(jdata[0]);
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    var session = editor.getSession();
    session.setMode(this.getMode());
    session.setTabSize(2);
    session.setUseWrapMode(true);
    var tout = null;
    var onChange = () => {
      tout = null;
      this.setValue(session.getValue());
      this.panelCtrl.render();
    };
    session.on('change', () =>{
      tout && window.clearTimeout(tout);
      tout = window.setTimeout(onChange, 2000);
    });
    var value = this.getValue();
    value && editor.setValue(value);
    this.setThemeMode(editor);
    this.init(editor, session);
  }

  setThemeMode(editor) {
    let theme = DEFAULT_THEME_DARK;
    if (config.bootData.user.lightTheme) {
      theme = DEFAULT_THEME_LIGHT;
    }

    editor.setTheme(theme);
  }
}
