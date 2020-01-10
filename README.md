# Anoixo: Grammatical Bible Search
Anoixo (a-NOIKS-oh [ə'nɔikso]) is a web app for finding morphological and syntactic constructions in the Bible in its original languages.

Currently under development at Taylor University.

[Original proposal with background, rationale, and an overview of existing morphological/syntactic search tools](https://docs.google.com/document/d/1tC8CPp7WmkOH8jjgBRM_YxbxWEMFS7oJpzKfHDsqlTA/edit?usp=sharing)

## Setup
### Environment
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
