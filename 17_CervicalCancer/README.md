# IACR new project   

* Front website: ViteJS 
* CMS/backend: Strapi
* Interactive dataviz : Canviz - IACR

# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Deployment 

This is the main resource for deployment ViteJS: https://vitejs.dev/guide/static-deploy.html

### Heroku

This is a manual deployment. Folder 

#### Set up 

`# version change
$ git init
$ git add .
$ git commit -m "My site ready for deployment."

# creates a new app with a specified name
$ heroku apps:create example

# set buildpack for static sites
$ heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git
`
#### Deploy website

`
$ npm run build // see ./dist folder or path mentionned into static.json file located in the root
$ npm run preview // to check whether build is working
$ git push heroku main
`

Go to https://csu-iacr-vitejs.herokuapp.com/

### Surge

Surge is a simple, single-command web publishing. Publish HTML, CSS, and JS for free, without leaving the command line (https://surge.sh/).

* make sure surge is installed `npm install --global surge`
* create an account if not done `surge`
* to deploy, type `surge dist` (make sure base under vite.config.js is /)
* go to csu-iacr-vitejs.surge.sh

### Netlify 

On Netlify(https://www.netlify.com/), setup up a new project from GitHub with the following settings:

* Build Command: vite build or npm run build
* Publish directory: dist
* Hit the deploy button.
* Hosting URL: https://cocky-ritchie-c86454.netlify.app/

### Google firebase (not working yet)

Free plan is listed into this page: https://firebase.google.com/pricing?authuser=0
* Make sure you have firebase-tools installed (https://www.npmjs.com/package/firebase-tools)
* See firebase.json file or .firebasesrc file for infos
* After running `npm run build, deploy using the command `firebase deploy` (if firebase need to login, type `firebase login` and follow browser authentication)
* Hosting URL: https://csu-iacr-vitejs.web.app

### Github pages (not working yet)

Manual deployment is set under deploy.sh file, at the root of the project. See 'base' key under vite.config.js to set the public path. 

