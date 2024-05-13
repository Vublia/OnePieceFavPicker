<script setup>
import {ref} from 'vue'

const props = defineProps(['name', 'id', 'fileSrc', 'selectedArray'])
let selected = ref(false)
const part2 = "Chapter_784_cropped.png"
const imgsrc = "images/" + props.fileSrc 

const imgClass = "prof"
const imgClick = "clicked"
//const name="Robin"
function onImgClick(s){
    selected.value = !s
    props.selectedArray[props.id] = !s
}

</script>
<template>
    <div class="img__wrapper">
        <img :class="[selected ? imgClick : '', imgClass]" @click="onImgClick(selected)" v-bind:title="props.name" :src="imgsrc"></img>
    </div>
</template>

<style>
.prof{
    border-radius: 50%;
    width:100%;
}
.clicked{
    border: 5px solid #34b0f8;
}
.img__description{
    visibility: hidden;
}
.img__wrapper{
    width: 20%;
    height:30%;
    
}
.img__wrapper:hover .img__description{
    visibility: visible;
    opacity: 1;

}
</style>