from flask import Flask, abort, jsonify, make_response, request
from flask_cors import cross_origin
from typing import Any, Dict, Union
from TextProvider import TextProvider, ProviderError
from Nestle1904LowfatProvider import Nestle1904LowfatProvider
from TextQuery import TextQuery

app = Flask(__name__)

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


def json_to_text_query(json: Union[Dict[Any, Any], None]) -> TextQuery:
    if json is None:
        abort(400, 'Request does not contain a JSON body')

    def on_error(message: str):
        abort(400, f'Error parsing JSON: {message}')
    return TextQuery(json, on_error)


@app.route('/text/<string:text_id>', methods=['POST'])
@cross_origin()
def text_query(text_id: str):
    if text_id not in text_providers:
        abort(404, f'Text provider with id \'{text_id}\' was not found. ' 
                   f'Available texts: {" ".join(text_providers.keys())}')
    provider = text_providers[text_id]

    try:
        query = json_to_text_query(request.json)
        print(query)

        result = provider.get_text_for_reference(request.json['reference'])
        return jsonify({'text': result})
    except ProviderError as err:
        abort(500, err.message)


if __name__ == '__main__':
    app.run(debug=True)
