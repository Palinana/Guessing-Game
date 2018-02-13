var Game = function(){
    this.playersGuess = null; //attemps
    this.pastGuesses = [];//guesses
    this.winningNumber = generateWinningNumber();;
}

function generateWinningNumber(){
    var num = Math.floor(Math.random() * 100) + 1;
    if(num === 0){
        return 1;
    }
    else{
        return num;
    }
}
function newGame(){
    return new Game();
}
function shuffle(arr){
    for(var i = arr.length-1; i > 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = temp;
     }
     return arr;
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
};
Game.prototype.isLower = function(){
    if(this.playersGuess < this.winningNumber){
        return true;
    }
    return false;
};
Game.prototype.playersGuessSubmission = function(num){
    if(isNaN(num) || num < 1 || num > 100){
        throw 'That is an invalid guess.';
    }
    this.playersGuess = num;
    return this.checkGuess();
};
//adding jQuery here
Game.prototype.checkGuess = function() {
    if(this.playersGuess === this.winningNumber) {
        $('#hint, #submit').prop('disabled', true);
        $('#reset').css('background-color', 'rgb(240, 241, 193)');
        $('#subtitle').text('Press the Reset button to play again!');
        return 'You Win!';
    }
    else {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
            return 'You have already guessed that number.';
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
            if(this.pastGuesses.length === 5) {
                $('#hint, #submit').prop('disabled', true);
                $('#reset').css('background-color', 'rgb(240, 241, 193)');
                $('#subtitle').text('Press the Reset button to play again!');
                return 'You Lose.';
            }
            else {
                var diff = this.difference();
                if(this.isLower()){
                    $('#subtitle').text('Guess Higher!');
                }
                else{
                    $('#subtitle').text('Guess Lower!');
                }
                if(diff < 10){
                    return'You\'re burning up!';
                } 
                else if(diff < 25){
                    return'You\'re lukewarm.';
                } 
                else if(diff < 50){
                    return'You\'re a bit chilly.';
                } 
                else{
                    return'You\'re ice cold!';
                } 
            }
        }
    }
}

Game.prototype.provideHint = function(){
    var hintArr = [this.winningNumber,generateWinningNumber(),generateWinningNumber()];
    return shuffle(hintArr);
}

//jQuery starts here

//create that takes input from user
function makeAGuess(game) {
    var guess = $('#players-input').val();
    $('#players-input').val(""); // clear the input element (string)
    var output = game.playersGuessSubmission(parseInt(guess,10));// submitted value(number) and print it
    if(output === 'You Win!'){
        $('#title').text(output).css('color', 'rgb(93, 190, 166)');
    }
    else if(output === 'You Lose.'){
        $('#title').text(output).css('color', 'rgb(204, 77, 77)');
    }
    else{
        $('#title').text(output).css('color', 'black');
    }
    
}

$(document).ready(function(){

    //create a new game instance
    var game = new Game();
    
    $('#submit').click(function(e) {
        makeAGuess(game);
    })
     
    $('#players-input').keypress(function(event) {
        if ( event.which == 13 ) {
           makeAGuess(game);
        }
    })
    
    $('#hint').click(function(){
        var hints = game.provideHint();
        $('#title').text('The winning number is '+ hints[0] + ', '+ hints[1] + ', or ' + hints[2]);
    });

    $('#reset').click(function(){
        game = newGame();
      
        $('#title').text('Play the Guessing Game!').css('color', 'black');
        $('#subtitle').text('Guess a number between 1-100!');
        $('.guess').text('-');
        $('#hint, #submit').prop('disabled', false);
    })
})