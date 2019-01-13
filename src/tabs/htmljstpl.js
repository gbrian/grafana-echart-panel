export default function(){
    return [
        '$("#$__panelId").one("init-markup", function(ev, data){\r\n\t/*Your html initialization here*/\r\n})',
        '$("#$__panelId").one("echart-changed", function(ev, data){\r\n\t/*echart options changed*/\r\n})',
        '$("#$__panelId").on("data-changed", function(ev, data){\r\n\t/*Panel refresh*/\r\n})'].join('\r\n');
}