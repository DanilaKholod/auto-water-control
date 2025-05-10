import "./DeleteItemOfListModal.css";
import Spacer from "@/components/Universal/Spacer/Spacer";
import Text from "@/components/Universal/Text/Text";
import Button from "@/components/Universal/Button/Button";
import { Modal, Form, Checkbox, Flex, ConfigProvider } from 'antd';
import React, {Dispatch, useCallback, useMemo, useState} from "react";
import useAPI from "@/utils/useAPI/useAPI";

const { Item } = Form;

interface BaseItemDataType{
    key: React.Key;
}

interface useDeleteItemOfListModalProps<ItemDataType extends BaseItemDataType>{
    dataSource:ItemDataType[];
    setDataSource:Dispatch<ItemDataType[]>;
    title:string;
    checkBoxText:string;
}

export function useDeleteItemOfListModal<ItemDataType extends BaseItemDataType>({
        dataSource,
        setDataSource,
        title,
        checkBoxText
    }:useDeleteItemOfListModalProps<ItemDataType>) {
    const [confirmationText, setConfirmationText] = useState<string>();

    const [deletingItemId, setDeletingItemId] = useState<React.Key>();

    const [isModalOpenDeleteItem, setIsModalOpenDeleteItem] = useState<boolean>();

    const showModalDeleteItem = useCallback(() => {
        setIsModalOpenDeleteItem(true);
    },[setIsModalOpenDeleteItem]);

    const handleOkDeleteItem = useCallback(() => {
        setIsModalOpenDeleteItem(false);
    },[setIsModalOpenDeleteItem]);

    const handleCancelDeleteItem = useCallback(() => {
        setIsModalOpenDeleteItem(false);
    },[setIsModalOpenDeleteItem]);

    const ModalFinishDeleteItem = useCallback(() => {
        setDataSource(dataSource.filter(({ key }) => key != deletingItemId));
        handleOkDeleteItem();
    },[dataSource, deletingItemId, handleOkDeleteItem, setDataSource]);

    const rules = useMemo(() => ([{
            required:true,
            message:'Подтвердите свое действие',
            type:'boolean',
            validator: (_:never, value:boolean) => !value ?
                Promise.reject(new Error('Подтвердите свое действие')) :
                Promise.resolve()
        }]
    ),[]);

    function DeleteItemOfListModal() {
        const [form] = Form.useForm();

        const { checked } = Form.useWatch(({ checked }) => ({ checked }), form) ?? { checked: true };

        return (
        <ConfigProvider
            theme = {{
                components: {
                    Button: {
                        colorPrimary:'#d9363e',
                        colorPrimaryActive:'#ff4d4f',
                        colorPrimaryHover:'#ff4d4f',
                        defaultActiveBorderColor:'#d9d9d9',
                        defaultActiveColor:'black',
                        defaultHoverBorderColor:'#d9d9d9',
                        defaultHoverColor:'black'
                    },
                    Checkbox: {
                        colorPrimary:'#d9363e',
                        colorPrimaryActive:'#ff4d4f',
                        colorPrimaryHover:'#ff4d4f'
                    },
                },
            }}
        >
            <Modal title={title} open={isModalOpenDeleteItem} onCancel={handleCancelDeleteItem} footer={null} width={600} destroyOnClose={true}>
                <Spacer space={15}/>
                <Form onFinish={ModalFinishDeleteItem} form={form}>
                    <Flex className='modal_form' vertical>
                        <Spacer space={15}/>
                        <Text>{confirmationText}</Text>
                            <Spacer space={15}/>
                        <Item layout='vertical' rules={rules} name='checked'  valuePropName="checked">
                            <Checkbox>{checkBoxText}</Checkbox>
                        </Item>
                        <Spacer space={65}/>
                    </Flex>

                    <Spacer space={15}/>
                    <Flex className="modal_buttons" gap={10} justify='end'>
                        <Button onClick={handleCancelDeleteItem} width={20} title='Отменить' type='default' className='button' block={false}/>
                        <Button className="delete_button" width={20} title='Удалить' htmlType='submit' type='primary' block={false} disabled={!checked}/>
                    </Flex>
                </Form>
            </Modal>
        </ConfigProvider>
        )
    }

    return {
        DeleteItemOfListModal:DeleteItemOfListModal,
        setDeletingItemId:setDeletingItemId,
        deletingItemId:deletingItemId,
        showModalDeleteItem:showModalDeleteItem,
        setConfirmationText:setConfirmationText,
    }
}