class Income
{
    constructor(id, description, value)
    {
        this.id = id;
        this.description = description;
        this.value = value;
    }
}

class Expense extends Income
{
    constructor(id, description, value)
    {
        super(id, description, value);
        this.percentage = -1;
    }

    calcPercentage(totalIncome)
    {
        if(totalIncome > 0)
            this.percentage = Math.round((this.value / totalIncome) * 100);
        else
            this.percentage = -1;
    }

    getPercentage()
    {
        return this.percentage;
    }

}

// BUDGET CONTROLLER
class BudgetController 
{
    constructor()
    {
        this.data = {
            allItems: {
                exp: [],
                inc: []
            },
            totals: {
                exp: 0,
                inc: 0
            },
            budget: 0,
            percentage: -1
        };
    }

    calculateTotal(type)
    {
        var sum = 0;
        this.data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        this.data.totals[type] = sum;
    }

    addItem(type, des, val)
    {
        var newItem, ID;

        // 1. generate new ID based on the last ID
        if (this.data.allItems[type].length > 0) {
            ID = this.data.allItems[type][this.data.allItems[type].length - 1].id + 1;
        } else {
            ID = 0;
        }

        // 2. create new item based on inc or exp
        if (type === 'exp') {
            newItem = new Expense(ID, des, val);
        } else if (type === 'inc') {
            newItem = new Income(ID, des, val);
        }

        // 3. update data
        this.data.allItems[type].push(newItem);
        
        return newItem;
    }

    deleteItem(type, id) 
    {
        var list_of_item, index;

        // 1. create the array of item.id based on the type
        list_of_item = this.data.allItems[type].map(function(current) {
            return current.id;
        });

        // 2. get the index of item from array of item.id based on its id.
        index = list_of_item.indexOf(id);

        // 3. remove 1 item at index position 
        if (index !== -1) {
            this.data.allItems[type].splice(index, 1);
        }   
    }

    
    calculateBudget()
    {
        // 1. calculate total income and expenses
        this.calculateTotal('exp');
        this.calculateTotal('inc');
        
        // 2. Calculate the budget: income - expenses
        this.data.budget = this.data.totals.inc - this.data.totals.exp;
        
        // 3. calculate the percentage of income that we spent
        if (this.data.totals.inc > 0) {
            this.data.percentage = Math.round((this.data.totals.exp / this.data.totals.inc) * 100);
        } else {
            this.data.percentage = -1;
        }            
    }

    // calculate the percentage of each element in the expense list
    calculatePercentages()
    {
        // 1. loop thru each element in array of expenses 
        this.data.allItems['exp'].forEach(function(cur) {
            cur.calcPercentage(this.data.totals.inc);
         });
    }

    getPercentages()
    {
        // create an array of percentage of each expense item
        var list_each_percentage = this.data.allItems.exp.map(function(cur) {
            return cur.getPercentage();
        });
        return list_each_percentage;
    }

    // return an over view of budget for the center information
    getBudget()
    {
        return {
            budget: this.data.budget,
            totalInc: this.data.totals.inc,
            totalExp: this.data.totals.exp,
            percentage: this.data.percentage
        };
    }
} 


// UI CONTROLLER
class UIController
{
    constructor()
    {
        this.DOMstrings = {
            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue: '.add__value',
            inputBtn: '.add__btn',
            incomeContainer: '.income__list',
            expensesContainer: '.expenses__list',
            budgetLabel: '.budget__value',
            incomeLabel: '.budget__income--value',
            expensesLabel: '.budget__expenses--value',
            percentageLabel: '.budget__expenses--percentage',
            container: '.container',
            expensesPercLabel: '.item__percentage',
            dateLabel: '.budget__title--month'
        }; 
    }

    formatNumber(num, type)
    {
        var numSplit, new_num, type;
        
        // 1. make sure that num is non negative and 2 decimal digits
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        // 2. add , as a thousand seperator
        new_num = numSplit[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return (type === 'exp' ? '-' : '+') + ' ' + new_num + '.' + numSplit[1];
    }

    // 
    nodeListForEach(list, callback)
    {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    }

    // return an obj with type, description and value
    getInput()
    {
        return {
            type: document.querySelector(this.DOMstrings.inputType).value, // Will be either inc or exp
            description: document.querySelector(this.DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(this.DOMstrings.inputValue).value)
        };
    }

    // 
    addListItem(obj, type)
    {
        var html, newHtml, element;
        
        // 1. Create HTML string with placeholder text    
        if (type === 'inc') {
            element = this.DOMstrings.incomeContainer;
            
            html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
            element = this.DOMstrings.expensesContainer;
            
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        
        // 2. Replace the placeholder text with actual data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', this.formatNumber(obj.value, type));
        
        // 3. Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    }

    deleteListItem(selectorID)
    {
        var el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);
    }

    clearFields()
    {
        var fields, fieldsArr;
        
        // 1. create a node list of description and money input value
        fields = document.querySelectorAll(this.DOMstrings.inputDescription + ', ' + this.DOMstrings.inputValue);
        
        // 2. make it an array
        fieldsArr = Array.prototype.slice.call(fields);
        
        // 3. loop thru each element (2 in total) to reset to value to ""
        fieldsArr.forEach(function(current, index, array) {
            current.value = "";
        });
        
        // 4. put the cursor back to description box
        fieldsArr[0].focus();
    }


    displayBudget(obj)
    {
        var type;
        obj.budget > 0 ? type = 'inc' : type = 'exp';
        
        document.querySelector(this.DOMstrings.budgetLabel).textContent = this.formatNumber(obj.budget, type);
        document.querySelector(this.DOMstrings.incomeLabel).textContent = this.formatNumber(obj.totalInc, 'inc');
        document.querySelector(this.DOMstrings.expensesLabel).textContent = this.formatNumber(obj.totalExp, 'exp');
        
        if (obj.percentage > 0) {
            document.querySelector(this.DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        } else {
            document.querySelector(this.DOMstrings.percentageLabel).textContent = '---';
        }
    }

    displayPercentages(percentages)
    {
        var fields = document.querySelectorAll(this.DOMstrings.expensesPercLabel);
            
        this.nodeListForEach(fields, function(current, index) {
            
            if (percentages[index] > 0) {
                current.textContent = percentages[index] + '%';
            } else {
                current.textContent = '---';
            }
        });
    }

    displayMonth()
    {
        var now, months, month, year;
            
        now = new Date();
        
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        month = now.getMonth();
        
        year = now.getFullYear();
        document.querySelector(this.DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
    }

    changedType()
    {
        var fields = document.querySelectorAll(
        this.DOMstrings.inputType + ',' + 
        this.DOMstrings.inputDescription + ',' + 
        this.DOMstrings.inputValue);
        
        this.nodeListForEach(fields, function(cur) {
           cur.classList.toggle('red-focus'); 
        });
        
        document.querySelector(this.DOMstrings.inputBtn).classList.toggle('red');
    }

    getDOMstrings()
    {
        return this.DOMstrings;
    }


    
    
}


// GLOBAL APP CONTROLLER
class Controller{
    constructor(budgetCtrl, UICtrl)
    {
        this.budgetCtrl = budgetCtrl;
        this.UICtrl = UICtrl;
    }

    setupEventListeners()
    {
        var DOM = this.UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', this.ctrlAddItem.bind(this));

        document.addEventListener('keypress', this.pressEnter.bind(this));
        
        document.querySelector(DOM.container).addEventListener('click', this.ctrlDeleteItem.bind(this));
        
        document.querySelector(DOM.inputType).addEventListener('change', this.UICtrl.changedType.bind(this.UICtrl));

    }

    pressEnter(event)
    {
        if (event.keyCode === 13 || event.which === 13) {
            this.ctrlAddItem();
        }
    }

    updateBudget()
    {
        // 1. Calculate the budget
        this.budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        var budget = this.budgetCtrl.getBudget();
        
        // 3. Display the budget on the UI
        this.UICtrl.displayBudget(budget);
    }

    updatePercentages()
    {
        // 1. Calculate percentages
        this.budgetCtrl.calculatePercentages();
        
        // 2. Read percentages from the budget controller
        var percentages = this.budgetCtrl.getPercentages();
        
        // 3. Update the UI with the new percentages
        this.UICtrl.displayPercentages(percentages);
    }

    ctrlAddItem()
    {
        var input, newItem;
        
        // 1. Get the field input data
        input = this.UICtrl.getInput();        
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = this.budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            this.UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            this.UICtrl.clearFields();

            // 5. Calculate and update budget
            this.updateBudget();
            
            // 6. Calculate and update percentages
            this.updatePercentages.bind(this);
        }
    }

    ctrlDeleteItem(event)
    {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. delete the item from the data structure
            this.budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete the item from the UI
            this.UICtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget
            this.updateBudget();
            
            // 4. Calculate and update percentages
            this.updatePercentages.bind(this);
        }
    }

    init()
    {
        console.log('The web is starting.');

        this.UICtrl.displayMonth();

        // display the initial/default value of budget object. 
        this.UICtrl.displayBudget({
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: -1
        });

        this.setupEventListeners();
    }

}

var budgetController = new BudgetController();
var uiController = new UIController();
let ctrl = new Controller(budgetController, uiController);
ctrl.init();



// ========================
// youtube iFrame
// ========================


//function playYoutube()
//{
    var tag = document.createElement('script');
    
    //console.log(tag);

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[1];

    //console.log(firstScriptTag);

    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var player;
    function onYouTubeIframeAPIReady() 
    {
        player = new YT.Player('player', 
        {
            height: '390',
            width: '640',
            videoId: 'Zl9kaV3C6yQ',
            events: 
            {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
    });
    }

    // 4. The API will call this function when the video player is ready.
    
    function onPlayerReady(event) 
    {
        //console.log(event);
        event.target.playVideo();
    }

    // 5. The API calls this function when the player's state changes
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) 
    {
        if (event.data == YT.PlayerState.PLAYING && !done) 
        {
            setTimeout(stopVideo, 6000);
            done = true;
        }
    }

    function stopVideo() 
    {
        player.stopVideo();
    }
//}

//playYoutube();
