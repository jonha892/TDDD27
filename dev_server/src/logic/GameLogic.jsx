import React from 'react';
import ReactDOM from 'react-dom';

import GameView from './../views/GameView.jsx'
import levenshteinDistance from './LevenshteinDistance.jsx';

export default class GameLogic extends React.Component {
  constructor() {
    super();

    this.state = {
      currentSong: {
        active: true,
        started: true,
        startDate: 0,
        url: "http://listen.vo.llnwd.net/g3/7/8/8/1/2/1322321887.mp3",
        songStart: 0,
        artist: "Badbadnotgood",
        title: "Time Moves Slow (feat. Sam Herring)",
        record: {
          userName: "User",
          time: "15.32",
          date: "1.2.2021 : 15:46"
        },
        artistElementArray: [],
        titleElementArray: []
      }
    }

    this.processInput = this.processInput.bind(this);
    this.checkInput = this.checkInput.bind(this);
    this.startSong = this.startSong.bind(this);
    this.getSynnonyms = this.getSynnonyms.bind(this);
    this.initViewConnection = this.initViewConnection.bind(this);
  }

  componentDidMount() {
    this.startSong();
    console.log(levenshteinDistance);
  }

  initViewConnection(vC) {
    this.viewConnection = vC;
    return;
  }

  /*
      Starts a new Song. Expects current the server side information in this.state.artist/url/title/record
      */
  startSong() {
    if (this.state.currentSong.started) {
      console.log("song had already started")
    }
    var aArray = this.state.currentSong.artist.split(/[ ,]+/g).map(this.toTAElement);
    var tArray = this.state.currentSong.title.split(/[ ,]+/g).map(this.toTAElement);

    var oldCSState = this.state.currentSong;
    oldCSState.artistElementArray = aArray;
    oldCSState.titleElementArray = tArray;
    oldCSState.startDate = Date.now();
    this.setState({currentSong: oldCSState});

    var newArtistLabel = this.buildLabelString(this.state.currentSong.artistElementArray);
    var newTitleLabel = this.buildLabelString(this.state.currentSong.titleElementArray);

    //update the labels using the viewConnection
    this.viewConnection.updateATLabels(newArtistLabel, newTitleLabel);

    //TODO
    var song = new Audio(this.state.currentSong.url);
    song.src = "http://listen.vo.llnwd.net/g3/5/4/8/1/7/1302071845.mp3";
    song.currentTime = this.state.currentSong.songStart;
    song.volume = 0.3;
    song.play();
  }

  getSynnonyms(s) {
    return [];
  }

  toTAElement(s) {
    //TODO function that determines if a word has to be solved
    var mbs = true;
    //var synn = this.getSynnonyms(s)
    return {
      word: s, synnonyms: [], //synn,
      length: s.length,
      mustBeSolved: mbs,
      hasBeenSolved: !mbs
    };
  }

  processInput(input) {
    if (!this.state.currentSong.active) {
      return;
    }
    console.log("process input")
    var didTAChange = this.checkInput(input);
    var a_s = this.checkIfSolved(this.state.currentSong.artistElementArray);
    var t_s = this.checkIfSolved(this.state.currentSong.titleElementArray);
    if (a_s && t_s) {
      const time = Date.now() - this.state.currentSong.startDate;
      console.log("Song was solved in: " + time + " send time to server")
    }
    if (a_s) {}
    if (t_s) {}
    if (didTAChange) {
      var newArtistLabel = this.buildLabelString(this.state.currentSong.artistElementArray);
      var newTitleLabel = this.buildLabelString(this.state.currentSong.titleElementArray);
      this.viewConnection.updateATLabels(newArtistLabel, newTitleLabel);
    }
  }

  checkInput(input) {
    console.log("GV processing input")
    if (!this.state.currentSong.active) {
      return;
    }

    const inputWords = input.split(" ");
    var d = 0;
    var allowedTypos = 0;
    //copy of state => single refresh of the state at the end instead of
    //multiple changes during loop
    var aArray = this.state.currentSong.artistElementArray;
    var tArray = this.state.currentSong.titleElementArray;
    //flags to recognize if state has to be updated
    var a_s = false;
    var t_s = false;

    for (var i in inputWords) {
      for (var a_i in aArray) {
        var a = aArray[a_i];
        if (a.mustBeSolved && !a.hasBeenSolved) {
          if (a.length > 3) {
            allowedTypos = Math.floor((a.length - 1) / 3);
          } else {
            allowedTypos = 0;
          }

          d = levenshteinDistance(inputWords[i], a.word);
          if (d - allowedTypos <= 0) {
            //Success changes
            console.log("solved ", a.word, "with ", inputWords[i], " d", d, " at", allowedTypos);
            a.hasBeenSolved = true;
            a_s = true;
            continue;
          }
          for (var s_i in a.synnonyms) {
            var s = a.synnonyms[s_i];
            if (a.length > 3) {
              allowedTypos = Math.floor((a.length - 1) / 3);
            } else {
              allowedTypos = 0;
            }

            d = levenshteinDistance(inputWords[i], s);
            if (d - allowedTypos <= 0) {
              //Success changes
              a.hasBeenSolved = true;
              a_s = true;
              break;
            }
          }
        }
      }
      for (var t_i in tArray) {
        var t = tArray[t_i];
        if (t.mustBeSolved && !t.hasBeenSolved) {
          if (t.length > 3) {
            allowedTypos = Math.floor((t.length - 1) / 3);
          } else {
            allowedTypos = 0;
          }

          d = levenshteinDistance(inputWords[i], t.word);
          if (d - allowedTypos <= 0) {
            //Success changes
            t.hasBeenSolved = true;
            t_s = true;
            break;
          }
          for (var s_i in t.synnonyms) {
            var s = t.synnonyms[s_i];
            if (a.length > 3) {
              allowedTypos = Math.floor((a.length - 1) / 3);
            } else {
              allowedTypos = 0;
            }

            d = levenshteinDistance(inputWords[i], s);
            if (d - allowedTypos <= 0) {
              //Success changes
              t.hasBeenSolved = true;
              t_s = true;
              break;
            }
          }
        }
      }
    }
    if (a_s) {
      var cs = this.state.currentSong;
      cs.artistElementArray = aArray;
      console.log(aArray);
      this.setState({currentSong: cs});
    }
    if (t_s) {
      var cs = this.state.currentSong;
      cs.titleElementArray = tArray;
      this.setState({currentSong: cs});
    }
    return (a_s || t_s);
  }

  buildLabelString(taArray) {
    var wordArray = taArray.map(function(ta) {
      if (!ta.mustBeSolved || ta.hasBeenSolved) {
        return ta.word;
      }
      return "*".repeat(ta.length);
    });
    return wordArray.join(" ");
  }

  checkIfSolved(taArray) {
    return taArray.filter(function(ta) {
      return ta.mustBeSolved
    }).reduce(function(acc, ta) {
      return acc && ta.hasBeenSolved;
    }, true);
  }

  render() {
    return <GameView processInputHandle={this.processInput} initHande={this.initViewConnection}/>
  }
}
