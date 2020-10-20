# * ---------- IMPORTS --------- *
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
import psycopg2
import cv2
import numpy as np
import re


FILE_PATH = os.path.dirname(os.path.realpath(__file__))

# * ---------- Create App --------- *
app = Flask(__name__)
CORS(app, support_credentials=True)



# * ---------- DATABASE CONFIG --------- *

def DATABASE_CONNECTION(): #ignoreline
    return psycopg2.connect(user='postgres', #ignoreline
                              password='1234', #ignoreline
                              host='localhost', #ignoreline
                              port='5432', #ignoreline
                              database='cabot') #ignoreline

# descomente
#def DATABASE_CONNECTION():
    #return psycopg2.connect(user='user',
                              #password='password',
                              #host='host',
                              #port='port',
                              #database='db') 



# * --------------------  ROUTES ------------------- *
# * ---------- Pegando dados do reconhecimento facial ---------- *
@app.route('/receive_data', methods=['POST'])
def get_receive_data():
    connection = None
    if request.method == 'POST':
        json_data = request.get_json()

        # Checar se o usuário já está no Database
        try:
            # Conectando-se ao Database
            connection =  DATABASE_CONNECTION()
            cursor = connection.cursor()

            # Query para ver se o usuário já foi visto pela camera hoje
            user_saw_today_sql_query =\
                f"SELECT * FROM usuarios WHERE data = '{json_data['data']}' AND nome = '{json_data['nome']}'"

            cursor.execute(user_saw_today_sql_query)
            result = cursor.fetchall()
            connection.commit()

            # Se o usuario ja estiver no database hoje:
            if result:
               print('user IN')
               image_path = f"{FILE_PATH}/assets/img/{json_data['data']}/{json_data['nome']}/departure.jpg"

                # Salvar imagem
               os.makedirs(f"{FILE_PATH}/assets/img/{json_data['data']}/{json_data['nome']}", exist_ok=True)
               cv2.imwrite(image_path, np.array(json_data['picture_array']))
               json_data['picture_path'] = image_path

                # Atualizar usuário no Database
               update_user_querry = f"UPDATE usuarios SET hora_saida = '{json_data['hora']}', foto_saida = '{json_data['picture_path']}' WHERE nome = '{json_data['nome']}' AND data = '{json_data['data']}'"
               cursor.execute(update_user_querry)

            else:
                print("user OUT")
                # Salvar imagem
                image_path = f"{FILE_PATH}/assets/img/history/{json_data['data']}/{json_data['nome']}/arrival.jpg"
                os.makedirs(f"{FILE_PATH}/assets/img/history/{json_data['data']}/{json_data['nome']}", exist_ok=True)
                cv2.imwrite(image_path, np.array(json_data['picture_array']))
                json_data['picture_path'] = image_path

                # Criar uma nova linha para o usuário hoje:
                insert_user_querry = f"INSERT INTO usuarios (nome, data, hora_chegada, foto_chegada) VALUES ('{json_data['nome']}', '{json_data['data']}', '{json_data['hora']}', '{json_data['picture_path']}')"
                cursor.execute(insert_user_querry)

        except (Exception, psycopg2.DatabaseError) as error:
            print("ERROR DB: ", error)
        finally:
            
            # fechando a conexão com o database
            if (connection != None):
                connection.commit()

                cursor.close()
                connection.close()
                print("A conexão com PostgreSQL está fechada")

        # retornar os dados do usuário para o front
        return jsonify(json_data)


# * ---------- Pegando todos os dados de um funcionário ---------- *
@app.route('/get_employee/<string:nome>', methods=['GET'])
def get_employee(nome):
    answer_to_send = {}
    # Checando se o usuário já está no database
    try:
        # Conectando-se ao database
        connection = DATABASE_CONNECTION()
        cursor = connection.cursor()
        # Query para pegar todos os dados de um usuário do database:
        user_information_sql_query = f"SELECT * FROM usuarios WHERE nome = '{nome}'"

        cursor.execute(user_information_sql_query)
        result = cursor.fetchall()
        connection.commit()

        # se o usuário já estiver no daatabase
        if result:
            print('RESULT: ',result)
            # Estruturando os dados e colocando as datas em string para o front
            for k,v in enumerate(result):
                answer_to_send[k] = {}
                for ko,vo in enumerate(result[k]):
                    answer_to_send[k][ko] = str(vo)
            print('answer_to_send: ', answer_to_send)
        else:
            answer_to_send = {'error': 'Usuário não encontrado...'}

    except (Exception, psycopg2.DatabaseError) as error:
        print("ERROR DB: ", error)
    finally:
        # fechando conexão com o database:
        if (connection):
            cursor.close()
            connection.close()

    # retornando os dados do usuário para o front
    return jsonify(answer_to_send)


# * --------- Pegando os ultimos 5 usuários vistos pela camera --------- *
@app.route('/get_5_last_entries', methods=['GET'])
def get_5_last_entries():
    answer_to_send = {}
    # Checando se o usuário está no database
    try:
        # Conecanto-se ao database
        connection = DATABASE_CONNECTION()

        cursor = connection.cursor()
        # Query para pegar todos os dados de um usuário:
        lasts_entries_sql_query = f"SELECT * FROM usuarios ORDER BY id DESC LIMIT 5;"

        cursor.execute(lasts_entries_sql_query)
        result = cursor.fetchall()
        connection.commit()

        # se o database não está vazio
        if result:
            # Estruturando os dados e colocando as datas em string para o front
            for k, v in enumerate(result):
                answer_to_send[k] = {}
                for ko, vo in enumerate(result[k]):
                    answer_to_send[k][ko] = str(vo)
        else:
            answer_to_send = {'error': 'error detect'}

    except (Exception, psycopg2.DatabaseError) as error:
        print("ERROR DB: ", error)
    finally:
        # fechando a conexão com o database:
        if (connection):
            cursor.close()
            connection.close()

    # retornando os dados do usuario para o front
    return jsonify(answer_to_send)


# * ---------- Adicionando novo funcionário ---------- *
@app.route('/add_employee', methods=['POST'])
@cross_origin(supports_credentials=True)
def add_employee():
    try:
        # Pegando a foto do request
        image_file = request.files['image']
        print(request.form['nameOfEmployee'])

        # Armazenando na pasta de rostos conhecidos:
        file_path = os.path.join(f"assets/img/users/{request.form['nameOfEmployee']}.jpg")
        image_file.save(file_path)
        answer = 'new employee succesfully added'
    except:
        answer = 'Error while adding new employee. Please try later...'
    return jsonify(answer)


# * ---------- Pegando a lista de funcionários ---------- *
@app.route('/get_employee_list', methods=['GET'])
def get_employee_list():
    employee_list = {}

    # Passando pela pasta de usuario para pegar a lista
    walk_count = 0
    for file_name in os.listdir(f"{FILE_PATH}/assets/img/users/"):
        # Pegando os nomes de funcionarios com os nomes de arquivos
        name = re.findall("(.*)\.jpg", file_name)
        if name:
            employee_list[walk_count] = name[0]
        walk_count += 1

    return jsonify(employee_list)


# * ---------- Apagando funcionário ---------- *
@app.route('/delete_employee/<string:name>', methods=['GET'])
def delete_employee(name):
    try:
        # Removendo foto do funcionário da pasta de usuarios:
        print('name: ', name)
        file_path = os.path.join(f'assets/img/users/{name}.jpg')
        os.remove(file_path)
        answer = 'Funcionário removido com sucesso!'
    except:
        answer = 'Erro enquanto deletava o funcionário. Por favor, tente mais tarde'

    return jsonify(answer)


                                 
# * -------------------- RUN SERVER -------------------- *
if __name__ == '__main__':
    
    app.run(host='127.0.0.1', port=5000, debug=True)
