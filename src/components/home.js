import React, { Component } from 'react';
import ListView from './listView';
import firebase from 'firebase';



class Home extends Component {
    constructor(props){
      super(props);
      this.commit = this.commit.bind(this);
      var config = {
        apiKey: "AIzaSyBn6s9oseMfcABQ3GSAddksmdRO_vS8WUs",
        authDomain: "itd-coding-challenge.firebaseapp.com",
        databaseURL: "https://itd-coding-challenge.firebaseio.com",
        projectId: "itd-coding-challenge",
        storageBucket: "itd-coding-challenge.appspot.com",
        messagingSenderId: "1002981442117"
      };
      firebase.initializeApp(config);
      firebase.database().ref('messages/').set({});
      this.id = 1;
    }

    commit(id,text){
      console.log("committing " + id)
      firebase.database().ref('messages/').push({
        id: id,
        text: document.getElementById("writeToDb").value,
        timeStamp : Date.now(),
        time: document.getElementById("time").value
      });
      this.id+=1;
      document.getElementById("writeToDb").value = "";
      document.getElementById("time").value = "";
    }

    render() {
      return (
        <div className="container">
            <div>
              <div>
              <p>Store This:&emsp;</p>
              </div>
              <div style={{display:"flex", marginBottom:"20px"}}>
              <input placeholder="Data To Store" id="writeToDb" className="form-control" onKeyPress={(e) => {(e.key === 'Enter' ? this.commit(this.id) : null)}}></input>
              <input style={{marginLeft:"10px"}} placeholder="Time (default 30)" id="time" className="form-control" onKeyPress={(e) => {(e.key === 'Enter' ? this.commit(this.id) : null)}}></input>
              <button onClick={()=>{this.commit(this.id)}} className="btn btn-light" style={{marginLeft:"10px"}}>Commit</button>
              </div>
            </div>
            <div className="container">
            <ListView database={firebase}/>
            </div>
        </div>
      );
    }
  }

export default Home;