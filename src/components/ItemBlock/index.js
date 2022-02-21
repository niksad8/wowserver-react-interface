import React,{Component} from "react";
import {withRouter} from "react-router";
import "./ItemBlock.scss"
import {Link} from "@material-ui/core";

class ItemBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item_id : this.props.item_id,
            name : this.props.name,
            icon : this.props.icon,
            color:this.props.color,
            faction : this.props.faction_id,
            realm_id : this.props.realm_id,
        };
    }
    gotoItem(){
        if(window.$WH)
            window.$WH.Tooltip.hide()
        this.props.history.push("/item/"+this.state.item_id+"/"+this.state.realm_id+"/"+this.state.faction);
    }
    render(){
        let colors = ['grey','black','green','blue','purple','orange','red','gold'];
        let names = ['Poor','Common','Uncommon','Rare','Epic','Legendary','Artifact','Bind to Account'];

        return (
                <table className='table table-borderless'>
                    <tbody>
                        <tr>
                            <td style={{padding:0}}>
                                <div className='mediumicon'>
                                    <div style={{width:36, height:36, left:4, top:4, "backgroundImage":"url("+"https://web-auctioneer.com/"+this.state.icon+")"}}/>
                                </div>
                            </td>
                            <td style={{padding:0}}>
                                <a className={"clickable"} style={{'color':this.state.color==="#000000"?"#ffffff":this.state.color}} rel={'item='+this.state.item_id} onClick={()=>{this.gotoItem()} }>{this.state.name}</a>
                            </td>
                        </tr>
                    </tbody>
                </table>);
    }
}

export default withRouter(ItemBlock);