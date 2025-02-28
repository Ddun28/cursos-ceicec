from ..modelo import db, cursousuario,cursosusuarios_schema,CursoUsuarioSchema,cursousuario_schema,usuario_schema
from flask import request, jsonify
from flask import Blueprint

routa=Blueprint('cursousuario_blueprint',__name__)

@routa.route('/pago', methods=['POST'])
def pago_curso():
    try:
        data = request.get_json()  # Obtén los datos JSON del request
        pago_data = cursousuario_schema.load(data)  # Deserializa y valida los datos
        
        pago = cursousuario(**pago_data)  # Crea el nuevo usuario
        db.session.add(pago)
        db.session.commit()

        # Serializa el nuevo usuario usando el esquema antes de enviarlo en la respuesta
        result = cursousuario_schema.dump(pago)  # Serializa el objeto usuario
        return jsonify(result), 201  # 201 Created y JSON serializado

    except Exception as e:
        db.session.rollback()  # Revierte los cambios en la base de datos
        return jsonify({'error': str(e)}), 400 
    
@routa.route('/lista_pago', methods=['GET'])
def lista_pago():
    listado= cursousuario.query.all()
    resultado=cursosusuarios_schema.dump(listado)
    return jsonify(resultado)
@routa.route('/actualizar_pago/<cedula>', methods=['PUT'])
def actualizar_curso(cedula):
    act_pago = cursousuario.query.get_or_404(cedula)  # Manejo de usuario no encontrado#
    try:
        data = request.get_json()  # Obtén los datos JSON del request
        pago_data = cursousuario_schema.load(data, partial=True)  # Deserializa y valida, partial=True
        
        # Actualiza los atributos del usuario existente
        for key, value in pago_data.items():
            setattr(act_pago, key, value)#
        db.session.commit()#
        result = cursousuario_schema.dump(act_pago)
        return jsonify(result), 200  # 200 OK#

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
@routa.route('/eliminar_curso/<cedula>', methods=['DELETE'])
def eliminar_curso(cedula):
    try:
        pagounico= cursousuario.query.get_or_404(cedula) 
    
        db.session.delete(pagounico)
        db.session.commit()
        return jsonify({'mensaje': 'Curso eliminado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
