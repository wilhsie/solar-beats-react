import React, { Component } from "react"
import Header from './components/header';
import Footer from './components/footer';
import "./App.css"

class App extends Component {
  render() {
    return (
      <>
        <Header />
        <div className="app-container">
          <h1>SOLAR BEATS</h1>
          <h2>Built using React.js and Netlify — designed to provide music selection based on your local weather</h2>
          <p>Okay, new idea... "SoundCloud Viewer Tool" - Makes it easier to view your liked tracks on soundcloud</p>
          <iframe
            title="soundcloud" 
            width="100%" 
            height="300" 
            scrolling="no" 
            frameborder="no" 
            allow="autoplay" 
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/387123665&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
          >
          </iframe>
          <div 
            style={{
              fontSize: '10px',
              color: '#cccccc',
              lineBreak: 'anywhere',
              wordBreak: 'normal',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              fontFamily: 'Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif',
              fontWeight: 100
            }}
          >
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

export default App
