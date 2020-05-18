import time
from flask import g, jsonify, make_response, request, Flask
from flask_cors import CORS
from flask_limiter import Limiter
from typing import Any, Dict, Union
from translation_providers.ESVApiTranslationProvider import ESVApiTranslationProvider
from text_providers.Nestle1904LowfatProvider import Nestle1904LowfatProvider
from text_providers.TextProvider import TextProvider
from werkzeug.http import HTTP_STATUS_CODES
from AnoixoError import AnoixoError, ProbableBugError, TooManyRequestsError
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


def _get_address_for_request():
    # If the app is behind a Nginx proxy, Nginx will set a 'X-Real-Ip' header with the original remote address that we
    # should use (at least in the default Nginx configuration for Anoixo present in the ansible directory).
    # If that header is not present, we are presumably not behind a proxy and can just use the remote address.
    return request.headers.get('X-Real-Ip', request.remote_addr)


limiter = Limiter(
    app,
    key_func=_get_address_for_request
)


@app.errorhandler(AnoixoError)
def handle_anoixo_error(error: AnoixoError):
    return make_response(jsonify({
        'error': HTTP_STATUS_CODES[error.http_error_code],
        'description': error.message,
        'friendlyErrorMessage': error.get_friendly_error_message()
    }), error.http_error_code)


@app.errorhandler(429)
def handle_rate_limit_exceeded(e):
    return handle_anoixo_error(TooManyRequestsError(f'Rate limit exceeded: {e.description}', http_error_code=429))


@app.before_request
def get_request_start_time():
    g.start_time = time.time()


@app.after_request
def log_request(response):
    source_address = _get_address_for_request()
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
        raise ProbableBugError('Request does not contain a JSON body', 400)

    def on_parsing_error(message: str):
        raise ProbableBugError(f'Error parsing JSON: {message}', 400)

    return TextQuery(json, on_parsing_error)


def _get_text_provider(text_id: str) -> TextProvider:
    if text_id not in text_providers:
        raise ProbableBugError(f'Text provider with id \'{text_id}\' was not found. '
                               f'Available texts: {" ".join(text_providers.keys())}', 404)
    return text_providers[text_id]


@app.route('/api/text/<string:text_id>', methods=['POST'])
@limiter.limit('1000/day;200/hour;12/minute')
def text_query(text_id: str):
    text_provider = _get_text_provider(text_id)

    # In the future, a particular translation could be requested in the query
    translation_provider = translation_providers['esv']

    query = _json_to_text_query(request.json)
    query_result = text_provider.text_query(query)
    translation_provider.add_translations(query_result)
    return jsonify(query_result.serialize())


@app.route('/api/text/<string:text_id>/attribute/<string:attribute_id>', methods=['GET'])
def attribute_query(text_id: str, attribute_id: str):
    text_provider = _get_text_provider(text_id)
    query_result = text_provider.attribute_query(attribute_id)
    return jsonify(query_result)


if __name__ == '__main__':
    app.run(debug=True)
