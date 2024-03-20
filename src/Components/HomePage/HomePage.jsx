//import axios from "axios"
import {useEffect, useRef, useState} from "react";
import './HomePage.css';
import { updateCircle, MacroCircle, MicroCircle } from './Circle.jsx';
import { GeneralHeader, RecipeHeader, IngredientsHeader} from "./DataDisaplayer.jsx";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
//import Chart  from './Chart.jsx';
import { useNavigate } from 'react-router-dom';
import { GetUserGoals, GetUserTrackedFood, GetFoodNames, AddToTrackedFood, UploadCustomFood, GetUserGenFoodNames, EditCustomFood, CheckDate, DeleteCustomFood, GetUserHistory, AddRecipe, GetUserGenRecipes, GetUserRecipeIngredients, DeleteUserRecipe, EditUserRecipe } from './DatabaseCalls.jsx';

const HomePage = () => {
    const nav = useNavigate();

    const calorieCanvas = useRef(null);
    const proteinCanvas = useRef(null);
    const carbCanvas = useRef(null);
    const fatCanvas = useRef(null);

    //main circle data
    const [circ, setCirc] = useState(null);
    const [circPercentage, setCircPercentage] = useState(null);
    const [radius, SetRadius] = useState(null);
    
    //smaller circles data
    const [circUnfocused, setCircUnfocused] = useState(null);
    const [radiusUnfocused, SetRadiusUnfocused] = useState(null);

    //percentage of smaller circles filled by each macro
    const [circPercentageProtein, setCircPercentageProtein] = useState(null);
    const [circPercentageFat, setCircPercentageFat] = useState(null);
    const [circPercentageCarbs, setCircPercentageCarbs] = useState(null);

    //macro goals for user
    const[macroGoals, setMacroGoals] = useState(1);

    //current macro data for  user
    const[currentTrackedMacros, setCurrentTrackedMacros] = useState(0);

    //states for menu selection
    const[viewFoods, setViewFoods] = useState(false);
    const[addCustomFoods, setAddCustomFoods] = useState(false);
    const[enteringAmount, setEnteringAmount] = useState(false);
    const[editingAmount, setEditingAmount] = useState(false);
    const[viewHome, setViewHome] = useState(true);
    const[myFoods, setMyFoods] = useState(false);
    const[editCustomFoods, setEditCustomFoods] = useState(false);
    const[viewHistory, setViewHistory] = useState(false);
    const[addRecipe, setAddRecipe] = useState(false);
    const[editRecipe, setEditRecipe] = useState(false);
    const[addFoodtoRecipe, setAddFoodtoRecipe] = useState(false);
    const[enteringAmountForRecipe, setEnteringAmountForRecipe] = useState(false);

    //arrays of food information for displaying the database
    const[foodDatabase, setFoodDatabase] = useState([]);

    const[editingRecipePipe, setEditingRecipePipe] = useState(false);

    //const[historyData, setHistoryData] = useState();
    const [historyData, setHistoryData] = useState();

    const [trackables, setTrackables] = useState([{
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    }]);
    
    //arrays of food information for displaying the recipe
    const[recipeData, setRecipeData] = useState([{
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        grams: 0,
        name: "",
        gramsUsed: 0
    }]);

    //arrays of food only from user generatedFood
    const[UGFoodDatabase, setUGFoodDatabase] = useState([{
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        grams: 0,
        name: "",
    }])

    //array of recipes
    const[UGRFoodDatabase, setUGRFoodDatabase] = useState([{
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        grams: 0,
        name: "",
    }])

    //storing the history user's tracked macros
    const[proteinHistory, setProteinHistory] = useState([]);
    const[caloriesHistory, setCaloriesHistory] = useState([]);
    const[carbsHistory, setCarbsHistory] = useState([]);
    const[fatHistory, setFatHistory] = useState([]);
    const[dayHistory, setDayHistory] = useState([]);
    const[monthHistory, setMonthHistory] = useState([]);
    const[yearHistory, setYearHistory] = useState([]);

    //used for storing/sending the custom food data that user enters to database
    const[customUserData, setCustomUserData] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        name: "",
        grams: 0});

    //used when user inputting how much food was eaten + keeping track of what food was selected
    const[grams, setGrams] = useState(0);
    const[currentMacros, setCurrentMacros] = useState([{
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        grams: 0
    }]);


    const[selectedFoodName, setSelectedFoodName] = useState("");
    const[selectedRecipeName, setSelectedRecipeName] = useState("");

    const[globalIndex, setGlobalIndex] = useState(0);

    useEffect (() => {
        //console.log("On Page Load...");
        let today = new Date();
        let month = today.getMonth()+1;
        let year = today.getFullYear();
        let day = today.getDate();

        let combinedData = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            name: "",
            grams: 0
        }

        setCustomUserData(combinedData)

        CheckDate(day, month, year).then(() => {
            UpdateFoodLists();

            GetUserGoals().then((goals) => {
                //womp2
                setMacroGoals(goals);
                const trackData = {
                    calories: goals.trackCals,
                    protein: goals.trackPro,
                    carbs: goals.trackCar,
                    fat: goals.trackFat
                }

                setTrackables(trackData);
            });
            GetUserTrackedFood().then((macros) => {
                const renameData = {
                    calories: macros.currentCalories,
                    protein: macros.currentProtein,
                    carbs: macros.currentCarbs,
                    fat: macros.currentFat
                }
                //console.log(renameData);
                setCurrentTrackedMacros(renameData);
                });
            });
    }, []);

    useEffect (() => {
        //console.log("Updating Circles...");
        if(viewHome)
            UpdateCircles();
    }, [currentTrackedMacros, viewHome]); //<- causes this useEffect to get run whenever either of these variables in updated
        
    const updateCalorieCircle = (svgCanvas) => {
        //console.log("updating calorie circle")
        const {newRad, newCirc, newCircPercent} = updateCircle(svgCanvas, 0.85, currentTrackedMacros.calories, macroGoals.calorieGoal);//responseText[0].calorie_goal))
        
        //set all those values to "global" variables
        if(trackables.calories == 2)
        {
            SetRadius(newRad);
            setCirc(newCirc);
        }
        else
        {
            SetRadiusUnfocused(newRad);
            setCircUnfocused(newCirc);
        }
        setCircPercentage(newCircPercent);
    };

    const updateProteinCircle = (svgCanvas) =>{
        //all the unfocused circles are the same size as this one so it sets the radius and circumferences they all use
        //but their own functions return the percentage of the circle that is filled by them
        const {newRad, newCirc, newCircPercent} = updateCircle(svgCanvas, 0.85, currentTrackedMacros.protein, macroGoals.proteinGoal)

        //set all those values to "global" variables
        if(trackables.protein == 2)
        {
            SetRadius(newRad);
            setCirc(newCirc);
        }
        else
        {
            SetRadiusUnfocused(newRad);
            setCircUnfocused(newCirc);
        }
        setCircPercentageProtein(newCircPercent);
    };

    const updateFatCircle = (svgCanvas) =>{
        const {newRad, newCirc, newCircPercent} = updateCircle(svgCanvas, 0.85, currentTrackedMacros.fat, macroGoals.fatGoal)

        //set all those values to "global" variables
        if(trackables.fat == 2)
        {
            SetRadius(newRad);
            setCirc(newCirc);
        }
        else
        {
            SetRadiusUnfocused(newRad);
            setCircUnfocused(newCirc);
        }
        setCircPercentageFat(newCircPercent);
    };

    const updateCarbCircle = (svgCanvas) =>{
        const {newRad, newCirc, newCircPercent} = updateCircle(svgCanvas, 0.85, currentTrackedMacros.carbs, macroGoals.carbGoal)

        //set all those values to "global" variables
        if(trackables.carbs == 2)
        {
            SetRadius(newRad);
            setCirc(newCirc);
        }
        else
        {
            SetRadiusUnfocused(newRad);
            setCircUnfocused(newCirc);
        }
        setCircPercentageCarbs(newCircPercent);
    };

    const UpdateCircles = () =>{
        console.log(currentTrackedMacros.currentCalories)
        if(calorieCanvas.current)
            updateCalorieCircle(calorieCanvas.current);
        if(proteinCanvas.current)
            updateProteinCircle(proteinCanvas.current);
        if(carbCanvas.current)
            updateCarbCircle(carbCanvas.current);
        if(fatCanvas.current)
            updateFatCircle(fatCanvas.current);
    };
    
    window.addEventListener("resize", UpdateCircles);

    function resetCustomValues() {
        
        let combinedData = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            name: "",
            grams: 0
        }

        setCustomUserData(combinedData)

        setRecipeData([]);
    }

    function FoodSelected() { 
        //add to tracked food
        AddToTrackedFood(selectedFoodName, grams).then(() => {
            //once added get the tracked food information
            GetUserTrackedFood().then((macros) => {
                //this  data isnt doing anything but it ensures updatecircles gets called at the right time
                const renameData = {
                    calories: macros.currentCalories,
                    protein: macros.currentProtein,
                    carbs: macros.currentCarbs,
                    fat: macros.currentFat
                }
                console.log(renameData);
                setCurrentTrackedMacros(renameData);
                setViewFoods(false);
                setEnteringAmount(false);
                setViewHome(true);
            });
        });
    }

    function RecipeIngredientsLogic()
    {
        let tempNam = [];
        let tempGra = [];
        let tempGraUsed = [];
        let tempCals = [];
        let tempPro = [];
        let tempCar = [];
        let tempFat = [];

        let totalGrams = parseInt(customUserData.grams, 10) + parseInt(grams, 10);
        
        let calories = parseInt(currentMacros.calories  * (grams/currentMacros.grams), 10)
        let totalCals = parseInt(customUserData.calories, 10) + calories;

        let protein = parseInt(currentMacros.protein  * (grams/currentMacros.grams), 10)
        let totalPro = parseInt(customUserData.protein, 10) + protein;

        let carb = parseInt(currentMacros.carbs  * (grams/currentMacros.grams), 10)
        let totalCar = parseInt(customUserData.carbs, 10) + carb;

        let fat = parseInt(currentMacros.fat  * (grams/currentMacros.grams), 10)
        let totalFat = parseInt(customUserData.fat, 10) + fat;

        const combinedData2 ={
            calories: totalCals,
            protein: totalPro,
            carbs: totalCar,
            fat: totalFat,
            grams: totalGrams,
            name: customUserData.name
        };

        setCustomUserData(combinedData2);

        tempNam = recipeData.map(item => item.name);
        tempGra = recipeData.map(item => item.grams);
        tempGraUsed = recipeData.map(item => item.gramsUsed);
        tempCals = recipeData.map(item => item.calories);
        tempPro = recipeData.map(item => item.protein);
        tempCar = recipeData.map(item => item.carbs);
        tempFat = recipeData.map(item => item.fat);

        tempNam.push(selectedFoodName);
        tempGra.push(grams);
        tempGraUsed.push(grams);
        tempCals.push(calories);
        tempPro.push(protein);
        tempCar.push(carb)
        tempFat.push(fat)

        const combinedData = tempCals.map((calories, index) => ({
            calories,
            protein: tempPro[index],
            carbs: tempCar[index],
            fat: tempFat[index],
            grams: tempGra[index],
            name: tempNam[index],
            gramsUsed: tempGraUsed[index]
        }));

        setRecipeData(combinedData);
    }

    function FoodSelectedForRecipe(){
        RecipeIngredientsLogic();
        setEnteringAmountForRecipe(false);
        if (!editingRecipePipe)
            setAddRecipe(true); //need to setEditRecipe(true);
        else
            setEditRecipe(true);
    }

    function SetFoodSelectedData(foodname, index) {
        setSelectedFoodName(foodname);
        setGrams(foodDatabase[index].grams);

        let tempArray = [];
        tempArray.push(foodDatabase[index].calories);
        tempArray.push(foodDatabase[index].protein);
        tempArray.push(foodDatabase[index].carbs);
        tempArray.push(foodDatabase[index].fat);
        tempArray.push(foodDatabase[index].grams);

        const combinedData ={
            calories: foodDatabase[index].calories,
            protein: foodDatabase[index].protein,
            carbs: foodDatabase[index].carbs,
            fat: foodDatabase[index].fat,
            grams: foodDatabase[index].grams,
        };

        setCurrentMacros(combinedData);

        if(viewFoods)
        {
            setViewFoods(false);
            setEnteringAmount(true);
        }
        else{
            setAddFoodtoRecipe(false);
            setEnteringAmountForRecipe(true);
        }
    }

    function EditFoodInRecipes(index)
    {
        console.log("edit recipe");
        setGlobalIndex(index);
        setSelectedFoodName(recipeData[index.name])
        setGrams(recipeData[index].gramsUsed);
        setCurrentMacros({
            calories: recipeData[index].calories,
            protein: recipeData[index].protein,
            carbs: recipeData[index].carbs,
            fat: recipeData[index].fat,
            grams: recipeData[index].grams
        })

        setCustomUserData({
            name: customUserData.name,
            grams: customUserData.grams - recipeData[index].gramsUsed,
            calories: customUserData.calories - recipeData[index].calories,
            protein: customUserData.protein - recipeData[index].protein,
            carbs: customUserData.carbs - recipeData[index].carbs,
            fat: customUserData.fat - recipeData[index].fat
        })

        if(editRecipe)
            setEditingRecipePipe(true);
        else
            setEditingRecipePipe(false);

        setEditRecipe(false);
        setAddRecipe(false);
        setEditingAmount(true);
    }

    function DeleteRecipeIngredient()
    {
        console.log("delete recipe ingredient")
        const updatedRecipeData = recipeData;
        
        updatedRecipeData.splice(globalIndex, 1);

        setRecipeData(updatedRecipeData);

        if(editingRecipePipe)
            setEditRecipe(true);
        else    
            setAddRecipe(true);

        setEditingAmount(false);
    }

    function UpdateRecipeIngredients()
    {
        console.log("update recipe")
        const updatedRecipeData = recipeData;

        let totalGrams = parseInt(customUserData.grams, 10) + parseInt(grams, 10);
        
        let calories = parseInt(currentMacros.calories  * (grams/currentMacros.grams), 10)
        let totalCals = parseInt(customUserData.calories, 10) + calories;

        let protein = parseInt(currentMacros.protein  * (grams/currentMacros.grams), 10)
        let totalPro = parseInt(customUserData.protein, 10) + protein;

        let carb = parseInt(currentMacros.carbs  * (grams/currentMacros.grams), 10)
        let totalCar = parseInt(customUserData.carbs, 10) + carb;

        let fat = parseInt(currentMacros.fat  * (grams/currentMacros.grams), 10)
        let totalFat = parseInt(customUserData.fat, 10) + fat;
        
        updatedRecipeData[globalIndex].calories = calories;
        updatedRecipeData[globalIndex].protein = protein;
        updatedRecipeData[globalIndex].carbs = carb;
        updatedRecipeData[globalIndex].fat = fat;
        updatedRecipeData[globalIndex].gramsUsed = grams;

        setRecipeData(updatedRecipeData);

        setCustomUserData({
            name: customUserData.name,
            grams: totalGrams,
            calories: totalCals,
            protein: totalPro,
            carbs: totalCar,
            fat: totalFat
        })


        if(editingRecipePipe)
            setEditRecipe(true);
        else    
            setAddRecipe(true);

        setEditingAmount(false);
    }

    function EditFood(foodname, index){
        setSelectedFoodName(foodname);
        setGrams(UGFoodDatabase[index].grams);

        const combinedData ={
            calories: UGFoodDatabase[index].calories,
            protein: UGFoodDatabase[index].protein,
            carbs: UGFoodDatabase[index].carbs,
            fat: UGFoodDatabase[index].fat,
            grams: UGFoodDatabase[index].grams,
            name: foodname
        };

        setCustomUserData(combinedData);

        setMyFoods(false);
        setEditCustomFoods(true);
    }

    function EditRecipe(foodname){
        resetCustomValues();

        setSelectedRecipeName(foodname);

        GetUserRecipeIngredients(foodname).then((foods) => {
            const combinedData = foods.tempFoodCaloriesList.map((calories, index) => ({
                calories,
                protein: foods.tempFoodProteinList[index],
                carbs: foods.tempFoodCarbsList[index],
                fat: foods.tempFoodFatList[index],
                grams: foods.tempFoodGramsList[index],
                name: foods.tempFoodNamesList[index],
                gramsUsed: foods.tempFoodGramsUsedList[index]
            }));

            let totalGrams = 0;
            let totalCals = 0;
            let totalPro = 0;
            let totalCarbs = 0;
            let totalFat = 0;

            for (const food of combinedData) 
            {
                totalGrams += parseInt(food.gramsUsed, 10);
                totalCals += parseInt(food.calories, 10);
                totalPro += parseInt(food.protein, 10);
                totalCarbs += parseInt(food.carbs, 10);
                totalFat += parseInt(food.fat, 10);
            }

            const combinedData2 ={
                calories: totalCals,
                protein: totalPro,
                carbs: totalCarbs,
                fat: totalFat,
                grams: totalGrams,
                name: foodname
            };

            setCustomUserData(combinedData2);

            console.log(combinedData);

            setRecipeData(combinedData)
        });

        setMyFoods(false);
        setEditRecipe(true);
    }

    function AmountToViewing() {
        setViewFoods(true);
        setEnteringAmount(false);
    }

    function AmountToViewingRecipe(){
        setAddFoodtoRecipe(true);
        setEnteringAmountForRecipe(false);
    }

    function HomeToViewFood(value) {
        setViewHome(!value);
        setViewFoods(value);
    }

    function myFoodToViewFood(value) {
        setViewFoods(value);
        setMyFoods(!value);
    }

    function AddCustomFoodToMyFood(value) {
        setAddCustomFoods(!value);
        setMyFoods(value);
        resetCustomValues();
    }

    function MyFoodToAddCustomFood(value){
        setAddCustomFoods(value);
        setMyFoods(!value);
    }

    function AddRecipeToAddFoodToRecipe(value, editingPipeline=false)
    {
        GetFoodNames(false).then((foods) => {
            const combinedData = foods.tempFoodCaloriesList.map((calories, index) => ({
                calories,
                protein: foods.tempFoodProteinList[index],
                carbs: foods.tempFoodCarbsList[index],
                fat: foods.tempFoodFatList[index],
                grams: foods.tempFoodGramsList[index],
                name: foods.tempFoodNamesList[index],
            }));
            setFoodDatabase(combinedData);

            setEditingRecipePipe(editingPipeline);
            setAddFoodtoRecipe(value);
            setEditRecipe(!value);
            setAddRecipe(!value);
        });
    }

    function HomeToHistory(value){
        if(value)
        {  
            GetUserHistory().then((history) =>{
                console.log("DEBUG ",history.tempHistoryCalories);

                setCaloriesHistory(history.tempHistoryCalories.reverse());
                setProteinHistory(history.tempHistoryProtein.reverse());
                setCarbsHistory(history.tempHistoryCarbs.reverse());
                setFatHistory(history.tempHistoryFat.reverse());
                setDayHistory(history.tempHistoryDay.reverse());
                setMonthHistory(history.tempHistoryMonth.reverse());
                setYearHistory(history.tempHistoryYear.reverse());
            });

            console.log("DEBUG ",caloriesHistory);

            //setViewHistory(value);
            //setViewHome(!value);
        }
        else
        {
            setViewHistory(value);
            setViewHome(!value);
        }
    }

    function ViewCaloriesHistory()
    {
        if(yearHistory[0]!=null)
        {
            const date = monthHistory.map((_, index) => {
                return (monthHistory[index]+"/"+dayHistory[index]+"/"+yearHistory[index])
            });

            //console.log(date);
        
            const data = {
            labels: date,
            datasets: [
                {
                label: 'Calories History',
                data: caloriesHistory.map((_, index) => parseInt(caloriesHistory[index],10)),
                backgroundColor: 'rgba(64, 179, 70, 1)',
                }
                ],
            };
            //console.log(data);
            setHistoryData(data);
        }
    }

    function ViewProteinHistory()
    {
        if(yearHistory[0]!=null)
        {
            const date = monthHistory.map((_, index) => {
                return (monthHistory[index]+"/"+dayHistory[index]+"/"+yearHistory[index])
            });

            //console.log(date);
        
            const data = {
            labels: date,
            datasets: [
                {
                label: 'Protein History',
                data: proteinHistory.map((_, index) => parseInt(proteinHistory[index],10)),
                backgroundColor: 'rgba(64, 179, 70, 1)',
                }
                ]
            };
            //console.log(data);
            setHistoryData(data);
        }
    }

    function ViewCarbHistory()
    {
        if(yearHistory[0]!=null)
        {
            const date = monthHistory.map((_, index) => {
                return (monthHistory[index]+"/"+dayHistory[index]+"/"+yearHistory[index])
            });

            //console.log(date);
        
            const data = {
            labels: date,
            datasets: [
                {
                label: 'Carbs History',
                data: carbsHistory.map((_, index) => parseInt(carbsHistory[index],10)),
                backgroundColor: 'rgba(64, 179, 70, 1)',
                }
                ]
            };
            //console.log(data);
            setHistoryData(data);
        }
    }

    function ViewFatHistory()
    {
        if(yearHistory[0]!=null)
        {
            const date = monthHistory.map((_, index) => {
                return (monthHistory[index]+"/"+dayHistory[index]+"/"+yearHistory[index])
            });

            //console.log(date);
        
            const data = {
            labels: date,
            datasets: [
                {
                label: 'Fat History',
                data: fatHistory.map((_, index) => parseInt(fatHistory[index],10)),
                backgroundColor: 'rgba(64, 179, 70, 1)',
                }
                ]
            };
            //console.log(data);
            setHistoryData(data);
        }
    }

    useEffect(() =>{
        ViewCaloriesHistory();
    }, [yearHistory]);

    useEffect(() =>{
        if (historyData!=null)
        {
            //console.log(historyData);
            setViewHistory(true);
            setViewHome(false);
        }
    }, [historyData]);

    function UpdateFoodLists(){
        GetFoodNames(true).then((foods) => {
            const combinedData = foods.tempFoodCaloriesList.map((calories, index) => ({
                calories,
                protein: foods.tempFoodProteinList[index],
                carbs: foods.tempFoodCarbsList[index],
                fat: foods.tempFoodFatList[index],
                grams: foods.tempFoodGramsList[index],
                name: foods.tempFoodNamesList[index],
            }));

            setFoodDatabase(combinedData);
        });

        GetUserGenFoodNames().then((foods) => {
            const combinedData = foods.tempFoodCaloriesList.map((calories, index) => ({
                calories,
                protein: foods.tempFoodProteinList[index],
                carbs: foods.tempFoodCarbsList[index],
                fat: foods.tempFoodFatList[index],
                grams: foods.tempFoodGramsList[index],
                name: foods.tempFoodNamesList[index],
            }));

            setUGFoodDatabase(combinedData);

        })

        GetUserGenRecipes().then((foods) => {
            const combinedData = foods.tempFoodCaloriesList.map((calories, index) => ({
                calories,
                protein: foods.tempFoodProteinList[index],
                carbs: foods.tempFoodCarbsList[index],
                fat: foods.tempFoodFatList[index],
                grams: foods.tempFoodGramsList[index],
                name: foods.tempFoodNamesList[index],
            }));

            setUGRFoodDatabase(combinedData);
        })
    }


    function AddCustomFoodToHome() {
        //console.log("upload");
        UploadCustomFood(customUserData.name, customUserData.grams, customUserData.calories, customUserData.protein, customUserData.carbs, customUserData.fat).then(() => {
            UpdateFoodLists();
        });
        setAddCustomFoods(false);
        setViewHome(true);
        resetCustomValues();
    }

    function AddRecipeToHome(){
        let totalGrams = 0;

        for (const food of recipeData) 
            totalGrams += parseInt(food.gramsUsed, 10);

        let foodsInRecipe = recipeData.map(item => item.name);
        let gramsPerIngredient = recipeData.map(item => item.gramsUsed);

        AddRecipe(customUserData.name, totalGrams, foodsInRecipe, gramsPerIngredient);
        UpdateFoodLists();
        setAddRecipe(false);
        setViewHome(true);
    }

    function EditRecipeToMyFoods(){
        let totalGrams = 0;

        for (const food of recipeData) 
            totalGrams += parseInt(food.gramsUsed, 10);

        let foodsInRecipe = recipeData.map(item => item.name);
        let gramsPerIngredient = recipeData.map(item => item.gramsUsed);

        //console.log(selectedRecipeName +" -> "+ customUserData.name)
        EditUserRecipe(selectedRecipeName, customUserData.name, totalGrams, foodsInRecipe, gramsPerIngredient).then(() =>{
            UpdateFoodLists();
            setEditRecipe(false);
            setMyFoods(true);
        });
    }

    function SendEditFoodData (){
        EditCustomFood(selectedFoodName, customUserData.name, customUserData.grams, customUserData.calories, customUserData.protein, customUserData.carbs, customUserData.fat).then(() => {
            UpdateFoodLists();
            GetUserTrackedFood().then((macros) => {
                const renameData = {
                    calories: macros.currentCalories,
                    protein: macros.currentProtein,
                    carbs: macros.currentCarbs,
                    fat: macros.currentFat
                }
                console.log(renameData);
                setCurrentTrackedMacros(renameData);
                setEditCustomFoods(false);
                setMyFoods(true);
                resetCustomValues();
            });
        });
    }

    function DeleteFood(){
        DeleteCustomFood(selectedFoodName).then(() =>{
            UpdateFoodLists();
            setMyFoods(true);
            setEditCustomFoods(false);
        });
    }

    function DeleteRecipe(){
        DeleteUserRecipe(selectedFoodName).then(() =>{
            UpdateFoodLists();
            setMyFoods(true);
            setEditRecipe(false);
        });
    }

    function EditFoodToMyFood(value) {
        setMyFoods(value);
        setEditCustomFoods(!value);

        resetCustomValues()
    }

    function myFoodsToRecipe(value)
    {
        setMyFoods(!value);
        setAddRecipe(value);
        resetCustomValues();
    }

    function myFoodToEditRecipe(value)
    {
        setMyFoods(!value);
        setEditRecipe(value);
        setAddRecipe(value);
        resetCustomValues();
    }

    function ToProfile()
    {
        nav('/ProfilePage');
    }

    return (
        <div className='container_home'>
            <div className="background"></div>
            {viewHome===true?
                <div className="horizontal_buttons">
                    <div className="button" onClick={()=>{HomeToViewFood(true);}}>Add Food</div>
                    <div className="button" onClick={()=>{ToProfile();}}>Profile</div>
                    <div className="button" onClick={()=>{HomeToHistory(true);}}>History</div>
                </div>
                :<div></div>}
                {/* HOME SCREEN WHERE MACRO CIRCLES ARE DISPLAYED*/} 
            <div className='display_window'>
                {viewHome===false?<div></div>:
                    <div className='focused_window'>
                    {trackables.calories===2?
                        
                        <svg ref={calorieCanvas} className='focused_circle'>
                        <MacroCircle ref={calorieCanvas}
                            radius={radius}
                            circ={circ}
                            circPercentage={circPercentage}
                            currentTrackedMacros={currentTrackedMacros.calories}
                            macroGoals={macroGoals.calorieGoal}
                            color="blue"
                        />
                        </svg>:<div></div>}

                    {trackables.protein===2?
                        <svg ref={proteinCanvas} className='focused_circle'>
                        <MacroCircle ref={proteinCanvas}
                            radius={radius}
                            circ={circ}
                            circPercentage={circPercentageProtein}
                            currentTrackedMacros={currentTrackedMacros.protein}
                            macroGoals={macroGoals.proteinGoal}
                            color="green"
                        />
                        <div>Protein</div>
                        </svg>:<div></div>}

                    {trackables.carbs===2?
                    <svg ref={carbCanvas} className='focused_circle'>
                    <MacroCircle ref={carbCanvas}
                        radius={radius}
                        circ={circ}
                        circPercentage={circPercentageCarbs}
                        currentTrackedMacros={currentTrackedMacros.carbs}
                        macroGoals={macroGoals.carbGoal}
                        color="red"
                    />
                    </svg>:<div></div>}

                    {trackables.fat===2?
                    <svg ref={fatCanvas} className='focused_circle'>
                    <MacroCircle ref={fatCanvas}
                        radius={radius}
                        circ={circ}
                        circPercentage={circPercentageFat}
                        currentTrackedMacros={currentTrackedMacros.fat}
                        macroGoals={macroGoals.fatGoal}
                        color="yellow"
                    />
                    </svg>:<div></div>}
                    </div> 
                }
                {viewHome===false?<div></div>: 
                <div className='unfocused_window'>
                    {trackables.calories===1?
                    <svg ref={calorieCanvas} className='unfocused_square'>
                        <MicroCircle
                            radius={radiusUnfocused}
                            circ={circUnfocused}
                            circPercentage={circPercentage}
                            currentTrackedMacros={currentTrackedMacros.calories}
                            macroGoals={macroGoals.calorieGoal}
                            color="blue"
                        />
                    </svg>:<div></div>}

                    {trackables.protein===1?
                    <svg ref={proteinCanvas} className='unfocused_square'>
                        <MicroCircle
                            radius={radiusUnfocused}
                            circ={circUnfocused}
                            circPercentage={circPercentageProtein}
                            currentTrackedMacros={currentTrackedMacros.protein}
                            macroGoals={macroGoals.proteinGoal}
                            color="green"
                        />
                    </svg>:<div></div>}

                    {trackables.carbs===1?
                    <svg ref={carbCanvas} className='unfocused_square'>
                        <MicroCircle
                            radius={radiusUnfocused}
                            circ={circUnfocused}
                            circPercentage={circPercentageCarbs}
                            currentTrackedMacros={currentTrackedMacros.carbs}
                            macroGoals={macroGoals.carbGoal}
                            color="red"
                        />
                    </svg>:<div></div>}

                    {trackables.fat===1?
                    <svg ref={fatCanvas} className='unfocused_square'>
                        <MicroCircle
                            radius={radiusUnfocused}
                            circ={circUnfocused}
                            circPercentage={circPercentageFat}
                            currentTrackedMacros={currentTrackedMacros.fat}
                            macroGoals={macroGoals.fatGoal}
                            color="yellow"
                        />
                    </svg>:<div></div>
                    }
                </div>}
            </div> {/* SHOW LIST OF ALL FOODS USER HAS ACCESS TO IN DATABASE FOR EITHER ADDING FOOD TO TRACKER OR ADDING TO RECIPE*/}
            {viewFoods===false && addFoodtoRecipe===false?<div></div>: //hidden when viewFoods is false
            <div className="vertical_menu"> 
                {viewFoods===true?
                    <div className="horizontal_buttons">
                        <div className="button" onClick={()=>{HomeToViewFood(false);}}>Back</div>
                        <div className="button" style={{fontSize:"15px"}} onClick={()=>{myFoodToViewFood(false);}}>My Foods</div>
                    </div>
                    :<div></div>}
                {addFoodtoRecipe===true?
                    <div className="button beside" onClick={()=>AddRecipeToAddFoodToRecipe(false)}>Back</div>
                    :<div></div>}

                <GeneralHeader/>
                <div className="scrollable">
                    {foodDatabase.map((foodItem, index) => (
                    <div key={index} onClick={() => SetFoodSelectedData(foodItem.name, index)} className="foods_in_menu body hoverable">
                        <div className="name">{foodItem.name}</div>
                        <div className="macro">{foodItem.grams}</div>
                        <div className="macro">{foodItem.calories}</div>
                        <div className="macro">{foodItem.protein}</div>
                        <div className="macro">{foodItem.carbs}</div>
                        <div className="macro">{foodItem.fat}</div>
                    </div>
                    ))}
                </div>
            </div>
            } {/* THE SCREEN WHERE USER INPUTS THE AMOUNT OF GRAMS THEY ATE OF THE FOOD THEY SELECTED */}
            {enteringAmount===false && enteringAmountForRecipe===false && editingAmount===false?<div></div>:
                <div className="inputAmount">
                    <div>
                        <div className="foods_in_menu">
                            <div className="selected">Calories</div>
                            <div className="selected">Protein</div>
                            <div className="selected">Carbs</div>
                            <div className="selected">Fat</div>
                        </div>
                        <div className="foods_in_menu body">
                            <div className="selected">{Math.floor((currentMacros.calories) * (grams/currentMacros.grams))}</div>
                            <div className="selected">{Math.floor((currentMacros.protein) * (grams/currentMacros.grams))}</div>
                            <div className="selected">{Math.floor((currentMacros.carbs) * (grams/currentMacros.grams))}</div>
                            <div className="selected">{Math.floor((currentMacros.fat) * (grams/currentMacros.grams))}</div>
                        </div>
                    </div>
                    <div className="text">
                        Input the Amount of Grams Eaten
                    </div>
                    <div className="textbox">
                        <input type="int" placeholder="Standard Serving In Grams:"
                        required
                        value={grams}
                        onChange={(e)=>setGrams(e.target.value)}/>
                    </div>
                    {enteringAmountForRecipe===true?
                    <div className="horizontal_buttons">
                        <div className="button beside" onClick={()=>FoodSelectedForRecipe()}>Confirm</div>
                        <div className="button beside" onClick={()=>AmountToViewingRecipe()}>Back</div>
                    </div>:
                    enteringAmount===true?
                    <div className="horizontal_buttons"> 
                        <div className="button beside" onClick={()=>FoodSelected()}>Confirm</div>
                        <div className="button beside" onClick={()=>AmountToViewing()}>Back</div>
                    </div>:
                        <div className="horizontal_buttons">
                        <div className="button beside" onClick={()=>UpdateRecipeIngredients()}>Confirm</div>
                        <div className="button beside delete" onClick={()=>DeleteRecipeIngredient()}>Delete</div>
                        {/*<div className="button beside" onClick={()=>AmountToViewing()}>Back</div>*/}
                    </div>
                    }
                </div>
            } {/* USER ADDING FOOD TO DATABASE*/}
            {addCustomFoods===false?<div></div>:
                <div className="inputAmount">
                    <GeneralHeader/>
                    <div className="foods_in_menu body">
                        <div className="name">
                            <input type="string" placeholder="Name"
                            required
                            value={customUserData.name}
                            onChange={(e)=>setCustomUserData({...customUserData, name: e.target.value})}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Grams"
                            required
                            value={customUserData.grams}
                            onChange={(e)=>setCustomUserData({...customUserData, grams: e.target.value})}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Calories"
                            required
                            value={customUserData.calories}
                            onChange={(e)=>setCustomUserData({...customUserData, calories: e.target.value})}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Protein"
                            required
                            value={customUserData.protein}
                            onChange={(e)=>setCustomUserData({...customUserData, protein: e.target.value})}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Carbs"
                            required
                            value={customUserData.carbs}
                            onChange={(e)=>setCustomUserData({...customUserData, carbs: e.target.value})}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Fat"
                            required
                            value={customUserData.fat}
                            onChange={(e)=>setCustomUserData({...customUserData, fat: e.target.value})}/>
                        </div>
                    </div>
                    <div className="horizontal_buttons">
                        <div className="button beside" onClick={()=>AddCustomFoodToHome()}>Confirm</div>
                        <div className="button beside" onClick={()=>AddCustomFoodToMyFood(true)}>Back</div>
                    </div>
                </div>
            }{/* USER LOOKING AT ALL THEIR FOODS IN DB WITH OPTION TO EDIT OR ADD*/}
            {myFoods===false?<div></div>:
                <div>
                    <div className="vertical_menu">
                        <div className="horizontal_buttons">
                            <div className="button" onClick={()=>{myFoodToViewFood(true);}}>Back</div>
                            <div className="button" style={{fontSize:"17px"}} onClick={()=>{MyFoodToAddCustomFood(true);}}>Add Food</div>
                            <div className="button" style={{fontSize:"17px"}} onClick={()=>{myFoodsToRecipe(true);}}>Add Recipe</div>
                        </div>
                        <GeneralHeader/>
                        <div className="scrollable">
                        {UGFoodDatabase.map((foodItem, index) => (
                        <div key={index} onClick={() => EditFood(foodItem.name, index)} className="foods_in_menu body hoverable">
                            <div className="name">{foodItem.name}</div>
                            <div className="macro">{foodItem.grams}</div>
                            <div className="macro">{foodItem.calories}</div>
                            <div className="macro">{foodItem.protein}</div>
                            <div className="macro">{foodItem.carbs}</div>
                            <div className="macro">{foodItem.fat}</div>
                        </div>
                        ))}
                    </div>
                    </div>
                    <div style={{paddingBottom: "8%"}}></div>
                    <div className="vertical_menu">
                        <RecipeHeader/>
                        <div className="scrollable">
                        {UGRFoodDatabase.map((foodItem, index) => (
                            <div key={index} onClick={() => EditRecipe(foodItem.name, index)} className="foods_in_menu body hoverable">
                                <div className="name">{foodItem.name}</div>
                                <div className="macro">{foodItem.grams}</div>
                                <div className="macro">{foodItem.calories}</div>
                                <div className="macro">{foodItem.protein}</div>
                                <div className="macro">{foodItem.carbs}</div>
                                <div className="macro">{foodItem.fat}</div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            }
            {/* USER EDITING OR DELETING CUSTOM FOODS*/}
            {editCustomFoods===false?<div></div>:
                <div className="inputAmount">
                    <GeneralHeader/>
                    <div className="foods_in_menu body">
                        <div className="name">
                            <input type="string" placeholder="Name"
                            required
                            value={customUserData.name}
                            onChange={(e)=>setCustomUserData({...customUserData, name: e.target.value})}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Grams"
                            required
                            value={customUserData.grams}
                            onChange={(e)=>setCustomUserData({...customUserData, grams: e.target.value})}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Calories"
                            required
                            value={customUserData.calories}
                            onChange={(e)=>setCustomUserData({...customUserData, calories: e.target.value})}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Protein"
                            required
                            value={customUserData.protein}
                            onChange={(e)=>setCustomUserData({...customUserData, protein: e.target.value})}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Carbs"
                            required
                            value={customUserData.carbs}
                            onChange={(e)=>setCustomUserData({...customUserData, carbs: e.target.value})}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Fat"
                            required
                            value={customUserData.fat}
                            onChange={(e)=>setCustomUserData({...customUserData, fat: e.target.value})}/>
                        </div>
                    </div>
                    <div className="horizontal_buttons">
                        <div className="button beside" onClick={()=>SendEditFoodData()}>Confirm</div>
                        <div className="button beside" onClick={()=>EditFoodToMyFood(true)}>Back</div>
                        <div className="button beside delete" onClick={()=>DeleteFood()}>Delete</div>
                    </div>
                </div>
            }
            {viewHistory===false?<div></div>:
                <div>
                    <div className="button" onClick={()=>HomeToHistory(false)}>Back</div>
                    <div className="horizontal_buttons">
                        <div className="button beside" onClick={()=>ViewCaloriesHistory()}>Calories</div>
                        <div className="button beside" onClick={()=>ViewProteinHistory()}>Protein</div>
                        <div className="button beside" onClick={()=>ViewCarbHistory()}>Carbs</div>
                        <div className="button beside" onClick={()=>ViewFatHistory()}>Fat</div>
                    
                    </div>
                    <Bar data={historyData} />
                    {/*<Bar data={[]}/>*/}
                    {/*<Chart data={caloriesHistory} />*/}
                </div>
            }
            {/*USER IS ADDING A RECIPE*/}
            {addRecipe===false && editRecipe===false?<div></div>:
            <div className="inputAmount">
                <RecipeHeader/>
                <div className="foods_in_menu body">
                    <div className="name">
                        <input type="string" placeholder="Name"
                        required
                        value={customUserData.name}
                        onChange={(e)=>setCustomUserData({...customUserData, name: e.target.value})}/>
                    </div>
                    <div className="macro">
                        {customUserData.grams}
                    </div>
                    <div className="macro">
                        {customUserData.calories}
                    </div>
                    <div className="macro">
                        {customUserData.protein}
                    </div>
                    <div className="macro">
                        {customUserData.carbs}
                    </div>
                    <div className="macro">
                        {customUserData.fat}
                    </div>
                </div>

                <IngredientsHeader/>
                <div className="scrollable">
                    {recipeData.map((foodItem, index) => (
                    <div key={index} onClick={()=>EditFoodInRecipes(index)} className="foods_in_menu body hoverable">
                        <div className="name">{foodItem.name}</div>
                        <div className="macro">{foodItem.gramsUsed}</div>
                        <div className="macro">{foodItem.calories}</div>
                        <div className="macro">{foodItem.protein}</div>
                        <div className="macro">{foodItem.carbs}</div>
                        <div className="macro">{foodItem.fat}</div>
                    </div>
                ))}
                </div>

                {editRecipe===false?
                <div className="horizontal_buttons">
                    <div className="button beside" onClick={()=>AddRecipeToHome()}>Save</div>
                    <div className="button beside" onClick={()=>AddRecipeToAddFoodToRecipe(true, false)}>Add Food</div>
                    <div className="button beside" onClick={()=>myFoodsToRecipe(false)}>Back</div>
                </div>:
                <div className="horizontal_buttons">
                    <div className="button beside" onClick={()=>EditRecipeToMyFoods()}>Save</div>
                    <div className="button beside" onClick={()=>AddRecipeToAddFoodToRecipe(true, true)}>AddFood</div>
                    <div className="button beside" onClick={()=>myFoodToEditRecipe(false)}>Back</div>
                    <div className="button beside delete" onClick={()=>DeleteRecipe()}>Delete</div>
                </div>
                }
            </div>
            }
        </div>
    )
}

export default HomePage