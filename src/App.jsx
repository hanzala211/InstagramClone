import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login'
import { Layout } from './Layout'
import { Home } from './pages/Home'
import { SearchProvider, UserProvider } from './context/UserContext'
import { Profile } from './pages/Profile'
import { ProfileTabs } from './components/profile/ProfileTabs'
import { SignUp } from './pages/SignUp'
import { Story } from './pages/Story'
import { Archive } from './pages/Archive'
import { SearchProfile } from './pages/SearchProfile'
import { Explore } from './pages/Explore'
import { PostProvider } from './context/PostContext'
import { ArchiveStories } from './components/archives/ArchiveStories'
import { MobilePostPage } from './pages/MobilePostPage'
import { Chat } from './pages/Chat'
import { ChatDiv } from './components/chats/ChatDiv'
import { ChatProvider } from './context/ChatContext'
import { UserChat } from './components/chats/UserChat'

function App() {
  const localitem = JSON.parse(localStorage.getItem("token"))
  return (
    <BrowserRouter>
      <UserProvider>
        <SearchProvider>
          <PostProvider>
            <ChatProvider>
              <Routes>
                <Route path='/stories/:username/:_id/' element={<Story isOwnProfile={true} />} />
                <Route path='/stories/archive/:_id/' element={<Story isArchive={true} />} />
                <Route path='/stories/highlight/:id/' element={<Story isHighLight={true} />} />
                <Route path='/search/stories/:username/:id/' element={<Story isSearchUser={true} />} />
                <Route path='/search/stories/highlight/:id/' element={<Story isSearchHighLight={true} />} />
                <Route index element={<Navigate to={localitem === null ? "/login" : "/home"} />} />
                <Route path="/login" element={<Login />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path='/' element={<Layout token={localitem} />}>
                  <Route path='direct/inbox/' element={<Chat />}>
                    <Route index element={<ChatDiv />} />
                    <Route path='t/:id/' element={<UserChat />} />
                  </Route>
                  <Route path=':username/p/:id/' element={<MobilePostPage />} />
                  <Route path='explore/' element={<Explore />} />
                  <Route path='/search/:username/' element={<SearchProfile />}>
                    <Route index element={<ProfileTabs isSearchPosts={true} isPosts={false} isTagged={false} isSaved={false} />} />
                  </Route>
                  <Route path='/archive/' element={<Archive />}>
                    <Route path="stories/" element={<ArchiveStories />} />
                  </Route>
                  <Route path='home' element={<Home />} />
                  <Route path=':username/' element={<Profile />}>
                    <Route index element={<ProfileTabs isPosts={true} />} />
                    <Route path='tagged/' element={<ProfileTabs isPosts={false} isTagged={true} />} />
                    <Route path='saved/' element={<ProfileTabs isPosts={false} isTagged={false} isSaved={true} />} />
                  </Route>
                </Route>
              </Routes>
            </ChatProvider>
          </PostProvider>
        </SearchProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
