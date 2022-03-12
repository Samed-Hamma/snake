<script lang="ts" setup>
import Cell from './Cell.vue'
import { Snake, Directions, Coords } from '../functions';
import { ref, onMounted, onBeforeUnmount } from 'vue';
const snakeInstance = ref(new Snake(15, 10));

let timeout = 300;
let currentDirection = Directions.RIGHT

onMounted(() => {
    document.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'ArrowDown':
                checkDirectionAndSet(Directions.DOWN)
                break
            case 'ArrowUp':
                checkDirectionAndSet(Directions.UP)
                break
            case 'ArrowRight':
                checkDirectionAndSet(Directions.RIGHT)
                break
            case 'ArrowLeft':
                checkDirectionAndSet(Directions.LEFT)
                break
        }
    });
    setInterval(() => {
        snakeInstance.value.moveSnake(currentDirection)
    }, timeout)
})


onBeforeUnmount(() => {
    document.removeEventListener('keydown', () => { })
})
function checkDirectionAndSet(direction: Directions) {
    if (
        direction === Directions.RIGHT && currentDirection === Directions.LEFT ||
        direction === Directions.LEFT && currentDirection === Directions.RIGHT ||
        direction === Directions.DOWN && currentDirection === Directions.UP ||
        direction === Directions.UP && currentDirection === Directions.DOWN
    ) return
    currentDirection = direction
}

function isSnake(coords: Coords) {
    return snakeInstance.value.isSnake(coords)
}
</script>

<template>
    <div id="root">
        <div class="info">
            <h6
                :style="{ color: snakeInstance.hasLost ? 'red' : 'green' }"
            >Lost: {{ snakeInstance.hasLost }}</h6>
            <h6>Score: {{ snakeInstance.score }}</h6>
            <h6>High Score: {{ snakeInstance.highScore }}</h6>
        </div>
        <div v-for="(line, y) in snakeInstance.grid">
            <Cell v-for="(cell, x) in line" :cell="cell" :is-snake="isSnake({ x, y })" />
        </div>
    </div>
</template>

<style>
body {
    margin: 0;
}
#root {
    line-height: 9px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
}
.info {
    display: flex;
    width: 70%;
    justify-content: space-between;
}
</style>
