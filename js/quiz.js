let questions = [];
let correctAnswers = [];
let count = 0;
let results = { correct: 0,
                incorrect: 0,
                date: undefined
              };



const function1 = async function getQuestions() {
    let response = await fetch(`https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple`);
    let data = await response.json();
    let final = await data.results.map((item, index) => {
        questions.push({
            'question': item.question,
            'correct_answer': item.correct_answer,
            'incorrect_answers': item.incorrect_answers
        });
        correctAnswers.push(item.correct_answer);
    });
    //console.log(questions);
}

const function2 = async function test() {

    let randomAnswers = questions.map((quest, index) => {
        return [...questions[index].incorrect_answers, questions[index].correct_answer].sort(() => 0.5 - Math.random())
    })

    const h2 = document.querySelector('h2');
    h2.innerText = `${questions[count].question}`;

    const span = document.querySelector('#question-number');
    span.innerText = `Question Number: ${count+1}`

    const inputs = document.querySelectorAll('.inputClass');
    inputs.forEach((item, index) => {
        item.setAttribute('value', `${randomAnswers[count][index]}`);
    })

    const labels = document.querySelectorAll('label');
    labels.forEach((item, index) => {
        item.innerText = `${randomAnswers[count][index]}`;
    })
    count++;

}


const mother = async () => {
    const a = await function1();
    const b = await function2();
}
mother()

console.log(correctAnswers);

const getDate = () => {
    const date = new Date();
    const date2 = `0${date.getDate()}/0${date.getMonth()}/${date.getFullYear()}`;
    const time = `${date.getHours()}:${date.getMinutes()}`;
    return [date2, time].join(' ')
}

const validation = event => {

    const radio = event.target.answerField.value;

    if (radio == '') {
        console.log('esta vacío');
    } else if (correctAnswers[count - 1] == radio) {
        results.correct += 1;
        console.log('Respuesta Correcta');

    } else if (correctAnswers[count - 1] !== radio) {
        results.incorrect += 1;
        console.log('Respuesta Incorrecta');
    }
    console.log(radio);
};

// Deseleccionar Radios

function unselect() {
    const radio = document.querySelectorAll('.inputClass')
    radio.forEach((x) => x.checked = false);
};

const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (count <= 9) {
        validation(event);
        function2();
        unselect();
        //validation
    } else {
        validation(event);
        count = 0;
        unselect();
        results.date = getDate();
        console.log('Se acabó!')
        console.log(results);
        // fin del juego 
    }


});