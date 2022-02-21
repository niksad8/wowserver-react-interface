import React,{Component} from "react";
import {withRouter} from "react-router";
import "./CurrencyBlock.scss"

class Currency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount : this.props.amount,
            canBeNegative : this.props.canbenegative ?? true,
            color:this.props.color ?? "#ffffff",
            negativeColor : "#ff5555"
        }
    }
    render(){
        let amt = this.state.amount <0 ? this.state.amount * -1 : this.state.amount;
        let oamt = parseInt(amt);
        let text_color = this.state.amount < 0 ? this.state.negativeColor : this.state.color;
        let c = oamt % 100;
        oamt = Math.floor(oamt/100);
        let s = oamt % 100;
        oamt = Math.floor(oamt/100);
        let g = oamt;
        let g_part =(g > 0)?(<span style={{"color":text_color}} className='currencygold'>{g}</span>):"";
        let s_part =(s > 0)?(<span style={{"color":text_color}} className='currencysilver'>{s}</span>):"";
        let c_part =(c > 0)?(<span style={{"color":text_color}} className='currencycopper'>{c}</span>):"";
        return (<>{g_part}{s_part}{c_part}</>);
    }
}

export default Currency;