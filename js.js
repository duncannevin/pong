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

    //Functions for loading board and the ball...
    class Game{
      constructor() {

        let score;
        let directionX = 2;
        let directionY = 0.05;
        let ball = [50, 350];
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

        //write a function that creates the ball...
        this.drawBall = (x, y) => {//x, y params allow the user to move the paddles.
          //erases old ball...
          this.board(20, 20, 960, 660);
          //draws ball...
          ctx.beginPath();
          //center=(x, y) radius=30 angle=(0, 7)
          ctx.arc(x, y, 30, 0, 7);
          ctx.fillStyle = 'rgb(34, 34, 34)';
          ctx.fill();
          ctx.closePath();
        };

        //function that adjusts the balls coordinates...
        this.ballCoordinates = () => {
          ball = ball || coords.left.map((val) => {return val + 50});
          ball[0] += directionX;
          ball[1] += directionY;
        };

        //function that moves the ball...
        this.moveBall = () => {

          let whoHit = 'left';
          //function adjusts the direction of the ball based on where it hits the paddle...
          let a = () => {
            if(ball[1] >= coords[whoHit][1] && ball[1] < coords[whoHit][1] + 33){
              directionY = -0.15
              return;
            }
            if(ball[1] <= coords[whoHit][1] + 100 && ball[1] > coords[whoHit][1] + 77){
              directionY = +0.15
              return;
            }
            //this ensures the ball can never travel in a straigh line...
            directionY = -directionY;
          };
          //adjust ball coordinates...
          this.ballCoordinates();
          //draw the ball...
          this.drawBall(ball[0], ball[1]);
          if(ball[0] === coords.right[0] - 30 && ball[1] < coords.right[1] + 100 && ball[1] > coords.right[1]){
            whoHit = 'right';
            directionX = -directionX;
            a();
          }
          if(ball[0] === coords.left[0] + 50 && ball[1] < coords.left[1] + 100 && ball[1] > coords.left[1]){
            whoHit = 'left';
            directionX = -directionX;
            a();
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
          ctx.fillStyle = 'rgb(238, 238, 238)';
          ctx.fill();

          //draws paddle...
          ctx.beginPath();
          ctx.rect(x, y, 20, 100);
          ctx.fillStyle = 'rgb(34, 34, 34)';
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
        //renders the welcome page the the DOM...
        this.welcome = () => {

          let $sign = $('<div class="jumbotron sign-in shadow"></div>');

          $sign.append('<h2>Welcome to</h2><h1 class="glow">PONG!</h1>');
          $sign.append('<div class="input-group player-one"><input type="text" class="form-control" name="player1" placeholder="Player one username"></div>');
          $sign.append('<div class="input-group player-two"><input type="text" class="form-control" name="player2" placeholder="Player two username"><div class="input-group-btn one-player-button"><button type="button" class="btn btn-default">One player mode</button>/div></div>');
          $sign.append('<p><a class="btn btn-lg btn-success start-btn" href="#" role="button">Let\'s Play!</a></p>');
          $cont.append($sign);
        };

        //function makes table dim and points at the drop down with a message...
        this.infoSpot = () => {

          let $here = $('<div class="contains-message shadow"></div>');

          $here.append('<span class="glyphicon glyphicon-arrow-up"></span>');

          $here.append('<div class="alert"><p>Click<span class="glow">Game Info</span></p><p>to get started.</p></div>');

          $('#table').addClass('dim');
          $('.info a').addClass('glow');
          $cont.append($here);
        };
      }
    }
    //start game...
    let start = new Utilities();
    start.welcome();
    start.infoSpot();

    //game...
    let game = new Game();
    game.board(20, 20, 960, 660);
    // setInterval(game.moveBall, 1);
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
    //looks for up and down keys to be pressed for each side...
    doc.addEventListener('keydown', (event) => {
      if(event.keyCode === 65 || event.keyCode === 90){
        left.moveP(event);
        game.pLocation(left.returnCoords(), 'left');
      }
      if(event.keyCode === 76 || event.keyCode === 188){
        right.moveP(event);
        game.pLocation(right.returnCoords(), 'right');
      }
    });
    doc.addEventListener('click', (event) => {
      let e = event;
      //removes the sign in sheet...
      if(e.target.classList.contains('start-btn')){
        $('.sign-in').fadeOut({
          duration: '800',
          complete: function(){
            //renders the board...
            $('#table, .dropdown').fadeIn({
              duration: '800',
              complete: function(){
                $('.contains-message').fadeIn({
                  duration: 800
                });
              }
            });
          }
        });
      }
      //removes contians-message...
      if(e.target.classList.contains('info'))
    });
    //end//

  })(window)