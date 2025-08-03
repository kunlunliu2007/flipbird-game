class CelebrationSystem {
    constructor() {
        this.particles = [];
        this.isActive = false;
        this.celebrationLevel = 0;
        this.animationDuration = 3000; // 3秒
        this.startTime = 0;
        this.flashAlpha = 0;
        this.textAlpha = 0;
        this.celebrationText = '';
    }

    triggerCelebration(level) {
        this.celebrationLevel = level;
        this.isActive = true;
        this.startTime = Date.now();
        this.celebrationText = `关卡 ${level} 完成!`;
        this.particles = [];
        this.flashAlpha = 0.8;
        this.textAlpha = 1;
        
        // 创建粒子效果
        this.createParticles();
    }

    createParticles() {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * GAME_CONFIG.canvasWidth,
                y: Math.random() * GAME_CONFIG.canvasHeight,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: Math.random() * 6 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01
            });
        }
        
        // 添加一些特殊的星星粒子
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: Math.random() * GAME_CONFIG.canvasWidth,
                y: Math.random() * GAME_CONFIG.canvasHeight,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 4 + 3,
                color: '#FFD700',
                life: 1.0,
                decay: Math.random() * 0.015 + 0.008,
                type: 'star'
            });
        }
    }

    update() {
        if (!this.isActive) return;

        const elapsed = Date.now() - this.startTime;
        const progress = elapsed / this.animationDuration;

        if (progress >= 1) {
            this.isActive = false;
            this.particles = [];
            return;
        }

        // 更新闪烁效果
        this.flashAlpha = Math.max(0, 0.8 * (1 - progress * 2));
        
        // 更新文字透明度
        if (progress < 0.1) {
            this.textAlpha = progress / 0.1;
        } else if (progress > 0.8) {
            this.textAlpha = (1 - progress) / 0.2;
        } else {
            this.textAlpha = 1;
        }

        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            // 添加重力效果
            particle.vy += 0.1;
            
            // 边界反弹
            if (particle.x < 0 || particle.x > GAME_CONFIG.canvasWidth) {
                particle.vx *= -0.8;
            }
            if (particle.y > GAME_CONFIG.canvasHeight) {
                particle.vy *= -0.6;
                particle.y = GAME_CONFIG.canvasHeight;
            }
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        if (!this.isActive) return;

        // 绘制闪烁背景
        if (this.flashAlpha > 0) {
            ctx.save();
            ctx.fillStyle = `rgba(255, 255, 255, ${this.flashAlpha})`;
            ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);
            ctx.restore();
        }

        // 绘制粒子
        ctx.save();
        for (const particle of this.particles) {
            ctx.globalAlpha = particle.life;
            
            if (particle.type === 'star') {
                this.drawStar(ctx, particle.x, particle.y, particle.size, particle.color);
            } else {
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();

        // 绘制庆祝文字
        if (this.textAlpha > 0) {
            ctx.save();
            ctx.globalAlpha = this.textAlpha;
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#FF6B6B';
            ctx.lineWidth = 3;
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const x = GAME_CONFIG.canvasWidth / 2;
            const y = GAME_CONFIG.canvasHeight / 2 - 50;
            
            ctx.strokeText(this.celebrationText, x, y);
            ctx.fillText(this.celebrationText, x, y);
            
            // 添加副标题
            ctx.font = 'bold 18px Arial';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText('🎉 太棒了! 🎉', x, y + 40);
            ctx.restore();
        }
    }

    drawStar(ctx, x, y, size, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.rotate(Date.now() * 0.001);
        
        // 绘制五角星
        for (let i = 0; i < 5; i++) {
            ctx.lineTo(Math.cos((i * 144 - 90) * Math.PI / 180) * size, 
                      Math.sin((i * 144 - 90) * Math.PI / 180) * size);
            ctx.lineTo(Math.cos((i * 144 - 54) * Math.PI / 180) * size * 0.5, 
                      Math.sin((i * 144 - 54) * Math.PI / 180) * size * 0.5);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    reset() {
        this.isActive = false;
        this.particles = [];
        this.celebrationLevel = 0;
        this.flashAlpha = 0;
        this.textAlpha = 0;
    }
}