let questions = [];
let correctAnswers =[];
let count = 0;

const function1 = async function getQuestions() {
    let response = await fetch(`https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple`);
    let data = await response.json();
    let final = await data.results.map( (item, index )=> {
        questions.push({'question':item.question, 'correct_answer': item.correct_answer, 'incorrect_answers': item.incorrect_answers});
        correctAnswers.push(item.correct_answer);
    });
    //console.log(correctAnswers);
}

const function2 = async function test () {
    
    let randomAnswers = questions.map((quest, index) => {
      return [...questions[index].incorrect_answers, questions[index].correct_answer].sort(() => 0.5 - Math.random())
    })

    const h2 = document.querySelector('h2');
    h2.innerText = `${questions[count].question}`;

    const span = document.querySelector('#question-number');
    span.innerText = `${count+1}`
    
    const inputs = document.querySelectorAll('.inputClass');
    inputs.forEach((item, index) => {
        item.setAttribute('value',`${randomAnswers[count][index]}`);
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



const validation = event => {

    const radio = event.target.answerField.value;

   if (correctAnswers[count-1] == radio){
      alert('Respuesta Correcta');

    } else {
        console.log('Respuesta Incorrecta');
    }
}


const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (count <= 9 ){
        validation(event);
        function2();
        
        //validation
    } else {
        validation(event);
        count=0;
        console.log('Se acabó!')
        // fin del juego 
    }

});
