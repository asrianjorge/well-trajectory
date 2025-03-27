from flask import Flask, render_template, redirect, url_for, request, send_file
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField 
from wtforms.validators import Length
from pandas import DataFrame
import os
from dls_filter import DLSFilter
from visualisator import PlotlyVisualisator
import pandas as pd
from dash import Dash, dcc, html, Input, Output
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.serving import run_simple
# import dash_core_components as dcc
# import dash_html_components as html

# def create_dash_app(server):
#     dash_app = Dash(server=server, url_base_pathname='/dash/')
#     dash_app.config['suppress_callback_exceptions'] = True
#     dash_app.title='Dash App'
#     vi = PlotlyVisualisator()
#     filter_ = DLSFilter()
#     zen, azim = filter_.filtration()
#     path = 'uploads/downloaded.csv'
#     file = pd.read_csv(path)
#     d = file['depth'].values.tolist()
#     print(len(d), len(zen),len(azim))
#     x,y,z = filter_.coordinates(d,zen,azim)

#     dash_app.layout = html.Div(
#         children=[
#             html.H1(children="Hello Dash"),
#             html.Div(
#                 children="Ура графикам!"
#             ), 
#             dcc.Graph(
#                 id="example-graph",
#                 figure=vi.main(x,y,z)
#             ),
#         ]
#     )
#     if __name__=='__main__':
#         dash_app.run_server(debug=True)



app = Flask(__name__)
app.config['SECRET_KEY'] = "YOU HAVE READ IT! IT IS NO MORE A SECRET!"
Bootstrap(app)
# dash_app = create_dash_app(app)

# dash_app = Dash(__name__)
# vi = PlotlyVisualisator()
# filter_ = DLSFilter()
# zen, azim = filter_.filtration()
# path = 'uploads/downloaded.csv'
# file = pd.read_csv(path)
# d = file['depth'].values.tolist()
# print(len(d), len(zen),len(azim))
# x,y,z = filter_.coordinates(d,zen,azim)

# dash_app.layout = html.Div(
#     children=[
#         html.H1(children="Hello Dash"),
#         html.Div(
#             children="Ура графикам!"
#         ), 
#         dcc.Graph(
#             id="example-graph",
#             figure=vi.main(x,y,z)
#         ),
#     ]
# )
# if __name__=='__main__':
#     dash_app.run_server(debug=True)

tools = []

# tool_counter = 0


class ToolForm(FlaskForm):
    name = StringField("Название конструкции")
    depth_ = StringField("Глубина интервала по стволу", validators=[Length(min=1)])
    diam_ = StringField("Диаметр долота")
    k_ = StringField("Коэффициент кавернозности")
    diamOK_ = StringField("Диаметр спускаемой обсадной колонны")
    diamOK_from = StringField("Диаметр спускаемой обсадной колонны - глубина от")
    diamOK_to = StringField("Диаметр спускаемой обсадной колонны - глубина до")
    thickOK_ = StringField("Толщина стенки")
    thickOK_from = StringField("Толщина стенки - глубина от")
    thickOK_to = StringField("Толщина стенки - глубина до")
    depthOK_ = StringField("Глубина спуска ОК по вертикали")


@app.route("/")
def index():
    
    # if request.method == "POST":
    #     mass = [['1','2','3'], ['inter_number',len(tools)]]
    #     for i in range(len(tools)):
    #         mass.append(
    #             ['name', tools[i][0]],
    #             ['depth', tools[i][1]],
    #             ['diameter', tools[i][2]],
    #             ['k', tools[i][3]],
    #             ['diameter_OK', tools[i][4]],
    #             ['', tools[i][5], tools[i][6]],
    #             ['thickness', tools[i][7]],
    #             ['', tools[i][8], tools[i][9]],
    #             ['depth_OK', tools[i][10]]
    #         )
    #     pd.DataFrame(mass).to_csv(f'uploads/tools.csv', index=False, header=False)    
    #     filter_ = DLSFilter()
    #     zen, azim = filter_.filtration()
    #     v = PlotlyVisualisator()
    #     path = 'uploads/downloaded'
    #     file = pd.read_csv(path)
    #     d = file['depth'].values.tolist()
    #     x,y,z = filter_.coordinates(d,zen,azim)
    #     v.create_dash_app(app,x,y,z)
    
    return render_template('index.html', n=len(tools), tools=tools)

@app.route("/addtool", methods=['GET', 'POST'])
def addtool():
    form = ToolForm()
    
    global df
    df = DataFrame()
    try:
        if form.validate_on_submit():
            newby = [form.name.data, form.depth_.data, form.diam_.data, form.k_.data, form.diamOK_.data, form.thickOK_.data, form.depthOK_.data]
            # df = df._append(['name',form.name.data], ignore_index=True)
            # df = df._append(['depth_',form.depth_.data], ignore_index=True)
            # df = df._append(['diam_',form.diam_.data], ignore_index=True)
            # df = df._append(['k_',form.k_.data], ignore_index=True)
            # df = df._append(['diamOK_',form.diamOK_.data], ignore_index=True)
            # df = df._append(['thickOK_',form.thickOK_.data], ignore_index=True)
            # df = df._append(['depthOK_',form.depthOK_.data], ignore_index=True)
            tools.append(newby)
            # df = df._append({'tool':[{'name': form.name.data,
            #     'depth_': form.depth_.data,
            #     'diam_': form.diam_.data,
            #     'k_': form.k_.data,
            #     'diamOK_': form.diamOK_.data,
            #     'thickOK_': form.thickOK_.data,
            #     'depthOK_': form.depthOK_.data}]}, ignore_index=True)
            result = DataFrame(tools).to_json('uploads/tools.json', orient="index")
            # result = df.to_json('uploads/tools.json')
            
            print(tools)
            return redirect(url_for('index'))
    except UnboundLocalError:
        df = DataFrame()
        df = df._append(['1','2','3'], ignore_index=True)
        
        if form.validate_on_submit():
            newby = [form.name.data, form.depth_.data, form.diam_.data, form.k_.data, form.diamOK_.data, form.thickOK_.data, form.depthOK_.data]
            tools.append(newby)

            result = DataFrame(tools).to_json('uploads/tools.json', orient="records")
            
            print(tools)
            return redirect(url_for('index'))
    
    return render_template('addtool.html', form=form)



@app.route("/upload_file", methods=["GET", "POST"])
def upload_file():
    if request.method == "POST":
        file = request.files['file']
        file.save(os.path.join('uploads', 'downloaded.csv'))
        return send_file(os.path.join('uploads', 'downloaded.csv'), as_attachment=True)
    return render_template('upload_file.html', msg="Please choose a file")

@app.route('/download_template')
def download_template():
    return send_file('templates/template-file.html', as_attachment=True)

@app.route("/upload_file_tool", methods=["GET", "POST"])
def upload_file_tool():
    if request.method == "POST":
        file = request.files['file']
        file.save(os.path.join('uploads', 'tools.csv'))
        return send_file(os.path.join('uploads', 'tools.csv'), as_attachment=True)
    return render_template('upload_file.html', msg="Please choose a file")

@app.route('/download_template_tool')
def download_template_tool():
    return send_file('templates/template-file.html', as_attachment=True)

@app.route('/final', methods=["GET", "POST"])
def final():
    if not os.path.exists('uploads/tools.csv'):
        mass = [['1','2','3'], ['inter_number',len(tools)]]
        for i in range(len(tools)):
            mass.append(
                ['name', tools[i][0]],
                ['depth', tools[i][1]],
                ['diameter', tools[i][2]],
                ['k', tools[i][3]],
                ['diameter_OK', tools[i][4]],
                ['', tools[i][5], tools[i][6]],
                ['thickness', tools[i][7]],
                ['', tools[i][8], tools[i][9]],
                ['depth_OK', tools[i][10]]
            )
        pd.DataFrame(mass).to_csv(f'uploads/tools.csv', index=False, header=False)  
          
    filter_ = DLSFilter()
    zen, azim = filter_.filtration()
    path = 'uploads/downloaded.csv'
    file = pd.read_csv(path)
    d = file['depth'].values.tolist()
    print(len(d), len(zen),len(azim))
    x,y,z = filter_.coordinates(d,zen,azim)
    vi = PlotlyVisualisator()
    vi.main(x,y,z, 'final')
    # return render_template('final.html')
    return render_template('finaldash.html')

# @app.route('/dash', methods=["GET", "POST"])
# def dash():
#     dash_app = create_dash_app(app)
#     dash_app.run_server(debug=True)
    
#     return redirect('/dash/')
    
    
if __name__ == '__main__':
    app.run(debug=True)

# if __name__=="__main__":
#     app.run()