
var canvas;
var ctx;

var pi_2 = Math.PI * 2;

var fixedDeltaTime = 0.01666666; // 60fps: 1 frame each 16.66666ms
var deltaTime = fixedDeltaTime;

var time = 0,
    FPS  = 0,
    frames    = 0,
    acumDelta = 0;

var timePlayed = 0;
var beginning;

// images references
var playerImg, coinImg, progressBarImage, greenTickImage;
var projectileImg;
var backgroundImg;
var playerBarImage;
var woodenBoxImg;

var coins = [];
var projectiles = [];
var progressBars = [];
var ticks = [];
var enableTicks = [];
var playerBars = [];
var barbackgrounds = [];
var animatedBackgrounds = [];

//variables for playerBars
//value between 0 - 1, works as the percentaje
//decreases 0.3 each hit
var totalLife = 1;

//damages
var boxDamage = 0.4;

//booleans
var canShoot = true;
var gamePaused = false;
var collision = false;

var verticalScroll = 0.4;
var scrollSpeed = 2;

//Sonido
var sounds =
{
    shot: null,
    jump: null,
    explosion: null,
    death: null
};

var score = 0;

function Init ()
{
    console.log("Init");
    // preparamos la variable para el refresco de la pantalla
    window.requestAnimationFrame = (function (evt) {
        return window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, fixedDeltaTime * 1000);
            };
    }) ();
    console.log("Init1");
    canvas = document.getElementById("my_canvas");

    if (canvas.getContext)
    {
        ctx = canvas.getContext('2d');

        coinImg = new Image();
        coinImg.src = "./media/coin.png";

        projectileImg = new Image();
        projectileImg.src = "./media/bullet.png";

        progressBarImage = new Image();
        progressBarImage.src = "./media/progressBar.png";

        greenTickImage = new Image();
        greenTickImage.src = "./media/greentick.png";

        woodenBoxImg = new Image();
        woodenBoxImg.src = "./media/woodenbox.png";

        playerBarImage = new Image();
        playerBarImage.src = "./media/playerBar.png";

        greenbgImage = new Image();
        greenbgImage.src = "./media/greenBar.png";

        animatedbgImage = new Image();
        animatedbgImage.src = "./media/coin.png";

        playerImg = new Image();
        playerImg.src = "./media/player.png";
        playerImg.onload = Start();
    }

    //SONIDO
    sounds.shot = document.getElementById('shot');
    sounds.jump = document.getElementById('jump');
    sounds.explosion = document.getElementById('explosion');
    sounds.death = document.getElementById('death');

    beginning = Date.now();

}

function Start ()
{
    // setup keyboard events
    SetupKeyboardEvents();

    // setup mouse events
    SetupMouseEvents();

    // initialize Box2D
    PreparePhysics(ctx);


    player.Start();

    obstacle.Start();

    for (var i = 0; i < 5; i++)
    {
        var randomPosX = Math.floor((Math.random() * 700) + 50);
        var randomPosY = Math.floor((Math.random() * 100) + 300);
        var coin = NewCoin({x: randomPosX, y: randomPosY, score: 30});
        coin.Start();
        coins.push(coin);

    }

    var progressBar = NewProgressBar();
    progressBar.Start();
    progressBars.push(progressBar);

    var projectile = NewProjectile({x:-100, y: 100, score: 50});
    projectile.Start();
    projectiles.push(projectile);

    var playerBar = NewPlayerBar({x:730, y: 80});
    playerBar.Start();
    playerBars.push(playerBar);

    var greenBar = NewBarBackground({x:730, y: 80});
    greenBar.Start();
    barbackgrounds.push(greenBar);

    var animatedbg = NewAnimatedBackground({x:100, y: 100});
    animatedbg.Start();
    animatedBackgrounds.push(animatedbg);

    for (var i = 0; i < 5; i++)
    {
        var tick = NewCheckTick({x: 700 + (i * 20), y: 35});
        enableTicks[i] = false;
        tick.Start();
        ticks.push(tick);
    }

    // first call to the game loop
    Loop();
}

function Loop ()
{
    requestAnimationFrame(Loop);

    var now = Date.now();
    deltaTime = now - time;
    if (deltaTime > 1000) // si el tiempo es mayor a 1 seg: se descarta
        deltaTime = 0;
    time = now;

    frames++;
    acumDelta += deltaTime;

    //calculate the time played
    timePlayed = now - beginning;
    timePlayed = timePlayed / 1000;

    if (acumDelta > 1000)
    {
        FPS = frames;
        frames = 0;
        acumDelta -= 1000;
    }

    // transform the deltaTime from miliseconds to seconds
    deltaTime /= 1000;

    // Game logic -------------------
    UpdateInputs ();

    if(!gamePaused)
    {
        Update();
        Draw();
    }
    else
    {
        // onPause
        ctx.textAlign = 'center';
        ctx.fillText('PAUSE, PRESS ANY KEY TO CONTINUE', 400, 100);
        ctx.fillText('PORTFOLIO PAGE PLACEHOLDER', 400, 110);
        ctx.textAlign = 'left';
    }
}

//function which manages the inputs by keycode
function UpdateInputs ()
{
    input.update();

    if (input.isKeyPressed(KEY_PAUSE))
        gamePaused = true;

    // player logic
    if (input.isKeyPressed(KEY_LEFT))
    {
        player.moveLeft = true;
        gamePaused = false;
    }

    if (input.isKeyPressed(KEY_RIGHT))
    {
        player.moveRight = true;
        gamePaused = false;
    }

    if (input.isKeyPressed(KEY_UP))
    {
        player.Jump();
        gamePaused = false;
        sounds.jump.currentTime = 0;
        sounds.jump.play();
    }

    if (input.isKeyPressed(KEY_SPACE) && canShoot)
    {
        var bodyPositionPlayer = player.body.GetPosition();
        projectiles[0].body.SetPosition(bodyPositionPlayer);
        canShoot = false;
        gamePaused = false;
        //gamePaused = true;

        sounds.shot.currentTime = 0;
        sounds.shot.play();
    }
}

function Update ()
{

    // update physics
    // Step(timestep , velocity iterations, position iterations)
    world.Step(deltaTime, 8, 3);
    world.ClearForces();

    player.Update(deltaTime);

    // update coins
    for (var i = 0; i < coins.length; i++)
    {
        coins[i].Update(deltaTime);
        coins[i].ApplyVelocity (new b2Vec2(0, 0.3));
    }

    //projectile update
    projectiles[0].Update(deltaTime);
    projectiles[0].ApplyVelocity (new b2Vec2(0, 1));

    //collisions boxes - projectile
    for (var i = 0; i < coins.length; i++)
    {
        if( projectiles[0].CheckBoxCollisions(coins[i]))
        {
            sounds.explosion.currentTime = 0;
            sounds.explosion.play();
            collision = true;
            projectiles[0].body.SetPosition({x: 500, y: 330});
            coins[i].body.SetPosition({x: 600, y: 330});
            UpdateProgress(i);
            gamePaused = true;
            score += coins[i].score;
        }
    }

    // collisions box - player
    for (var i = 0; i < coins.length; i++)
    {
        if( player.CheckBoxCollisions(coins[i]))
        {
            coins[i].body.SetPosition({x: -800, y: 330});
            sounds.death.currentTime = 0;
            sounds.death.play();
            //barbackgrounds[0].Draw(ctx);
            collision = true;
            console.log("toca player");
            totalLife = totalLife - boxDamage;
            //coins[i].body.SetPosition({x: (100 * (i+ 1)) / scale , y: 400 / scale});
            barbackgrounds[0].UpdateFillValue(totalLife);
            console.log("total life" + totalLife);
            score -= 15;
            if(totalLife < 0)
              totalLife = 0;
        }
    }

    //boxes touching the floor
    for (var i = 0; i < coins.length; i++)
    {
        var posY = coins[i].GetBoxBottomLimit();
        if( posY < 20)
        {
            console.log("toca suelo");
            score -= 5;
            coins[i].body.SetPosition({x: (100 * (i+ 1)) / scale , y: 400 / scale});
        }
    }

    //if the projectile is over certain Y, we can shot it again
    var posYprojectile = projectiles[0].body.GetPosition();
    if(posYprojectile.y * scale > 400)
    {
        projectiles[0].body.SetPosition({x: -1200, y: 330});
        canShoot = true;
    }

    //update the new position for the images in the background
    verticalScroll += 0.003;

    if(verticalScroll > 0.6)
        verticalScroll = 0;

    //if the player dies, reset game
    if(totalLife == 0)
    {

        for (var i = 0; i < coins.length; i++)
        {
          var randomPosX = Math.floor((Math.random() * 700) + 50);
          var randomPosY = Math.floor((Math.random() * 100) + 300);
          coins[i].body.SetPosition({x: randomPosX/ scale, y: randomPosY / scale});
        }
        for (var i = 0; i < enableTicks.length; i++) {
          enableTicks[i] = false;
        }
        totalLife = 1;
        barbackgrounds[0].UpdateFillValue(totalLife);
        gamePaused = true;
    }

}

function Draw ()
{
    // clean the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the world
    DrawWorld(world);

    // draw the background
    DrawBackground();

    // draw the player
    player.Draw(ctx);

    obstacle.Draw(ctx);

    //projectile.Draw(ctx);
    if(collision)
        ctx.fillText('Collision: ' , 300, 200);

    // draw coins
    /*
    for (var i = 0; i < coins.length; i++)
        window.setTimeout("DrawBox(0)", 2000);
        */
    for (var i = 0; i < coins.length; i++) {
      coins[i].Draw(ctx);
    }


    for (var i = 0; i < projectiles.length; i++)
    {
        projectiles[i].Draw(ctx);
    }

    //color backgrounds
    barbackgrounds[0].Draw(ctx);

    //player life, mana, etc bars
    playerBars[0].Draw(ctx);

    //portfolio completion progressbar
    progressBars[0].Draw(ctx);

    //enables the ticks draws
    for (var i = 0; i < enableTicks.length; i++)
    {
        if(enableTicks[i])
        {
            ticks[i].Draw(ctx);
        }
    }

    // draw the FPS
    ctx.fillStyle = "yellow";
    ctx.fillText('FPS: ' + FPS, 15, 20);
    ctx.fillText('Score: ' + score, 15, 30);
    ctx.fillText('Time played: ' + Math.round(timePlayed), 15, 40);
    //ctx.fillText('deltaTime: ' + Math.round(1 / deltaTime), 15, 50);
    //ctx.fillText('total bodys: ' + world.GetBodyCount(), 10, 50);

    //debugs used to calculate collisions, etc
    /*
    var bodyPosition = projectiles[0].body.GetPosition();
    ctx.fillText('pos y projectile: ' + (bodyPosition.y * scale+6), 10, 40);
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(bodyPosition.x * scale, canvas.height- bodyPosition.y * scale + 6, 3, 0, pi_2);
    ctx.fill();

    var bodyPosition = projectiles[0].GetProjectileLeftLimit();
    ctx.fillText('proy left limit: ' + bodyPosition, 10, 50);
    var bodyPosition = projectiles[0].GetProjectileRightLimit();
    ctx.fillText('proy right limit: ' + bodyPosition, 10, 60);
    var bodyPosition = coins[0].GetBoxLeftLimit();
    ctx.fillText('box left limit: ' + bodyPosition, 10, 70);
    var bodyPosition = coins[0].GetBoxRightLimit();
    ctx.fillText('box right limit: ' + bodyPosition, 10, 80);

    var bodyPosition = coins[0].body.GetPosition();
    ctx.fillText('box y pos ' + (bodyPosition.y * scale-10), 10, 100);
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(bodyPosition.x * scale, canvas.height - (bodyPosition.y * scale -20), 3, 0, pi_2);
    ctx.fill();
    */
}

function DrawBox(index)
{
     coins[index].Draw(ctx);
}

function DrawBackground ()
{
      //calcular color gradiente
     var bgGrd = ctx.createLinearGradient(0, 0, 0, canvas.height);
     bgGrd.addColorStop(verticalScroll, "blue");
     bgGrd.addColorStop(0.7 , "#365B93");

     //rellear
     ctx.fillStyle = bgGrd;
     ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
}

function DrawWorld (world)
{
    // Transform the canvas coordinates to cartesias coordinates
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    world.DrawDebugData();
    ctx.restore();
}

//enables the check/tick by index
function UpdateProgress (index)
{
    console.log("[Code] UpdateProgres: "+ index);
    enableTicks[index] = true;

}
