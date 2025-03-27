import pandas as pd
import numpy as np
from numpy import pi, cos, sin, sqrt, arcsin, arccos, tan, arccosh
import os
import openpyxl
import xlsxwriter
from pathlib import Path

class Filter():
    def read_inclinometry(self):
        # path = '/Users/girgisasrian/Documents/react/full1/backend/uploads/inclinometry_case_1.xlsx'
        path = './uploads/inclinometry_case_1.xlsx'
        file = pd.read_excel(path)
        depth = list(map(float, (file['Depth, m'].values.tolist())))
        zen = list(map(float, (file['Zenit, deg'].values.tolist()))) #zenit
        azim = list(map(float, (file['Azimut, deg'].values.tolist()))) #azimut
        return depth, zen, azim
    
    def from_angles_to_coordinates(self,depth,zen,azim): #очевидный метод с углами
        d = depth
        a = zen
        f = azim
        
        x,y,z = [0], [0], [0]
        
        for i in range(1, len(d)):
            delta_x = (d[i]-d[i-1])*sin((a[i]+a[i-1])/2*pi/180)*sin((f[i]+f[i-1])/2*pi/180)
            delta_y = (d[i]-d[i-1])*sin((a[i]+a[i-1])/2*pi/180)*cos((f[i]+f[i-1])/2*pi/180)
            delta_z = (d[i]-d[i-1])*cos((a[i]+a[i-1])/2*pi/180)
            x.append(delta_x+x[i-1])
            y.append(delta_y+y[i-1])
            z.append(z[i-1]-delta_z)
        return x,y,z
    
    def minimum_curvature_method(self,depth,zenit,azimut):
        x,y,z = [0], [0], [0]
        
        for i in range(1, len(depth)):
            # if zenit[i]>90
            
            delta_md = depth[i] - depth[i-1]
            cos_beta = cos(zenit[i]*pi/180-zenit[i-1]*pi/180)-sin(zenit[i-1]*pi/180)*sin(zenit[i]*pi/180)*(1-cos(azimut[i]*pi/180-azimut[i-1]*pi/180))
            # beta = cos(cos(zenit[i]*pi/180-zenit[i-1]*pi/180)-sin(zenit[i-1]*pi/180)*sin(zenit[i]*pi/180)*(1-cos(azimut[i]*pi/180-azimut[i-1]*pi/180)))
            beta = arccos(cos_beta)
            if beta == 0: break
            rf = 2/beta*tan(beta/2)
            
            delta_x = delta_md/2*(sin(zenit[i-1]*pi/180)*sin(azimut[i-1]*pi/180)+sin(zenit[i]*pi/180)*sin(azimut[i]*pi/180))*rf
            delta_y = delta_md/2*(sin(zenit[i-1]*pi/180)*cos(azimut[i-1]*pi/180)+sin(zenit[i]*pi/180)*cos(azimut[i]*pi/180))*rf
            delta_z = delta_md/2*(cos(zenit[i-1]*pi/180)+cos(zenit[i]*pi/180))*rf
            
            x.append(x[i-1]+delta_x)
            y.append(y[i-1]+delta_y)
            z.append(z[i-1]-delta_z)
            
        return x,y,z
    
    import numpy as np

    import numpy as np

    def radius_of_curvature_method(self, depth, zenit, azimut):
        x, y, z = [0], [0], [0]  # Начальные координаты

        for i in range(1, len(depth)):
            delta_md = depth[i] - depth[i - 1]  # Приращение по глубине
            
            
            theta_i = zenit[i]
            phi_i = azimut[i]

            # Коррекция зенитного угла
            if theta_i > 180:
                theta_i = 360 - theta_i
                phi_i = (phi_i + 180) % 360  # Разворот азимута на 180°
                
            theta = zenit[i-1]
            phi = azimut[i-1]

            # Коррекция зенитного угла
            if theta > 180:
                theta = 360 - theta
                phi = (phi + 180) % 360  # Разворот азимута на 180°
            
            
            delta_zenit = np.radians(theta_i) - np.radians(theta)
            delta_azimut = np.radians(phi_i) - np.radians(phi)

            # Проверяем, что углы не слишком малы
            if np.isclose(delta_zenit, 0):  
                delta_zenit = 1e-6  # Маленькое значение, чтобы избежать деления на ноль
            if np.isclose(delta_azimut, 0):  
                delta_azimut = 1e-6  

            # Исправленные формулы (убрали лишние коэффициенты и масштабирование)
            delta_x = delta_md * (np.cos(np.radians(theta)) - np.cos(np.radians(theta_i))) * \
                    (np.cos(np.radians(phi)) - np.cos(np.radians(phi_i))) / (delta_zenit * delta_azimut)

            delta_y = delta_md * (np.cos(np.radians(theta)) - np.cos(np.radians(theta_i))) * \
                    (np.sin(np.radians(phi_i)) - np.sin(np.radians(phi))) / (delta_zenit * delta_azimut)

            delta_z = delta_md * (np.sin(np.radians(theta_i)) - np.sin(np.radians(theta))) / delta_zenit

            # Обновляем координаты
            x.append(x[-1] + delta_x)
            y.append(y[-1] + delta_y)
            z.append(z[-1] - delta_z)  # Проверяем знак delta_z (обычно глубина увеличивается вниз)

        return np.array(x), np.array(y), np.array(z)


    
    def balanced_tangential_method(self,depth,zenit,azimut):
        x,y,z = [0], [0], [0]
        
        for i in range(1, len(depth)):
            # if zenit[i]>90
            
            delta_md = depth[i] - depth[i-1]
            
            delta_x = delta_md/2*(sin(zenit[i-1]*pi/180)*sin(azimut[i-1]*pi/180)+sin(zenit[i]*pi/180)*sin(azimut[i]*pi/180))
            delta_y = delta_md/2*(sin(zenit[i-1]*pi/180)*cos(azimut[i-1]*pi/180)+sin(zenit[i]*pi/180)*cos(azimut[i]*pi/180))
            delta_z = delta_md/2*(cos(zenit[i-1]*pi/180)+cos(zenit[i]*pi/180))
            
            x.append(x[i-1]+delta_x)
            y.append(y[i-1]+delta_y)
            z.append(z[i-1]-delta_z)
            
        return x,y,z
    
    def average_angles_method(self,depth,zenit,azimut):
        x,y,z = [0], [0], [0]
        
        for i in range(1, len(depth)):
            
            theta_i = zenit[i]
            phi_i = azimut[i]

            # Коррекция зенитного угла
            if theta_i > 180:
                theta_i = 360 - theta_i
                phi_i = (phi_i + 180) % 360  # Разворот азимута на 180°
                
            theta = zenit[i-1]
            phi = azimut[i-1]

            # Коррекция зенитного угла
            if theta > 180:
                theta = 360 - theta
                phi = (phi + 180) % 360  # Разворот азимута на 180°
            
            
            delta_md = depth[i] - depth[i-1]
            
            z_av = (theta+theta_i)/2
            a_av = (phi+phi_i)/2
            # if z_av > 90: z_av=180-z_av
            # if a_av > 90: a_av=180-a_av
            
            delta_x = delta_md*sin(z_av*pi/180)*sin(a_av*pi/180)
            delta_y = delta_md*sin(z_av*pi/180)*cos(a_av*pi/180)
            delta_z = delta_md*cos(z_av*pi/180)
            
            x.append(x[i-1]+delta_x)
            y.append(y[i-1]+delta_y)
            z.append(z[i-1]-delta_z)
            
        return x,y,z
    
    def adaptive_trajectory_method(self, depth, zenit, azimut):
        """
        Адаптивный метод расчёта траектории скважины, комбинирующий метод средних углов и метод минимальной кривизны.
        
        Параметры:
        depth  - список приращений по глубине
        zenit  - список значений наклона (в градусах)
        azimut - список значений азимута (в градусах)
        
        Возвращает:
        Три списка координат x, y, z.
        """
        

        x, y, z = [0], [0], [0]
        
        # Задаём пороговые значения кривизны (в радианах) для адаптивного взвешивания
        beta_low = 0.05  # ниже этого значения – преимущество метода средних углов
        beta_high = 0.2  # выше этого значения – используется метод минимальной кривизны полностью

        for i in range(1, len(depth)):
            delta_md = depth[i]
            
            # Преобразуем углы в радианы
            z1 = zenit[i-1] * pi / 180.0
            z2 = zenit[i] * pi / 180.0
            a1 = azimut[i-1] * pi / 180.0
            a2 = azimut[i] * pi / 180.0
            
            # Расчёт смещения по методу средних углов
            avg_z = (z1 + z2) / 2.0
            avg_a = (a1 + a2) / 2.0
            dx_avg = delta_md * sin(avg_z) * sin(avg_a)
            dy_avg = delta_md * sin(avg_z) * cos(avg_a)
            dz_avg = delta_md * cos(avg_z)
            
            # Расчёт параметра кривизны β (метод минимальной кривизны)
            cos_beta = cos(z2 - z1) - sin(z1) * sin(z2) * (1 - cos(a2 - a1))
            # Ограничим cos_beta в пределах допустимого для acos
            cos_beta = max(min(cos_beta, 1.0), -1.0)
            beta = arccosh(cos_beta)
            
            # Если кривизна равна нулю, используем смещение по средним углам
            if beta == 0:
                dx_curv = dx_avg
                dy_curv = dy_avg
                dz_curv = dz_avg
            else:
                rf = 2.0 / beta * tan(beta / 2.0)
                dx_curv = (delta_md / 2.0 * (sin(z1) * sin(a1) + sin(z2) * sin(a2))) * rf
                dy_curv = (delta_md / 2.0 * (sin(z1) * cos(a1) + sin(z2) * cos(a2))) * rf
                dz_curv = (delta_md / 2.0 * (cos(z1) + cos(z2))) * rf
            
            # Определяем вес для комбинирования методов в зависимости от величины β
            if beta <= beta_low:
                weight = 0.0  # преимущество метода средних углов
            elif beta >= beta_high:
                weight = 1.0  # преимущество метода минимальной кривизны
            else:
                weight = (beta - beta_low) / (beta_high - beta_low)
            
            # Комбинируем результаты обоих методов
            dx = (1 - weight) * dx_avg + weight * dx_curv
            dy = (1 - weight) * dy_avg + weight * dy_curv
            dz = (1 - weight) * dz_avg + weight * dz_curv
            
            # Обновляем координаты (отметим, что ось z уменьшается с увеличением глубины)
            x.append(x[-1] + dx)
            y.append(y[-1] + dy)
            z.append(z[-1] - dz)
        
        return x, y, z

    def save_trajectory_to_excel(self, x, y, z):
        

        
        # if not os.path.exists(file_name):
        #     wb = openpyxl.Workbook()
        #     wb.save(file_name)
        #     print(f"Файл {file_name} успешно создан.")
        # else:
        #     print(f"Файл {file_name} уже существует.")
        # Формируем DataFrame из переданных списков
        df = pd.DataFrame({
            'X': x,
            'Y': y,
            'Z': z
        })
        
        # file_name = Path('./backend/uploads/trajectory.xlsx').resolve()
        file_name = 'trajectory.xlsx'

        
        with pd.ExcelWriter(
            file_name,
            engine="xlsxwriter",
            mode='w') as excel_writer:
            df.to_excel(excel_writer, sheet_name='Total')

        # Записываем DataFrame в Excel-файл (без индексов)
        # df.to_excel(file_name, index=False)
        print(f"Данные успешно сохранены в файл: {file_name}")
        

    # Функция для вычисления приращений координат
    def trajectory_derivatives(self, inc, azi):
        """
        Вычисляет приращения координат по заданному зенитному и азимутальному углу.
        
        inc - зенитный угол (градусы)
        azi - азимутальный угол (градусы)
        
        Возвращает (dN/ds, dE/ds, dV/ds)
        """
        theta = np.radians(inc)
        phi = np.radians(azi)

        dN_ds = np.sin(theta) * np.cos(phi)
        dE_ds = np.sin(theta) * np.sin(phi)
        dV_ds = np.cos(theta)

        return np.array([dN_ds, dE_ds, dV_ds])

    # Функция для коррекции углов
    def correct_angles(self, inc, azi):
        """
        Корректирует развернутые углы в инклинометрических данных.
        
        inc - массив зенитных углов
        azi - массив азимутальных углов
        
        Возвращает исправленные (inc, azi)
        """
        corrected_inc = []
        corrected_azi = []

        for i in range(len(inc)):
            theta = inc[i]
            phi = azi[i]

            # Коррекция зенитного угла
            if theta > 180:
                theta = 360 - theta
                phi = (phi + 180) % 360  # Разворот азимута на 180°

            corrected_inc.append(theta)
            corrected_azi.append(phi)

        return np.array(corrected_inc), np.array(corrected_azi)

    # Функция для интегрирования методом Рунге-Кутты 4-го порядка
    def runge_kutta_trajectory(self, md, inc, azi):
        """
        Вычисляет пространственные координаты (N, E, V) по инклинометрическим данным методом Рунге-Кутты 4 порядка.
        
        md  - массив глубин по стволу (Measured Depth)
        inc - массив зенитных углов
        azi - массив азимутальных углов
        
        Возвращает массив координат (N, E, V)
        """
        # Корректируем углы перед расчётом
        inc, azi = self.correct_angles(inc, azi)

        # Число точек
        n = len(md)
        
        # Массивы для координат
        N = np.zeros(n)
        E = np.zeros(n)
        V = np.zeros(n)

        # Интегрирование методом Рунге-Кутты
        for i in range(n - 1):
            h = md[i + 1] - md[i]

            # Коррекция азимутальной разницы
            delta_azi = (azi[i + 1] - azi[i] + 180) % 360 - 180  # Убираем разрывы
            avg_azi = azi[i] + delta_azi / 2

            avg_inc = (inc[i] + inc[i + 1]) / 2

            # Вычисляем 4 приближения (k1, k2, k3, k4)
            k1 = self.trajectory_derivatives(inc[i], azi[i])
            k2 = self.trajectory_derivatives(avg_inc, avg_azi)
            k3 = self.trajectory_derivatives(avg_inc, avg_azi)
            k4 = self.trajectory_derivatives(inc[i+1], azi[i+1])

            # Итоговое обновление координат
            delta = (k1 + 2 * k2 + 2 * k3 + k4) / 6
            N[i + 1] = N[i] + h * delta[0]
            E[i + 1] = E[i] + h * delta[1]
            V[i + 1] = V[i] - h * delta[2]

        return E, N, V

    # # === Тестирование на примере ===
    # data = pd.DataFrame({
    #     'MD': np.linspace(0, 1000, 50),
    #     'Inc': np.linspace(0, 190, 50),  # Пример с углами > 180°
    #     'Azi': np.linspace(0, 370, 50)  # Пример с азимутом > 360°
    # })

    # # Запуск алгоритма
    # N, E, V = runge_kutta_trajectory(data['MD'].values, data['Inc'].values, data['Azi'].values)

    # # Вывод результатов
    # data['Northing'] = N
    # data['Easting'] = E
    # data['
