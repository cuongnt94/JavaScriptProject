# JavaScriptProject

###  how to create and loop thru array
var boxes = document.querySelectorAll('.box');

Array.from(boxes).forEach(cur => cur.style.backgroundColor = 'dodgerblue');

var boxesArr6 = Array.from(boxes);

for(var cur of boxesArr6)
{

    if(cur.className.includes('blue'))
        continue;
    
    cur.textContent = 'I changed to blue!';
    
}

### how to create and loop thru map
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

### example of class
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

### how to get a total sum from array int

var array1 = [1,2,3,4,5];

const reducer = (accumulator, val) => accumulator + val;

console.log(array1.reduce(reducer));

// get the ratio of each element over the total sum

function calc(arr) {
    
    const sum = arr.reduce((prev, cur, index) => prev + cur, 0);
    
    return [sum, sum / arr.length];
    
}


