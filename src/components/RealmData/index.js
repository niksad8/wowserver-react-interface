import {React,Component} from "react";
import horde from "../../images/horde.svg";
import alliance from "../../images/alliance.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp, faBoxes, faChartLine, faClock, faLayerGroup} from "@fortawesome/free-solid-svg-icons";
import {formatDistanceToNowStrict} from "date-fns";
import {Button} from "react-bootstrap";
import {withRouter} from "react-router-dom";

class RealmData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.data.realm_id,
            total_listed : props.data.total_listed,
            total_items : props.data.total_items,
            datetime : props.data.datetime,
            avg_price_change : props.data.avg_price_change,
            image : props.faction === 1 ? horde : alliance,
            faction : props.faction
        };
    }
    gotoFaction(id){
        this.props.history.push("/realm-ah-data/"+this.state.id+"/"+id);
    }
    render(){
        return (
            <div className={"realm-card-faction-details"}>
                <table width={"100%"}>
                    <tbody>
                    <tr>
                        <td>
                            <img alt={"horde"} src={this.state.image} className={"realm-card-faction-logo"}/>
                        </td>
                        <td>
                            <table width={"100%"}>
                                <tbody>
                                <tr>
                                    <td><FontAwesomeIcon className={"text-info"} icon={faLayerGroup}/></td>
                                    <td className={"text-info"} align={"right"}>{this.state.total_listed}</td>
                                </tr>
                                <tr>
                                    <td><FontAwesomeIcon className={"text-info"} icon={faBoxes}/></td>
                                    <td className={"text-info"} align={"right"}>{this.state.total_items}</td>
                                </tr>
                                <tr>
                                    <td><FontAwesomeIcon className={"text-info"} icon={faClock}/></td>
                                    <td className={"text-info"} align={"right"}>{" "+formatDistanceToNowStrict(new Date(this.state.datetime))+" ago"}</td>
                                </tr>
                                <tr>
                                    <td><FontAwesomeIcon className={"text-info"} icon={faChartLine}/></td>
                                    <td className={"text-info"} align={"right"}>{(this.state.avg_price_change > 0 ? (<FontAwesomeIcon className={"text-success"} icon={faArrowUp}/>) : (<FontAwesomeIcon className={"text-danger"} icon={faArrowDown}/>))}</td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <Button onClick={()=>{this.gotoFaction(this.state.faction)}} variant={"info"} className={"btn-block"}>Go</Button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withRouter(RealmData);