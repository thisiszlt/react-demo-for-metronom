import React from 'react';
import {Icon,Spin,message} from 'antd';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Layout.css';
import {settingsFromPage} from './SettingPage';
import CardResult from './CardResult';
import ProductResult from './ProductResult';


const themeColor = "rgb(139, 195, 74)"     //#FE8E14

function ScannerArea(props){
    return(
        <div className="scanner-container">
            <div className="frame" style={{width:props.region+"%",height:props.region+"%"}}>
                {/* <label className="flashlight">
                    <Icon type="funnel-plot" style={{fontSize:"2rem",color:{themeColor}}}></Icon>
                </label> */}
                <div id="scan-line"></div>
            </div>
            {/* <div className="tip-info">
                <p>Put the code in the box and scan it automatically.</p>
            </div> */}
        </div>
    )
}


class EachResult extends React.Component{
    copyScannerResult=e=>{
        const kUtil=window.kUtil;
        // kUtil.copyToClipBoard(this.props.content);
        kUtil.copyToClipBoard(e.target.innerText);
        var config={};
        config.content="copy successfully!";
        config.icon=<Icon type="smile" style={{color:themeColor}}></Icon>;
        message.config({
            top:window.innerHeight-180,
            duration:1.5,
        });
        message.open(config);
    }

    
    render(){
        let txt = this.props.content;
        let possibleLink = txt;
        if (!txt.startsWith('http') && (txt.startsWith('www') || -1 !== txt.indexOf('.com') ||
            -1 !== txt.indexOf('.net') || -1 !== txt.indexOf('.org') || -1 !== txt.indexOf('.edu'))) {
            possibleLink = 'http://' + txt;
        }
        let isLink = possibleLink.startsWith('http');
        return(
            <div className="result-content">
                <span style={{color:themeColor}}>{this.props.format}: </span>
                {
                    isLink?
                    <a href={possibleLink} target={"_blank"} style={{textDecoration:"underline"}} >{this.props.content}</a>
                    : <span onClick={this.copyScannerResult} style={{fontSize:16}}>{this.props.content}</span>
                }
                <span style={{color:themeColor}}></span>
            </div>
            )
        }
}


class Result extends React.Component{
    render(){
        const resultItems = this.props.resultsInfo.slice(-3).map((ri,index)=>
            <EachResult key={index} content = {ri.result!==undefined?ri.result.BarcodeText:ri.BarcodeText} 
            count={ri.count} 
            format={ri.result!==undefined?ri.result.BarcodeFormatString:ri.BarcodeFormatString}>
            </EachResult>
        );
        
        return(
            <div className="result-container">
                {resultItems}
            </div>
        )
    }
}


class Canvas extends React.Component{
    constructor(props){
        super(props);
        this.state=({
            isDraw:false
        });
        this.canvas = React.createRef();
    }

    componentDidUpdate(){
        let point = this.props.point;
        let x1 = point[0].split(',')[0];
        let y1 = point[0].split(',')[1];
        let x2 = point[1].split(',')[0];
        let y2 = point[1].split(',')[1];
        let x3 = point[2].split(',')[0];
        let y3 = point[2].split(',')[1];
        let x4 = point[3].split(',')[0];
        let y4 = point[3].split(',')[1];

        let leftMin = Math.min(x1, x2, x3, x4);
        //let rightMax = Math.max(x1, x2, x3, x4);
        let topMin = Math.min(y1, y2, y3, y4);
        //let bottomMax = Math.max(y1, y2, y3, y4);

        let _x1 = x1 - leftMin;
        let _x2 = x2 - leftMin;
        let _x3 = x3 - leftMin;
        let _x4 = x4 - leftMin;
        let _y1 = y1 - topMin;
        let _y2 = y2 - topMin;
        let _y3 = y3 - topMin;
        let _y4 = y4 - topMin;


        var canvas = this.canvas.current;
        //console.log(_x1,_y1,_x2,_y2,_x3,_y3,_x4,_y4);
        if(canvas.getContext){
            //debugger;
            let ctx = canvas.getContext("2d");
            ctx.fillStyle = 'rgba(254,180,32,0.5)';
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.beginPath();
            ctx.moveTo(_x1, _y1);
            ctx.lineTo(_x2, _y2);
            ctx.lineTo(_x3, _y3);
            ctx.lineTo(_x4, _y4);
            ctx.fill();
        }

    }

    render(){
        let point = this.props.point;
        let x1 = point[0].split(',')[0];
        let y1 = point[0].split(',')[1];
        let x2 = point[1].split(',')[0];
        let y2 = point[1].split(',')[1];
        let x3 = point[2].split(',')[0];
        let y3 = point[2].split(',')[1];
        let x4 = point[3].split(',')[0];
        let y4 = point[3].split(',')[1];

        let leftMin = Math.min(x1, x2, x3, x4);
        let rightMax = Math.max(x1, x2, x3, x4);
        let topMin = Math.min(y1, y2, y3, y4);
        let bottomMax = Math.max(y1, y2, y3, y4);
        let cvsStyle={
            position:"absolute",
            left:leftMin+"px",
            top:topMin+"px",
            //background:"#80008021",
        };
        return(
            <>
            {
                <canvas
                ref={this.canvas}
                width={rightMax-leftMin} height={bottomMax-topMin} style={cvsStyle}>
                </canvas>
            }
            </>
            
        )
    }
}

// const Dynamsoft = window.Dynamsoft;
var Dynamsoft;


class Scanner extends React.Component{
    constructor(props){
        super(props);
        this.state=({
            resultsInfo:[],
            isOpen:false,
            resultsPoint:[],
            cameraList:[],
            ...settingsFromPage,
            cameraOptions:null,
            multiScanModeResult:[],
            singleScanModeResult:undefined
        });

    }

    scanner=null;


    async showScanner(){
        var regionThreshhold = 300;
        var updateFrame = ()=>{
            var regionScale = 1.0*this.props.region/100;
            var regionWidth =  regionScale*window.innerWidth;
            var regionHeight = 0.5*regionScale*window.innerHeight;
            var r = this.state.resolution;
            var vW = r[0];
            var vH = r[1];
            var left,right,top,bottom;
            regionHeight = regionHeight>=regionThreshhold?regionThreshhold:regionHeight;
            regionWidth = regionWidth>=regionThreshhold?regionThreshhold:regionHeight;

            left = (vW-regionWidth)/2/vW;
            right = (vW + regionWidth)/2/vW;
            top = (vH-regionHeight)/2/vH;
            bottom = (vH+regionHeight)/2/vH;

            // console.log(left, right, bottom, top);
            this.scanner.getRuntimeSettings().then(settings=>{
                if(this.state.bFullRegion){
                    settings.region.regionLeft = 0;
                    settings.region.regionRight = 100;
                    settings.region.regionTop = 0;
                    settings.region.regionBottom = 100;
                    settings.region.regionMeasuredByPercentage = 1; 
                    this.scanner&&this.scanner.updateRuntimeSettings(settings);
                }
                else{
                    settings.region.regionLeft = Math.round(left*100);
                    settings.region.regionRight = Math.round(right*100);
                    settings.region.regionTop = Math.round(top*100);
                    settings.region.regionBottom = Math.round(bottom*100);
                    settings.region.regionMeasuredByPercentage = 1; 
                    this.scanner&&this.scanner.updateRuntimeSettings(settings);
                }
            })

        };

        
        this.scanner = await Dynamsoft.BarcodeScanner.createInstance();
        this.scanner.setUIElement(document.getElementById("scanner"));
        this.scanner.onFrameRead = (results) => {
            // console.log(results);
            let resultPointsPerFrame=[];
            for (let i = 0; i < results.length; i++){
                let result = results[i];
                resultPointsPerFrame.push(result.LocalizationResult.ResultPoints);
            }

            let resultsInfo = results;
            this.setState({
                resultsInfo:resultsInfo,
                resultsPoint:resultPointsPerFrame,
            });
        };

        this.scanner.onUnduplicatedRead = (txt, result)=>{
            var multiScanModeResult = this.state.multiScanModeResult;
            
            var bExist = false;
            for(let i=0;i<multiScanModeResult.length;i++){
                if(result.BarcodeText===multiScanModeResult[i]){
                    bExist=true;
                    break;
                }
            }

            if(!bExist)     //add new code to multiScanModeResult
                multiScanModeResult.push(result.BarcodeText)

            this.setState({
                singleScanModeResult: txt,
                multiScanModeResult: multiScanModeResult
            })
        }

        await this.scanner.updateVideoSettings({ 
            video: { width: this.state.resolution[0], height:this.state.resolution[1], facingMode: this.state.videoSource /*facingMode: { exact: this.state.videoSource}*/ } 
        });
        let settings = await this.scanner.getRuntimeSettings();
        // let videos = await scanner.getAllCameras();
        // console.log(videos);
        if(this.state.barcodeFormat)
            settings.barcodeFormatIds=this.state.barcodeFormat;
        settings.localizationModes=this.state.localization;
        settings.deblurLevel = this.state.deblurLevel;
        this.scanner.intervalTime = this.state.intervalTime;
        // console.log(settings);
        await this.scanner.updateRuntimeSettings(settings);
        updateFrame();      //needed updateFrame here to update region area
        
        try{
            await this.scanner.show();
            this.setState({
                resolution: this.scanner.getResolution()
            });
            updateFrame();      //needed updateFrame here to get real resolution

        }catch(e){
            console.log(e);
            var config={};
            config.content="No camera availble!";
            config.icon=<Icon type="frown" style={{color:themeColor}}></Icon>;
            message.config({
                top:window.innerHeight/2,
                duration:5,
            });
            message.open(config);
        }finally{
            this.setState({
                isOpen:!this.state.isOpen
            });    
        }
    }


    componentWillMount(){
        Dynamsoft = window.Dynamsoft;
        this.showScanner();
    }

    async componentWillUnmount(){
        this.scanner.onFrameRead=false;
        this.scanner!==null&&this.scanner.close();
        this.scanner!==null&&await this.scanner.destroy();
        this.scanner=null;
    }


    componentWillReceiveProps(props, state){
        console.log(this.props.mode, "->",props.mode);
        this.setState({
            singleScanModeResult:!this.state.resultsInfo.length?props.singleScanModeResult:this.state.singleScanModeResult,
            multiScanModeResult: !this.state.resultsInfo.length?props.multiScanModeResult:this.state.multiScanModeResult
        });
    }

    stopScanner(){
        this.scanner&&this.scanner.stop();
        this.setState({
            resultsInfo:[]
        })
        console.log("stop");
    }

    playScanner(){
        this.scanner&&this.scanner.play();
        console.log("play")
    }

    render(){
        const allCanvas = this.state.resultsPoint.map((eachResult,index)=>
            <Canvas key={index} point={eachResult}></Canvas>
        );
        
        return(
            <>
            <style type="text/css">
                {`
                .waiting{
                    position:absolute;
                    left:50%;
                    top:50%;
                    transform:translate(-50%);
                    color:${themeColor};
                    transition: opacity 1000ms ease-in;
                }

                .fade-enter.fade-enter-active {
                    opacity:1;
                    transition: opacity 1000ms ease-in;
                }

                .fade-enter{
                    opacity:0;
                }

                .fade-leave{
                    opacity: 1; 
                }

                .fade-leave.fade-leave-active{
                    opacity:0;
                    transition: opacity 3000ms ease-in;
                }
                
                .fade-appear{
                    opacity:0;
                }

                .fade-appear.fade-appear-active {
                    opacity: 1;
                    transition: opacity 2000ms ease-in;
                }
                `}
            </style>
            <ReactCSSTransitionGroup
                transitionName="fade"
                transitionLeave={true}
                transitionAppear={false}
                transitionEnter={false}
                transitionAppearTimeout={500}
                transitionLeaveTimeout={3500}
                transitionEnterTimeout={2500}
            >
                {
                    !this.state.isOpen&&
                    <Spin 
                    className="waiting" 
                    tip="Accessing Camera list..." 
                    indicator={<Icon type="smile" spin style={{ fontSize: "3rem"}}></Icon>}>
                    </Spin>    
                }
            </ReactCSSTransitionGroup>           
            
            <div id='scanner' style={{position:"absolute",width:"100%"}}>
                <div className="video-container">
                    <video style={{position:"absolute", left:"50%",top:"50%", transform:"translate(-50%,-50%)"}} className='dbrScanner-video custom-video' playsInline={true}></video>
                        <div style={{position:"absolute", left:"50%",top:"50%", transform:"translate(-50%,-50%)", width:this.state.resolution[0], height:this.state.resolution[1]}}>
                        {this.state.resultsInfo.length&&allCanvas}
                    </div>
                </div>
            </div>
            {
                !this.state.bFullRegion&&
                <ScannerArea region={this.props.region}></ScannerArea>
            }

            {/* <Result resultsInfo={this.state.resultsInfo}></Result> */}
            {/* {(this.state.bSelectedCardPage&&this.state.resultsInfo)&&<CardResult/>} */}
            {(this.props.mode==="scan card" &&this.state.singleScanModeResult)&&
                <CardResult onContinueClick={this.props.onContinueClick} 
                    onConfirmClick={this.props.onConfirmClick} 
                    results={this.state.singleScanModeResult}
                    playScanner={this.playScanner.bind(this)}
                    stopScanner={this.stopScanner.bind(this)}
                />
            }
            {(this.props.mode==="scan product"&&this.state.multiScanModeResult.length)&&
                <ProductResult onContinueClick={this.props.onContinueClick}
                    onConfirmClick={this.props.onConfirmClick} 
                    results={this.state.multiScanModeResult}
                    playScanner={this.playScanner.bind(this)}
                    stopScanner={this.stopScanner.bind(this)}
                />
            }
            </>
        )
    }
}

export default Scanner;
export {Result,EachResult};