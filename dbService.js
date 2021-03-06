import PouchDB from "pouchdb-react-native";

PouchDB.plugin(require("pouchdb-find"));
// PouchDB.plugin(require("pouchdb-adapter-memory")); // uninstall pouchdb-adapter-memory if unused
PouchDB.plugin(require("pouchdb-upsert"));

let db = new PouchDB("database");

const destroyDB = async () => {
  try {
    return await db.destroy();
  } catch (error) {
    console.error("Error destroying database", error);
  }
};

const insert = async (doc) => {
  try {
    return await db.putIfNotExists(doc); // only inserts new document doesn't update it
  } catch (error) {
    console.error("Error inserting doc in database", { doc, error });
  }
};

const upsert = async (doc) => {
  try {
    return await db.put(doc);
  } catch (error) {
    console.error("Error upserting doc in database", { doc, error });
    return await db.put(doc);
  }
};

const findByID = async (id) => {
  try {
    return await db.get(id);
  } catch (error) {
    console.error("Error finding doc by id in database", { id, error });
  }
};

const deleteByID = async (id) => {
  try {
    const doc = await findByID(id);
    return await db.remove(doc);
  } catch (error) {
    console.error("Error deleting doc by id in database", { id, error });
  }
};

const softDeleteByID = async (id) => {
  try {
    const doc = await findByID(id);
    return await db.put({ ...doc, _deleted: true });
  } catch (error) {
    console.error("Error soft deleting doc by id in database", { id, error });
  }
};

const getAllDocuments = async () => {
  try {
    return await db.allDocs();
  } catch (e) {
    console.error("Error getting all documents", e);
  }
};

const findByFilter = async (filter) => {
  try {
    return await db.find({ selector: filter });
  } catch (e) {
    console.error("Error finiding docs with filter documents", {
      error: e,
      filter,
    });
  }
};

const clearDB = async () => {
  try {
    await destroyDB();
    db = new PouchDB("database");
    return true;
  } catch (e) {
    console.error("Error clearing database", e);
  }
};

export {
  db,
  destroyDB,
  insert,
  upsert,
  findByID,
  deleteByID,
  softDeleteByID,
  getAllDocuments,
  findByFilter,
  clearDB,
};
