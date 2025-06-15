'use client';

import '@ant-design/v5-patch-for-react-19'
import {Input, Button, Flex} from 'antd';
import Link from 'next/link';
import {useRouter} from "next/navigation";

export default function LoginPage() {
    const router = useRouter()
    const handleLogin = (e: any) => {
        e.preventDefault();
        router.push("/list_sensors")


        // Здесь можно добавить логику отправки формы
    };

    return (
        <div className="flex h-screen bg-[#9ACBE1]">
            {/* Левая линия */}
            <div className="w-[10px] bg-white h-full"></div>

            {/* Центральная форма */}
            <div className="flex-1 flex justify-center items-center font-[MorfinSans]">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
                    <h1 className="text-black text-[40px] tracking-[1px] mb-8 text-center overflow-hidden whitespace-nowrap text-ellipsis">
                        ВХОД В ЛИЧНЫЙ КАБИНЕТ
                    </h1>

                    <form onSubmit={handleLogin}>
                        <div className="mb-8">
                            <label
                                htmlFor="login"
                                className="block text-black text-[20px]  mb-2 text-left pl-0.5"
                            >
                                ЛОГИН
                            </label>
                            <Input
                                id="login"
                                name="login"
                                required
                                className="w-full h-auto py-3 px-4 border border-black rounded-md text-[20px] font-normal"
                            />
                        </div>

                        <div className="mb-10">
                            <label
                                htmlFor="password"
                                className="block text-black text-[20px] mb-2 text-left pl-0.5"
                            >
                                ПАРОЛЬ
                            </label>
                            <Input.Password
                                id="password"
                                name="password"
                                required
                                className="w-full h-auto py-3 px-4 border border-black rounded-md text-[20px]"
                            />
                        </div>
<Flex align={"center"}>
                        <Button
                            htmlType="submit"
                            className="bg-[#35739D] text-white !text-xl !font-[MorfinSans] tracking-[1px] w-[263px] !h-[50px] rounded-lg block mx-auto transition-colors duration-300 hover:bg-[#28587a]"
                        >
                            ВОЙТИ
                        </Button></Flex>
                    </form>
                </div>
            </div>
            <div className="w-[10px] bg-white h-full"></div>
        </div>
    );
}