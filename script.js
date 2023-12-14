//Topic selection
const TOPICS = {'5A':{
                        Y5A01:{description:`Exponent (square, cube)`},
                        Y5A02:{description:`Rounding to 10, 100, 1000`},
                        Y5A03:{description:`Compare numbers to 1m`},
                        Y5A04:{description:`Roman numbers (to 50)`},
                        Y5A05:{description:`Roman numbers (to 4k)`},
                        Y5A06:{description:`Negative numbers`},
                        Y5A07:{description:`Prime numbers`},
                        Y5A08:{description:`Area, perimeter`},
                        Y5A09:{description:`Add, subtract 5-digit numbers`},
                        Y5A10:{description:`Odd, even numbers`},
                        Y5A11:{description:`Multiply up to 3 numbers, divide 2-digit by 1-digit number`},
                        Y5A12:{description:`Multiply, divide by powers of 10`},
                        Y5A13:{description:`Multiply, divide by multiples of 10 `},
                        Y5A14:{description:`More, less from given number`},
                        Y5A15:{description:`Efficient way to add, subtract 99`},
                        Y5A16:{description:`Fact families`},
                        Y5A17:{description:`Missing number`},
                        Y5A18:{description:`Add, subtract similar numbers`},
                        Y5A19:{description:`Prime factors of a number. Factor trees`},
                        Y5A20:{description:`Lesser common multiple of two numbers`},
                        
                        
                        
                        
                        
                        
                        
                        
                    },
                '5B':{
                        Y5B01:{description:`Convert fraction`},
                        Y5B02:{description:`Add and subtract fractions`},
                        Y5B03:{description:`Compare simple fractions`},
                        Y5B04:{description:`Multiply fraction by whole number`},
                        Y5B05:{description:`Rounding decimals`},
                        Y5B06:{description:`Compare decimals`},
                        Y5B07:{description:`Fraction of amount`},
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
                        Y6A09:{description:`Prime numbers`},
                        Y6A10:{description:`Add, subtract 6-digit numbers`},
                        Y6A11:{description:`Adding negative and positive numbers`},
                        Y6A12:{description:`Odd, even numbers`},
                        Y6A13:{description:`Fraction of amount`},
                        Y6A14:{description:`Order of operations`},

                        
                    },
                }

const PASSWORD = "math1";
let NUMBER_OF_QUESTIONS = 10;

const MINUS = "&#8210;";
const DIVIDE = "&div;";
const MULTIPLY = "&times;";

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
const numberOfQuestionsInput = document.querySelector("#numberOfQuestionsInput");
const numberOfQuestions = document.querySelector("#numberOfQuestions");
const resultsField = document.querySelector("#resultsField");

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
        // console.log(event)
    }
    renderer([returnButton, testField, resultsCheckForm], [topicField, repeatButton, numberOfQuestions, resultsField], TOPICS[testYear][testType].description);
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
    resultsField.innerHTML = results/NUMBER_OF_QUESTIONS*100 + "%";
    const showAnswerFields = document.querySelectorAll('.correctAnswer');
    renderer(Array.from(showAnswerFields).concat([repeatButton, resultsField]), [resultsCheckForm], false)
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
    renderer([topicField, numberOfQuestions],[repeatButton, returnButton, testField, resultsCheckForm]);
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
        
        case "Y5A01": case "Y6A06": //Exponent (power of)
            let numbers = shuffleArray(generateArrayOfConsequtiveNumbers(0,10))  //Make numbers unique (not repeated if possible)
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let index = i;
                while (index > 9) {
                    index -=10;
                }
                let exponent = numbers[index] > 3 ? generateRandomNumber(1,3) : generateRandomNumber(2,5);
                let correctAnswer = numbers[index] ** exponent;
                correctAnswers.push([correctAnswer]);

                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <math class="questionText">
                                    <msup>
                                        <mn>${numbers[index]}</mn>
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
                const DIGITS = 7;
                let number = generateRandomNumber(10 ** (DIGITS-1), (10 ** DIGITS) - 1);

                let division, questionText;
                if (isDecimal){
                    const MAX_DECIMALS = 4;
                    let decimalPoint = generateRandomNumber(MAX_DECIMALS,DIGITS-1)
                    number = number / (10 ** decimalPoint);
                    division = i % MAX_DECIMALS;
                    questionText = division > 0 ? `to ${division} decimal point` : `to whole number`
                } else {
                    division = 10 ** ((i % 3) + 1);
                    questionText = `to closest ${division}`
                }
                let correctAnswer = isDecimal ? Math.round(number*(10**division))/(10**division) : Math.round(number/division)*division;
                correctAnswers.push([correctAnswer]);

                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <math class="questionText">
                                    <span>Round ${number}  ${questionText}</span>
                                    <mn id="userAnswer${i}">
                                        <input name="userSubAnswer" type="text" maxlength="${DIGITS}" size="${DIGITS}">
                                    </mn>
                                </math>
                                <div id="correctAnswer${i}" class="correctAnswer hidden"">${correctAnswer}</div>
                            </div>`;
            }
        break;

        case "Y5A03": case "Y6A07": case "Y5B06": // Compare to 1m/10m/decimals
        for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
            const DIGITS = topic === "Y6A07" ? 7 : 6;
            let number1 = generateRandomNumber(10 ** (DIGITS-1),10 ** DIGITS);
            let number2 = number1;
            number1 = number1.toString().split('');
            number2 = number2.toString().split('');

            let difference = generateRandomNumber(0, topic === "Y6A07" ? 4 : 3)
            let indexes = shuffleArray(generateArrayOfConsequtiveNumbers(0,DIGITS))
            while(difference > 0){
                let n = indexes[difference];
                do{
                    number2[n]= generateRandomNumber(0,9);
                } while (number1[n] == number2[n])
                difference--
            }

            number1 = parseInt(number1.join(''))
            number2 = parseInt(number2.join(''))

            if(topic === "Y5B06"){ //Decimals
                let samePoint = difference === 0 ? false : Math.random() < 0.6; //60% same decimal point
                let decimalPoint1 = generateRandomNumber(1,DIGITS-1)
                number1 = number1 / (10 ** decimalPoint1);
                number2 = samePoint ? number2 / (10 ** decimalPoint1) : number2 / (10 ** generateRandomNumber(1,DIGITS-1));
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

        case "Y5A04": case "Y5A05": //Roman numbers
        // Input must be in upper case letters, otherwise result is worng. Can fix it, but it will affect other test answers too
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let number = generateRandomNumber(1,topic === "Y5A04" ? 50 : 3999);
                let romanNumber = convertToRoman(number);
                let isRoman = Math.random() < 0.5;
                let correctAnswer = isRoman ? number : romanNumber;
                correctAnswers.push([correctAnswer]);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <span class="questionText">${isRoman ? romanNumber : number}</span>
                                <div id="userAnswer${i}" class="">
                                    <input type="text" name="userSubAnswer" class="answer" maxlength="12" size="12">
                                </div>
                                <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div>
                            </div>`;
            }
        break;
        
        case "Y5A06": case "Y6A11": //Negative numbers
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                const isY5 = topic === "Y5A06";
                let number1 = generateRandomNumber(-50,-5);
                let number2 = generateRandomNumber(5,100);
                let correctAnswer = isY5 ? number2 - number1 : number2 + number1;
                correctAnswers.push([correctAnswer]);

                const question = isY5 ? `<span class="questionText">What is the difference between <math><mo rspace="0em">${MINUS}</mo><mn>${Math.abs(number1)}</mn></math> and ${number2}</span>
                                <div id="userAnswer${i}" class="">
                                    <input type="text" name="userSubAnswer" class="answer" maxlength="3" size="3">
                                </div>` 
                                : 
                                `<math class="questionText"><mo rspace="0em">${MINUS}</mo><mn>${Math.abs(number1)}</mn><mo>+</mo><mn>${number2}</mn><mo>=</mo>
                                <mn id="userAnswer${i}" class="">
                                    <input type="text" name="userSubAnswer" class="answer" maxlength="3" size="3">
                                </mn></math>`;

                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                ${question}
                                <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div>
                            </div>`;
            }
        break;
        
        case "Y5A07": case "Y6A09": //Prime numbers
            let numbersForPrime = shuffleArray(generateArrayOfConsequtiveNumbers(2, Math.max(NUMBER_OF_QUESTIONS, 100))).slice(- NUMBER_OF_QUESTIONS)
            numbersForPrime.forEach((number, i) => {
                correctAnswers.push([isPrime(number).toString()]);

                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <span class="questionText">${number}</span>
                            <div id="userAnswer${i}" class="">
                                <input type="radio" name="userSubAnswer" id="a${i}" value="true" class="invisible radio-colors"/>
                                <label for="a${i}" onClick="removeRestOfNswers(event)">Prime</label>
                                <input type="radio" name="userSubAnswer" id="b${i}" value="false" class="invisible radio-colors"/>
                                <label for="b${i}" onClick="removeRestOfNswers(event)">Composite</label>
                            </div>
                            <div id="correctAnswer${i}" class="correctAnswer hidden">${isPrime(number) ? "Prime" : "Composite"}</div></div>`;
            
            })
        break;

        case "Y5A08": //Area, perimeter
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
                            <div id="correctAnswer${i}" class="correctAnswer hidden">P: ${correctAnswer[0]} A: ${correctAnswer[1]}</div>
                            </div>`;
            }
        break;
        
        case "Y5A09": case "Y6A10": //Add / subtract 5-digit / 6-digit
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let number1Digits = [], number2Digits = [], number1, number2;
                let isAddition = Math.random() < 0.5;
                const DIGITS = topic === "Y5A09" ? 5 : 6;

                if (isAddition){ //Addition
                    for (let j = 0; j < DIGITS; j++){
                        let digit1 = j == 0 ? generateRandomNumber(1, 4) : generateRandomNumber(0, 9);
                        number1Digits.push(digit1);
                        let digit2 = j == 0 ? generateRandomNumber(1, 4) : generateRandomNumber(9 - digit1, 9);
                        number2Digits.push(digit2);
                    }
                    number1 = joinDigits(number1Digits);
                    number2 = joinDigits(number2Digits);

                } else { //Subtraction
                    for (let j = 0; j < DIGITS; j++){
                        let digit1 = j == 0 ? generateRandomNumber(6, 9) : generateRandomNumber(0, 8);
                        number1Digits.push(digit1);
                        let digit2 = j == 0 ? generateRandomNumber(1, 5) : generateRandomNumber(digit1 - 1, 9); //Adjuat this min/max values of rando to get more/less exchanges
                        number2Digits.push(digit2);
                    }
                    number1 = joinDigits(number1Digits);
                    number2 = joinDigits(number2Digits);
                }
                let correctAnswer = isAddition ? number1 + number2 : number1 - number2;
                correctAnswers.push([correctAnswer]);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s; font-size:3em">
                                <math>
                                    <mfrac>
                                        <mrow>
                                            <mo>${isAddition ? "+" : MINUS}</mo>
                                            <mfrac linethickness="0">
                                                <mn>${number1}</mn>
                                                <mn>${number2}</mn>                                            
                                            </mfrac>
                                        </mrow>
                                        <mfrac linethickness="0">
                                                <mrow id="userAnswer${i}" class="">
                                                    <mn><input type="text" name="userSubAnswer" class="answer rightAlign" maxlength="5" size="5"></mn>
                                                </mrow>                           
                                                <mn id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</mn>
                                        </mfrac>
                                    </mfrac>
                                </math>
                            </div>`;
            }
        break;
        
        case "Y5A10": // Odd / even numbers
            let numbersForOdd = shuffleArray(generateArrayOfConsequtiveNumbers(2, Math.max(NUMBER_OF_QUESTIONS, 100))).slice(- NUMBER_OF_QUESTIONS)
            numbersForOdd.forEach((number, i) => {
                correctAnswers.push([isOdd(number).toString()]);

                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <span class="questionText">${number}</span>
                            <div id="userAnswer${i}" class="">
                                <input type="radio" name="userSubAnswer" id="a${i}" value="true" class="invisible radio-colors"/>
                                <label for="a${i}" onClick="removeRestOfNswers(event)">Odd</label>
                                <input type="radio" name="userSubAnswer" id="b${i}" value="false" class="invisible radio-colors"/>
                                <label for="b${i}" onClick="removeRestOfNswers(event)">Even</label>
                            </div>
                            <div id="correctAnswer${i}" class="correctAnswer hidden">${isOdd(number) ? "Odd" : "Even"}</div></div>`;
            
            })
        break;

        case "Y5A11": // Multiply up to 3 numbers, divide
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                if(Math.random()<0.7){ // Multiply  divide 2 numbers
                    let number1 = generateRandomNumber(0,12);
                    let number2 = generateRandomNumber(1,12);
                    let result = number1*number2;
                    let isMultiplication = Math.random() < 0.2;
                    let correctAnswer = isMultiplication ? result : number1;
                    correctAnswers.push([correctAnswer]);
                    output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                    <math class="questionText"><mn>${isMultiplication ? number1 : result}</mn><mo>${isMultiplication ? MULTIPLY : DIVIDE}</mo><mn>${number2}</mn><mo>=</mo>
                                    <mn id="userAnswer${i}" class=""><input name="userSubAnswer" type="text" class="answer" maxlength="3" size="3"></mn></math>
                                    <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div>
                                </div>`;
                }
                else { // Multiply 3 numbers
                    let number1 = generateRandomNumber(2,5);
                    let number2 = generateRandomNumber(2,12 - number1);
                    let number3 = generateRandomNumber(1,12 - number1 - number2);
                    let correctAnswer = number1*number2*number3;
                    correctAnswers.push([correctAnswer]);
                    output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s"> 
                                    <math class="questionText"><mn>${number1}</mn><mo>${MULTIPLY}/mo><mn>${number2}</mn><mo>${MULTIPLY}</mo><mn>${number3}</mn><mo>=</mo>
                                    <mn id="userAnswer${i}" class=""><input name="userSubAnswer" type="text" class="answer" maxlength="3" size="3"></mn></math>
                                    <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div>
                                </div>`;
                }
            }
        break;

        case "Y5A12": // Multiply / divide by 10, 100, 100 (powers of 10)
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let numberLength = generateRandomNumber(0,3);
                let number1 = generateRandomNumber(Math.pow(10,numberLength),Math.pow(10, numberLength+1));
                let number2 = Math.pow(10, 4 - numberLength);
                let result = number1*number2;
                let isMultiplication = Math.random() < 0.5;
                let correctAnswer = isMultiplication ? result : number1;
                correctAnswers.push([correctAnswer]);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <math class="questionText">
                                    <mn>${isMultiplication ? number1 : result}</mn><mo>${isMultiplication ? MULTIPLY : DIVIDE}</mo><mn>${number2}</mn><mo>=</mo>
                                    <mn id="userAnswer${i}" class=""><input name="userSubAnswer" type="text" class="answer" maxlength="7" size="6"></mn></math>
                                <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div>
                            </div>`;
            }
        break;

        case "Y5A13": // Multiply, divide by multiples of 10 (200, 450, 1100)
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let number1 = generateRandomNumber(2,11);
                let number2 = generateRandomNumber(1,12) * Math.pow(10, generateRandomNumber(1,3));
                let isMultiplication = Math.random() < 0.5;
                let result = number1*number2;
                let correctAnswer = isMultiplication ? result : number1;
                correctAnswers.push([correctAnswer]);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <math class="questionText">
                                    <mn>${isMultiplication ? number1 : result}</mn><mo>${isMultiplication ? MULTIPLY : DIVIDE}</mo><mn>${number2}</mn><mo>=</mo>
                                    <mn id="userAnswer${i}" class=""><input name="userSubAnswer" type="text" class="answer" maxlength="7" size="6"></mn></math>
                                <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div>
                            </div>`;
            }
        break;

        case "Y5A14": // More /less 1000
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let number1 = generateRandomNumber(1111,9999);
                let number2 =  Math.pow(10, generateRandomNumber(0,3));
                let isAddition = Math.random() < 0.5;
                let correctAnswer = isAddition ? number1 + number2 : number1 - number2;
                correctAnswers.push([correctAnswer]);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <math class="questionText">
                                    <mn>${number2}</mn><mo>${isAddition ? "more than" : "less than"}</mo><mn>${number1}</mn></math>
                                    <div id="userAnswer${i}" class=""><input name="userSubAnswer" type="text" class="answer" maxlength="5" size="5"></div>
                            <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div></div>`;
            }
        break;
        
        case "Y5A15": // Efficient way to add 99
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let number1 = generateRandomNumber(1111,9999);
                let number2 = Math.pow(10, generateRandomNumber(2,3)) - 1;
                let isAddition = Math.random() < 0.5;
                let correctAnswer = isAddition ? number1 + number2 : number1 - number2;
                correctAnswers.push([correctAnswer]);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <math class="questionText">
                                    <mn>${number1}</mn><mo>${isAddition ? "+" : MINUS}</mo><mn>${number2}</mn><mo>=</mo>
                                    <mn id="userAnswer${i}" class=""><input name="userSubAnswer" type="text" class="answer" maxlength="6" size="5"></mn></math>
                            <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div></div>`;
            }
        break;

        case "Y5A16": // Fact families
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
                                        <span class="questionText">${result} ${MINUS} ${number2}=</span>
                                        <span id="userAnswer${i}">
                                            <input name="userSubAnswer" type="text" class="answer" maxlength="5" size="5"></span>
                                    </div>`
                        correctAnswer = result - number2;
                    break;
                    case 2://Subtraction
                        number1 = generateRandomNumber(5000,9950);
                        number2 = generateRandomNumber(999,number1 - 999);
                        result = number1 - number2;
                        question = `<span class="questionText">${number1} ${MINUS} ${number2}=${result}</span>
                                    <div>
                                        <span class="questionText">${result}+${number2}=</span>
                                        <span id="userAnswer${i}">
                                            <input name="userSubAnswer" type="text" class="answer" maxlength="5" size="5"></span>
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
                                        <span id="userAnswer${i}">
                                            <input name="userSubAnswer" type="text" class="answer" maxlength="5" size="5"></span>
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
                        question = `<span class="questionText">${number1} ${MINUS} ${number2}=${result}</span>
                                    <div>
                                        <span class="questionText">${number1+modifier} ${MINUS} ${number2+modifier}=</span>
                                        <span id="userAnswer${i}">
                                            <input name="userSubAnswer" type="text" class="answer" maxlength="5" size="5"></span>
                                    </div>`
                        correctAnswer = result;
                    break;
                    default:
                        console.error("Error in test type function")
                }
                correctAnswers.push([correctAnswer]);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            ${question}
                            <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div></div>`;
            }
        break;
        
        case "Y5A17": // Missing number
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let operator, number1, number2, result;

                if (Math.random() < 0.5){ // Addition 
                    number1 = generateRandomNumber(11,88);
                    number2 = generateRandomNumber(11,number1);
                    result = number1 + number2;
                    operator = "+";
                    if (Math.random() < 0.5){ // Subtraction
                        [result, number1] = [number1, result]
                        operator = MINUS 
                    }
                } else { // Multiplicaton 
                    number1 = generateRandomNumber(1,11);
                    number2 = generateRandomNumber(1,11);
                    result = number1 * number2;
                    operator = MULTIPLY 
                    if (Math.random() < 0.5){ // Division
                        [result, number1] = [number1, result]
                        operator = DIVIDE 
                    }
                }
                
                let isFirstNumberMissing = Math.random() < 0.5;
                let correctAnswer = isFirstNumberMissing ? number1 : number2;
                correctAnswers.push([correctAnswer]);
                const userAnswer = `<mn id="userAnswer${i}" class=""><input name="userSubAnswer" type="text" class="answer" maxlength="2" size="2"></mn>`;
                
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <math class="questionText">
                                    <mn>${isFirstNumberMissing ? userAnswer : number1}</mn><mo>${operator}</mo><mn>${isFirstNumberMissing ? number2 : userAnswer}</mn><mo>=</mo><mn>${result}</mn></math>
                            <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div></div>`;
            }
        break;
        
        case "Y5A18": // Sum of aimilar numbers
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
                    correctAnswers.push([correctAnswer]);
                    output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <span class="questionText">${number1*multiplier}${isAddition ? "+" : MINUS}${number2*multiplier}=</span>
                                <span id="userAnswer${i}">
                                            <input name="userSubAnswer" type="text" class="answer" maxlength="5" size="5"></span>
                                <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div></div>`;
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
                    correctAnswers.push([correctAnswer]);
                    output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <span>${number1} ${MINUS} ${number2}=</span>
                                <span id="userAnswer${i}">
                                            <input name="userSubAnswer" type="text" class="answer" maxlength="5" size="5"></span>
                                <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div></div>`;
                }
            }
        break;
        
        case "Y5A19": //Factors of number
        let numbersForFactors = shuffleArray(generateArrayOfConsequtiveNumbers(4, Math.max(Math.floor(NUMBER_OF_QUESTIONS * 1.3), 100))).filter(number => !isPrime(number)).slice(- NUMBER_OF_QUESTIONS)
            numbersForFactors.forEach((number, i) => {
                let correctAnswer = getPrimeFactorsOfNumber(number).sort().join(',');
                correctAnswers.push([correctAnswer]);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <span class="questionText">${number}</span>
                                <span id="userAnswer${i}">
                                    <input name="userSubAnswer" type="text" class="answer" maxlength="20" size="20" onfocusout="sortFactors(event)">
                                </span>
                                <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div>
                            </div>`;
            
            })
        break;

        case "Y5A20": // Lesser common multiple
        for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
            let number1 = generateRandomNumber(2,11);
            let number2;
            do {number2 = generateRandomNumber(2,11)}
            while (number2 === number1)
                let correctAnswer = leastCommonMultiple(number1,number2);
                correctAnswers.push([correctAnswer]);
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <span class="questionText">${number1} and ${number2}</span>
                                <span id="userAnswer${i}">
                                    <input name="userSubAnswer" type="text" class="answer" maxlength="3" size="3">
                                </span>
                                <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div>
                            </div>`;
            
            }
        break;


        case "Y5B01": // Convert mixed numbers and improper fractions
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                const toImproper = Math.random() < 0.5;
                let denominator = generateRandomNumber(2,12);
                let numerator = toImproper ? generateRandomNumber(1, denominator-1) : generateRandomNumber(denominator + 1, (denominator * 9) - 1);
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

        //Y5B02 -> Y6A03

        case "Y5B03": // Compare simple fractions
        for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
            let fraction1 = generateRandomFraction(0,0);
            let fraction2 = generateRandomFraction(0,0);

            if(fraction1.equals(fraction2)){ // Rare case for completely identical fractions
                let multiplicator = generateRandomNumber(2,5);
                fraction2[2]*=multiplicator;
                fraction2[1]*=multiplicator;
            }

            let correctAnswer = compareFractions(fraction1, fraction2);
            correctAnswers.push([correctAnswer]);

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

        //Y5B04 -> Y6A04
        //Y5B05 -> Y5A02
        //Y5B06 -> Y5A03

        case "Y5B07": case "Y6A13": // Fraction of amount
        for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
            let fraction = generateRandomFraction(0,0);
            let multiplier = topic === "Y5B07" ? generateRandomNumber(2,12) : generateRandomNumber(12,50);
            let amount = fraction[2] * multiplier;

            let correctAnswer = multiplier * fraction[1];
            correctAnswers.push([correctAnswer]);

            output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <math>
                                <mpadded lspace="0.5em">
                                    ${drawFraction(fraction)}
                                    <mo>of</mo><mn>${amount}</mn>
                                </mpadded>
                            </math>
                            <div id="userAnswer${i}">
                                        <input name="userSubAnswer" type="text" maxlength="3" size="3"/>
                                    </div>
                            <div id="correctAnswer${i}" class="correctAnswer hidden"">${correctAnswer}</div>
                        </div>`;
        }
        break;

        case "Y6A01": // Compare fractions
        for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
            let fraction1 = generateRandomFraction(1,5);
            let fraction2 = Math.random() < 0.7 ? generateRandomFraction(fraction1[0],fraction1[0]) : generateRandomFraction(1,5); //70% same whole

            if(fraction1.equals(fraction2)){ // Rare case for completely identical fractions
                let multiplicator = generateRandomNumber(2,5);
                fraction2[2]*=multiplicator;
                fraction2[1]*=multiplicator;
            }
            if(Math.random() < 0.9) { //10% both mixed, ~80% one improper,
                fraction1 = convertFraction(fraction1, true) 
                if(Math.random() < 0.1) fraction2 = convertFraction(fraction2, true)
                if(Math.random() < 0.5) [fraction1, fraction2] = [fraction2, fraction1]
            }
            let correctAnswer = compareFractions(fraction1, fraction2);
            correctAnswers.push([correctAnswer]);
            
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
                const MULTIPLICATOR = generateRandomNumber(2,5);
                fraction[1] *= MULTIPLICATOR;
                fraction[2] *= MULTIPLICATOR;
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

                //For substraction larger fraction should be on left
                if(isSubtraction){
                    let compare = compareFractions(fraction1, fraction2);
                    if (compare != ">") [fraction1, fraction2] = [fraction2, fraction1]
                } 

                if(Math.random() < 0.9) { //10% both mixed, ~80% one improper,
                    fraction1 = convertFraction(fraction1, true) 
                    if(Math.random() < 0.1) fraction2 = convertFraction(fraction2, true)
                    if(!isSubtraction && Math.random() < 0.5) [fraction1, fraction2] = [fraction2, fraction1]
                }

                let correctAnswer = addingAndSubtractingFractions(fraction1, fraction2, isSubtraction)
                correctAnswers.push(correctAnswer);

                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <math>
                                    <mpadded lspace="0.5em">
                                        ${drawFraction(fraction1)}
                                        <mo>${isSubtraction ? MINUS : "+"}</mo>
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
            let min = 0; //This value used to limit number of questions where fraction is multiplied by 0
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

                let fraction = generateRandomFraction(0,0);
                let number = generateRandomNumber(0,9);

                let correctAnswer = multiplyingAndDividingFractions(fraction, [number, 0, 1], true)
                correctAnswers.push(correctAnswer);

                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                                <math>
                                    <mpadded lspace="0.5em">
                                        ${drawFraction(fraction)}
                                        <mo>&divide</mo>
                                        ${drawFraction([number, 0, 1])}
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

//Y6A06 -> Y5A01
//Y6A07 -> Y5A03
//Y6A08 -> Y5A02
//Y6A09 -> Y5A07
//Y6A10 -> Y5A09
//Y6A11 -> Y5A06

        case "Y6A12": // Odd / even numbers
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                let number = generateRandomNumber(100,9999);
                correctAnswers.push([isOdd(number).toString()]);

                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <span class="questionText">${number}</span>
                            <div id="userAnswer${i}" class="">
                                <input type="radio" name="userSubAnswer" id="a${i}" value="true" class="invisible radio-colors"/>
                                <label for="a${i}" onClick="removeRestOfNswers(event)">Odd</label>
                                <input type="radio" name="userSubAnswer" id="b${i}" value="false" class="invisible radio-colors"/>
                                <label for="b${i}" onClick="removeRestOfNswers(event)">Even</label>
                            </div>
                            <div id="correctAnswer${i}" class="correctAnswer hidden">${isOdd(number) ? "Odd" : "Even"}</div></div>`;
            
            }
        break;

//Y6A13 -> Y5B07 

        case "Y6A14": // Order of operations
        /*
        1) Parentesses
        2) Exponantiation
        3) Multiply / divide
        4) Add / Subtract
        */
            for (let i = 0; i < NUMBER_OF_QUESTIONS; i++){
                const NUMBER_OF_ACTIONS = generateRandomNumber(2,3);
                let bracketsNotUsed = true;
                let last_a = '';
                let question = last_a;
                let operators =shuffleArray(["*","/","+","-"]);
                let lastresult;
                for (let j = 0; j < NUMBER_OF_ACTIONS; j++){
                    let expression ='';
                    let b = j === 0 ? generateRandomNumber(1,9) : lastresult;
                    let a;
                    if (operators[j] === "/") a= b*generateRandomNumber(2,9);
                    else if (operators[j] === "-") a= generateRandomNumber(b+1,b+4)
                    else a =generateRandomNumber(1,9);

                    expression = a + operators[j] + b;
                    console.log(expression)

                    if (operators[j] === "*" || operators[j] === "/") {lastresult = eval(expression)}
                    else {lastresult = a}

                    if ((operators[j] === "-" || operators[j] === "+") && bracketsNotUsed && Math.random() < 0.5){
                            expression = "(" + expression + ")";
                            bracketsNotUsed = false;
                            lastresult = eval(expression)
                    }
                    question = question.replace(last_a, expression);
                    console.log(question)
                    last_a = a;
                        
                }
                console.log("-----")
                correctAnswer = eval(question);
                correctAnswers.push([correctAnswer]);
                question = question.replace("/", DIVIDE).replace("*", MULTIPLY).replace("-", MINUS);
                
                output += `<div class="question" id="question${i}" style="animation-delay:${i*animationDelay/4}s">
                            <span class="questionText">${question}</span>
                            <div id="userAnswer${i}" class="">
                                <input type="text" name="userSubAnswer" maxlength="3" size="3"/>
                            </div>
                            <div id="correctAnswer${i}" class="correctAnswer hidden">${correctAnswer}</div></div>`;
            
                    
                    //A+(X+Y)*Z
                    //X/(Y-Z)
                    //X+Y*Z
                    //X/Y-Z
                    //Z+X*Y-A
                }
        break;


        default:
            console.error("Error in test type function")
    }
    console.log(correctAnswers)
    return output;
}
function joinDigits (numberDigits){ //converts array of DIGITS [1,2,3,4] into integer 1234
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
function isOdd (number) {
    if(number % 2 === 0) return false;
    return true;
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
    const valueA = a[1]/a[2]+a[0];
    const valueB = b[1]/b[2]+b[0];
    if(valueA > valueB) return ">";
    if(valueA < valueB) return "<";
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
function removeRestOfNswers (e){
let curr = e.target.htmlFor.split('');
let other = [curr[0] === "a" ? "b" : "a", curr[1]].join('')
let del = document.querySelector(`#${other}`)
del.remove()
let del_lab = document.querySelector(`[for=${other}]`)
del_lab.remove()
}
function sortFactors (e){
let userInput = e.target.value;
if (userInput === "") return;
let match = userInput.match(/\D/);
if(match === null) return;
let numbers = userInput.split(/\D/).map( item => Number(item)).filter(item => item != 0).sort()
let element = e.currentTarget;
element.value = numbers;
}
function setNumberOfQuestions (e) {
    NUMBER_OF_QUESTIONS = e.target.value;
}

function generateRandomFraction (wholeMin, wholeMax){
    let denominator = generateRandomNumber(2,9);
    let numerator = generateRandomNumber(1, denominator-1);
    let whole = generateRandomNumber(wholeMin,wholeMax);
    return [whole,numerator,denominator];
}
function generateArrayOfConsequtiveNumbers (start, length) {
    return Array.from({length}, (value, index) => index + start)
    //For array starting 0 can do [...Array(length).keys()]
}