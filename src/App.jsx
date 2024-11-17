import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login'
import { Layout } from './Layout'
import { Home } from './pages/Home'
import { PostProvider, SearchProvider, UserProvider } from './context/UserContext'
import { Profile } from './pages/Profile'
import { ProfileTabs } from './components/ProfileTabs'
import { SignUp } from './pages/SignUp'
import { Story } from './pages/Story'

function App() {
  const localitem = JSON.parse(localStorage.getItem("token"))
  return (
    <BrowserRouter>
      <UserProvider>
        <SearchProvider>
          <PostProvider>
            <Routes>
              <Route path='/stories/:username/:_id/' element={<Story />} />
              <Route index element={<Navigate to={localitem === null ? "/login" : "/home"} />} />
              <Route path="/login" element={<Login />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/' element={<Layout token={localitem} />}>
                <Route path='home' element={<Home />} />
                <Route path=':username/' element={<Profile />}>
                  <Route index element={<ProfileTabs isPosts={true} />} />
                  <Route path='tagged/' element={<ProfileTabs isPosts={false} isTagged={true} />} />
                </Route>
              </Route>
            </Routes>
          </PostProvider>
        </SearchProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
