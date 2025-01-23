import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login'
import { Layout } from './Layout'
import { Home } from './pages/Home'
import { UserProvider } from './context/UserContext'
import { Profile } from './pages/Profile'
import { ProfileTabs } from "./components/profile/ProfileTabs"
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
import { MobilePostCreator } from './pages/PostMobileCreator'
import { CaptionMobileCreator } from './pages/CaptionMobileCreator'
import { StoryMobileCreator } from './pages/StoryMobileCreator'
import { StoriesProvider } from './context/StoriesContext'
import { HomeProvider } from './context/HomeContext'
import { SearchProvider } from './context/SearchContext'
import { ForgotPassword } from './pages/ForgotPassword'
import { EditProfile } from './pages/EditProfile'
import { AuthProvider } from './context/AuthContext'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <SearchProvider>
            <PostProvider>
              <ChatProvider>
                <StoriesProvider>
                  <HomeProvider>
                    <Routes>
                      <Route path='/stories/:username/:_id/' element={<Story isOwnProfile={true} />} />
                      <Route path='/stories/archive/:_id/' element={<Story isArchive={true} />} />
                      <Route path='/stories/highlight/:id/' element={<Story isHighLight={true} />} />
                      <Route path='/search/stories/:username/:id/' element={<Story isSearchUser={true} />} />
                      <Route path='/search/stories/highlight/:id/' element={<Story isSearchHighLight={true} />} />
                      <Route path='/accounts/password/forgot/' element={<ForgotPassword />} />
                      <Route path="/login" element={<Login />} />
                      <Route path='/signup' element={<SignUp />} />
                      <Route path='/' element={<Layout />}>
                        <Route path="accounts/edit/" element={<EditProfile />} />
                        <Route path="create/post/" element={<MobilePostCreator />} />
                        <Route path="create/story/" element={<StoryMobileCreator />} />
                        <Route path="create/details/" element={<CaptionMobileCreator />} />
                        <Route path="edit/details/" element={<CaptionMobileCreator />} />
                        <Route path='direct/inbox/' element={<Chat />}>
                          <Route index element={<ChatDiv />} />
                          <Route path='t/:id' element={<UserChat />} />
                        </Route>
                        <Route path=':username/p/:id/' element={<MobilePostPage />} />
                        <Route path='explore/' element={<Explore />} />
                        <Route path="search/:username/" element={<SearchProfile />}>
                          <Route
                            index
                            element={
                              <ProfileTabs
                                isSearchPosts={true}
                                isPosts={false}
                                isTagged={false}
                                isSaved={false}
                              />
                            }
                          />
                        </Route>
                        <Route path='archive/' element={<Archive />}>
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
                  </HomeProvider>
                </StoriesProvider>
              </ChatProvider>
            </PostProvider>
          </SearchProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter >
  )
}

export default App
