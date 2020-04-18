import time
from flask import abort, g, jsonify, make_response, request, Flask
from flask_cors import CORS
from typing import Any, Dict, Union
from translation_providers.ESVApiTranslationProvider import ESVApiTranslationProvider
from text_providers.Nestle1904LowfatProvider import Nestle1904LowfatProvider
from text_providers.TextProvider import TextProvider
from AnoixoError import AnoixoError
from TextQuery import TextQuery
from translation_providers.TranslationProvider import TranslationProvider


app = Flask(__name__)
CORS(app)

text_providers: Dict[str, TextProvider] = {
    'nlf': Nestle1904LowfatProvider()
}
translation_providers: Dict[str, TranslationProvider] = {
    'esv': ESVApiTranslationProvider()
}


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found', 'description': error.description}),
                         404)


@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify({'error': 'Bad request', 'description': error.description}),
                         400)


@app.errorhandler(500)
def internal_error(error):
    return make_response(jsonify({'error': 'Internal server error',
                                  'description': error.description}),
                         500)


@app.before_request
def get_request_start_time():
    g.start_time = time.time()


@app.after_request
def log_request(response):
    source_address = request.headers.get('X-Real-Ip', request.remote_addr)
    exec_time = time.time() - g.start_time
    print(f'[{time.asctime()}] {source_address} {request.method} {request.path} {response.status_code}', flush=True)
    print(f'\tTime: {exec_time}', flush=True)
    print(f'\tRequest: {request.json}', flush=True)
    response_json = response.json
    if isinstance(response_json, list):
        response_log = f'<{len(response_json)} results>'
    else:
        response_log = response_json
    print(f'\tResponse: {response_log}', flush=True)
    return response


def _json_to_text_query(json: Union[Dict[Any, Any], None]) -> TextQuery:
    if json is None:
        abort(400, 'Request does not contain a JSON body')

    def on_parsing_error(message: str):
        abort(400, f'Error parsing JSON: {message}')
    return TextQuery(json, on_parsing_error)


def _get_text_provider(text_id: str) -> TextProvider:
    if text_id not in text_providers:
        abort(404, f'Text provider with id \'{text_id}\' was not found. ' 
                   f'Available texts: {" ".join(text_providers.keys())}')
    return text_providers[text_id]


@app.route('/api/text/<string:text_id>', methods=['POST'])
def text_query(text_id: str):
    text_provider = _get_text_provider(text_id)

    # In the future, a particular translation could be requested in the query
    translation_provider = translation_providers['esv']

    try:
        query = _json_to_text_query(request.json)
        query_result = text_provider.text_query(query)
        translation_provider.add_translations(query_result)
        return jsonify(query_result.serialize())
    except AnoixoError as err:
        abort(500, err.message)


@app.route('/api/text/<string:text_id>/attribute/<string:attribute_id>', methods=['GET'])
def attribute_query(text_id: str, attribute_id: str):
    text_provider = _get_text_provider(text_id)
    try:
        query_result = text_provider.attribute_query(attribute_id)
        return jsonify(query_result)
    except AnoixoError as err:
        abort(500, err.message)


if __name__ == '__main__':
    app.run(debug=True)
