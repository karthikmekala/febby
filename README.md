<!-- Generated by documentation.js. Update this documentation by updating the source code. -->
## Febby

Febby - A Configuration based NodeJs Framework on top of ExpressJs.
Create Production Ready REST API's in minutes.
Build For JSON APIs.
Configuration based REST with custom Route support and Method specific Middleware configuration
### Table of Contents

-   [Febby](#febby)
    -   [setConfig](#setconfig)
    -   [setModels](#setmodels)
    -   [setRoutes](#setroutes)
    -   [getPort](#getport)
    -   [getEnv](#getenv)
    -   [runMiddleware](#runmiddleware)
    -   [getModels](#getmodels)
    -   [getApp](#getapp)
-   [{{https://github.com/febbyjs/}} -find examples here](#httpsgithubcomfebbyjs--find-examples-here)
-   [Query](#query)
    -   [findById](#findbyid)
    -   [findOne](#findone)
    -   [find](#find)
    -   [findRef](#findref)
    -   [save](#save)
    -   [update](#update)
    -   [increment](#increment)
    -   [distinct](#distinct)
    -   [remove](#remove)
    -   [count](#count)


**Examples**

```javascript
npm install febby --save
```

```javascript
const Febby = require('febby');
```

```javascript
const febby = new Febby();
```

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Returns Febby Object

### setConfig

set Config Object before calling febby.createApp()

**Parameters**

-   `config` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

**Examples**

```javascript
let config = {
 // Port number on which your app going to listen, default PORT number is 5678
 // You can set PORT via Commandline while starting app `PORT=8000 node app.js `
 // it will take process.env.PORT by default if not found then it will take Port from config object
 'port': 3000,
 // hostname of app 
 'host': '127.0.0.1',
 // application environment
 'env': 'development',
 // Base path for models
 'restBasePath': '/api/v1/model',
 // Route Path for user defined Routes
 'routeBasePath': '/api/v1/route',
 // MongoDB configuration
 'db': {
     // Default maximum number of records while querying , if limit doesn't pass.
   'limit': 30,
     // mongodb url
   'url': 'mongodb://localhost:27017/test'
 },
 // body-parser maximum body object size 
 'jsonParserSize': '100kb'
};
module.exports = config;
//config/index.js
|- config
         / index.js
```

```javascript
let config = require('./config');
 //set configuration before calling createApp method.
febby.setConfig(config);
```

### setModels

Set Model Object

**Parameters**

-   `models` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

**Examples**

```javascript
let hasPermission = require('./middlewares/hasPermission');
let ValidateUser = (req, res, next, models) => {
     if(!req.query.user_id){
         return next(new Error('missing user_id in query'))
      }
     return next();
  }
// middlewares are configured in middlewares folder
// Remember app specific middleware functions are different and method specific middleware functions are different
// App specific middlewares can't be used in method specific and vice versa.
// method specific middleware has four arguments Request , Response, Models, Cb there is no next function, these will run route and method specific
// don't forget to pass empty callback once your validation run in middleware.
// if you didn't pass it will be in block state so careful and pass the Cb 
// App specific midlleware has three arguments Request , Response , Next there is no models , these will run for every request
|- middlewares/
             / hasPermission.js
             
let user = {
    methods: {
        all: true,
         //if all set to true CRUD Operations enabled on this Model.
         // if all set false then it will enable user to define which methods need to be enabled
        middlewares: [ ValidateUser ],
         // Array of functions whcih will execute before your CRUD methods , make sure midllewares config properly.
         //below is method name and method configuration
        get: {
            isEnabled: true,
             // GET method will be enabled if you made isEnabled =  true, if false then GET method is disabled on this model
            middlewares: []
             // Here Array of Functions specific to GET method , these methods will exexute before Making Database call
        },
        post: {
            isEnabled: true,
            //empty array or make sure remove the midddleware key 
            // if you don't want to apply
            middlewares: [ hasPermission ]
        },
        put: {
            isEnabled: true,
        },
        delete: {
            //if you wish to block delete method you can make isEnabled = false or just remove delete key and object
            isEnabled: false
        }
    },
     // it is mongoose schema,
     // we are using mongoose internally so we just use mongoose schema to validate input data
     // by default created_at , updated_at keys of type Date is enabled to each and every model
     // date and time of document creation and updations are automatically updated  
    schema: {
        username: {
            type: String,
            required: true,
            unique: true
        },
        firstname: {
            type: String
        },
        lastname: {
            type: String
        },
        email: {
            type: String,
            unique: true
        }
    }
};
module.exports = user;
// Export User Object
|- models/user.js
```

```javascript
const user = require('./user');
  module.exports = {
     'user': user
};
// Export all models configuration as single Object
|- models/index.js
```

```javascript
let models = require('./models');

febby.setModels(models);
// set models before calling febby.createApp()
```

### setRoutes

Set Routes Object

**Parameters**

-   `routes` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

**Examples**

```javascript
For Every Route Handler will have following arguments
 {Request} request - Express Request Object
 {Response} response - Express Response Object
 {NextFunction} next - Express next function
 {Models} models - configured models     
 Below is just a sample example. 

|- routes/
         /handlers/
                 /login.js        
let loginHandler = (request, response, next, models) => { 
     let username = request.body.username
     let password = request.body.password
     // will handle user login logic here
     models.user.findOne({'username':username},{}).
         then((doc)=>{
         // validate the user and respond
         }).catch((error)=>{
             next(error);
         })
     };

module.exports = loginHandler;
// Export loginHandler Function
|- routes/handlers/user.js
```

```javascript
const loginHandler = require('./handlers/login');
 let ValidateUser = require('./middlewares/validateUser');
 let routes =  {
     '/login': {
         'method': 'POST',
         'middlewares': [ ValidateUser ],
         'handler': loginHandler
     }
 };
module.exports = routes;
// Export all Route configuration as single Object
|- routes/index.js
```

```javascript
let routes = require('./routes');

febby.setRoutes(routes);
// set routes before calling febby.createApp()
```

### getPort

Returns App port

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** port number

### getEnv

Returns App Environment

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** environment

### runMiddleware

Provides ability to run configure middleware functions .
Its is same as ExpressJs Middleware Processing.

**Parameters**

-   `middlewareFunc` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** 

**Examples**

```javascript
Simple Logger

const logger = (req, res, next) => {
     console.info(req.method+' : '+req.url);
     next();
}

febby.runMiddleware(logger);

** Make Sure You must pass request object to next by calling next callback
```

### getModels

Returns Defined Models as an Object

**Examples**

```javascript
Getting Models of an Application , Model names are always Plural

let models = febby.getModels();

models.users.findOne({'username':'vanku'},{}).then((user)=>{
//Handle user logic
}).catch((err)=>{
//handle error
})

now you can use models obejct throught application
```

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** returns Object of models

### getApp

Returns Express App Object so that user can do what ever things he want

**Examples**

```javascript
// Returns Express App Object
let app = febby.getApp();

app.use((req, res, next) => {
     console.info(req.method+' : '+req.url);
     next();
})
// already 404 handled inside of framework so dont handle 404 here, after getting app object.
```

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** App Obejct

## {{https&#x3A;//github.com/febbyjs/}} -find examples here

creates An Express App

**Examples**

```javascript
// make sure you configured models and config object before calling this method

const Febby = require('febby');

const config= require('./config');
const models = require('./models');
const routes = require('./routes');

 const febby = new Febby();

febby.setConfig(config);
febby.setModels(models);
febby.setRoutes(routes);

febby.createApp();
```

## Query

Here is the supported methods findById, findOne, find, findRef, save, update, increment, distinct, count, remove

**Parameters**

-   `collection`  

### findById

findById query to get a document based on id field

**Parameters**

-   `id` **ObjectId** mongodb ObjectId
-   `selectionFields` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object represents required fields and non required fields .ex: {firstname:1,lastname:0}

**Examples**

```javascript
// modelname is pluralized 
// when ever you are using models , model names are always plurals.
let id  = '59f5edd03849b92e40fadf7c';
let selectedFieldsObj = {'username':1,'lastname':0};
// key with value 0 is omitted 
// key with value 1 is fetched 
models.users.findById(id,selectedFieldsObj).then((doc)=>{
     log(doc);
}).catch((err)=>{
     log(err);
})
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;([Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))>** Collection document if found,
or an error if rejected.

### findOne

findOne query to get a document based given query

**Parameters**

-   `query` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** query object conatins user mongodb query object. ex: {'firstname':'vasu'}
-   `selectionFields` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object represents required fields and non required fields .ex: {firstname:1,lastname:0}

**Examples**

```javascript
// modelname is pluralized 
// when ever you are using models , model names are always plurals.
let query  = {'username':'vasuvanka'};
let selectedFieldsObj = {'username':1,'lastname':0};
// key with value 0 is omitted 
// key with value 1 is fetched 
models.users.findOne(query,selectedFieldsObj).then((doc)=>{
     log(doc);
}).catch((err)=>{
     log(err);
})
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;([Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))>** Collection document if found,
or an error if rejected.

### find

find query to get the records of a collection by given mongodb query

**Parameters**

-   `query` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** mongodb query
-   `selectionFields` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** selection object
-   `sortBy` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** sort object. ex: {createdAt:-1}
-   `skip` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** skip number of records , default value is 0
-   `limit` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** limit the result of your query by default limit is set to 30

**Examples**

```javascript
// modelname is pluralized 
// when ever you are using models , model names are always plurals.
let query  = {'username':'vasuvanka'};
let selectedFieldsObj = {'username':1,'lastname':0};
let skip = 0;  // skip number of records
let limit = 10; //0 to get all queried records
let sortBy = {'firstname':1}; // -1 for descending order
// key with value 0 is omitted 
// key with value 1 is fetched 
models.users.find(query, selectedFieldsObj, sortBy, skip, limit).then((doc)=>{
     log(doc);
}).catch((err)=>{
     log(err);
})
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;([Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))>** Collection documents if found,
or an error if rejected.

### findRef

findRef query to get refrenced documents from Other collection

**Parameters**

-   `query` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** query object
-   `selectionFields` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** selection object for query
-   `refObj` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** ref object contains an array of selected fields of Other collection .
    ex: refObj = {'collection_key1':['name','email'],'collection_key2':['name','email']...}
-   `sortBy` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** sortby Object to filter result
-   `skip` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** skip number of records , by deafult it is 0
-   `limit` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** limit the result of your query by default limit is set to 30

**Examples**

```javascript
// modelname is pluralized 
// when ever you are using models , model names are always plurals.
let query  = {'username':'vasuvanka'};
let selectedFieldsObj = {'username':1,'lastname':0};
let skip = 0;  // skip number of records
let limit = 10; //0 to get all queried records
let sortBy = {'firstname':1}; // -1 for descending order
// key with value 0 is omitted 
// key with value 1 is fetched 
let refObj = {'user_id':['username','firstname']}
// needed full document of other collection then just pass empty array
// refObj = {'user_id':[]}
// if i need two documents from different collections then 
// refObj = {'user_id':[],'username':[]}
// ref mongoose for schema configuration
models.users.findRef(query, selectedFieldsObj, refObj, sortBy, skip, limit).then((doc)=>{
     log(doc);
}).catch((err)=>{
     log(err);
})
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;([Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))>** Collection documents if found,
or an error if rejected.

### save

Save the data.

**Parameters**

-   `data` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** json object

**Examples**

```javascript
// modelname is pluralized 
// when ever you are using models , model names are always plurals.
let data  = {'username':'vasuvanka','firstname':'vasu','lastname':'vanka'};
models.users.save(data).then((doc)=>{
     log(doc);
}).catch((err)=>{
     log(err);
})
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;([Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))>** document if saved,
or an error if rejected.

### update

Update matched Document(s);

**Parameters**

-   `query` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** query object
-   `data` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** data object
-   `isMultiple` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** if true it will update to all matched documents, if false only update to first matched document, default value is false
-   `isUpsert` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** if true it will create new record if none of the records matched .default value is false

**Examples**

```javascript
// modelname is pluralized 
// when ever you are using models , model names are always plurals.
let query  = {'username':'vasuvanka'};
let data = {'firstname':'vicky','lastname':'martin'};
let isMultiple = false; // update applied to only first matched document , if true then applied all matched documents
let upsert = true; // if true then there is document matched then it will create a document , if false no record created
 models.users.update(query, data, isMultiple, upsert).then((doc)=>{
     log(doc);
}).catch((err)=>{
     log(err);
})
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;([Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))>** document status if updated,
or an error if rejected.

### increment

Increment/Decrement a number by +/- any number. ex: 10 or -10

**Parameters**

-   `query` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** query object
-   `data` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** data object
-   `isMultiple` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** if true it will update to all matched documents, if false only update to first matched document, default value is false
-   `isUpsert` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** if true it will create new record if none of the records matched .default value is false

**Examples**

```javascript
// modelname is pluralized 
// when ever you are using models , model names are always plurals.
let query  = {'username':'vasuvanka'};
let data = {'amount':1};
let isMultiple = false; // update applied to only first matched document , if true then applied all matched documents
let upsert = true; // if true then there is document matched then it will create a document , if false no record created
// will increment amount of matched document field by +1
 models.users.increment(query, data, isMultiple, upsert).then((doc)=>{
     log(doc);
}).catch((err)=>{
     log(err);
})
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;([Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))>** document status if updated,
or an error if rejected.

### distinct

Return all distnict field values

**Parameters**

-   `query` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** query object
-   `field` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** field or key name

**Examples**

```javascript
// modelname is pluralized 
// when ever you are using models , model names are always plurals.
let query  = {'username':'vasuvanka'};
let field = "firstname";
 models.users.distinct(query, field).then((doc)=>{
     log(doc);
}).catch((err)=>{
     log(err);
})
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;([Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))>** documents if found,
or an error if rejected.

### remove

Remove all matched documents

**Parameters**

-   `query` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** query object

**Examples**

```javascript
// modelname is pluralized 
// when ever you are using models , model names are always plurals.
let query  = {'username':'vasuvanka'};
 models.users.remove(query).then((doc)=>{
     log(doc);
}).catch((err)=>{
     log(err);
})
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;([Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))>** document status if removed,
or an error if rejected.

### count

Count matched documents

**Parameters**

-   `query` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** query object

**Examples**

```javascript
// modelname is pluralized 
// when ever you are using models , model names are always plurals.
let query  = {'username':'vasuvanka'};
 models.users.count(query).then((doc)=>{
     log(doc);
}).catch((err)=>{
     log(err);
})
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;([Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))>** count of matched record query,
or an error if rejected.
