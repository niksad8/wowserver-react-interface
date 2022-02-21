import {Component} from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {withRouter} from "react-router-dom";
import "./ServerBlock.scss";
class ServerBlock extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            server_name : "",
            desc:"",
            img : "",
            last_scanned_at : "",
            realms : [],
            id : 0,
            url : ""
        }
        if(this.props.server){
            this.state.server_name = this.props.server.name;
            this.state.desc = this.props.server.desc;
            this.state.id = this.props.server.id;
            this.state.url = this.props.server.url;
            this.state.img = this.props.server.img;
        }
    }
    openServer(id){
        this.props.history.push("/server/"+id);
    }
    render(){
        return (
            <>
                <Card key={this.state.id} style={{ width: '18rem' }} bg={"dark"} className={"card-block"}>
                    <Card.Body>
                        <Card.Img src={"https://web-auctioneer.com/"+this.state.img} className={"card-images"}/>
                        <Card.Title style={{"color":"white"}}>{this.state.server_name}</Card.Title>
                        <Card.Text style={{"color":"white"}}>
                            {this.state.desc === "" ? "." : this.state.desc}
                        </Card.Text>
                        <Button onClick={()=>{this.openServer(this.state.id)}} variant="primary" block={true}>Go</Button>
                    </Card.Body>
                </Card>
            </>
        );
    }
}

export default withRouter(ServerBlock)