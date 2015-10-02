# Installation 
1. Get into project root  
2. ``npm i gulp -g``  
3. ``npm i`` 
4. ``cd semantic``  
5. ``gulp build``  
6. ``cd ..``  
7. ``npm start``  
  
When in production, install with production flag instead:  
``npm i -production``  

When in development, you can use configured webpack-dev-server:  
``npm run wds``  
And access it on **localhost:8080/webpack-dev-server/**  

For example database seeding use:
``npm run seed``  

To make a registered user an admin through the console, execute adminize script with user email as parameter.  
Example:  
``npm run adminize -- dbettini@extensionengine.com``



