/** contextFlankerPracticeTask runs the practice blocks
 * 
 */
function contextFlankerPracticeTask(){
    // set taskName for data logging
    taskName = "contextFlankerPracticeTask";
    // nPracticeTrials = 3; //this gets overriden by main anyway

    // prepare for task
    hideInstructions();
    showCanvas();
    hideCursor();
    changeScreenBackgroundTo("white");

    //create task arrays
    conArray = buildPracticeConArray();
    locArray = buildPracticeLocArray();

    // global variables for functions
    taskFunc = practiceTrialFunc;
    transitionFunc = itiScreen;

    //assign congruency and location values to each practice image (make this more efficient later)
    for (let i=0; i < conArray.length; i++) {
        selectedPracticeImages[i].con = conArray[i];
    }

    for (let i=0; i< locArray.length; i++) {
        selectedPracticeImages[i].loc = locArray[i];
    }

    imageSet = selectedPracticeImages; //attempt to be more modular, but honestly don't need this variable, can just set it in stimScreen.

    stimFunc = draw; //this is the actual trial function that gets run by stimScreen. For this experiment, don't really need this variable since it will always be draw().

    //draw the trial input, which is one of the practice images in this case
    
    // selectedImages.forEach(i => draw(i)); //run a trial on each target image in selectedImages array
    // start task after countdown (calls taskFunc)
    countDown(3);

}

/** 
 * buildConArray creates an array object that contains two subarrays, one more proportionally congruent and the other more proportionally incongruent.
 * left button press (Z) is congruent, right button press (M) is incongruent.
 * @param {int} nTrials : how many trials you want the array to be
 * @param {float} conProp: congruency proportion for this array. Must be between 0 and 1.
 * @returns {array} conArray: randomly shuffled array of trials with average proportion congruency equal to conProp
 */
function buildPracticeConArray(){

    if (practiceConProp < 0 || practiceConProp > 1){
        throw 'Please choose a congruency proportion (conProp) between 0 and 1.';
    }
    // left press is congruent and right press is incongruent, make array by adding con trials first, then inc trials.

    let conArray = new Array(Math.floor(nPracticeTrials * practiceConProp)).fill('c'); 
    conArray = conArray.concat(new Array(nPracticeTrials - conArray.length).fill('i'));
    return shuffle(conArray);
}


/** buildPracticeLocArray creates an array of locations for each practice trial
 * this is really redundant right now, but we might want to mess with locations in the future so *shrug* emoji.
 */
function buildPracticeLocArray(){
    let practiceLocArray = new Array(nPracticeTrials).fill('center');
    return practiceLocArray;
}