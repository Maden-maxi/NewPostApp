# New post app

### Clone `new-post-app`

Clone the `new-post-app` repository using git:

```
git clone https://github.com/Maden-maxi/NewPostApp.git
cd NewPostApp
```

### Install Dependencies

We have two kinds of dependencies in this project: tools and Angular framework code. The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [Node package manager][npm].
* We get the Angular code via `bower`, a [client-side code package manager][bower].
* In order to run the end-to-end tests, you will also need to have the
  [Java Development Kit (JDK)][jdk] installed on your machine. Check out the section on
  [end-to-end testing](#e2e-testing) for more info.
  
#### MongoDB
Also, you need install mongoDB on your local machine for working with data
Please, read install manual [Install MongoDB on linux](https://docs.mongodb.com/manual/administration/install-on-linux/)
Manual for windows users [Install MongoDB in Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`. After that, you should find out that you have
two new folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the Angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
`angular-seed` changes this location through the `.bowerrc` file. Putting it in the `app` folder
makes it easier to serve the files by a web server.*



### Run the Application

We have preconfigured the project with a simple development web server. The simplest way to start
this server is:

```
npm server
```

Now browse to the app at [`localhost:8080`][local-app-url].

