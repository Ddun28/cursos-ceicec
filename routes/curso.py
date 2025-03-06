from ..modelo import db, curso_schema, curso, usuario_schema, cursos_schema, cursousuario_schema, usuario, cursousuario
from flask import request, jsonify
from flask import Blueprint
from sqlalchemy.orm import joinedload
from sqlalchemy import text 
from sqlalchemy import func  # Importar func para usar funciones de PostgreSQL

rut=Blueprint('curso_blueprint',__name__)

@rut.route('/curso', methods=['POST'])
def agregar_curso():
    try:
        data = request.get_json()  # Obtén los datos JSON del request
        curso_data = curso_schema.load(data)  # Deserializa y valida los datos
        
        nuevo_curso = curso(**curso_data)  # Crea el nuevo usuario
        db.session.add(nuevo_curso)
        db.session.commit()

        # Serializa el nuevo usuario usando el esquema antes de enviarlo en la respuesta
        result = usuario_schema.dump(nuevo_curso)  # Serializa el objeto usuario
        return jsonify(result), 201  # 201 Created y JSON serializado

    except Exception as e:
        db.session.rollback()  # Revierte los cambios en la base de datos
        return jsonify({'error': str(e)}), 400 
    
@rut.route('/lista_cursos', methods=['GET'])
def lista_cursos():

    listado = curso.query.options(
        joinedload(curso.instructor),  
        joinedload(curso.modalidad)    
    ).all()
    
    resultado = cursos_schema.dump(listado)
    return jsonify(resultado)

@rut.route('/curso/<int:curso_id>/usuarios', methods=['GET'])
def obtener_usuarios_inscritos(curso_id):
    try:
        # Filtrar los registros de cursousuario donde cursos_inscritos contiene el curso_id
        registros = cursousuario.query.filter(
            text("cursos_inscritos @> to_jsonb(:curso_id)").bindparams(curso_id=[curso_id])
        ).all()
        
        # Si no hay registros, devolver un mensaje
        if not registros:
            return jsonify({"message": "No hay usuarios inscritos en este curso"}), 404
        
        # Crear una lista para almacenar los resultados
        resultados = []
        
        for registro in registros:
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
            
            # Agregar el registro procesado a la lista de resultados
            resultados.append(registro_data)
        
        return jsonify(resultados), 200
    
    except Exception as e:
        # Manejar errores inesperados
        print("Error en el backend:", str(e))
        return jsonify({"error": str(e)}), 500
    
@rut.route('/actualizar_cursos/<curso_id>', methods=['PUT'])
def actualizar_curso(curso_id):
    act_curso = curso.query.get_or_404(curso_id)  # Manejo de usuario no encontrado

    try:
        data = request.get_json()  # Obtén los datos JSON del request
        curso_data = curso_schema.load(data, partial=True)  # Deserializa y valida, partial=True
        
        # Actualiza los atributos del usuario existente
        for key, value in curso_data.items():
            setattr(act_curso, key, value)

        db.session.commit()

        result = curso_schema.dump(act_curso)
        return jsonify(result), 200  # 200 OK

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@rut.route('/eliminar_curso/<curso_id>', methods=['DELETE'])
def eliminar_curso(curso_id):
    try:
        cursounico= curso.query.get_or_404(curso_id) 
    
        db.session.delete(cursounico)
        db.session.commit()
        return jsonify({'mensaje': 'Curso eliminado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
