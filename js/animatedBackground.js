function NewAnimatedBackground (options)
{
  return  {
      width: 1,
      height: 1,
      position: {x: options.x, y: options.y},
      imgScale: 1,

      animation: {
          img: animatedbgImage,
          timePerFrame: 1/24,
          currentFrametime: 0,
          frameWidth: 800,
          frameHeight: 450,
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
          density:0,
          fixedRotation: true,
          linearDamping: 8,
          type: b2Body.b2_staticBody
      },

      //body: null,

      Start: function ()
      {
        /*
          this.body = CreateBox(world,
              this.position.x / scale, this.position.y / scale,
              this.width, this.height, this.physicsInfo);
              */
      },

      Update: function (deltaTime)
      {
          this.animation.Update(deltaTime);
          //this.ApplyVelocity(new b2Vec2(0, 1));
      },

      Draw: function (ctx)
      {
          /*
          var bodyPosition = this.body.GetPosition();
          var posX = bodyPosition.x * scale;
          var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);
          */
          ctx.save();

          //ctx.translate(posX, posY);

          ctx.scale(this.imgScale , this.imgScale);

          ctx.translate(this.position.x, this.position.y);
          this.animation.Draw(ctx);

          ctx.restore();
      },

  }
}
