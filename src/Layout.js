import React from 'react';
import "./Layout.css";
import {Icon, PageHeader,Row, Col, Button} from 'antd';
import SettingPage from './SettingPage';
import Scanner from "./Scanner";
import SelectShelf from './SelectShelf'

const themeColor = "rgb(139, 195, 74)"     //#FE8E14


class Main extends React.Component{
    constructor(props){
        super(props);
        this.state=({
            isShowSettingPage:false,
            isFullScreen:false,
            isFullRegion:false,
            settingDisplayStyle:{display:"none"},
            pageHead:"Scan Mode",
            mode: "scan",
        })
    }

    handleRegion(){
        this.setState({
            isFullRegion:!this.state.isFullRegion,
        })
    }

    handleShowSettingPage(){
        this.setState({
            isShowSettingPage:!this.state.isShowSettingPage,
            settingDisplayStyle:this.state.settingDisplayStyle.display==="none"?{display:"block"}:{display:"none"}
        });
    }

    switchFullScreen(){
        if(!this.state.isFullScreen){
            if(document.documentElement.requestFullscreen){
                document.documentElement.requestFullscreen();
            }
            else if(document.documentElement.webkitRequestFullScreen){
                document.documentElement.webkitRequestFullScreen();
            }
            else if(document.documentElement.mozRequestFullScreen){
                document.documentElement.mozRequestFullScreen();
            }
            else{
                document.documentElement.msRequestFullscreen();
            }
            //document.documentElement.requestFullscreen(); 
        }
            
        else
            document.exitFullscreen();
        this.setState({
            isFullScreen:!this.state.isFullScreen,
        })       
    }

    fullSceenClickHandler(event){
        this.switchFullScreen();
    }   

    onCardClick = ()=>{
        this.setState({
            mode: "scan card",
            pageHead: "Scan Result",
            singleScanModeResult:undefined,
            multiScanModeResult: []
        })
    }

    onProductClick = ()=>{
        this.setState({
            mode: "scan product",
            pageHead: "Scan Result",
            singleScanModeResult:undefined,
            multiScanModeResult: []
        })
    }

    onBackClick = ()=>{
        console.log(this.state.mode)
        this.setState({
            mode: "scan",
            pageHead: "Scan Mode"
        })
    }

    onConfirmClick(){
        console.log("confirm");
        this.setState({
            mode: "scan",
            singleScanModeResult:undefined,
            multiScanModeResult: [],
            pageHead: "Scan Mode",
        })
    }

    onContinueClick(){
        console.log("continue");
        this.setState({
            singleScanModeResult:undefined,
            multiScanModeResult: [],
            pageHead: "Scan Mode",
        })
    }

    onCheckClick=()=>{
        this.setState({
            bShowShelf: true
        })
    }
    

    render(){
        var regionSize = 70;
        var home = (
            <>
            <div className="home-screen">
                <Scanner multiScanModeResult={this.state.multiScanModeResult} singleScanModeResult={this.state.singleScanModeResult} onContinueClick={this.onContinueClick.bind(this)} onConfirmClick={this.onConfirmClick.bind(this)} region={regionSize} mode={this.state.mode}></Scanner>
                {
                    this.state.bShowShelf&&<SelectShelf />
                }
                <div id="extraBtns" style={{width: "100%", position:"absolute", bottom: "20%"}}>
                    <Row>
                        <Col span={6}>
                            <Button type="link" ghost icon="idcard" onClick={this.onCardClick} style={{fontSize:"1.5rem"}} ></Button>
                            <p>Card</p>
                        </Col>
                        <Col span={6}>
                            <Button type="link" ghost icon="exclamation-circle" onClick={this.onProductClick} style={{fontSize:"1.5rem"}}></Button>
                            <p>Product</p>
                        </Col>
                        <Col span={6}>
                            <Button type="link" ghost icon="check-circle" onClick={this.onCheckClick} style={{fontSize:"1.5rem"}}></Button>
                            <p>Check</p>
                        </Col>
                        <Col span={6}>
                            <Button type="link" ghost icon="shopping" onClick={()=>{}} style={{fontSize:"1.5rem"}}></Button>
                            <p>Stock</p>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="settingBtn-container" >
                <Icon type="setting" style={{fontSize:"2.0rem",color:"#fff"}} onClick={this.handleShowSettingPage.bind(this)} ></Icon>
            </div>
            </>
        );

        var extra = (
            <>
            <div style={{...this.state.settingDisplayStyle, height:"100%"}}>
                <SettingPage onSaveClick={this.handleShowSettingPage.bind(this)} ></SettingPage>
            </div>
            </>
        );
        
        return(
            <>
            <div style={{position:"relative", zIndex:999}}>
                {
                    this.state.isShowSettingPage?
                    <PageHeader
                        onBack={this.handleShowSettingPage.bind(this)} subTitle="Back" style={{backgroundColor:"#fff", position:"relative", height:"60px"}}
                    />
                    :<PageHeader 
                        onBack={this.onBackClick.bind(this)} subTitle="Back" style={{backgroundColor:"#fff", position:"relative", height:"60px"}}
                    />
                }
                <p id="head-bar">{this.state.pageHead}</p>       
            </div>
            {!this.state.isShowSettingPage&&home}
            {/* extra:setting page,setting btn */}
            {extra}     
            </>
        )
    }
}



class Layout extends React.Component{
    constructor(props){
        super(props);
        this.state=({
            isOpen:false,
            isShow:true,
        })
    }

    handleShow(){
        this.setState({
            isShow:!this.state.isShow,
        });
        console.log(this.state.isShow);
    }

    render(){
        return (
            <div className="wrap-container">
                {
                    this.state.isShow&&
                    <Main />
                }
            </div>   
        )
    }
}

export default Layout;
