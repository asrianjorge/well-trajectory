# from config import db
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# class MyModel(Base):
#     __tablename__ = 'my_table'
    
#     id = Column(Integer, primary_key=True)
#     name = Column(String)
#     values = Column(ARRAY(Float))  # Массив значений типа Float

# Пример создания экземпляра
# my_instance = MyModel(name="Example", values=[1.0, 2.0, 3.0])

# class Contact(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     first_name = db.Column(db.String(80), unique=False, nullable=False)
#     last_name = db.Column(db.String(80), unique=False, nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)
    
#     def to_json(self):
#         return {
#             "id": self.id, 
#             "firstName": self.first_name, 
#             "lastName": self.last_name, 
#             "email": self.email, 
#         }
        
        
class Data(Base):
    __tablename__ = 'my_table'
    # id = db.Column(db.Integer, primary_key=True)
    id = Column(Integer, primary_key=True)
    x_values = Column(ARRAY(Float))
    y_values = Column(ARRAY(Float))
    z_values = Column(ARRAY(Float))
    
    def to_json(self):
        return {
            "x_values": self.x_values, 
            "y_values": self.y_values, 
            "z_values": self.z_values, 
        }