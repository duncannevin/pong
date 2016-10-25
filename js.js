(() => {
    let c = document.getElementById('table');
    let ctx = c.getContext('2d');

    c.width = 1000;
    c.height = 700;

    //global object to track top/left coordinates...
    let coords = {};
    coords.left = [0, 300];
    coords.right = [980, 300];
    coords.ball = [0, 0];

    //global user info...
    let users = {};

    //global score info...
    let scores = {};
    scores.left = 0;
    scores.right = 0;

    //global pause var, logs if the game is paused...
    let pause = true;

    //level chosen by user...
    let level;

    //Functions for loading board and the ball...
    class Game{
      constructor() {

        let score;
        let ballRadius = 10;
        let dx = 2;
        let dy = -1;
        let ball = [500, 350];
        let coords = {};
        coords.left = [0, 300];
        coords.right = [980, 300];

        //keeps a copy of the paddles locations in closure...
        this.pLocation = (loc, player) => {
          coords[player] = loc;
        };

        //draw board with canvas...
        this.board = (x, y, w, h) => {
          // draw a table...
          ctx.beginPath();
          ctx.rect(x, y, w, h);//x, y->top left corner, width height.
          ctx.fillStyle = 'rgb(92, 184, 92)';
          ctx.fill();
          //draw net...
          ctx.strokeRect(499, 0, 2, 700);
          //drawing length wise center line...
          ctx.beginPath();
          ctx.moveTo(20, 350);
          ctx.lineTo(980, 350);
          ctx.stroke();
        };

        //function that updates the global score object...
        this.score = (side) => {
          //increase score in object...
          scores[side]++;
        };

        //write a function that creates the ball...
        this.drawBall = (x, y) => {//x, y params allow the user to move the paddles.
          //draws ball...
          ctx.beginPath();
          //center=(x, y) radius=30 angle=(0, 7)
          ctx.arc(x, y, ballRadius, 0, Math.PI*2);
          ctx.fillStyle = 'rgb(34, 34, 34)';
          ctx.fill();
          ctx.closePath();
        };

        //function that moves the ball...
        this.moveBall = () => {
          //clear board...
          this.board(20, 20, 960, 660);
          //draw the ball...
          this.drawBall(ball[0] - (ballRadius-10), ball[1]);


          //watches for the ball to hit right paddle...
          if(ball[0] === coords.right[0] - (ballRadius)){

            if(ball[1] > coords.right[1]-10 && ball[1] < (coords.right[1] + 110)){
              dx = -dx;
            }
          }

          //watches for the ball to hit the left paddle...
          if(ball[0] === (coords.left[0] + 20) + (ballRadius)){

            if(ball[1] > (coords.left[1]-10) && ball[1] < (coords.left[1] + 110)){
              dx = -dx;
            }
          }

          //this statement looks for the ball to go past the goal...
          if(ball[0] === 10 || ball[0] === 990){

            let side = dx < 0 ? 'right' : 'left';

            this.score(side);
            //stops function...
            ball = [500, 350];
            dy = -dy;
            //return a call to this function to serve the ball in the correct direction automatically...
            return this.moveBall();
          }

          //allows the ball to bounce off the top and bottom walls...
          if(ball[1] === 20 + (ballRadius) || ball[1] === (700 - 20) - (ballRadius)){
            dy = -dy;
          }


          ball[0] += dx;
          ball[1] += dy;
          //if the game is not paused...
          if(!pause){
            setTimeout(this.moveBall, level);
          }
        };
      }
    }

    //functions pertaining to the individual pleyers, ie paddles...
    class Paddles{
      constructor(player, n, s) {//up === keycode for up, down === keycode for down.

        let up, down, dir;//up=keycode for up//down=keycode for down//dir=direction the paddle is moving.

        //sets the appropriate keycode...
        (function() {
          up = n;
          down = s;
        })()

        //write a function that contains the paddles...
        this.paddle = (x, y, direction) => {//x, y params allow the user to move the paddles.
          //creates value to add or subtract for recoloring paddle space...
          let dir = direction === 'up' ? 40 : -40;

          //recoloring paddle space...
          ctx.beginPath();
          ctx.rect(x, y + dir, 20, 100);
          ctx.fillStyle = 'rgb(34, 34, 34)';
          ctx.fill();

          //draws paddle...
          ctx.beginPath();
          ctx.rect(x, y, 20, 100);
          ctx.fillStyle = 'rgb(238, 238, 238)';
          ctx.fill();
        };

        //adjust the coordinates each time the paddle is moved...
        this.adjustCoords = (direction) => {
          //getting the direction of to adjust the coordinates based on the key code...
          //if direction is x and coors[1] is correct....
          //also makes sure the paddles cannot leave the edge of the board...
          if(direction === 65 && coords[player][1] > 0 || direction === 76 && coords[player][1] > 0){
            coords[player][1] -= 40;
            dir = 'up';
          }else if(direction === 90 && coords[player][1] < 620 || direction === 188 && coords[player][1] < 620){
            coords[player][1] += 40;
            dir = 'down';
          }
        };

        this.moveP = (event) => {

          let newCoords;

          if(event.keyCode === up || event.keyCode === down){
            newCoords = this.adjustCoords(event.keyCode);//change coordinates.
            this.paddle(coords[player][0], coords[player][1], dir);//moves paddle based on new coordinates.
          }
        };

        this.returnCoords = () => {
          return coords[player];
        };
      }
    }

    class Utilities{
      constructor() {

        let $cont = $('.main-content');
        let $tab = $('#table');

        //animates a node up and down...
        this.moveArrow = (node) => {

          let move = this.moveArrow;

          $(node).animate({
            top: '+=198'},
            1000,
            function(){
              $(node).hide();
            }
          );

          $(node).animate({
            top: '-=198'},
            1000,
            function(){
              setTimeout(function(){
                $(node).fadeIn();
                move(node);
              }, 250);
            }
          );
        };

        //function makes arrows bounce showing th user which way the keys move the paddle...
        this.animateArrow = (node, bool) => {

          //downward arrows...
          if(bool === true){

            $(node).animate({
              top: '+=40'
            }, 1000);

            $(node).animate({
              top: '-=40'
            }, 1000);
          //upward arrows...
          }else{

            $(node).animate({
            top: '-=40'
            }, 1000);
            $(node).animate({
              top: '+=40'
            }, 1000);
          }

          setTimeout(this.animateArrow, 1, node, bool);
        };

        //function that updates global user information...
        this.userInfo = (name1, name2) => {
          users.left = name1;
          users.right = name2;
        };

        //creates the welcome page...
        this.welcome = () => {

          let $sign= $('<div class="sign-in jumbotron _shadow _off-white _margin-auto _black-border"></div>');

          $sign.append('<h2>Welcome to</h2><h1 class="_glow">PONG!</h1>');
          $sign.append('<div class="input-group player-one"><input type="text" class="form-control" name="player1" placeholder="Player one username"></div>');
          $sign.append('<div class="input-group player-two"><input type="text" class="form-control player-two" name="player2" placeholder="Player two username"><div class="input-group-btn one-player-button"><button type="button" class="btn btn-default">One player mode</button>/div></div>');
          $sign.append('<div class="btn-group" role="group" aria-label="..."><button type="button" id="hard-5" class="btn btn-default  level">hard</button><button type="button" id="difficult-3" class="btn btn-default level">difficult</button><button type="button" id="impossible-1" class="btn btn-default level">impossible</button></div>')
          $sign.append('<p><a class="btn btn-lg btn-success start-btn" href="#" role="button">Let\'s Play!</a></p>');
          $cont.append($sign);
        };

        //creates alert showing how the get info about the game...
        this.clickInfo = () => {

          let $here = $('<div class="contains-message _hide _margin-auto"></div>');

          $here.addClass('contains-message');
          $here.append('<div class="alert  _off-white shadow"><p>Click <span class="_glow">Game Info</span></p><p>to get started.</p></div>');
          $here.append('<span class="glyphicon glyphicon-arrow-down info-point"></span>');
          $cont.append($here);
          //dims the table...
          $('#table').addClass('_dim');
        };

        this.info = (player1, player2, scores) => {

          let up = '<span class="glyphicon glyphicon-triangle-top up-arrow"></span>';
          let down = '<span class="glyphicon glyphicon-triangle-bottom down-arrow"></span>';

          //entire div...
          let $infoB = $('<div class="jumbotron infoB _shadow _off-white _margin-auto _black-border">');

          //top left corner
          let $topLeft = $('<div class="_inline-block infoB-T infoB-TL"></div>');
          $topLeft.append('<h3>' + player1 + '</h3>');
          $topLeft.append('<div class="key _inline-block _black-border">A</div>');
          $topLeft.append('<div class="key _inline-block">' + up + '</div');
          $topLeft.append('<div class="key _inline-block _black-border">Z</div>');
          $topLeft.append('<div class="key _inline-block">' + down +  '</div>')
          $topLeft.append('<div class="_block">' + scores.left + '</div>');

          //top right corner...
          let $topRight = $('<div class="_inline-block infoB-T infoB-TR"></div>');
          $topRight.append('<h3>' + player2 + '</h3>');
          $topRight.append('<div class="key _inline-block _black-border">L</div>');
          $topRight.append('<div class="key _inline-block">' + up + '</div');
          $topRight.append('<div class="key _inline-block _black-border"><</div>');
          $topRight.append('<div class="key _inline-block">' + down +  '</div>')
          $topRight.append('<div class="_block">' + scores.right + '</div>');

          //animate arrows...
          this.animateArrow('.up-arrow');
          this.animateArrow('.down-arrow', true);

          //bottom...
          let $bottom = $('<div class="_block infoB-Bot"></div>');
          $bottom.append('<p>Press Spacebar To Start or Pause</p>')

          //appending all children the infoB...
          $infoB.append($topLeft, $topRight, $bottom);

          $cont.append($infoB);

        };
      }
    }

    //start game...
    let start = new Utilities();
    start.welcome();
    start.clickInfo();

    //game...
    let game = new Game();
    game.board(20, 20, 960, 660);
    //end//

    //left player...
    let left = new Paddles('left', 65, 90);
    left.paddle.apply(this, coords.left);
    game.pLocation(left.returnCoords());
    //end//

    //right player...
    let right = new Paddles('right', 76, 188);
    right.paddle.apply(this, coords.right);
    game.pLocation(left.returnCoords());
    //end//

    let doc = document;

    //event listeners...
    //keyboard events...
    doc.addEventListener('keydown', (event) => {
      //paddle controls...
      if(event.keyCode === 65 || event.keyCode === 90){
        left.moveP(event);
        game.pLocation(left.returnCoords(), 'left');
      }
      if(event.keyCode === 76 || event.keyCode === 188){
        right.moveP(event);
        game.pLocation(right.returnCoords(), 'right');
      }
    });

    //keyboard keyup listeners...
    doc.addEventListener('keyup', (event) => {
      //removes game info...
      if(event.keyCode === 32 && $('.infoB')){//space bar.
        //removes the user info and starts the game...
        if(pause){
          $('.infoB').remove();
          $('.contains-message').remove();
          $('#table').removeClass('_dim');
          pause = false;//unpauses games.
          game.moveBall();
        }else{
          //pauses the game...
         start.info(users.left, users.right, scores);
         $('#table').removeClass('_dim');
          $('.infoB').fadeIn({
            duration: 800
          });
          pause = true;//pauses the game.
        }
      }
    });

    //click event listeners...
    doc.addEventListener('click', (event) => {
      let e = event;
      //removes the sign in sheet...
      if(e.target.classList.contains('start-btn')){
        if(level !== undefined){
          $('.sign-in').fadeOut({
            duration: '800',
            complete: function(){
              //renders the board...
              $('#table, .dropdown').fadeIn({
                duration: '800',
                complete: function(){
                  //renders the get started message...
                  $('.contains-message').fadeIn({
                    duration: 800,
                    complete: function(){
                      //moves arrow down...
                      start.moveArrow('.info-point');
                      $('.info a').fadeIn({
                        duration: 800
                      });
                    }
                  });
                }
              });
            }
          });

          //update user object...
          users.left = $('.player-one input').val() || 'player1';
          users.right = $('.player-two input').val() || 'player2';
        }else{
          alert('Please select a level');
        }
      }

      // removes 'get started' helper...
      if(e.target.classList.contains('info-actual')){
        pause = true;//pauses game in it's tracks.
        $('.contains-message').fadeOut({
          duration: '800',
          complete: function(){
            start.info(users.left, users.right, scores);
            $('.infoB').fadeIn({
              duration: 800
            });
          }
        });
      }

      //gathers difficulty choice...
      if(e.target.classList.contains('level')){
        level = Number(e.target.id.split('-').pop());
      }
    });
    //end//

  })(window)










