var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var sonzin;

var morreus;

var pulaonzin;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  gameOver = loadImage ("gameOver.png");

  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  sonzin = loadSound("checkpoint.mp3");

  morreus = loadSound("die.mp3");

  pulaonzin = loadSound("jump.mp3");

  restart=loadImage("restart.png");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale = 0.5;

  trex.setCollider ("circle", 0, 0,40);

  trex.debug = true;
  
  ground = createSprite (200,180,400,20);
  ground.addImage ("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(width/2,height-20,width,10);
  invisibleGround.visible = false;
  
  gameover = createSprite (300,100);
  gameover.addImage (gameOver);
  gameover.scale = 2;

  restarts = createSprite (300,130);
  restarts.addImage(restart);
  restarts.scale = 0.40;

  //crie Grupos de Obstáculos e Nuvens
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  console.log("Hello" + 5);
  
  score = 0;
}

function draw() {
  background(180);
  text("Score: "+ score, 500,50);
  
  
  
  if(gameState === PLAY){
    //mover o solo
    gameover.visible = false
    restarts.visible = false

    ground.velocityX = -(4 + score/600);
    if(score > 0 && score % 600 === 0){
    sonzin.play();
    }
  
    if (ground.x < 0){
      ground.x = ground.width/2;
  }
    score = score + Math.round(getFrameRate()/60);

    if(touches.length > 0 || keyDown("space") && trex.y >= height - 165) {
      trex.velocityY = -13;
      pulaonzin.play();
      touches = [];

    }

    trex.velocityY = trex.velocityY + 0.8

   //gere as nuvens
  spawnClouds();
  
  //gere obstáculos no solo
  spawnObstacles();

  if(obstaclesGroup.isTouching(trex)){
    gameState=END;
    

   //trex.velocityY = -13;
   morreus.play();
  
  }

  }
  else if(gameState === END){
    //parar o solo
    gameover.visible = true
    restarts.visible = true

    ground.velocityX = 0;
    
    obstaclesGroup.setVelocityXEach (0);

    cloudsGroup.setVelocityXEach (0);
  
    cloudsGroup.setLifetimeEach (-1);

    obstaclesGroup.setLifetimeEach (-1);

    trex.changeAnimation ("collided" , trex_collided);

   
  }
  
  
  trex.collide(invisibleGround);
  
  
  
  if(mousePressedOver (restarts)){
   reiniciar();
  }

  drawSprites();
}

function reiniciar(){
  gameState = PLAY;
  gameover.visible = false
  
  restarts.visible = false
  
  obstaclesGroup.destroyEach();
  
  cloudsGroup.destroyEach();
  
  trex.changeAnimation ("running", trex_running);
  
  score = 0;
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -(5 + score/600);

   
    // //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo          
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir vida útil à variável
    cloud.lifetime = 190;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
  }
  
}
