"use strict"

var tiles = [];
var idx;
var tile;
var tileBoard = $('#tileBoard');
var misses;
var matches;
var timer;

for(idx = 1; idx <= 32; ++idx) {

	tiles.push({
		tileNum: idx,
		src: 'img/tile' + idx + '.jpg',
		flipped: false,
		matched: false
	});
}

$(document).ready(function() {
	$('#startGame').click(function() {
		createBoard();
		startTimer();
		play();
		
	});

	function createBoard() {
		//clears old board
		$(tileBoard).empty();
		//shuffle all tiles then selects first 8
		var shuffled = _.shuffle(tiles);
		var randomTiles = shuffled.slice(0,8);
		//creates a copy of each tile
		var pairs = [];
		_.forEach(randomTiles, function(tile) {
			pairs.push(tile);
			pairs.push(_.clone(tile));

		});
		pairs = _.shuffle(pairs); //reshuffle

		//creates board of 16 tiles
		var row = $(document.createElement('div'));
		var img;
		_.forEach(pairs, function(tile, elemIndex) {
			if (elemIndex > 0 && 0 === (elemIndex % 4)) {
				tileBoard.append(row);
				row = $(document.createElement('div'));
			}

			img = $(document.createElement('img'));
			img.attr ({
				src: 'img/tile-back.png',
				alt: 'tile' + tile.tileNum
			});
			img.data('tile', tile);

			row.append(img);
		});
		tileBoard.append(row);

	}

	function play(){
		var prevImage;
		var prevTile;
		var matches = 0;
		var remaining = 8;
		var misses = 0;
		var reset;

		$('#tileBoard img').click(function(){
			if (!reset) {

				var clickedImg = $(this);
				var tile = clickedImg.data('tile');
				
				if (!tile.flipped) {

					flipTile(tile, clickedImg);

					//first flip
					if (!prevImage) {
						prevImage = clickedImg;
						prevTile = tile;
					} else { 
					//second flip
					//resets if no match
						if (prevTile.tileNum == tile.tileNum) {
							matches++;
							remaining--;
							prevImage = null;
						} else {
							reset = true;
							setTimeout(function() {
								flipTile(prevTile, prevImage);
								flipTile(tile, clickedImg);
								prevImage = null;
								reset = false;
								}, 1000
							);
							misses++;
						}



						//if all tile pairs have been matched, displays win message
						if (remaining == 0) {
							alert("You Win!");
						}
					}
				}

						//displays updated stats after each turn
						$('#remaining').text(remaining + " pairs");
						$('#misses').text("Misses: " + misses);
						$('#matches').text("Matches: " + matches);
			}

		});


	}

	function startTimer() {
		var startTime = Date.now();
		window.clearInterval(timer); //resets elapsed time when new game starts
		timer = window.setInterval(function() {
			var elapsedSeconds = (Date.now() - startTime) / 1000;
			elapsedSeconds = Math.floor(elapsedSeconds);
			$('#elapsedSeconds').text('Time elasped: ' + elapsedSeconds + ' seconds');
		}, 1000);
	}


});

//flips the passed tile over to either display the tile-back or the image.
function flipTile(tile, img) {
	console.log(img);
	img.fadeOut(100, function() {
		if (tile.flipped) {
		img.attr('src', 'img/tile-back.png');
		}
		else {
			img.attr('src', tile.src);
		}
		tile.flipped = !tile.flipped;
		img.fadeIn(100);
	});

}
