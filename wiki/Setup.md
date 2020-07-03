# Setup

## Local Testing
*npm install
*expo start

## Troubleshooting
*If npm gives you trouble, try deleting node_modules and running npm install again

*If you get the error message when running expo start:
`error Invalid regular expression: /(.*\\__fixtures__\\.*|node_modules[\\\]react[\\\]dist[\\\].*|website\\node_modules\\.*|heapCapture\\bundle\.js|.*\\__tests__\\.*)$/: Unterminated character class.`
*try the following:
`Got this issue today on windows, but don't need to downgrade node, just as discussed on stackoverflow just need to change some hashes on your project:

\node_modules\metro-config\src\defaults\blacklist.js

var sharedBlacklist = [
  /node_modules[/\\]react[/\\]dist[/\\].*/,
  /website\/node_modules\/.*/,
  /heapCapture\/bundle\.js/,
  /.*\/__tests__\/.*/
];
change to:

var sharedBlacklist = [
  /node_modules[\/\\]react[\/\\]dist[\/\\].*/,
  /website\/node_modules\/.*/,
  /heapCapture\/bundle\.js/,
  /.*\/__tests__\/.*/
];`