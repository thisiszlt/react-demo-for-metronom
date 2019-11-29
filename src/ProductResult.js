import React from 'react';
import {Row, Col, Card, Button} from 'antd';

const themeColor = "rgb(139, 195, 74)"     //#FE8E14

class EachProduct extends React.Component{
    render(){
        var info = this.props.info;
        return(
            <Card bordered={false} style={{position:"relative", padding:"0 10px", textAlign:"left"}}>
                <Row>
                    <img src="img/product.png" style={{width:"100%"}}></img>
                </Row>
                <Row style={{border:`2px solid ${themeColor}`, padding:10}}>
                    <Col span={12}>
                        <p>Product:{info}</p>
                    </Col>
                    <Col span={12}>
                        <p>Shelf life:{info}</p>
                    </Col>
                    <Col span={12}>
                        <p>Product Number:{info}</p>
                    </Col>
                    <Col span={12}>
                        <p>Price:{info}</p>
                    </Col>
                    <Col span={12}>
                        <p>Production Date:{info}</p>
                    </Col>
                    <Col span={12}>
                        <p>Discount:{info}</p>
                    </Col>
                </Row>
            </Card>
        )            
    }
}

class ProductResult extends React.Component{
    componentWillMount(){
        this.props.stopScanner();
    }

    componentWillUnmount(){
        this.props.playScanner();
    }

    render(){
        var productInfos = this.props.results;
        if(productInfos.length){
            return(
                <div style={{top:60,height:"100%",width:"100%",backgroundColor:"#fff",position:"absolute",zIndex:99}}>
                    <Row>
                        <img src="img/card.png" style={{width:"90%"}}></img>
                    </Row>
                    {
                        productInfos.map((info, index)=><EachProduct info={info} key={info+index}/>)
                    }

                    <Row style={{padding:"20px 0" , backgroundColor:"#fff"}}>
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

export default ProductResult;