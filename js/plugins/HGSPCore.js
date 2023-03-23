/*:
* @plugindesc 技能点与技能相关
* @author Lars
*/
var HGSPCore = window.HGSPCore || {};

HGSPCore.point = [0];   //同上，=技能点数，然后清除技能点

HGSPCore.GainSP = function(id,count){
    var actor = $gameActors.actor(id);
    var name = actor._name;
    if(!actor._point) actor._point = 0;
    actor._point += count;

    $gameMessage.newPage();
    $gameMessage.add(name + "获得了" + count + "个技能点！");
}
HGSPCore.GainPP = function(count){
    $gameMessage.add("获得了" + count + "个属性点！");
    $gameParty.gainItem($dataItems[9],count);  //9号道具：属性点
}
Game_Actor.prototype.point = function() {
    return this._point?this._point:0;
};

HGSPCore.GameActor_displayLevelUp = Game_Actor.prototype.displayLevelUp;
Game_Actor.prototype.displayLevelUp = function(newSkills) {
    HGSPCore.GameActor_displayLevelUp.call(this,newSkills);
    var id = this._actorId;
    var actor = $gameActors.actor(id);
    if(!actor._levelup) actor._levelup = 1;
    var count = this._level - actor._levelup;
    actor._levelup = this._level;

    HGSPCore.GainSP(id,count);
    if(id === 1) HGSPCore.GainPP(2 * count);
}

HGSPCore.IsLearned = function(actorid,skillid){
    var actor = $gameActors.actor(actorid);
    var name = $dataSkills[skillid].name;
    if(actor.isLearnedSkill(skillid)){
        $gameMessage.newPage();
        $gameMessage.add("您已学会「" + name + "」哦（＾▽＾）");
        return true;
    }
    return false;
}

HGSPCore.LearnSkill = function(actorid,skillid,count){
    var actor = $gameActors.actor(actorid);
    var name = $dataSkills[skillid].name;
    var sp = actor._point;
    
    if(count <= sp){
        actor.learnSkill(skillid);
        $gameMessage.add("习得技能「" + name + "」");
        $gameSwitches.setValue(40,0);
        actor._point -= count;
    }else{
        $gameMessage.add("你的技能点不足哦(￣y▽,￣)╭ ");
    }
}

HGSPCore.ChangeTarget = function(){
    var member = $gameParty.members();
    var choice = [];
    var list = [];
    for(var i = 0; i < member.length; i++)
        if(member[i]._actorId != 1){
            choice.push(member[i]._name);
            list.push(member[i]._actorId);
        }
    choice.push("取消");
    
    $gameMessage.add("当前正在由 " + $gameActors.actor($gameVariables.value(70))._name + " 学习技能");
    $gameMessage.add("要改由哪个角色学习技能呢？");
    $gameMessage.setChoices(choice, choice.length, 0)
    $gameMessage.setChoiceCallback(function(x){
        if(x < choice.length - 1) $gameVariables.setValue(70,list[x]);
    })
}

HGSPCore.skill = {"id":0,"cd":0,"need":0,"formula":""};
HGSPCore.ShowSkills = function(){
    var id = HGSPCore.skill.id;
    var name = $dataSkills[id].name;
    var cd = HGSPCore.skill.cd;
    var need = HGSPCore.skill.need;
    var des = $dataSkills[id].description;
    var formula = HGSPCore.skill.formula;
    
    $gameMessage.newPage();
    $gameMessage.add("\\n<" + name + ">CD:" + cd + "   需要技能点：" + need);
    if(formula != "")$gameMessage.add(formula);
    $gameMessage.add(des);
}

HGSPCore.ShowSkillsEX = function(skillname){
    var id = HGSPCore.skill.id;
    var name = $dataSkills[id].name;
    var cd = HGSPCore.skill.cd;
    var need = HGSPCore.skill.need;
    var des = $dataSkills[id].description;
    var formula = HGSPCore.skill.formula;
    
    $gameMessage.newPage();
    $gameMessage.add("\\n<" + name + ">CD:" + cd + "   需要技能点：" + need + "   需要任意伙伴学会" + skillname);
    if(formula != "")$gameMessage.add(formula);
    $gameMessage.add(des);
}



HGSPCore.lightline2 = function(list1,list2){

    if($gameVariables.value(70) === 0) $gameVariables.setValue(70,1);
    for(var i = 0; i < $gameParty.members().length; i++){
        var actor = $gameParty.members()[i];
        
        for(var j = 0; j < list1.length; j++){
            
            if(list1[j].count){
                var need = list1[j].count;
                for(var k = 0; k < list1[j].need.length; k++){
                    if(actor.isLearnedSkill(list1[j].need[k])){
                        need--;
                        if(need === 0){
                            $gameSwitches.setValue(21 + j, 1);
                            break;
                        }
                    }
                }
            }else{
                if(actor.isLearnedSkill(list1[j])){
                    $gameSwitches.setValue(21 + j, 1);
                }
            }
        }
    }
    for (var i = 0; i < list2.length; i++){
        var actor = $gameActors.actor(1);
        if(actor.isLearnedSkill(list2[i])){
            $gameSwitches.setValue(21 + list1.length + i, 1);
        }
    }
}






