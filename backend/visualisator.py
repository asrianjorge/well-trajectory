import pandas as pd
import numpy as np
from numpy import pi, cos, sin, sqrt, arcsin, arccos, tan
import plotly.offline as pyo
from plotly.subplots import make_subplots
import plotly.graph_objects as go
import plotly.express as px

from dash import Dash, dcc, html, Input, Output
from plotly.subplots import make_subplots
import plotly.graph_objects as go


class PlotlyVisualisator():    
    def main(self, x,y,z,name):    
        # a,b,c = flexwidth()
        fig = make_subplots(
            rows=3, cols=3,
            subplot_titles=(["3D", "XOY", "Azimuth angle graph", "YOZ", "Zenith angle graph", "XOZ", "Spatial intensity graph"]), start_cell='top-left', column_widths=[0.6,0.2,0.2], 
            specs=[[{"rowspan":3, 'type': 'scatter3d'}, {'type': 'scatter'}, {'type': 'scatter'}],
                [None, {'type': 'scatter'}, {'type': 'scatter'}],
                [None, {'type': 'scatter'}, {'type': 'scatter'}]])

        fig.add_trace(row=1, col=1,
            trace=self.vi_3d(x, y, z, '')) # replace with your own data source

        fig.add_trace(row=1, col=2,
            trace=self.vi_2d(x,y,'Horizontal Plan'))
        fig.add_trace(row=2, col=2,
            trace=self.vi_2d(x,z,'XOZ'))
        fig.add_trace(row=3, col=2,
            trace=self.vi_2d(y,z,'YOZ'))
        
        fig.add_trace(row=1, col=3,
            trace=self.vi_2d(x,y,'Horizontal Plan'))
        fig.add_trace(row=2, col=3,
            trace=self.vi_2d(x,z,'XOZ'))
        fig.add_trace(row=3, col=3,
            trace=self.vi_2d(y,z,'YOZ'))

        fig.write_html(f"templates/{name}dash.html")
      
      
    def vi_2d(self, x, y, name):
        data = go.Scatter(
            x = x,
            y = y,
            mode='lines+markers'
        )
        return data
    
    def vi_angle(self, angle):
        data = go.Scatter(
            x = x,
            y = y,
            mode='lines+markers'
        )
        return data
    
    def vi_3d(self, x, y, z,name):
        data = go.Scatter3d(
            x=x,
            y=y,
            z=z,
            mode='lines+markers',
            marker=dict(
                size=4,
                color=z,                # set color to an array/list of desired values
                colorscale='Viridis',   # choose a colorscale
                opacity=0.8
            )
        )
        return data
    
    def vi_3d_primitive(self, x, y, z):
        pass