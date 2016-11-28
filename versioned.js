import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const versionsSchema = new SimpleSchema({
  _deleted: {
    type: Boolean,
    optional: true,
  },
  _command:{
    type: String,
  },
  _stamp: {
    type: Object,
  },
  '_stamp.version': {
    type: Number,
    min: 1,
  },
  '_stamp.publishedVersion': {
    type: Number,
    min: 0,
  },
  '_stamp.userId': {
    type: String,
  },
  '_stamp.time': {
    type: Date,
  }
})

Meteor.Collection.prototype.versioned = function(args) {
  const collection = this;
  const options = args || {};
  const versionsCollection = new Meteor.Collection(collection._name + '.versions');

  const add = (collection) => {
    collection.schema = new SimpleSchema([collection.schema, versionsSchema]);

    collection.before.insert(function(userId, doc) {
      doc._stamp = updateStamp(doc._stamp, userId);
    });

    collection.before.update(function(userId, doc, fieldNames, modifier, options) {
      modifier.$set._stamp = updateStamp(doc._stamp, userId);
      if (modifier.$set._command) {
        switch(modifier.$set._command) {
          case 'publish':
            modifier.$set._stamp.publishedVersion = modifier.$set._stamp.version;
            break;
          case 'unpublish':
            modifier.$set._stamp.publishedVersion = 0;
            break;
        }
        delete modifier.$set._command;
      }
    });

    collection.after.insert(function(userId, doc) {
      const newDoc = { ...doc, ref: doc._id };
      delete newDoc._id;
      versionsCollection.insert(newDoc);
    });

    collection.after.update(function(userId, doc, fieldNames, modifier, options) {
      const newDoc = { ...doc, ref: doc._id };
      delete newDoc._id;
      versionsCollection.insert(newDoc);
    });

    /**
     *  helper function to retreive versions
     */
    collection.helpers({
      versions() {
        return versionsCollection.find(
          { ref: this._id },
          { sort: { stamp: { version: -1 } } }
        );
      },
      delete() {
        collection.update(this._id, {$set: { _deleted: true } });
      },
      undelete() {
        collection.update(this._id, {$set: { _deleted: false } });
      },
      publish() {
        collection.update(this._id, {
          $set: { _command: 'publish' }
        });
      },
      unpublish() {
        collection.update(this._id, {
          $set: { _command: 'unpublish' }
        });
      }
    });
  }
  /**
   *  getter for versionsCollection
   */
  this.getVersionsCollection = () => versionsCollection;

  const updateStamp = (stamp, userId) => {
    const newStamp = Object.assign(
      {
        version: 0,
        publishedVersion: 0,
        time: new Date(),
      },
      stamp || {}
    );
    newStamp.version = newStamp.version + 1;
    newStamp.userId = userId || 'anonymous';
    return newStamp;
  }

  if(typeof(collection) !== 'undefined' && collection !== null)
    add(collection);

  return collection;
}
