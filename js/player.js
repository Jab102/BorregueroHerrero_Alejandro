
var player = {
    position: {x: 200, y: 200},
    width: 0.24,
    height: 0.4,

    isGoingLeft: false,

    // movement attr
    maxHorizontalVel: 2,
    maxVerticalVel: 4,
    jumpForce: 6,

    moveLeft: false,
    moveRight: false,
    moveUp: false,

    canJump: false,

    animation: {

        img: null,
        timePerFrame: 1/24,
        currentFrametime: 0,
        frameWidth: 74.29,
        frameHeight: 86.75,
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
        density: 1,
        fixedRotation: true,
        linearDamping: 1,
        user_data: player,
        type: b2Body.b2_dynamicBody,
        restitution: 0.0
    },

    body: null,

    Start: function () {
        this.animation.img = playerImg;

        this.body = CreateBox(world,
            this.position.x / scale, this.position.y / scale,
            this.width, this.height, this.physicsInfo);
    },

    Update: function (deltaTime) {
        this.animation.Update(deltaTime);

        // movement
        if (this.moveRight)
        {
            this.ApplyVelocity(new b2Vec2(1, 0));
            this.moveRight = false;
            this.isGoingLeft = false;
        }

        if (this.moveLeft)
        {
            this.ApplyVelocity(new b2Vec2(-1, 0));
            this.moveLeft = false;
            this.isGoingLeft = true;
        }

        // jump
        if (this.moveUp)
        {
            this.ApplyVelocity(new b2Vec2(0, this.jumpForce));
            this.moveUp = false;
        }

    },

    Draw: function (ctx) {
        var bodyPosition = this.body.GetPosition();
        var posX = bodyPosition.x * scale;
        var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);

        ctx.save();

        ctx.translate(posX, posY);

        if (this.isGoingLeft)
            ctx.scale(-1, 1);
        //ctx.scale(0.5, 0.5);

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

    Jump: function () {
        if (Math.abs(this.body.GetLinearVelocity().y) > 0)
            return false;

        this.moveUp = true;
    },

    //function which checks the collisions of the player with the boxes/ coins
    CheckBoxCollisions: function (objectCol)
    {
        //object collider limit positions
        var objectPosY = objectCol.GetBoxBottomLimit();
        var leftObjLimit = objectCol.GetBoxLeftLimit();
        var rightObjLimit = objectCol.GetBoxRightLimit();

        //projectile positions
        var playerY = this.GetPlayerTopLimit();
        var leftLimit = this.GetPlayerLeftLimit();
        var rightLimit = this.GetPlayerRightLimit();

        return (leftLimit  <= rightObjLimit) &&
              (rightLimit >= leftObjLimit) &&
              ((playerY)  >= (objectPosY - 1));

    },

    GetPlayerTopLimit: function ()
    {
        var topL = this.body.GetPosition();
        return (topL.y  + this.height) * scale;
    },

    GetPlayerRightLimit: function ()
    {
        var rightL = this.body.GetPosition();
        return (rightL.x + this.width ) * scale;
    },

    GetPlayerLeftLimit: function ()
    {
        var leftL = this.body.GetPosition();
        return (leftL.x - this.width ) * scale;
    },


}
