import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import WowauctionService from "../../Service/WowauctionService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown,faSpinner, faArrowUp, faBoxes, faChartLine, faClock, faLayerGroup} from "@fortawesome/free-solid-svg-icons";
import {formatDistanceToNowStrict} from "date-fns";
import ProfessionBlock from "./../../components/ProfessionBlock";
import {Row, Col } from "react-bootstrap";
import "./RealmAHData.scss";
import ItemBlock from "../../components/ItemBlock";
import SearchItemBlock from "../../components/SearchItemBlock";
class RealmAHData extends Component {
    constructor(props) {
        super(props);
        this.state ={
            id : this.props.match.params.realm_id,
            server_id : "",
            faction_id : this.props.match.params.faction_id,
            name : "",
            stats : [],
            search_term : "",
            searching : false,
            search_results : []
        }
        this.auctionservice = new WowauctionService();
        this.looking = false;
        this.search_again = false;
    }
    componentDidMount() {
        this.getRealmData();
    }

    async getRealmData(){
        let realm_details = await this.auctionservice.getRealmList("",this.state.id); // get the data for the current realm
        console.log(realm_details);
        realm_details = realm_details[0];
        this.setState({id: realm_details.id,server_id : realm_details.server_id, scan_stats : realm_details.scan_stats[this.state.faction_id], name:realm_details.name });
    }
    async getItems(){
        let term = this.state.search_term;
        this.looking= true;
        let search_results = await this.auctionservice.searchForItem(term,this.state.id,this.state.faction_id);
        this.looking =false;
        this.setState({"search_results":search_results,searching : false});
        if(this.search_again === true){
            this.search_again = false;
            setTimeout(this.getItems.bind(this),0);
        }
    }
    searchUpdate(t){
        this.setState({'search_term':t,"searching":true});
        if(t !== "" && !this.looking) {
            this.getItems();
        } else {
            if(this.looking){
                this.search_again = true;
            }
        }
    }
    render(){
        let stat = null;
        let search_item_display = [];
        let results =this.state.search_results;

        for(let i=0; i < results.length; i++){
            search_item_display.push(<Col><SearchItemBlock item={results[i]} realm_id={this.state.id} faction_id={this.state.faction_id}/></Col>);
        }
        stat = this.state.scan_stats;
        return (
            <>
                {this.state.name !== "" && (<h2 className={"text-success"}>{this.state.name} - <span className={"text-info"}> {parseInt(this.state.faction_id) === 1 ? "Horde" : "Alliance"}</span></h2>)}
                {stat  && <div className={"stats-block"}><h4 className={"text-info"}>Stats</h4>
                <Row>
                    <Col className={"col-6"}>
                        <Row>
                            <Col className={"text-info"}><FontAwesomeIcon className={"text-info"} icon={faLayerGroup}/> Total Listings</Col>
                            <Col className={"text-warning"} align={"right"}>{stat.total_listed}</Col>
                        </Row>
                    </Col>
                    <Col className={"col-6"}>
                        <Row>
                            <Col className={"text-info"}><FontAwesomeIcon className={"text-info"} icon={faBoxes}/> Total Items</Col>
                            <Col className={"text-warning"} align={"right"}>{stat.total_items}</Col>
                        </Row>
                    </Col>
                    <Col className={"col-6"}>
                        <Row>
                            <Col className={"text-info"}><FontAwesomeIcon className={"text-info"} icon={faClock}/> Last Scanned</Col>
                            <Col className={"text-warning"} align={"right"}>{" "+formatDistanceToNowStrict(new Date(stat.datetime+" GMT"))+" ago"}</Col>
                        </Row>
                    </Col>
                    <Col className={"col-6"}>
                        <Row>
                            <Col className={"text-info"}><FontAwesomeIcon className={"text-info"} icon={faChartLine}/> Price Trend</Col>
                            <Col className={"text-warning"} align={"right"}>{(this.state.avg_price_change > 0 ? (<FontAwesomeIcon className={"text-success"} icon={faArrowUp}/>) : (<FontAwesomeIcon className={"text-danger"} icon={faArrowDown}/>))}</Col>
                        </Row>
                    </Col>
                </Row></div>}
                <br/>
                <br/>
                 <div className={"stats-block"}>
                    <h4 className={"text-info"}>Professions</h4>
                    <ProfessionBlock faction_id={this.state.faction_id} realm_id={this.state.id}/>
                </div>
                <br/>
                <div className={"stats-block"}>
                    <h4 className={"text-info"}>Search For Item</h4>
                    <input type={"text"} onChange={(e)=>this.searchUpdate(e.target.value)} value={this.state.search_term} className={"search-box pill-corners search-realm"}/>
                    <button className={"search-button btn btn-info"}>Search</button>
                </div>
                {this.state.searching && <div className={"stats-block"}><h2 className={"text-danger"}>Searching <FontAwesomeIcon icon={faSpinner} spin/></h2> </div> }
                {!this.state.searching && <div className={"stats-block"}>
                    {this.state.search_results.length > 0 && <>
                        <h3 className={"text-info"}>Your Search Results</h3>
                        <Row>
                            {search_item_display}
                        </Row>
                    </>}
                    {this.state.search_results.length === 0 && this.state.search_term !== "" && <h4 className={"text-danger"}>No items with a price history found!</h4>}
                </div>}
            </>
        );
    }
}

export default withRouter(RealmAHData);