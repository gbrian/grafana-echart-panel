var example = (function getOptions(data, asset) {
    /**
     * data: Same as tab "Data". Can be process by event 'data-changed'
     * asset: Access to echart utils to load resources 
     */
    var options = {
        backgroundColor: 'transparent',
        tooltip:{
          show: true,
          formatter: value => '<div class="graph-tooltip grafana-tooltip">'+
                              '    <div class="graph-tooltip-time">'+moment(value.data[0]).format('YYYY-MM-DD hh:mm:ss')+'</div>'+
                              '    <div class="graph-tooltip-list-item graph-tooltip-list-item--highlight">'+
                              '        <div class="graph-tooltip-series-name"><i class="fa fa-minus" style="color:#7EB26D;">'+
                              '            </i> '+value.seriesName+':</div><div class="graph-tooltip-value">'+value.data[1]+'</div>'+
                              '    </div>'+
                              '</div>'
        },
        xAxis: {
            type: 'time',
            splitLine:{
              show: true,
              lineStyle:{
                width: 1,
                type: 'solid',
                opacity: 0.3
              }
            }
        },
        yAxis: {
            type: 'value',
            splitLine:{
              show: true,
              lineStyle:{
                width: 1,
                type: 'solid',
                opacity: 0.3
              }
            }
        },
        series: [{
            data: data.raw[0].datapoints.map(r => [r[1], r[0]]),
            type: 'line'
        }]
    };
    // Return options
    return options;
    // Or promise: return new Promise((res, rej) => res(options));
})
export default function(){
    return example.toString();
}