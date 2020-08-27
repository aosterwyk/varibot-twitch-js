function isMod(checkMsg) {
    if(checkMsg.mod){return true;}
    else if(checkMsg.badges && checkMsg.badges.broadcaster) {return true;}
    else{return false;}
}

module.exports.isMod = isMod; 
