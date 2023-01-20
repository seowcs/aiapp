from flask import Flask, request
from flask_cors import CORS
import pytesseract
from PIL import Image
from text_to_docred import TextInputToDocredPipeline
from sgnlp.models.lsr import LsrModel, LsrConfig, LsrPreprocessor, LsrPostprocessor
from py2neo import Graph
from graphdb import graph_query
graph = Graph("bolt://54.173.227.28:7687", auth=("neo4j", "purpose-accessories-crowds"))
text2docred_pipeline = TextInputToDocredPipeline()

user_label = 'User1'
concept_label = 'Concept1'
rel2id_path = './model_config/rel2id.json'
word2id_path = './model_config/word2id.json'
ner2id_path = './model_config/ner2id.json'
rel_info_path = './model_config/rel_info.json'


app = Flask(__name__)
CORS(app)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
class GetText(object):

    def __init__(self, file):
        self.file = pytesseract.image_to_string(Image.open(file))

@app.route('/image', methods=['GET', 'POST'])
def get_image():
    file = request.files['file_from_react']
    
    textObject = GetText(file)
    print('TEXT OBJECT: ' + textObject.file)
    return {'text': textObject.file}

@app.route('/extract', methods=['POST'])
def relation_extraction():
    document = request.json['text']
    print(document)
    docred_doc = text2docred_pipeline.preprocess(document)
    print('Formatted to DocRed ')
    
    PRED_THRESHOLD = 0.3
    preprocessor = LsrPreprocessor(rel2id_path=rel2id_path, word2id_path=word2id_path, ner2id_path=ner2id_path)
    postprocessor = LsrPostprocessor.from_file_paths(rel2id_path=rel2id_path, rel_info_path=rel_info_path,
                                                    pred_threshold=PRED_THRESHOLD)
    # Load model
    config = LsrConfig.from_pretrained('https://storage.googleapis.com/sgnlp/models/lsr/v2/config.json')
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
    graph_query(graph,user_label,concept_label,entity_list,newrel)
    return 'hi'

if __name__ == '__main__':
    app.run(host='0.0.0.0')