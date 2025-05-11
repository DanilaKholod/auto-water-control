'use client'

import './auth.css';
import { Flex } from 'antd';
import Text from '@/components/Universal/Text/Text';
import Spacer from '@/components/Universal/Spacer/Spacer';
import {PropsWithChildren} from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
    return (

            <Flex className="auth_pages " justify='space-evenly'>
                <Flex vertical>
                    <Text className="title_first">
                        Виртуальный<br/>ассистент
                    </Text>

                    <Spacer space={20}/>

                    <Text className="title_second">
                        Слепая диагностика узловых образований<br/>щитовидной железы
                    </Text>
                </Flex>
                <div className='auth_container'>
                {children}
                </div>
            </Flex>

    );
}
