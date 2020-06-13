# JavaScriptProject

// how to create and loop thru array
var boxes = document.querySelectorAll('.box');
Array.from(boxes).forEach(cur => cur.style.backgroundColor = 'dodgerblue');

var boxesArr6 = Array.from(boxes);
for(var cur of boxesArr6)
{
    if(cur.className.includes('blue'))
        continue;
    
    cur.textContent = 'I changed to blue!';
}

// how to create and loop thru map
const question = new Map();
question.set('question', 'What is the official name of the latest major JavaScript version?');
question.set(1, 'ES5');
question.set(2, 'ES6');

console.log(question.get('question'));

for (let [key, value] of question.entries()) {
    if (typeof(key) === 'number') {
        console.log(`Answer ${key}: ${value}`);
    }
}

// example of class
class Person6 {
    constructor (name, yearOfBirth, job) {
        this.name = name;
        this.yearOfBirth = yearOfBirth;
        this.job = job;
    }
    
    calculateAge() {
        var age = new Date().getFullYear - this.yearOfBirth;
        console.log(age);
    }
    
    static greeting() {
        console.log('Hey there!');
    }
}

const john6 = new Person6('John', 1990, 'teacher');

Person6.greeting();
