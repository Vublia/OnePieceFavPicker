import chardata from './characterdata/test.json' assert {type: 'json'}
import {Character} from './Character'
export default function loadCharData(){
    let charadatachars = chardata["characters"]
    let resCharacters = []
    for(let i = 0; i < charadatachars.length; i++){
        resCharacters[i] = Character.loadFromJson(charadatachars[i])
    }
    return resCharacters
}


export function smth(){
    localStorage.setItem('wow', '3')
    localStorage.setItem('wow', '4')
}



/**
 * 
 * @param {[Character]} currentChars the characters that are currently in 
 */
export function saveArrayOfCharsToCache(currentChars, savePlaceName){
    let charIds = []
    for(let i = 0; i < currentChars.length; i++){
        charIds.push(currentChars[i].id)
    }
    let charIdsString = JSON.stringify(charIds)
    saveDataToCache(savePlaceName, charIdsString)
}



export function loadCurrentChars(allCharacters){
    let loadedCC = JSON.parse(loadDataFromCache('currentChars'))
    if(loadedCC == null) { return null}
    let currentCharsRes = []
    for(let i = 0; i < loadedCC.length; i++){
        for(let j = 0; j < allCharacters.length; j++){
            if(loadedCC[i] == allCharacters[j].id){
                currentCharsRes.push(allCharacters[j])
            }
        }
    }
    return currentCharsRes
}


function saveDataToCache(placeName, saveableVar){
    localStorage.setItem(placeName, saveableVar)
}
function loadDataFromCache(placeName){
    return(localStorage.getItem(placeName))
}

/**
 * 
 * @param {[Character][]} currrentCharacters 
 * @param {string} placeName 
 */
export function saveArrayOfArrayCharsToCache(currrentCharacters, placeName){
    let toBeStringed = []
    for(let i = 0; i < currrentCharacters.length; i++){
        let thisOne = []
        for(let j = 0; j < currrentCharacters[i].length; j++){
            thisOne.push(currrentCharacters[i][j].id)
        }
        toBeStringed.push(thisOne)
    }
    saveDataToCache(placeName, JSON.stringify(toBeStringed))
}

/**
 * Saves the parents of every character
 * @param {[Character]} characters the character I want to save the parents from
 */
export function saveParentsToCache(characters){
    let toBeStringed = []
    for(let i = 0; i < characters.length; i++){
        toBeStringed.push([characters[i].id, characters[i].parents])
    }
    saveDataToCache('executed', JSON.stringify(toBeStringed))
}

/**
 * loads in parents for the characters
 * @param {[Character]} allCharacters 
 * @returns {boolean} if there was smth in the cache
 */
export function loadParentsFromCache(allCharacters){
    let d = JSON.parse(loadDataFromCache('executed'))
    if(d ==null){
        return false
    }
    for(let i = 0; i < d.length; i++){
        for(let j = 0; j < allCharacters.length; j++){
            if(allCharacters[j].id == d[i][0]){
                allCharacters[j].parents = d[i][1]
            }
        }
    }
    console.log(allCharacters)
    return true
}

export function loadDivDataFromCache(allCharacters){
    let divRaw = JSON.parse(loadDataFromCache('divdata'))
    if(divRaw == null){
        console.log('nope')
        return null
    }
    let newDiv = [] 
    console.log(divRaw)
    for(let j = 0; j < divRaw.length; j++){
        let thisDiv = []
        for(let k = 0; k < divRaw[j].length; k++){
            for(let i = 0; i < allCharacters.length; i++){
                if(divRaw[j][k] == allCharacters[i].id){
                    thisDiv.push(allCharacters[i])
                    break;
                }
            }
        }
        newDiv.push(thisDiv)

    }
    console.log(newDiv)
    return newDiv;

}

export function saveDivDataIndex(divdataindex){
    saveDataToCache('divDataIndex', divdataindex)
}

/**
 * Returns divdataindex if its in cache, otherwise returns -1
 * @returns {number}
 */
export function loadDivDataIndex(){
    let res = JSON.parse(loadDataFromCache('divDataIndex'))
    if(res == null){
        return -1
        
    }
    return res
}
/**
 * Returns the redochoices stack
 * @param {[Character]} allCharacters 
 * @returns {[Character][] | null}
 */
export function loadRedoChoices(allCharacters){
    let redoRes = []
    let loadedRedo = JSON.parse(loadDataFromCache('redoChoices'))
    console.log(loadedRedo)
    if(loadedRedo == null){ return null}
    for(let i = 0; i < loadedRedo.length; i ++){
        let thisRedo = []
        for(let j = 0; j < loadedRedo[i].length; j++){
            for(let k = 0; k < allCharacters.length; k++){
                if(loadedRedo[i][j] == allCharacters[k].id){
                    thisRedo.push(allCharacters[k])
                }
            }
        }
        redoRes.push(thisRedo)
    }
    return redoRes
}

/**
 * Loads in faved characters, and sets isRanked flags to true for ranked characters
 * @param {[Character]} allCharacters 
 * @returns {[Character] | null} returns character list if succeed, else null
 */
export function loadFavedCharacters(allCharacters){
    let favedRes = []
    let loadedFav = JSON.parse(loadDataFromCache('rankedChars'))
    if(loadedFav == null) { return null}
    for(let i = 0; i < loadedFav.length; i++){
        for(let j = 0; j < allCharacters.length; j++){
            if(loadedFav[i] == allCharacters[j].id) {
                allCharacters[j].isRanked = true
                favedRes.push(allCharacters[j])
            }
        }
    }
    console.log(favedRes)
    return favedRes
}


