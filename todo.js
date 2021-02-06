//Step 1 - Importing the file system module 
const fs = require('fs');

//Step 2 - Declaring a function which prints out the string for help
function printHelp() {
    const help = `Usage :-\n$ ./todo add "todo item"  # Add a new todo\n$ ./todo ls               # Show remaining todos\n$ ./todo del NUMBER       # Delete a todo\n$ ./todo done NUMBER      # Complete a todo\n$ ./todo help             # Show usage\n$ ./todo report           # Statistics`;
    console.log(help);
}

//Step 3 - Write a function which converts the current date in yyyy-mm-dd format
function dateFormat(today) {
    var day = '' + (today.getDate());
    var month = '' + (today.getMonth() + 1);
    var year = today.getFullYear();

    if (month.length < 2) {
        month = '0' + month;      //Adding prefix 0 for months 1 to 9
    }

    if (day.length < 2) {
        day = '0' + day;          //Adding prefix 0 for days 1 to 9
    }

    return [year, month, day].join('-');
}

//Step 4 - Declare path variables and arrays to push tasks in
var todoPath = "./todo.txt";
var donePath = "./done.txt";
var tasks = [];
var done = [];

//Step 5 - Incrementing the task and done count 
if(fs.existsSync(todoPath)){
    let data = fs.readFileSync('todo.txt', 'utf-8').split("\n");
    let j = 0;
    for(var i=0; i<data.length; i++) {
        if(data[i] === "") continue;
        tasks[j] = data[i];
        j++;
    }
}

if(fs.existsSync(donePath)){
    let data = fs.readFileSync('done.txt', 'utf-8').split("\n");
    let j = 0;
    for(let i=0; i<data.length; i++){
        if(data[i] === "") continue;
        done[j] = data[i];
        j++;
    }
}

//Step 6 - Implement a function to add data
function addInputData(data) {
    tasks.push(data);
    fs.appendFileSync(todoPath, data + "\n");
    console.log("Added todo:", `"${data}"`)
}

//Step 7 - Implement a function to remove the item from the array
function deleteData(place) {
    place = Number.parseInt(place);    //Takes the input pos number for input
    if (place > tasks.length || place===0) {
        console.log(`Error: todo #${place} does not exist. Nothing deleted.`);
        return;
    }
    else {
        fs.unlinkSync(todoPath);
        var newTaskArray = [];
        for(var i=0; i<tasks.length; i++) {
            if(place-1 != i) {
                newTaskArray.push(tasks[i]);
                fs.appendFileSync(todoPath, tasks[i] + "\n");
            }
        }
        console.log("Deleted todo #"+place);
        tasks = newTaskArray;
    }
}

//Step 8 - Implement a function to move an item from tasks array to done array when marked done
function moveToDone(place) {
    place = Number.parseInt(place);
    if (place > tasks.length || place===0) {
        console.log(`Error: todo #${place} does not exist. Nothing deleted.`);
        return;
    }
    else {
        fs.appendFileSync(donePath, tasks[place-1]+"\n");
        done.push(tasks[place-1]);
        fs.unlinkSync(todoPath);
        var newTaskArray = [];
           for(var i=0; i<tasks.length; i++){
               if(place-1 != i) {
                   newTaskArray.push(tasks[i]);
                   fs.appendFileSync(todoPath, tasks[i] + "\n");
               }
           }
        }
        console.log("Marked todo #"+place+" as done.");
        tasks = newTaskArray;
    }

//Step 9 - Function to display the full list of tasks
function displayTasks() {
    if(tasks.length === 0) {
        console.log("There are no pending todos!");
        return;
    }
    else {
        for(var i=tasks.length-1; i>=0; i--) {
           if(tasks[i] === "") continue;
           console.log(`[${i+1}] ${tasks[i]}`);
        }
    }
}

//Step 10 - Function to display number of tasks pending and number of tasks done
function showReport() {
    console.log(`${dateFormat(new Date())} Pending : ${tasks.length} Completed : ${done.length}`);
}

//Step 11 - Execution of the user commands using switch case
const argv = process.argv[3];
const arr = process.argv;
const command = process.argv[2];

if(arr.length === 2) {
    printHelp();
}

switch(command) {
    case "help":
        printHelp();
        break;
    
    case "add":
        if(arr.length > 3) {
            addInputData(argv);
        }
        else {
            console.log("Error: Missing todo string. Nothing added!");
        }
        break;

    case "ls":
        displayTasks();
        break;

    case "done":
        if(arr.length>3) {
            moveToDone(argv);
        }
        else {
            console.log("Error: Missing NUMBER for marking todo as done.")
        }
        break;

    case "report":
        showReport();
        break;

    case "del":
        if(arr.length>3) {
            deleteData(argv);
        }
        else {
            console.log("Error: Missing NUMBER for deleting todo.")
        }
        break;

    case "":
        printHelp();
        break;

    //case undefined:
      //  printHelp();
        //break;

    //default:
       // printHelp();
        //break; 
}






