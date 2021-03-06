import React, { useState, useEffect, useRef } from 'react'
import { Tab } from '@material-ui/core'
import { TabContext, TabList, TabPanel } from '@material-ui/lab'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import Feed from '../components/Feed'
import NotFound from './404'
import Loading from '../components/utils/Loading'
import Summary from '../components/Summary'
import classes from '../styles/profile.module.css'
import placeholder from '../assets/classic.png'
import { getUser, getProfile, updateProfilePic } from '../actions'

const Profile = ({
    user, profile, loading, loaded, getProfile, updateProfilePic,
}) => {
    const Input = useRef(null)
    const Image = useRef(null)
    const [tab, setTab] = useState('Feed')
    const [posts, setPosts] = useState([])
    const { username } = useParams()

    useEffect(() => {
        const getPosts = async () => {
            try {
                await getUser()
                await getProfile(username)
                const result = await Promise.all(profile.images.map(({ id }) => axios.get(`/image/${id}`)))
                if (user?.username === username) setPosts(result.map(({ data }) => data.image))
                else setPosts(result.map(({ data }) => data.image).filter(image => !image.private))
            } catch (err) {
                // do nothing
            }
        }
        getPosts()
    }, [profile])

    const handleImageUpload = async () => {
        const formData = new FormData()
        formData.append('myImage', Image.current.file)
        await updateProfilePic(formData)
    }

    const handleImageSelect = e => {
        const [file] = e.target.files
        if (file) {
            const reader = new FileReader()
            const { current } = Image
            current.file = file
            reader.onload = e => {
                current.src = e.target.result
            }
            reader.readAsDataURL(file)
            handleImageUpload()
        }
    }

    const handleClick = () => {
        if (user?.username === username) Input.current.click()
    }

    const ProfilePage = () => {
        const {
            imageUrl, givenName, username = givenName?.toLowerCase(),
        } = profile
        return (
            <>
                <div className={classes.profile}>
                    <input ref={Input} type="file" accept="image/*" onChange={handleImageSelect} hidden />
                    <img
                        ref={Image}
                        src={imageUrl || placeholder}
                        className={classes.picture}
                        onClick={handleClick}
                    />
                    <div className={classes.details}>
                        <p>{username}</p>
                        <p style={{ fontSize: 'small' }}>
                            {`${posts.length} posts`}
                        </p>
                    </div>
                </div>
                <TabContext value={tab}>
                    <TabList
                        variant="fullWidth"
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={(e, v) => setTab(v)}
                    >
                        <Tab value="Feed" label="Posts" />
                        <Tab value="Summary" label="Summary" />
                    </TabList>
                    <TabPanel value="Feed">
                        <Feed posts={posts} />
                    </TabPanel>
                    <TabPanel value="Summary">
                        <Summary />
                    </TabPanel>
                </TabContext>
            </>
        )
    }
    return loading ? <Loading /> : (loaded ? <ProfilePage /> : <NotFound />)
}

export default connect(({ user, profile }) => ({
    ...profile,
    user: user.user,
}), { getUser, getProfile, updateProfilePic })(Profile)
