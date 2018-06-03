
//class which works as the boxes of the game.
//if you break them, you increment your score /open a new level in the portfolio
function NewCoin (options)
{


    return {
        width: 0.2,
        height: 0.2,
        position: {x: options.x, y: options.y},
        imgScale: 0.5,

        score: options.score,

        animation: {
            img: coinImg,
            timePerFrame: 1/24,
            currentFrametime: 0,
            frameWidth: 100,
            frameHeight: 100,
            actualX: 0,

            Update: function (deltaTime) {
                this.currentFrametime += deltaTime;
                if (this.currentFrametime >= this.timePerFrame)
                {
                    // update the animation frame
                    this.actualX += this.frameWidth;
                    if (this.actualX > 999)
                        this.actualX = 0;
                    this.currentFrametime = 0.0;
                }
            },

            Draw: function (ctx) {
                ctx.drawImage(this.img, this.actualX, 0,
                    this.frameWidth, this.frameHeight,
                    -this.frameWidth / 2, -this.frameHeight / 2,
                    this.frameWidth, this.frameHeight);
            }
        },

        physicsInfo: {
            density: 1,
            fixedRotation: true,
            linearDamping: 8,
            type: b2Body.b2_dynamicBody
        },

        body: null,

        Start: function () {
            this.body = CreateBox(world,
                this.position.x / scale, this.position.y / scale,
                this.width, this.height, this.physicsInfo);
        },

        Update: function (deltaTime)
        {
            this.animation.Update(deltaTime);
            //this.ApplyVelocity(new b2Vec2(0, 1));
        },

        Draw: function (ctx) {
            var bodyPosition = this.body.GetPosition();
            var posX = bodyPosition.x * scale;
            var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);

            ctx.save();

            ctx.translate(posX, posY);
            ctx.scale(this.imgScale, this.imgScale);

            this.animation.Draw(ctx);

            ctx.restore();
        },

        ApplyVelocity: function (vel) {
            var bodyVel = this.body.GetLinearVelocity();
            bodyVel.Add(vel);

            // horizontal movement cap
            if (Math.abs(bodyVel.x) > this.maxHorizontalVel)
                bodyVel.x = this.maxHorizontalVel * bodyVel.x / Math.abs(bodyVel.x);

            // vertical movement cap
            if (Math.abs(bodyVel.y) > this.maxVerticalVel)
                bodyVel.y = this.maxVerticalVel * bodyVel.y / Math.abs(bodyVel.y);

            this.body.SetLinearVelocity(bodyVel);
        },

        GetBoxRightLimit: function ()
        {
            var rightL = this.body.GetPosition();
            return (rightL.x +  this.width) * scale;
        },

        GetBoxLeftLimit: function ()
        {
            var leftL = this.body.GetPosition();
            return (leftL.x  - this.width) * scale;
        },

        GetBoxBottomLimit: function ()
        {
            var bottomL = this.body.GetPosition();
            return (bottomL.y  - this.height) * scale;
        },


    }
}
