import {useEffect, useRef, useState} from "react";
import '../HomePage/HomePage.css';
import '../LoginSignup/LoginSignup.css';
import { GetUserDetails, EditUserDetails} from '../HomePage/DatabaseCalls.jsx';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () =>{

    const nav = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState();
    const [activityLevel, setActivityLevel] = useState();
    const [trackCals, setTrackCals] = useState();
    const [trackPro, setTrackPro] = useState();
    const [trackCar, setTrackCar] = useState();
    const [trackFat, setTrackFat] = useState();

    useEffect(() =>{
        GetUserDetails().then((data) =>{
            setName(data.name);
            setEmail(data.email);
            setHeight(data.height);
            setWeight(data.weight);
            setAge(data.age);
            setGender(parseInt(data.gender, 10));
            setActivityLevel(parseInt(data.activityLevel, 10));
            setTrackCals(parseInt(data.trackCals, 10));
            setTrackPro(parseInt(data.trackPro, 10));
            setTrackCar(parseInt(data.trackCar, 10));
            setTrackFat(parseInt(data.trackFat, 10));
            console.log(data.gender);
        })
    }, []);

    function BackToHome()
    {
        nav('/HomePage');
    }

    function NewHightlight(index)
    {
        if(index == 0)
        {
            if(trackPro==2)
                setTrackPro(1);

            if(trackCar==2)
                setTrackCar(1);

            if(trackFat==2)
                setTrackFat(1);

            setTrackCals(2);
        }

        if(index == 1)
        {
            if(trackCals==2)
                setTrackCals(1);

            if(trackCar==2)
                setTrackCar(1);

            if(trackFat==2)
                setTrackFat(1);

            setTrackPro(2);
        }

        if(index == 2)
        {
            if(trackPro==2)
                setTrackPro(1);

            if(trackCals==2)
                setTrackCals(1);

            if(trackFat==2)
                setTrackFat(1);

            setTrackCar(2);
        }

        if(index == 3)
        {
            if(trackPro==2)
                setTrackPro(1);

            if(trackCar==2)
                setTrackCar(1);

            if(trackCals==2)
                setTrackCals(1);

            setTrackFat(2);
        }
    }

    function SaveEdit()
    {
        EditUserDetails(weight, height, age, name, email, password, gender, activityLevel, trackCals, trackPro, trackCar, trackFat).then(() =>{
            BackToHome();
        });
    }

    return (
        <div className='container_home'>
            <div className="background"></div>
            <div className="horizontal_buttons">
                <div className="button" onClick={()=>{BackToHome();}}>Back</div>
            </div>
            <div className="inputs">
                <div className="input">
                    <input type="text" placeholder="Name"
                    required
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    />
                </div>
                <div className="input">
                    <input type="email" placeholder="Email"
                    required
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <div className="input">
                    <input type="password" placeholder="Password"
                    required
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}/>
                </div>
                <div className="input">
                    <input type="int" placeholder="Height in Inches"
                    required
                    value={height}
                    onChange={(e)=>setHeight(e.target.value)}/>
                </div>
                <div className="input">
                    <input type="int" placeholder="Weight in Pounds"
                    required
                    value={weight}
                    onChange={(e)=>setWeight(e.target.value)}/>
                </div>
                <div className="input">
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
                <div className="input">
                    
                        <div className={activityLevel===1?"text":"text gray"} onClick={()=>{setActivityLevel(1)}}>-2lbs</div>
                        <div className={activityLevel===2?"text":"text gray"} onClick={()=>{setActivityLevel(2)}}>-1lbs</div>
                        <div className={activityLevel===3?"text":"text gray"} onClick={()=>{setActivityLevel(3)}}>0</div>
                        <div className={activityLevel===4?"text":"text gray"} onClick={()=>{setActivityLevel(4)}}>+1lbs</div>
                        <div className={activityLevel===5?"text":"text gray"} onClick={()=>{setActivityLevel(5)}}>+2lbs</div>
                    
                </div>
                <div className="input">
                    <div className="horizontal_container">
                        <div className={trackCals===2?"text":"text gray"} onClick={()=>{NewHightlight(0)}}>Highlight Calories</div>
                        {trackCals===2?<div></div>:
                        <div className="horizontal_container">
                            <div className={trackCals===1?"text":"text gray"} onClick={()=>{setTrackCals(1)}}>Display Calories</div>
                            <div className={trackCals===0?"text":"text gray"} onClick={()=>{setTrackCals(0)}}>Hide Calories</div>
                        </div>}
                    </div>
                </div>
                <div className="input">
                    <div className="horizontal_container">
                    <div className={trackPro===2?"text":"text gray"} onClick={()=>{NewHightlight(1)}}>Highlight Protein</div>
                    {trackPro===2?<div></div>:
                        <div className="horizontal_container">
                            <div className={trackPro===1?"text":"text gray"} onClick={()=>{setTrackPro(1)}}>Display Protein</div>
                            <div className={trackPro===0?"text":"text gray"} onClick={()=>{setTrackPro(0)}}>Don't Display Protein</div>
                        </div>}
                    </div>
                </div>
                <div className="input">
                    <div className="horizontal_container">
                    <div className={trackCar===2?"text":"text gray"} onClick={()=>{NewHightlight(2)}}>Highlight Carbs</div>
                    {trackCar===2?<div></div>:
                    <div className="horizontal_container">
                        <div className={trackCar===1?"text":"text gray"} onClick={()=>{setTrackCar(1)}}>Display Carbs</div>
                        <div className={trackCar===0?"text":"text gray"} onClick={()=>{setTrackCar(0)}}>Don't Display Carbs</div>
                        </div>}
                    </div>
                </div>
                <div className="input">
                    <div className="horizontal_container">
                    <div className={trackFat===2?"text":"text gray"} onClick={()=>{NewHightlight(3)}}>Highlight Fat</div>
                    {trackFat===2?<div></div>:
                    <div className="horizontal_container">
                        <div className={trackFat===1?"text":"text gray"} onClick={()=>{setTrackFat(1)}}>Display Fat</div>
                        <div className={trackFat===0?"text":"text gray"} onClick={()=>{setTrackFat(0)}}>Don't Display Fat</div>
                        </div>}
                    </div>
                </div>
            </div>
            <div className="submit-container">
                <div className="button" onClick={()=>{SaveEdit();}}>Save</div>
                </div>
        </div>
    )
}
export default ProfilePage