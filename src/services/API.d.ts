declare namespace API {
  export interface CurrentUser {
    AuthorityIDList: string;
    AuthorityList: string;
    BranchCode: string;
    BranchID: number;
    BusinessLineID: number;
    CityID: number;
    CityName: string;
    CountryID: number;
    CountryName: string;
    DefaultProjecNameFull: string;
    DefaultProjectID: number | null;
    DefaultProjectName: string;
    DefaultSJobCode: string;
    DefaultSJobID: number | null;
    DisplayName: string;
    DivisionID: number;
    FinereportURL: string;
    FuncCurrency: string;
    ID: number;
    IsOpenAccount: boolean;
    IsSalesMan: boolean;
    NumRule: string;
    PUAList: [PUA];
    ProjecBizType1ID: number;
    SystemViewAuth: [number];
    Token: string;
  }

  export interface PUA {
    ProjectID: number;
    ProjectName: string;
    UserID: number;
    AuthorityID: number;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }

  export interface ResponseType {
    [x: string]: any;
    Result?: boolean;
    Content?: any;
    Page?: {};
  }

  // 总部登录选择的公司
  export interface SelectBranchInfo {
    BranchID?: number;
    BranchName?: string;
  }

  // 页面的搜索条件
  export interface SearchInfo {
    Year?: Number,
    YearList?: Array<Number>,
    MonthList?: Array<Number>,
    BizType1List?: Array<Number>,
    BizType2List?: Array<Number>,
    OceanTransportTypeList?: Array<Number>,
  }

  // 页面的搜索条件 Tag 形式
  export interface SearchResultList {
    Year?: Number,
    YearList?: [Tag],
    MonthList?: [Tag],
    BizType1List?: [Tag],
    BizType2List?: [Tag],
    OceanTransportTypeList?: [Tag],
  }

  export interface Tag {
    Key: number;
    Value: string;
  }

}