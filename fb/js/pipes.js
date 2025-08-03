class Pipe {
    constructor(x, gapY, gapHeight) {
        this.x = x;
        this.gapY = gapY;
        this.gapHeight = gapHeight;
        this.width = GAME_CONFIG.pipeWidth;
        this.passed = false;
    }

    update() {
        this.x += GAME_CONFIG.pipeSpeed;
    }

    draw(ctx) {
        const topHeight = this.gapY;
        const bottomY = this.gapY + this.gapHeight;
        const bottomHeight = GAME_CONFIG.canvasHeight - bottomY;

        drawRect(ctx, this.x, 0, this.width, topHeight, '#228B22');
        drawRect(ctx, this.x - 5, topHeight - 30, this.width + 10, 30, '#32CD32');

        drawRect(ctx, this.x, bottomY, this.width, bottomHeight, '#228B22');
        drawRect(ctx, this.x - 5, bottomY, this.width + 10, 30, '#32CD32');
    }

    getTopBounds() {
        return {
            x: this.x,
            y: 0,
            width: this.width,
            height: this.gapY
        };
    }

    getBottomBounds() {
        const bottomY = this.gapY + this.gapHeight;
        return {
            x: this.x,
            y: bottomY,
            width: this.width,
            height: GAME_CONFIG.canvasHeight - bottomY
        };
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    checkPassed(birdX) {
        if (!this.passed && birdX > this.x + this.width) {
            this.passed = true;
            return true;
        }
        return false;
    }
}

class PipeManager {
    constructor() {
        this.pipes = [];
        this.spawnTimer = 0;
        this.spawnInterval = 117; // 增加30%的间隔 (90 * 1.3 = 117)
    }

    update() {
        this.spawnTimer++;
        
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnPipe();
            this.spawnTimer = 0;
        }

        for (let i = this.pipes.length - 1; i >= 0; i--) {
            this.pipes[i].update();
            
            if (this.pipes[i].isOffScreen()) {
                this.pipes.splice(i, 1);
            }
        }
    }

    spawnPipe() {
        const minGapY = 50;
        const maxGapY = GAME_CONFIG.canvasHeight - GAME_CONFIG.pipeGap - 50;
        const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
        
        const pipe = new Pipe(GAME_CONFIG.canvasWidth, gapY, GAME_CONFIG.pipeGap);
        this.pipes.push(pipe);
    }

    draw(ctx) {
        this.pipes.forEach(pipe => pipe.draw(ctx));
    }

    checkCollisions(bird) {
        const birdBounds = bird.getBounds();
        
        for (let pipe of this.pipes) {
            if (checkCollision(birdBounds, pipe.getTopBounds()) ||
                checkCollision(birdBounds, pipe.getBottomBounds())) {
                return true;
            }
        }
        return false;
    }

    checkScore(birdX) {
        let scoreIncrease = 0;
        
        this.pipes.forEach(pipe => {
            if (pipe.checkPassed(birdX)) {
                scoreIncrease++;
            }
        });
        
        return scoreIncrease;
    }

    reset() {
        this.pipes = [];
        this.spawnTimer = 0;
    }
}