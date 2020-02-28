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
cd greek-new-testament/syntax-trees/nestle1904-lowfat/xml
basex -c "SET LANGUAGE el; CREATE DB nestle1904lowfat nestle1904lowfat.xml"
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

If you want to run the tests:

```
venv/bin/python -m pytest
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

By default, it expects to find the API server at `http://localhost:5000/`. You can edit `src/AppSettings.ts` in the client folder if you need to change this configuration.

If you want to run the tests:

```
npm test
```

## Deployment
Anoixo supports automatic deployment using [Ansible](https://www.ansible.com/). The included playbook has been tested on an Ubuntu 18.04 virtual machine.

To run the automatic deployment, clone the repository and head to the `ansible` folder. Under `host_vars`, open `sample_anoixo-staging.yaml` and edit it with the information for your host and what passwords you would like to use. (If you want to use key-based login like in the sample, you'll also need to put a private key `id_rsa` that's authorized for logging into your remote host in the `ansible` directory.) Then rename the file to `anoixo-staging.yaml`.

Back in the top-level `ansible` directory, run the playbook:

```
ansible-playbook -i hosts.yaml playbook.yaml -K
```

It should prompt you for the sudo password for the user you are logging into the host as, then run the playbook. After it's finished, you should be able to browse to your remote host in a web browser and see Anoixo up and running!

If you'd like to update your deployment to the current version of the master branch, just run the plays tagged `update`:

```
ansible-playbook -i hosts.yaml playbook.yaml --tags "update" -K
```

## Why "Anoixo"?
ἀνοίξω means "I will open" in Koine Greek. The root ἀνοίγω appears in verses like Matthew 7:7 "Ask and it will be given to you, seek and you will find, knock and it will be opened [ἀνοιγήσεται] for you."
