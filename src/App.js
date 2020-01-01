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
        MyName: "",
        MyTop: [],
        Recently: ""
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

  addToFEL() {
    spotifyApi.getMyCurrentPlaybackState().then(data => {
      spotifyApi
        .addTracksToPlaylist("6qv5jMWDQLAOzduW1ZH4cr", [data.item.uri])
        .then(add => {
          console.log(add.snapshot_id);
        });
    });
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState().then(data => {
      spotifyApi.getTrack("31VOknKjFrEX47bZXzqcoF").then(dat => {
        spotifyApi.getAudioAnalysisForTrack(data.item.id).then(d => {
          spotifyApi
            .getMyTopTracks({ limit: 3, time_range: "short_term" })
            .then(top => {
              spotifyApi.getMyRecentlyPlayedTracks({ after: 50 }).then(rec => {
                let temptop = [];
                top.items.map(track => {
                  temptop.push(track.name);
                });
                this.setState({
                  nowPlaying: {
                    name: data.item.name,
                    albumArt: data.item.album.images[0].url,
                    album: data.item.album.name,
                    fav: dat.name,
                    favalbum: dat.album.images[0].url,
                    tempo: d.track.tempo,
                    MyTop: temptop,
                    Recently: rec.items[0].track.name
                  }
                });
                console.log(this.state.Recently);
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
          <h1>Previous Song : {this.state.nowPlaying.Recently}</h1>

          <img
            id="im"
            src={this.state.nowPlaying.albumArt}
            style={{ height: 150 }}
          />
          <div id="temp">
            <h1>
              My Top Tracks:{" "}
              {this.state.nowPlaying.MyTop.map(pop => (
                <ul>
                  <li>{pop}</li>
                </ul>
              ))}
              <br></br>
            </h1>

            <h1>Tempo :{this.state.nowPlaying.tempo}</h1>
          </div>
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
        <div className="container1">
          <div id="main-header3">
            {this.state.loggedIn && (
              <button onClick={() => this.addToFEL()}>
                <h1>Add to playlist</h1>
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
