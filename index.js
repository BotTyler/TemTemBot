const Discord = require('discord.js')
const client = new Discord.Client()
const puppeteer = require("puppeteer")
var loading = 1;
const table = [[1,1,1,1,1,1,.5,1,1,1,1,1],
               [1,.5,.5,2,1,.5,1,1,1,1,2,1],
               [1,2,.5,.5,1,2,1,1,2,1,1,.5],
               [1,.5,2,.5,1,2,1,1,1,1,1,.5],
               [1,1,2,.5,.5,.5,2,2,2,1,.5,1],
               [1,2,.5,.5,2,1,1,.5,1,1,2,1],
               [2,1,1,1,1,1,1,1,1,2,.5,1],
               [1,1,1,1,.5,1,1,.5,1,1,1,2],
               [1,1,1,1,1,1,2,1,2,2,1,1],
               [1,1,1,1,1,2,.5,1,1,.5,2,1],
               [1,.5,1,1,2,.5,2,1,1,1,1,1],
               [1,1,2,2,1,.5,1,1,.5,1,.5,.5]];

var key = function(obj){
    switch(obj){
        case "neutral":
            return 0;
            break;
        case "fire":
            return 1;
            break;
        case "water":
            return 2;
            break;
        case "nature":
            return 3;
            break;
        case "electric":
            return 4;
            break;
        case "earth":
            return 5;
            break;
        case "mental":
            return 6;
            break;
        case "wind":
            return 7;
                break;
        case "digital":
            return 8;
            break;
        case "melee":
            return 9;
            break;
        case "crystal":
            return 10;
            break;
        case "toxic":
            return 11;
            break;
      default:
        return -1
        break;
    }
}

const typeEnum = Object.freeze({"neutral":0, "fire":1,"water":2,"nature":3,"electric":4,"earth":5,"mental":6,"wind":7,"digital":8,"melee":9,"crystal":10,"toxic":11})
var TEMTEM = {
    name: "NAN",
    type1: "NAN",
    type2: "NAN",
};
var ListOfTem;

async function scrape(url){

    loading = 1;
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(url);
    console.log("Starting data collection");
    var data = await page.evaluate(() => {
        
        var d = document.getElementById("mw-content-text");
        var table = d.getElementsByClassName("wikitable sortable temtem-list jquery-tablesorter").item(0).getElementsByTagName("tbody").item(0);
        var rows = table.getElementsByTagName("tr")


        var listOfTemTem = new Array();
        for(var counter = 0; counter < rows.length; counter ++){
            var TEMTEM = new Object();
            //var counter =  64;
            var col = rows.item(counter).getElementsByTagName("td");
            var tName = col.item(1).getElementsByTagName("a").item(1).innerHTML;

            TEMTEM.name = tName;

            var tType = col.item(2);
            var num = tType.outerHTML.indexOf("colspan=\"2\"");
            
            if(num == -1){
                //2 different col
                
                TEMTEM.type1 = tType.getElementsByTagName("a").item(1).innerHTML;
                tType = col.item(3);
                TEMTEM.type2 = tType.getElementsByTagName("a").item(1).innerHTML;

                
            }else{
                // same col
                TEMTEM.type1 = tType.getElementsByTagName("a").item(1).innerHTML;
                TEMTEM.type2 = tType.getElementsByTagName("a").item(1).innerHTML;
            }
            listOfTemTem.push(TEMTEM);
        }
       
        return listOfTemTem;


    });
    
    

    browser.close();
    console.log("DATA COLLECTION COMPLETE"); 
    ListOfTem = data
    loading = 0;
   
}


function printArray(){
    for(var counter = 0; counter < table.length; counter ++){
        var s = "";
        for(var index = 0; index < table[counter].length; index++){
            s += table[counter][index] + " ";
        }
        console.log(s);

    }
}


function calcDmg(row, t1, t2){
  if(t1 == -1 || t2 == -1)
    return -1;
  
    if(t1 == t2){
        return table[row][t1];
    }else{
        
        return table[row][t1] * table[row][t2];
    }
}

function sprite(t){
    switch(t){
        case "neutral":
            return "<:neutral:832662107936915486>";
        break;
        case "fire":
            return "<:fire:832662108033646612>";
        break;
        case "water":
            return "<:water:832662108318859344>";
        break;
        case "nature":
            return "<:nature:832662107941371964>";
        break;
        case "electric":
            return "<:electric:832662081413054474>";
        break;
        case "earth":
            return "<:earth:832662107979513906>";
        break;
        case "mental":
            return "<:mental:832662107748171838>";
        break;
        case "wind":
            return "<:wind:832662107694301207>";
        break;
        case "digital":
            return "<:digital:832662074575290378>";
        break;
        case "melee":
            return "<:melee:832662107652227133>";
        break;
        case "crystal":
            return "<:crystal:832662039553900545>";
        break;
        case "toxic":
            return "<:toxic:832662108268396664>";
        break;
        case 1:
            return 1;
        break;
        case 2:
            return 2;
        break;
        case 4:
            return 4;
        break;
        case .5:
            return .5;
        break;
        case .25:
            return .25;
        break;
        }
}


scrape("https://temtem.fandom.com/wiki/Temtem_(creatures)").catch(error => {
    console.log(error);
});

function refresh(){

    scrape("https://temtem.fandom.com/wiki/Temtem_(creatures)").catch(error => {
    console.log(error);
    });
    return;
}


client.on("ready", () => {
    console.log('The client is ready tag=' + client.user.tag)
})

client.on("message", msg => {


    var s = msg.content.split(" ");
    
    if(s[0].toUpperCase() === "TEM"){
        if(ListOfTem == null || loading == 1){
            msg.reply("BOT IS STARTING UP!");
            return;
        }
      if(s.length == 1){
        msg.reply("Please specify a temtem");
        return;
      }
      if(s[1].toUpperCase() === "ele"){
          var k = key(s[2]);
          var message = "";
        if(k == -1)
          return;
        message+=sprite("neutral") + " = "+ table[0][key] + "\n";
        message+=sprite("fire") + " = "+ table[1][key] + "\n";
        message+=sprite("water") + " = "+ table[2][key] + "\n";
        message+=sprite("nature") + " = "+ table[3][key] + "\n";
        message+=sprite("electric") + " = "+ table[4][key] + "\n";
        message+=sprite("earth") + " = "+ table[5][key] + "\n";
        message+=sprite("mental") + " = "+ table[6][key] + "\n";
        message+=sprite("wind") + " = "+ table[7][key] + "\n";
        message+=sprite("digital") + " = "+ table[8][key] + "\n";
        message+=sprite("melee") + " = "+ table[9][key] + "\n";
        message+=sprite("crystal") + " = "+ table[10][key] + "\n";
        message+=sprite("toxic") + " = "+ table[11][key] + "\n";
        
      }
        for(var index = 1; index < s.length; index ++){
            if(s[index].toLowerCase() === "cyka"){
                msg.reply("BLYAT");
                return;
            }
            if(s[index].toLowerCase() === "refresh" && loading == 0){
                msg.reply("REFRESHING LIST");
                refresh();
                msg.reply("LIST HAS BEEN REFRESHED");
                return;
            }
            for(var counter = 0; counter < ListOfTem.length; counter ++){
                
                if(s[index].toLowerCase() === ListOfTem[counter].name.toLowerCase()){
                    var message = "Found TEMTEM \'" + ListOfTem[counter].name+"\'"+"\nPrimary: "+sprite(ListOfTem[counter].type1.toLowerCase()) +"\tSecondary: "+sprite(ListOfTem[counter].type2.toLowerCase())+"\n";
                    
                    
                        message+=sprite("neutral") + " = "+ sprite(calcDmg(0, key(ListOfTem[counter].type1.toLowerCase()),key(ListOfTem[counter].type2.toLowerCase()))) + "\n";
                        message+=sprite("fire") + " = "+ sprite(calcDmg(1, key(ListOfTem[counter].type1.toLowerCase()),key(ListOfTem[counter].type2.toLowerCase()))) + "\n";
                        message+=sprite("water") + " = "+ sprite(calcDmg(2, key(ListOfTem[counter].type1.toLowerCase()),key(ListOfTem[counter].type2.toLowerCase()))) + "\n";
                        message+=sprite("nature") + " = "+ sprite(calcDmg(3, key(ListOfTem[counter].type1.toLowerCase()),key(ListOfTem[counter].type2.toLowerCase()))) + "\n";
                        message+=sprite("electric") + " = "+ sprite(calcDmg(4, key(ListOfTem[counter].type1.toLowerCase()),key(ListOfTem[counter].type2.toLowerCase()))) + "\n";
                        message+=sprite("earth") + " = "+ sprite(calcDmg(5, key(ListOfTem[counter].type1.toLowerCase()),key(ListOfTem[counter].type2.toLowerCase()))) + "\n";
                        message+=sprite("mental") + " = "+ sprite(calcDmg(6, key(ListOfTem[counter].type1.toLowerCase()),key(ListOfTem[counter].type2.toLowerCase()))) + "\n";
                        message+=sprite("wind") + " = "+ sprite(calcDmg(7, key(ListOfTem[counter].type1.toLowerCase()),key(ListOfTem[counter].type2.toLowerCase()))) + "\n";
                        message+=sprite("digital") + " = "+ sprite(calcDmg(8, key(ListOfTem[counter].type1.toLowerCase()),key(ListOfTem[counter].type2.toLowerCase()))) + "\n";
                        message+=sprite("melee") + " = "+ sprite(calcDmg(9, key(ListOfTem[counter].type1.toLowerCase()),key(ListOfTem[counter].type2.toLowerCase()))) + "\n";
                        message+=sprite("crystal") + " = "+ sprite(calcDmg(10, key(ListOfTem[counter].type1.toLowerCase()),key(ListOfTem[counter].type2.toLowerCase()))) + "\n";
                        message+=sprite("toxic") + " = "+ sprite(calcDmg(11, key(ListOfTem[counter].type1.toLowerCase()),key(ListOfTem[counter].type2.toLowerCase()))) + "\n";

                    
                    msg.reply(message);
                    break;
                }

            }
            if(counter == ListOfTem.length){
                    
                msg.reply("Could not find the temtem \'"+s[index]+"\'");
            }
        }
    }
});

client.login(process.env.DJS_TOKEN);

