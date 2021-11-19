import React, { Component } from "react"

class LikedTrack extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.listOfTracks
        }
    }
    render() {
        return (
            <div class="liked-track-container">
                <a href={this.state.data[3]}> <img src={this.state.data[2]} alt=""/> </a>
                <p>{this.state.data[0]} · {this.state.data[1]}</p>
            </div>
        );
    }
}

export default LikedTrack