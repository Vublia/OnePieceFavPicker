<script setup>
import { reactive } from 'vue';
import draggable from 'vuedraggable';
import { ActionType } from './Character';
import { saveArrayOfCharsToCache } from './LoadData';

const props  = defineProps(['characters', 'previousActionStack'])
const imgsrc = "images/"
let drag = false

function draggingEnd(e){
    //console.log('ending a story')
    //console.log([...props.characters])
    drag = false
    //console.log(e)
    if(e.oldIndex == e.newIndex){
        return
    }
    let movedC = props.characters[e.oldIndex]
    //console.log(movedC)
    if(e.oldIndex > e.newIndex){
        //console.log('going down on the list')
        for(let i = e.oldIndex; i > e.newIndex; i--){
            //props.characters[i] = props.characters[i-1]
        }
    }
    else{
        //console.log('going up on the list ')
        for(let i = e.oldIndex; i < e.newIndex; i++){
            //props.characters[i] = props.characters[i+1]
        }
    }
    //console.log(movedC)
    //props.characters[e.newIndex] = props.characters[e.oldIndex]
    //props.characters[e.newIndex] = movedC
    //console.log([...props.characters])
    saveArrayOfCharsToCache(props.characters, 'rankedChars')
    props.previousActionStack.push(new ActionType('swap', [e.oldIndex], [e.newIndex]))
}
function checkMove(e){
    //console.log('futureIndex: ' + e.draggedContext.futureIndex)
}
</script>
<template>
    <draggable v-model="props.characters" class="" @start="drag=true" @end="draggingEnd" :move="checkMove">
        <template #item="{element: charact}">
            <img class="favPhoto" :src="imgsrc+charact.fileSrc" :title="charact.name"/>

        </template>
    </draggable>
    
</template>
<style>
.favPhoto{
    border-radius: 50%;
    padding:0.5%;
    width:20%;
}
.favShow{
    display: flex;
    flex-wrap:wrap;
    flex-direction: row;

}
</style>