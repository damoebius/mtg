var fs = require("fs");
var cheerio = require('cheerio')
var file="data/black.html";
var output = "output.csv"


var parseCode = function (input){
  var result = input.trim();
  result = result.split("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/mana_r.png\">").join("[r]");
    result = result.split("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/tap.png\">").join("[t]");
    result = result.split("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/mana_b.png\">").join("[b]");
    result = result.split("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/mana_g.png\">").join("[g]");
    result = result.split("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/mana_w.png\">").join("[w]");
    result = result.split("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/mana_1.png\">").join("[1]");
    result = result.split("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/mana_2.png\">").join("[2]");
    result = result.split("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/mana_3.png\">").join("[3]");
    result = result.split("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/mana_4.png\">").join("[4]");
    result = result.split("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/mana_5.png\">").join("[5]");
    result = result.replace(/\n/gi,"").replace(/\r/gi,"").replace(/;/gi,"").replace(/ +(?= )/g,'');
  return result;
}

var content = fs.readFileSync(file,"utf8");
var $ = cheerio.load(content);
var elms = [];
$( ".itemContentWrapper" ).each(function( index ) {
    var el = {};
    el.name = $(".productDetailTitle a",this).html();
    var cost = "";
    $(".productDetailCastCost img",this).each(function( index ) {
        var url = $(this).attr("src");
        cost += "["+url.substr(url.indexOf(".") - 1,1)+"]";
    });
    el.cost = cost;
    el.type = $(".productDetailType",this).text().trim();
    if(el.type.indexOf("/") > 0 ){
        el.attack = el.type.substr(el.type.indexOf("/") - 1,1);
        el.defence = el.type.substr(el.type.indexOf("/") + 1,1);
    }
    el.description = parseCode( $(".detailFlavortext td",this).html() );
    console.log( el );
    elms.push(el);
});

for(var i = 0; i< elms.length; i++){
    var el = elms[i];
    fs.appendFileSync(output, el.name+";"+el.cost+";"+el.type+";"+el.attack+";"+el.defence+";"+el.description+"\r\n");
}

