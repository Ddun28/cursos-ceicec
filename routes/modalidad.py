from ..modelo import Modalidad, modalidad_schema, usuarios_schema, db, rol_schema, modalidades_schema
from flask import request, jsonify
from flask import Blueprint

rout=Blueprint('modalidad_blueprint',__name__)

@rout.route('/modalidades', methods=['POST'])
def agregar_modalidad():
    try:
        modalidad_nombre= request.json['modalidad_nombre']
        
        modalidad= Modalidad(modalidad_nombre)
        db.session.add(modalidad)
        db.session.commit()
        return modalidad_schema.jsonify(modalidad)
    except Exception as e:
        db.session.rollback()  # Revierte los cambios en la base de datos
        return jsonify({'error': str(e)}), 400 
    
@rout.route('/lista_modalidades', methods=['GET'])
def lista_modalidades():
    try:
        listado = Modalidad.query.all()
        resultado = modalidades_schema.dump(listado) 
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 
#
@rout.route('/actualizar_modalidad/<modalidad_id>', methods=['PUT'])
def actualizar_modalidad(modalidad_id):
    act_modalidad = Modalidad.query.get_or_404(modalidad_id)  # Manejo de usuario no encontrado
#
    try:
        data = request.get_json()  # Obtén los datos JSON del request
        modalidad_data = modalidad_schema.load(data, partial=True)  # Deserializa y valida, partial=True
        
        # Actualiza los atributos del usuario existente
        for key, value in modalidad_data.items():
            setattr(act_modalidad, key, value)
#
        db.session.commit()
#
        result = rol_schema.dump(act_modalidad)
        return jsonify(result), 200  # 200 OK
#
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
#
@rout.route('/eliminar_modalidad/<modalidad_id>', methods=['DELETE'])
def eliminar_modalidad(modalidad_id):
    try:
        modalidad= Modalidad.query.get_or_404(modalidad_id) 
    
        db.session.delete(modalidad)
        db.session.commit()
        return jsonify({'mensaje': 'Modalidad eliminada correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
