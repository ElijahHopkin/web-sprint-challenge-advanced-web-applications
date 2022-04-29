import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import axiosWithAuth from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(null)
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/')}
  const redirectToArticles = () => { navigate('/articles') }
  
  // console.log('working current id:', currentArticleId)

  const logout = () => {
    if (localStorage.getItem('token')){
      navigate('/articles')
      localStorage.removeItem('token')
      setMessage('Goodbye!')
    }
  }

  const login = ( {username, password} ) => {
    setMessage('')
    setSpinnerOn(true)
    axios
      .post(loginUrl, {username, password})
      .then(res => {
        // console.log(res)
        localStorage.setItem('token', res.data.token)
        setMessage(res.data.message)
        navigate('/articles')
        setSpinnerOn(false)
      })
      .catch(err => {
        // console.log({err})
        setMessage(err.message)
        redirectToLogin
        setSpinnerOn(false)
      })
  }

  const getArticles = () => {
    setMessage('');
    setSpinnerOn(true)
    axiosWithAuth()
      .get(articlesUrl)
      .then(res => {
        setArticles(res.data.articles)
        setMessage(res.data.message)
        // console.log(res)
        setSpinnerOn(false)
      })
      .catch(err => {
        console.log({err})
        setMessage(err.message)
        navigate('/')
        setSpinnerOn(false)
      })
  }

  const postArticle = article => {
    setSpinnerOn(true)
    setMessage('')
    axiosWithAuth()
      .post(articlesUrl, article)
      .then(res => {
        setArticles([
          ...articles,
          article
        ])
        setMessage(res.data.message)
        setSpinnerOn(false)
        // console.log(res)
      })
      .catch(err => {
        // console.log({err})
        setMessage(err.message)
        setSpinnerOn(false)
      })
  }


  const updateArticle = (article ) => {
    setMessage('')
    setSpinnerOn(true)
    const {article_id, ...changes} = article
    axiosWithAuth()
      .put(`${articlesUrl}/${article_id}`,  changes)
      .then(res => {
        console.log(res)
        setArticles(articles.map (art => {
          return art.article_id===article_id
          ? res.data.article
          : art
        }))
        setMessage(res.data.message)
        setCurrentArticleId(null)
        setSpinnerOn(false)          
        })
      .catch(err => {
        console.log({err})
        setMessage(err.message)
        setSpinnerOn(false)
      })
    // ✨ implement
    // You got this!
  }

  const deleteArticle = article_id => {
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth()
      .delete(`${articlesUrl}/${article_id}`)
      .then(res => {
        console.log(res)
        setArticles(articles.filter(art => {
          return art.article_id !==article_id
        }))
        setMessage(res.data.message)
        setSpinnerOn(false)
      })
      .catch(err => {
        console.log({err})
      })
    // ✨ implement
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner on = {spinnerOn}/>
      <Message message= {message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login = {login}/>} />
          <Route path="articles"  element={
            <>
              <ArticleForm 
              postArticle={postArticle}
              updateArticle={updateArticle}
              setCurrentArticleId={setCurrentArticleId}
              currentArticleId= {currentArticleId}
              />
              <Articles 
              getArticles={getArticles}
              deleteArticle= {deleteArticle}
              articles = {articles}
              setCurrentArticleId= {setCurrentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  )
}
