import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp,faArrowDown} from "@fortawesome/free-solid-svg-icons";
import {withRouter} from "react-router";

class Trend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount : this.props.amount,
            printText : this.props.printText ?? false
        };
    }
    render(){
        return (<>
            {this.state.amount >= 0 && <FontAwesomeIcon icon={faArrowUp} className={"text-success"}/>}
            {this.state.amount < 0 && <FontAwesomeIcon icon={faArrowDown} className={"text-danger"}/>}
            {this.state.printText && <span className={this.state.amount >= 0? "text-success":"text-danger"}>{Math.round(this.state.amount*100)+"%"}</span>}
            </>);
    }
}

export default withRouter(Trend);