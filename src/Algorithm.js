import {Character} from "./Character"

/**
 * Divides the characterData in batches to be picked from, with a max length of either maxLength  OR  that it can be done in 4 batches OR if characterData is little, 2
 * @param {[Character]} characterData the current characters that are being handled
 * @param {number} maxLength the max number of characters in a list
 */
export function divideData(characterData, maxLength){
    let usedMaxLength = Math.min(characterData.length / 4, maxLength)
    let mixedCharacterData = shuffleList([...characterData])
    if(characterData.length  < 6){
        usedMaxLength = 2
    }
    let reslist = []
    let currentIndex = 0
    let iteration = 0
    while(currentIndex < characterData.length &&iteration < 10 ){
        let newList = getAfewCharacters(mixedCharacterData, currentIndex, usedMaxLength)
        reslist.push(newList)
        currentIndex += newList.length
        iteration += 1
    }
    return reslist
}
/**
 * Shuffles an array (doesnt clone)
 * @param {[any]} array array to shuffle
 * @returns the array
 */
function shuffleList(array){
    let currentIndex = array.length;
    while(currentIndex >0){
        let rndIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[rndIndex]] = [array[rndIndex], array[currentIndex]]

    }
    return array;
}

/**
 * help function with dividing the characterData in batches to be picked from
 * @param {[Character]} characterData the character list
 * @param {number} currentIndex  the current index where we are taking characters from
 * @param {number} maxlength the max number of characters in a list   (unless there are 3 or less elements left, then 3 are used)
 * @returns a list of maximum maxlength of characters from chardata
 */
function getAfewCharacters(characterData, currentIndex, maxlength){
    let useMaxLength = maxlength
    if(characterData.length -currentIndex < 2 * maxlength){
          useMaxLength = (characterData.length - currentIndex) / 2
    }
    if(characterData.length - currentIndex < 4){
        useMaxLength = 4
    }
    let resList = []
    for(let i = 0; i < useMaxLength && currentIndex < characterData.length; i++, currentIndex++){
        resList[i] = characterData[currentIndex]
    }
    return resList  
}


/**
 * Gets the names from a True/False array (uses apple)
 * @param {[Character]} cCharacters 
 * @param {[boolean]} choicesList
 * @returns {[number]} ids chosen of the character
 */
export function processApple(cCharacters, choicesList){
    if(cCharacters.length != choicesList.length){
        throw Error('ccCharacters and choiceList arent same length in processApple' )
    }
    let resApple = []
    for(let i = 0;i<choicesList.length;i++){
      if(choicesList[i]){
        resApple.push(cCharacters[i].id)
      }
    }
    for(let i = 0;i < resApple.length; i++){
      for(let j = 0; j < cCharacters.length; j++){
        if(!choicesList[j]){
          cCharacters[j].parents.push(resApple[i])
        }
      }
    }
    return resApple
}

/**
 * Reverts the choices made,  basically opposite of processApple, basically just wipes the parents array
 * @param {[Character]} oldCharacters 
 */
export function processAppleBackward(cCharacters){
    //just fully clears parents for now, think this should be enough forever
    for(let i = 0; i < cCharacters.length;i++){
        cCharacters[i].parents =[]
    }

}

/**
 * gets all the characters that have parents.length == 0
 * @param {[Character]} cCharacters all characters in this level
 * @returns {[Character]} the characters who are in the next level (characters without parents)
 */
export function getNextLevelCharacters(cCharacters){
    let res = []
        for(let i = 0; i < cCharacters.length;i++){
            if(cCharacters[i].parents.length==0 && !cCharacters[i].isRanked){
                res.push(cCharacters[i])
            }
        }
    
    return res
}

/**
 * Removes characterP from every parentlist of every character in allCharacters
 * @param {[Character]} allCharacters list of all characters
 * @param {Character} characterP index of the character that can be removed out of parent
 * @returns {[Character]} what characters got influenced by the removing of characterP
 */
export function removeCharacterFromParent(allCharacters, characterP){
    let influencedCharacters = []
    for(let i = 0; i < allCharacters.length; i++){
        const removeIndex = allCharacters[i].parents.indexOf(characterP.id)
        if(removeIndex >= 0){
            allCharacters[i].parents.splice(removeIndex, 1)
            influencedCharacters.push(allCharacters[i])
        }
    }
    return influencedCharacters
}

export function findFreeCharacters(allCharacters){
    let res = []
    for(let i = 0; i < allCharacters.length; i++){
        if(allCharacters[i].parents.length == 0 && !allCharacters[i].isRanked){
            res.push(allCharacters[i])
        }
    }
    return res
}

export function revertFaved(allCharacters, favedChar, influencedCharacters){
    console.log(favedChar)
    favedChar.isRanked = false
    console.log(influencedCharacters)
    for(let i = 0;i < influencedCharacters.length; i++){
        influencedCharacters[i].parents.push(favedChar.id)
    }
}