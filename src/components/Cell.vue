<script lang="ts" setup>
import { computed } from 'vue';
import { Cell } from '../functions';
const props = defineProps<{
    cell: Cell,
    isSnake: boolean;
}>()
const classes = computed(() => props.isSnake ? 'snake' : props.cell)
</script>

<template>
    <span :class="classes"></span>
</template>

<style scoped>
span {
    width: 13px;
    height: 13px;
    margin: 1px;
    display: inline-block;
    font-size: 7px;
    text-align: center;
    vertical-align: middle;
    transition: all 0.2s ease-in-out;
    border-radius: 2px;
}
.food {
    background-color: red;
    color: blue;
}
.head,
.body,
.tail,
.snake {
    background-color: green;
    color: red;
}

.empty {
    background-color: grey;
}
</style>
