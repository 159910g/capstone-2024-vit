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
    const [gender,setGender] = useState();
    const activityLevel = 1;

    useEffect(() =>{
        GetUserDetails().then((data) =>{
            setName(data.name);
            setEmail(data.email);
            setPassword(data.password);
            setHeight(data.height);
            setWeight(data.weight);
            setAge(data.age);
            setGender(parseInt(data.gender, 10));
            console.log(data.gender);
        })
    }, []);

    function BackToHome()
    {
        nav('/HomePage');
    }

    function SaveEdit()
    {
        EditUserDetails(weight, height, age, name, email, password, gender).then(() =>{
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
            </div>
            <div className="submit-container">
                <div className="button" onClick={()=>{SaveEdit();}}>Save</div>
                </div>
        </div>
    )
}
export default ProfilePage