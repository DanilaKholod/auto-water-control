"use client"
import {Checkbox,Form} from "antd"
const {Item} = Form;

interface CheckboxProps {
    name: string,
    checked?: boolean,
    disabled?: boolean,
    onChange?:(e: any) => void,
    onFocus?:(e: any) => void,
    onBlur?:(e: any) => void,
    fontWeight?: number,
    label?: string,
    children?: any
}

const CheckboxItem=({name, checked,onChange,onFocus,onBlur,fontWeight,label, disabled=false, children
}: CheckboxProps) => {
    return (
        <Item
            style={{fontWeight:`${fontWeight}`}}
            label={label}
            name={name}
            valuePropName="checked">
            <Checkbox checked={checked} disabled={disabled} onChange={onChange} onFocus={onFocus} onBlur={onBlur}>
                {children}
            </Checkbox>
        </Item>
    )
}

export default CheckboxItem;