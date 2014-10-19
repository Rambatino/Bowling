/* 
	Bowling Score calculation
	Copyright Mark Ramotowski 2014
	MIT Licence
*/ 

// number of frames in a typical bowling game

var numberOfFrames = 10;
var maxPins = 10;
var currentRoundShotSaver = [];


var calculateScore = function (pinsRemaining) {
	var max = pinsRemaining;
	var min = 0; // i.e. gutter ball
	return Math.floor(Math.random() * (max - min) + min);
};

// Simulate the 10 rounds in the game and store the results in currentRoundShotSaver
// 

for (var frame = 0; frame < numberOfFrames; ++frame) {
	var currentFrameScore = [];		

	var firstBowl = calculateScore(maxPins);

	currentFrameScore.push(firstBowl);

	if (firstBowl !== 10) {
		// take another shot with the remaining pins
		
		var secondBowl = calculateScore(maxPins - firstBowl);
		currentFrameScore.push(secondBowl);

		if(frame === numberOfFrames) { // the player got a spare and therefore gets another shot
			var thirdBowl = calculateScore(maxPins);
			currentFrameScore.push(thirdBowl);
		}
	} else if(frame === numberOfFrames) { // it is the last round and therefore the user gets another two shots
		
		var secondBowl = calculateScore(maxPins);
		currentFrameScore.push(secondBowl);

		var thirdBowl;
		if(secondBowl === 10) { // user has scored a strike and therefore there needs to be 10 more pins to score from
			thirdBowl = calculateScore(maxPins);
		} else {
			thirdBowl = calculateScore(maxPins);
		}

		currentFrameScore.push(secondBowl);
	}

	// Store the current frame score in the total score array
	currentRoundShotSaver.push(currentFrameScore);
}

// Now we have an array of arrays whereby the inner array represent the scores for each frame and the main array length = 10
// Therefore need to turn that into a score

/*
		Scoring System:

		A strike earns 10 points plus the sum of your next two shots.
		A spare earns 10 points plus the sum of your next one shot.
		An open frame only earns the number of pins knocked down. (where you don't knock down all the pins)
*/

var scoreForRound = 0;

for (var frame = 0; frame < currentRoundShotSaver.length; ++frame) { // iterating chronologically (the lower perfomance loop)
	var frameScores = currentRoundShotSaver[frame];

	if(frameScores.length === 0) {
		// Something has gone wrong
		// 
		// 
	} else if(frame === numberOfFrames) {	// In the last frame so we sum up all the shots in it
		for (var i = frameScores.length - 1; i >= 0; i--) {
			scoreForRound += frameScores[i];
		}

	} else if(frameScores.length === 1) { // The user scored a strike and therefore must sum the next two shots
		scoreForRound += 10;

		// Must look into the next (two) frame(s) to get the subsequent two shots

		var shotsInNextFrame = currentRoundShotSaver[frame + 1]; // Don't need to worry about running to the end of the frames as there will always be at least two shots in the last frame

		if(shotsInNextFrame === 1) { // The player scored a strike in their next game also
			scoreForRound += shotsInNextFrame[0]; // which will, by logical exclusion, be 10
			scoreForRound += currentRoundShotSaver[frame + 2][0]; // get their first shot two rounds away
		} else {
			scoreForRound += shotsInNextFrame[0];
			scoreForRound += shotsInNextFrame[1];
		}
	} else {
		var firstBowlOfFrame = frameScores[0];
		var secondBowlOfFrame = frameScores[1];
		var frameScore = firstBowlOfFrame + secondBowlOfFrame;
		scoreForRound += frameScore;
		if(scoreForRound === 10) { // Safe to look into the second index and first because by this point it will have at least two indices and is not the last frame
		
		// it is a spare, so need to get the first shot from the next frame
		
		var shotsInNextFrame = currentRoundShotSaver[frame + 1]; 
		scoreForRound += shotsInNextFrame[0]; 
		}
	}
}

// The final score is therefore equal to scoreForRound

