import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import WowauctionService from "../../Service/WowauctionService";
import "./ProfessionBlock.scss";

class ProfessionBlock extends Component {
    constructor(props) {
        super(props);
        this.state ={
            'faction_id':this.props.faction_id,
            realm_id : this.props.realm_id,
            professions: []
        }
        this.auctionservice = new WowauctionService();
    }
    componentDidMount() {
        this.getProfessions();
    }

    async getProfessions(){
        let proffs = await this.auctionservice.getProfessionList();
        this.setState({"professions":proffs});
    }
    gotoProfession(id){
        let realm_id = this.state.realm_id;
        let faction_id = this.state.faction_id;
        this.props.history.push("/professions/"+realm_id+"/"+faction_id+"/"+id);
    }
    render(){
        let proff_icons = [];
        for(let i=0; i < this.state.professions.length; i++){
            let proff = this.state.professions[i];
            proff_icons.push(<div key={"proff_"+proff.id} className={"proff-icon"} onClick={()=>{this.gotoProfession(proff.id);}} style={{"backgroundImage":"url(https://web-auctioneer.com/"+proff.icon_url}}/>);
        }
        return (
            <>
                <div className={"profession-block"}>
                    {proff_icons}
                </div>
            </>
        );
    }
}

export default withRouter(ProfessionBlock);