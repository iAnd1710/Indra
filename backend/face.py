import face_recognition
import numpy as np
import cv2, queue, threading, time
import requests, os, re

# Captura de vídeo sem buffer
class VideoCapture:
    def __init__(self, name):
        self.cap = cv2.VideoCapture(name)
        self.q = queue.Queue()
        t = threading.Thread(target=self._reader)
        t.daemon = True
        t.start()

    # lendo os frames assim que estiverem disponíveis, mantendo apenas o mais recente
    def _reader(self):
        while True:
            ret, frame = self.cap.read()
            if not ret:
                break
            if not self.q.empty():
                try:
                    self.q.get_nowait()   # descartar frames
                except queue.Empty:
                    pass
            self.q.put(frame)

    def read(self):
        return self.q.get()

# Selecionando webcam do pc
video_capture = VideoCapture(0)

# video_capture.set(5,1)

# * -------------------- Usuarios -------------------- *
known_face_encodings = []
known_face_names = []
known_faces_filenames = []

for (dirpath, dirnames, filenames) in os.walk('assets/img/users/'):
    known_faces_filenames.extend(filenames)
    break

for filename in known_faces_filenames:
    face = face_recognition.load_image_file('assets/img/users/' + filename)
    known_face_names.append(re.sub("[0-9]",'', filename[:-4]))
    known_face_encodings.append(face_recognition.face_encodings(face)[0])



face_locations = []
face_encodings = []
face_names = []
process_this_frame = True


while True:
    # for i in range(5):
    #     video_capture.grab()
    # Grab a single frame of video
    frame = video_capture.read()
    
    # # Redimensionando o frame de vídeo para o tamanho 1/4 para processar mais rápido o reconhecimento de rosto
    # small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    # print(sys.exc_info())
    # # Converter imagem de BGR para RGB 
    # frame = small_frame[:, :, ::-1]
    
    # Processando todos os frames uma só vez
    if process_this_frame:
        # Encontrar todos os rostos e codificações de rostos no frame atual do vídeo
        face_locations = face_recognition.face_locations(frame)
        face_encodings = face_recognition.face_encodings(frame, face_locations)
        
        # Inicializando uma matriz para o nome dos usuários detectados
        face_names = []


        # * ---------- Iniciar JSON to EXPORT --------- *
        json_to_export = {}
        
        for face_encoding in face_encodings:
            # See if the face is a match for the known face(s)
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"

            # # Se uma correspondência foi encontrada em known_face_encodings, apenas use a primeira.
            # if True in matches:
            #     first_match_index = matches.index(True)
            #     name = known_face_names[first_match_index]

            # Ou, em vez disso, use o rosto conhecido com a menor distância para o novo rosto
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                name = known_face_names[best_match_index]

                # * ---------- Salvando dados para enviar à API -------- *
                json_to_export['nome'] = name
                json_to_export['hora'] = f'{time.localtime().tm_hour}:{time.localtime().tm_min}:{time.localtime().tm_sec}'
                json_to_export['data'] = f'{time.localtime().tm_mday}/{time.localtime().tm_mon}/{time.localtime().tm_year}'
                json_to_export['picture_array'] = frame.tolist()

                # * ---------- Enviando dados para a API --------- *


                r = requests.post(url='http://127.0.0.1:5000/receive_data', json=json_to_export)
                print("Status: ", r.status_code)

            face_names.append(name)
        
    process_this_frame = not process_this_frame
            
            # Mostrar os resultados
    for (top, right, bottom, left), name in zip(face_locations, face_names):
        # Dimensione novamente os locais dos rostos, já que o quadro que detectamos foi dimensionado para 1/4 do tamanho
        # top *= 4
        # right *= 4
        # bottom *= 4
        # left *= 4

        # Desenhar um quadrado em volta do rosto
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

        # Colocar o nome embaixo
        # cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

    # Mostrar a imagem resultante
    cv2.imshow('Video', frame)

    # Pressione 'q' no teclado para sair!
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


video_capture.release()
cv2.destroyAllWindows()
        
        
        
