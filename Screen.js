import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { v4 as uuid } from "uuid";
import { Feather } from "@expo/vector-icons";

import {
  clearDB,
  deleteByID,
  findByFilter,
  insert,
  softDeleteByID,
} from "./dbService";

const Screen = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const randomlyAddToDB = async () => {
    try {
      setLoading(true);
      const _id = uuid();
      const title = _id.split("-")[0];
      const created = moment().toISOString();
      const type = "DOC";
      const doc = { _id, title, type, created };
      await insert(doc);
      setLoading(false);
      await init();
    } catch (e) {
      setLoading(false);
      console.error("Erroradding data to db", e);
    }
  };

  const deleteFromDB = async () => {
    try {
      setLoading(true);
      await clearDB();
      setLoading(false);
      await init();
    } catch (e) {
      setLoading(false);
      console.error("Error deleting everything from db", e);
    }
  };
  const init = async () => {
    try {
      setLoading(true);
      const docs = await findByFilter({ type: "DOC" });
      if (docs?.docs) setList(docs?.docs);
      else setList([]);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error("Error getting data from db", e);
    }
  };

  const softDeleteItem = async (item) => {
    try {
      setLoading(true);
      await softDeleteByID(item._id);
      setLoading(false);
      await init();
    } catch (e) {
      setLoading(false);
      console.error("Error getting data from db", e);
    }
  };

  const deleteDocForever = async (item) => {
    try {
      setLoading(true);
      await deleteByID(item._id);
      setLoading(false);
      await init();
    } catch (e) {
      setLoading(false);
      console.error("Error getting data from db", e);
    }
  };

  const hardDeleteItem = (item) => {
    Alert.alert(
      "Permanently delete item",
      "Are you sure you want to delete it?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Delete It!", onPress: () => deleteDocForever(item) },
      ]
    );
  };

  return (
    <View
      style={{
        paddingHorizontal: 10,
        flex: 1,
        flexDirection: "column",
        width: "100%",
      }}
    >
      <View
        style={{ ...styles.center, justifyContent: "space-between", flex: 15 }}
      >
        <TouchableOpacity
          onPress={randomlyAddToDB}
          style={{ ...styles.button }}
        >
          <Text style={{ ...styles.buttonText }}>Add to DB</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteFromDB} style={{ ...styles.button }}>
          <Text style={{ ...styles.buttonText }}>Delete Everything</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 85, ...styles.border, marginBottom: 10 }}>
        <ScrollView>
          {loading ? (
            <Loading />
          ) : list.length > 0 ? (
            list.map((item) => (
              <ListItem
                item={item}
                key={item._id}
                softDeleteItem={softDeleteItem}
                hardDeleteItem={hardDeleteItem}
              />
            ))
          ) : (
            <Empty />
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const Empty = () => (
  <View style={{ ...styles.center, paddingVertical: 20 }}>
    <Text>List is empty</Text>
  </View>
);

const Loading = () => (
  <View style={{ ...styles.center, paddingVertical: 20 }}>
    <ActivityIndicator color="#000" />
  </View>
);

const ListItem = ({ item, softDeleteItem, hardDeleteItem }) => (
  <View style={{ ...styles.listItem }}>
    <Text style={{ fontSize: 20 }}>{item.title}</Text>
    <TouchableOpacity
      onPress={() => softDeleteItem(item)}
      onLongPress={() => hardDeleteItem(item)}
    >
      <Feather name="trash-2" size={24} color="red" />
    </TouchableOpacity>
  </View>
);

export default Screen;

const styles = StyleSheet.create({
  center: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  border: {
    borderColor: "#000",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 10,
  },
  buttonText: {
    color: "#fff",
  },
  listItem: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
