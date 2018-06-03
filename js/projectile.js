function NewProjectile (options)
{
    return {
        width: 0.1,
        height: 0.1,
        position: {x: options.x, y: options.y},
        imgScale: 0.55,

        score: options.score || 100,

        animation: {
            img: projectileImg,
            timePerFrame: 1/100,
            currentFrametime: 0,
            frameWidth: 48,
            frameHeight: 50,
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
            ctx.scale(this.imgScale , this.imgScale);

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

        //check the collisions of the projectile with the
        //boxes/ coins of the game
        CheckBoxCollisions: function (objectCol)
        {
            //object collider limit positions
            var objectPosY = objectCol.GetBoxBottomLimit();
            var leftObjLimit = objectCol.GetBoxLeftLimit();
            var rightObjLimit = objectCol.GetBoxRightLimit();

            //projectile positions
            var projectilePosY = this.GetProjectileTopLimit();
            var leftLimit = this.GetProjectileLeftLimit();
            var rightLimit = this.GetProjectileRightLimit();

            return (leftLimit  <= rightObjLimit) &&
                  (rightLimit >= leftObjLimit) &&
                  ((projectilePosY)  >= (objectPosY - 1));

        },

        GetProjectileRightLimit: function ()
        {
            var rightL = this.body.GetPosition();
            return (rightL.x + this.width ) * scale;
        },

        GetProjectileLeftLimit: function ()
        {
            var leftL = this.body.GetPosition();
            return (leftL.x - this.width ) * scale;
        },

        GetProjectileTopLimit: function ()
        {
            var topL = this.body.GetPosition();
            return (topL.y + this.height ) * scale;
        },

    }
}
