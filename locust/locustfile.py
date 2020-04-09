from locust import HttpLocust, task, between


class AnoixoAPIUser(HttpLocust):
    wait_time = between(2, 10)

    @task(5)
    def tiny_query(self):
        self.client.post('/api/text/nlf', json={
            "sequences": [
                [
                    {
                        "attributes": {
                            "lemma": "ἀγανάκτησις"
                        }
                    }
                ]
            ]
        })

    @task(10)
    def medium_query(self):
        self.client.post('/api/text/nlf', json={
            "sequences": [
                [
                    {
                        "attributes": {
                            "mood": "participle",
                            "tense": "aorist"
                        },
                        "link": {
                            "allowedWordsBetween": 0
                        }
                    },
                    {
                        "attributes": {
                            "mood": "imperative",
                            "tense": "aorist"
                        }
                    }
                ]
            ]
        })

    @task(1)
    def big_query(self):
        self.client.post('/api/text/nlf', json={
            "sequences": [
                [
                    {
                        "attributes": {
                            "mood": "participle",
                            "tense": "aorist"
                        }
                    }
                ]
            ]
        })
