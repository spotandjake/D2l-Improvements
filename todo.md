+ Add in the other stream sections
  + Make the stream content update
  + Content
    + Improve Document Viewer
  + Discussions
  + Assignments
    + Add in feedback
    + Add in hand in spot
      + Submit
    + Add in viewing for older hand in files
    + try to get handout date not just hand in date
    + Rubric holder
    + Any Related Materials Viewer
  + Quizzes
+ Add in notifications, Alerts, Email
+ Add Aside
  + Make Aside Buttons Work
+ Add Support for more pages
  + My Portfolio
  + ClassList
  + Grades
  + Notifications
  + Email
  + Messages
  + Calendar
  + Settings
    + D2l Settings
      + Account Settings
    + Extension Settings
      + button to turn extension off
      + Theme Options
  + Etc.
+ Improve Current Features
  + Fetch Teacher Info For Each Class On Class page
  + Find Latest Google Meet Info For Each Page
  + Fix Fetching of classroom image it errors sometimes
  + Make Notification Alert UI use a json route
  + Allow drag and drop sorting of class order
  + add more sorting options
  + Improve main app class
    + make use of history.pushState() for seamless single page navigation and reload recovery.
  + Add better interaction between google products like google meet and d2l.
  + Add Schedule View for Stream
+ Try to get some users
+ Add widgets
  + Add calendar widget to stream
+ Try To Use Api Routes That Give Raw JSON data instead of interacting with any routes returning HTML, try to move away from needing to be an extension.
+ Fix everything marked with TODO:

# Version 2.0 ideas
+ Move To Using Gulp Completely
+ Figure Out Why Gulp Refuses to Close
+ FrameWorks
  + Use Blocker Script to block all d2l requests that do not start with ?extension_view=0
    + This will allow us to use normal nextjs and avoid need for blocking d2l scripts
    + The extension_view=0 is there so we can fetch data from the page such as the xref auth token, and stuff from the data attribute in the body, this will hopefully be something we can grow out of with further development.
  + We will make use of typescript
    + this will allow us to make an api for interacting with the d2l system that is well typed making development easier
  + We will make use of scss because it is better than css and can reduce codesize
+ Design
  + We will design each component as components in figma and then move each component individually to nextjs
  + Components
  + Pages
    + Classes
    + Stream
    + Portfolio
    + Settings
    + Grades
    + Calender
# Version 2 Checklist
+ [x] Get Nextjs setup
  + [x] scss
  + [x] typescript
+ [ ] Get gulp setup
  + [x] Copy Manifest
  + [x] Modify Manifest web assets so hey include the assets from our Nextjs app
  + [ ] Get nextjs working from gulp
  + [x] Gulp typescript compile Background
  + [x] Gulp lint
+ [ ] Start Building
  + [x] Plan A Content Graph
    + [x] Routes
    + [x] Information Per Page
  + [ ] Design in figma
    + [x] Color Pallette
    + [ ] Components
      + [ ] Global
        + [ ] Aside
        + [x] NavBar
          + [x] Search Bar
          + [ ] Notification Area
      + [ ] Classes Page
        + [ ] Classes
      + [ ] Stream
        + [ ] General Stream Card
          + [ ] File Picker
            + [ ] Google Picker
          + [ ] File Preview
          + [ ] Text Boxes
          + [ ] Rubrics
          + [ ] General Markdown
    + [ ] Styles
      + [ ] Typography
      + [ ] Theme's
      + [ ] Common Effects
      + [ ] Common css
      + [ ] convert common styles to mixins
      + [ ] Create an scss mixin file for common styles
  + [ ] Build D2L API class
    + [ ] Look into https://swr.vercel.app/ for faster requests
    + [ ] Routes
    + [ ] Auth
    + [ ] Types
  + [ ] Build figma Components in tsx along with scss
  + [ ] Handle Routing So it reflects actual d2l routing allowing state to be kept between when the extension is enabled and disabled.
    + [ ] Create a dynamic router that can handle page changing along with handle the history push api for faster loading.
  + [ ] Bring it all together to make the application.
  + [ ] Add Better integration with google products like doc's
  + [ ] Testing Time
  + [ ] Add a github push update
  + [ ] Optimizations To Extension
    + [x] nextJS Optimizations
    + [ ] switch from webRequest API to the declarativeNetRequest API, allowing for much faster request handling
    + [ ] Find a way to load the main page faster and prevent the errors from the original d2l content
+ [x] Stop chrome from closing my tabs when i refresh the extension
+ [x] Fix our output html file links to account for the fact this is a chrome extension