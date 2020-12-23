import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { Card, Radio, Spin, } from 'antd';
//引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入需要用到的图表
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
//调用API
import { getPortChartData, } from '@/services/volume';
//调用公式方法
import { sortObjectArr, } from '@/utils/utils';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
import SearchResultList from '@/components/Search/SearchResultList';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const Port: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [ loading, setloading] = useState(false);
    const [type, setType] = useState('收入');
    const [result, setResult] = useState([]);

    //获取数据
    let fetchData = async (SearchInfo: any, T: string) => {
        setloading(true);
        const result = await getPortChartData(SearchInfo);
        if (!result || initialState?.currentBranch?.BranchID == undefined) {
            return;
        }
        if (result && result.length > 0) {
            setResult(result);
            //将值传给初始化图表的函数
            initChart(result, T,);
            setloading(false);
         }
    }

    //初始化图表
    let initChart = (result: any, type: string) => {
        let element = document.getElementById('port');
        let myChart = echarts.init(element as HTMLDivElement);
        // 根据 type 排序
        let PortTopList: any = [];
        let PortTopTotalARList: any = [];       //Total AR
        let PortTopTotalFCLList: any = [];      //Total FCL
        let PortTopTotalLCLList: any = [];      //Total LCL
        let PortTopTotalBulkList: any = [];     //Total Bulk
        let PortTopPortNameList: any = [];
        if (type == '收入') {
            PortTopList = (result.sort(sortObjectArr('TotalAR',2)).slice(0, 10)).sort(sortObjectArr('TotalAR',1));
        } else if (type == '整箱') {
            PortTopList = (result.sort(sortObjectArr('FLCVolume',2)).slice(0, 10)).sort(sortObjectArr('FLCVolume',1));
        } else if (type == '拼箱') {
            PortTopList = (result.sort(sortObjectArr('LCLVolume',2)).slice(0, 10)).sort(sortObjectArr('LCLVolume',1));
        } else {
            PortTopList = (result.sort(sortObjectArr('BulkVolume',2)).slice(0, 10)).sort(sortObjectArr('BulkVolume',1));
        }
        if (PortTopList.length > 0) {
            PortTopList.map((x: { TotalAR: any; FLCVolume: any; LCLVolume: any; BulkVolume: any; PortName: string; }) => {
                PortTopTotalARList.push((x.TotalAR / 1000).toFixed(2));             //Total AR
                PortTopTotalFCLList.push(x.FLCVolume);          //Total AR
                PortTopTotalLCLList.push(x.LCLVolume);          //Total AR
                PortTopTotalBulkList.push(x.BulkVolume);        //Total AR
                PortTopPortNameList.push(x.PortName);
            });
        }
        // 赋值图表 series 和 yAxis 中的 name
        let seriesData = [];
        let yAxisName = '';
        if (type == '收入') {
            seriesData.push({
                name: type,
                type: 'bar',
                data: [...PortTopTotalARList]
            });
            yAxisName = '单位: CNY(千)'
        } else if (type == '整箱') {
            seriesData.push({
                name: type,
                type: 'bar',
                data: [...PortTopTotalFCLList]
            });
            yAxisName = '单位: TEU'
        } else if (type == '拼箱') {
            seriesData.push({
                name: type,
                type: 'bar',
                data: [...PortTopTotalLCLList]
            });
            yAxisName = '单位: CBM'
        } else {
            seriesData.push({
                name: type,
                type: 'bar',
                data: [...PortTopTotalBulkList]
            });
            yAxisName = '单位: TON'
        }

        let option: any = {
            title: {
                text: `前10港口${type}排名`,
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#C23531'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                scale: true,
                name: yAxisName,
                data: [...PortTopPortNameList],
            },
            series: seriesData,
        };
        myChart.setOption(option);
        window.addEventListener('resize', () => { myChart.resize() });
    };

    /**
     * 第2个参数传 [initialState] 相当于 componentWillUnmount 钩子
     */
    useEffect(() => {
        let SearchInfo: object = {
            BranchID: initialState?.currentBranch?.BranchID,
            // YearList: initialState?.searchInfo?.YearList,
            Year: initialState?.searchInfo?.Year,
            Months: initialState?.searchInfo?.MonthList || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            TransTypes: initialState?.searchInfo?.BizType1List || [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14],
            TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
            CargoTypes: initialState?.searchInfo?.OceanTransportTypeList || [1, 2, 3, 6, 7],
        };
        if (initialState?.currentBranch) {
            fetchData(SearchInfo,type);
        }
    }, [initialState]);

    /**
     * 点击切换统计图表类型
     */
    const onChangeType = (e: any) => {
        setType(e.target.value);
        initChart(result, e.target.value);
    }

    return <>
        {/* <ContextProps.Provider value={2}>
            <SearchResultList />
        </ContextProps.Provider> */}

        <Spin tip="页面正在加载中..." spinning={loading}>
            <Card
                extra={
                    <>
                        {/* 切换统计图表类型 */}
                        <span style={{marginRight:10}}>排序方式:</span>
                        <Radio.Group size="small" defaultValue={type} buttonStyle="solid" onChange={onChangeType}>
                            <Radio.Button value="收入">收入</Radio.Button>
                            <Radio.Button value="整箱">整箱</Radio.Button>
                            <Radio.Button value="拼箱">拼箱</Radio.Button>
                            <Radio.Button value="散货">散货</Radio.Button>
                        </Radio.Group>
                    </>
                }
            >
                <div id="port" style={{ width: '100%', height: 600 }}></div>
            </Card>
        </Spin>

        {/*重点代码*/}
        <ContextProps.Provider value={2}>
            <SearchButton />
        </ContextProps.Provider>
    </>
};

export default Port;