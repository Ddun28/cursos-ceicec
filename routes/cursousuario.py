from ..modelo import db, cursousuario, cursosusuarios_schema, CursoUsuarioSchema, cursousuario_schema, usuario_schema, usuario, curso, curso_schema, EstadoPago
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint
from marshmallow import ValidationError

routa = Blueprint('cursousuario_blueprint', __name__)

@routa.route('/ruta_protegida', methods=['GET'])
@jwt_required()
def ruta_protegida():
    cedula = get_jwt_identity()
    return jsonify({'cedula': cedula})

@routa.route('/pago', methods=['POST'])
@jwt_required()
def pago_curso():
    try:
        # Obtener la cédula del usuario autenticado
        cedula = get_jwt_identity()

        # Obtener los datos enviados desde el frontend
        data = request.get_json()
        print("Data recibida:", data)

        # Validar y deserializar los datos usando el esquema
        pago_data = CursoUsuarioSchema().load(data)

        # Obtener los cursos a los que el usuario se inscribirá
        cursos_inscritos = pago_data['cursos_inscritos']

        # Verificar que todos los cursos existan
        for curso_id in cursos_inscritos:
            curso_actual = curso.query.get(curso_id)
            if not curso_actual:
                return jsonify({'error': f'El curso con ID {curso_id} no existe'}), 404

        # Crear un solo registro en la base de datos con todos los cursos inscritos
        pago = cursousuario(
            cedula=cedula,
            cursos_inscritos=cursos_inscritos,  # Guardar todos los curso_id en un solo registro
            monto=pago_data['monto'],
            moneda=pago_data['moneda'],
            estado_pago=pago_data['estado_pago'],
            numero_referencia=pago_data.get('numero_referencia')  # Campo opcional
        )

        # Guardar el registro en la base de datos
        db.session.add(pago)
        db.session.commit()

        # Serializar y devolver la respuesta
        result = CursoUsuarioSchema().dump(pago)
        return jsonify(result), 201

    except ValidationError as e:
        db.session.rollback()
        print("Error de validación:", e.messages)
        return jsonify({'error': 'Datos inválidos', 'details': e.messages}), 400

    except Exception as e:
        db.session.rollback()
        print("Error en el backend:", str(e))
        return jsonify({'error': str(e)}), 500
    
@routa.route('/listado-pago', methods=['GET'])
def listado_pago():
    try:
        # Obtener todos los registros de la tabla usuario_curso
        listado_cursousuario = cursousuario.query.all()
        
        # Si no hay registros, devolver un mensaje
        if not listado_cursousuario:
            return jsonify({"message": "No hay registros en la tabla usuario_curso"}), 404
        
        # Crear una lista para almacenar los resultados
        resultados = []
        
        for registro in listado_cursousuario:
            # Serializar la información del registro de cursousuario
            registro_data = cursousuario_schema.dump(registro)
            
            # Obtener el usuario correspondiente a la cédula del registro
            usuario_encontrado = usuario.query.filter_by(cedula=registro.cedula).first()
            
            # Si se encuentra el usuario, serializar su información
            if usuario_encontrado:
                usuario_data = usuario_schema.dump(usuario_encontrado)
                registro_data["usuario"] = usuario_data
            else:
                registro_data["usuario"] = None
            
            # Obtener los detalles de los cursos inscritos
            cursos_inscritos = registro.cursos_inscritos  # Esto es un JSON con los IDs de los cursos
            cursos_detalles = []
            
            for curso_id in cursos_inscritos:
                curso_encontrado = curso.query.get(curso_id)
                if curso_encontrado:
                    curso_data = curso_schema.dump(curso_encontrado)
                    cursos_detalles.append(curso_data)
            
            # Agregar los detalles de los cursos al registro
            registro_data["cursos"] = cursos_detalles
            
            # Agregar el registro procesado a la lista de resultados
            resultados.append(registro_data)
        
        return jsonify(resultados), 200
    
    except Exception as e:
        # Manejar errores inesperados
        print("Error en el backend:", str(e))
        return jsonify({"error": str(e)}), 500

@routa.route('/lista_pago_usuario/<int:cedula>', methods=['GET'])  # Cambié el nombre de la ruta
def lista_pago_usuario(cedula):
    usuario = cursousuario.query.filter_by(cedula=cedula).first()
    if usuario:
        resultado = cursosusuarios_schema.dump(usuario)
        return jsonify(resultado), 200
    else:
        return jsonify({"error": "Usuario no encontrado"}), 404

@routa.route('/actualizar_estado_pago/<int:id>/<string:cedula>', methods=['PUT'])
def actualizar_estado_pago(id, cedula):
    try:
        # Buscar el registro específico por id
        usuario_inscrito = cursousuario.query.filter_by(id=id).first()
        if not usuario_inscrito:
            return jsonify({"error": "Inscripción no encontrada"}), 404

        # Verificar que la cédula del registro coincide con la cédula proporcionada
        if usuario_inscrito.cedula != int(cedula):
            return jsonify({"error": "No tienes permiso para actualizar este registro"}), 403

        # Obtener el nuevo estado de pago desde el cuerpo de la solicitud
        data = request.get_json()
        nuevo_estado = data.get("estado_pago")

        # Validar el nuevo estado de pago
        if nuevo_estado not in [EstadoPago.CONFIRMADO.value, EstadoPago.CANCELADO.value]:
            return jsonify({"error": "Estado de pago no válido"}), 400

        # Actualizar solo el registro específico
        usuario_inscrito.estado_pago = nuevo_estado
        db.session.commit()

        # Devolver la respuesta actualizada
        result = cursousuario_schema.dump(usuario_inscrito)
        return jsonify(result), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@routa.route('/eliminar_curso/<cedula>', methods=['DELETE'])
def eliminar_curso(cedula):
    try:
        pagounico = cursousuario.query.get_or_404(cedula) 
    
        db.session.delete(pagounico)
        db.session.commit()
        return jsonify({'mensaje': 'Curso eliminado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400