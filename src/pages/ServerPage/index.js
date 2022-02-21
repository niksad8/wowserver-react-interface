import React from 'react';
import WowauctionService from "../../Service/WowauctionService";
import {withRouter} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import RealmBlock from "../../components/RealmBlock";
class ServerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentServer : null,
            id : null,
            realms : []
        }
        this.state.id = props.match.params.id;
        this.auctionservice = new WowauctionService();
    }
    componentDidMount() {
        this.getServerDetails(this.state.id);
    }
    async getServerDetails(id){
        let server_details = await this.auctionservice.getServerList(id);
        let realm_details = await this.auctionservice.getRealmList(id);
        if(!server_details && server_details.length === 0){
            alert("server not found!");
            this.props.history.push("/");
        }
        this.setState({"currentServer":server_details[0], realms : realm_details});
    }
    render(){
        let realms = [];
        if(this.state.realms.length > 0){
            for(let i =0; i < this.state.realms.length; i++)
            {
                realms.push(<RealmBlock key={"realm_"+this.state.realms[i].id} realm={this.state.realms[i]}/>);
            }
        }
        return (<>
            {this.state.currentServer != null  && <h1 className={"text-info"}>{this.state.currentServer.name}</h1>}
            <br/>
            <Row>
                {realms}
            </Row>
        </>);
    }
}
export default withRouter(ServerPage);