"use client"
import { useCallback } from "react";
import Link from "next/link";
import Text from "@/components/Universal/Text/Text";
import {signOut, useSession} from "next-auth/react";
import noop from "lodash-es/noop";
import ConditionalRender from "@/components/Universal/ConditionalRender/ConditionalRender";
import Image from "next/image";

export default function Header() {
    // const { data: session } = useSession();
    // const exit = useCallback(() => {
    //     signOut({callbackUrl: "/auth-pages/login"}).catch(noop);
    //  },[]);
    //
    // console.log('session frontend', session);

    return (
        <div className="sticky font-[MorfinSans] bg-linear-to-r from-cyan-500 to-blue-500 top-0 z-20 h-[150px] text-white text-5xl font-light flex items-center px-5">
            <div className="flex items-center w-full">
                {/* Логотип / Название сайта */}
                <Image
                    src="/Лого.png"
                    alt="Fish logo"
                    width={108}
                    height={108}
                    priority
                />
                <div className="w-150 p-6">Автохимический контроль водной среды</div>

                {/* Блок ссылок */}
                <div className="flex justify-center flex-grow h-5">

                </div>

                {/* Кнопка выхода */}
                <div className="cursor-pointer hover:underline">Выйти</div>
            </div>
        </div>
    )
}