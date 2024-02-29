//import axios from "axios"
import {useEffect, useRef, useState} from "react";
import './HomePage.css';
import { updateCircle } from './Circle.jsx';
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
//import Chart  from './Chart.jsx';
import { useNavigate } from 'react-router-dom';
import { GetUserGoals, GetUserTrackedFood, GetFoodNames, AddToTrackedFood, UploadCustomFood, GetUserGenFoodNames, EditCustomFood, CheckDate, DeleteCustomFood, GetUserHistory, AddRecipe, GetUserGenRecipes, GetUserRecipeIngredients } from './DatabaseCalls.jsx';

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
    const[calorieGoal, setCalorieGoal] = useState(1);
    const[proteinGoal, setProteinGoal] = useState(1);
    const[carbGoal, setCarbGoal] = useState(1);
    const[fatGoal, setFatGoal] = useState(1);

    //current macro data for  user
    const[calories, setCalories] = useState(0);
    const[protein, setProtein] = useState(0);
    const[carbs, setCarbs] = useState(0);
    const[fat, setFat] = useState(0);

    //states for menu selection
    const[viewFoods, setViewFoods] = useState(false);
    const[addCustomFoods, setAddCustomFoods] = useState(false);
    const[enteringAmount, setEnteringAmount] = useState(false);
    const[viewHome, setViewHome] = useState(true);
    const[myFoods, setMyFoods] = useState(false);
    const[editCustomFoods, setEditCustomFoods] = useState(false);
    const[viewHistory, setViewHistory] = useState(false);
    const[addRecipe, setAddRecipe] = useState(false);
    const[editRecipe, setEditRecipe] = useState(false);
    const[addFoodtoRecipe, setAddFoodtoRecipe] = useState(false);
    const[enteringAmountForRecipe, setEnteringAmountForRecipe] = useState(false);

    //arrays of food information for displaying the database
    const[foodNames, setFoodNames] = useState([]);
    const[foodProtein, setFoodProtein] = useState([]);
    const[foodCalories, setFoodCalories] = useState([]);
    const[foodCarbs, setFoodCarbs] = useState([]);
    const[foodFat, setFoodFat] = useState([]);
    const[foodGrams, setFoodGrams] = useState([]);

    //arrays of food information for displaying the recipe
    const[foodsForRecipe, setFoodsForRecipe] = useState([]);
    const[gramsForRecipe, setgramsForRecipe] = useState([]);
    const[recipefoodProtein, setRecipeFoodProtein] = useState([]);
    const[recipefoodCalories, setRecipeFoodCalories] = useState([]);
    const[recipefoodCarbs, setRecipeFoodCarbs] = useState([]);
    const[recipefoodFat, setRecipeFoodFat] = useState([]);

    //arrays of food only from user generatedFood
    const[foodNamesUG, setFoodNamesUG] = useState([]);
    const[foodProteinUG, setFoodProteinUG] = useState([]);
    const[foodCaloriesUG, setFoodCaloriesUG] = useState([]);
    const[foodCarbsUG, setFoodCarbsUG] = useState([]);
    const[foodFatUG, setFoodFatUG] = useState([]);
    const[foodGramsUG, setFoodGramsUG] = useState([]);

    //array of recipes
    const[foodNamesUGR, setFoodNamesUGR] = useState([]);
    const[foodProteinUGR, setFoodProteinUGR] = useState([]);
    const[foodCaloriesUGR, setFoodCaloriesUGR] = useState([]);
    const[foodCarbsUGR, setFoodCarbsUGR] = useState([]);
    const[foodFatUGR, setFoodFatUGR] = useState([]);
    const[foodGramsUGR, setFoodGramsUGR] = useState([]);

    //storing the history user's tracked macros
    const[proteinHistory, setProteinHistory] = useState([]);
    const[caloriesHistory, setCaloriesHistory] = useState([]);
    const[carbsHistory, setCarbsHistory] = useState([]);
    const[fatHistory, setFatHistory] = useState([]);
    const[dayHistory, setDayHistory] = useState([]);
    const[monthHistory, setMonthHistory] = useState([]);
    const[yearHistory, setYearHistory] = useState([]);

    //used for storing/sending the custom food data that user enters to database
    const[customName, setCustomName] = useState("");
    const[customProtein, setCustomProtein] = useState(0);
    const[customCalories, setCustomCalories] = useState(0);
    const[customCarbs, setCustomCarbs] = useState(0);
    const[customFat, setCustomFat] = useState(0);
    const[customGrams, setCustomGrams] = useState(0);

    //used when user inputting how much food was eaten + keeping track of what food was selected
    const[grams, setGrams] = useState(0);
    const[currentMacros, setCurrentMacros] = useState([]);

    const[nextIndex, setNextIndex] = useState(0);
    const[ingredientsFromDB, setIngredientsFromDB] = useState([]);

    const[selectedFoodName, setSelectedFoodName] = useState("");

    useEffect (() => {
        //console.log("On Page Load...");
        let today = new Date();
        let month = today.getMonth()+1;
        let year = today.getFullYear();
        let day = today.getDate();

        CheckDate(day, month, year).then(() => {
            UpdateFoodLists();

            GetUserGoals().then((goals) => {

                setCalorieGoal(goals.calorieGoal);
                setProteinGoal(goals.proteinGoal);
                setCarbGoal(goals.carbGoal);
                setFatGoal(goals.fatGoal);
            });
            GetUserTrackedFood().then((macros) => {
                setCalories(macros.currentCalories);
                setProtein(macros.currentProtein);
                setCarbs(macros.currentCarbs);
                setFat(macros.currentFat);
            });
            });
    }, []);

    useEffect (() => {
        //console.log("Updating Circles...");
        if(viewHome)
            UpdateCircles();
    }, [calories, viewHome]); //<- causes this useEffect to get run whenever either of these variables in updated
        
    const updateCalorieCircle = (svgCanvas) => {
        //console.log("updating calorie circle")
        const {newRad, newCirc, newCircPercent} = updateCircle(svgCanvas, 0.85, calories, calorieGoal);//responseText[0].calorie_goal))
        
        //set all those values to "global" variables
        SetRadius(newRad);
        setCirc(newCirc);
        setCircPercentage(newCircPercent);
    };

    const updateProteinCircle = (svgCanvas) =>{
        //all the unfocused circles are the same size as this one so it sets the radius and circumferences they all use
        //but their own functions return the percentage of the circle that is filled by them
        const {newRad, newCirc, newCircPercent} = updateCircle(svgCanvas, 0.85, protein, proteinGoal)

        //set all those values to "global" variables
        SetRadiusUnfocused(newRad);
        setCircUnfocused(newCirc);
        setCircPercentageProtein(newCircPercent);
    };

    const updateFatCircle = (svgCanvas) =>{
        const {newCircPercent} = updateCircle(svgCanvas, 0.85, fat, fatGoal)

        //set all those values to "global" variables
        setCircPercentageFat(newCircPercent);
    };

    const updateCarbCircle = (svgCanvas) =>{
        const {newCircPercent} = updateCircle(svgCanvas, 0.85, carbs, carbGoal)

        //set all those values to "global" variables
        setCircPercentageCarbs(newCircPercent);
    };

    const UpdateCircles = () =>{
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
        setCustomName("");
        setCustomProtein(0);
        setCustomCalories(0);
        setCustomCarbs(0);
        setCustomFat(0);
        setCustomGrams(0);
        setNextIndex(0);

        setFoodsForRecipe([]);
        setgramsForRecipe([]);
        setRecipeFoodProtein([]);
        setRecipeFoodCalories([]);
        setRecipeFoodCarbs([]);
        setRecipeFoodFat([]);
    }

    function FoodSelected() { 
        //add to tracked food
        AddToTrackedFood(selectedFoodName, grams).then(() => {
            //once added get the tracked food information
            GetUserTrackedFood().then((macros) => {
                //then updates all the macro numbers and put user back to home screen
                setCalories(macros.currentCalories);
                setProtein(macros.currentProtein);
                setCarbs(macros.currentCarbs);
                setFat(macros.currentFat);

                setViewFoods(false);
                setEnteringAmount(false);
                setViewHome(true);
            });
        });
    }

    function RecipeIngredientsLogic()
    {
        let tempArray = [];
        tempArray = foodsForRecipe
        tempArray.push(selectedFoodName)
        setFoodsForRecipe(tempArray);
        console.log(foodsForRecipe);
        /*******************************************************/
        tempArray = gramsForRecipe
        tempArray.push(grams);
        setgramsForRecipe(tempArray);
        console.log(gramsForRecipe);

        let value = parseInt(customGrams, 10) + parseInt(grams, 10);
        setCustomGrams(value);
        /*******************************************************/
        let division =  parseInt(currentMacros[0]  * (grams/currentMacros[4]), 10)
        value = parseInt(customCalories, 10) + division;
        setCustomCalories(value);

        console.log(value)
        tempArray = recipefoodCalories
        tempArray.push(division)
        setRecipeFoodCalories(tempArray);
        /*******************************************************/
        division = parseInt(currentMacros[1]  * (grams/currentMacros[4]), 10)
        value = parseInt(customProtein, 10) + division;
        setCustomProtein(value);

        tempArray = recipefoodProtein
        tempArray.push(division)
        setRecipeFoodProtein(tempArray);
        /*******************************************************/
        division = parseInt(currentMacros[2]  * (grams/currentMacros[4]), 10)
        value = parseInt(customCarbs, 10) + division;
        setCustomCarbs(value);

        tempArray = recipefoodCarbs
        tempArray.push(division)
        setRecipeFoodCarbs(tempArray);
        /*******************************************************/
        division = parseInt(currentMacros[3]  * (grams/currentMacros[4]), 10)
        value = parseInt(customFat, 10) + division;
        setCustomFat(value);

        tempArray = recipefoodFat
        tempArray.push(division)
        setRecipeFoodFat(tempArray);
        /*******************************************************/
    }

    function FoodSelectedForRecipe(){
        RecipeIngredientsLogic();
        setEnteringAmountForRecipe(false);
        setAddRecipe(true);
    }

    function SetFoodSelectedData(foodname, index) {
        setSelectedFoodName(foodname);
        setGrams(foodGrams[index]);

        let tempArray = [];
        tempArray.push(foodCalories[index]);
        tempArray.push(foodProtein[index]);
        tempArray.push(foodCarbs[index]);
        tempArray.push(foodFat[index]);
        tempArray.push(foodGrams[index]);

        setCurrentMacros(tempArray);

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

    function EditFood(foodname, index){
        setSelectedFoodName(foodname);
        setGrams(foodGramsUG[index]);

        setCustomName(foodname);
        setCustomGrams(foodGramsUG[index]);;
        setCustomCalories(foodCaloriesUG[index]);
        setCustomProtein(foodProteinUG[index]);
        setCustomCarbs(foodCarbsUG[index]);
        setCustomFat(foodFatUG[index]);

        setMyFoods(false);
        setEditCustomFoods(true);
    }

    function EditRecipe(foodname){
        resetCustomValues();
        //womp
        GetUserRecipeIngredients(foodname).then((foods) => {
            const combinedData = foods.tempFoodCaloriesList.map((calories, index) => ({
                calories,
                protein: foods.tempFoodProteinList[index],
                carbs: foods.tempFoodCarbsList[index],
                fat: foods.tempFoodFatList[index],
                grams: foods.tempFoodGramsList[index],
                name: foods.tempFoodNamesList[index]
            }));

            console.log(combinedData);

            setIngredientsFromDB(combinedData);
        });

        setMyFoods(false);
        setEditRecipe(true);
    }

    function DataFromRecipe(foods, index)
    {
        console.log("datafromrecipe");
        let tempArray = [];
        tempArray = foodsForRecipe
        tempArray.push(foods[index].name)
        setFoodsForRecipe(tempArray);
        console.log(foodsForRecipe);
        /*******************************************************/
        tempArray = gramsForRecipe
        tempArray.push(foods[index].grams);
        setgramsForRecipe(tempArray);
        console.log(gramsForRecipe);

        let value = parseInt(customGrams, 10) + parseInt(foods[index].grams, 10);
        setCustomGrams(value);
        /*******************************************************/
        let division =  parseInt(foods[index].calories  * (foods[index].grams/foods[index].grams), 10)
        value = parseInt(customCalories, 10) + division; 
        setCustomCalories(value); //this is the value listed at the top, the recipes total calories

        tempArray = recipefoodCalories
        tempArray.push(division)
        setRecipeFoodCalories(tempArray);
        /*******************************************************/
        division = parseInt(foods[index].protein  * (foods[index].grams/foods[index].grams), 10)
        value = parseInt(customProtein, 10) + division;
        setCustomProtein(value);

        tempArray = recipefoodProtein
        tempArray.push(division)
        setRecipeFoodProtein(tempArray);
        /*******************************************************/
        division = parseInt(foods[index].carbs  * (foods[index].grams/foods[index].grams), 10)
        value = parseInt(customCarbs, 10) + division;
        setCustomCarbs(value);

        tempArray = recipefoodCarbs
        tempArray.push(division)
        setRecipeFoodCarbs(tempArray);
        /*******************************************************/
        division = parseInt(foods[index].fat  * (foods[index].grams/foods[index].grams), 10)
        value = parseInt(customFat, 10) + division;
        setCustomFat(value);

        tempArray = recipefoodFat
        tempArray.push(division)
        setRecipeFoodFat(tempArray);
        /*******************************************************/
        console.log(index +":"+ingredientsFromDB.length)
        setNextIndex(index+1);
    }

    useEffect(() =>{
        console.log("heheh" + ingredientsFromDB.length);
        if(ingredientsFromDB.length > nextIndex) 
            DataFromRecipe(ingredientsFromDB, nextIndex)
    }, [nextIndex, ingredientsFromDB])

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

    function AddRecipeToAddFoodToRecipe(value)
    {
        setAddFoodtoRecipe(value);
        setEditRecipe(!value);
        setAddRecipe(!value);
    }

    function HomeToHistory(value){
        if(value)
        {  
            GetUserHistory().then((history) =>{
                console.log("DEBUG ",history.tempHistoryCalories);

                setCaloriesHistory(history.tempHistoryCalories);
                setProteinHistory(history.tempHistoryProtein);
                setCarbsHistory(history.tempHistoryCarbs);
                setFatHistory(history.tempHistoryFat);
                setDayHistory(history.tempHistoryDay);
                setMonthHistory(history.tempHistoryMonth);
                setYearHistory(history.tempHistoryYear);
            });

            console.log("DEBUG ",caloriesHistory);

            setViewHistory(value);
            setViewHome(!value);
        }
        else
        {
            setViewHistory(value);
            setViewHome(!value);
        }
    }

    function UpdateFoodLists(){
        GetFoodNames().then((foods) => {

            setFoodNames(foods.tempFoodNamesList);
            setFoodCalories(foods.tempFoodCaloriesList);
            setFoodProtein(foods.tempFoodProteinList);
            setFoodCarbs(foods.tempFoodCarbsList);
            setFoodFat(foods.tempFoodFatList);
            setFoodGrams(foods.tempFoodGramsList);
        });

        GetUserGenFoodNames().then((foods) => {
            setFoodNamesUG(foods.tempFoodNamesList);
            setFoodCaloriesUG(foods.tempFoodCaloriesList);
            setFoodProteinUG(foods.tempFoodProteinList);
            setFoodCarbsUG(foods.tempFoodCarbsList);
            setFoodFatUG(foods.tempFoodFatList);
            setFoodGramsUG(foods.tempFoodGramsList);
        })

        GetUserGenRecipes().then((foods) => {
            setFoodNamesUGR(foods.tempFoodNamesList);
            setFoodCaloriesUGR(foods.tempFoodCaloriesList);
            setFoodProteinUGR(foods.tempFoodProteinList);
            setFoodCarbsUGR(foods.tempFoodCarbsList);
            setFoodFatUGR(foods.tempFoodFatList);
            setFoodGramsUGR(foods.tempFoodGramsList);
        })
    }


    function AddCustomFoodToHome() {
        UploadCustomFood(customName, customGrams, customCalories, customProtein, customCarbs, customFat).then(() => {
            UpdateFoodLists();
        });
        setAddCustomFoods(false);
        setViewHome(true);
        resetCustomValues();
    }

    function AddRecipeToHome(){
        let totalGrams = 0;
        for (const gram of gramsForRecipe) 
        {
            totalGrams += parseInt(gram,10);
        }
        AddRecipe(customName, totalGrams, foodsForRecipe);
        UpdateFoodLists();
        setAddRecipe(false);
        setViewHome(true);
    }

    function SendEditFoodData (){
        EditCustomFood(selectedFoodName, customName, customGrams, customCalories, customProtein, customCarbs, customFat).then(() => {
            UpdateFoodLists();
            GetUserTrackedFood().then((macros) => {
                setCalories(macros.currentCalories);
                setProtein(macros.currentProtein);
                setCarbs(macros.currentCarbs);
                setFat(macros.currentFat);

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

    function EditFoodToMyFood(value) {
        setMyFoods(value);
        setEditCustomFoods(!value);

        setCustomName("");
        setCustomGrams(0);
        setCustomCalories(0);
        setCustomProtein(0);
        setCustomCarbs(0);
        setCustomFat(0);
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
        resetCustomValues();
    }

    function ToProfile()
    {
        nav('/ProfilePage');
    }

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const labels2 = [3, 0, 6, 3, 5, 3, 3];

    const data = {
    labels,
    datasets: [
        {
        label: 'Dataset 1',
        data: labels.map((label, index) => labels2[index]),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
        label: 'Dataset 2',
        data: labels.map(() => 2),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
    };

    //<h1>This user id is logged in: {user_id}.</h1>

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
                    <svg ref={calorieCanvas} className='focused_circle'>
                        <circle 
                            r={radius} 
                            cx="50%" 
                            cy="50%" 
                            fill="transparent" 
                            stroke="lightgrey" 
                            strokeWidth="2rem" 
                            strokeDasharray={circ} 
                            strokeDashoffset="0"/>
                        <circle 
                            r={radius} //radius
                            cx="50%" //origin x
                            cy="50%"//origin y
                            fill="transparent" //keep center transparent
                            stroke="blue"  //colour of line
                            strokeWidth="2rem" //with of line
                            strokeDasharray={circ} //total size of circle
                            strokeDashoffset={circ-circPercentage} //amount of circle NOT filled in
                            style={{ transformOrigin: '50% 50%' }} //ensure circle starts from bottom filles clockwise
                            transform={`rotate(90)`}/>
                        <text className="text_in_circle" x="50%" y="45%" textAnchor="middle"> 
                            <tspan x="50%" y="50%">{calories}/{calorieGoal}</tspan>
                            <tspan x="50%" y="60%">{((parseFloat((calories / calorieGoal).toFixed(2))) * 100).toFixed(0)}%</tspan> 
                        </text>
                    </svg>
                </div> 
                }
                {viewHome===false?<div></div>: 
                <div className='unfocused_window'>
                    <svg ref={proteinCanvas} className='unfocused_square'>
                        <circle 
                            r={radiusUnfocused}
                            cx="50%" 
                            cy="50%" 
                            fill="transparent" 
                            stroke="lightgrey" 
                            strokeWidth="1rem" 
                            strokeDasharray={circUnfocused} 
                            strokeDashoffset="0"/> 
                        <circle 
                            r={radiusUnfocused}
                            cx="50%" 
                            cy="50%" 
                            fill="transparent" 
                            stroke="green" 
                            strokeWidth="1rem" 
                            strokeDasharray={circUnfocused} 
                            strokeDashoffset={circUnfocused-circPercentageProtein} 
                            style={{ transformOrigin: '50% 50%' }} //ensure circle starts from bottom filles clockwise
                            transform={`rotate(90)`}/>
                        <text className="text_in_circle_unfocused" x="50%" y="45%" textAnchor="middle"> 
                            <tspan x="50%" y="50%">{protein}/{proteinGoal}</tspan>
                            <tspan x="50%" y="60%">{((parseFloat((protein / proteinGoal).toFixed(2))) * 100).toFixed(0)}%</tspan>
                        </text>
                    </svg>
                    <svg ref={carbCanvas} className='unfocused_square'>
                        <circle 
                            r={radiusUnfocused}
                            cx="50%" 
                            cy="50%" 
                            fill="transparent" 
                            stroke="lightgrey" 
                            strokeWidth="1rem" 
                            strokeDasharray={circUnfocused} 
                            strokeDashoffset="0"/> 
                        <circle 
                            r={radiusUnfocused}
                            cx="50%" 
                            cy="50%" 
                            fill="transparent" 
                            stroke="red" 
                            strokeWidth="1rem" 
                            strokeDasharray={circUnfocused} 
                            strokeDashoffset={circUnfocused-circPercentageCarbs}
                            style={{ transformOrigin: '50% 50%' }} //ensure circle starts from bottom filles clockwise
                            transform={`rotate(90)`}/>
                        <text className="text_in_circle_unfocused" x="50%" y="45%" textAnchor="middle"> 
                            <tspan x="50%" y="50%">{carbs}/{carbGoal}</tspan>
                            <tspan x="50%" y="60%">{((parseFloat((carbs / carbGoal).toFixed(2))) * 100).toFixed(0)}%</tspan>
                        </text>
                    </svg>
                    <svg ref={fatCanvas} className='unfocused_square'>
                        <circle 
                            r={radiusUnfocused}
                            cx="50%" 
                            cy="50%" 
                            fill="transparent" 
                            stroke="lightgrey" 
                            strokeWidth="1rem" 
                            strokeDasharray={circUnfocused} 
                            strokeDashoffset="0"/> 
                        <circle 
                            r={radiusUnfocused}
                            cx="50%" 
                            cy="50%" 
                            fill="transparent" 
                            stroke="blue" 
                            strokeWidth="1rem" 
                            strokeDasharray={circUnfocused} 
                            strokeDashoffset={circUnfocused-circPercentageFat}
                            style={{ transformOrigin: '50% 50%' }} //ensure circle starts from bottom filles clockwise
                            transform={`rotate(90)`}/>
                        <text className="text_in_circle_unfocused" x="50%" y="45%" textAnchor="middle"> 
                            <tspan x="50%" y="50%">{fat}/{fatGoal}</tspan>
                            <tspan x="50%" y="60%">{((parseFloat((fat / fatGoal).toFixed(2))) * 100).toFixed(0)}%</tspan>
                        </text>
                    </svg> 
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

                <div className="foods_in_menu">
                    <div className="name">Name</div>
                    <div className="macro">Grams Per Serving</div>
                    <div className="macro">Calories</div>
                    <div className="macro">Protein</div>
                    <div className="macro">Carbs</div>
                    <div className="macro">Fat</div>
                </div>
                <div className="scrollable">
                    {foodNames.map((foodname, index) => ( //functions as a foreach loop //this onclick should open another menu with a text box to enter the amount of grams eaten with a submit and back button
                        <div key={index} onClick={()=>SetFoodSelectedData(foodname, index)} className="foods_in_menu body hoverable">

                            <div className={index === 0 ? 'name' : 'name'}>
                                {foodname}
                            </div>
                            <div className="macro">{foodGrams[index]}</div>
                            <div className="macro">{foodCalories[index]}</div>
                            <div className="macro">{foodProtein[index]}</div>
                            <div className="macro">{foodCarbs[index]}</div>
                            <div className="macro">{foodFat[index]}</div>
                        </div>
                    ))}
                </div>
            </div>
            } {/* THE SCREEN WHERE USER INPUTS THE AMOUNT OF GRAMS THEY ATE OF THE FOOD THEY SELECTED */}
            {enteringAmount===false && enteringAmountForRecipe===false?<div></div>:
                <div className="inputAmount">
                    <div>
                        <div className="foods_in_menu">
                            <div className="selected">Calories</div>
                            <div className="selected">Protein</div>
                            <div className="selected">Carbs</div>
                            <div className="selected">Fat</div>
                        </div>
                        <div className="foods_in_menu body">
                            {/*currentMacros is an array of the values for the food selected in view foods
                            0 = calories, 1 = protein, 2 = carbs, 3 = fat, 4 = grams per 1 serving*/}
                            <div className="selected">{Math.floor((currentMacros[0]) * (grams/currentMacros[4]))}</div>
                            <div className="selected">{Math.floor((currentMacros[1]) * (grams/currentMacros[4]))}</div>
                            <div className="selected">{Math.floor((currentMacros[2]) * (grams/currentMacros[4]))}</div>
                            <div className="selected">{Math.floor((currentMacros[3]) * (grams/currentMacros[4]))}</div>
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
                    {enteringAmount===false?
                    <div className="horizontal_buttons"> {/*this  whole block will be used when adding food  recipe except need an extra check here at the bottom*/}
                        <div className="button beside" onClick={()=>FoodSelectedForRecipe()}>Confirm</div>
                        <div className="button beside" onClick={()=>AmountToViewingRecipe()}>Back</div>
                    </div>:
                    <div className="horizontal_buttons"> {/*this  whole block will be used when adding food  recipe except need an extra check here at the bottom*/}
                        <div className="button beside" onClick={()=>FoodSelected()}>Confirm</div>
                        <div className="button beside" onClick={()=>AmountToViewing()}>Back</div>
                    </div>}
                </div>
            } {/* USER ADDING FOOD TO DATABASE*/}
            {addCustomFoods===false?<div></div>:
                <div className="inputAmount">
                    <div className="foods_in_menu">
                        <div className="name">Name</div>
                        <div className="macro">Grams Per Serving</div>
                        <div className="macro">Calories</div>
                        <div className="macro">Protein</div>
                        <div className="macro">Carbs</div>
                        <div className="macro">Fat</div>
                    </div>
                    <div className="foods_in_menu body">
                        <div className="name">
                            <input type="string" placeholder="Name"
                            required
                            value={customName}
                            onChange={(e)=>setCustomName(e.target.value)}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Grams"
                            required
                            value={customGrams}
                            onChange={(e)=>setCustomGrams(e.target.value)}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Calories"
                            required
                            value={customCalories}
                            onChange={(e)=>setCustomCalories(e.target.value)}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Protein"
                            required
                            value={customProtein}
                            onChange={(e)=>setCustomProtein(e.target.value)}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Carbs"
                            required
                            value={customCarbs}
                            onChange={(e)=>setCustomCarbs(e.target.value)}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Fat"
                            required
                            value={customFat}
                            onChange={(e)=>setCustomFat(e.target.value)}/>
                        </div>
                    </div>
                    <div className="horizontal_buttons">
                        <div className="button beside" onClick={()=>AddCustomFoodToHome()}>Confirm</div>
                        <div className="button beside" onClick={()=>AddCustomFoodToMyFood(true)}>Back</div>
                    </div>
                </div>
            }{/* USER LOOKING AT ALL THEIR FOODS IN DB WITH OPTION TO DELETE, EDIT OR ADD*/}
            {myFoods===false?<div></div>:
                <div>
                    <div className="vertical_menu">
                        <div className="horizontal_buttons">
                            <div className="button" onClick={()=>{myFoodToViewFood(true);}}>Back</div>
                            <div className="button" style={{fontSize:"17px"}} onClick={()=>{MyFoodToAddCustomFood(true);}}>Add Food</div>
                            <div className="button" style={{fontSize:"17px"}} onClick={()=>{myFoodsToRecipe(true);}}>Add Recipe</div>
                        </div>
                        <div className="foods_in_menu">
                            <div className="name">Food Name</div>
                            <div className="macro">Grams Per Serving</div>
                            <div className="macro">Calories</div>
                            <div className="macro">Protein</div>
                            <div className="macro">Carbs</div>
                            <div className="macro">Fat</div>
                        </div>
                        <div className="scrollable">
                            {foodNamesUG.map((foodname, index) => ( 
                                <div key={index} onClick={()=>{EditFood(foodname, index)}} className="foods_in_menu body hoverable">
                                    <div className={index === 0 ? 'name' : 'name'}>
                                        {foodname}
                                    </div>
                                    <div className="macro">{foodGramsUG[index]}</div>
                                    <div className="macro">{foodCaloriesUG[index]}</div>
                                    <div className="macro">{foodProteinUG[index]}</div>
                                    <div className="macro">{foodCarbsUG[index]}</div>
                                    <div className="macro">{foodFatUG[index]}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{paddingBottom: "8%"}}></div>
                    <div className="vertical_menu">
                        <div className="foods_in_menu">
                            <div className="name">Recipe Name</div>
                            <div className="macro">Grams Per Serving</div>
                            <div className="macro">Calories</div>
                            <div className="macro">Protein</div>
                            <div className="macro">Carbs</div>
                            <div className="macro">Fat</div>
                        </div>
                        <div className="scrollable">
                            {foodNamesUGR.map((foodname, index) => ( 
                                <div key={index} onClick={()=>{EditRecipe(foodname, index)}} className="foods_in_menu body hoverable">
                                    <div className={index === 0 ? 'name' : 'name'}>
                                        {foodname}
                                    </div>
                                    <div className="macro">{foodGramsUGR[index]}</div>
                                    <div className="macro">{foodCaloriesUGR[index]}</div>
                                    <div className="macro">{foodProteinUGR[index]}</div>
                                    <div className="macro">{foodCarbsUGR[index]}</div>
                                    <div className="macro">{foodFatUGR[index]}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
            {/* USER EDITING OR DELETING CUSTOM FOODS*/}
            {editCustomFoods===false?<div></div>:
                <div className="inputAmount">
                    <div className="foods_in_menu">
                        <div className="name">Name</div>
                        <div className="macro">Grams Per Serving</div>
                        <div className="macro">Calories</div>
                        <div className="macro">Protein</div>
                        <div className="macro">Carbs</div>
                        <div className="macro">Fat</div>
                    </div>
                    <div className="foods_in_menu body">
                        <div className="name">
                            <input type="string" placeholder="Name"
                            required
                            value={customName}
                            onChange={(e)=>setCustomName(e.target.value)}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Grams"
                            required
                            value={customGrams}
                            onChange={(e)=>setCustomGrams(e.target.value)}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Calories"
                            required
                            value={customCalories}
                            onChange={(e)=>setCustomCalories(e.target.value)}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Protein"
                            required
                            value={customProtein}
                            onChange={(e)=>setCustomProtein(e.target.value)}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Carbs"
                            required
                            value={customCarbs}
                            onChange={(e)=>setCustomCarbs(e.target.value)}/>
                        </div>
                        <div className="macro">
                            <input type="int" placeholder="Fat"
                            required
                            value={customFat}
                            onChange={(e)=>setCustomFat(e.target.value)}/>
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
                        <div className="button beside" onClick={()=>SendEditFoodData()}>Calories</div>
                        <div className="button beside" onClick={()=>EditFoodToMyFood(true)}>Protein</div>
                        <div className="button beside" onClick={()=>SendEditFoodData()}>Carbs</div>
                        <div className="button beside" onClick={()=>EditFoodToMyFood(true)}>Fat</div>
                    </div>
                    <Bar data={data} />;
                    {/*<Bar data={[]}/>*/}
                    {/*<Chart data={caloriesHistory} />*/}
                </div>
            }
            {/*USER IS ADDING A RECIPE*/}
            {addRecipe===false && editRecipe===false?<div></div>:
            <div className="inputAmount">
                <div className="foods_in_menu">
                    <div className="name">Recipe Name</div>
                    <div className="macro">Total Grams</div>
                    <div className="macro">Calories</div>
                    <div className="macro">Protein</div>
                    <div className="macro">Carbs</div>
                    <div className="macro">Fat</div>
                </div>
                <div className="foods_in_menu body">
                    <div className="name">
                        <input type="string" placeholder="Name"
                        required
                        value={customName}
                        onChange={(e)=>setCustomName(e.target.value)}/>
                    </div>
                    <div className="macro">
                        {customGrams}
                    </div>
                    <div className="macro">
                        {customCalories}
                    </div>
                    <div className="macro">
                        {customProtein}
                    </div>
                    <div className="macro">
                        {customCarbs}
                    </div>
                    <div className="macro">
                        {customFat}
                    </div>
                </div>

                <div className="foods_in_menu">
                    <div className="name">Ingredients Name</div>
                    <div className="macro">Grams</div>
                    <div className="macro">Calories</div>
                    <div className="macro">Protein</div>
                    <div className="macro">Carbs</div>
                    <div className="macro">Fat</div>
                </div>
                <div className="scrollable">
                    {foodsForRecipe.map((foodname, index) => ( //functions as a foreach loop
                        <div key={index} className="foods_in_menu body">

                            <div className={index === 0 ? 'name' : 'name'}>
                                {foodname}
                            </div>
                            <div className="macro">{gramsForRecipe[index]}</div>
                            <div className="macro">{recipefoodCalories[index]}</div>
                            <div className="macro">{recipefoodProtein[index]}</div>
                            <div className="macro">{recipefoodCarbs[index]}</div>
                            <div className="macro">{recipefoodFat[index]}</div>
                        </div>
                    ))}
                </div>

                {editRecipe===false?
                <div className="horizontal_buttons">
                    <div className="button beside" onClick={()=>AddRecipeToHome()}>Save</div>
                    <div className="button beside" onClick={()=>AddRecipeToAddFoodToRecipe(true)}>Add Food</div>
                    <div className="button beside" onClick={()=>myFoodsToRecipe(false)}>Back</div>
                </div>:
                <div className="horizontal_buttons">
                    <div className="button beside" onClick={()=>AddRecipeToHome()}>Save</div>
                    <div className="button beside" onClick={()=>AddRecipeToAddFoodToRecipe(true)}>Add Food</div>
                    <div className="button beside" onClick={()=>myFoodToEditRecipe(false)}>Back</div>
                    <div className="button beside delete">Delete</div>
                </div>
                }
            </div>
            }
        </div>
    )
}

export default HomePage