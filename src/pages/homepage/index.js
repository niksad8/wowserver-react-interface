import React from 'react';
import WowauctionService from "../../Service/WowauctionService";
import ServerBlock from "../../components/ServerBlock";
import {Col, Row} from "react-bootstrap";
class HomePage extends React.Component {
    constructor() {
        super();
        this.state = {
            servers : []
        }
        this.auctionservice = new WowauctionService();
    }
    async getServers(){
        let servers = await this.auctionservice.getServerList();
        this.setState({"servers":servers});
    }
    componentDidMount() {
        this.getServers();
    }

    render(){
        let server_card = [];
        for(let i=0; i < this.state.servers.length; i++){
            server_card.push(<Col key={"svr_block_"+this.state.servers[i].id}><ServerBlock server={this.state.servers[i]}/></Col>);
        }

        return (<>
            <p className={"text-warning h1"}>Please Select Your Server</p>
            <Row>
            {server_card}
            </Row>
            </>);
    }
}
export default HomePage;