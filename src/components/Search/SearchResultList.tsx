import React, { useState, useContext, } from 'react';
import { useModel } from 'umi';
import { Card, Row, Tag, Radio, } from 'antd';
import styles from './index.less';
//引入自定义方法
import { getYearList, } from '@/utils/utils';

import ContextProps from '@/createContext';

const SearchResultList: React.FC<{}> = () => {
    const PropsState = useContext(ContextProps);     //得到父组件过来的值
    const { initialState, setInitialState } = useModel('@@initialState');
    const [YearList,] = useState(() => {
        return getYearList();
    });

    /**
     * 删除 Tag 
     * 更新 initialState.searchInfo 使页面自动获取数据
     */
    const handleDeleteTag = (id: Number, T: Number) => {
        switch (T) {
            case 1:
                const Info_YearList = initialState?.searchInfo?.YearList?.filter(x => x !== id);
                const Result_YearList = initialState?.searchResultList?.YearList?.filter(x => x.Key !== id);
                const searchInfo_YearList = Object.assign({}, initialState?.searchInfo, { YearList: Info_YearList },);
                const searchResultList_YearList = Object.assign({}, initialState?.searchResultList, { YearList: Result_YearList },);
                setInitialState({
                    ...initialState,
                    searchInfo: searchInfo_YearList,
                    searchResultList: searchResultList_YearList,
                });
                break;
            case 2:
                const Info_MonthList = initialState?.searchInfo?.MonthList?.filter(x => x !== id);
                const Result_MonthList = initialState?.searchResultList?.MonthList?.filter(x => x.Key !== id);
                const searchInfo_MonthList = Object.assign({}, initialState?.searchInfo, { MonthList: Info_MonthList },);
                const searchResultList_MonthList = Object.assign({}, initialState?.searchResultList, { MonthList: Result_MonthList },);
                setInitialState({
                    ...initialState,
                    searchInfo: searchInfo_MonthList,
                    searchResultList: searchResultList_MonthList,
                });
                break;
            case 3:
                const Info_BizType1List = initialState?.searchInfo?.BizType1List?.filter(x => x !== id);
                const Result_BizType1List = initialState?.searchResultList?.BizType1List?.filter(x => x.Key !== id);
                const searchInfo_BizType1List = Object.assign({}, initialState?.searchInfo, { BizType1List: Info_BizType1List },);
                const searchResultList_BizType1List = Object.assign({}, initialState?.searchResultList, { BizType1List: Result_BizType1List },);
                setInitialState({
                    ...initialState,
                    searchInfo: searchInfo_BizType1List,
                    searchResultList: searchResultList_BizType1List,
                });
                break;
            case 4:
                const Info_BizType2List = initialState?.searchInfo?.BizType2List?.filter(x => x !== id);
                const Result_BizType2List = initialState?.searchResultList?.BizType2List?.filter(x => x.Key !== id);
                const searchInfo_BizType2List = Object.assign({}, initialState?.searchInfo, { BizType2List: Info_BizType2List },);
                const searchResultList_BizType2List = Object.assign({}, initialState?.searchResultList, { BizType2List: Result_BizType2List },);
                setInitialState({
                    ...initialState,
                    searchInfo: searchInfo_BizType2List,
                    searchResultList: searchResultList_BizType2List,
                });
                break;
            case 5:
                const Info_OceanTransportTypeList = initialState?.searchInfo?.OceanTransportTypeList?.filter(x => x !== id);
                const Result_OceanTransportTypeList = initialState?.searchResultList?.OceanTransportTypeList?.filter(x => x.Key !== id);
                const searchInfo_OceanTransportTypeList = Object.assign({}, initialState?.searchInfo, { OceanTransportTypeList: Info_OceanTransportTypeList },);
                const searchResultList_OceanTransportTypeList = Object.assign({}, initialState?.searchResultList, { OceanTransportTypeList: Result_OceanTransportTypeList },);
                setInitialState({
                    ...initialState,
                    searchInfo: searchInfo_OceanTransportTypeList,
                    searchResultList: searchResultList_OceanTransportTypeList,
                });
                break;
            default: return;
        }
    }

    /**
     * 年份单选
     * @param e 
     */
    const onYearRadioChange = (e: any) => {
        const searchInfo_Year = Object.assign({}, initialState?.searchInfo, { Year: e.target.value },);
        const searchResultList_Year = Object.assign({}, initialState?.searchResultList, { Year: e.target.value },);
        setInitialState({
            ...initialState,
            searchInfo: searchInfo_Year,
            searchResultList: searchResultList_Year,
        });
    }

    return (
        <>
            {
                initialState && initialState.searchResultList ?
                    <Card className={styles.searchResultCard} title={"搜索条件"}>

                        {
                            // 月份货量和收支利润没有月份的搜索条件
                            PropsState && PropsState == 1 || PropsState && PropsState == 5 ?
                                <>
                                    <Row>
                                        <Radio.Group buttonStyle="solid" size="small" onChange={onYearRadioChange} defaultValue={initialState?.searchInfo?.Year}>
                                            {
                                                YearList && YearList.length > 0 ? YearList.map(x => {
                                                    return <Radio.Button key={x.Key} value={x.Key} style={{ marginLeft: 5 }}>{x.Value}</Radio.Button>
                                                }) : null
                                            }
                                        </Radio.Group>
                                    </Row>

                                    <Row>
                                        {
                                            initialState && initialState.searchResultList ? initialState.searchResultList.BizType1List?.map((x, index) => {
                                                return (
                                                    <Tag
                                                        style={{ margin: 5 }}
                                                        color="red"
                                                        key={x.Key}
                                                        closable={index > -1}
                                                        onClose={() => handleDeleteTag(x.Key, 3)}
                                                    >
                                                        {x.Value}
                                                    </Tag>
                                                )
                                            }) : null
                                        }
                                    </Row>

                                    <Row>
                                        {
                                            initialState && initialState.searchResultList ? initialState.searchResultList.BizType2List?.map((x, index) => {
                                                return (
                                                    <Tag
                                                        style={{ margin: 5 }}
                                                        color="red"
                                                        key={x.Key}
                                                        closable={index > -1}
                                                        onClose={() => handleDeleteTag(x.Key, 4)}
                                                    >
                                                        {x.Value}
                                                    </Tag>
                                                )
                                            }) : null
                                        }
                                    </Row>

                                    <Row>
                                        {
                                            initialState && initialState.searchResultList ? initialState.searchResultList.OceanTransportTypeList?.map((x, index) => {
                                                return (
                                                    <Tag
                                                        style={{ margin: 5 }}
                                                        color="red"
                                                        key={x.Key}
                                                        closable={index > -1}
                                                        onClose={() => handleDeleteTag(x.Key, 5)}
                                                    >
                                                        {x.Value}
                                                    </Tag>
                                                )
                                            }) : null
                                        }
                                    </Row>
                                </> :
                            // 现金流只有年份的搜索条件
                            PropsState && PropsState == 4 ?
                                <>
                                    <Row>
                                        <Radio.Group buttonStyle="solid" size="small" onChange={onYearRadioChange} defaultValue={initialState?.searchInfo?.Year}>
                                            {
                                                YearList && YearList.length > 0 ? YearList.map(x => {
                                                    return <Radio.Button key={x.Key} value={x.Key} style={{ marginLeft: 5 }}>{x.Value}</Radio.Button>
                                                }) : null
                                            }
                                        </Radio.Group>
                                    </Row>
                                </> :
                                <>
                                    {/* <Row>
                                        {
                                            initialState && initialState.searchResultList ? initialState.searchResultList.YearList?.map((x, index) => {
                                                return (
                                                    <Tag
                                                        style={{ margin: 5 }}
                                                        color="red"
                                                        key={x.Key}
                                                        closable={index > -1}
                                                        onClose={() => handleDeleteTag(x.Key, 1)}
                                                    >
                                                        {x.Value}
                                                    </Tag>
                                                )
                                            }) : null
                                        }
                                    </Row> */}

                                    <Row>
                                        <Radio.Group buttonStyle="solid" size="small" onChange={onYearRadioChange} defaultValue={initialState?.searchInfo?.Year}>
                                            {
                                                YearList && YearList.length > 0 ? YearList.map(x => {
                                                    return <Radio.Button key={x.Key} value={x.Key} style={{ marginLeft: 5 }}>{x.Value}</Radio.Button>
                                                }) : null
                                            }
                                        </Radio.Group>
                                    </Row>

                                    <Row>
                                        {
                                            initialState && initialState.searchResultList ? initialState.searchResultList.MonthList?.map((x, index) => {
                                                return (
                                                    <Tag
                                                        style={{ margin: 5 }}
                                                        color="red"
                                                        key={x.Key}
                                                        closable={index > -1}
                                                        onClose={() => handleDeleteTag(x.Key, 2)}
                                                    >
                                                        {x.Value}
                                                    </Tag>
                                                )
                                            }) : null
                                        }
                                    </Row>

                                    <Row>
                                        {
                                            initialState && initialState.searchResultList ? initialState.searchResultList.BizType1List?.map((x, index) => {
                                                return (
                                                    <Tag
                                                        style={{ margin: 5 }}
                                                        color="red"
                                                        key={x.Key}
                                                        closable={index > -1}
                                                        onClose={() => handleDeleteTag(x.Key, 3)}
                                                    >
                                                        {x.Value}
                                                    </Tag>
                                                )
                                            }) : null
                                        }
                                    </Row>

                                    <Row>
                                        {
                                            initialState && initialState.searchResultList ? initialState.searchResultList.BizType2List?.map((x, index) => {
                                                return (
                                                    <Tag
                                                        style={{ margin: 5 }}
                                                        color="red"
                                                        key={x.Key}
                                                        closable={index > -1}
                                                        onClose={() => handleDeleteTag(x.Key, 4)}
                                                    >
                                                        {x.Value}
                                                    </Tag>
                                                )
                                            }) : null
                                        }
                                    </Row>

                                    <Row>
                                        {
                                            initialState && initialState.searchResultList ? initialState.searchResultList.OceanTransportTypeList?.map((x, index) => {
                                                return (
                                                    <Tag
                                                        style={{ margin: 5 }}
                                                        color="red"
                                                        key={x.Key}
                                                        closable={index > -1}
                                                        onClose={() => handleDeleteTag(x.Key, 5)}
                                                    >
                                                        {x.Value}
                                                    </Tag>
                                                )
                                            }) : null
                                        }
                                    </Row>
                                </>
                        }
                    </Card> : null
            }
        </>
    )
}

export default SearchResultList;