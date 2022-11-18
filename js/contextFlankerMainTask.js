/** contextFlankerPracticeTask runs the practice blocks
 * 
 */
function contextFlankerMainTask(){
    // set taskName for data logging
    taskName = "contextFlankerMainTask";

    // prepare for task
    hideInstructions();
    showCanvas();
    hideCursor();
    changeScreenBackgroundTo("white");

    // global variables for functions
    taskFunc = contextFlankerMainTrial;
    transitionFunc = itiScreen;
    imageSet = selectedTestImages; //attempt to be more modular, but honestly don't need this variable, can just set it in stimScreen.
    stimFunc = draw; //this is the actual trial function that gets run by stimScreen. For this experiment, don't really need this variable since it will always be draw().

    //draw the trial input, which is one of the practice images in this case
    //create task arrays
    conArray = buildMainConArray();
    locArray = buildMainLocArray();
    repeatArray = buildRepeatArray();
    console.log(repeatArray[0]);
    
    logExpArrays(); //store the experiment arrays. Hopefully this only runs once. Test it.

    console.log('conArray:' + conArray);
    console.log('repeatTheseTrials: ' + repeatArray[0]);
    // start task after countdown (calls taskFunc)
    countDown(3);
}

// don't forget to do locations and reinstatements for test block!

/** 
 * buildConArray creates an array object that contains two subarrays, one more proportionally congruent and the other more proportionally incongruent.
 * left button press (Z) is congruent, right button press (M) is incongruent.
 * @param {float} conProp: congruency proportion for this array. Must be between 0 and 1.
 * @returns {array} conArray: a concatenated array of randomly shuffled blocks of trials in the order specified by blockOrder
 */
function buildMainConArray(){

    let conArray = [];

    // untested
    blockOrder.forEach(blockLetter => {
        blockArr = buildBlockArr(blockLetter);
        conArray = conArray.concat(blockArr);
    });

    return conArray;
}

//put the learn and test location arrays in one main array
function buildMainLocArray(){
    
    let locArray = [];

    blockOrder.forEach(blockLetter => {
        // add the location of each block, trialsPerBlock times, to the locArray. Kind of redundant, but we might mess with this in the future.
        let blockLocArray = new Array(trialsPerBlock).fill(getBlockCongruencies(blockLetter).loc);
        locArray = locArray.concat(blockLocArray);
    });

    return locArray;
}

/** buildRepeatArray creates an array of trials to be repeated from the learn blocks, and an array of which trials they should be repeated on in the test block.
 * @returns {array} repeatArray : this is an array of two arrays. The first one is the trials that will be repeated, the second is the trials on which repeats will occur.
 */
function buildRepeatArray(){
    //code from https://stackoverflow.com/questions/5836833/create-an-array-with-random-values
    //code from https://stackoverflow.com/questions/2380019/generate-unique-random-numbers-between-1-and-100
    let repeatTheseTrials = [];
    let repeatOnTheseTrials = [];

    //think I need separate while loops because one might get filled before the other one does if I put them together.
    while(repeatTheseTrials.length < nRepeatTrials){
        let learnTrial = randIntFromInterval(1,nLearnBlocks * trialsPerLearnBlock); //lower trialcount limit is 1, upper is the last learn block trial count. Not sure if this is inclusive though, test it.
        if(repeatTheseTrials.indexOf(learnTrial) === -1) repeatTheseTrials.push(learnTrial);
    }

    while(repeatOnTheseTrials.length < nRepeatTrials){
        let testTrial = randIntFromInterval(nLearnBlocks * trialsPerLearnBlock+2, nLearnBlocks * trialsPerLearnBlock + trialsPerTestBlock) //lower is the second test block trial count, upper is the last. Skip the first test trial cuz don't want to consecutively repeat.
        if (repeatOnTheseTrials.indexOf(testTrial) === -1) repeatOnTheseTrials.push(testTrial);

        //check if there would be consecutive repeated trials if we add this trial, and don't add it if so.
        if (ContainsConsecutiveValue(repeatOnTheseTrials)) {
            repeatOnTheseTrials.pop(); //the array didn't have consecutive values until we added this most recent value, so pop it out.
        }
    }
    // repeatTheseTrials = Array.from({length: nRepeatTrials}, () => Math.floor(Math.random() * (nLearnBlocks * trialsPerLearnBlock)))
    // repeatOnTheseTrials = Array.from({length: nRepeatTrials}, () => Math.floor(Math.random() * (nLearnBlocks * trialsPerLearnBlock)))
    return [repeatTheseTrials, repeatOnTheseTrials];
}


/** buildBlockArr creates an array of congruency values based on block parameters
 * 
 * @param {string} blockLetter : This must be one of the predefined cases in getBlockCongruencies in counterbalancing.js. Sets the location and congruency rate of the block.
 */
function buildBlockArr(blockLetter){
    let blockConProp = getBlockCongruencies(blockLetter).c;
    let blockArray = new Array(Math.floor(trialsPerBlock * blockConProp)).fill('c');
    blockArray = blockArray.concat(new Array(trialsPerBlock - blockArray.length).fill('i'));
    return shuffle(blockArray);
}
  
function contextFlankerMainTrial(){

    // (re)set sectionType
    sectionType = "main1";

    // if task is over, proceed back to next instruction (or end of experiment)
    if (trialCount > nBlocks * trialsPerBlock) {
        navigateInstructionPath();
        return;
    }

    

    // person is still holding down key from previous trial, tell them to let go
    if (keyListener == 3){
        promptLetGo();
        return;
    }

    // if they minimized the screen, tell them its too small.
    if (!screenSizeIsOk()){
        promptScreenSize();
        return;
    }
    // increment block and delay for however many seconds we want
    if ((trialCount - 1) % trialsPerBlock == 0 && (trialCount - 1) != 0) {
        console.log('last trial before countdown: ' + trialCount);
        countDownEndOfBlock(10);
        block++;

    }

    else {
    // none of the above happened, proceed to trial
    fixationScreen();
    }
}