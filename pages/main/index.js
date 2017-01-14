import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'

const App = () => (
  <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
    <div style={{ width: '100%' }}>
      <h1>Hello.</h1>
      <ul>
        <li><a href="https://github.com/mjackson">code</a></li>
        <li><a href="https://twitter.com/mjackson">tweets</a></li>
        <li><a href="https://soundcloud.com/mjackson">music</a></li>
      </ul>
    </div>
  </div>
)

ReactDOM.render(
  <App/>,
  document.body
)
