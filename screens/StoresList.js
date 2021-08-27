import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Searchbar, Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

import CustomCardRow from "../components/CustomCardRow";
import BottomFilter from '../components/BottomFilterSheet';

const StoreList = ({userId, userStoreIds, stores, navigation }) => {
  const [storeList, setstorelist] = React.useState([]);
  const [userStores, setuserstores] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState('name');


  const onChangeSearch = (query) => {
    setSearchQuery(query);
    let data = userStores.filter((item) => {
      return item[selectedFilter].toLowerCase().includes(query.toLowerCase());
    });
    setstorelist(data);
    //console.log(data);
    //console.log(userStores==null);
  }

  const selcetionOfStores = () => {
    let data = [];
    userStoreIds.forEach(element => {
      data.push(stores[element]);
    });
    setuserstores(data);
    setstorelist(data);
    //console.log(data);
  }

  useEffect(() => {
    selcetionOfStores();
  }, [])


  return (
    <View>
      <View style={styles.topbar}>
        <Picker
          selectedValue={selectedFilter}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedFilter(itemValue)
          }>
          <Picker.Item label="Type" value="type" />
          <Picker.Item label="Route" value="route" />
          <Picker.Item label="Name" value='name' />
        </Picker>
        <View style={styles.space} />

        <Searchbar
          style={styles.seachbar}
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
      </View>
      <View>
        <FlatList
          data={storeList}
          renderItem={({ item, index }) => <CustomCardRow
            userId = {userId}
            item={item}
            navigation = {navigation}
          />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  topbar: {
    marginTop: 10,
    margin: 5,
  },
  picker: {
    borderColor: '#000',
  },
  space: {
    width: 20, // or whatever size you need
    height: 10,
  },
});


export default StoreList;