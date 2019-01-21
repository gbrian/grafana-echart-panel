export default function(){
    return [
        '$("#$__panelId").one("init-markup", function(ev, data){\r\n\t/*Your html initialization here*/\r\n})',
        '$("#$__panelId").one("echart-changed", function(ev, data){\r\n\t/*echart options changed*/\r\n})',
        '$("#$__panelId").on("data-changed", function(ev, data){\r\n\t/*Panel refresh*/',
        '\tdata.data._data = {};',
        '\tdata.data._data.xAxis = data.data.raw[0].datapoints.map(dt => new Date(dt[1]));',
        '\tdata.data._data.series = data.data.raw[0].datapoints.map(dt => dt[0]);',
        '})'].join('\r\n');
}