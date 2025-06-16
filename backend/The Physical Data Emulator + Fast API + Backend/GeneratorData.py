import socket
import time
import random
from datetime import datetime

# Настройки подключения
HOST = 'localhost'  # или IP-адрес сервера
PORT = 8080         # 4-значный порт

# Диапазоны значений для каждого датчика (можно настроить)
SENSOR_RANGES = [
    (0, 100),    # Датчик 1: от 0 до 100
    (10, 50),    # Датчик 2: от 10 до 50
    (-20, 20),   # Датчик 3: от -20 до 20
    (100, 200),  # Датчик 4: от 100 до 200
    (0, 1)       # Датчик 5: от 0 до 1 (например, бинарный)
]


def generate_sensor_values():
    """Генерирует случайные значения датчиков в заданных диапазонах"""
    return [random.uniform(low, high) for low, high in SENSOR_RANGES]


def format_sensor_values(values):
    """Форматирует значения датчиков в строку для передачи"""
    # Округляем значения до 2 знаков после запятой и объединяем через запятую
    return ",".join([f"{value:.2f}" for value in values])


def main():
    try:
        # Создаем сокет
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((HOST, PORT))
            print(f"Скрипт начал работу. Передача данных каждую минуту на {HOST}:{PORT}")
            print("Нажмите Ctrl+C для остановки")

            while True:
                # Генерируем значения датчиков
                sensor_values = generate_sensor_values()
                formatted_values = format_sensor_values(sensor_values)

                # Добавляем метку времени и перевод строки
                message = f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')},{formatted_values}\n"

                # Отправляем данные
                s.sendall(message.encode('utf-8'))

                # Выводим в консоль для отладки
                print(f"Отправлено: {message.strip()}")

                # Ждем 60 секунд перед следующей отправкой
                time.sleep(60)

    except ConnectionRefusedError:
        print(f"Не удалось подключиться к {HOST}:{PORT}. Убедитесь, что сервер запущен.")
    except socket.error as e:
        print(f"Ошибка сокета: {e}")
    except KeyboardInterrupt:
        print("\nСкрипт остановлен пользователем")


if __name__ == "__main__":
    main()