from flask import abort, jsonify, make_response, request, Flask
from flask_cors import CORS
from typing import Any, Dict, Union
from Nestle1904LowfatProvider import Nestle1904LowfatProvider
from TextProvider import ProviderError, TextProvider
from TextQuery import TextQuery


app = Flask(__name__)
CORS(app)

text_providers: Dict[str, TextProvider] = {
    'nlf': Nestle1904LowfatProvider()
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


def _json_to_text_query(json: Union[Dict[Any, Any], None]) -> TextQuery:
    if json is None:
        abort(400, 'Request does not contain a JSON body')

    def on_parsing_error(message: str):
        abort(400, f'Error parsing JSON: {message}')
    return TextQuery(json, on_parsing_error)


@app.route('/api/text/<string:text_id>', methods=['POST'])
def text_query(text_id: str):
    if text_id not in text_providers:
        abort(404, f'Text provider with id \'{text_id}\' was not found. ' 
                   f'Available texts: {" ".join(text_providers.keys())}')
    provider = text_providers[text_id]

    try:
        if 'reference' in request.json:
            return jsonify({'text': provider.get_text_for_reference(request.json['reference'])})
        query = _json_to_text_query(request.json)
        query_result = provider.text_query(query)
        return jsonify(query_result.serialize())
    except ProviderError as err:
        abort(500, err.message)


if __name__ == '__main__':
    app.run(debug=True)
