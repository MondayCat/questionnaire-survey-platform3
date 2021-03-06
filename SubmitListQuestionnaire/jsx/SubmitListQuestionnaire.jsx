import React, { Component } from 'react'
import { Table, Space, message } from 'antd';
// import reqwest from 'reqwest';
import { DeleteOutlined,EyeOutlined  } from '@ant-design/icons';
import SubmitDetailQuestionnaire from './SubmitDetailQuestionnaire'
import timeConversion from "../../../utils/TimeConversion"

// const getRandomuserParams = params => ({
//     results: params.pagination.pageSize,
//     page: params.pagination.current,
//     ...params,
// });

export default class SubmitListQuestionnaire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            qid:"",
            ans_qid:'',
            answers:'',
            // questions:'',
            // questions: [],
            questionnaire: {
                // title: "",
                // publisher: "",
                // fillerCount: 0,
                // qid: "",
                // releaseTime: "",
                // deadline: "",
                // state: 0,
                questions: []
            },
            questionnnaireIndex: -1,
            // ans_qid: ans_qid,
            pagination: {
                current: 1,
                pageSize: 10,
            },
            loading: false,
            tableRowId: -1,
            // questionnaire: questionnaire,
            modalVisible: false
        }
    }

    handleOnClick = () => {
        const Params = {
            "qid":this.state.qid,
            "ans_qid":this.state.ans_qid
        };
        fetch('/api/ansContent',{
            method: 'post',
            body: JSON.stringify(Params),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
            .then(res =>{
            console.log("fanhuide:",res.data);
            console.log("res.data.data2",res.data.data2);
            var anslist = res.data.data1[0].ans_list
            // .map((list)=>{
            //     return list.choice
            // })
            console.log('choice',anslist);
            this.setState({
                questionnaire: {
                    questions: res.data.data2[0].ask_list.map((list,index) => {
                        var anss = [] 
                        if(list.type === 1){
                            var a =  anslist[index].choice[0].charCodeAt(0) - 65                        
                            anss.push(res.data.data2[0].ask_list[index].choice_list[a].content)
                            console.log("a2 is ",anss);
                        }
                        else if(list.type === 2){
                            let i = 0;
                            while(i <???(anslist[index].choice.length)){
                                
                                console.log("aa22",anslist[index].choice[i]);
                                i++;
                            }

                            // for (var prop in res.data.data2[0].ask_list[index].choice_list) {
                            //     console.log("obj." + prop + " = " + obj[prop]);
                            // }

                            for(let i = 0; i < (anslist[index].choice.length); i++){
                                console.log("aa",anslist[index].choice[i]);
                            }
                            anslist[index].choice.map((item,index)=>{
                                console.log("item",item);
                                let a = item.charCodeAt(0) - 65  
                                console.log("ye",res.data.data2[0].ask_list[index].choice_list[a]);
                                
                                // anss.push(res.data.data2[0].ask_list[index].choice_list[a].content)                    
                            })
                            console.log("a2 is ",anss);
                            // var a =  anslist[index].choice
                            
                        }
                        else if(list.type === 3){
                            var a =  anslist[index].ans
                            console.log("a3 is ",a);
                        }
                        return ({
                            subject: list.ask,
                            type: list.type === 1 ? "?????????" : (list.type === 2 ? "?????????" : "?????????"),
                            isNecessary: list.isNecessary,
                            ans:anss
                        })
                    })
                }
            })
            this.setState({answers: res.data.data1[0]})
            console.log(75123459,this.state.answers);
        });
        this.setState({modalVisible: true})
    }

    handleCancel = () => {
        this.setState({modalVisible: false})
    }
    
    handleDelete = () => {
        if(window.confirm('??????????????????')){
            const { data,tableRowId } = this.state
            console.log("tableRowId",tableRowId)
            console.log("data22222222",data)
            const Params = {
                "ans_qid":tableRowId
            };
            fetch('/api/deleAns',{
                method: 'post',
                body: JSON.stringify(Params),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then(res => res.json())
                .then(res =>{
                console.log("delete:",res);
                if (res.code === 1) {
                    const newData = data.filter(
                        (dataObj) => {
                            console.log("data",dataObj.ans_qid)
                            console.log(dataObj.ans_qid !== tableRowId)
                            return dataObj.ans_qid !== tableRowId
                        }
                    )
                    this.setState({data:newData})
                    this.setState({modalVisible: false})
                    message.info("???????????????")
                } else {
                    alert("????????????????????????????????????")
                }
            });
        }
    }

    settableRowId = (qid,ans_qid) => {
        this.setState({tableRowId:ans_qid,qid:qid,ans_qid:ans_qid})
    }

    componentDidMount() {
        const Params = {
            "qid":this.props.location.search.slice(5)
        };
        fetch('/api/ans',{
            method: 'post',
            body: JSON.stringify(Params),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
            .then(res =>{
            console.log("resdata",res.data);
            var newData = []
                res.data.map(((item, index) => {
                    newData.push(Object.assign({}, item, {
                        key: index+1,
                        ans_time: timeConversion(item.ans_time)
                    }))
                }))
                this.setState({data: newData})
        });
        // const { pagination } = this.state;
        // this.fetch({ pagination });
    }

    // handleTableChange = (pagination, filters, sorter) => {
    //     this.fetch({
    //         sortField: sorter.field,
    //         sortOrder: sorter.order,
    //         pagination,
    //         ...filters,
    //     });
    // };

    // fetch = (params = {}) => {
    //     this.setState({ loading: true });
    //     reqwest({
    //         url: 'https://randomuser.me/api',
    //         method: 'get',
    //         type: 'json',
    //         data: getRandomuserParams(params),
    //     }).then(data => {
    //         console.log(data);
    //         this.setState({
    //         loading: false,
    //         // data: data.results,
    //         data:data,
    //         pagination: {
    //             ...params.pagination,
    //             total: 200,
    //             // 200 is mock data, you should read it from server
    //             // total: data.totalCount,
    //         },
    //         });
    //     });
    // };

    render() {
        const {data,questionnnaireIndex} = this.state
        // console.log(data)
        const columns = [
            {
                title: '??????',
                dataIndex: 'key',
                // sorter: true,
                sorter: (a, b) => a.key - b.key,
                // render: name => `${key}`,
                width: '20%',
            },
            {
                title: '??????????????????',
                dataIndex: 'ans_time',
                // filters: [
                // { text: 'Male', value: 'male' },
                // { text: 'Female', value: 'female' },
                // ],
                width: '40%',
            },
            {
                title: '??????',
                dataIndex: 'action',
                render: () => (
                    <Space size="middle">
                      <span onClick={()=> this.handleDelete()}><DeleteOutlined /></span>
                      <span onClick={()=> this.handleOnClick()}><EyeOutlined /></span>
                    </Space>
                ),
            },
        ];

        return (
            <>
            <SubmitDetailQuestionnaire
                    questionnaire={this.state.questionnaire}
                    answers={this.state.answers}
                    questionnnaireIndex = {questionnnaireIndex}
                    modalVisible={this.state.modalVisible}
                    handleDelete = {this.handleDelete}
                    handleCancel={this.handleCancel}/>
            <Table style={{width:'80%',marginLeft: '10%'}}
            columns={columns}
            // rowKey={record => record.login.uuid}
            dataSource={data}
            // pagination={pagination}
            // loading={loading}
            onChange={this.handleTableChange}
            onRow = {(record) => {
                return {
                  onMouseEnter: () => {
                    // console.log("record",record)
                    this.settableRowId(record.qid,record.ans_qid)
                    }
                  }
                }
              }
            />
            </>
        )
    }
}
