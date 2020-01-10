from flask import Flask, abort, jsonify, make_response
from typing import Dict
from TextProvider import TextProvider
from Nestle1904LowfatProvider import Nestle1904LowfatProvider

app = Flask(__name__)

text_providers: Dict[str, TextProvider] = {
    'nlf': Nestle1904LowfatProvider()
}


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found', 'description': error.description}),
                         404)


@app.route('/text/<string:text_id>', methods=['POST'])
def query(text_id: str):
    if text_id not in text_providers:
        abort(404, f'Text provider with id \'{text_id}\' was not found. ' 
                   f'Available texts: {" ".join(text_providers.keys())}')
    provider = text_providers[text_id]
    return jsonify({'name': provider.get_provided_text_name(),
                    'source': provider.get_source_name()})


if __name__ == '__main__':
    app.run(debug=True)
