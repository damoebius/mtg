var fs = require("fs");
var cheerio = require('cheerio')
var file="data/red.html";
var output = "output.csv"


var parseCode = function (input){
  var result = input.trim();
  result = result.replace("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/mana_r.png\">","[r]");
    result = result.replace("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/tap.png\">","[t]");
    result = result.replace("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/mana_r.png\">","[b]");
    result = result.replace("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/mana_r.png\">","[g]");
    result = result.replace("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/mana_r.png\">","[w]");
    result = result.replace("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/mana_r.png\">","[R]");
    result = result.replace("<img style=\"margin:1px;\" src=\"/media/images/web/mana_symbols/mana_r.png\">","[R]");
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

