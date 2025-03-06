from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, JSON, Float, Enum
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy.dialects.postgresql import JSONB

engine = create_engine('postgresql://dun:dun@localhost:5432/proyecto3')

class Base(DeclarativeBase):
    pass  # No es necesario ningún argumento

# Definir un Enum para los estados de pago
class EstadoPago(PyEnum):
    CONFIRMADO = "confirmado"
    EN_ESPERA = "en_espera"
    CANCELADO = "cancelado"

class Rol(Base):
    __tablename__ = 'roles'
    rol_id = Column(Integer(), primary_key=True)
    rol_nombre = Column(String(30), nullable=False)

    def __init__(self, rol_nombre):
        self.rol_nombre = rol_nombre

class Usuario(Base):
    __tablename__ = 'usuarios'
    cedula = Column(Integer(), primary_key=True)
    usuario_telegram = Column(String(50), nullable=False, unique=True)
    nombre = Column(String(40), nullable=True)
    apellido = Column(String(40), nullable=True)
    correo = Column(String(50), nullable=False, unique=True)
    contrasena = Column(String(200), nullable=False)
    rol_id = Column(Integer(), ForeignKey('roles.rol_id'), nullable=False)
    created_at = Column(DateTime(), default=datetime.now)

    # Relación uno a muchos con CursoUsuario
    inscripciones = relationship("CursoUsuario", back_populates="usuario")

class Modalidad(Base):
    __tablename__ = 'modalidad'
    modalidad_id = Column(Integer(), primary_key=True, autoincrement=True)
    modalidad_nombre = Column(String(50), nullable=False, unique=True)

    def __init__(self, modalidad_nombre):
        self.modalidad_nombre = modalidad_nombre

class Curso(Base):
    __tablename__ = 'cursos'
    curso_id = Column(Integer(), primary_key=True, autoincrement=True)
    nombre = Column(String(), nullable=False, unique=True)
    cedula_instructor = Column(Integer(), ForeignKey('usuarios.cedula'), nullable=True)
    costo = Column(Integer(), nullable=False)
    duracion = Column(String(), nullable=False)
    estado = Column(Boolean(), nullable=False)
    limite_estudiante = Column(Integer(), nullable=False)
    modalidad_id = Column(Integer(), ForeignKey('modalidad.modalidad_id'), nullable=True)

    def __str__(self):
        return self.nombre

class CursoUsuario(Base):
    __tablename__ = 'usuario_curso'
    id = Column(Integer(), primary_key=True, autoincrement=True)
    cedula = Column(Integer(), ForeignKey('usuarios.cedula'), nullable=False)
    cursos_inscritos = Column(JSONB, nullable=False)  # Cambiar a JSONB
    monto = Column(Float(), nullable=False)
    moneda = Column(String(10), nullable=False)
    estado_pago = Column(Enum(EstadoPago), nullable=False, default=EstadoPago.EN_ESPERA)
    numero_referencia = Column(Integer(), nullable=True)
    fecha_inscripcion = Column(DateTime(), default=datetime.now)

    # Relación muchos a uno con Usuario
    usuario = relationship("Usuario", back_populates="inscripciones")

Session = sessionmaker(engine)
session = Session()

if __name__ == '__main__':
    # Eliminar todas las tablas y crear de nuevo
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)