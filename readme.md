# Using grunt and webpack to build a React app

This template uses grunt to call webpack and build a React app that's written in TypeScript, uses JSX, and has SASS stylesheets.

It's only designed for a production build. I recommend the [React developer tools extension for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?utm_source=chrome-app-launcher-info-dialog) so you can see what the heck is going on.

Next up is source maps and a hot-swap development build, but this was a lot of trouble to get working as it is.

Much thanks to Wes at [CodeMentor](https://www.codementor.io/) for getting me up to speed with webpack. Turns out it isn't actually `grunt` reskinned, it's more of a single-purpose React builder.

## Usage

`git clone https://github.com/jordanroher/jordan-react-template`

`cd jordan-react-template`

`npm install` or `sudo npm install` on Mac

`grunt`