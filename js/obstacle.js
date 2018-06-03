var obstacle = {
    position: {x: 350, y: 100},
    width: 0.2,
    height: 0.2,

    animation: {

        img: woodenBoxImg,
        timePerFrame: 1/24,
        currentFrametime: 0,
        frameWidth: 64,
        frameHeight: 64,
        actualX: 0,
        actualY: 0,

        Update: function (deltaTime) {
            this.currentFrametime += deltaTime;
            if (this.currentFrametime >= this.timePerFrame)
            {
                // update the animation frame
                this.actualX += this.frameWidth;
                if (this.actualX > 520)
                {
                    this.actualX = 0;
                    if (this.actualY >= 260)
                        this.actualY = 0;
                    else
                        this.actualY += this.frameHeight;
                }
                this.currentFrametime = 0.0;
            }
        },

        Draw: function (ctx) {
            ctx.drawImage(this.img, this.actualX, this.actualY,
                this.frameWidth, this.frameHeight,
                -this.frameWidth / 2, -this.frameHeight / 2,
                this.frameWidth, this.frameHeight);
        }
    },

    physicsInfo: {
        density: 20,
        fixedRotation: true,
        linearDamping: 1,
        user_data: player,
        type: b2Body.b2_dynamicBody,
        restitution: 0.0
    },

    body: null,

    Start: function () {
        this.animation.img = woodenBoxImg;

        this.body = CreateBox(world,
            this.position.x / scale, this.position.y / scale,
            this.width, this.height, this.physicsInfo);
    },

    Update: function (deltaTime) {
        this.animation.Update(deltaTime);

    },

    Draw: function (ctx) {
        var bodyPosition = this.body.GetPosition();
        var posX = bodyPosition.x * scale;
        var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);

        ctx.save();

        ctx.translate(posX, posY);

        if (this.isGoingLeft)
            ctx.scale(-1, 1);

        this.animation.Draw(ctx);

        ctx.restore();
    },

}
