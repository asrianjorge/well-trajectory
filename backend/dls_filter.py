from matplotlib import pyplot as plt
import pandas as pd
# from vi import 
import numpy as np
from numpy import pi, cos, sin, sqrt, arcsin, arccos, tan
import plotly.offline as pyo


from visualisator import PlotlyVisualisator
from dash import Dash, dcc, html, Input, Output
from plotly.subplots import make_subplots
import plotly.graph_objects as go


class DLSFilter():
    
    def input_clinometry_data(self):
        # path = './uploads/downloaded.csv'
        path = '/Users/girgisasrian/Documents/react/full1/backend/uploads/inclinometry_case_1.csv'
        file = pd.read_csv(path)
        depth = list(map(float, (file['depth'].values.tolist())))
        alpha = list(map(float, (file['zenit'].values.tolist()))) #zenit
        phi = list(map(float, (file['azimut'].values.tolist()))) #azimut
        return depth, alpha, phi
    
    def input_tools_data(self):
        # path = 'tools_case_2.csv'
        file = pd.read_csv('/Users/girgisasrian/Documents/react/full1/backend/uploads/tools_case_1.csv')
        col1 = file['1'].values.tolist()
        col2 = file['2'].values.tolist()
        col3 = file['3'].values.tolist()
        return int(col2[0]), col1[1:], col2[1:], col3[1:]
            
    def condition(self, a,b,c,d):
        if a>b and c>b and c>d or a<b and c<b and c<d:
            return True
        else:
            return False
    
    def filtration(self):
        output_zenit, output_azimut = [], []
        
        n, col1, col2, col3 = self.input_tools_data()
        depth, zen, azim = self.input_clinometry_data()
        # print(len(depth), len(zen),len(azim), n)
        bias = 0
        diam_stvola, new_diam_stvola = [], []
        for i in range(n):
            prostr_ugol = ['-']
            #флаги 
            instr, otkr_stvol = 0, 0
            # print('🚾',float(col2[9*i+bias]),float(col2[9*i+1+bias]),float(col2[9*i+2+bias]),float(col2[9*i+3+bias]),float(col2[9*i+4+bias]),float(col2[9*i+5+bias]),float(col2[9*i+6+bias]),float(col2[9*i+7+bias]),float(col2[9*i+8+bias]),)
            depth_, diam_ = float(col2[9*i+1+bias]), float(col2[9*i+2+bias])/1000
            k_ = col2[9*i+3+bias]
            if k_ == '-':
                instr = 1
            else:
                k_ = float(k_)
            # diamOK_, diamOK_from, diamOK_to, thickOK_, thickOK_from, thickOK_to = col2[7*i+4+bias], col2[7*i+6+bias]
            diamOK_, diamOK_from, diamOK_to = [col2[9*i+4+bias]], [col2[9*i+5+bias]], [col3[9*i+5+bias]]
            while col1[9*i+6+bias] != 'thickness':
                bias+= 1
                diamOK_.append(col2[9*i+4+bias])
                diamOK_from.append(col2[9*i+5+bias])
                diamOK_to.append(col3[9*i+5+bias])
            thickOK_, thickOK_from, thickOK_to = [col2[9*i+6+bias]], [col2[9*i+7+bias]], [col3[9*i+7+bias]]
            while col1[9*i+8+bias] != 'depth_OK':
                bias+= 2
                thickOK_.append(col2[9*i+6+bias])
                thickOK_from.append(col2[9*i+7+bias])
                thickOK_to.append(col3[9*i+7+bias])
            depth_OK_from, depth_OK_to = col2[9*i+8+bias], col3[9*i+8+bias]
                
            if diamOK_[0] == '-' or thickOK_[0] == '-':
                diamOK_ = [diam_]
                otkr_stvol = 1
            else:
                diamOK_ = list(map(lambda d : float(d)/1000, diamOK_))
                thickOK_ = list(map(lambda d : float(d)/1000, thickOK_))
            
            #индексы для выбора нужной толщины ОК и диаметра ОК
            index_dOK, index_tOK = 0,0
            fl_dOK, fl_tOK = 1, 1
            for j in range(len(depth)):
                d = depth[j]
                z = zen[j]
                a = azim[j]
                # print(len(output_zenit), len(output_azimut), len(prostr_ugol), '>>>', d, z, a)
                
                dOK_, tOK_ = diamOK_[index_dOK], thickOK_[index_tOK]

                while fl_dOK and not instr and not otkr_stvol:
                    if float(diamOK_to[index_dOK]) >= d:
                        fl_dOK = 1
                    else:
                        index_dOK += 1
                        dOK_ = float(diamOK_[index_dOK])
                        
                
                while fl_tOK and not instr and not otkr_stvol:
                    if float(thickOK_to[index_dOK]) >= d:
                        fl_tOK = 0
                    else:
                        index_tOK += 1
                         
                        tOK_ = float(thickOK_[index_tOK])
                
                
                if depth[j] <= depth_:
                    #значения по условию
                    
                    
                    
                    
                    #ВСЕ ПО НОВОЙ
                    #1 условие
                    #2 радиус искрив A,B,C
                    #3 отклон A,B,C
                    #4 зазор B
                    #5 условие 2
                    #6 интерполяция A,C
                    #7 замена A,C
                    
                    # rad_iskriv_zenit, rad_iskriv_azimut, max_otklon_zenit, max_otklon_azimut, rad_zazor_zenit, rad_zazor_azimut, diam_stvola = [], [], [], [], [], [], []
                    if len(new_diam_stvola) > j:
                        diam_stvola_j = new_diam_stvola[j]
                    elif instr:
                        pass
                    else:
                        diam_stvola.append(diam_*sqrt(k_))
                        diam_stvola_j = diam_stvola[j]
                    

                    razn_diam = diam_stvola_j - dOK_
                    if otkr_stvol:
                        razn_diam = 0
                    
                    if otkr_stvol:
                        new_diam_stvola.append(dOK_*sqrt(k_))
                    else:
                        new_diam_stvola.append(dOK_-2*tOK_)
                    
                    if j < 3:
                        output_zenit.append(z)
                        output_azimut.append(a)
                        if j>0:
                            try:
                                a3,f3 = output_zenit[j-1], output_azimut[j-1]
                                ya = arcsin(sqrt((sin(z)*cos(a3)*cos(a-f3)-sin(a3)*cos(z))**2 + (sin(z)**2)*(sin(a-f3)**2)))
                            except ArithmeticError:
                                ya = '-'
                            prostr_ugol.append(ya)
                            
                    else:
                        d1,d2,d3,d4 = depth[j-3],depth[j-2],depth[j-1],d
                        a1,a2,a3,a4 = output_zenit[j-3],output_zenit[j-2],output_zenit[j-1], z
                        f1,f2,f3,f4 = output_azimut[j-3],output_azimut[j-2],output_azimut[j-1], a
                        #расчет пространственного угла
                        try:
                            ya = arcsin(sqrt((float(sin(a4))*float(cos(a3))*float(cos(f4-f3))-float(sin(a3))*float(cos(a4)))**2 + (float(sin(a4))**2)*(float(sin(f4-f3))**2)))
                        except ArithmeticError:
                            ya = '-'
                        prostr_ugol.append(ya)
                        #расчет по зениту
                        output_zenit.append(z)
                        if self.condition(a1,a2,a3,a4):
                            #расчет точек A,B,C
                            i12 = (a2-a1)/(d2-d1)
                            A = a1+(d2-d1)/2*i12
                            i23 = (a3-a2)/(d3-d2)
                            B = a2+(d3-d2)/2*i23
                            i34 = (a4-a3)/(d4-d3)
                            C = a3+(d4-d3)/2*i34
                            #радиус искривления
                            rad_iskriv_zenit_A = abs((d2-d1)/((a2-a1)*pi/180)) #в радианах
                            rad_iskriv_zenit_B = abs((d3-d2)/((a3-a2)*pi/180)) #в радианах
                            rad_iskriv_zenit_C = abs((d4-d3)/((a4-a3)*pi/180)) #в радианах
                            #отклонение
                            # if a2 == a1:
                            #     max_otklon_zenit_A = razn_diam
                            # else:
                            max_otklon_zenit_A = rad_iskriv_zenit_A * (1-cos((a2-a1)/2*pi/180))
                            # if a2 == a3:
                            #     max_otklon_zenit_B = razn_diam
                            # else:
                            max_otklon_zenit_B = rad_iskriv_zenit_B * (1-cos((a3-a2)/2*pi/180))
                            # if a3 == a4:
                                # max_otklon_zenit_C = razn_diam
                            # else:
                            max_otklon_zenit_C = rad_iskriv_zenit_C * (1-cos((a4-a3)/2*pi/180))
                                
                            #зазор в B
                            rad_zazor_zenit_B = (max_otklon_zenit_A+max_otklon_zenit_C)/2+max_otklon_zenit_B
                            #условие 2
                            if rad_zazor_zenit_B <= razn_diam:
                                #интерполяция
                                lAC = (d3+(d4-d3)/2) - (d1+(d2-d1)/2)
                                a2 = A + (C-A)/lAC * (d2 - (d1+(d2-d1)/2))
                                a3 = A + (C-A)/lAC * (d3 - (d1+(d2-d1)/2))
                                #замена
                                output_zenit[j-2], output_zenit[j-1] = a2, a3
                                
                        #расчет по азимуту
                        output_azimut.append(a)
                        if self.condition(f1,f2,f3,f4) and a1 >= 10 and a2 >= 10 and a3 >= 10 and a4 >= 10:
                            #расчет точек A,B,C
                            delta12 = min(abs(f2-f1), 360-abs(f2-f1))
                            delta23 = min(abs(f3-f2), 360-abs(f3-f2))
                            delta34 = min(abs(f4-f3), 360-abs(f4-f3))
                            i12 = delta12/(d2-d1)  
                            A = f1+(d2-d1)/2*i12
                            i23 = delta23/(d3-d2)
                            B = f2+(d3-d2)/2*i23
                            i34 = delta34/(d4-d3)
                            C = f3+(d4-d3)/2*i34
                            #радиус искривления
                            rad_iskriv_azimut_B = abs((d3-d2)/(delta23*pi/180)) #в радианах
                            rad_iskriv_azimut_A = abs((d2-d1)/(delta12*pi/180)) #в радианах
                            rad_iskriv_azimut_C = abs((d4-d3)/(delta34*pi/180)) #в радианах
                            #отклонение
                            # if f2 == f1:
                            #     max_otklon_azimut_A = razn_diam
                            # else:
                            max_otklon_azimut_A = rad_iskriv_azimut_A * (1-cos(delta12/2*pi/180))
                            # if f2 == f3:
                            #     max_otklon_azimut_B = razn_diam
                            # else:
                            max_otklon_azimut_B = rad_iskriv_azimut_B * (1-cos(delta23/2*pi/180))
                            # if a3 == a4:
                                # max_otklon_azimut_C = razn_diam
                            # else:
                            max_otklon_azimut_C = rad_iskriv_azimut_C * (1-cos(delta34/2*pi/180))
                                
                            #зазор в B
                            rad_zazor_azimut_B = (max_otklon_azimut_A+max_otklon_azimut_C)/2+max_otklon_azimut_B
                            #условие 2
                            if rad_zazor_azimut_B <= razn_diam:
                                #интерполяция
                                lAC = (d3+(d4-d3)/2) - (d1+(d2-d1)/2)
                                f2 = A + (C-A)/lAC * (d2 - (d1+(d2-d1)/2))
                                f3 = A + (C-A)/lAC * (d3 - (d1+(d2-d1)/2))
                                #замена
                                output_azimut[j-2], output_azimut[j-1] = f2, f3
                else:
                    output_zenit.append(z)
                    output_azimut.append(a)
                    
                    try:
                        a3,f3 = output_zenit[j-1], output_azimut[j-1]
                        ya = arcsin(sqrt((sin(z*pi/180)*cos(a3*pi/180)*cos((a-f3)*pi/180)-sin(a3*pi/180)*cos(z*pi/180))**2 + (sin(z*pi/180)**2)*(sin((a-f3)*pi/180)**2)))
                    except ArithmeticError:
                        ya = '-'
                    prostr_ugol.append(ya/pi*180)
                
            data = [['Depth', 'Zenit', 'Azimut', 'Angle of spatial curvature', 'X', 'Y', 'Z', 'X (Mean Angle Method', 'Y (Mean Angle Method', 'Z (Mean Angle Method']]
            x,y,z = self.coordinates(depth,output_zenit, output_azimut)
            x1,y1,z1 = self.coordinates_primitive(depth,output_zenit, output_azimut)
            # print('🈷️', len(prostr_ugol), len(x), len(y),len(z),'🆚')
            # print('🈯️', depth, '🈯️')
            for o in range(len(depth)):
                
                
                data.append([depth[o], output_zenit[o], output_azimut[o], prostr_ugol[o],x[o],y[o],z[o],x1[o],y1[o],z1[o]])
                
            pd.DataFrame(data).to_csv(f'uploads/inclinometry_{i+1}.csv', index=False, header=False)
        return output_zenit, output_azimut
                                            
    def coordinates(self,depth,zen,azim): #метод кривизны и среднего
        d = depth
        a = zen
        f = azim
        # print('🈴', len(d), len(a), len(f),'🆎')
        
        x,y,z = [0], [0], [0]
        
        for i in range(1, len(d)):
            a1,a2 = a[i-1]*pi/180,a[i]*pi/180
            f1,f2 = f[i-1]*pi/180,f[i]*pi/180
            d1,d2 = d[i-1]*pi/180,d[i]*pi/180
            if a1==a2 or f1==f2:
                delta_x = (d2-d1)*sin((a1+a2)/2)*sin((f1+f2)/2)
                delta_y = (d2-d1)*sin((a1+a2)/2)*cos((f1+f2)/2)
                delta_z = (d2-d1)*cos((a1+a2)/2)
            else:
                D = arccos(sin(a1)*sin(f1)*sin(a2)*sin(f2) + sin(a1)*cos(f1)*sin(a2)*cos(f2) + cos(a1)*cos(a2))
                T = (d2-d1)*tan(D/2)/D
                delta_x = T*(sin(a1)*cos(f1)*sin(a2)*cos(f2))
                delta_y = T*(sin(a1)*sin(f1)*sin(a2)*sin(f2))
                delta_z = T*(cos(a1)+cos(a2))
            x.append(x[i-1]+delta_x)
            y.append(y[i-1]+delta_y)
            z.append(z[i-1]-delta_z)
        return x,y,z
    
    def coordinates_primitive(self,depth,zen,azim): #очевидный метод с углами
        d = depth
        a = zen
        f = azim
        # print('🈴', len(d), len(a), len(f),'🆎')
        
        x,y,z = [0], [0], [0]
        
        for i in range(1, len(d)):
            delta_x = (d[i]-d[i-1])*sin((a[i]+a[i-1])/2*pi/180)*sin((f[i]+f[i-1])/2*pi/180)
            delta_y = (d[i]-d[i-1])*sin((a[i]+a[i-1])/2*pi/180)*cos((f[i]+f[i-1])/2*pi/180)
            delta_z = (d[i]-d[i-1])*cos((a[i]+a[i-1])/2*pi/180)
            x.append(delta_x+x[i-1])
            y.append(delta_y+y[i-1])
            z.append(z[i-1]-delta_z)
        return x,y,z
    
    def visualisator(self, zen, azim):
        #работаем с исхоюными данными
        path = '/Users/girgisasrian/Documents/react/full1/backend/uploads/dls.csv'
        file = pd.read_csv(path)
        d = file['depth'].values.tolist()
        a = file['zenit'].values.tolist()
        f = file['azimut'].values.tolist()
        #создаем 3 графика
        fig = plt.figure()
        ax1 = fig.add_subplot(311, projection='3d')
        ax2 = fig.add_subplot(312, projection='3d')
        ax3 = fig.add_subplot(313, projection='3d')
        #создаем массивы координат по трем осям
        x,y,z = [0], [0], [0]
        for i in range(1, len(d)):
            delta_x = (d[i]-d[i-1])*sin((a[i]+a[i-1])/2*pi/180)*sin((f[i]+f[i-1])/2*pi/180)
            delta_y = (d[i]-d[i-1])*sin((a[i]+a[i-1])/2*pi/180)*cos((f[i]+f[i-1])/2*pi/180)
            delta_z = (d[i]-d[i-1])*cos((a[i]+a[i-1])/2*pi/180)
            x.append(delta_x+x[i-1])
            y.append(delta_y+y[i-1])
            z.append(-delta_z+z[i-1])
            # z.append((d[i]-d[i-1])*cos(a[i]-a[i-1])+z[i-1])
        #создаем график и легенду
        v = PlotlyVisualisator()
        # v.vi_2d(x, list(map(lambda x: -x, z)), 'X-Z Graph')
        v.vi_2d(x, z, 'X-Z Graph')
        ax1.scatter(x, y, z, c='orangered')
        ax1.legend(['Изначальная инклинометрия, примитивное вычисление'])
        
        #график 2 - исходные данные, метод кривизны и средних
        x,y,z = [0], [0], [0]
        for i in range(1, len(d)):
            a1,a2 = a[i-1]*pi/180,a[i]*pi/180
            f1,f2 = f[i-1]*pi/180,f[i]*pi/180
            d1,d2 = d[i-1]*pi/180,d[i]*pi/180
            if a1==a2 or f1==f2:
                delta_x = (d2-d1)*sin((a1+a2)/2)*sin((f1+f2)/2)
                delta_y = (d2-d1)*sin((a1+a2)/2)*cos((f1+f2)/2)
                delta_z = (d2-d1)*cos((a1+a2)/2)
            else:
                D = arccos(sin(a1)*sin(f1)*sin(a2)*sin(f2) + sin(a1)*cos(f1)*sin(a2)*cos(f2) + cos(a1)*cos(a2))
                T = 180*(d2-d1)*tan(D/2)/(pi*D)
                delta_x = T*(sin(a1)*cos(f1)*sin(a2)*cos(f2))
                delta_y = T*(sin(a1)*sin(f1)*sin(a2)*sin(f2))
                delta_z = T*(cos(a1)+cos(a2))
            x.append(x[i-1]+delta_x)
            y.append(y[i-1]+delta_y)
            z.append(z[i-1]+delta_z)
        #строим график
        # ax = fig.add_subplot(111, projection='3d')
        ax2.scatter(x, y, np.array(map(lambda x: -x, z)), c='orange')
        
        #график 3 - новые данные (фильтрованные), вычисление по методу кривизны и средних
        a = zen
        f = azim
        
        x,y,z = [0], [0], [0]
        
        for i in range(1, len(d)):
            a1,a2 = a[i-1]*pi/180,a[i]*pi/180
            f1,f2 = f[i-1]*pi/180,f[i]*pi/180
            d1,d2 = d[i-1]*pi/180,d[i]*pi/180
            if a1==a2 or f1==f2:
                delta_x = (d2-d1)*sin((a1+a2)/2)*sin((f1+f2)/2)
                delta_y = (d2-d1)*sin((a1+a2)/2)*cos((f1+f2)/2)
                delta_z = (d2-d1)*cos((a1+a2)/2)
            else:
                D = arccos(sin(a1)*sin(f1)*sin(a2)*sin(f2) + sin(a1)*cos(f1)*sin(a2)*cos(f2) + cos(a1)*cos(a2))
                T = 180*(d2-d1)*tan(D/2)/(pi*D)
                delta_x = T*(sin(a1)*cos(f1)*sin(a2)*cos(f2))
                delta_y = T*(sin(a1)*sin(f1)*sin(a2)*sin(f2))
                delta_z = T*(cos(a1)+cos(a2))
            x.append(x[i-1]+delta_x)
            y.append(y[i-1]+delta_y)
            z.append(z[i-1]+delta_z)
            
        # fig = plt.figure()
        # ax = fig.add_subplot(projection='3d')
        ax3.scatter(x, y, z, c='deepskyblue')
        
        ax1.set_xlabel('X')
        ax1.set_ylabel('Y')
        ax1.set_zlabel('Z')
        ax2.set_xlabel('X')
        ax2.set_ylabel('Y')
        ax2.set_zlabel('Z')
        ax3.set_xlabel('X')
        ax3.set_ylabel('Y')
        ax3.set_zlabel('Z')
        # ax.figure.show()
        plt.show()
  

# filter_ = DLSFilter()
# zen, azim = filter_.filtration()

# # v = PlotlyVisualisator()
# path = 'backend/uploads/inclinometry_case_1.csv'
# file = pd.read_csv(path)
# d = file['depth'].values.tolist()

# x,y,z = filter_.coordinates(d,zen,azim)
# print(x[0:3], y[0:3], z[0:3])


# v.main(x,y,z)