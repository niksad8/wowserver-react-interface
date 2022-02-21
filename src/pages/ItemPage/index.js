import React, {Component} from "react";
import LineGraph from "./LineChart";
import ReactDOMServer from "react-dom/server";
import {withRouter} from "react-router-dom";
import {format} from "date-fns";
import "./ItemPage.scss";
import WowauctionService from "../../Service/WowauctionService";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col,Row} from "react-bootstrap";
import {formatDistanceToNowStrict} from "date-fns";
import Currency from "../../components/CurrencyBlock";
import Trend from "../../components/Trend";
import Chart from "react-google-charts";

class ItemPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item_id : parseInt(this.props.match.params.item_id),
            realm_id : parseInt(this.props.match.params.realm_id),
            faction_id : parseInt(this.props.match.params.faction_id),
            item_data : null,
        };
        this.wowauction = new WowauctionService();
    }
    async fetchItemDetails(){
        let data =await this.wowauction.getItemDetails(this.state.item_id,this.state.realm_id,this.state.faction_id);
        this.setState({"item_data" : data});
    }
    componentDidMount(){
        this.fetchItemDetails();
        let items = document.querySelectorAll(".build-link");
        console.log(items);
        for(let i=0; i < items.length; i++){
            items[i].addEventListener("click",this.openItem.bind(this));
        }

    }
    openItem(e){
        alert(e.target.attributes['data-url']);
    }
    render(){
        if(this.state.item_data == null)
            return (<><FontAwesomeIcon className={"text-info"} icon={faSpinner} spin size={"4x"}/></>)
        else {
            let server_list = window.serverList;

            let currentRealm = null;
            for(let i=0; i < server_list.length; i++){
                let realms = server_list[i].realms;
                for(let x= 0; x < realms.length; x++){
                    if(this.state.realm_id === realms[x].id){
                        currentRealm = realms[x];
                    }
                }
            }

            let current_server= null;
            if(currentRealm)
                current_server= server_list.find(x => x.id === currentRealm.id);
            let item = this.state.item_data;

            let used_data = [['Name', 'Manager', 'ToolTip'],

            ];
            for(let x = 0; x < item.used_in.length; x++){
                let build_item = item.used_in[x];

                chart_data.push([{v:build_item.itemid,f:ReactDOMServer.renderToStaticMarkup(<><h5 data-url={"/"+build_item.itemid+'/'+this.state.realm_id+'/'+this.state.faction_id} className="build-link clickable text-info">{build_item.item_name}</h5><br/></>)+
                        '<img src="https://web-auctioneer.com'+build_item.item_icon+'" alt=""><br>' +
                        '<h4 class="text-danger">x'+build_item.quantity+'</h4><br/><br/>' +
                        '<div class="text-info">Median Buyout</div><div class="text-warning"><b>'+ReactDOMServer.renderToStaticMarkup(<Currency color={"coral"} amount={build_item.buyout_median}/>)+'</b></div>' +
                        '<div class="text-info">Quantity in AH</div><div><b style="color:coral">'+build_item.quantity+'</b></div>' +
                        '<div class="text-info">Total </div><div><b style="color:coral">'+ReactDOMServer.renderToStaticMarkup(<Currency color={"coral"} amount={build_item.buyout_median*build_item.result_quantity}/>)+'</b></div>' +
                        ''},'Mainitem','']);
            }

            let chart_data = [['Name', 'Manager', 'ToolTip'],
                [
                    {
                        v: 'Mainitem',
                        f: '<h5 class="text-info">'+this.state.item_data.item_name+'</h5><br/><img src="https://web-auctioneer.com'+item.item_icon+'" alt=""><br/><br/>'
                    },
                    '',
                    '',
                ]
            ];
            let bo_cost = 0;
            let bid_cost = 0;
            let result_quantity = 0;
            for(let x = 0; x < item.build_data.length; x++){
                let build_item = item.build_data[x];
                result_quantity = build_item.created_quantity;
                bo_cost += (build_item.buyout_median*build_item.quantity);
                bid_cost += (build_item.bid_median*build_item.quantity);

                chart_data.push([{v:build_item.itemid,f:ReactDOMServer.renderToStaticMarkup(<><h5 data-url={"/"+build_item.itemid+'/'+this.state.realm_id+'/'+this.state.faction_id} className="build-link clickable text-info">{build_item.item_name}</h5><br/></>)+
                        '<img src="https://web-auctioneer.com'+build_item.item_icon+'" alt=""><br>' +
                        '<h4 class="text-danger">x'+build_item.quantity+'</h4><br/><br/>' +
                        '<div class="text-info">Median Buyout</div><div class="text-warning"><b>'+ReactDOMServer.renderToStaticMarkup(<Currency color={"coral"} amount={build_item.buyout_median}/>)+'</b></div>' +
                        '<div class="text-info">Quantity in AH</div><div><b style="color:coral">'+build_item.quantity+'</b></div>' +
                        '<div class="text-info">Total </div><div><b style="color:coral">'+ReactDOMServer.renderToStaticMarkup(<Currency color={"coral"} amount={build_item.buyout_median*build_item.result_quantity}/>)+'</b></div>' +
                        ''},'Mainitem','']);
            }
            bo_cost = bo_cost/result_quantity;
            bid_cost = bid_cost/result_quantity;
            chart_data.push(
            [
                {
                    v: 'Mainitem',
                    f: '<h5 class="text-info">'+this.state.item_data.item_name+'</h5><br/><img src="https://web-auctioneer.com'+item.item_icon+'" alt=""><br/><h4 class="text-danger">x'+result_quantity+'</h4><br/>'
                },
                '',
                '',
            ]);
            let cost_price_series = [];
            let bid_series = [];
            let buyout_series = [];
            let quantity_series = [];
            let limit_ts = (new Date()).getTime()/1000 - 31 * 24*60*60;
            let total_buyout = 0;
            let cnt =0;
            for(let x =0; x < item.chart_data.length; x++){
                let dat = item.chart_data[x];
                let ts = dat.timestamp

                if(ts > limit_ts) {
                    let bid = dat.bid_median;
                    let buyout = dat.buyout_median;
                    let cp = dat.cost_price;
                    let q = dat.quantity;
                    cnt ++;
                    total_buyout += parseInt(buyout) / 10000;
                    bid_series.push({x: ts, y: bid});
                    buyout_series.push({x: ts, y: buyout});
                    cost_price_series.push({x: ts, y: cp});
                    quantity_series.push({x: ts, y: q});
                }
            }

            let distortion = (total_buyout / cnt)*2;
            let quantity_chart_data = {
                datasets : [
                    {
                        "label": "Quantity",
                        data: quantity_series,
                        fill : true,
                        borderColor: "rgb(175,216,248)",
                        backgroundColor: "rgba(175,216,248,0.5)",
                    }
                ]
            }
            let price_chart_data = {
                datasets : [
                {
                    "label": "Lowest Min Cost Price",
                    data: cost_price_series,
                    borderColor: "rgb(203,75,75)",
                    backgroundColor: "rgba(203,75,75,0.5)",
                    fill : true
                },
                {
                    "label": "Median Bid",
                    data: bid_series,
                    borderColor: "rgb(175,216,248)",
                    //borderWidth: '4px',
                    //pointBorderWidth: "6px",
                    //pointRadius: "6px",
                    backgroundColor: "rgba(175,216,248,0.5)",
                    fill : true
                },
                {
                    "label": "Median Buyout",
                    borderColor: "rgb(237,194,64)",
                    backgroundColor: "rgba(237,194,64,0.5)",
                    data: buyout_series,
                    fill : true
                }
            ]};

            let price_chart_options ={
                backgroundColor: "white",
                aninmations: {
                    y: {
                        easing: 'easeInOutElastic'
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color : "#17a2b8",
                        }

                    },
                    tooltip: {
                        callbacks:{
                            title : function(arg){
                                return arg[0].dataset.label;
                            },
                            label : function(arg){
                                let x = arg.raw.x;
                                let y = arg.raw.y;
                                let g= Math.floor(y / 10000);
                                let dt = new Date(x*1000);
                                return [g+"G",format(dt,"dd MMMM")];
                            }
                        }
                    }
                },
                responsive: true,
                interactions: {
                    mode: "index"
                },
                scales : {
                    x:{
                        grid : {
                            color : "#17a2b866"
                        },
                        type:"linear",
                        ticks : {
                            color : "#17a2b8",
                            callback: function(val, index){
                                let x= new Date(val*1000);
                                return format(x, "dd MMMM");
                            }
                        },
                        title: {
                            display: true,
                            text: 'Date',
                            color: "#17a2b8"
                        }
                    },y: {
                        grid : {
                            color : "#17a2b866"
                        },

                        min : 0,
                        max : (distortion*10000) + 10,
                        ticks : {
                            color: "#17a2b8",
                            callback: function(val, index){
                                let g = Math.floor(val / 10000);
                                return g;
                            }

                        },
                        title: {
                            display: true,
                            text: 'Amount',
                            color: "#17a2b8"
                        }
                    }
                }
            };
            let quantity_chart_options = {};
            quantity_chart_options = JSON.parse(JSON.stringify(price_chart_options));
            quantity_chart_options.scales.x ={
                    type:"linear",
                        ticks : {
                        color : "#17a2b8",
                            callback: function(val, index){
                            let x= new Date(val*1000);
                            return format(x, "dd MMMM");
                        }
                    },
                    title: {
                        display: true,
                            text: 'Date',
                            color: "#17a2b8"
                    }
                };
            quantity_chart_options.plugins.tooltip.callbacks = {
                title : function(arg){

                    return arg[0].dataset.label;
                },
                label : function(arg){
                    let x = arg.raw.x;
                    let y = arg.raw.y;

                    let dt = new Date(x*1000);
                    return [y,format(dt,"dd MMMM")];
                }
            };

            quantity_chart_options.scales.x.grid= {
                    color : "#17a2b866"
            }
            quantity_chart_options.scales.y = {
                grid : {
                    color : "#17a2b866"
                },
                ticks : {
                    color: "#17a2b8",
                },
                title: {
                    display: true,
                    text: 'Quantity',
                    color: "#17a2b8"
                }
            };
            let ah_rows = [];
            for(let x = 0; x < item.auctions.length; x++){
                let auction = item.auctions[x];
                ah_rows.push(<tr id={"auction_row_"+x}>
                    <td>{auction.posted_by}</td>
                    <td>{auction.quantity}</td>
                    <td><Currency amount={auction.bid_amount}/></td>
                    <td><Currency amount={auction.buyout}/></td>
                    <td><Currency amount={bid_cost - auction.bid_amount}/> / <Currency amount={bo_cost - auction.buyout}/></td>
                    <td>{auction.timeleft}</td>
                </tr>);
            }
            return (<>
                <h2 className={"text-info"}>Item <span
                    className={"text-warning"}>{this.state.item_data.item_name}</span>
                </h2>
                <h3 className={"text-info"}>Server / Realm / Faction : <span
                    className={"text-warning"}>{current_server != null?current_server.name : ""}</span> / <span
                    className={"text-warning"}>{currentRealm != null? currentRealm.name : ""}</span> / <span
                    className={"text-warning"}>{this.state.faction_id === 1 ? "Horde" : "Alliance"}</span>
                </h3>
                <div className={"stats-block item-stats"}>
                    <h3 className={"text-info"}>Item Statistics</h3>
                    <Row>
                        <Col>
                            <h5 className={"text-warning"}>Scanned</h5>
                            <div className={"text-white"}>{" "+formatDistanceToNowStrict(new Date(item.datetime))+" ago"}</div>
                        </Col>
                        <Col>
                            <h5 className={"text-warning"}>Quantity In Ah</h5>
                            <div className={"text-white"}>{item.quantity}</div>
                        </Col>
                        <Col>
                            <h5 className={"text-warning"}>Min Bid Price</h5>
                            <div className={"text-white"}><Currency amount={item.bid_min}/></div>
                        </Col>
                        <Col>
                            <h5 className={"text-warning"}>Min Buyout Price</h5>
                            <div className={"text-white"}><Currency amount={item.buyout_min}/></div>
                        </Col>
                        <Col>
                            <h5 className={"text-warning"}>Average Bid Price</h5>
                            <div className={"text-white"}><Currency amount={item.bid_mean}/></div>
                        </Col>
                        <Col>
                            <h5 className={"text-warning"}>Average Buyout Price</h5>
                            <div className={"text-white"}><Currency amount={item.buyout_mean}/></div>
                        </Col>
                        <Col>
                            <h5 className={"text-warning"}>Median Bid Price</h5>
                            <div className={"text-white"}><Currency amount={item.bid_median}/></div>
                        </Col>
                        <Col>
                            <h5 className={"text-warning"}>Median Buyout Price</h5>
                            <div className={"text-white"}><Currency amount={item.buyout_median}/></div>
                        </Col>
                        <Col>
                            <h5 className={"text-warning"}>Price Change</h5>
                            <div className={"text-white"}><Trend amount={item.buyout_median_last_compare}/></div>
                        </Col>
                    </Row>
                </div>
                <br/>
                {item.build_data && item.build_data.length > 0 && <div className={"stats-block"}>
                    <h3 className={'text-info'}>Item Recipe</h3>
                    <Row>
                        <Col>
                            <Chart chartType={"OrgChart"} width={"100%"} loader={"<div>Loading Chart</div>"} data={chart_data}
                                   options={{
                                       allowHtml: true,
                                   }}
                                   rootProps={{ 'data-testid': '1' }}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h4 className={"text-info"}>Cost Price Bid/Buyout :<span className={"text-warning"}><Currency amount={bid_cost}/></span> / <span className={"text-warning"}><Currency amount={bo_cost}/></span></h4>
                            <h4 className={"text-info"}>Average Profit From Bid/Buyout :<span className={"text-warning"}><Currency amount={item.bid_median - bid_cost}/></span> / <span className={"text-warning"}><Currency amount={item.buyout_median - bo_cost}/></span></h4>
                        </Col>
                    </Row>
                    <br/>
                </div> }
                {item.used_in && item.used_in.length > 0 && <div className={"stats-block"}>
                    <h3 className={'text-info'}>Item Used In</h3>
                    <Row>
                        <Col>
                            <Chart chartType={"OrgChart"} width={"100%"} loader={"<div>Loading Chart</div>"} data={used_data}
                                   options={{
                                       allowHtml: true,
                                   }}
                                   rootProps={{ 'data-testid': '1' }}/>
                        </Col>
                    </Row>
                    <br/>
                </div> }
                <br/>
                <div className={"stats-block"}>
                    <h3 className={'text-info'}>Price Chart</h3>
                    <Row>
                        <Col>
                            <LineGraph data={price_chart_data} options={price_chart_options}/>
                        </Col>
                    </Row>
                    <h3 className={'text-info'}>Quantity Chart</h3>
                    <Row>
                        <Col>
                            <LineGraph data={quantity_chart_data} options={quantity_chart_options}/>
                        </Col>
                    </Row>
                    <br/>
                </div>
                <br/>
                <div className={"stats-block overflow-scroll"}>
                    <h3 className={'text-info'}>Current Listings on Auction House</h3>
                    <Row>
                        <Col>
                            <table className={"full-width table-striped table-dark"}>
                                <thead>
                                    <tr>
                                        <th>
                                            Posted By
                                        </th>
                                        <th>
                                            Quantity
                                        </th>
                                        <th>
                                            Min Bid
                                        </th>
                                        <th>
                                            Buyout
                                        </th>
                                        <th>
                                            Profit Bid / Buyout
                                        </th>
                                        <th>
                                            Time Left
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                {ah_rows}
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </div>
                </>)
        }
    }
}

export default withRouter(ItemPage);