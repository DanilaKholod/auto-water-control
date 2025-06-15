import tkinter as tk
from tkinter import ttk, messagebox
import requests
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg


class SensorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Система химического контроля")

        # Конфигурация сетки
        self.root.columnconfigure(1, weight=1)

        # Выбор датчика
        ttk.Label(root, text="Датчик:").grid(row=0, column=0, padx=5, pady=5, sticky='w')
        self.sensor_var = tk.StringVar()
        self.sensor_combobox = ttk.Combobox(root, textvariable=self.sensor_var, width=25)
        self.sensor_combobox.grid(row=0, column=1, padx=5, pady=5, sticky='ew')

        # Дата начала
        ttk.Label(root, text="Дата начала:").grid(row=1, column=0, padx=5, pady=5, sticky='w')
        self.start_date_entry = ttk.Entry(root, width=25)
        self.start_date_entry.grid(row=1, column=1, padx=5, pady=5, sticky='ew')
        self.start_date_entry.insert(0, (datetime.now() - pd.Timedelta(days=1)).strftime('%Y-%m-%dT%H:%M:%S'))

        # Тип конечной даты
        self.end_date_type = tk.StringVar(value="specific")
        ttk.Radiobutton(root, text="Конкретная дата", variable=self.end_date_type,
                        value="specific", command=self.update_end_date_state).grid(row=2, column=0, columnspan=2,
                                                                                   sticky='w')
        ttk.Radiobutton(root, text="Последние данные (limit=100)", variable=self.end_date_type,
                        value="latest", command=self.update_end_date_state).grid(row=3, column=0, columnspan=2,
                                                                                 sticky='w')

        # Конкретная конечная дата
        ttk.Label(root, text="Дата окончания:").grid(row=4, column=0, padx=5, pady=5, sticky='w')
        self.end_date_entry = ttk.Entry(root, width=25)
        self.end_date_entry.grid(row=4, column=1, padx=5, pady=5, sticky='ew')
        self.end_date_entry.insert(0, datetime.now().strftime('%Y-%m-%dT%H:%M:%S'))

        # Лимит данных
        ttk.Label(root, text="Лимит данных:").grid(row=5, column=0, padx=5, pady=5, sticky='w')
        self.limit_entry = ttk.Entry(root, width=25)
        self.limit_entry.grid(row=5, column=1, padx=5, pady=5, sticky='ew')
        self.limit_entry.insert(0, "100")

        # Кнопка загрузки
        ttk.Button(root, text="Загрузить данные", command=self.load_data).grid(row=6, column=0, columnspan=2, pady=10)

        # График
        self.figure, self.ax = plt.subplots(figsize=(10, 5))
        self.canvas = FigureCanvasTkAgg(self.figure, master=root)
        self.canvas.get_tk_widget().grid(row=7, column=0, columnspan=2, padx=5, pady=5, sticky='nsew')

        # Полоса прокрутки
        scrollbar = ttk.Scrollbar(root, orient='horizontal')
        scrollbar.grid(row=8, column=0, columnspan=2, sticky='ew')
        self.canvas.get_tk_widget().config(xscrollcommand=scrollbar.set)
        scrollbar.config(command=self.canvas.get_tk_widget().xview)

        # Обновление состояния
        self.update_sensors()

    def update_end_date_state(self):
        """Обновляет состояние поля ввода конечной даты"""
        if self.end_date_type.get() == "specific":
            self.end_date_entry.config(state='normal')
        else:
            self.end_date_entry.config(state='disabled')

    def update_sensors(self):
        """Обновляет список доступных датчиков"""
        self.sensor_combobox['values'] = ["temperature", "ph", "oxygen", "nitrites", "nitrates", "turbidity"]
        if self.sensor_combobox['values']:
            self.sensor_combobox.current(0)

    def load_data(self):
        """Загружает данные с API и отображает график"""
        sensor = self.sensor_var.get()
        start_date = self.start_date_entry.get()
        limit = self.limit_entry.get()

        try:
            # Формирование параметров запроса
            params = {
                "name_of_sensor": sensor,
                "start_date": start_date,
                "limit": limit
            }

            # Добавление end_date только если выбран конкретный период
            if self.end_date_type.get() == "specific":
                params["end_date"] = self.end_date_entry.get()

            # Запрос к API
            response = requests.get("http://localhost:8000/api/data", params=params)
            response.raise_for_status()
            data = response.json()

            # Измененная обработка ответа
            if isinstance(data, list):  # Если API возвращает список напрямую
                if not data:
                    messagebox.showwarning("Нет данных", "Нет данных для отображения")
                    return
                df = pd.DataFrame(data)
            elif isinstance(data, dict):  # Если API возвращает словарь с данными
                if not data.get('data', []):
                    messagebox.showwarning("Нет данных", "Нет данных для отображения")
                    return
                df = pd.DataFrame(data['data'])
            else:
                raise ValueError("Неожиданный формат данных от API")

            # Преобразование данных
            df['date'] = pd.to_datetime(df['date'])

            # Отрисовка графика
            self.ax.clear()
            self.ax.plot(df['date'], df['value'], marker='o', linestyle='-', markersize=4)

            # Настройки графика
            self.ax.set_xlabel("Дата и время", fontsize=10)
            self.ax.set_ylabel("Значение", fontsize=10)
            self.ax.set_title(f"Данные датчика: {sensor}\nПериод: {start_date} - {params.get('end_date', 'latest')}",
                              fontsize=12)
            self.ax.grid(True)
            self.ax.tick_params(axis='x', rotation=45)
            self.figure.tight_layout()

            # Обновление холста
            self.canvas.draw()

        except requests.exceptions.RequestException as e:
            messagebox.showerror("Ошибка запроса", f"Ошибка при загрузке данных: {str(e)}")
        except Exception as e:
            messagebox.showerror("Ошибка", f"Неизвестная ошибка: {str(e)}")


if __name__ == "__main__":
    root = tk.Tk()
    root.geometry("800x600")
    app = SensorApp(root)
    root.mainloop()