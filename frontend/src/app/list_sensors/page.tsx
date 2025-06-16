"use client"
import React, {useState} from "react";
import {Table, Modal, Card, Typography, Button, Alert, List, Spin} from "antd";
import axios from "axios";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import Header from "@/components/Header/Header"
import '@ant-design/v5-patch-for-react-19'
import SensorChart from "@/components/SensorChart/page";

const { Title } = Typography;

// Типы данных
interface Sensor {
    key?: React.Key;
    id?: string;
    name_of_sensor: string;
    time?: string;
    date?: string;
    value: number;
}

interface DetailedSensorData {
    ph: number[];
    oxygen: number[];
    turbidity: number[];
    alerts: { time: string; message: string }[];
}


// Получение данных с API

const availableSensors = [
    { key: 'temperature', name_of_sensor: 'Температура (°C)' },
    { key: 'humidity', name_of_sensor: 'Влажность (%)' },
    { key: 'pressure', name_of_sensor: 'Давление (мм рт. ст.)' },
    { key: 'status', name_of_sensor: 'Статус' },
    { key: 'co2_level', name_of_sensor: 'CO₂ (ppm)' },
];

const fetchSensors = async (): Promise<Sensor[]> => {
    const response = await axios.get(
        "http://localhost:8000/api/data?name_of_sensor=temperature&limit=10"
    );
    return response.data.map((item: any) => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        name_of_sensor: item.name_of_sensor,
        time: new Date(item.time).toLocaleString(),
        value: item.value?.toFixed(2),
    }));
};

// Получение детальных данных
const fetchSensorDetails = async (id: string): Promise<DetailedSensorData> => {
    // Здесь можно использовать другой эндпоинт, если он доступен
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve({
                ph: [7.4, 7.5, 7.3, 7.6],
                oxygen: [8.1, 8.2, 8.0, 8.1],
                turbidity: [2.1, 2.3, 2.0, 2.2],
                alerts: [
                    { time: "2025-05-09 14:30", message: "Высокое значение pH" },
                    { time: "2025-05-09 15:00", message: "Нормализация уровня кислорода" },
                ],
            });
        }, 500)
    );
};


// const availableSensors = [
//     { key: "temperature", name_of_sensor: "Температура (°C)", value: 25, date: "2025-05-09T16:53:57"  },
//     { key: "humidity", name_of_sensor: "Влажность (%)", value: 80, date: "2025-05-09T16:53:57"},
//     { key: "pressure", name_of_sensor: "Давление (мм рт. ст.)",value: 770, date: "2025-05-09T16:53:57" },
//     { key: "status", name_of_sensor: "Статус", value: 0, date: "2025-05-09T16:53:57"},
//     { key: "co2_level", name_of_sensor: "CO₂ (ppm)", value: 0, date: "2025-05-09T16:53:57"},
// ]
export default function App() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedSensor, setSelectedSensor] = React.useState<Sensor | null>(null);

    const fetchLastSensorData = async () => {
        const promises = availableSensors.map((sensor) =>
            axios.get(
                `http://localhost:8000/api/data?name_of_sensor=${sensor.key}&limit=1`
            )
        );

        const responses = await Promise.all(promises);

        return responses.map((res, index) => {
            const latest = res.data[0];
            return {
                ...availableSensors[index],
                value: latest?.value ?? '—',
                date: latest?.date ?? null,
            };
        });
    };

    const { data: lastSensorData, isLoading, isFetching: isFetchingLastSensor, isError:isErrorLastSensor } = useQuery(
        ['all-sensor-data'],
        fetchLastSensorData,
        {
            refetchInterval: 60000, // обновлять каждые 60 секунд
        }
    );

    const [clickSensor, setClickSensor] = useState("temperature")

    const {data: sensorData, isLoading: isSensorLoading, refetch: refetchSensor, isFetching, isError} = useQuery({queryKey: ["sensor", clickSensor],
    queryFn: async ()=>
    {
        console.log("clickSensor ", clickSensor)
        const res = await axios.get(`http://localhost:8000/api/data?name_of_sensor=${clickSensor}&limit=20`);
        return res.data
    },
    onError: (e: any) => {
        console.log(e)
    },
        onSuccess:() => console.log("data ",sensorData)
})


    const showModal = (key: string) => {
        setClickSensor(key);
        // await refetchSensor()
        console.log("key", key)
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const columns = [
        {
            title: "Датчик",
            dataIndex: "name_of_sensor",
            key: "name_of_sensor",
        },
        {
            title: "Значение",
            dataIndex: "value",
            key: "value",
        },
        {
            title: "Время опроса",
            dataIndex: "date",
            key: "date",
            render: (_: string) => {
               const date = dayjs(_).format("DD MMMM H:MM")
                   return (<>{date}</>)
            }
        },
        {
            title: "",
            key: "action",
            render: (_: any, record: Sensor) => (
                <Button type="link" onClick={() => {
                    showModal(_.key)
                    console.log(record)

                }}>
                    Подробнее
                </Button>
            ),
        },
    ];

    return (
        <><Header></Header>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <Card className="max-w-4xl mx-auto shadow-lg rounded-xl overflow-hidden border border-gray-200">
                <Title level={2} className="text-center mb-6 text-indigo-800">
                    Список датчиков
                </Title>

                {isErrorLastSensor ? (
                    <Alert
                        message="Ошибка загрузки данных"
                        description="Попробуйте перезагрузить страницу."
                        type="error"
                        showIcon
                        className="mb-4"
                    />
                ) : (
                    <Table
                        dataSource={lastSensorData}
                        columns={columns}
                        loading={isFetchingLastSensor}
                        pagination={{ pageSize: 5 }}
                        rowKey="key"
                        className="bg-white rounded-lg overflow-hidden"
                    />
                )}
            </Card>

            {/* Модальное окно */}
            <Modal
                title={`Детали датчика: ${clickSensor}`}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="close" onClick={handleCancel}>
                        Закрыть
                    </Button>,
                ]}
                width={800}
                height={500}
            >
                {isSensorLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <span className="text-gray-500">Загрузка данных...</span>
                    </div>
                ) : sensorData ? (
                    <div className="space-y-6">
                        <div>
                  {/*          <h3 className="font-semibold text-gray-700">pH</h3>*/}
                  {/*          <div className="flex gap-2 mt-2">*/}
                  {/*              {details.ph.map((val, i) => (*/}
                  {/*                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md">*/}
                  {/*  {val}*/}
                  {/*</span>*/}
                  {/*              ))}*/}
                  {/*          </div>*/}
                  {/*      </div>*/}

                  {/*      <div>*/}
                  {/*          <h3 className="font-semibold text-gray-700">Кислород</h3>*/}
                  {/*          <div className="flex gap-2 mt-2">*/}
                  {/*              {details.oxygen.map((val, i) => (*/}
                  {/*                  <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-md">*/}
                  {/*  {val}*/}
                  {/*</span>*/}
                  {/*              ))}*/}
                  {/*          </div>*/}
                  {/*      </div>*/}

                  {/*      <div>*/}
                  {/*          <h3 className="font-semibold text-gray-700">Мутность</h3>*/}
                  {/*          <div className="flex gap-2 mt-2">*/}
                  {/*              {details.turbidity.map((val, i) => (*/}
                  {/*                  <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md">*/}
                  {/*  {val}*/}
                  {/*</span>*/}
                  {/*              ))}*/}
                  {/*          </div>*/}
                        <SensorChart data={sensorData}/>
                            <List
                        dataSource={sensorData}
                        loading={isSensorLoading}
                        renderItem={(item:Sensor)=> (
                            <List.Item key={item.date}>
                                <List.Item.Meta title={item.value}
                                description={dayjs(item.date).format("DD MMMM H:MM")}
                                prefixCls={item.name_of_sensor}
                                >
                                    {item.name_of_sensor}
                                </List.Item.Meta>
                            </List.Item>
                            )}>
                        </List>


                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700">Оповещения</h3>
                            <ul className="mt-2 space-y-2">
                                {/*{details.alerts.length > 0 ? (*/}
                                {/*    details.alerts.map((alert, i) => (*/}
                                {/*        <li key={i} className="border-l-4 border-red-500 pl-3 py-1 bg-red-50 rounded">*/}
                                {/*            <strong>{alert.time}</strong>: {alert.message}*/}
                                {/*        </li>*/}
                                {/*    ))*/}
                                {/*) : (*/}
                                {/*    <span className="text-gray-400">Нет оповещений</span>*/}
                                {/*)}*/}
                            </ul>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </div>
        </>);
}