import socket
from pymongo import MongoClient
from datetime import datetime
import time

# Настройки подключения
HOST = 'localhost'  # или IP-адрес сервера
PORT = 8080         # 4-значный порт
MONGO_URI = "mongodb+srv://pnpandrew79:1@cluster0.ipeua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"  # Замените на ваш URI MongoDB
DB_NAME = "sens=ors_db"
COLLECTION_NAME = "sensor_readings"

# Имена датчиков (должны соответствовать порядку в передаваемых данных)
SENSOR_NAMES = ["temperature", "humidity", "pressure", "co2_level", "status"]

BUFFER_SIZE = 4096  # Размер буфера для приема данных


def parse_sensor_data(line):
    """Парсит строку данных с датчиков"""
    try:
        # Разделяем строку на timestamp и значения датчиков
        parts = line.strip().split(',')
        if len(parts) != len(SENSOR_NAMES) + 1:  # timestamp + значения датчиков
            raise ValueError("Неверное количество данных")

        timestamp_str = parts[0]
        sensor_values = parts[1:]

        # Преобразуем строку времени в объект datetime
        timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')

        # Преобразуем значения в float
        sensor_values = [float(value) for value in sensor_values]

        return timestamp, sensor_values
    except Exception as e:
        print(f"Ошибка парсинга данных: {e}")
        return None, None


def save_to_mongodb(timestamp, sensor_values):
    """Сохраняет данные датчиков в MongoDB"""
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]

        # Создаем документы для каждого датчика
        documents = []
        for name, value in zip(SENSOR_NAMES, sensor_values):
            doc = {
                "date": timestamp,
                "name_of_sensor": name,
                "value": value
            }
            documents.append(doc)

        # Вставляем документы в коллекцию
        result = collection.insert_many(documents)
        print(f"Успешно сохранено {len(result.inserted_ids)} записей")

    except Exception as e:
        print(f"Ошибка при сохранении в MongoDB: {e}")
    finally:
        client.close()


def main():
    try:
        # Создаем сокет
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind((HOST, PORT))
            s.listen(1)
            print(f"Сервер запущен и слушает на {HOST}:{PORT}...")

            while True:
                conn, addr = s.accept()
                print(f"Подключение установлено с {addr}")

                try:
                    while True:
                        # Получаем данные
                        data = conn.recv(BUFFER_SIZE)
                        if not data:
                            break

                        # Декодируем данные
                        line = data.decode('utf-8').strip()
                        print(f"Получены данные: {line}")

                        # Парсим данные
                        timestamp, sensor_values = parse_sensor_data(line)

                        if timestamp and sensor_values:
                            # Сохраняем в MongoDB
                            save_to_mongodb(timestamp, sensor_values)

                except ConnectionResetError:
                    print("Клиент разорвал соединение")
                finally:
                    conn.close()
                    print("Соединение с клиентом закрыто")

    except socket.error as e:
        print(f"Ошибка сокета: {e}")
    except KeyboardInterrupt:
        print("\nСкрипт остановлен пользователем")


if __name__ == "__main__":
    main()