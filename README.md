test branch 1
test branch 2

![Friendly robot logo](logo.png)
# Anoixo: Grammatical Bible Search
[Anoixo](#why-anoixo) (a-NOIKS-oh [ə'nɔikso]) is a web app for finding morphological and syntactic constructions in the Bible in its original languages.

Try it out at http://anoixo.sheesania.com/!

## Background
Anoixo was developed at Taylor University.

- [Original project proposal with background, rationale, and a survey of existing morphological/syntactic search tools](https://docs.google.com/document/d/1tC8CPp7WmkOH8jjgBRM_YxbxWEMFS7oJpzKfHDsqlTA/edit?usp=sharing)
- [A list of use cases for this tool](https://docs.google.com/document/d/1QOQpY0kGr6Km8lhTpPEhFMSxMB0C4uTeNH45Kl_2SKg/edit?usp=sharing)

## Why "Anoixo"?
ἀνοίξω means "I will open" in Koine Greek. The root ἀνοίγω appears in verses like Matthew 7:7 "Ask and it will be given to you, seek and you will find, knock and it will be opened [ἀνοιγήσεται] for you."

## Setup for development
### Database
Install the BaseX XML database.

```
sudo apt-get install basex
```

Download the Nestle 1904 Lowfat treebank (for the Greek New Testament).

```
git clone https://github.com/biblicalhumanities/greek-new-testament
```

Next you'll load it into BaseX. Create a file called `setup.bxs` (you can name it anything really, but make sure it ends
with `.bxs`) in the same directory and paste in this code:

```
<commands>
  <set option='language'>el</set>
  <create-db name='nestle1904lowfat'>
    greek-new-testament/syntax-trees/nestle1904-lowfat/xml/nestle1904lowfat.xml
  </create-db>
  <open name='nestle1904lowfat'/>
  <xquery>
    for $word at $pos in
      for $ordered_word in //w
      order by $ordered_word/@n
      return $ordered_word
    return insert node attribute {'position'}{$pos} into $word
  </xquery>
  <close/>
</commands>
```

This code will create a BaseX database called `nestle1904lowfat` and insert position markers, which are needed for
queries that restrict the number of words allowed between search terms. Run it with:

```
basex setup.bxs
```

Now start the BaseX server!

```
basexserver
```

By default, it will listen on `localhost:1984` with username `admin` and password `admin`. See the [BaseX documentation for more server options](http://docs.basex.org/wiki/Command-Line_Options#Server).

### Server
The Anoixo server requires Python 3.8.0+ (for asyncio-related functionality), which may not be the latest version in your Linux distribution's default repository. You can check your currently installed version with `python3 -V`. On Ubuntu, you can install Python 3.8 alongside the current default python3 with `sudo apt install python3.8`, then access it at `/usr/bin/python3.8`.

Once you have Python 3.8 installed, clone the repository.

```
git clone https://github.com/sheesania/anoixo.git
```

Head to the server folder.

```
cd anoixo/server/anoixo-server
```

Now set up a virtual environment. If your `python3` is 3.8.0 or later, you can just run `python3 -m venv venv`. Otherwise, use a Python 3.8.0+ binary to run this command. For example:

```
/usr/bin/python3.8 -m venv venv
```

Then install the requirements.

```
source venv/bin/activate
pip install -r requirements.txt
```

Edit the BaseX configuration in `text_providers/Nestle1904LowfatProvider_Config.py` to match how you set up your server.

Rename `translation_providers/ESVApiTranslationProvider_Secret_sample.py` to just `ESVApiTranslationProvider_Secret.py` and edit it with your [ESV API](https://api.esv.org/) key.

Now run the development server!

```
venv/bin/python app.py
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

If you also want to deploy to a production server, then create a `anoixo-prod.yaml` as well based on `sample_anoixo-prod.yaml`. Otherwise, edit `hosts.yaml` in the top-level `ansible` directory and remove or comment out the `production` group.

Back in the top-level `ansible` directory, run the playbook:

```
ansible-playbook -i hosts.yaml playbook.yaml -K
```

It should prompt you for the sudo password for the user you are logging into the host as, then run the playbook. After it's finished, you should be able to browse to your remote host in a web browser and see Anoixo up and running!

If you'd like to update your deployment to the current version of the master branch, just run the plays tagged `update`. Warning - this will not take into account any changes made to other parts of the playbook!

```
ansible-playbook -i hosts.yaml playbook.yaml --tags "update" -K
```
