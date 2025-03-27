import numpy as np
import pandas as pd

# Функция для вычисления приращений координат
def trajectory_derivatives(inc, azi):
    """
    Вычисляет приращения координат по заданному зенитному и азимутальному углу.
    
    inc - зенитный угол (градусы)
    azi - азимутальный угол (градусы)
    
    Возвращает (dN/ds, dE/ds, dV/ds)
    """
    theta = np.radians(inc)  # переводим в радианы
    phi = np.radians(azi)  

    dN_ds = np.sin(theta) * np.cos(phi)
    dE_ds = np.sin(theta) * np.sin(phi)
    dV_ds = np.cos(theta)

    return np.array([dN_ds, dE_ds, dV_ds])

# Функция для интегрирования методом Рунге-Кутты 4-го порядка
def runge_kutta_trajectory(md, inc, azi):
    """
    Вычисляет пространственные координаты (N, E, V) по инклинометрическим данным методом Рунге-Кутты 4 порядка.
    
    md  - массив глубин по стволу (Measured Depth)
    inc - массив зенитных углов
    azi - массив азимутальных углов
    
    Возвращает массив координат (N, E, V)
    """
    # Число точек
    n = len(md)
    
    # Массивы для координат
    N = np.zeros(n)  # Север
    E = np.zeros(n)  # Восток
    V = np.zeros(n)  # Вертикальная глубина (TVD)

    # Интегрирование методом Рунге-Кутты
    for i in range(n - 1):
        h = md[i + 1] - md[i]  # шаг по глубине

        # Вычисляем 4 приближения (k1, k2, k3, k4)
        k1 = trajectory_derivatives(inc[i], azi[i])
        k2 = trajectory_derivatives((inc[i] + inc[i+1]) / 2, (azi[i] + azi[i+1]) / 2)
        k3 = trajectory_derivatives((inc[i] + inc[i+1]) / 2, (azi[i] + azi[i+1]) / 2)
        k4 = trajectory_derivatives(inc[i+1], azi[i+1])

        # Итоговое обновление координат
        delta = (k1 + 2 * k2 + 2 * k3 + k4) / 6
        N[i + 1] = N[i] + h * delta[0]
        E[i + 1] = E[i] + h * delta[1]
        V[i + 1] = V[i] + h * delta[2]

    return N, E, V

# === Тестирование на примере ===
# Загружаем данные
data = pd.DataFrame({
    'MD': np.linspace(0, 1000, 50),  # от 0 до 1000 м, 50 измерений
    'Inc': np.linspace(0, 60, 50),  # зенитный угол от 0° до 60°
    'Azi': np.linspace(0, 180, 50)  # азимут от 0° до 180°
})

# Запуск алгоритма
N, E, V = runge_kutta_trajectory(data['MD'].values, data['Inc'].values, data['Azi'].values)

# Вывод результатов
data['Northing'] = N
data['Easting'] = E
data['TVD'] = V

print(data)
