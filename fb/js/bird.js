class Bird {
    constructor() {
        this.x = GAME_CONFIG.birdX;
        this.y = GAME_CONFIG.canvasHeight / 2;
        this.velocity = 0;
        this.size = GAME_CONFIG.birdSize;
        this.rotation = 0;
        this.image = null;
        this.imageLoaded = false;
        this.loadImage();
    }

    loadImage() {
        this.image = new Image();
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.image.src = 'assets/images/newbird.gif';
    }

    update() {
        this.velocity += GAME_CONFIG.gravity;
        this.y += this.velocity;
        
        this.rotation = Math.min(Math.max(this.velocity * 3, -30), 90);
        
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
        
        if (this.y > GAME_CONFIG.canvasHeight - this.size) {
            this.y = GAME_CONFIG.canvasHeight - this.size;
            this.velocity = 0;
        }
    }

    jump() {
        this.velocity = GAME_CONFIG.jumpVelocity;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.size/2, this.y + this.size/2);
        ctx.rotate(this.rotation * Math.PI / 180);
        
        if (this.imageLoaded && this.image) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(
                this.image, 
                -this.size/2, 
                -this.size/2, 
                this.size, 
                this.size
            );
        } else {
            drawCircle(ctx, 0, 0, this.size/2, '#FFD700');
            drawCircle(ctx, -5, -3, 3, '#000');
            
            ctx.fillStyle = '#FF6B47';
            ctx.beginPath();
            ctx.moveTo(3, 2);
            ctx.lineTo(8, 0);
            ctx.lineTo(3, -2);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.size,
            height: this.size
        };
    }

    reset() {
        this.y = GAME_CONFIG.canvasHeight / 2;
        this.velocity = 0;
        this.rotation = 0;
    }
}