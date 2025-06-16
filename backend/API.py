from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Optional
from pymongo import MongoClient
from pymongo.errors import PyMongoError
import logging
import pandas as pd
from io import StringIO
from bson import ObjectId
from bson.json_util import dumps, loads
import os

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Система автоматизации химического контроля",
    description="API для системы мониторинга химических параметров",
    version="1.0.0"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение к MongoDB
try:
    mongo_client = MongoClient("mongodb+srv://pnpandrew79:1@cluster0.ipeua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = mongo_client["sensors_db"]
    sensor_data_collection = db["sensor_readings"]
    notifications_collection = db["notifications"]
    logger.info("Successfully connected to MongoDB")
except PyMongoError as e:
    logger.error(f"Error connecting to MongoDB: {str(e)}")
    raise



# Модели Pydantic
class SensorData(BaseModel):
    sensor_id: str
    parameter: str
    value: float
    timestamp: datetime
    unit: str


class SensorDataBatch(BaseModel):
    measurements: List[SensorData]


class Notification(BaseModel):
    id: str
    message: str
    severity: str  # 'warning' или 'critical'
    timestamp: datetime
    resolved: bool


class ExportRequest(BaseModel):
    start_date: datetime
    end_date: datetime
    parameters: List[str]
    format: str  # 'csv' или 'excel'


class MongoSensorData(BaseModel):
    _id: str
    date: datetime
    name_of_sensor: str
    value: float


# Эндпоинты API
@app.post("/api/data", response_model=dict)
async def receive_sensor_data(data: SensorDataBatch):
    """
    Прием данных от датчиков через data_processing.py
    """
    try:
        inserted_ids = []
        for measurement in data.measurements:
            # Проверка на отклонения от нормы
            check_anomalies(measurement)

            # Сохранение в MongoDB
            doc = {
                "date": measurement.timestamp,
                "name_of_sensor": measurement.parameter,
                "value": measurement.value,
                "sensor_id": measurement.sensor_id,
                "unit": measurement.unit
            }
            result = sensor_data_collection.insert_one(doc)
            inserted_ids.append(str(result.inserted_id))

        return {"status": "success", "inserted_ids": inserted_ids}
    except PyMongoError as e:
        logger.error(f"MongoDB error saving sensor data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error saving sensor data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/data", response_model=List[MongoSensorData])
async def get_sensor_data(
        name_of_sensor: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = Query(100, gt=0, le=1000)
):
    """
    Получение данных для отображения во фронтенде (без фильтрации по sensor_id)
    """
    try:
        query = {}

        if name_of_sensor:
            query["name_of_sensor"] = name_of_sensor

        if start_date and end_date:
            query["date"] = {"$gte": start_date, "$lte": end_date}
        elif start_date:
            query["date"] = {"$gte": start_date}
        elif end_date:
            query["date"] = {"$lte": end_date}

        cursor = sensor_data_collection.find(query).sort("date", -1).limit(limit)

        results = []
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            results.append(doc)

        return results
    except PyMongoError as e:
        logger.error(f"MongoDB error fetching sensor data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching sensor data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/export")
async def export_data(request: ExportRequest):
    """
    Экспорт данных в CSV или Excel
    """
    try:
        query = {"date": {"$gte": request.start_date, "$lte": request.end_date}}

        if request.parameters:
            query["name_of_sensor"] = {"$in": request.parameters}

        cursor = sensor_data_collection.find(query)

        # Преобразование курсора в список словарей
        data = list(cursor)

        if not data:
            raise HTTPException(status_code=404, detail="No data found for the specified criteria")

        # Преобразование в DataFrame
        df = pd.DataFrame(data)

        # Удаление поля _id и преобразование ObjectId
        if '_id' in df.columns:
            df['_id'] = df['_id'].apply(lambda x: str(x))

        # Приведение к нужным типам данных
        df['date'] = pd.to_datetime(df['date'])
        df['value'] = pd.to_numeric(df['value'])

        if request.format == "csv":
            csv_buffer = StringIO()
            df.to_csv(csv_buffer, index=False)
            return {"content": csv_buffer.getvalue(), "format": "text/csv"}

        elif request.format == "excel":
            excel_buffer = StringIO()
            with pd.ExcelWriter(excel_buffer, engine='openpyxl') as writer:
                df.to_excel(writer, index=False)
            return {"content": excel_buffer.getvalue(),
                    "format": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}

        else:
            raise HTTPException(status_code=400, detail="Unsupported format")

    except PyMongoError as e:
        logger.error(f"MongoDB error exporting data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error exporting data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/notifications", response_model=List[Notification])
async def get_notifications(resolved: Optional[bool] = None):
    """
    Получение уведомлений об отклонениях
    """
    try:
        query = {}
        if resolved is not None:
            query["resolved"] = resolved

        cursor = notifications_collection.find(query)

        results = []
        for doc in cursor:
            doc["id"] = str(doc["_id"])
            del doc["_id"]
            results.append(doc)

        return results
    except PyMongoError as e:
        logger.error(f"MongoDB error fetching notifications: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching notifications: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/notifications/{notification_id}/resolve", response_model=Notification)
async def resolve_notification(notification_id: str):
    """
    Пометить уведомление как решенное
    """
    try:
        result = notifications_collection.update_one(
            {"_id": ObjectId(notification_id)},
            {"$set": {"resolved": True}}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")

        # Получаем обновленный документ
        updated_doc = notifications_collection.find_one({"_id": ObjectId(notification_id)})
        updated_doc["id"] = str(updated_doc["_id"])
        del updated_doc["_id"]

        return updated_doc
    except PyMongoError as e:
        logger.error(f"MongoDB error resolving notification: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error resolving notification: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    return {"message": "Auto Water Control API is running."}


# Вспомогательные функции
def check_anomalies(measurement: SensorData):
    """
    Проверка на отклонения от допустимых значений и создание уведомлений
    """
    # Здесь должны быть реальные пороговые значения для каждого параметра
    thresholds = {
        "temperature": {"min": 10, "max": 30},
        "ph": {"min": 6.5, "max": 8.5},
        "nitrites": {"max": 0.5},
        "nitrates": {"max": 50},
        "oxygen": {"min": 4},
        "turbidity": {"max": 5}
    }

    if measurement.parameter not in thresholds:
        return

    rules = thresholds[measurement.parameter]
    is_anomaly = False
    message = ""

    if "min" in rules and measurement.value < rules["min"]:
        is_anomaly = True
        message = f"{measurement.parameter} ниже допустимого уровня: {measurement.value} {measurement.unit}"
    elif "max" in rules and measurement.value > rules["max"]:
        is_anomaly = True
        message = f"{measurement.parameter} выше допустимого уровня: {measurement.value} {measurement.unit}"

    if is_anomaly:
        try:
            # Определение серьезности аномалии
            severity = "warning"
            if measurement.parameter in ["ph", "oxygen", "nitrites"]:
                severity = "critical"

            notification = {
                "message": message,
                "severity": severity,
                "timestamp": datetime.now(),
                "resolved": False
            }

            notifications_collection.insert_one(notification)

            # Здесь можно добавить отправку уведомления по email/telegram и т.д.
            logger.warning(f"Anomaly detected: {message}")

        except PyMongoError as e:
            logger.error(f"MongoDB error saving notification: {str(e)}")
        except Exception as e:
            logger.error(f"Error saving notification: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)