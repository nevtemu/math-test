//Topic selection
const TOPICS = {'5A':{
                        Y5A01:{description:`Exponent (square, cube)`},
                        Y5A02:{description:`Rounding to 10, 100, 1000`},
                        Y5A03:{description:`Compare numbers to 1m`},

                        roman:{description:`Roman numbers`},
                        area:{description:`Area, perimeter`},
                        negative:{description:`Negative numbers`},
                        prime:{description:`Prime`},
                        multi10multiples:{description:`Multiply by multiples of 10 `},
                        multi10:{description:`Multiply by 10, 100 ...`},
                    },
                '5B':{
                        Y5B01:{description:`Convert fraction`},
                        Y5B02:{description:`Add and subtract fractions`},
                        Y5B03:{description:`Compare simple fractions`},
                        Y5B04:{description:`Multiply fraction by whole number`},
                        Y5B05:{description:`Rounding decimals`},
                        Y5B06:{description:`Compare decimals`},
                    },
                '6A':{
                        Y6A01:{description:`Compare fractions, improper fractions, mixed numbers`},
                        Y6A02:{description:`Simplify fraction`},
                        Y6A03:{description:`Add and subtract fractions`},
                        Y6A04:{description:`Multiply fractions`},
                        Y6A05:{description:`Divide fraction by whole number`},
                        Y6A06:{description:`Exponent (square, cube)`},
                        Y6A07:{description:`Compare numbers to 10m`},
                        Y6A08:{description:`Rounding numbers, decimals`},
                    },
                }

const PASSWORD = "math1";
const NUMBER_OF_QUESTIONS = 10;

const topicField = document.querySelector("#topicField");
const headerField = document.querySelector("#headerField");
const resultsCheckForm = document.querySelector("#resultsCheckForm");
const unlockForm = document.querySelector("#unlockForm");
const passwordField = document.querySelector("#passwordField");
const unlockField = document.querySelector("#unlockField");
const returnButton = document.querySelector("#returnButton");
const testField = document.querySelector("#testField");
const repeatButton = document.querySelector("#repeatButton");
const cheatCover = document.querySelector("#cheatCover");

let correctAnswers = [];
let userAnswers = [];
let testType, testYear;
let isAnticheatOn = false;

//Topic render
let topicOutput = '';
const animationDelay = 0.1;
let animationCounter = 0;
for (let year in TOPICS){
    topicOutput += `<div class="year" id="${year}"><div class="topic-label">${year}</div><div class="topic-container">`
    for (let topic in TOPICS[year]){
        topicOutput += `<div class="topic" id="${topic}" onClick="generateTest(event)" style="animation-delay:${animationCounter*animationDelay}s">${TOPICS[year][topic].description}</div>`;
        animationCounter++};
    topicOutput += `</div></div>`
}
topicField.innerHTML=topicOutput;


function generateTest (event){
    let source = event.srcElement.id;
    if (source !== 'repeatButton'){
        testType = event.srcElement.id;
        testYear = event.srcElement.parentElement.parentElement.id;
        console.log(event)
    }
    renderer([returnButton, testField, resultsCheckForm], [topicField, repeatButton], TOPICS[testYear][testType].description);
    resetVariables();
    let output = generateTestType(testType);
    testField.innerHTML = output;
    repeatButton.addEventListener('click', generateTest); 
    // isAnticheatOn = true;
}

//Checking results
resultsCheckForm.addEventListener('submit', checkResults);
function checkResults (event) {
    event.preventDefault();
    let userInput = event.srcElement[0].value;
    if (!userInput) return;
    passwordField.value='';
    PASSWORD === userInput ? showAnswers() : passwordIncorrect();
}
function showAnswers(){
    getUserAnswers();
    correctAnswers.forEach((correctAnswer, index) => {
        let isCorrect = Array.isArray(correctAnswer) ? correctAnswer.equals(userAnswers[index]) : correctAnswer === userAnswers[index];
        if(isCorrect) results++;
        const questionField = document.querySelector(`#question${index}`);
        const answerField = document.querySelector(`#correctAnswer${index}`);
        answerField.classList.toggle(isCorrect ? "answer-right" : "answer-wrong");
        questionField.classList.toggle(isCorrect ? "question-right" : "question-wrong")
    })
    const showAnswerFields = document.querySelectorAll('.correctAnswer');
    renderer(Array.from(showAnswerFields).concat([repeatButton]), [resultsCheckForm], false)
}
function getUserAnswers (){
    for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
        let userAnswer = document.querySelectorAll(`#userAnswer${i} [name="userSubAnswer"]`)
        let currentAnswer = [];
        userAnswer.forEach(answer => currentAnswer.push(answer.value))
        userAnswers.push(currentAnswer.every(item => item === "") ? ["No answer"] : currentAnswer) // Check for cases when correct answer is 0
    }
    console.log(userAnswers)
}
function passwordIncorrect(){
    passwordField.classList.toggle("wrong") // todo
}

//Return to topics
returnButton.addEventListener('click', returnToTopics);
function returnToTopics () {
    renderer([topicField],[repeatButton, returnButton, testField, resultsCheckForm]);
    // isAnticheatOn = false;
}

function renderer (visibleElements, invisibleElements, header = "Choose your topic:"){ //header=false to keep same value
    if (Array.isArray(visibleElements) && Array.isArray(invisibleElements)){
        visibleElements.forEach(element => element.classList.remove("invisible", "hidden"));
        invisibleElements.forEach(element => element.classList.add("invisible"));
        if (header !== false) headerField.innerHTML = header;
    }
    else {
        console.alert("renderer function error")
    }
}

function resetVariables (){
    correctAnswers = [];
    userAnswers = [];
    results = 0;
}

function generateTestType (topic){
    let output = '';
    switch(topic){

        /*
        ! I M P O R T A N T !
        Each test must add correct answers -- correctAnswers.push()
        Question structure is required to pull user answers correctly
                        <div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                ...
                                        <mstyle id="userAnswer${i}">
                                            <input name="userSubAnswer"/>
                        <div id="correctAnswer${i}" class="correctAnswer hidden"">
        */
        
        case "Y5A01": case "Y6A06":
            let numbers = shuffleArray([...Array(NUMBER_OF_QUESTIONS).keys()])  //Make numbers unique (not repeated if possible)
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let exponent = numbers[i] > 3 ? generateRandomNumber(1,3) : generateRandomNumber(2,5);
                let correctAnswer = numbers[i] ** exponent;
                correctAnswers.push([correctAnswer]);


                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <math class="questionText">
                                    <msup>
                                        <mn>${numbers[i]}</mn>
                                        <mn>${exponent}</mn>
                                    </msup> 
                                    <mo>=</mo>
                                    <mn id="userAnswer${i}">
                                        <input name="userSubAnswer" type="text" maxlength="4" size="4">
                                    </mn>
                                </math>
                                <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div>
                            </div>`;
            }
        break;

        case "Y5A02": case "Y5B05": case "Y6A08": // Rounding numbers whole/decimals/mixed
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let isDecimal = topic === "Y5A02" ? false : topic === "Y5B05" ? true : Math.random() < 0.5;
                let digits = 7;
                let number = generateRandomNumber(10 ** (digits-1),10 ** digits - 1);

                let division, questionText;
                if (isDecimal){
                    const maxDecimals = 4;
                    let decimalPoint = generateRandomNumber(maxDecimals,digits-1)
                    number = number / (10 ** decimalPoint);
                    division = i%maxDecimals;
                    questionText = division > 0 ? `to ${division} decimal point` : `to whole number`
                } else {
                    division = 10 ** (i%3+1);
                    questionText = `to closest ${division}`
                }
                console.log(`i ${10 ** (i%3+1)} division ${division} number ${number} isDecimal ${isDecimal}`)
                let correctAnswer = isDecimal ? Math.round(number*(10**division))/(10**division) : Math.round(number/division)*division;
                correctAnswers.push([correctAnswer]);

                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <math class="questionText">
                                    <span>Round ${number}  ${questionText}</span>
                                    <mn id="userAnswer${i}">
                                        <input name="userSubAnswer" type="text" maxlength="${digits}" size="${digits}">
                                    </mn>
                                </math>
                                <div id="correctAnswer${i}" class="correctAnswer hidden"">${correctAnswer}</div>
                            </div>`;
            }
        break;

        case "Y5A03": case "Y6A07": case "Y5B06": // Compare to 1m/10m/decimals
        for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
            let digits = topic === "Y6A07" ? 7 : 6;
            let number1 = generateRandomNumber(10 ** (digits-1),10 ** digits);
            let number2 = number1;
            number1 = number1.toString().split('');
            number2 = number2.toString().split('');

            let difference = generateRandomNumber(0,topic === "Y6A07" ? 4 : 3)
            let indexes = shuffleArray([...Array(digits).keys()])
            while(difference > 0){
                let n = indexes[difference];
                do{
                    number2[n]= generateRandomNumber(0,9);
                } while (number1[n] == number2[n])
                difference--
            }

            number1 = parseInt(number1.join(''))
            number2 = parseInt(number2.join(''))

            if(topic === "Y5B06"){
                let samePoint = Math.random() < 0.6; //60% same decimal point
                let decimalPoint1 = generateRandomNumber(1,digits-1)
                number1 = number1 / (10 ** decimalPoint1);
                number2 = samePoint ? number2 / (10 ** decimalPoint1) : number2 / (10 ** generateRandomNumber(1,digits-1));
            }
            let correctAnswer = compareNumbers(number1, number2);
            correctAnswers.push([correctAnswer]);


            output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <math class="questionText">
                                <mn>${number1}</mn>
                                <mo id="userAnswer${i}">
                                    <input name="userSubAnswer" type="text" maxlength="1" size="1">
                                </mo>
                                <mn>${number2}</mn>
                            </math>
                            <div id="correctAnswer${i}" class="correctAnswer hidden"">${correctAnswer}</div>
                        </div>`;
        }
    break;

        case "Y5B01": // Convert mixed numbers and improper fractions
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let toImproper = Math.random() < 0.5;
                let denominator = generateRandomNumber(2,12);
                let numerator = toImproper ? generateRandomNumber(1, denominator-1) : generateRandomNumber(denominator+1, denominator*9-1);
                let whole = toImproper ? generateRandomNumber(1,9) : 0;
                correctAnswers.push(convertFraction([whole,numerator,denominator], toImproper));
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <math>
                                    <mpadded lspace="0.5em">
                                        ${drawFraction([whole,numerator,denominator])}
                                        <mo>=</mo>
                                        <mstyle id="userAnswer${i}">
                                            <mn><input name="userSubAnswer" type="text" maxlength="2" size="2" class=${toImproper ? "invisible" : "visible" } /></mn>
                                            <mfrac>
                                                <mi><input name="userSubAnswer" type="text" maxlength="2" size="2"/></mi>
                                                <mi><input name="userSubAnswer" type="text" maxlength="2" size="2"/></mi>
                                            </mfrac>
                                        </mstyle>
                                    </mpadded>
                                </math>
                                <div id="correctAnswer${i}" class="correctAnswer hidden"">
                                    <math>
                                        <mpadded lspace="0.5em">
                                            ${drawFraction(convertFraction([whole,numerator,denominator], toImproper))}
                                    </math>
                                </div>
                            </div>`;
            }
        break;

        case "Y5B03": // Compare simple fractions
        for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
            let fraction1 = generateRandomFraction(0,0);
            let fraction2 = generateRandomFraction(0,0);

            // if(Math.random() < 0.7) { 
            //     let n = generateRandomNumber(1,2);
            //     fraction2[n] = fraction1[n]
            // }

            let correctAnswer = compareFractions(fraction1, fraction2);
            correctAnswers.push([correctAnswer]);

            if(correctAnswer === "=" && fraction1.equals(fraction2)){ // Rare case for completely identical fractions
                let multiplicator = generateRandomNumber(2,5);
                fraction2[2]*=multiplicator;
                fraction2[1]*=multiplicator;
            }

            if(Math.random() < 0.5)[fraction1, fraction2] = [fraction2, fraction1] //50% to swap places

            output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <math>
                                <mpadded lspace="0.5em">
                                    ${drawFraction(fraction1)}
                                    <mstyle id="userAnswer${i}">
                                        <mo><input name="userSubAnswer" type="text" maxlength="1" size="1"/></mo>
                                    </mstyle>
                                    ${drawFraction(fraction2)}
                                </mpadded>
                            </math>
                            <div id="correctAnswer${i}" class="correctAnswer hidden"">
                                <math>
                                    <mpadded lspace="0.5em">
                                        ${drawFraction(correctAnswer)}
                                </math>
                            </div>
                        </div>`;
        }
        break;

        case "Y6A01": // Compare fractions
        for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
            let fraction1 = generateRandomFraction(0,5);
            let fraction2 = generateRandomFraction(0,5);

            // let similarity = generateRandomNumber(1,3)
            // let indexes = shuffleArray([0,1,2])
            // while(similarity > 0){
            //     let n = indexes[similarity];
            //     fraction2[n]=fraction1[n]
            //     similarity--
            // }

            let correctAnswer = compareFractions(fraction1, fraction2);
            correctAnswers.push([correctAnswer]);

            if(Math.random() < 0.5) fraction1 = convertFraction(fraction1, true) //50% convert to improper
            if(Math.random() < 0.5) fraction2 = convertFraction(fraction2, true)

            if(correctAnswer === "=" && fraction1.equals(fraction2)){ // Rare case for completely identical fractions
                let multiplicator = generateRandomNumber(2,5);
                fraction2[2]*=multiplicator;
                fraction2[1]*=multiplicator;
            }

            output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <math>
                                <mpadded lspace="0.5em">
                                    ${drawFraction(fraction1)}
                                    <mstyle id="userAnswer${i}">
                                        <mo><input name="userSubAnswer" type="text" maxlength="1" size="1"/></mo>
                                    </mstyle>
                                    ${drawFraction(fraction2)}
                                </mpadded>
                            </math>
                            <div id="correctAnswer${i}" class="correctAnswer hidden"">
                                <math>
                                    <mpadded lspace="0.5em">
                                        ${drawFraction(correctAnswer)}
                                </math>
                            </div>
                        </div>`;
        }
        break;

        case "Y6A02": // Simplify fraction
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let fraction = generateRandomFraction(0,0);
                let multiplicator = generateRandomNumber(2,5);
                fraction[1]*=multiplicator;
                fraction[2]*=multiplicator;
                let correctAnswer = simplifyFraction(fraction)
                correctAnswers.push(correctAnswer);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <math>
                                    <mpadded lspace="0.5em">
                                        ${drawFraction(fraction)}
                                        <mo>=</mo>
                                        <mstyle id="userAnswer${i}">
                                            <mn><input name="userSubAnswer" type="text" maxlength="2" size="2" class="invisible"/></mn>
                                            <mfrac>
                                                <mi><input name="userSubAnswer" type="text" maxlength="2" size="2"/></mi>
                                                <mi><input name="userSubAnswer" type="text" maxlength="2" size="2"/></mi>
                                            </mfrac>
                                        </mstyle>
                                    </mpadded>
                                </math>
                                <div id="correctAnswer${i}" class="correctAnswer hidden"">
                                    <math>
                                        <mpadded lspace="0.5em">
                                            ${drawFraction(correctAnswer)}
                                    </math>
                                </div>
                            </div>`;
            }
        break;

        case "Y6A03": case "Y5B02":// Add/subtract fractions
        /* 
        1) Common denominator
        2) Rename
        3) Add
        4) Simplify
        */
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let isSubtraction = Math.random() < 0.5; // 50% subtraction
                let isOnlyFractions = Math.random() < 0.3; // 30% without whole number

                let fraction1 = isOnlyFractions ? generateRandomFraction(0,0) :  generateRandomFraction(0,5)
                let fraction2 = isOnlyFractions ? generateRandomFraction(0,0) :  generateRandomFraction(0,5)

                let compare = compareFractions(fraction1, fraction2);
                if (compare != ">") [fraction1, fraction2] = [fraction2, fraction1]

                if(Math.random() < 0.5) fraction1 = convertFraction(fraction1, true) //50% convert to improper
                if(Math.random() < 0.5) fraction2 = convertFraction(fraction2, true)

                let correctAnswer = addingAndSubtractingFractions(fraction1, fraction2, isSubtraction)
                correctAnswers.push(correctAnswer);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <math>
                                    <mpadded lspace="0.5em">
                                        ${drawFraction(fraction1)}
                                        <mo>${isSubtraction ? "-" : "+"}</mo>
                                        ${drawFraction(fraction2)}
                                        <mo>=</mo>
                                        <mstyle id="userAnswer${i}">
                                            <mn><input name="userSubAnswer" type="text" maxlength="2" size="2"/></mn>
                                            <mfrac>
                                                <mi><input name="userSubAnswer" type="text" maxlength="2" size="2"/></mi>
                                                <mi><input name="userSubAnswer" type="text" maxlength="2" size="2"/></mi>
                                            </mfrac>
                                        </mstyle>
                                    </mpadded>
                                </math>
                                <div id="correctAnswer${i}" class="correctAnswer hidden"">
                                    <math>
                                        <mpadded lspace="0.5em">
                                            ${drawFraction(correctAnswer)}
                                    </math>
                                </div>
                            </div>`;
            }
        break;

        case "Y6A04": case "Y5B04": // Multiply fraction by whole number or another fraction
            let min = 0;
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let byWhole = false;
                if (topic === "Y5B04") {byWhole = true;}
                else {byWhole = Math.random() < 0.3;} // 30% by whole number

                let fraction1 = generateRandomFraction(0,0);
                let fraction2;
                if(byWhole){
                    let number = generateRandomNumber(min,7);
                    if (number < 1) min = 1;
                    fraction2 = [number, 0, 1]
                } else {
                    fraction2 = generateRandomFraction(0,0);
                }

                if(Math.random() < 0.5)[fraction1, fraction2] = [fraction2, fraction1] //50% to swap places

                let correctAnswer = multiplyingAndDividingFractions(fraction1, fraction2)
                correctAnswers.push(correctAnswer);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <math>
                                    <mpadded lspace="0.5em">
                                        ${drawFraction(fraction1)}
                                        <mo>*</mo>
                                        ${drawFraction(fraction2)}
                                        <mo>=</mo>
                                        <mstyle id="userAnswer${i}">
                                            <mn><input name="userSubAnswer" type="text" maxlength="2" size="2"/></mn>
                                            <mfrac>
                                                <mi><input name="userSubAnswer" type="text" maxlength="2" size="2"/></mi>
                                                <mi><input name="userSubAnswer" type="text" maxlength="2" size="2"/></mi>
                                            </mfrac>
                                        </mstyle>
                                    </mpadded>
                                </math>
                                <div id="correctAnswer${i}" class="correctAnswer hidden"">
                                    <math>
                                        <mpadded lspace="0.5em">
                                            ${drawFraction(correctAnswer)}
                                    </math>
                                </div>
                            </div>`;
            }
        break;
        
        case "Y6A05": // Divide fraction by whole number
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){

                let fraction1 = generateRandomFraction(0,0);
                let number = generateRandomNumber(0,9);
                let fraction2 = [number, 0, 1]

                let correctAnswer = multiplyingAndDividingFractions(fraction1, fraction2, true)
                correctAnswers.push(correctAnswer);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <math>
                                    <mpadded lspace="0.5em">
                                        ${drawFraction(fraction1)}
                                        <mo>&divide</mo>
                                        ${drawFraction(fraction2)}
                                        <mo>=</mo>
                                        <mstyle id="userAnswer${i}">
                                            <mn><input name="userSubAnswer" type="text" maxlength="2" size="2"/></mn>
                                            <mfrac>
                                                <mi><input name="userSubAnswer" type="text" maxlength="2" size="2"/></mi>
                                                <mi><input name="userSubAnswer" type="text" maxlength="2" size="2"/></mi>
                                            </mfrac>
                                        </mstyle>
                                    </mpadded>
                                </math>
                                <div id="correctAnswer${i}" class="correctAnswer hidden"">
                                    <math>
                                        <mpadded lspace="0.5em">
                                            ${drawFraction(correctAnswer)}
                                    </math>
                                </div>
                            </div>`;
            }
        break;










































        case "prime":
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let number;
                //Make numbers unique (not repeated if possible)
                let usedNumbers = [];
                if (NUMBER_OF_QUESTIONS < 99){
                    usedNumbers = [];
                    do {number = generateRandomNumber(2,100);}
                    while (usedNumbers.includes(number))
                    usedNumbers.push(number)
                }
                else {
                    number = generateRandomNumber(2,100);
                }
                correctAnswers.push([isPrime(number).toString()]);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <span class="questionText">${number}</span>
                            <div id="userAnswer${i}" class="">
                                <input type="radio" name="userSubAnswer" id="a${i}" value="true" class="invisible radio-colors"/>
                                <label for="a${i}" onClick="sub(event)">Prime</label>
                                <input type="radio" name="userSubAnswer" id="b${i}" value="false" class="invisible radio-colors"/>
                                <label for="b${i}" onClick="sub(event)">Composite</label>
                            </div>
                            <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">${isPrime(number) ? "Prime" : "Composite"}</div></div>`;
            }
        break;


        case "roman":
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let number = generateRandomNumber(1,3999);
                let romanNumber = convertToRoman(number);
                let isRoman = Math.random() < 0.5;
                let correctAnswer = isRoman ? number : romanNumber;
                correctAnswers.push([correctAnswer]);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <span class="questionText">${isRoman ? romanNumber : number}</span>
                                <div id="userAnswer${i}" class="">
                                    <input type="text" name="userSubAnswer" class="answer" maxlength="12" size="12">
                                </div>
                                <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">${correctAnswer}</div>
                            </div>`;
            }
        break;
        case "factors":
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let number;
                do {number = generateRandomNumber(9,100)}
                while(isPrime(number))
                let correctAnswer = getPrimeFactorsOfNumber(number).sort();
                correctAnswers.push(correctAnswer);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <span class="questionText">${number}</span>
                                <input type="text" id="userAnswer${i}" class="answer" maxlength="12" size="12">
                                <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">${correctAnswer}</div>
                            </div>`;
            }
        break;

        case "multi":
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                if(Math.random()<0.9){
                    let number1 = generateRandomNumber(0,12);
                    let number2 = generateRandomNumber(1,12);
                    let result = number1*number2;
                    let isMultiplication = Math.random() < 0.5;
                    let correctAnswer = isMultiplication ? result : number1;
                    correctAnswers.push(correctAnswer);
                    output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                    <span class="questionText">${isMultiplication ? number1 : result}${isMultiplication ? "&times;" : "&div;"}${number2}</span>
                                    <input type="text" id="userAnswer${i}" class="answer" maxlength="4" size="4">
                                    <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">${correctAnswer}</div>
                                </div>`;
                }
                else {
                    let number1 = generateRandomNumber(2,5);
                    let number2 = generateRandomNumber(2,12 - number1);
                    let number3 = generateRandomNumber(1,12 - number1 - number2);
                    let correctAnswer = number1*number2*number3;
                    correctAnswers.push(correctAnswer);
                    output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                    <span class="questionText">${number1}&times;${number2}&times;${number3}</span>
                                    <input type="text" id="userAnswer${i}" class="answer" maxlength="4" size="4">
                                    <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">${correctAnswer}</div>
                                </div>`;
                }
            }
        break;
        case "multi10":
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let numberLength = generateRandomNumber(0,3);
                let number1 = generateRandomNumber(Math.pow(10,numberLength),Math.pow(10, numberLength+1));
                let number2 = Math.pow(10, 4 - numberLength);
                let result = number1*number2;
                let isMultiplication = Math.random() < 0.5;
                let correctAnswer = isMultiplication ? result : number1;
                correctAnswers.push([correctAnswer]);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <div>
                                    <span class="questionText">${isMultiplication ? number1 : result}</span>
                                    <span class="questionText">${isMultiplication ? "&times;" : "&div;"}${number2}</span>
                                </div>
                                <div id="userAnswer${i}" class="">
                                <input type="text" name="userSubAnswer" class="answer" maxlength="6" size="6">
                                </div>
                                <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">${correctAnswer}</div>
                            </div>`;
            }
        break;
        case "multi10multiples":
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let number1 = generateRandomNumber(1,11);
                let number2 = generateRandomNumber(1,12) * Math.pow(10, generateRandomNumber(2,4));
                let isMultiplication = Math.random() < 0.5;
                let result = number1*number2;
                let correctAnswer = isMultiplication ? result : number1;
                correctAnswers.push([correctAnswer]);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <div>
                                    <span class="questionText">${isMultiplication ? number1 : result}</span>
                                    <span class="questionText">${isMultiplication ? "&times;" : "&div;"}${number2}</span>
                                </div>
                                <div id="userAnswer${i}" class="">
                                <input type="text" name="userSubAnswer" class="answer" maxlength="6" size="6">
                                </div>
                                <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">${correctAnswer}</div>
                            </div>`;
            }
        break;
        case "efficient99":
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let number1 = generateRandomNumber(1111,9999);
                let number2 = Math.pow(10, generateRandomNumber(2,3)) - 1;
                let isAddition = Math.random() < 0.5;
                let correctAnswer = isAddition ? number1 + number2 : number1 - number2;
                correctAnswers.push(correctAnswer);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <span class="questionText">${number1} ${isAddition ? "+" : "&#8210;"}${number2}</span>
                            <input type="text" id="userAnswer${i}" class="answer" maxlength="5" size="5">
                            <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">${correctAnswer}</div></div>`;
            }
        break;
        case "missing":
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let number1 = generateRandomNumber(11,88);
                let number2 = generateRandomNumber(11,number1);
                let isAddition = Math.random() < 0.5;
                let result = isAddition ? number1 + number2 : number1 - number2;
                let isFirstNumberMissing = Math.random() < 0.5;
                let correctAnswer = isFirstNumberMissing ? number1 : number2;
                correctAnswers.push(correctAnswer);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <div>
                                    ${isFirstNumberMissing ? `<input type="text" id="userAnswer${i}" class="answer" maxlength="2" size="2"></input>` : `<span class="questionText">${number1}</span>`}
                                    ${isAddition ? "+" : "&#8210;"}
                                    ${isFirstNumberMissing ? `<span class="questionText">${number2}</span>` : `<input type="text" id="userAnswer${i}" class="answer" maxlength="2" size="2"></input>`}
                                    <span class="questionText">=${result}</span>
                                </div>
                            <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">${correctAnswer}</div></div>`;
            }
        break;
        case "negative":
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let number1 = generateRandomNumber(-50,-5);
                let number2 = generateRandomNumber(5,100);
                let correctAnswer = number2 - number1;
                correctAnswers.push([correctAnswer]);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <span class="questionText"> What is the difference between ${number1} and ${number2}</span>
                            <div id="userAnswer${i}" class="">
                                    <input type="text" name="userSubAnswer" class="answer" maxlength="3" size="3">
                                </div>
                            <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">${correctAnswer}</div></div>`;
            }
        break;
        case "more":
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let number1 = generateRandomNumber(1111,9999);
                let number2 =  Math.pow(10, generateRandomNumber(0,3));
                let isAddition = Math.random() < 0.5;
                let correctAnswer = isAddition ? number1 + number2 : number1 - number2;
                correctAnswers.push(correctAnswer);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <span class="questionText">${number2} ${isAddition ? "more than" : "less than"} ${number1}</span>
                            <input type="text" id="userAnswer${i}" class="answer" maxlength="5" size="5">
                            <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">${correctAnswer}</div></div>`;
            }
        break;
        case "sum":
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let number1Digits = [], number2Digits = [], number1, number2;
                let isAddition = Math.random() < 0.5;

                if (isAddition){ //Addition
                    for (let j = 0; j < 5; j++){
                        let digit = j == 0 ? generateRandomNumber(1, 4) : generateRandomNumber(0, 9);
                        number1Digits.push(digit);
                    }
                    number1 = joinDigits(number1Digits);
                    for (let j = 0; j < 5; j++){
                        let digit = j <= 1 ? generateRandomNumber(1, 4) : generateRandomNumber(9 - number1Digits[j], 9);
                        number2Digits.push(digit);
                    }
                    number2 = joinDigits(number2Digits);

                } else { //Subtraction
                    for (let j = 0; j < 5; j++){
                        let digit = j == 0 ? generateRandomNumber(6, 9) : generateRandomNumber(0, 8);
                        number1Digits.push(digit);
                    }
                    number1 = joinDigits(number1Digits);
                    for (let j = 0; j < 5; j++){
                        let digit = j <= 1 ? generateRandomNumber(1, 5) : generateRandomNumber(number1Digits[j] + 1, 9);
                        number2Digits.push(digit);
                    }
                    number2 = joinDigits(number2Digits);
                }
                let correctAnswer = isAddition ? number1 + number2 : number1 - number2;
                correctAnswers.push(correctAnswer);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <span class="questionText rightAlign">${number1}</span>
                            <span class="questionText rightAlign">${isAddition ? "+" : "&#8210;"}${number2}</span>
                            <input type="text" id="userAnswer${i}" class="answer rightAlign" maxlength="5" size="5">
                            <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">${correctAnswer}</div></div>`;
            }
        break;
        case "sum100":
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                if(Math.random()<0.5){
                    console.log("+")
                    let isAddition = Math.random() < 0.5;
                    let multiplier = Math.pow(10, generateRandomNumber(1,3))
                    let number1, number2, correctAnswer;
                    if (isAddition){ //Addition
                        number1 = generateRandomNumber(2,95);
                        number2 = generateRandomNumber(2,99-number1);
                        correctAnswer = (number1 + number2)*multiplier;
                    } else { //Subtraction
                        number1 = generateRandomNumber(9,99);
                        number2 = generateRandomNumber(2,number1-2);
                        correctAnswer = (number1 - number2)*multiplier;
                    }
                    correctAnswers.push(correctAnswer);
                    output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <span class="questionText">${number1*multiplier}${isAddition ? "+" : "&#8210;"}${number2*multiplier}</span>
                                <input type="text" id="userAnswer${i}" class="answer" maxlength="5" size="5">
                                <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">${correctAnswer}</div></div>`;
                }else{
                    let numberDigits = [];
                    for (let j = 0; j < 4; j++){
                        let digit = generateRandomNumber(j == 0 ? 1 : 0, 9);
                        numberDigits.push(digit);
                    }
                    let index = generateRandomNumber(0,numberDigits.length - 2);
                    let digit1 = generateRandomNumber(5,9);
                    let digit2 = generateRandomNumber(0,digit1-1);
                    numberDigits[index] = digit1;
                    let number1 = joinDigits(numberDigits);
                    numberDigits[index] = digit2;
                    let number2 = joinDigits(numberDigits);
                    correctAnswer = number1 - number2;
                    correctAnswers.push(correctAnswer);
                    output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <span class="questionText">${number1}&#8210;${number2}</span>
                                <input type="text" id="userAnswer${i}" class="answer" maxlength="5" size="5">
                                <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">${correctAnswer}</div></div>`;
                }
            }
        break;
        case "factFamily":
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let type = generateRandomNumber(1,4);
                let number1, number2, result, correctAnswer, question, modifier;
                switch(type){
                    case 1://Addition
                        number1 = generateRandomNumber(999,9950);
                        number2 = generateRandomNumber(999,9999-number1);
                        result = number1 + number2;
                        question = `<span class="questionText">${number1}+${number2}=${result}</span>
                                    <div>
                                        <span class="questionText">${result}&#8210;${number2}=</span>
                                        <input type="text" id="userAnswer${i}" class="answer" maxlength="5" size="5">
                                    </div>`
                        correctAnswer = result - number2;
                    break;
                    case 2://Subtraction
                        number1 = generateRandomNumber(5000,9950);
                        number2 = generateRandomNumber(999,number1 - 999);
                        result = number1 - number2;
                        question = `<span class="questionText">${number1}&#8210;${number2}=${result}</span>
                                    <div>
                                        <span class="questionText">${result}+${number2}=</span>
                                        <input type="text" id="userAnswer${i}" class="answer" maxlength="5" size="5">
                                    </div>`
                        correctAnswer = result + number2;
                    break;
                    case 3://Modified addition
                        if(Math.random() < 0.5){
                            number1 = generateRandomNumber(12,89);
                            number2 = generateRandomNumber(10,99 - number1);
                            modifier = generateRandomNumber(1,9)*Math.pow(10,generateRandomNumber(2,3))
                        }
                        else{
                            number1 = generateRandomNumber(2,8)*100;
                            number2 = generateRandomNumber(1,number1/100 - 1)*100;
                            modifier = generateRandomNumber(1,99);
                        }
                        result = number1 + number2;
                        question = `<span class="questionText">${number1}+${number2}=${result}</span>
                                    <div>
                                        <span class="questionText">${number1+modifier}+${number2}=</span>
                                        <input type="text" id="userAnswer${i}" class="answer" maxlength="5" size="5">
                                    </div>`
                        correctAnswer = result + modifier;
                    break;
                    case 4://Modified subtraction
                        if(Math.random() < 0.5){
                            number1 = generateRandomNumber(10,95);
                            number2 = generateRandomNumber(4,number1 - 3);
                            modifier = generateRandomNumber(1,9)*Math.pow(10,generateRandomNumber(2,3))
                        }
                        else{
                            number1 = generateRandomNumber(4,9)*100;
                            number2 = generateRandomNumber(1,number1/100 - 1)*100;
                            modifier = generateRandomNumber(1,99);
                        }
                        result = number1 - number2;
                        console.table(number1,number2,result)
                        question = `<span class="questionText">${number1}&#8210;${number2}=${result}</span>
                                    <div>
                                        <span class="questionText">${number1+modifier}&#8210;${number2+modifier}=</span>
                                        <input type="text" id="userAnswer${i}" class="answer" maxlength="5" size="5">
                                    </div>`
                        correctAnswer = result;
                    break;
                    default:
                        console.error("Error in test type function")
                }
                correctAnswers.push(correctAnswer);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            ${question}
                            <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">${correctAnswer}</div></div>`;
            }
        break;
        case "area":
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let side1 = generateRandomNumber(1,5);
                let side2 = generateRandomNumber(1,5);
                let correctAnswer = [2*side1 + 2*side2, side1 * side2]
                correctAnswers.push(correctAnswer);
                let rectWidth = side1*30;
                let rectHeight = side2*30;
                let rectX = 40+(150-side1*30)/2;
                let rectY = 40+(150-side2*30)/2;
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                <rect x="${rectX}" y="${rectY}" width="${rectWidth}" height="${rectHeight}" fill="lightgrey"/>
                                <text x="110" y="${rectY-15}" class="small">${side1}</text>
                                <text x="${rectX-30}" y="120" class="heavy">${side2}</text>
                            </svg>
                            <div id="userAnswer${i}">
                                <div class="rightAlign"><label for="perimeter${i}" >Perimeter:</label>
                                <input type="text" name="userSubAnswer"  class="answer " maxlength="2" size="2" style="float:right"></div>
                                <div class="rightAlign"><label for="area${i}" >Area:</label>
                                <input type="text" name="userSubAnswer"  class="answer " maxlength="2" size="2" style="float:right"></div>
                            </div>
                            <div id="correctAnswer${i}" class="correctAnswer hidden" hidden">P: ${correctAnswer[0]} A: ${correctAnswer[1]}</div>
                            </div>`;
            }
        break;
        default:
            console.error("Error in test type function")
    }
    console.log(correctAnswers)
    return output;
}
function joinDigits (numberDigits){ //converts array of digits [1,2,3,4] into integer 1234
    return [...numberDigits].reverse().reduce((p, c, i) => {return p + c*(10**i)},  0);
}

//Cheat check
window.addEventListener('focus', cheatCatch);
function cheatCatch (){
    if (isAnticheatOn){renderer([cheatCover],[],false)}
}
unlockForm.addEventListener('submit', unlock);
function unlock (event){
    event.preventDefault();
    let userInput = event.srcElement[0].value;
    if (!userInput) return;
    unlockField.value='';
    if(PASSWORD === userInput) renderer([],[cheatCover],false)
}

Array.prototype.equals = function (array) {
    if (!array)
        return false;
    if(array === this)
        return true;
    if (this.length != array.length)
        return false;
    for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            return false;   
        }           
    }       
    return true;
}

function convertToRoman (number) {
    let values = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1}
    let roman = '';
    for (let i in values) {
        while (number >= values[i]) {
            roman += i;
            number -= values[i];
        }
    }
    return roman;
}

function getPrimeFactorsOfNumber (number) {
    let factors = [];
    let divider = 2;
    while (number >= 2) {
        if (number % divider == 0) {
            factors.push(divider);
            number /= divider;
        } else {
            divider++;
        }
    }
    return factors;
}
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function isPrime (number) {
    for(let i = 2, s = Math.sqrt(number); i <= s; i++)
        if(number % i === 0) return false; 
    return number > 1;
}



























// fraction structure [whole, numerator, denominator]
function checkFraction(input){
    if (!Array.isArray(input) || input.length != 3) {
        console.error(`Error with fraction: ${input}`)
    }
}

function convertFraction (input, toImproper = true) {
    if (toImproper){
        let whole = 0;
        let numerator = input[0] * input[2] + input[1];
        let denominator = input [2]
        return [whole, numerator, denominator]
    } else {
        let whole = input[2] === 0 ? 0 : Math.floor(input[1] / input [2]);
        let numerator = input[1] - input[2] * whole;
        let denominator = numerator === 0 ? 0 : input [2]
        return [whole, numerator, denominator]
    }
}

function simplifyFraction(input){
    [whole, numerator, denominator] = input
    gcd = greatestCommonDivisor(numerator,denominator);
    if (gcd === 0) return [whole, 0, 0];
    return [whole, numerator/gcd, denominator/gcd];
}

function multiplyingAndDividingFractions (a, b, isDivision = false) {
    a = convertFraction(a);
    b = convertFraction(b);
    if (isDivision) b = [0, b[2], b[1]]
    result = [0, a[1] * b[1], a[2] * b[2]];
    if (result[1] === 0) result[2] = 0
    return simplifyFraction(convertFraction(result, false))
}
function addingAndSubtractingFractions (a, b, isSubtraction = false) {
    a = convertFraction(a);
    b = convertFraction(b);
    denominator = leastCommonMultiple(a[2], b[2])
    a[1] = a[1]* denominator / a[2];
    b[1] = b[1]* denominator / b[2];
    result = [0, isSubtraction ? a[1] - b[1] : a[1] + b[1], denominator];
    if (result[1] === 0) result[2] = 0
    console.log(convertFraction(result, false))
    return simplifyFraction(convertFraction(result, false))
}

function compareFractions (a, b) {
    if (a[0]>b[0]) return ">";
    if (b[0]>a[0]) return "<";
    if(a[1]/a[2]>b[1]/b[2]) return ">";
    if(a[1]/a[2]<b[1]/b[2]) return "<";
    return "="
}

function drawFraction (input) {
    let whole = input[0] != 0 ? `<mn>${input[0]}</mn>` : input[1] > 0 ? `` : `<mn>0</mn>`;
    let fraction = input[1] > 0 ? `<mfrac><mi>${input[1]}</mi><mi>${input[2]}</mi></mfrac>` : ``;
    return `${whole+fraction}`;
}

// Euclid's algorithm to find GCD
function greatestCommonDivisor (a, b) {
    return b ? greatestCommonDivisor(b, a % b) : a;
}
function leastCommonMultiple(a, b) {
    return (a * b) / greatestCommonDivisor(a, b);   
}
function leastCommonMultipleGroup (range) {
    //find minimum
    return range.reduce((a, b) => leastCommonMultiple(a, b), min)}










function shuffleArray(array) {
    for (let i = 0; i < array.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function compareNumbers(a,b){
    if(a>b)return ">";
    if(a<b)return "<";
    return"=";
}








//temporarly (need to be deleted) This to delete other answers in multichoice questions
function sub (e){
let curr = e.target.htmlFor.split('');
let other = [curr[0] === "a" ? "b" : "a", curr[1]].join('')
let del = document.querySelector(`#${other}`)
del.remove()
let del_lab = document.querySelector(`[for=${other}]`)
del_lab.remove()
}


function generateRandomFraction (wholeMin, wholeMax){
    let denominator = generateRandomNumber(2,9);
    let numerator = generateRandomNumber(1, denominator-1);
    let whole = generateRandomNumber(wholeMin,wholeMax);
    return [whole,numerator,denominator];
}