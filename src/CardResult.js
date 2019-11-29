import React from 'react';
import {Row, Col, Card, Descriptions, Button} from 'antd';


const customContainer={
    margin:"30px 0 0"
}

const cardContainer = {
    backgroundColor:"#ffd951", borderRadius:20,margin:"0 20px"
}

class CardResult extends React.Component{
    // componentWillReceiveProps(props, state){
    //     console.log(props);
    //     if(props.results)
    //         this.props.stopScanner();
    //     // else
    //     //     this.props.playScanner();
    // }
    componentWillMount(){
        this.props.stopScanner();
    }

    componentWillUnmount(){
        this.props.playScanner();
    }

    render(){
        var cardInfo = this.props.results;
        if(cardInfo){
            return(
                <div style={{top:60,height:"100%",width:"100%",backgroundColor:"#fff",position:"absolute",zIndex:99}}>
                    <Row>
                        <img src="img/card.png" style={{width:"90%"}}></img>
                    </Row>

                    <Row style={customContainer}>
                        <Card bodyStyle={{padding:10}} style={cardContainer}>
                            <Row style={{textAlign:"left", fontSize:"small"}}>
                                <p>No.{cardInfo}</p>
                            </Row>
                            <Row style={{margin:20}}>
                                <h2>Membership Card</h2>
                            </Row>
                            <Row style={{textAlign:"left", fontSize:"small"}}>
                                <p>yyyy/mm/dd-yyyy/mm/dd</p>
                            </Row>
                            
                        </Card>
                    </Row>
                    
                    <Row style={customContainer} >
                        <Card bodyStyle={{padding:10, textAlign:"left"}} style={cardContainer}>
                            <Row>
                                <Col span={12}>
                                    <p>Name:{cardInfo}</p>
                                </Col>
                                <Col span={12}>
                                    <p>Gender:{cardInfo}</p>
                                </Col>
                                <Col span={12}>
                                    <p>City:{cardInfo}</p>
                                </Col>
                                <Col span={12}>
                                    <p>Age:{cardInfo}</p>
                                </Col>
                                <Col span={12}>
                                    <p>ID:{cardInfo}</p>
                                </Col>
                                <Col span={12}>
                                    <p>Category:{cardInfo}</p>
                                </Col>
                                <Col span={12}>
                                    <p>Account Balance:{cardInfo}</p>
                                </Col>
                                <Col span={12}>
                                    <p>Credit score:{cardInfo}</p>
                                </Col>
                            </Row>
                        </Card>
                    </Row>
                    
                    <Row style={customContainer}>
                        <Col span={12}>
                            <Button onClick={this.props.onConfirmClick}>Confirm</Button>
                        </Col>
                        <Col span={12}>
                            <Button onClick={this.props.onContinueClick}>Continue</Button>
                        </Col>
                    </Row>
                </div>
            )            
        }
        else{
            return null;
        }
    }
}

export default CardResult;