"use client";
import React from "react";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';

export default function AntDesignProvider({ children }: any){
    return(
    <ConfigProvider
        theme={{
            token: {
                colorPrimary: "#0047e0",
                colorPrimaryActive: "#0236a5",
                colorPrimaryHover: "#3867df",
                controlHeightLG: 50
            }
        }}>
        <AntdRegistry>
            { children }
        </AntdRegistry>
    </ConfigProvider>

    )

};