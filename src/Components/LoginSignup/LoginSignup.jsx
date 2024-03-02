import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';

import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'

const LoginSignup = () => {

    const [action,setAction] = useState("Sign Up");
    const [signUpPage,setPage] = useState(1);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [gender,setGender] = useState(0);
    const activityLevel = 1;

    const nav = useNavigate();

    const handleSignUpClicker = (e) =>{

        if(action==="Login")
        {
            (()=>{setAction("Sign Up"); })();
        } 
        else {
            console.log("Sign Up Complete");
            e.preventDefault();
            const user = {email, password, name};
            const userDetails = {height, weight, age, activityLevel, gender};

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://capstone2024.com/loginSignup.php?action=signUp');
            xhr.responseType = 'text';
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            //send data to PHP
            xhr.send('userJSON=' + encodeURIComponent(JSON.stringify(user)) + '&userDetailsJSON=' + encodeURIComponent(JSON.stringify(userDetails)));
            //console.log('userJSON=' + encodeURIComponent(JSON.stringify(user)) + 'userDetailsJSON' + encodeURIComponent(JSON.stringify(userDetails)));
            xhr.addEventListener('load', function() {
                if (xhr.status === 200) {
                    // Handle the response from the server
                    console.log(xhr.responseText);
                    var responseText = JSON.parse(xhr.responseText);
                    sessionStorage.setItem('loggedInUser', responseText[0].user_id)

                    console.log(sessionStorage.getItem('loggedInUser')); // log the response to the console
                
                    if(sessionStorage.getItem('loggedInUser') != null)
                    {
                        //window.location.href = "/HomePage"
                        nav('/HomePage');
                    }
                } else {
                    console.log('Error: ' + xhr.status); // log any errors to the console
                }
            });
        }
    };

    const handleLoginClicker= (e) =>{

        if(action==="Sign Up")
        {
            (()=>{setPage(1)})();
            (()=>{setAction("Login"); })();
        } 
        else {
            console.log("Login Complete"); 
            e.preventDefault();
            const user = {email, password, name};

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://capstone2024.com/loginSignup.php?action=Login');
            xhr.responseType = 'text';
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send('userJSON=' + encodeURIComponent(JSON.stringify(user)));
            xhr.addEventListener('load', function() {
                if (xhr.status === 200) {
                    // Handle the response from the server
                    //console.log(xhr.responseText);
                    var responseText = JSON.parse(xhr.responseText);
                    sessionStorage.setItem('loggedInUser', responseText[0].user_id)

                    //console.log(sessionStorage.getItem('loggedInUser')); // log the response to the console
                
                    if(sessionStorage.getItem('loggedInUser') != null)
                    {
                        //window.location.href = "/HomePage"
                        nav('/HomePage');
                    }
                } else {
                    console.log('Error: ' + xhr.status); // log any errors to the console
                }
            });
            //send data to DB
        }
    };

    return (
        <div className='container'>
            <div className="background"></div>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {signUpPage===1?(
                <>
                    {action==="Login"?<div></div>: //if action = login, display empty div, else show the name field
                    <div className="input">
                        <img src={user_icon} alt=""/>
                        <input type="text" placeholder="Name"
                        required
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        />
                    </div>
                    }
                    <div className="input">
                        <img src={email_icon} alt=""/>
                        <input type="email" placeholder="Email"
                        required
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}/>
                    </div>
                    <div className="input">
                        <img src={password_icon} alt=""/>
                        <input type="password" placeholder="Password"
                        required
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}/>
                    </div>
                </>
                ):<> 
                    <div className="input">
                        <img src={user_icon} alt=""/>
                        <input type="int" placeholder="Height in Inches"
                        required
                        value={height}
                        onChange={(e)=>setHeight(e.target.value)}/>
                    </div>
                    <div className="input">
                        <img src={user_icon} alt=""/>
                        <input type="int" placeholder="Weight in Pounds"
                        required
                        value={weight}
                        onChange={(e)=>setWeight(e.target.value)}/>
                    </div>
                    <div className="input">
                        <img src={user_icon} alt=""/>
                        <input type="int" placeholder="Age in Years"
                        required
                        value={age}
                        onChange={(e)=>setAge(e.target.value)}/>
                    </div>
                    <div className="input">
                        <div className="horizontal_container">
                        <div className={gender===0?"text":"text gray"} onClick={()=>{setGender(0)}}>Male</div>
                        <div className={gender===1?"text":"text gray"} onClick={()=>{setGender(1)}}>Female</div>
                        </div>
                    </div>
                </>}

            </div>
            {action==="Sign Up"?<div></div>:
            <div className="forgot_password">Lost Password? <span>Click Here!</span></div>
            }
            <div className="horizontal_container">
                {action==="Login"?<div></div>:
                <>
                <div className={signUpPage===1?"circle":"circle_gray"} onClick={()=>{setPage(1)}}></div>
                <div className={signUpPage===2?"circle":"circle_gray"} onClick={()=>{setPage(2)}}></div>
                </>
                }
            </div>
            <div className="submit-container">
                <div className={action==="Login"?"submit gray":"submit focus_point"} onClick={handleSignUpClicker}>Create Account</div>
                <div className={action==="Sign Up"?"submit gray":"submit focus_point"} onClick={handleLoginClicker}>Login</div>
            </div>
        </div>
    )
}

export default LoginSignup