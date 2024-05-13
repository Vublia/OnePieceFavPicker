<script setup>
import { reactive, computed, ref } from 'vue'
import OneCharacter from './OneCharacter.vue'
import {Character} from './Character.js'
import loadCharData from './LoadData';
const props = defineProps(['characters', 'selectedArray', 'key'])

const apple = reactive([])
for(let i = 0; i < props.characters.length; i++){
    apple[i] = false
}

</script>
<template>
    <div class="characterSelect" >
        <OneCharacter v-for="(c, cind) in props.characters":name="c.name" :fileSrc="c.fileSrc" :id="cind" :selectedArray="props.selectedArray"/>
    </div>
</template>
<style>
.characterSelect{
    display:flex;
    flex-wrap: wrap;
    width:100%;
    height:100%;
    column-gap:0px;
}

</style>