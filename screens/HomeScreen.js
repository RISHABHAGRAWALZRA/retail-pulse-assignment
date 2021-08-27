import React, { useEffect } from 'react';
import { ActivityIndicator, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import StoreList from './StoresList';

import * as firebase from 'firebase';

const auth = firebase.auth();
const dbRef = firebase.database().ref();

const Home = ({ route, navigation }) => {

  const { userId } = route.params;
  const [userStoreIds, setuserstoresids] = React.useState(null);
  const [stores, setstores] = React.useState(null);

  const fetchData = async () => {
    try {
      //console.log(userId);
      const userStoresSnap = await dbRef.child("users").child(userId).child('stores').get();
      setuserstoresids(userStoresSnap.val());
      //console.log(stores);
      //console.log(userStoreIds);
    } catch (error) {
      console.error("5" + error.message);
    }
  }

  useEffect(() => {
    try {
      fetchData();
      dbRef.child("stores").get().then((snapshot) => {
        if (snapshot.exists()) {
          //console.log(snapshot.val());
          setstores(snapshot.val());
        } else {
          console.log("3No data available");
        }
      });

    } catch (error) {
      console.log("4" + error.message);
    }

  }, [])


  if (stores && userStoreIds) {
    console.log("Happing");
    return (
      <View>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <StoreList userId={userId} userStoreIds={userStoreIds} stores={stores} navigation = {navigation}/>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ActivityIndicator size="large" color="#6c6c6c" />
      </View>
    );
  }

}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
});