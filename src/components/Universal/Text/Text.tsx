import type {ReactNode} from "react";

interface TextProps {
    children: ReactNode;
    fontSize?:number
    className?:string;
}
const Text=({children, fontSize, className}:TextProps)=>{
    return(<div style={{fontSize:fontSize}} className={className}>
        {children}
    </div>)
}

export default Text;



