##no usar era de prueba
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String,DateTime, Boolean, ForeignKey
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import psycopg2
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy


PGSQL_HOST='localhost'
PSQL_USER='postgres'
PSQL_PASSWORD='dun'
PSQL_DATABASE='proyecto3'
PGSQL_PORT='5432'
def conexion_db():
    try:
        conn = psycopg2.connect(database=PSQL_DATABASE,
                                user=PSQL_USER,
                                password=PSQL_PASSWORD,
                                host=PGSQL_HOST,
                                port=PGSQL_PORT)
        return conn
    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
        return None
    
engine = create_engine(
    f'postgresql://{PSQL_USER}:{PSQL_PASSWORD}@{PGSQL_HOST}/{PSQL_DATABASE}')
Base=declarative_base()

class rol(Base):
    __tablename__='roles'
    rol_id=Column(Integer(), primary_key=True)
    rol_nombre=Column(String(30), nullable=False)
    
    def __str__(self):
        return self.rol_nombre 

class usuario(Base):
    __tablename__='usuarios'
    cedula=Column(Integer(), primary_key=True)
    usuario_telegram=Column(String(50),nullable=False,unique=True)
    nombre=Column(String(40), nullable=True)
    apellido=Column(String(40), nullable=True)
    correo=Column(String(50),nullable=False,unique=True)
    contrasena=Column(String(50),nullable=False)
    rol_id=Column(String(50),nullable=False)
    created_at=Column(DateTime(),default=datetime.now)
    
    def __str__(self):
        return self.usuario_telegram
    
class modalidad(Base):
    __tablename__='modalidad'
    modalidad_id=Column(Integer(), primary_key=True)
    modalidad_nombre=Column(String(50),nullable=False,unique=True)
    
    def __str__(self):
        return self.modalidad_nombre

class curso(Base):
    __tablename__='Cursos'
    curso_id=Column(Integer(), primary_key=True)
    nombre=Column(String(), nullable=False, unique=True)
    cedula_instructo=Column(Integer(), ForeignKey('usuarios.cedula'), nullable=True)
    costo=Column(Integer(),nullable=False)
    Duracion=Column(String(),nullable=False)
    Estado=Column(Boolean(), nullable=False)
    limite_estudiante=Column(Integer(), nullable=False)
    modalidad_id=Column(Integer(), ForeignKey('modalidad.id'), nullable=True)
    
    def __str__(self):
        return self.nombre

class cursousuario(Base):
    __tablename__='usuario_curso'
    curso_id=Column(Integer(), ForeignKey('cursos.curso_id'), nullable=True)
    cedula_id=Column(Integer(),ForeignKey('usuarios.cedula'), nullable=True)
    pago=Column(Integer(), nullable=False)
    
    def __str__(self):
        return self.pago


Session= sessionmaker(engine)
session = Session()


if __name__=='__main__':
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

    user1= usuario(cedula= 30346086, usuario_telegram='lilianperezbm',apellido='Perez',nombre='Lilian', correo='perezlilian0601@gmail.com', contrasena='Lili', rol_id='Admin')
    
    session.add(user1)
    session.commit() #ejecuta los cambios 
    
    #select * from usuarios
    #usuarios=session.query(usuario).all()
    
    #for user in usuarios:
     #   print(user)
        
    usuarios=session.query(usuario).filter(usuario.cedula==30346086)
    for user in usuarios:
      print(user)

    