// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by versioned.js.
import { name as packageName } from "meteor/sakulstra:versioned";

// Write your tests here!
// Here is an example.
Tinytest.add('versioned - example', function (test) {
  test.equal(packageName, "versioned");
});
