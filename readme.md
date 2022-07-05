# Location Search

This is a simple search engine that allows you to search for locations by name. Supports incomplete text searches.
<br>
<br>


## Setup
To setup this application, first clone the repository to your project directory.

```bash
➜ git clone https://github.com/NathBabs/location-search.git
```

cd into project directory    
    
```bash
➜ cd location-search
```

Then, run the following command to install the dependencies.

```bash
➜ npm install
```
Create a `.env` file in the project directory and add the following lines to it.

```bash
PORT=3200
MONGODB_URI=mongodb+srv://new_user:yZe081HKjPvWhMZa@cluster0.xwnu3.mongodb.net/?retryWrites=true&w=majority
```

**_NOTE_** : This mongoDB URI is specific to this project only. And has limited access to the database.
<br>

next run the following command to start the server.

```bash
➜ npm run dev
```