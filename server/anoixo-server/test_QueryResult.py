from QueryResult import QueryResult


def test_serialize_pagination():
    query_result = QueryResult([], 2, 5, lambda x: None)
    serialized = query_result.serialize()
    assert serialized['pagination'] == {
        'page': 2,
        'totalPages': 5,
    }
