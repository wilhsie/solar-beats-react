import React, { Component } from "react"

class Header extends Component {
    render() {
      return (
        <div className="header">
          <h1>SOLAR BEATS</h1>
          <h2>Built using React.js, Netlify, and FaunaDB — designed to make it easier to view liked tracks on SoundCloud</h2>
        </div>
      );
    }
}

export default Header