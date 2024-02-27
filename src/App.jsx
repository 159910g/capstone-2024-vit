import {HashRouter, BrowserRouter, Routes, Route, Link} from 'react-router-dom';
//import './App.css';
//import GetDB from './ViewServer';
//import Filler from './Page2';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import HomePage from './Components/HomePage/HomePage';
import ProfilePage from './Components/Profile/ProfilePage';

function App() {
  return (
    <div className="App">
      <HashRouter>
      {/*<nav>
        <ul>
          <li>
            <Link to="/HomePage">click me</Link>
          </li>
        </ul>
      </nav>*/}
        <Routes>
          <Route index element={<LoginSignup />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
        </Routes>
      </HashRouter>
  </div>
  );
}

export default App;
