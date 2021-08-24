import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import CustomRow from '../components/CustomRow';

import * as firebase from 'firebase';

const auth = firebase.auth();
const dbRef = firebase.database().ref();

const Home = () => {

  const [userId, setuserId] = React.useState(null);
  const [userStoreIds, setuserstoresids] = React.useState(null);
  const [stores, setstores] = React.useState(null);
  const [userStores, setuserstores] = React.useState([]);

  const selectionOfStores = async() =>{
    userStoreIds.forEach(element => {
      setuserstores((arr)=>[...arr,stores.element]);
    });
    console.log(userStores);
  }

  useEffect(() => {
    try {
      async () => {
        const user = await auth.currentUser;
        const uid = user.uid;
        
        await dbRef.child("mapping").child(uid).get().then((snapshot) => {
          if (snapshot.exists()) {
            //console.log(snapshot.val());
            setuserId(snapshot.val());
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error("4" + error);
        })

        await dbRef.child("users").child(userId).child("stores").get().then((snapshot) => {
          if (snapshot.exists()) {
            //console.log(snapshot.val());
            setuserstoresids(snapshot.val());
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error("1" + error);
        })

        await dbRef.child("stores").get().then((snapshot) => {
          if (snapshot.exists()) {
            //console.log(snapshot.val());
            setstores(snapshot.val());
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error("2" + error);
        });
        
        selectionOfStores();
        console.log(userStores);
      }
    } catch (error) {
      console.log("3" + error.message);
    }
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text>
        Hello!!
      </Text>
    </View>
  );
}

export default Home;