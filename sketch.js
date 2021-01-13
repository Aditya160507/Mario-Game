var bgImg , bulletImg , cloudImg , coinImg , deadmarioImg , enemy1Img , enemy2Img , gameoverImg ; 
var marioheadImg , pipeImg , runningmarioImg;
var standingmarioImg , textImg , groundImg;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var bulletGroup;
var cloudGroup;
var pipeGroup;
var enemyGroup;
var coinGroup;
var coincount = 0;
var lifeTime = 5;
var score = 0;

function preload(){
bgImg = loadImage("images/bg.png");
bulletImg = loadImage("images/bullet.png");
cloudImg = loadImage("images/cloud.png");
deadmarioImg = loadAnimation("images/mario_dead.png");
enemy1Img = loadAnimation("images/enemy1.png","images/enemy2.png");
coinImg=loadImage("images/coin.png")
marioheadImg = loadImage("images/mario_head.png");
pipeImg = loadImage("images/pipe.png");
runningmarioImg = loadAnimation("images/running_mario.png","images/standing_mario.png");
textImg = loadImage("images/text.png");
groundImg=loadImage("images/Ground.png");
gameoverImg = loadImage("images/gameOver.png");
resetImg = loadImage("images/restart.png");

}

function setup(){
    createCanvas(1200,400);
    ground = createSprite(600,390,1200,10);
    ground.addImage("ground",groundImg);
    ground.x = ground.width/2

    mario = createSprite(90,300,10,10);
    mario.addAnimation("running",runningmarioImg);
    mario.addAnimation("deadmario",deadmarioImg);
    mario.scale =0.5

    invisibleground = createSprite(600,370,1200,10);
    invisibleground.visible = false;

    mariohead = createSprite(50,50,10,10);
    mariohead.addImage("mariohead",marioheadImg);
    mariohead.scale = 0.1;
    
    coin = createSprite(200,50,10,10);
    coin.addImage("coin",coinImg);
    coin.scale = 0.09;

    instruct = createSprite(600,170);
    instruct.addImage("instruct",textImg);
    instruct.lifetime = 100;

    gameover = createSprite(600,140,10,10);
    gameover.addImage("gameover",gameoverImg);
    gameover.scale=0.3;

    reset = createSprite(600,220,10,10);
    reset.addImage("reset",resetImg);
    reset.scale=0.3;
    gameover.visible = false;
    reset.visible = false;

    bulletGroup=new Group ();
    cloudGroup=new Group ();

    pipeGroup=new Group ();
    enemyGroup=new Group ();
    coinGroup=new Group ();
}

function draw(){
    background("skyblue");
    fill ("black");
    textSize(35);
    text ("x",220,60);
    text (coincount,250,60);
    text ("x",70,60);
    text (lifeTime,90,60);
    fill ("white")
    text("Score :"+score,500,60)

    if(gameState===PLAY){
        ground.velocityX=-7;
      
        score=score+Math.round(getFrameRate()/60);
        if(ground.x<0){                                                    
            ground.x = ground.width/2
        }
        if (keyDown(UP_ARROW) ){
            mario.velocityY = -20;
        }
       
        if(keyDown("space")){
        bullet = createSprite(mario.x,mario.y);
        bullet.addImage("bullet",bulletImg);
        //bullet.scale=0.7;
        bullet.velocityX=4;
        bulletGroup.add(bullet);
        }
        spawnCloud();
        spawnPipe();
        spawnEnemy();
        spawnCoin();
        if(pipeGroup.isTouching(mario)||enemyGroup.isTouching(mario)){
            lifeTime = lifeTime-1;
            gameState=END;
        }
        if(bulletGroup.isTouching(enemyGroup)){
            bulletGroup.destroyEach();
            enemyGroup.destroyEach();
        }
        for(var j =0; j<coinGroup.length;j++){
            if(coinGroup.isTouching(mario)){
                coinGroup.get(j).destroy();
                coincount =coincount +1 ;
            }
        }
        if(lifeTime===0){
        gameState===END;  
        }
        mario.velocityY=mario.velocityY+1;
        
}
    if(gameState===END){
        ground.velocityX=0;
        cloudGroup.setVelocityXEach(0);
        coinGroup.setVelocityXEach(0);
        pipeGroup.setVelocityXEach(0);
        enemyGroup.setVelocityXEach(0);
        cloudGroup.setLifetimeEach(-1);
        pipeGroup.setLifetimeEach(-1);
        coinGroup.setLifetimeEach(-1);
        enemyGroup.destroyEach();
        //mario.velocityY=0;
        mario.changeAnimation("deadmario",deadmarioImg);
      
    }
    //when we have lifetime but gamestate is end 
    if(gameState===END && lifeTime>0){
        gameover.visible = true;
        reset.visible = true;

        if(mousePressedOver (reset)){
            restart_part();        
        }

    }
     //when dont but gamestate is end 
    if(gameState===END && lifeTime<0){
        gameover.visible = true;
        reset.visible = true;

        if(mousePressedOver (reset)){
            restart();             
        }

    }
    mario.collide(invisibleground);
    drawSprites();
}

function restart_part(){
    gameState=PLAY;
    cloudGroup.destroyEach();
    pipeGroup.destroyEach();
    enemyGroup.destroyEach();
    coinGroup.destroyEach();
    mario.changeAnimation("running",runningmarioImg);
    instruct = createSprite(600,170);
    instruct.addImage("instruct",textImg);
    instruct.lifetime = 100;
    gameover.visible = false;
    reset.visible = false;
   

}
function restart(){
    lifeTime=5;
    score=0;
    coincount=0;
    gameState=PLAY;
    cloudGroup.destroyEach();
    pipeGroup.destroyEach();
    enemyGroup.destroyEach();
    coinGroup.destroyEach();
    mario.changeAnimation("running",runningmarioImg);
    instruct = createSprite(600,170);
    instruct.addImage("instruct",textImg);
    instruct.lifetime = 100;
    gameover.visible = false;
    reset.visible = false;
   

}
function spawnCloud(){
    if(frameCount%100===0){
    cloud = createSprite(1200,random(50,150),10,10)
    cloud.addImage("cloud",cloudImg);
    cloud.velocityX = -3
    cloud.scale = 2
    cloud.lifeTime = 420;
    cloudGroup.add(cloud);
    }

}
function spawnPipe(){
    if(frameCount%90===0){
        pipe = createSprite(1200,330,10,10)
        pipe.addImage("pipe",pipeImg);
        pipe.velocityX = -5;
        pipe.scale = 0.5;
        pipe.lifeTime = 240;
        pipeGroup.add(pipe);
        }
        
}
function spawnEnemy(){
    if(frameCount%200===0){
        enemy = createSprite(1200,330,10,10)
        enemy.addAnimation("enemy",enemy1Img);
        enemy.velocityX = -6;
        enemy.scale = 0.2;
        enemy.lifeTime = 240;
        enemyGroup.add(enemy);
        }
}
function spawnCoin(){
    if(frameCount%150===0){
        for(var i = 0; i<5; i++){
         coin = createSprite(1200+i*20,200,10,10);
         coin.addImage("coin",coinImg);
         coin.velocityX = -5;
         coin.scale = 0.08;
         coin.lifeTime = 1000;
         coinGroup.add(coin);
        }
    }

}