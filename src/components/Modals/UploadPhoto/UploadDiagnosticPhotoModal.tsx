"use client";

import "./UploadDiagnosticPhotoModal.css";
import React, {useEffect, useMemo, useState} from "react";
import Spacer from "@/components/Universal/Spacer/Spacer";
import Button from "@/components/Universal/Button/Button";
import Text from "@/components/Universal/Text/Text";
import ConditionalRender from "@/components/Universal/ConditionalRender/ConditionalRender";
import { InboxOutlined } from "@ant-design/icons";
import { Flex, Modal, Form, message, Upload, Checkbox, Select } from "antd";
import type { CheckboxProps, UploadProps } from "antd";
import useAPI from "@/utils/useAPI/useAPI";
import {PatientResponseType} from "@/app/upload_photo/interfaces";
import {isNil} from "lodash-es";
import {PatientDataResponseType} from "@/app/patients/interfaces";

const { Item } = Form;
const { useForm, useWatch } = Form;
const { Dragger } = Upload;

interface PatientDataType {
    key:React.Key;
    fullName:string;
    id?: string;
    //birthdayDate:string;
    //email:string;
    policy?:string;
    active?:boolean;
    //diagnosis:string;
    //lastUziDate:string;
    //malignancy:boolean;
}

interface DeviceDataType {
    key:React.Key;
    id:string;
    name:string;
}

interface UploadDiagnosticPhotoModalProps {
    title:string;
    ModalFinish:any;
    isModalOpen:boolean;
    handleCancel:any;
    patients?:PatientDataType[];
    devices?:DeviceDataType[];
    withUploadPhotoArea:boolean;
    diagnosticTextDescription:string;
    error:string | null;
    handleSend?:any;
    fileImg?:File | null | undefined;
}

export default function UploadDiagnosticPhotoModal({
    title,
    ModalFinish,
    isModalOpen,
    handleCancel,
    patients = [],
    devices = [],
    withUploadPhotoArea,
    diagnosticTextDescription,
    error,
    fileImg,
    handleSend,
}:UploadDiagnosticPhotoModalProps) {
    const [form] = useForm();

    const watchedDeviceId = useWatch("device", form);
    const watchedPatientId = useWatch("patient", form);
    const watchedProjection = useWatch("projection", form);

    const [isFileImg, setIsFileImg] = useState<File | null | undefined>(null);

    const [checked, setChecked] = useState(true);


    const isValidForm = useMemo(()=>{
       return ( watchedDeviceId!=undefined &&
           (watchedPatientId!=undefined || patients.length == 1) &&
           watchedProjection &&
           (isFileImg != null || !withUploadPhotoArea))
           },[watchedProjection, watchedPatientId, watchedDeviceId])

    const [patientData, setPatientData] = useState<PatientDataType[]>([])

    const [{data: patientsList, isLoading, refetch: refetchPatients }]=useAPI<PatientResponseType>({
        APIController:'med',
        APIMethod:'doctors/patient'
    });

    useEffect(()=>{
        console.log(patientsList)
        if(!isNil(patientsList)){
            const patients:PatientDataType[] = patientsList.map((item:PatientDataResponseType, index:number)  => ({
                key: index,
                id: item.id,
                fullName:item.fullname,
            }));
            console.log("patients ", patients)

            setPatientData(patients);
        }
    },[patientsList, isLoading]);

    const onChangeCheckbox:CheckboxProps["onChange"] = (e) => {
        setChecked(e.target.checked);
    };

    const propsDragger:UploadProps = {
        name:"file",
        multiple:false,
        accept:".png,.tiff",
        onChange(info:any) {
        const { file } = info;
        const { status } = file;
        if (status === "done") {
            message.success(`${file.name} файл успешно загружен`);
            setIsFileImg(file.originFileObj);
        } else if (status === "error") {
            message.error(`${file.name} не удалось загрузить файл`);
            setIsFileImg(null);
        } else if (status === "removed") {
            message.success(`${file.name} файл успешно удалён`);
            setIsFileImg(null);
        }
        },
        onDrop(e:any) {
          console.log("Dropped files", e.dataTransfer.files);
        },
    };

    return (
        <Modal
            title={title}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={600}
            destroyOnClose={true}
        >
        {error && <div>Error:{error}</div>}
        {!error && (
            <Form form={form} onFinish={ModalFinish}>
            <Flex className="modal_form" vertical>
                <ConditionalRender condition={withUploadPhotoArea}>
                    <Spacer space={10} />
                    <Dragger {...propsDragger} className="download_area">
                        <Spacer space={20} />
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <Spacer space={20} />
                        <p className="ant-upload-text">
                        Нажмите или перетащите файл в эту область для загрузки
                        </p>
                        <Spacer space={10} />
                        <p className="ant-upload-hint">
                        Выберите файл в формате .png или .tiff
                        </p>
                    </Dragger>
                </ConditionalRender>

                <Spacer space={30} />
                <Item
                style={{ fontSize:"18px" }}
                label="Аппарат"
                layout="vertical"
                name="device"
                required={true}
                >
                <Select
                    options={devices.map((option:DeviceDataType) => {
                        return {
                            value: option.id, label:option.name
                        }
                    })}
                    placeholder="Выберите аппарат"
                />
                </Item>

                <Spacer space={40} />
                <Item
                    style={{ fontSize:"18px" }}
                    label="Проекция"
                    layout="vertical"
                    name="projection"
                    required={true}
                >
                <Select
                    options={[


                    { value:"lateral", label:"Продольная" },
                    { value:"cross", label:"Поперечная" },
                    ]}
                    placeholder="Выберите проекцию"
                />
                </Item>
                <Spacer space={40} />
                <Item  style={{ fontSize:"18px" }}
                       label="Пациент"
                       layout="vertical"
                       name="patient"
                       required={true}>
                    <Select
                        options={patientData.map((option: PatientDataType) => {
                            return {value: option.id, label: option.fullName}})}
                        placeholder="Выберите пациента"
                    />

                </Item>

                <Spacer space={40}/>
                <Text>{diagnosticTextDescription}</Text>

                <Spacer space={10}/>
                <Checkbox checked={checked} onChange={onChangeCheckbox}>
                Сохранить результаты диагностики
                </Checkbox>

                <Spacer space={10}/>
                <ConditionalRender condition={patients.length > 1}>
                    <Item
                        label="Пациент"
                        layout="vertical"
                        style={{ fontSize:"18px" }}
                        name="patient"
                        required={true}
                    >
                        <Select
                            options={Array.isArray(patients) ? patients.map((option:PatientDataType) => ({
                                value:option.key,
                                label:option.fullName,
                                policy:option.policy,
                            })) : []}
                            optionRender={(option) => (
                                <>
                                    <div>{option.label}</div>
                                    <div>{option.data.policy}</div>
                                </>
                            )}
                            placeholder="Выберите пациента"
                        />
                    </Item>
                </ConditionalRender>
            </Flex>

            <Spacer space={40}/>
            <Flex className="modal_buttons" gap={10} justify="end">
                <Button
                    onClick={handleCancel}
                    width={20}
                    title="Отменить"
                    type="default"
                    className="button"
                    block={false}
                />
                <ConditionalRender condition={withUploadPhotoArea}>
                    <Button
                        onClick={() =>
                            handleSend (
                                watchedProjection,
                                // patients[0].key,
                                watchedPatientId,
                                watchedDeviceId,
                                isFileImg
                            )
                        }
                        width={20}
                        title="Начать"
                        htmlType="submit"
                        type="primary"
                    />
                </ConditionalRender>

                <ConditionalRender condition={!withUploadPhotoArea}>
                    <Button
                        onClick={() =>
                            handleSend (
                                watchedProjection,
                                watchedPatientId,
                                watchedDeviceId,
                                isFileImg
                                // fileImg
                            )
                        }
                        width={20}
                        title="Начать"
                        htmlType="submit"
                        type="primary"
                        // disabled={!isValidForm}
                    />
                </ConditionalRender>
            </Flex>
            </Form>
        )}
        </Modal>
    );
}