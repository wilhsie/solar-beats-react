import React, { Component } from "react"

class LikedTrack extends Component {
    render() {
        return (
            <div>
                {this.props.listOfTrackAttributes}
            </div>
        )
    }
}

export default LikedTrack