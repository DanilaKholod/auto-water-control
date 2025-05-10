'use client'
import "./methodsPatientModal.css";
import Spacer from "@/components/Universal/Spacer/Spacer";
import Button from "@/components/Universal/Button/Button";
import { Modal, Form } from 'antd';
import { Flex } from "antd";
import TextField from "@/components/Universal/TextField/TextField";
import CheckboxItem from "@/components/Universal/Checkbox/Checkbox";
import { DatePicker } from "antd";
import {useMemo} from "react";
const {Item} =Form;
import ConfigProvider from 'antd/es/config-provider';
import locale from 'antd/locale/ru_RU';
import ConditionalRender from "@/components/Universal/ConditionalRender/ConditionalRender";


export default function MethodsPatientModal({patient,ModalFinish, isModalOpen, handleCancel, method }:any) {
    // const [form] = Form.useForm()
    // const watchedValues = Form.useWatch([], form)

    const { rules }=useMemo(()=>({
        rules: [{
            required: true,
            message: 'Введите дату рождения пациента',
            type: 'string',
            validator: (_:never, value:any) => !value ?
                Promise.reject(new Error('Введите дату рождения пациента')) :
                Promise.resolve()
        }]

    }),[]);

    // const changeField = (field: string, value: any) => {
    //     form.setFieldsValue({ [field]: value });
    // };
    // useEffect(() => {
    //     changeField('active', patient?.active);
    //     changeField('malignancy', patient?.malignancy);
    // },[isModalOpen]);

    const title = method === "create" ? "Создание карты" : "Редактирование карты"
    return (

        <Modal
            title={title}
            open={isModalOpen} onCancel={handleCancel} footer={null} width={600} destroyOnClose={true}>
            <Form   onFinish={ModalFinish} layout='vertical'
            initialValues={{
                diagnosis: patient?.diagnosis,
                active: patient?.active,
                malignancy: patient?.malignancy
            }}>
                <Flex className='modal_form' vertical>
                    <Spacer space={30} />
                    <ConditionalRender condition={method==="create"}>
                        <TextField
                            errorText='Введите фамилию пациента'
                            name="surname"
                            required
                            label="Фамилия"
                        />
                        <TextField
                            errorText='Введите имя пациента'
                            name="name"
                            required
                            label="Имя"
                        />
                        <TextField
                            errorText='Введите отчество пациента'
                            name="patronymic"
                            required
                            label="Отчество"
                        />
                        <TextField
                            errorText='Введите полис пациента'
                            name="polis"
                            required
                            label="Полис ОМС"
                        />
                        <TextField
                            errorText='Введите email пациента'
                            name="email"
                            required
                            label="Электронная почта"
                            rulesType='email'
                        />

                        <ConfigProvider locale={locale}>
                            <Item
                                // rules={rules}
                                name='birthdayDate' label="Дата рождения пациента" required={false}>
                                <DatePicker style={{width:'100%'}} size='large'/>
                            </Item>
                        </ConfigProvider>

                        <TextField
                            errorText='Введите диагноз пациента'
                            name="diagnosis"
                            required
                            label="Диагноз"
                        />
                        <Flex>
                        <CheckboxItem name="active" >Активен</CheckboxItem>
                        <CheckboxItem name="malignancy">Подозрение</CheckboxItem>
                        </Flex>
                    </ConditionalRender>

                    <ConditionalRender condition={method==="update"}>

                    <TextField
                        errorText='Введите диагноз пациента'
                        name="diagnosis"
                        required
                        label="Диагноз"
                    />
                         <CheckboxItem name="active" >Активен</CheckboxItem>
                         <CheckboxItem name="malignancy">Подозрение</CheckboxItem>
                    </ConditionalRender>

                </Flex>
                <Spacer space={25} />
                <Flex className='modal_buttons' gap={10} justify='end'>
                    <Button  onClick={handleCancel} width={20} title='Отменить' type='default' className='button' block={false}/>
                    <Button
                        // onClick={()=> handleSend(watchedValues)}
                        width={20} title='Начать' htmlType="submit" type='primary' block={false}/>
                </Flex>
            </Form>
        </Modal>
    )
}