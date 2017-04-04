# 📁  A STATIC SITE MAKER

## Webpack / Gulp Build:

This SSG uses pug for templating - sass for styleeeing - JS grooveeeying. JS bundling is handled through webpack, all the other build automation is done with gulp. It creates a static site in another folder. WOW!!!!!!!

### Some fun stuff:
-  Use a JSON file to define variables that be used in SASS, JS, and even Templates! 🔮  - in this case its called... _vars.json  

### Commands you gotta run:
    
    # install dependencies
    npm install
    
    # Get Started by merging up your data files - in json format
    gulp merge-json

    # Run to compile files both handles by both gulp and webpack and launch web server with hot reload (gulp watch only)
    gulp
    
    # Bundle the js up for production
    npm run build

