import {Component} from "react";
import Button from "react-bootstrap/Button";
import {Row, Col } from "react-bootstrap";
import {withRouter} from "react-router-dom";
import RealmData from "./../RealmData";
import "./RealmBlock.scss";

class ServerBlock extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            realm_name : "",
            desc:"",
            img : "",
            stats : [],
            id : 0,
            avg_price_change : 0
        }
        if(props.realm){
            this.state.realm_name = props.realm.name;
            this.state.desc = props.realm.desc;
            this.state.id = props.realm.id;
            this.state.url = props.realm.url;
            this.state.img = props.realm.img;
            this.state.stats = props.realm.scan_stats;
            this.state.avg_price_change = props.realm.avg_price_change;
        }
    }
    render(){
        let hordeData = null;
        let allyData = null;
        if(this.state.stats[1] || this.state.stats[2]){
            if(this.state.stats[1]){
                hordeData = this.state.stats[1];
            }
            if(this.state.stats[2]){
                allyData = this.state.stats[2];
            }
        }
        return (
            <>
                <Col className={"col-6"}>
                    <div className={"realm-card"}>
                        <h3 className={"text-danger realm-card-heading"}>{this.state.realm_name}</h3>
                        <Row>
                            <Col>
                                {hordeData && <RealmData faction={1} data={hordeData}/>}
                            </Col>
                            <Col>
                                {allyData && <RealmData faction={2} data={allyData}/>}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </>
        );
    }
}

export default withRouter(ServerBlock)