<script setup>
import {ref} from 'vue'
const props = defineProps(['name', 'id', 'fileSrc', 'selectedArray'])
const selected = ref(false)
const part2 = "Chapter_784_cropped.png"
const imgsrc = "images/" + props.fileSrc 
const imgClass = "prof"
const imgClick = "clicked"
//const name="Robin"
function onImgClick(event){
    this.selected = !this.selected
    props.selectedArray[props.id] = this.selected
}
</script>
<template>
    <div class="img__wrapper">
        <img :class="[selected ? imgClick : '', imgClass]" @click="onImgClick()" v-bind:title="props.name" :src="imgsrc"></img>
    </div>
</template>

<style>
.prof{
    border-radius: 50%;
    width:100%;
    height:100%;
}
.clicked{
    border: 5px solid #34b0f8;
}
.img__description{
    visibility: hidden;
}
.img__wrapper{
    width: 20%;
    
}
.img__wrapper:hover .img__description{
    visibility: visible;
    opacity: 1;

}
</style>