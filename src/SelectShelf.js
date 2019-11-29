import React from 'react';
import {Row, Col, Card, Button,Radio} from 'antd';

class SelectShelf extends React.Component{
    render(){
        return(
            <Row>
                <Radio.Group buttonStyle="solid">
                    <Radio.Button value="One">One</Radio.Button>
                    <Radio.Button value="Two">Two</Radio.Button>
                    <Radio.Button value="Three">Three</Radio.Button>
                </Radio.Group>
            </Row>
        )
    }
}

export default SelectShelf;