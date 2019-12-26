import React, { Component } from "react";
import "./spotify.css";
import Button from "react-bootstrap/Button";
// import "bootstrap/dist/css/bootstrap.min.css";
import SpotifyWebApi from "spotify-web-api-js";
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: {
        name: "Not Checked",
        albumArt: "",
        album: "Not Checked",
        fav: "",
        favalbum: "",
        tempo: "",
        albums: []
      }
    };
  }
  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState().then(data => {
      spotifyApi.getTrack("31VOknKjFrEX47bZXzqcoF").then(dat => {
        spotifyApi
          .getAudioAnalysisForTrack("31VOknKjFrEX47bZXzqcoF")
          .then(d => {
            spotifyApi.getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE").then(alb => {
              console.log(alb.items[0].name);
              this.setState({
                nowPlaying: {
                  name: data.item.name,
                  albumArt: data.item.album.images[0].url,
                  album: data.item.album.name,
                  fav: dat.name,
                  favalbum: dat.album.images[0].url,
                  tempo: d.track.tempo,
                  albums: alb.body
                }
              });
            });
          });
      });
    });
  }

  render() {
    return (
      <div className="App">
        <section id="showcase">
          <div className="container">
            <a href="http://localhost:8888"> Login to Spotify </a>
          </div>
        </section>
        <section id="main2">
          <h1>Now Playing: {this.state.nowPlaying.name}</h1>
          <h1>Album : {this.state.nowPlaying.album}</h1>
          <img
            id="im"
            src={this.state.nowPlaying.albumArt}
            style={{ height: 150 }}
          />
          <div id="temp">
            <h1>Tempo :{this.state.nowPlaying.tempo}</h1>
          </div>
          {/* {this.getFav()}; */}
          <div className="fav">
            <h1>Favorite track: {this.state.nowPlaying.fav}</h1>
            <img src={this.state.nowPlaying.favalbum} style={{ height: 150 }} />
          </div>
        </section>
        <div className="container1">
          <div id="main-header3">
            {this.state.loggedIn && (
              <button onClick={() => this.getNowPlaying()}>
                <h1>Check Now Playing</h1>
              </button>
            )}
            <hr></hr>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
