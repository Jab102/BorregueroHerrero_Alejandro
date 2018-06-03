function NewProgressBar ()
{
  return {
      width: 1,
      height: 0.3,
      position: {x: 730, y: 45},
      imgScale: 1,

      animation: {
          img: progressBarImage,
          timePerFrame: 1/24,
          currentFrametime: 0,
          frameWidth: 100,
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
          density:0,
          fixedRotation: true,
          linearDamping: 8,
          type: b2Body.b2_staticBody
      },

      Start: function ()
      {

      },

      Update: function (deltaTime)
      {
          this.animation.Update(deltaTime);
      },


      Draw: function (ctx)
      {
          ctx.save();

          ctx.scale(this.imgScale, this.imgScale);

          ctx.translate(this.position.x, this.position.y);
          this.animation.Draw(ctx);


          ctx.restore();
      },


  }
}
