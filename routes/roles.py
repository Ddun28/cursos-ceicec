from ..modelo import Rol, rol_schema, db, roles_schema
from flask import request, jsonify
from flask import Blueprint

main=Blueprint('rol_blueprint',__name__)

@main.route('/roles', methods=['POST'])
def agregar_rol():
    try:
        rol_nombre= request.json['rol_nombre']
        
        rol= Rol(rol_nombre)
        db.session.add(rol)
        db.session.commit()
        return rol_schema.jsonify(rol)
    except Exception as e:
        db.session.rollback()  # Revierte los cambios en la base de datos
        return jsonify({'error': str(e)}), 400 
    
@main.route('/rol/<int:rol_id>', methods=['GET'])
def obtener_rol(rol_id):
    try:
        # Buscar el rol por su ID
        rol = Rol.query.get_or_404(rol_id)

        # Devolver el nombre del rol
        return jsonify({
            'rol_id': rol.rol_id,
            'rol_nombre': rol.rol_nombre,
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Error interno del servidor
    
@main.route('/listado_roles', methods=['GET'])
def lista_role():
    listado= Rol.query.all()
    resultado=roles_schema.dump(listado)
    return jsonify(resultado)

@main.route('/actualizar_rol/<rol_id>', methods=['PUT'])
def actualizar_rol(rol_id):
    act_rol = Rol.query.get_or_404(rol_id)  # Manejo de usuario no encontrado

    try:
        data = request.get_json()  # Obtén los datos JSON del request
        rol_data = rol_schema.load(data, partial=True)  # Deserializa y valida, partial=True
        
        # Actualiza los atributos del usuario existente
        for key, value in rol_data.items():
            setattr(act_rol, key, value)

        db.session.commit()

        result = rol_schema.dump(act_rol)
        return jsonify(result), 200  # 200 OK

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@main.route('/eliminar_rol/<rol_id>', methods=['DELETE'])
def eliminar_rol(rol_id):
    try:
        rol= Rol.query.get_or_404(rol_id) 
    
        db.session.delete(rol)
        db.session.commit()
        return jsonify({'mensaje': 'Rol eliminado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
