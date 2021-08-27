import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

const LeftContent = (props) => {
    return (
        <View>
            <Text>{props.route}</Text>
            <Text>{props.type}</Text>
        </View>
    );
};



const CustomCardRow = ({userId, item, navigation }) => {

    return (
        <Card style={styles.container} onPress={() => {navigation.navigate('upload', {item : item, userId: userId})}}>
            <Card.Title title={item.route} subtitle={item.type} />
            <Card.Content>
                <Title>{item.name}</Title>
                <Paragraph>{item.area}</Paragraph>
            </Card.Content>
        </Card>
    );
};

export default CustomCardRow;

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
});