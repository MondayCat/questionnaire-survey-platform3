import React, {Component} from 'react';
import {Button, Modal, Table, Input, Divider} from "antd";
import Title from "antd/es/typography/Title";
import '../css/Analysis.css'
import timeConversion from "../../../utils/TimeConversion";

const {Search} = Input;

class TextAnalysis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qid: this.props.qid,
            aid: this.props.aid,
            modalVisible: false,
            data: [],
            tempData: []
        }
    }

    handleOnclick = () => {
        this.setState({
            qid: this.props.qid,
            aid: this.props.aid,
            modalVisible: true
        })
    }

    handleOk = () => {
        this.setState({
            modalVisible: false
        })
    }

    handleCancel = () => {
        this.setState({
            modalVisible: false
        })
    }

    onSearch = (value) => {
        let data = []
        for (const d in this.state.data) {
            data.push(this.state.data[d])
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i] == null || !data[i].answer.includes(value)) {
                data.splice(i, 1);
                i--;
            }
        }
        this.setState({
            tempData: data
        })
    }

    componentDidMount() {
        const params = {
            "qid": this.props.qid,
            "aid": this.props.aid
        };
        if (this.props.qid !== "") {
            fetch('api/text', {
                method: 'post',
                body: JSON.stringify(params),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then(res => res.json())
                .then(res => {
                    const get = res.data.data;
                    let temp = []
                    for (let i = 0; i < res.data.length; i++) {
                        temp.push({key: i, id: i, submitTime: timeConversion(get[i].ans_time), answer: get[i].ans})
                    }
                    this.setState({
                        data: temp,
                        tempData: temp
                    })
                })
        }
    }

    render() {
        const columns = [
            {
                title: <span style={{fontWeight: "bold"}}>??????</span>,
                dataIndex: 'id',
                align: "center",
                width: '10%'
            },
            {
                title: <span style={{fontWeight: "bold"}}>????????????</span>,
                dataIndex: 'submitTime',
                align: "center",
                width: '20%'
            },
            {
                title: <span style={{fontWeight: "bold"}}>????????????</span>,
                dataIndex: 'answer',
            }
        ]

        return (
            <>
                <Title
                    level={5}>{this.state.aid}.&nbsp;{this.props.question.subject}&nbsp;&nbsp;<span
                    className={"analysis_question_type"}>[?????????]</span>&nbsp;&nbsp;{this.props.question.isNecessary === true ?
                    <span className={"analysis_question_isNecessary"}>[??????]</span> :
                    <span className={"analysis_question_isNecessary"}>[?????????]</span>}</Title>
                <Button className={"text_button"} type={"primary"} onClick={this.handleOnclick}>??????????????????</Button>
                <Modal
                    title={this.state.aid + 1 + '. ' + this.props.question.subject}
                    visible={this.state.modalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    width={1000}>
                    <Search className={"text_search"} placeholder="??????????????????" allowClear onSearch={this.onSearch}
                            style={{width: 350}}/>
                    <Table columns={columns}
                           dataSource={this.state.tempData}
                           bordered
                    />
                </Modal>
                <Divider/>
            </>
        )
    }
}

export default TextAnalysis