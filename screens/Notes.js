import React from 'react';
import { View, Text , StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Notes = () =>{
    return(
        <View style={styles.wrapper}>
            <Text style={styles.label}>Notes</Text>
            <Text style={{marginLeft:10,marginTop:6}}>Manage Your Notes</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper:{
        flex:1,
        backgroundColor:'white'
    },
    label:{
        fontSize:24,
        color:"black",
        marginTop:10,
        marginLeft:10
    }
});


export default Notes;