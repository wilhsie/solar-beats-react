import React, { Component } from "react"
import Header from './components/header';
import Footer from './components/footer';
import LikedTrack from './components/likedTrack';
import "./App.css"
import fetch from "node-fetch"

class App extends Component {
  state = {
    tracks: [],
    handleClickBool: false
  }

  async handleClick() {

    /**
     * it seems like we want to fetch the data on handleClick, butttttt
     * we can't render onClick, so we need to store the data, and then render seperately..?
     * 
     */

    let tracks = await fetch('/.netlify/functions/db-get-liked-tracks')
    .then(response => response.json())
    .then((user) => {
      // console.log(user.tracks)
      return user.tracks
    })
    // console.log(tracks)

    // so react can't store objects in setState keys, lets try to extract our track objects to be lists perhaps?

    let trackInfo = []
    let trackList = []

    tracks.forEach((t) => {
      trackInfo.push(t.track_name)
      trackInfo.push(t.track_artist)
      trackInfo.push(t.track_img)
      trackInfo.push(t.track_url)
      trackList.push(trackInfo)
      trackInfo = []
    })

    // console.log(trackList)

    this.setState({
      tracks: trackList,
      handleClickBool: true
    })
  }

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

          <button onClick={() => this.handleClick()}>
            Get List Of Likes
          </button>

          {
          this.state.handleClickBool 
          ?  this.state.tracks.map((track) => <LikedTrack listOfTracks={track} />)
          : console.log(this.state.handleClickBool)
          }
          
        </div>
        <Footer />
      </>
    )
  }
}

export default App
