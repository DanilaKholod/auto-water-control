'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import {useMemo} from "react";

export default function SensorChart({data}:{ data: any[] }) {
    const formattedData = useMemo(()=>data.map(item => ({
        time: format(parseISO(item.date), 'HH:mm', { locale: ru }),
        value: item.value,
        name: item.name_of_sensor,
    })),[data]);

    const name = useMemo(()=> {
        switch (formattedData[0].name) {
            case "co2_level":
                return "Концентрация CO2"
           case "pressure":
                return "Давление"
           case "temperature":
                return "Температура"
           case "status":
                return "Статус"
            case "humidity":
                return "Влажность"
            default:
                return formattedData[0].name
        }
    },[formattedData])

    return (
        <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={formattedData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [value, 'Значение']} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        activeDot={{ r: 8 }}
                        name={name}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}