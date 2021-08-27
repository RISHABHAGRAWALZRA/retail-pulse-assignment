import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Image, ActivityIndicator, ToastAndroid } from 'react-native';
import { Button, Card } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import * as FileSystem from 'expo-file-system';

const storageRef = firebase.storage().ref();

/* function dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);

        // create a view into the buffer
        var ia = new Uint8Array(ab);

        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], { type: mimeString });
        return blob;

    } */

/* const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const atob= (string) => {
    let str = string.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
        throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (let bc = 0, bs = 0, buffer, i = 0;
        buffer = str.charAt(i++);

        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
            bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
        buffer = chars.indexOf(buffer);
    }

    return output;
} */

/* function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
} */

//const base64 = await FileSystem.readAsStringAsync(element.uri, { encoding: 'base64' });


const UploadScreen = ({ route, navigation }) => {
    const { item, userId } = route.params;
    const [pickedImage, setpickedimage] = React.useState([]);


    const showToast = (str) => {
        ToastAndroid.showWithGravityAndOffset(
            str,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
    };

    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync;

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.uri != null) {
            setpickedimage(pick => pickedImage.concat(pickerResult));
        } else {
            showToast("Nothing Selected");
        }
        //console.log(pickerResult);
    };



    const uploadImageOnFirebase = async () => {
        const promises = [];
        console.log("Hap");
        pickedImage.map((element) => {
            const today = new Date();
            const imagename = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + '_' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function () {
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', element.uri, true);
                xhr.send(null);
            });

            // Create the file metadata
            var metadata = {
                contentType: 'image/png'
            };

            // Upload file and metadata to the object 'images/mountains.jpg'
            var uploadTask = storageRef.child('/images/' + userId + '/' + imagename + '.png').put(blob, metadata);
            promises.push(uploadTask);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    blob.close();
                    switch (error.code) {
                        case 'storage/unauthorized':
                            break;
                        case 'storage/canceled':
                            break;
                        case 'storage/unknown':
                            break;
                    }
                },
                async () => {
                    // Upload completed successfully, now we can get the download URL
                    await uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        console.log('File available at', downloadURL);
                    });
                }
            );
        });

        Promise.all(promises)
            .then(() => {
                alert("All images uploaded");
                setpickedimage([]);
            })
            .catch((err) => console.log(err));
    }

    return (
        <View style={styles.container} >
            <View style={styles.detail}>
                <Text>Name: {item.name}</Text>
                <Text>Type: {item.type}</Text>
                <Text>Area: {item.area}</Text>
                <Text>Route: {item.route}</Text>
                <Text style={{ textAlign: 'center', }}>Address: {item.address}</Text>
            </View>
            <View style={styles.imagecontainer}>
                <FlatList
                    numColumns={2}
                    data={pickedImage}
                    renderItem={({ item, index }) => (<Card style={styles.imagesubcontainer}>
                        <Card.Cover style={styles.image} source={{ uri: item.uri }} />
                    </Card>)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button style={styles.button} color="#f8ff00" icon="camera" mode="contained" onPress={openImagePickerAsync}>
                    Pick Image
                </Button>
                <Button style={styles.button} color="#5baf93" icon="upload" mode="contained" onPress={uploadImageOnFirebase}>
                    Upload Image
                </Button>
            </View>
        </View>
    );
};

export default UploadScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        margin: 10,
        backgroundColor: '#dcfffe',
        borderRadius: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    imagecontainer: {
        margin: 20,
        alignItems: 'center',
        backgroundColor: '#ffc8c8',
        height: 470,
        width: 300,
    },
    imagesubcontainer: {
        margin: 10,
    },
    image: {
        height: 120,
        width: 120,
    },
    detail: {
        backgroundColor: '#b9f193',
        margin: 20,
        alignItems: 'center',
    },
    buttonContainer: {
        alignItems: 'baseline',
        flexDirection: 'row',
        backgroundColor: '#b9f193',
        margin: 10,
        padding: 10,
    },
    button: {
        margin: 5,
    }
});


