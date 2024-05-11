<script setup>
import { reactive, computed, ref, toRaw} from 'vue'
import OneCharacter from './OneCharacter.vue'
import CharacterSelect from './CharacterSelect.vue'
import {Character, ActionType} from './Character.js'
import loadCharData, { loadCurrentChars, saveArrayOfCharsToCache, saveArrayOfArrayCharsToCache, smth, saveParentsToCache, saveDivDataIndex, loadParentsFromCache, loadDivDataFromCache, loadDivDataIndex, loadRedoChoices, loadFavedCharacters } from './LoadData';
import { divideData, findFreeCharacters, getNextLevelCharacters, processApple, processAppleBackward, removeCharacterFromParent, revertFaved } from './Algorithm';
import FavoriteShower from './FavoriteShower.vue';
import html2canvas from 'html2canvas';
let listIndex = ref(0)
const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ],
  coin: 0
})
const characters = loadCharData()



//TESTING
let divData = divideData(characters, 10)
//
let currentDivIndex = 0
const rerenderkey= ref(0)
let currentChars = ref(divData[0])//(getCharactersFromList(0, 5))
//previouschoices holds all the previous groups of things
let previousChoices = []
//redoChoices are choices that are still need to be done
let reDoChoices = []

let previousActions = []

let rankedCharacters = ref([])

//borders houses when a new 'level' of the sorting was reached, this is used for going back
//if previousChoices.length == borders[borders.length - 1]
let borders = [0]


let apple = reactive([])
function doInitStuff(){
  ///LOADING EVERYTHING IN
  //load in characters.parents, 
  smth()
  let succeededLoad = true
  succeededLoad = succeededLoad && loadParentsFromCache(characters)
  //load in divdata
  divData = loadDivDataFromCache(characters) 
  if(divData == null){succeededLoad = false}
  //load in currentDivIndex
  currentDivIndex = loadDivDataIndex()
  if(currentDivIndex < 0){ succeededLoad = false}
  //load in redoChoices
  reDoChoices = loadRedoChoices(characters)
  if(reDoChoices == null) { succeededLoad = false}
  //load in faved
  let f = loadFavedCharacters(characters)
  if(f == null) { succeededLoad = false}
  else{ rankedCharacters.value = f}
  let c = loadCurrentChars(characters)
  if(c==null) { succeededLoad = false}
  else{ currentChars = ref(c)}
  //if one didnt succeed, wipe everything and start anew
  if(!succeededLoad){
    resetEverything()
    currentChars = ref([...divData[0]])
  }
  console.log(previousChoices)
  console.log(previousActions)
  console.log(characters)
  console.log(rankedCharacters)
  console.log(currentDivIndex)
  console.log(reDoChoices)
  apple = reactive(makeSelectedArray(currentChars.value))
  console.log(currentChars)
  console.log(apple)
}

function resetButtonClick(){
  resetEverything()
  currentChars = ref([...divData[0]])
  apple = reactive(makeSelectedArray(currentChars.value))
  rerenderkey.value += 1
}

/**
 * Resets every variable and starts anew
 */
function resetEverything(){
  reDoChoices = []
  saveArrayOfArrayCharsToCache(reDoChoices, 'redoChoices')
  for(let i = 0; i < characters.length; i++){
    characters[i].isRanked = false
    characters[i].parents = []
  }
  divData = divideData(characters, 10)
  saveArrayOfArrayCharsToCache(divData, 'divdata')
  currentDivIndex = 0
  saveDivDataIndex(currentDivIndex)
  previousChoices = []
  rankedCharacters.value = []
  saveArrayOfCharsToCache(rankedCharacters.value, 'rankedChars')
  previousActions = []
  borders = []
}

function makeSelectedArray(referenceList){
  let l = []
  for(let i = 0; i < referenceList.length; i++){
    l[i] = false
  }
  return l
}
function clickEventForward(){
  //figure out if we can go forward
  let oneSelected = false
  //check if one is selected, if not dont do anything
  for(let i = 0; i < apple.length;i++){
    if(apple[i]){
      oneSelected = true
      break;
    }
  }  

  if(!oneSelected){
    return
  }

  let newCurrentChars = []
  let rawCurrentChars = proxyObjectToArray(currentChars.value)
  //saves choices to parents among other things
  processApple(rawCurrentChars, toRaw(apple))
  saveParentsToCache(characters)
  //push for the undo button
  previousChoices.push(rawCurrentChars)
  previousActions.push(new ActionType('pick', [],[]))

  //if redochoices.length == 0, move divdata one forward, otherwise pop a redochoices one
  if(reDoChoices.length == 0){
    currentDivIndex += 1
    //if none is left
    if(divData.length == currentDivIndex || divData.length == 0){
      console.log('getting here')
      newLevel()

    }
    saveDivDataIndex(currentDivIndex)
    newCurrentChars = divData[currentDivIndex]
  }
  else{
    
      newCurrentChars = reDoChoices.pop()
      saveArrayOfArrayCharsToCache(reDoChoices, 'redoChoices')

    

  }
  overwriteCurrentChars(newCurrentChars)
}

function clickEventBackward(){
  if(previousActions.length == 0){
    return
  }
  let prevAction = previousActions.pop()
  console.log(prevAction)
  if(prevAction.type == 'swap'){
    let oldIndex = prevAction.valueArray[0]
    let newIndex = prevAction.valueArray2[0]
    let movedC = rankedCharacters.value[newIndex]
    console.log(movedC)
    if(oldIndex > newIndex){
      for(let i = newIndex; i < oldIndex; i++){
        rankedCharacters.value[i] = rankedCharacters.value[i+1]
      }
    }
    else{
      for(let i = newIndex; i > oldIndex; i--){
        rankedCharacters.value[i]  = rankedCharacters.value[i-1]
      }
    }
    rankedCharacters.value[oldIndex]= movedC
    return
  }
  reDoChoices.push(proxyObjectToArray(currentChars.value))
  saveArrayOfArrayCharsToCache(reDoChoices, 'redoChoices')
  //let newCurrentCharsProx = previousChoices.pop()
  //let newCurrentChars = proxyObjectToArray(newCurrentCharsProx)
  
  if(previousActions.length == borders[borders.length-1] -1){
    console.log('doing some badddd stuff')
    borders.pop()
    divData = []
    reDoChoices = []
    saveArrayOfArrayCharsToCache(reDoChoices, 'redoChoices')
    saveArrayOfArrayCharsToCache(divData, 'divdata')
  }

  if(prevAction.valueArray.length != 0){
    //this means that there was one or more character that got faved last time
    //so reupdate parent update to reflect going back
    //aswel as updating the 'isranked flag'
    for(let i = prevAction.valueArray.length -1 ; i >=0; i--){
      console.log(prevAction.valueArray)
      //revert faved changes and save it to the cache
      revertFaved(characters, prevAction.valueArray[i], prevAction.valueArray2[i])
      saveParentsToCache(characters)
      //pop and save
      rankedCharacters.value.pop()
      saveArrayOfCharsToCache(rankedCharacters.value, 'rankedChars')
      
    }
  }
  let newCurrentChars = previousChoices.pop()

  processAppleBackward(newCurrentChars)
  saveParentsToCache(characters)
  overwriteCurrentChars(newCurrentChars)

}
/**
 * Recalculates divData after you have done all the current DivData choices
 */
function newLevel(){
  let newChars = getNextLevelCharacters(characters)
  while(newChars.length == 1){
    rankedCharacters.value.push(newChars[0])
    console.log(rankedCharacters.value)
    saveArrayOfCharsToCache(rankedCharacters.value, 'rankedChars')
    newChars[0].isRanked = true

    let influenceChar = removeCharacterFromParent(characters, newChars[0])
    previousActions[previousActions.length-1].valueArray.push(newChars[0])
    previousActions[previousActions.length-1].valueArray2.push(influenceChar)
    newChars = findFreeCharacters(characters)

  }
  divData = divideData(newChars, 10)
  //resave parents, and divdata to the cache
  saveParentsToCache(characters)
  saveArrayOfArrayCharsToCache(divData, 'divdata')
  console.log(divData)
  borders.push(previousChoices.length)
  currentDivIndex = 0
  saveDivDataIndex(currentDivIndex)
}

/**
 * Makes an normal array from a weird proxy array
 * @param {Proxy([Proxy(Character)]} proxyObjectArray the weird proxy array
 * @returns {[Character]}
 */
 function proxyObjectToArray(proxyObjectArray){
  let arrayProxyObj = {...proxyObjectArray}
  let resArray = []
  for(const[key, char] of Object.entries(arrayProxyObj)){
    resArray.push(toRaw(char))
  }
  return resArray
}

/**
 * Wipes currentchars, puts newCharracters in currentchars, makes apple, then forces rerender
 * @param {[Character]} newCharracters the new characters you want in currentChars
 */
function overwriteCurrentChars(newCharracters){
  while(currentChars.value.length != 0){
    currentChars.value.pop()
  }
  for(let i = 0; i < newCharracters.length; i++){
    currentChars.value.push(newCharracters[i])
  }
  saveArrayOfCharsToCache(proxyObjectToArray(currentChars.value), 'currentChars')
  apple = reactive(makeSelectedArray(currentChars.value))
  rerenderkey.value += 1
}

function saveAsImageClick(){
  let imgsrc = document.getElementById('capture')
  html2canvas(imgsrc).then(function(canvas) {
    //document.getElementById("explain-scr").appendChild(canvas);
    canvas.toBlob(function(blob){
      navigator.clipboard.write([
        new ClipboardItem(Object.defineProperty({}, blob.type, {
          value: blob,
          enumerable: true
        }))

      ]).then(function(){
    return
    })
  });
  });
}


doInitStuff()
</script>

<template>
    <div class="selecter">
    <CharacterSelect :characters="currentChars" :selectedArray="apple" :key="rerenderkey"/>
    <button @click="clickEventForward()">click me</button>
    <button @click="clickEventBackward()"> backward </button>
    <button @click="resetButtonClick()"> reset </button>
    <p>{{listIndex}}</p>
    </div>
    <div id="capture" class="shower">
      <FavoriteShower :characters="rankedCharacters" :previousActionStack="previousActions"/>
      <button @click="saveAsImageClick()">saveimage</button>
    </div>
    <p>Characters left: {{characters.filter(c => !(c.isRanked || c.parents.length != 0)).length}}</p>
    <!--<p>For each character selection shown, pick one or more characters you like. And find out who is your favorite. If you don't agree, then you can drag around your found favorites too</p>-->
    <p>Made by Vublia</p>

  <!--<div v-for="c in characters">-->
    <!--<OneCharacter :name="c.name" :fileSrc="c.fileSrc"/>-->
</template>

<!--You can use v-if or v-show, v-show does it via CSS, where v-if is real conditional rendering.  V-if has higher toggle cost, v-show higheri nitial render cost, so use the latter when you are doing a lot of switching-->
<style>
.selecter{
    width:60vw;
}
.shower{
  width: 30vw;
}

</style>
<!--

  Alg idea:

  Until done:
  For all characters, see how many are left,   minimum of 10 and currently length/5

-->