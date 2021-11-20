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
        <div className="flex-wrapper">
          <Header />
          <div className="app-container">
            <p>This site a work in progress, and its only intended use is for testing</p>
            <p>Currently, it can only retrieve liked tracks of the user designated in the backend</p>
            <p>Click the button to see all of SHAY LEON's liked tracks</p>
            <button class="get-likes-button" onClick={() => this.handleClick()}>
              Get List Of Likes
            </button>
            
            <div className="all-liked-tracks-container">
              {
              this.state.handleClickBool 
              ?  this.state.tracks.map((track) => <LikedTrack listOfTracks={track} />)
              : console.log(this.state.handleClickBool)
              }
            </div>
            
          </div>
          <Footer />
        </div>
      </>
    )
  }
}

export default App
