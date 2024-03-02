//grabs the macro goals for the user
export function GetUserGoals () {
    //console.log("User Goals...")
    //call db using session storage id 

    const user_id = sessionStorage.getItem('loggedInUser');

    let calorieGoal = 2;
    let proteinGoal = 2;
    let carbGoal = 2;
    let fatGoal = 2;

    return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://capstone2024.com/homePage.php?action=GetUserMacroData');
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('useridJSON=' + encodeURIComponent(JSON.stringify(user_id)));
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                // Handle the response from the server
                let responseText = JSON.parse(xhr.responseText);
                calorieGoal = responseText[0].calorie_goal;
                proteinGoal = responseText[0].protein_goal;
                carbGoal = responseText[0].carb_goal;
                fatGoal = responseText[0].fat_goal;

                resolve({calorieGoal, proteinGoal, carbGoal, fatGoal});
            } else {
                reject('Error: ' + xhr.status); // log any errors to the console
            }
        });
    });
}

//gets the foods eaten by the user as well as the amount eaten before returning the actual amount
//of macros eaten
export function GetUserTrackedFood () {

    const user_id = sessionStorage.getItem('loggedInUser');

    return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://capstone2024.com/homePage.php?action=GetTrackedFood');
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('useridJSON=' + encodeURIComponent(JSON.stringify(user_id)));
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                // Handle the response from the server
                //console.log(xhr.responseText);
                let responseText = JSON.parse(xhr.responseText);

                let currentCalories = 0;
                let currentProtein = 0;
                let currentCarbs = 0;
                let currentFat = 0;

                //returns an array of associative arrays where each single element (row) contains an associative array with the following columns
                responseText.forEach(row => {
                    //in here do the gramsEaten/gramsServing 
                    if(row.grams_eaten == 0)
                        row.grams_eaten = 1;

                    let amountEaten = row.grams_eaten / row.grams;

                    if ('calories' in row)
                    {
                        //take that number and multiply it by the following values here, then add them to the circle
                        currentCalories += Math.floor(parseInt(row.calories, 10) * amountEaten);
                        currentProtein += Math.floor(parseInt(row.protein, 10) * amountEaten);
                        currentCarbs += Math.floor(parseInt(row.carbs, 10) * amountEaten);
                        currentFat += Math.floor(parseInt(row.fat, 10) * amountEaten);

                        //console.log("current row= "+row.calories);
                        //console.log("current calories= "+currentCalories);
                    }
                    else
                    {
                        console.log("in the else");
                        //take that number and multiply it by the following values here, then add them to the circle
                        currentCalories += Math.floor(parseInt(row[0].calories, 10) * amountEaten);
                        currentProtein += Math.floor(parseInt(row[0].protein, 10) * amountEaten);
                        currentCarbs += Math.floor(parseInt(row[0].carbs, 10) * amountEaten);
                        currentFat += Math.floor(parseInt(row[0].fat, 10) * amountEaten);
                        console.log("current row= "+amountEaten);
                        console.log("current calories= "+currentCalories);
                    }
                });
                resolve({currentCalories, currentProtein, currentCarbs,  currentFat});

            } else {
                reject('Error: ' + xhr.status); // log any errors to the console
            }
        });
    });
}

//gets the database of all foods the user has access to view
export function GetFoodNames () {
    let user_id = sessionStorage.getItem('loggedInUser');

    return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://capstone2024.com/homePage.php?action=GetFoodNames');
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('useridJSON=' + encodeURIComponent(JSON.stringify(user_id)));
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                //console.log(xhr.responseText);
                let responseText = JSON.parse(xhr.responseText);

                const tempFoodNamesList = [];
                const tempFoodCaloriesList = [];
                const tempFoodProteinList = [];
                const tempFoodCarbsList = [];
                const tempFoodFatList = [];
                const tempFoodGramsList = [];

                responseText.forEach(row => {
                    tempFoodNamesList.push(row.name);
                    tempFoodCaloriesList.push(row.calories);
                    tempFoodProteinList.push(row.protein);
                    tempFoodCarbsList.push(row.carbs);
                    tempFoodFatList.push(row.fat)
                    tempFoodGramsList.push(row.grams)
                });

                resolve({tempFoodNamesList, tempFoodCaloriesList, tempFoodProteinList, tempFoodCarbsList, tempFoodFatList, tempFoodGramsList});
            } else {
                reject('Error: ' + xhr.status); // log any errors to the console
            }
        });
    });
}

//gets all the user generated food
export function GetUserGenFoodNames () {
    let user_id = sessionStorage.getItem('loggedInUser');

    return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://capstone2024.com/homePage.php?action=GetUserGenFoodNames');
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('useridJSON=' + encodeURIComponent(JSON.stringify(user_id)));
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                //console.log(xhr.responseText);
                let responseText = JSON.parse(xhr.responseText);

                const tempFoodNamesList = [];
                const tempFoodCaloriesList = [];
                const tempFoodProteinList = [];
                const tempFoodCarbsList = [];
                const tempFoodFatList = [];
                const tempFoodGramsList = [];

                responseText.forEach(row => {
                    tempFoodNamesList.push(row.name);
                    tempFoodCaloriesList.push(row.calories);
                    tempFoodProteinList.push(row.protein);
                    tempFoodCarbsList.push(row.carbs);
                    tempFoodFatList.push(row.fat)
                    tempFoodGramsList.push(row.grams)
                });

                resolve({tempFoodNamesList, tempFoodCaloriesList, tempFoodProteinList, tempFoodCarbsList, tempFoodFatList, tempFoodGramsList});
            } else {
                reject('Error: ' + xhr.status); // log any errors to the console
            }
        });
    });
}

//gets all the user generated food
export function GetUserGenRecipes () {
    let user_id = sessionStorage.getItem('loggedInUser');

    return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://capstone2024.com/homePage.php?action=GetUserRecipes');
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('useridJSON=' + encodeURIComponent(JSON.stringify(user_id)));
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                //console.log(xhr.responseText);
                let responseText = JSON.parse(xhr.responseText);

                const tempFoodNamesList = [];
                const tempFoodCaloriesList = [];
                const tempFoodProteinList = [];
                const tempFoodCarbsList = [];
                const tempFoodFatList = [];
                const tempFoodGramsList = [];

                responseText.forEach(row => {
                    tempFoodNamesList.push(row.name);
                    tempFoodCaloriesList.push(row.calories);
                    tempFoodProteinList.push(row.protein);
                    tempFoodCarbsList.push(row.carbs);
                    tempFoodFatList.push(row.fat)
                    tempFoodGramsList.push(row.grams)
                });

                resolve({tempFoodNamesList, tempFoodCaloriesList, tempFoodProteinList, tempFoodCarbsList, tempFoodFatList, tempFoodGramsList});
            } else {
                reject('Error: ' + xhr.status); // log any errors to the console
            }
        });
    });
}

export function GetUserRecipeIngredients(recipeName) {
    let user_id = sessionStorage.getItem('loggedInUser');
    console.log(recipeName);
    const data = {user_id, recipeName};

    return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://capstone2024.com/homePage.php?action=GetRecipeIngredients');
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('sentData=' + encodeURIComponent(JSON.stringify(data)));
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                let responseText = JSON.parse(xhr.responseText);

                const tempFoodNamesList = [];
                const tempFoodCaloriesList = [];
                const tempFoodProteinList = [];
                const tempFoodCarbsList = [];
                const tempFoodFatList = [];
                const tempFoodGramsList = [];
                const tempFoodGramsUsedList = [];

                responseText.forEach(row => {
                    tempFoodNamesList.push(row.name);
                    tempFoodCaloriesList.push(row.calories);
                    tempFoodProteinList.push(row.protein);
                    tempFoodCarbsList.push(row.carbs);
                    tempFoodFatList.push(row.fat);
                    tempFoodGramsList.push(row.grams);
                    tempFoodGramsUsedList.push(row.gramsPerIngredient)
                });

                resolve({tempFoodNamesList, tempFoodCaloriesList, tempFoodProteinList, tempFoodCarbsList, tempFoodFatList, tempFoodGramsList, tempFoodGramsUsedList});
            } else {
                reject('Error: ' + xhr.status); // log any errors to the console
            }
        });
    });
}

//takes the  selected food and adds it and the amount eaten to what the user has eaten
export function AddToTrackedFood (foodName, grams) {
        //this will take in an amount as well to send to db
        let user_id = sessionStorage.getItem('loggedInUser');
        //const foodName = "chicken";
        const data = {user_id, foodName, grams};
        //console.log(data);
        return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://capstone2024.com/homePage.php?action=AddFoodToTracker');
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('sentData=' + encodeURIComponent(JSON.stringify(data)));
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                resolve();
            } else {
                reject('Error: ' + xhr.status); // log any errors to the console
            }
        });
    });
}

//takes food data and sends it do database
export function UploadCustomFood(name, grams, calories, protein, carbs, fat){
    let user_id = sessionStorage.getItem('loggedInUser');
    const data = {user_id, name, grams, calories, protein, carbs, fat}
    return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://capstone2024.com/homePage.php?action=UploadCustomFood');
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('sentData=' + encodeURIComponent(JSON.stringify(data)));
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                resolve();
            } else {
                reject('Error: ' + xhr.status); // log any errors to the console
            }
        });
    });
}

//takes new food data and edits and existing line
export function EditCustomFood(oldName, name, grams, calories, protein, carbs, fat){
    let user_id = sessionStorage.getItem('loggedInUser');
    const data = {user_id, oldName, name, grams, calories, protein, carbs, fat}
    return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://capstone2024.com/homePage.php?action=EditFood');
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('sentData=' + encodeURIComponent(JSON.stringify(data)));
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                resolve();
            } else {
                reject('Error: ' + xhr.status); // log any errors to the console
            }
        });
    });
}

export function CheckDate(day, month, year){
    let user_id = sessionStorage.getItem('loggedInUser');
    const data = {user_id, day, month, year}
    return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://capstone2024.com/homePage.php?action=CheckDate');
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('sentData=' + encodeURIComponent(JSON.stringify(data)));
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                resolve();
            } else {
                reject('Error: ' + xhr.status); // log any errors to the console
            }
        });
    });
}

export function DeleteCustomFood(foodName){
    let user_id = sessionStorage.getItem('loggedInUser');
    const data = {user_id, foodName}
    return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://capstone2024.com/homePage.php?action=DeleteCustomFood');
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('sentData=' + encodeURIComponent(JSON.stringify(data)));
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                resolve();
            } else {
                reject('Error: ' + xhr.status); // log any errors to the console
            }
        });
    });
}

export function GetUserHistory(){
    let user_id = sessionStorage.getItem('loggedInUser');
    return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://capstone2024.com/homePage.php?action=GetUserHistory');
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('sentData=' + encodeURIComponent(JSON.stringify(user_id)));
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                let responseText = JSON.parse(xhr.responseText);

                const tempHistoryCalories = [];
                const tempHistoryProtein = [];
                const tempHistoryCarbs = [];
                const tempHistoryFat = [];
                const tempHistoryDay = [];
                const tempHistoryMonth = [];
                const tempHistoryYear = [];

                responseText.forEach(row => {
                    tempHistoryCalories.push(row.calories);
                    tempHistoryProtein.push(row.protein);
                    tempHistoryCarbs.push(row.carbs);
                    tempHistoryFat.push(row.fat);
                    tempHistoryDay.push(row.day)
                    tempHistoryMonth.push(row.month)
                    tempHistoryYear.push(row.year)
                });

                resolve({tempHistoryCalories, tempHistoryProtein, tempHistoryCarbs, tempHistoryFat, tempHistoryDay, tempHistoryMonth, tempHistoryYear});
            } else {
                reject('Error: ' + xhr.status); // log any errors to the console
            }
        });
    });
}

export function GetUserDetails(){
    let user_id = sessionStorage.getItem('loggedInUser');
    return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://capstone2024.com/profilePage.php?action=GetUserDetails');
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('sentData=' + encodeURIComponent(JSON.stringify(user_id)));
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                let responseText = JSON.parse(xhr.responseText);
                console.log(responseText);

                let name = responseText[0].name;
                let email = responseText[0].email;
                let password = responseText[0].password;
                let height = responseText[1].height;
                let weight = responseText[1].weight;
                let age = responseText[1].age;
                let gender = responseText[1].isMale;

                resolve({name, email, password, height, weight, age, gender});
            } else {
                reject('Error: ' + xhr.status); // log any errors to the console
            }
        });
    });
}

export function EditUserDetails(weight, height, age, name, email, password, gender){
    let user_id = sessionStorage.getItem('loggedInUser');
    const data = {user_id, weight, height, age, name, email, password, gender}
    return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://capstone2024.com/profilePage.php?action=EditUserDetails');
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('sentData=' + encodeURIComponent(JSON.stringify(data)));
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                resolve({});
            } else {
                reject('Error: ' + xhr.status); // log any errors to the console
            }
        });
    });
}

export function AddRecipe(recipeName, grams, foodnames, gramsPerIngredient){
    let user_id = sessionStorage.getItem('loggedInUser');
    const data = {user_id, recipeName, grams, foodnames, gramsPerIngredient}
    return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://capstone2024.com/homePage.php?action=AddRecipe');
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('sentData=' + encodeURIComponent(JSON.stringify(data)));
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                resolve({});
            } else {
                reject('Error: ' + xhr.status); // log any errors to the console
            }
        });
    });
}
