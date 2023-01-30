from flask import Flask, request
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
import pytesseract
from PIL import Image
from text_to_docred import TextInputToDocredPipeline
from sgnlp.models.lsr import LsrModel, LsrConfig, LsrPreprocessor, LsrPostprocessor
from py2neo import Graph, NodeMatcher
from graphdb import graph_query
graph = Graph("neo4j+s://2db082e7.databases.neo4j.io:7687", auth=("neo4j", "seowcsneo4j"))
matcher = NodeMatcher(graph)
text2docred_pipeline = TextInputToDocredPipeline()

rel2id_path = './model_config/rel2id.json'
word2id_path = './model_config/word2id.json'
ner2id_path = './model_config/ner2id.json'
rel_info_path = './model_config/rel_info.json'


app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
app.config["JWT_SECRET_KEY"] = "jwtkey"
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
class GetText(object):

    def __init__(self, file):
        self.file = pytesseract.image_to_string(Image.open(file))

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    email = data['email']
    if matcher.match("USER", name=username).first() != None:
        return 'Username already exists!', 400
    pw_hash = bcrypt.generate_password_hash(password).decode('utf8')
    create_user_node = f"CREATE (u:USER{{name:'{username}', password:'{pw_hash}', email:'{email}'}})"
    print(create_user_node)
    graph.run(create_user_node)
    response = {'message': 'User registration successful'}
    
    return response

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(data)
    username = data['username']
    password = data['password']
    match = matcher.match("USER", name=username).first()
    if match == None:
        return 'Username does not exist',400
    if bcrypt.check_password_hash(match['password'],password) == False:
        return 'Wrong password',400
    access_token = create_access_token(identity=username)

    return  {'access_token': access_token}

@app.route('/image', methods=['GET', 'POST'])
def get_image():
    file = request.files['file_from_react']
    
    textObject = GetText(file)
    print('TEXT OBJECT: ' + textObject.file)
    return {'text': textObject.file}

@app.route('/extract', methods=['POST'])
@jwt_required()
def relation_extraction():
    
    document = request.json['text']
    username = get_jwt_identity()
    concept_name = request.json['concept']
    private = request.json['private']
    print(private)
    print(document)
    docred_doc = text2docred_pipeline.preprocess(document)
    print('Formatted to DocRed ')
    
    PRED_THRESHOLD = 0.3
    preprocessor = LsrPreprocessor(rel2id_path=rel2id_path, word2id_path=word2id_path, ner2id_path=ner2id_path)
    postprocessor = LsrPostprocessor.from_file_paths(rel2id_path=rel2id_path, rel_info_path=rel_info_path,
                                                    pred_threshold=PRED_THRESHOLD)
    # Load model
    config = LsrConfig.from_pretrained('https://storage.googleapis.com/sgnlp/models/lsr/v2/config.json')
    #cuda or not
    model = LsrModel.from_pretrained('https://storage.googleapis.com/sgnlp/models/lsr/v2/pytorch_model.bin', config=config).to("cuda")
    model.eval()

    tensor_doc = preprocessor([docred_doc])
    output = model(**tensor_doc)

    result = postprocessor(output.prediction, [docred_doc])
    result = result[0]

    arr = result['document']
    entity_list = []
    for i in range(len(result['clusters'])):
        entity_idx = result['clusters'][i][0]
        newarr = arr[slice(entity_idx[0],entity_idx[1])]
        entity = '_'.join(newarr)
        entity_list.append(entity)

    rsarray = result['relations']
    newarr = rsarray.copy()
    newrel = []
    for i in newarr:
        i['object'] = entity_list[i['object_idx']]
        i['subject'] = entity_list[i['subject_idx']]
        arr = i['relation'].split(' ')
        newrs = '_'.join(arr)
        i['relation'] = newrs
        newrel.append(i)
    print(newrel)
    graph_query(graph,username,concept_name,private, document,entity_list,newrel)
    return 'hi'

if __name__ == '__main__':
    app.run(port=5000)