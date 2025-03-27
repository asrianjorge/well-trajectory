import pandas as pd
from dls_filter import DLSFilter


filter_ = DLSFilter()
zen, azim = filter_.filtration()

# v = PlotlyVisualisator()
path = '/Users/girgisasrian/Documents/react/full1/backend/uploads/inclinometry_case_1.csv'
file = pd.read_csv(path)
d = file['depth'].values.tolist()

x,y,z = filter_.coordinates(d,zen,azim)

new_data = Data(
    x_values=x,
    y_values=y,
    z_values=z
)