from datetime import datetime
from flask import Flask, request, jsonify
from marshmallow import fields
from flask import Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from .extensiones import db,ma

class Rol(db.Model):
    __tablename__ = 'roles'
    rol_id = db.Column(db.Integer(), primary_key=True)
    rol_nombre = db.Column(db.String(30), nullable=False)

    def __init__(self,rol_nombre):
        self.rol_nombre= rol_nombre
        
class RolSchema(ma.Schema):
    class Meta:
        fields=('rol_id','rol_nombre')
    
rol_schema=RolSchema()
roles_schema=RolSchema(many=True)   
        
class usuario(db.Model):
    __tablename__ = 'usuarios'
    cedula = db.Column(db.Integer(), primary_key=True)
    usuario_telegram = db.Column(db.String(50), nullable=False, unique=True)
    nombre = db.Column(db.String(40), nullable=True)
    apellido = db.Column(db.String(40), nullable=True)
    correo = db.Column(db.String(50), nullable=False, unique=True)
    contrasena = db.Column(db.String(200), nullable=False)
    rol_id = db.Column(db.Integer(), db.ForeignKey('roles.rol_id'), nullable=False)  # Definir como ForeignKey
    created_at = db.Column(db.DateTime(), default=datetime.now)

    # Relación con el modelo Rol
    rol = db.relationship('Rol', backref='usuarios')  # Esto permite acceder al rol desde el usuario

    def __init__(self, cedula, usuario_telegram, nombre, apellido, correo, contrasena, rol_id):
        self.cedula = cedula
        self.usuario_telegram = usuario_telegram
        self.nombre = nombre
        self.apellido = apellido
        self.correo = correo
        self.contrasena = contrasena
        self.rol_id = rol_id
        
class UsuarioSchema(ma.Schema):
    cedula = fields.Integer()
    usuario_telegram = fields.String()
    nombre = fields.String()
    apellido = fields.String()
    correo = fields.String()
    contrasena = fields.String(load_only=True)  # ¡Solo para crear/actualizar, no para mostrar!
    rol_id = fields.Integer()
    created_at = fields.DateTime(dump_only=True)  # ¡Solo para mostrar, no para crear/actualizar!

usuario_schema=UsuarioSchema()
usuarios_schema=UsuarioSchema(many=True)   

class Modalidad(db.Model):
    __tablename__='modalidad'
    modalidad_id=db.Column(db.Integer(), primary_key=True, autoincrement=True)
    modalidad_nombre=db.Column(db.String(50),nullable=False,unique=True)
   
    def __init__(self,modalidad_nombre):
        self.modalidad_nombre= modalidad_nombre
        
class ModalidadSchema(ma.Schema):
    class Meta:
        fields=('modalidad_id','modalidad_nombre')
    
modalidad_schema=ModalidadSchema()
modalidades_schema=ModalidadSchema(many=True)   

class curso(db.Model):
    __tablename__ = 'cursos'
    curso_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(), nullable=False, unique=True)
    cedula_instructor = db.Column(db.Integer(), db.ForeignKey('usuarios.cedula'), nullable=True)
    costo = db.Column(db.Integer(), nullable=False)
    duracion = db.Column(db.String(), nullable=False)
    estado = db.Column(db.Boolean(), nullable=False)
    limite_estudiante = db.Column(db.Integer(), nullable=False)
    modalidad_id = db.Column(db.Integer(), db.ForeignKey('modalidad.modalidad_id'), nullable=True)

    # Relaciones
    instructor = db.relationship('usuario', backref='cursos')  
    modalidad = db.relationship('Modalidad', backref='cursos') 

    def __str__(self):
        return self.nombre

class CursoSchema(ma.Schema):
    class Meta:
        fields = (
            'curso_id', 'nombre', 'cedula_instructor', 'costo', 'duracion', 
            'estado', 'limite_estudiante', 'modalidad_id', 'instructor', 'modalidad'
        )

    # Campos relacionados
    instructor = fields.Nested(UsuarioSchema) 
    modalidad = fields.Nested(ModalidadSchema)  #

curso_schema = CursoSchema()
cursos_schema = CursoSchema(many=True)

class cursousuario(db.Model):
    __tablename__='usuario_curso'
    curso_id=db.Column(db.Integer(), db.ForeignKey('cursos.curso_id'), primary_key=True, nullable=True)
    cedula=db.Column(db.Integer(),db.ForeignKey('usuarios.cedula'), primary_key=True, nullable=True)
    pago=db.Column(db.Integer(), nullable=False)
    
    def __str__(self):
        return self.pago

class CursoUsuarioSchema(ma.Schema):
    class Meta:
        fields=('curso_id','cedula','pago')
    
cursousuario_schema=CursoUsuarioSchema()
cursosusuarios_schema=CursoUsuarioSchema(many=True)   