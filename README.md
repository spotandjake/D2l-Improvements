# D2l-Improvements
This is a chrome extension that is built to overhaul d2l to act more like google classroom. It uses next.js with a custom router and injection script to stop the exuection of the sites script and overwrite it with the next site. While this app has generally been built against the d2l api, there are some parts that are specific to my Highschool schoolboard as such weather or not this extension works with your school board is hit or miss, but feel free to open an issue and I would be glad to help you out.


# Design
The extension uses Next.js static export with a custom built bundler and loader that eagerly prevents the execution of d2l's scripts and takes the page over with the custom version. 

### Archieve Notice
This project has been archieved as I no longer use d2l and as such I have no way to test the app, if anyone is interested in this project for their own purposes feel free to open an issue and I would be happy to help you onboard and awnser any questions.

