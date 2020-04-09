# Load testing
This folder contains tools for load testing Anoixo using [Locust](https://locust.io/). To run a load test...

## Set up Locust
- Create a Python venv in this folder (`python3 -m venv venv`) and activate it (`source venv/bin/activate`).
- Install Locust. In theory, you should just be able to run `pip3 install locust` while your venv is activated. However, I did not have any luck with the latest stable version of Locust and had to use the bleeding edge version from their git repository: `pip3 install -e git://github.com/locustio/locust.git@master#egg=locustio`. More information available on Locust's [installation page](https://docs.locust.io/en/stable/installation.html).

## Prepare the Anoixo server
You can simply run a load test against the regular Anoixo server, but if you have restrictions on your ESV API key, you may quickly run out of API quota. If you want to avoid hitting the actual ESV API server, follow these instructions to replace the request code with a mock version on the Anoixo server you'll run your load test against.

- The relevant file in the repository is `server/anoixo-server/translation_providers_ESVApiTranslationProvider.py`. Find it and open it for editing.

- Find these lines where the actual request is made and the JSON response is grabbed:
  ```
  resp = await session.get('https://api.esv.org/v3/passage/text',
                           params={'q': query, **self.DEFAULT_REQUEST_PARAMS})
  json = await resp.json()
  ```

- Comment them out and replace them with:
  ```
  number_of_verses = len(chunk_verse_queries)
  from time import sleep
  sleep(0.004 * number_of_verses)
  json = {
    'passages': ['verse text' for _ in range(number_of_verses)]
  }
  ```
  This code sleeps for a number of milliseconds to imitate the behavior of a request to the ESV API waiting for a response, then returns a JSON object with mock verse text. Obviously, the behavior will not be exactly the same as if a real request was made to the ESV API, but this approximates it.

- If your server is currently running, restart it.

## Run Locust
In the `locust` directory with your venv activated, run `locust`. It should spawn a server at `localhost:8089`. Navigate there in a browser and you should be able to configure the host where your Anoixo server is at, your desired number of users, the hatch rate, and so forth, and then run and view the results of a load test in Locust's interface.