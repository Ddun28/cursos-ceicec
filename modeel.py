from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, JSON, Float, Enum
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy.dialects.postgresql import JSONB
import bcrypt

engine = create_engine('postgresql://dun:dun@localhost:5432/proyecto3')

class Base(DeclarativeBase):
    pass

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
    descripcion = Column(String(), nullable=True)  # Nueva columna

    def __str__(self):
        return self.nombre

class CursoUsuario(Base):
    __tablename__ = 'usuario_curso'
    id = Column(Integer(), primary_key=True, autoincrement=True)
    cedula = Column(Integer(), ForeignKey('usuarios.cedula'), nullable=False)
    cursos_inscritos = Column(JSONB, nullable=False)
    monto = Column(Float(), nullable=False)
    moneda = Column(String(10), nullable=False)
    estado_pago = Column(Enum(EstadoPago), nullable=False, default=EstadoPago.EN_ESPERA)
    numero_referencia = Column(Integer(), nullable=True)
    fecha_inscripcion = Column(DateTime(), default=datetime.now)
    created_at = Column(DateTime(), default=datetime.now)
    updated_at = Column(DateTime(), default=datetime.now, onupdate=datetime.now)

    usuario = relationship("Usuario", back_populates="inscripciones")

Session = sessionmaker(engine)
session = Session()

if __name__ == '__main__':
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)


    roles = [
        Rol(rol_nombre="estudiante"),
        Rol(rol_nombre="administrativo"),
        Rol(rol_nombre="superusuario")
    ]

    modalidades = [
        Modalidad(modalidad_nombre="presencial"),
        Modalidad(modalidad_nombre="virtual"),
        Modalidad(modalidad_nombre="mixto")
    ]

    session.add_all(roles)
    session.add_all(modalidades)

    superusuario_rol = session.query(Rol).filter_by(rol_nombre="superusuario").first()

    if superusuario_rol:
        contrasena_plana = "12345678"
        contrasena_hasheada = bcrypt.hashpw(contrasena_plana.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        superusuario = Usuario(
            cedula=12345678,
            usuario_telegram="superusuario123",
            nombre="Super",
            apellido="Usuario",
            correo="superusuario@example.com",
            contrasena=contrasena_hasheada,
            rol_id=superusuario_rol.rol_id
        )

        session.add(superusuario)
        session.commit()
        print("Superusuario creado correctamente.")
    else:
        print("El rol de superusuario no existe en la base de datos.")

    session.close()