import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import WowauctionService from "../../Service/WowauctionService";
import ProfessionBlock from "../../components/ProfessionBlock";
import ItemBlock from "../../components/ItemBlock";
import Currency from "../../components/CurrencyBlock";
import Trend from "../../components/Trend";
import "./professionpage.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
class ProfessionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_term:"",
            faction_id : 0,
            realm_id : 0,
            profession_id : 0,
            profession_name : "",
            proff_records : [],
            loading: true
        }
        this.state.faction_id = props.match.params.faction_id;
        this.state.realm_id = props.match.params.realm_id;
        this.state.profession_id = props.match.params.profession_id;
        this.auctionservice = new WowauctionService();
        this.next_search = "";
    }
    componentDidMount() {
        this.getProfessionStuff();
    }
    async getProfessionStuff(){
        let proff_data = await this.auctionservice.getProfessionData(this.state.realm_id,this.state.faction_id,this.state.profession_id);
        let proff_name = await this.auctionservice.getProfessionList(this.state.profession_id);
        this.setState({"proff_records" : proff_data,profession_name:proff_name[0].name,loading: false});
    }
    async getProffRecords(){
        let proff_data = await this.auctionservice.getProfessionData(this.state.realm_id,this.state.faction_id,this.state.profession_id,this.state.search_term);
        this.setState({"proff_records" : proff_data,loading:false});
        if(this.next_search !== ""){
            setTimeout(this.updateSearchFilter.bind(this,this.next_search),0);
            this.next_search = "";
        }
    }
    updateSearchFilter(val){
        if(!this.state.loading) {
            this.setState({"loading": true, search_term: val});
            this.getProffRecords();
        }
        else {
            this.next_search = val;
        }
    }
    render(){
        let proff_records = [];
        if(this.state.proff_records.length > 0){
            for(let i=0; i < this.state.proff_records.length; i++){
                let record = this.state.proff_records[i];
                proff_records.push(<tr key={"proff_item_"+record.item.id}>
                    <td><ItemBlock item_id={record.item.id} name={record.item.name} color={record.item.color} faction_id={this.state.faction_id} realm_id={this.state.realm_id} icon={record.item.icon_name}/></td>
                    <td><Currency amount={record.bid_mean_amt}/></td>
                    <td><Currency amount={record.buyout_mean_amt}/></td>
                    <td className={"text-white"}>{record.quantity_ah}</td>
                    <td><Currency amount={record.cost_price_amt}/></td>
                    <td><Currency amount={record.profit_amt}/></td>
                    <td><Trend amount={record.trend} printText={true}/></td>
                </tr>);

            }
        }
        return (<>
            <h1 className={"text-info"}>
                Profession
                <span className={"text-warning"}> {this.state.profession_name}</span>
            </h1>
            <br/>
            <div className={"stats-block"}>
                <h4 className={"text-info"}>Other Professions</h4>
                <ProfessionBlock faction_id={this.state.faction_id} realm_id={this.state.realm_id}/>
            </div>
            <br/>
            <br/>
            <div className={"stats-block"}>
                <h3 className={"search-title text-info"}>Please enter the item name to search:</h3>
                <input type={"text"} className={"search-box proff-search"} maxLength={20} onChange={(e)=>{this.updateSearchFilter(e.target.value)}}/>
            </div>
            <div className={"full-width overflow-scroll"}>
                <table className={"table-striped table"}>
                    <thead>
                    <tr className={"text-info"}>
                        <th>Item</th>
                        <th>Bid Mean</th>
                        <th>Buyout Mean</th>
                        <th>Quantity</th>
                        <th>Cost Price</th>
                        <th>Profit</th>
                        <th>Trend</th>
                    </tr>
                    </thead>
                    <tbody>
                    {!this.state.loading && proff_records}
                    {this.state.loading && (<tr><td colSpan={7}><FontAwesomeIcon spin={true} icon={faSpinner} size={"4x"} className={"text-info"}/> </td> </tr>)}
                    </tbody>
                </table>
            </div>
        </>);
    }
}

export default withRouter(ProfessionPage);