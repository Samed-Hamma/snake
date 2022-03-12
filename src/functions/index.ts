export enum Cell {
    EMPTY = 'empty',
    FOOD = 'food',
}

export type GRID = Cell[][];

export enum Directions {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

export type Coords = {
    x: number,
    y: number,
}

/// Get a Random Number from 0 to @param max - 1
function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max)
}

export class Snake {
    grid: GRID;
    hasLost = false;
    score = 0;
    highScore = 0;
    width: number;
    height: number;
    snake: Coords[];

    constructor(width = 100, height = 70) {
        this.width = width
        this.height = height
        this.grid = this.initGrid(width, height)
        const coords = { x: Math.floor(width / 2), y: Math.floor(height / 2) }
        this.snake = this.initSnake(coords)
        this.addFood()
        this.highScore = parseInt(localStorage.getItem('highScore') || '0')
    }

    private initGrid(width: number, height: number): GRID {
        const grid: GRID = [];
        for (let j = 0; j < height; j++) {
            const line: Cell[] = [];
            for (let i = 0; i < width; i++) {
                line.push(Cell.EMPTY)
            }
            grid.push(line)
        }
        return grid;
    }
    private initSnake({ x, y }: Coords, initialLength = 2): Coords[] {
        const snake = []
        // TODO: Check if position is Ok (not out of grid)
        for (let count = 0; count < initialLength; count++) {
            snake.push({ x: x - count, y })
        }
        return snake
    }

    private addFood(grid: GRID = this.grid, tries = 3): void {
        // To avoid complexity, try Random Add Food @param 'tries' times
        for (let i = 0; i < tries; i++) {
            const x = getRandomInt(this.width)
            const y = getRandomInt(this.height)
            if (!this.isSnake({ x, y })) {
                grid[y][x] = Cell.FOOD
                console.log('Added food on try number', i + 1)
                return;
            }
        }
        // Then brute force
        console.warn('addFood Brute forcing')
        const emptyCells: { x: number, y: number }[] = [];
        grid.forEach((line, y) => {
            line.forEach((_, x) => {
                if (!this.isSnake({ x, y })) {
                    emptyCells.push({ x, y })
                }
            })
        })

        const randomCellIndex = getRandomInt(emptyCells.length)
        const { x, y } = emptyCells[randomCellIndex]
        grid[y][x] = Cell.FOOD
    }

    isSnake({ x, y }: Coords): boolean {
        return this.snake.some(e => e.x === x && e.y === y)
    }

    moveSnake(direction = Directions.RIGHT) {
        const { x, y } = this.getNextCoords(direction)
        if (this.lost({ x, y }) || this.hasLost) {
            this.hasLost = true;
            // Check highScore, set if necessary
            if (this.score > this.highScore) {
                localStorage.setItem('highScore', this.score.toString())
            }
        } else {
            let addFood = false;
            if (this.grid[y][x] === Cell.FOOD) {
                this.grid[y][x] = Cell.EMPTY
                this.score++
                addFood = true
            } else {
                this.snake.pop()
            }
            this.snake.unshift({ x, y })

            // addFood only after snake has moved, to avoid adding food on snake coords
            if (addFood) this.addFood()
        }
    }

    private lost({ x, y }: Coords): boolean {
        const outOfMap = x >= this.width || x < 0 || y >= this.height || y < 0
        if (outOfMap) return true
        const tail = this.snake[this.snake.length - 1]
        return this.isSnake({ x, y }) && !(tail.x === x && tail.y === y)
    }

    private getNextCoords(direction: Directions): Coords {
        const nextCoords: Coords = { ...this.snake[0] }
        switch (direction) {
            case Directions.RIGHT:
                nextCoords.x++
                break
            case Directions.LEFT:
                nextCoords.x--
                break
            case Directions.UP:
                nextCoords.y--
                break
            case Directions.DOWN:
                nextCoords.y++
                break
        }
        return nextCoords
    }
} 