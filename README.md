# Anoixo: Grammatical Bible Search
[Anoixo](#why-anoixo) (a-NOIKS-oh [ə'nɔikso]) is a web app for finding morphological and syntactic constructions in the Bible in its original languages.

Currently under development at Taylor University.

- [Original project proposal with background, rationale, and a survey of existing morphological/syntactic search tools](https://docs.google.com/document/d/1tC8CPp7WmkOH8jjgBRM_YxbxWEMFS7oJpzKfHDsqlTA/edit?usp=sharing)
- [A list of use cases for this tool](https://docs.google.com/document/d/1QOQpY0kGr6Km8lhTpPEhFMSxMB0C4uTeNH45Kl_2SKg/edit?usp=sharing)

## Setup for development
### Database
Install the BaseX XML database.

```
sudo apt-get install basex
```

Download the Nestle 1904 Lowfat treebank (for the Greek New Testament) and load it into BaseX.

```
git clone https://github.com/biblicalhumanities/greek-new-testament
cp greek-new-testament/syntax-trees/nestle1904-lowfat/xml/nestle1904lowfat.xml nestle1904lowfat.xml
basex -c "SET LANGUAGE el; CREATE DB nestle1904lowfat nestle1904lowfat.xml"
rm -r greek-new-testament
```

Start the BaseX server.

```
basexserver
```

By default, it will listen on `localhost:1984` with username `admin` and password `admin`. See the [BaseX documentation for more server options](http://docs.basex.org/wiki/Command-Line_Options#Server).

### Server
Clone the repository.

```
git clone https://github.com/sheesania/anoixo.git
```

Set up a Python virtual environment and install the requirements.

```
cd anoixo/server/anoixo-server
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

Edit the BaseX configuration in `Nestle1904LowfatProvider_Config.py` to match how you set up your server.

Now run the development server!

```
python3 app.py
```

### Client
Change to the client directory and install its dependencies.

```
cd ../../client/anoixo-client
npm install
```

Now start the development server.

```
npm start
```

By default, it expects to find the API server at `http://localhost:5000/`.

## Why "Anoixo"?
ἀνοίξω means "I will open" in Koine Greek. The root ἀνοίγω appears in verses like Matthew 7:7 "Ask and it will be given to you, seek and you will find, knock and it will be opened [ἀνοιγήσεται] for you."
