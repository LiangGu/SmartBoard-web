//封装的公共文件<React Hooks中使用useContext 进行父组件向子组件传值>
import { createContext } from "react";
const myContext = createContext(0);
export default myContext;