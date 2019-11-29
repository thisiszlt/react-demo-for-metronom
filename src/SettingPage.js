import React from 'react';
import {Menu, Icon, Button,Radio,Checkbox,Col,message, Switch } from 'antd';
import './SettingPage.css';
import './Layout.css';


const { SubMenu } = Menu;
const themeColor = "rgb(139, 195, 74)"     //#FE8E14


const AttributeStyle = {
    padding:"10px"
};

const menuStyle = {
    paddingBottom:10,
    border:0
    // width: "50%",
    // backgroundColor: "rgb(89, 87, 87)"
}

const theme = "light";

const checkGroupStyle = { 
    paddingLeft:"20px", 
    color: "antiquewhite"
}

let settingsFromPage = {
    resolution:[640,480],
    barcodeFormat:undefined,
    localization:[2,0,0,0,0,0,0,0],
    deblurLevel : 0,
    bFullRegion: false,
    intervalTime:100,
    videoSource: "environment"
};


const Dynamsoft = window.Dynamsoft;

class VideoSource extends React.Component{
    onSwitchCamera=(e)=>{
        console.log(e.target.value);
        settingsFromPage.videoSource = e.target.value;
    }

    render(){
        return(
            <Menu
                theme={theme}
                mode="vertical"
                style={menuStyle}
            >
                <SubMenu
                    key="source"
                    title={
                    <span>
                        <Icon type="camera"/>
                        <span>Video Source</span>
                    </span>
                    }
                    popupClassName="popSubMenu"
                >
                    <Menu.ItemGroup
                        title="Source"
                    >
                        <Radio.Group 
                            style={checkGroupStyle} 
                            onChange={this.onSwitchCamera.bind(this)} 
                            defaultValue={settingsFromPage.videoSource}
                        >
                            <Radio style={AttributeStyle} value="user">front-set camera</Radio>
                            <Radio style={AttributeStyle} value="environment">In-set camera</Radio>
                        </Radio.Group>
                    </Menu.ItemGroup>
                </SubMenu>
            </Menu>
        )
    }
}

class VideoResolution extends React.Component{
    constructor(props){
        super(props);
        this.state={
            value:0,
            resolution:[640, 480]
        }
    }

    componentDidUpdate(){
        settingsFromPage.resolution=this.state.resolution;
        // console.log(this.state.resolution);
    }

    onSelectChange = e =>{
        this.setState({
            value:e.target.value,
            resolution:e.target.res,
        });
    };


    render(){
        const resolutions = [[3840,2160], [2560,1440], [1920,1080], [1600,1200], [1280,720], [800,600], [640,480], [640,360]]
        return(
        <Menu
            mode="vertical"
            style={menuStyle}
            theme={theme}
        >
            <SubMenu
                key="resolution"
                title={
                <span>
                    <Icon type="eye"/>
                    <span>Video Resolution</span>
                </span>
                }
                popupClassName="popSubMenu"
            >
                
                <Menu.ItemGroup
                    title="Resolution"
                >
                    <Radio.Group 
                        style={checkGroupStyle} 
                        onChange={this.onSelectChange.bind(this)} 
                        defaultValue={settingsFromPage.resolution.toString()}
                    >
                        {resolutions.map((resolution, index)=>
                            <Radio key={resolution+index} style={AttributeStyle} value={resolution.toString()} res={resolution}>{resolution.toString().replace(',','*')}</Radio>
                        )}
                    </Radio.Group>
                </Menu.ItemGroup>
            </SubMenu>      
        </Menu>   
        )
    }   
}


var _all = Dynamsoft.EnumBarcodeFormat.BF_ALL;
var _1D = Dynamsoft.EnumBarcodeFormat.BF_ONED;
var _PDF417 = Dynamsoft.EnumBarcodeFormat.BF_PDF417;
var _QRCode = Dynamsoft.EnumBarcodeFormat.BF_QR_CODE;
var _DataMatrix = Dynamsoft.EnumBarcodeFormat.BF_DATAMATRIX;
var _AztecCode = Dynamsoft.EnumBarcodeFormat.BF_AZTEC;
var _MaxiCode = Dynamsoft.EnumBarcodeFormat.BF_MAXICODE;
var _GS1DataBar = Dynamsoft.EnumBarcodeFormat.BF_GS1_DATABAR;
var _GS1Composite = Dynamsoft.EnumBarcodeFormat.BF_GS1_COMPOSITE;
var _PatchCode = Dynamsoft.EnumBarcodeFormat.BF_PATCHCODE;

const defaultCheckList = ["1D", "PDF417", "QRCode", "DataMatrix", "AztecCode",  "MaxiCode","GS1DataBar","GS1Composite", "PatchCode"/**/];
const formats = {"1D":_1D, "PDF417":_PDF417, "QRCode":_QRCode, "DataMatrix":_DataMatrix, "AztecCode":_AztecCode, "MaxiCode":_MaxiCode, "GS1DataBar":_GS1DataBar, "GS1Composite":_GS1Composite, "PatchCode":_PatchCode};
// var _all = 0;
// defaultCheckList.forEach(item=>{_all+=formats[item]});
settingsFromPage.barcodeFormat = _all;
console.log(_all);

// console.log(_1D+_PDF417+_QRCode+_DataMatrix+_AztecCode+_MaxiCode+_GS1DataBar+_GS1Composite+_PatchCode);

class BarcodeFormat extends React.Component{
    constructor(props){
        super(props);
        this.state={
            checkedList:defaultCheckList,
        }
    }

    onChange = checkedList=>{
        this.setState({
            checkedList,
        })
    }

    onSelectFormat = e=>{
        console.log(e.target.value,this.state.checkedList.indexOf(e.target.value)!==-1);
        this.state.checkedList.indexOf(e.target.value)!==-1?(settingsFromPage.barcodeFormat= settingsFromPage.barcodeFormat&(~e.target.format)):(settingsFromPage.barcodeFormat = settingsFromPage.barcodeFormat | e.target.format);
        // this.state.checkedList.indexOf(e.target.value)!==-1?(settingsFromPage.barcodeFormat -= e.target.format):(settingsFromPage.barcodeFormat += e.target.format);
    }


    render(){
        return(
            <Menu
                theme={theme}
                mode="vertical"
                style={menuStyle}
            >
                <SubMenu 
                    key="format"
                    title={
                        <span>
                            <Icon type="barcode"/>
                            <span>Barcode Format</span>
                        </span>    
                    }
                    popupClassName="popSubMenu"
                >
                        <Menu.ItemGroup 
                            title="Formats"
                        >
                            <>
                            <Checkbox.Group
                                value={this.state.checkedList}
                                onChange={this.onChange.bind(this)}
                                style={checkGroupStyle}
                            >
                                {
                                    defaultCheckList.map((item, index)=>{
                                        var key = item;
                                        return (<Col style={AttributeStyle} key={key+index}>
                                                    <Checkbox value={key} format={formats[key]} onChange={this.onSelectFormat.bind(this)}>{key}</Checkbox>
                                                </Col>)
                                        }
                                    )    
                                }
                            </Checkbox.Group>
                            </>
                        </Menu.ItemGroup>
                </SubMenu>    
            </Menu>
        )
    }
}


class ScanSettings extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mode:"fast",
            interval:100
        }
    }

    onModeSelectChange = e =>{
        this.setState({
            mode:e.target.value,
        });
        settingsFromPage.localization=(e.target.value==="fast")?[2,0,0,0,0,0,0,0]:[2,4,8,0,0,0,0,0];
        settingsFromPage.deblurLevel = 0;
    };

    onIntervalSelectChange = e =>{
        console.log(e.target.value);
        this.setState({
            interval:e.target.value
        });
        settingsFromPage.intervalTime = parseInt(e.target.value);
    }

    render(){
        const intervals = [10, 25, 50, 100, 200, 500, 1000, 2000];
        return(
            <Menu
                mode="vertical"
                style={menuStyle}
                theme={theme}
            >
               <SubMenu
                    key="scan"
                    title={
                    <span>
                        <Icon type="setting"></Icon>
                        <span>Scan Settings</span>
                    </span>
                    }
                    popupClassName="popSubMenu"
                >
                    <Menu.ItemGroup
                        title="Reading Interval"
                    >
                        <Radio.Group style={checkGroupStyle} defaultValue={settingsFromPage.intervalTime} onChange={this.onIntervalSelectChange.bind(this)}>
                            {intervals.map((interval, index)=>
                                <Radio on key={interval+index} style={{padding: "10px 0", width:"40%"}} value={interval}>
                                    {interval<=100? interval+"ms": interval/1000+'s'}
                                </Radio>
                            )}
                        </Radio.Group>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup
                        title="Mode"
                    >
                        <Radio.Group style={{paddingLeft:'20px'}} onChange={this.onModeSelectChange.bind(this)} defaultValue='fast'>
                            <Radio style={AttributeStyle} value="fast">Fast</Radio>
                            <Radio style={AttributeStyle} value="accurate">Most Accurate</Radio>
                        </Radio.Group>
                    </Menu.ItemGroup>

                    <ClearCache/>
                </SubMenu> 
            </Menu>
        )
    }
}

class ReadFullRegion extends React.Component{
    constructor(props){
        super(props);
        this.state={
            backgroundcolor: "rgb(175, 175, 175)"
        }
    }

    onChangeRegionMode(checked, ev){
        settingsFromPage.bFullRegion = checked;
        this.setState({
            backgroundcolor: checked?themeColor:"rgba(0, 0, 0, 0.5)"
        })
    }

    render(){
        return(
            <Menu
                mode="vertical"
                style={menuStyle}
                theme={theme}
            >
                <Menu.Item>
                    <Icon type="fullscreen"></Icon>
                    <span>Read Full Region</span>
                </Menu.Item>
                <div style={{textAlign: "center"}}>
                    <Switch onChange={this.onChangeRegionMode.bind(this)} style={{backgroundColor: this.state.backgroundcolor}}/> 
                </div>
            </Menu>
        )
    }
}


class ClearCache extends React.Component{
    handleClear(){
        var config={};
        message.config({
            top:window.innerHeight/5,
            duration:2,
        });
        try{
            console.log(window.indexedDB);
            var request = window.indexedDB.deleteDatabase('dynamsoft');
            request.onsuccess = request.onerror = ()=>{
                if(request.error){
                    // alert('Clear failed: '+(request.error.message || request.error));
                    config.content='Clear failed: '+(request.error.message || request.error);
                    config.icon=<Icon type="close" style={{color:"red"}}></Icon>;
                    message.open(config);
                }else{
                    // alert('Clear success!');
                    config.content="Clear success!";
                    config.icon=<Icon type="check-circle" style={{color:themeColor}}></Icon>;
                    message.open(config);
                }
            };
        }catch(ex){
            config.content=ex.message || ex;
            config.icon=<Icon type="close" style={{color:"red"}}></Icon>;
            message.open(config);
        }
    }

    render(){
        return(
            <div className="clear-cache" style={{padding: "30px 20px"}}>
                <Button type="primary"
                    onClick={this.handleClear.bind(this)}
                    style={{backgroundColor:themeColor,border:`1px solid ${themeColor}`}}
                >
                    Clear Cache
                </Button>
            </div>
        )
    }
}

class SettingPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showMenu:true,
            selectedTags: [],
        }
    }

    render(){
        return(
            <>
                {
                    <div className="setting-container">
                        <div style={{width:"50%", height:"100%", borderRight:"2px solid #e8e8e8"}}>
                            <VideoSource/>
                            <VideoResolution/>
                            <BarcodeFormat/>
                            <ScanSettings/>
                            <ReadFullRegion/>
                            <div style={{textAlign:"center", marginTop:"10%"}}>
                                <Button
                                    onClick = {this.props.onSaveClick}
                                    type="primary"
                                    style={{backgroundColor:`${themeColor}`,border:`1px solid ${themeColor}`}}
                                >Save
                                </Button>
                            </div>
                        </div>
                    </div>
                }
                
            </>
        );
    }
}


export default SettingPage;
export {settingsFromPage};