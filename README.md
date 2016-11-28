### What this is
At 28.11 we introduce the first version of 'versioning'. Versioning basically means that we from now on have the theoretical opportunity to monitor **who** changed **what** at a certain point of **time**. This update also introduces **soft deletes**. Every versioned database entry can now be 'soft deleted'. Meaning it actually stays in the database and a delete flag is set. In case someone wants to revert a delete one can do so be settig the delete flag to true again. As we only store textual data in the database it won't grow really fast, if we face space/performance problems caused by this, we could think about removing soft deleted entries after a given time frame.

### Database
Each collection gets it's own `.versions` collection. So e.g. for `songs` we'll now have an additional `songs.versions` collection.
The versions collection always contains the most up to date version of the data, but all the older versions too.
That means, that the version in `songs` always equals the newest version in `songs.versions` collection.

### Data structure in collection
```js
{
  ...doc,                                                               // actual data e.g. data for a song
  _deleted: boolean,                                                    // true if soft deleted
  _stamp: {
    version: number,                                                    // the version of this document
    publishedVersion: number,                                           // represents the currently published version
    userId: uuid || 'anonymous',
    time: Timestamp,
  },
}
```

### Data structure in collection.versions
```js
{
  ...doc,               // the complete collection doc, except _id
  _ref: doc._id         // reference to the original document in collection
}
```
### Usage

## Attaching the versioned bahavior
To make a collection versioned, you simply have to call `collection.versioned()`.
