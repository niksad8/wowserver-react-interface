
import './App.css';
import {BrowserRouter as Router, Route} from "react-router-dom";
import HomePage from "./pages/homepage";
import ServerPage from "./pages/ServerPage";
import React from "react";
import Switch from "react-switch";
import {Form,  Navbar} from "react-bootstrap";
import logo from "./images/wowicon.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import WowauctionService from "./Service/WowauctionService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faSave} from "@fortawesome/free-solid-svg-icons";
import RealmAHData from "./pages/RealmAHData";
import ItemPage from "./pages/ItemPage";
import ProfessionPage from "./pages/profession";
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            "servers":[],
            selected_server : "",
            selected_realm : "",
            editMode : false
        };
        this.auctionservice = new WowauctionService();
    }
    async getFullServerList(){
        let x = await this.auctionservice.getFullServerList();
        window.serverList = x;
        this.setState({"servers":x});
    }
    componentDidMount() {
        this.getFullServerList();
        let storage = window.localStorage;
        let server = storage.getItem("server");
        let realm = storage.getItem("realm");
        this.setState({"selected_server":server,"selected_realm":realm});
    }
    quickServerChange(v){
        this.setState({"selected_server":v,"selected_realm":0});
    }
    quickRealmChange(v){
        this.setState({"selected_realm":v});
    }
    saveSelectedRealms(){
        let storage = window.localStorage;
        storage.setItem("server",this.state.selected_server);
        storage.setItem("realm",this.state.selected_realm);
        this.toggleEditMode();
    }
    updateFaction(state){
        let storage = window.localStorage;
        if(!state){
            storage.setItem("faction",1); // horde
        }
        else {
            storage.setItem("faction",2); // alliance
        }
    }
    toggleEditMode(){
        if(this.state.editMode){
            this.setState({"editMode": !this.state.editMode});
        }
        else {
            this.setState({"editMode": !this.state.editMode});
        }
    }
    render() {
        let server_list = [];
        let realm_list = [];
        for(let i=0; i < this.state.servers.length; i++){
            let srv = this.state.servers[i];
            server_list.push((<option key={"server"+srv.id} value={srv.id}>{srv.name}</option>));
        }
        let selected_server_name = "";
        let selected_realm_name = "";
        if(this.state.selected_server > 0){
            let selected_server = this.state.servers.find((v)=>{return v.id === parseInt(this.state.selected_server)});

            if(selected_server) {
                selected_server_name = selected_server.name;
                let realms = selected_server.realms;
                if(this.state.selected_realm > 0){
                    let selected_realm = realms.find(v=>{return v.id === parseInt(this.state.selected_realm)});
                    selected_realm_name = selected_realm.name;
                }
                for (let x = 0; x < realms.length; x++) {
                    let rlm = realms[x];
                    realm_list.push(<option key={"realm" + rlm.id} value={x}>{rlm.name}</option>);
                }
            }
        }

      return (
          <div className="App">
              <header>
                    <Navbar bg="dark" variant="dark">
                        <Navbar.Brand>
                            <img width={30} height="auto" src={logo} alt={""} className={"d-inline-block"}/>
                            {' '} Web Auctioneer
                        </Navbar.Brand>
                        {this.state.selected_server > 0 && <Form inline className={"pull-right"}>
                            {this.state.selected_server > 0 && this.state.selected_realm > 0 && !this.state.editMode &&
                            <Form.Control type={"text"} placeholder={"Search..."} className={"mr-sm-2 pill-corners search-box"}/>}
                            {this.state.editMode && <>
                            <Form.Control as="select" className={"pill-corners"} onChange={(e)=>this.quickServerChange(e.currentTarget.value)} value={this.state.selected_server}>
                                {server_list}
                            </Form.Control>
                            <Form.Control as="select" className={"pill-corners"} onChange={(e)=>this.quickRealmChange(e.currentTarget.value)} value={this.state.selected_realm}>
                                {realm_list}
                            </Form.Control>
                            <Switch onText={"Horde"} offText={"Alliance"} onChange={(e,state)=>this.updateFaction(state)}/>
                            <FontAwesomeIcon onClick={(e)=>{this.saveSelectedRealms()}} icon={faSave} size={"2x"} className={"edit-icon"}/>
                            </>}
                            {!this.state.editMode && <>
                                <span className={"text-warning"}>
                                    Server / Realm : <span className={"text-info"}>{selected_server_name ?? "none"} </span> /
                                    <span className={"text-info"}> { selected_realm_name==="" ? "none": selected_realm_name}</span>
                                    <span> <FontAwesomeIcon onClick={(e)=>{this.toggleEditMode()}} icon={this.state.editMode ? faSave:faEdit}  className={"edit-icon"}/> </span>
                                </span>
                            </>}
                        </Form>}
                        {this.state.selected_server === "" && (<span>Click here to search</span>)}
                    </Navbar>
              </header>
              <div className={"body"}>
                  <Router>
                      <Route path="/server/:id" component={ServerPage}/>
                      <Route exact path="/" component={HomePage}/>
                      <Route path="/realm-ah-data/:realm_id/:faction_id" component={RealmAHData}/>
                      <Route path="/professions/:realm_id/:faction_id/:profession_id" component={ProfessionPage}/>
                      <Route path="/item/:item_id/:realm_id/:faction_id" component={ItemPage}/>
                  </Router>
              </div>
              <footer>

              </footer>
          </div>
      );
  }

}

export default App;
