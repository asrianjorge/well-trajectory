#create
from flask import request, jsonify, redirect, url_for, request, send_file
import pandas as pd
from dls_filter import DLSFilter
# from visualisator import PlotlyVisualisator
from config import app, db
# from models import Contact
from models import Data
from algorythm import Filter 

@app.route("/data/angles", methods=["GET"])
def get_data_angles():
    f = Filter()
    depth, zen, azim = f.read_inclinometry()
    results = []
    for i in range(len(depth)):
        results.append({'depth': depth[i], "zenit": zen[i], "azimut": azim[i]})
    return jsonify(results)

@app.route('/data/minimum_curvature_method', methods=['GET'])
def get_data_minimum_curvature_method():
    f = Filter()
    depth, zen, azim = f.read_inclinometry()
    x_values, y_values, z_values = f.minimum_curvature_method(depth, zen, azim)
    results = []
    for i in range(len(x_values)):
        results.append({'x_values': x_values[i], "y_values": y_values[i], "z_values": z_values[i]})
    return jsonify(results)

@app.route('/data/radius_of_curvature_method', methods=['GET'])
def get_data_radius_of_curvature_method():
    f = Filter()
    depth, zen, azim = f.read_inclinometry()
    x_values, y_values, z_values = f.radius_of_curvature_method(depth, zen, azim)
    results = []
    for i in range(len(x_values)):
        results.append({'x_values': x_values[i], "y_values": y_values[i], "z_values": z_values[i]})
    return jsonify(results)

@app.route('/data/balanced_tangential_method', methods=['GET'])
def get_balanced_tangential_method():
    f = Filter()
    depth, zen, azim = f.read_inclinometry()
    x_values, y_values, z_values = f.balanced_tangential_method(depth, zen, azim)
    results = []
    for i in range(len(x_values)):
        results.append({'x_values': x_values[i], "y_values": y_values[i], "z_values": z_values[i]})
    return jsonify(results)

@app.route('/data/average_angles_method', methods=['GET'])
def get_average_angles_method():
    f = Filter()
    depth, zen, azim = f.read_inclinometry()
    x_values, y_values, z_values = f.average_angles_method(depth, zen, azim)
    results = []
    for i in range(len(x_values)):
        results.append({'x_values': x_values[i], "y_values": y_values[i], "z_values": z_values[i]})
    return jsonify(results)

@app.route('/data/adaptive_trajectory_method', methods=['GET'])
def get_adaptive_trajectory_method():
    f = Filter()
    depth, zen, azim = f.read_inclinometry()
    x_values, y_values, z_values = f.runge_kutta_trajectory(depth, zen, azim)
    f.save_trajectory_to_excel(x_values, y_values, z_values)
    results = []
    for i in range(len(x_values)):
        results.append({'x_values': x_values[i], "y_values": y_values[i], "z_values": z_values[i]})
    return jsonify(results)

@app.route('/download_template_tool')
def download_template_tool():
    return send_file('uploads/dls.csv', as_attachment=True)


# @app.route("/create_contact", methods=["POST"])
# def create_contact():
#     first_name = request.json.get("firstName")
#     last_name = request.json.get("lastName")
#     email = request.json.get("email")
    
#     if not (first_name and last_name and email):
#         return (
#             jsonify({"message": "You must include a fisrt name, last name and email"}),
#             400,
#         )
        
#     new_contact = Contact(
#         first_name=first_name,
#         last_name=last_name,
#         email=email
#     )
#     try:
#         db.session.add(new_contact)
#         db.session.commit()
#     except Exception as e:
#         return jsonify({"message":str(e)}), 400
    
#     return jsonify({"message": "User created!"}), 201

# @app.route("/update_contact/<int:user_id>", methods=["PATCH"])
# def update_contact(user_id):
#     contact = Contact.query.get(user_id)
    
#     if not contact:
#         return jsonify({"message": "User not found"}), 404
    
#     data = request.json
#     contact.first_name = data.get("firstName", contact.first_name)
#     contact.last_name = data.get("lastName", contact.last_name)
#     contact.email = data.get("email", contact.email)
    
#     db.session.commit()
    
#     return jsonify({"message": "User updated!"}), 200

# @app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
# def delete_contact(user_id):
#     contact = Contact.query.get(user_id)
    
#     if not contact:
#         return jsonify({"message": "User not found"}), 404
    
#     db.session.delete(contact)
#     db.session.commit()
    
#     return jsonify({"message": "User deleted!"}), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        
    app.run(debug=True)