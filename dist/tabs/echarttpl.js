'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var example;

    _export('default', function () {
        return example.toString();
    });

    return {
        setters: [],
        execute: function () {
            example = function getOptions(data, asset) {
                /**
                 * data: Same as tab "Data". Can be process by event 'data-changed'
                 * asset: Access to echart utils to load resources 
                 */
                var options = {
                    backgroundColor: 'transparent',
                    xAxis: {
                        type: 'time',
                        data: data._data.xAxis
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: data._data.series,
                        type: 'line'
                    }]
                };
                // Return options
                return options;
                // Or promise: return new Promise((res, rej) => res(options));
            };
        }
    };
});
//# sourceMappingURL=echarttpl.js.map
